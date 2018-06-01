import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MessageCallback, ErrorCallback } from './../../base/Callback';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';

@Component({
    templateUrl: 'iCABSAContractHistoryDetail.html'
})

export class ContractHistoryDetailComponent extends BaseComponent implements OnInit, OnDestroy, MessageCallback, ErrorCallback {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;

    public pageId: string = '';
    public search: URLSearchParams = new URLSearchParams();
    public inputParams: any = {};
    public cExchangeParentMode: any = '';
    public contractnumberDetails: any = {};
    public errorMessage: string;
    public branchNumber: any;
    public messageContentError: string = MessageConstant.Message.noRecordFound;
    public contractTypeTexts: any = {
        title: 'Contract History Detail',
        label: 'Contract Number'
    };
    public fieldsVisibility: any = {
        account: false,
        premise: false,
        product: false
    };

    public controls: any[] = [
        { name: 'ContractNumber', disabled: true, type: MntConst.eTypeCode },
        { name: 'ContractName', disabled: true, type: MntConst.eTypeText },
        { name: 'AccountNumber', disabled: true, type: MntConst.eTypeCode },
        { name: 'AccountName', disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductCode', disabled: true, type: MntConst.eTypeCode },
        { name: 'ProductDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'ContractHistoryNarrative', disabled: true, type: MntConst.eTypeText }
    ];

    public muleConfig = {
        method: 'contract-management/grid',
        module: 'contract',
        operation: 'Application/iCABSAContractHistoryDetail'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACONTRACTHISTORYDETAIL;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    };

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };

    public windowOnload(): void {
        this.cExchangeParentMode = this.parentMode;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        switch (this.riExchange.getCurrentContractType()) {
            case 'C':
                this.contractTypeTexts.title = 'Contract History Detail';
                this.contractTypeTexts.label = 'Contract Number';
                break;
            case 'J':
                this.contractTypeTexts.title = 'Job History Detail';
                this.contractTypeTexts.label = 'Job Number';
                break;
            case 'P':
                this.contractTypeTexts.title = 'Product Sales History Detail';
                this.contractTypeTexts.label = 'Product Sales Number';
                break;
        };

        this.setControlValue('ContractNumber', this.riExchange.getParentAttributeValue('ContractNumber'));
        if (this.riExchange.getParentAttributeValue('AccountNumber')) {
            this.setControlValue('AccountNumber', this.riExchange.getParentAttributeValue('AccountNumber'));
            this.fieldsVisibility.account = true;
        }
        this.getContractHistoryDetails(this.riExchange.getParentAttributeValue('ContractHistoryRowID'));
    };

    private getContractHistoryDetails(rowId: any): void {
        let queryPost: URLSearchParams = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '0');
        queryPost.set(this.serviceConstants.BusinessCode, this.businessCode());
        queryPost.set(this.serviceConstants.ContractNumber, this.getControlValue('ContractNumber'));
        queryPost.set('ROWID', rowId);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryPost)
            .subscribe(
            (data) => {
                if (data.status === 'failure') {
                    this.showErrorModal(data.oResponse);
                } else {
                    if (data.errorMessage && data.errorMessage !== '') {
                        this.showErrorModal(data);
                    } else {
                        this.setControlValue('ContractNumber', data.ContractNumber);
                        this.setControlValue('ContractHistoryNumber', data.ContractHistoryNumber);
                        this.setControlValue('PremiseNumber', data.PremiseNumber);
                        this.setControlValue('ProductCode', data.ProductCode);
                        this.setControlValue('ContractHistoryNarrative', data.ContractHistoryNarrative);
                        if (data.PremiseNumber)
                            this.fieldsVisibility.premise = true;
                        if (data.ProductCode)
                            this.fieldsVisibility.product = true;

                        this.lookupRest();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };

    private lookupRest(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookup_details = [{
            'table': 'Contract',
            'query': {
                'BusinessCode': this.businessCode(),
                'ContractNumber': this.getControlValue('ContractNumber')
            },
            'fields': ['ContractName']
        }, {
            'table': 'Premise',
            'query': {
                'BusinessCode': this.businessCode(),
                'ContractNumber': this.getControlValue('ContractNumber'),
                'PremiseNumber': this.getControlValue('PremiseNumber')
            },
            'fields': ['PremiseName']
        }, {
            'table': 'Account',
            'query': {
                'BusinessCode': this.businessCode(),
                'AccountNumber': this.getControlValue('AccountNumber')
            },
            'fields': ['AccountName']
        }, {
            'table': 'Product',
            'query': {
                'BusinessCode': this.businessCode(),
                'ProductCode': this.getControlValue('ProductCode')
            },
            'fields': ['ProductDesc']
        }];

        this.LookUp.lookUpRecord(lookup_details).subscribe((data) => {
            if (data.length > 0) {
                let contractData = data[0];
                let premiseData = data[1];
                let accountData = data[2];
                let productData = data[3];

                if (contractData.length > 0) {
                    this.setControlValue('ContractName', contractData[0].ContractName);
                }
                if (premiseData.length > 0) {
                    this.setControlValue('PremiseName', premiseData[0].PremiseName);
                }
                if (accountData.length > 0) {
                    this.setControlValue('AccountName', accountData[0].AccountName);
                }
                if (productData.length > 0) {
                    this.setControlValue('ProductDesc', productData[0].ProductDesc);
                }
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    };
}
