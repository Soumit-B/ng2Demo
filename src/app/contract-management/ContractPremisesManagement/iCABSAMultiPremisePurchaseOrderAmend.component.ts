import { Component, OnInit, OnDestroy, AfterViewInit, Injector, ViewChild, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { MessageCallback, ErrorCallback } from './../../base/Callback';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { CBBService } from './../../../shared/services/cbb.service';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';

@Component({
    templateUrl: 'iCABSAMultiPremisePurchaseOrderAmend.html'
})

export class MultiPremisePurchaseOrderAmendComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy, MessageCallback, ErrorCallback {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModalForSave') public promptModalForSave;

    public search: URLSearchParams = new URLSearchParams();
    public pageId: string = '';
    public promptTitleSave: string = '';
    public promptContentSave: string = MessageConstant.Message.ConfirmRecord;
    public messageContentSave: string = MessageConstant.Message.SavedSuccessfully;
    public errorMessage: string;
    public messageContentError: string = MessageConstant.Message.SaveError;
    public autoOpen: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    private chkChangeAllFlag: boolean = false;
    private fromPurchaseOrderNoRequired = true;
    private contractRowId: string = '';

    //Contract Search
    public contractSearchComponent = ContractSearchComponent;
    public inputParamsContractSearch: any = {
        'parentMode': 'LookUp-AccountMove'
    };

    public controls: any[] = [
        { name: 'ContractROWID' },
        { name: 'ContractNumber', disabled: false, required: true, type: MntConst.eTypeCode },
        { name: 'ContractName', disabled: true, required: true, type: MntConst.eTypeText },
        { name: 'AccountNumber', disabled: true, required: true, type: MntConst.eTypeText },
        { name: 'chkChangeAll', disabled: false },
        { name: 'FromPurchaseOrderNo', disabled: false, required: true, type: MntConst.eTypeTextFree },
        { name: 'ToPurchaseOrderNo', disabled: false, required: true, type: MntConst.eTypeTextFree }
    ];

    public muleConfig = {
        method: 'bill-to-cash/maintenance',
        module: 'payment',
        operation: 'Application/iCABSAMultiPremisePurchaseOrderAmend',
        action: '2'
    };

    public formModel: any = {};

    constructor(injector: Injector, private cbb: CBBService) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAMULTIPREMISEPURCHASEORDERAMEND;
        this.browserTitle = this.pageTitle = 'Purchase Order Number Amendment';
    };

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public ngAfterViewInit(): void {
        // Set message call back
        this.setMessageCallback(this);

        // Set error message call back
        this.setErrorCallback(this);

        this.setControlValue('chkChangeAll', false);
        this.autoOpen = true;
    };

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    };

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };

    public setContractNameAndAccountNumber(data: any): void {
        this.clearControlsOnContractNumberChange();
        this.setControlValue('ContractROWID', data.ttContract);
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('AccountNumber', data.AccountNumber);
        this.setControlValue('ContractName', data.ContractName);
        this.disableCBB(true);
    }

    public disableCBB(disable: boolean): void {
        setTimeout(() => {
            this.cbb.disableComponent(disable);
        }, 0);
    }

    // Loading Lookup service date based on change of Contract Number
    public onContractNumberChange(event: any): void {
        this.clearControlsOnContractNumberChange();
        if (!this.getControlValue('ContractNumber')) {
            this.disableCBB(false);
            return;
        }
        this.lookupContractNameAndAccountNumber();
    }

    // Toggling Change All Checkbox
    public toggleChangeAll(event: any): void {
        if (this.getControlValue('chkChangeAll')) {
            this.fromPurchaseOrderNoRequired = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'FromPurchaseOrderNo', true);
            this.riExchange.riInputElement.Enable(this.uiForm, 'FromPurchaseOrderNo');
        } else {
            this.fromPurchaseOrderNoRequired = false;
            this.setControlValue('FromPurchaseOrderNo', '');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'FromPurchaseOrderNo', false);
            this.riExchange.riInputElement.Disable(this.uiForm, 'FromPurchaseOrderNo');
        }
    }

    // Get Contract Name and Account Number through lookup service
    private lookupContractNameAndAccountNumber(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookup_details = [{
            'table': 'Contract',
            'query': {
                'BusinessCode': this.businessCode(),
                'ContractNumber': this.getControlValue('ContractNumber')
            },
            'fields': ['ContractName', 'AccountNumber']
        }];

        this.LookUp.lookUpRecord(lookup_details).subscribe((data) => {
            if (data.length > 0) {
                let contractData = data[0];
                if (contractData.length > 0) {
                    this.setControlValue('ContractROWID', contractData[0].ttContract);
                    this.setControlValue('ContractName', contractData[0].ContractName);
                    this.setControlValue('AccountNumber', contractData[0].AccountNumber);
                    this.disableCBB(true);
                } else {
                    this.disableCBB(false);
                }
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    };

    //save prompt
    public savePurchaseOrder(): void {
        if (this.riExchange.validateForm(this.uiForm))
            this.promptModalForSave.show();
    }

    //Cancel
    public cancelPurchaseOrder(): void {
        this.clearControls([
            'ContractNumber',
            'ContractName',
            'AccountNumber'
        ]);
        this.fromPurchaseOrderNoRequired = true;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'FromPurchaseOrderNo', true);
        this.riExchange.riInputElement.Enable(this.uiForm, 'FromPurchaseOrderNo');
    }

    private clearControlsOnContractNumberChange(): void {
        this.clearControls([
            'ContractNumber'
        ]);
        this.fromPurchaseOrderNoRequired = true;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'FromPurchaseOrderNo', true);
        this.riExchange.riInputElement.Enable(this.uiForm, 'FromPurchaseOrderNo');
    }

    // Implementation of save logic
    public promptContentSaveData(eventObj: any): void {
        let queryPost: URLSearchParams = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '2');
        let formdata = this.uiForm.getRawValue();
        formdata.chkChangeAll ? formdata.chkChangeAll = 'yes' : formdata.chkChangeAll = 'no';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.status === 'failure') {
                    this.showErrorModal(data.oResponse);
                } else {
                    if (data.errorMessage && data.errorMessage !== '') {
                        this.showErrorModal(data);
                    } else {
                        this.showMessageModal(data);
                        this.clearControlsOnContractNumberChange();
                        this.cancelPurchaseOrder();
                        this.disableCBB(false);
                        this.uiForm.reset();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public trimInputField(control: any): void {
        this.setControlValue(control, this.getControlValue(control).trim());
    }
}
