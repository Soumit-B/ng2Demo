import { OnInit, Injector, Component, OnDestroy, AfterViewInit, ViewChild, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ContractSearchComponent } from './../search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../search/iCABSAServiceCoverSearch';

@Component({
    templateUrl: 'iCABSAServiceCoverSuspendMaintenance.html'
})

export class AServiceCoverSuspendMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    private invoiceSuspendText: string;
    private queryParams: Object = {
        operation: 'Application/iCABSAServiceCoverSuspendMaintenance',
        module: 'suspension',
        method: 'people/maintenance'
    };

    public pageId: string = '';
    public numberLabel: string;
    public ellipsis: any = {
        contract: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Lookup',
                'currentContractType': '',
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ContractSearchComponent,
            showHeader: true,
            disabled: false
        },
        premises: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'CurrentContractType': '',
                'ContractNumber': '',
                'ContractName': '',
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: PremiseSearchComponent,
            showHeader: true,
            disabled: false
        },
        product: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Lookup',
                'ContractNumber': '',
                'ContractName': '',
                'PremiseNumber': '',
                'PremiseName': '',
                'CurrentContractTypeURLParameter ': '',
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ServiceCoverSearchComponent,
            showHeader: true,
            disabled: false
        }
    };
    public controls: Array<Object> = [
        { name: 'ContractNumber', required: true, type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ContractName', required: true, disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseNumber', required: true, disabled: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductCode', required: true, disabled: true, type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ProductDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'Status', disabled: true, type: MntConst.eTypeText },
        { name: 'ServiceVisitFrequency', disabled: true, type: MntConst.eTypeInteger },
        { name: 'ServiceAnnualValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'ServiceQuantity', disabled: true, type: MntConst.eTypeInteger },
        { name: 'ServiceCommenceDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'InvoiceSuspendInd', disabled: true, type: MntConst.eTypeCheckBox },
        { name: 'InvoiceSuspendText', disabled: true, type: MntConst.eTypeText },
        { name: 'ServiceCoverRowID' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERSUSPENDMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngAfterViewInit(): void {
        this.pageTitle = this.riExchange.getCurrentContractTypeLabel() + ' Service Cover Invoice Suspend Maintenance';
        this.numberLabel = this.riExchange.getCurrentContractTypeLabel() + ' Number';
        this.utils.setTitle(this.pageTitle);
        this.ellipsis.contract.childConfigParams.currentContractType = this.riExchange.getCurrentContractType();
        this.ellipsis.premises.childConfigParams.CurrentContractType = this.ellipsis.contract.childConfigParams.currentContractType;
        this.ellipsis.product.childConfigParams.CurrentContractTypeURLParameter = '<' + this.riExchange.getCurrentContractTypeLabel() + '>';
        this.pageParams.isSaveCancelEnable = true;
        this.doLookupformData();
        if (!this.getControlValue('ContractNumber'))
            this.ellipsis.contract.autoOpen = true;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private fetchRecord(): void {
        if (this.getControlValue('ProductCode') && this.getControlValue('PremiseNumber') && this.getControlValue('ContractNumber')) {
            let searchParams: URLSearchParams = new URLSearchParams();

            searchParams = this.getURLSearchParamObject();
            searchParams.set(this.serviceConstants.Action, '0');
            searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
            searchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
            searchParams.set('ProductCode', this.getControlValue('ProductCode'));
            searchParams.set('ROWID', this.getControlValue('ServiceCoverRowID'));
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError)
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    else {
                        if (data.findResult === '<Single>') {
                            let serviceCommenceDate: string;

                            serviceCommenceDate = this.globalize.parseDateToFixedFormat(data.ServiceCommenceDate).toString();
                            this.setControlValue('ServiceCommenceDate', this.globalize.parseDateStringToDate(serviceCommenceDate));
                            this.setControlValue('ServiceVisitFrequency', data.ServiceVisitFrequency);
                            this.setControlValue('ServiceAnnualValue', data.ServiceAnnualValue);
                            this.setControlValue('ServiceQuantity', data.ServiceQuantity);
                            this.setControlValue('InvoiceSuspendInd', data.InvoiceSuspendInd);
                            this.setControlValue('InvoiceSuspendText', data.InvoiceSuspendText);
                            this.setControlValue('ServiceCoverRowID', data.ttServiceCover);
                            this.invoiceSuspendText = data.InvoiceSuspendText;
                            this.getStatus();
                            this.checkSuspendInvoice();
                            this.disableControl('ContractNumber', true);
                            this.disableControl('ContractName', true);
                            this.disableControl('PremiseNumber', true);
                            this.disableControl('PremiseName', true);
                            this.disableControl('ProductCode', true);
                            this.disableControl('ProductDesc', true);
                            this.pageParams.isSaveCancelEnable = false;
                        }
                        if (data.findResult === '<Multi>')
                            this.ellipsis.product.autoOpen = true;
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                }
                );
        }
    }

    private getStatus(): void {
        let searchParams: URLSearchParams = new URLSearchParams(), postParams: Object = {};

        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '6');
        searchParams.set('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
        postParams['Function'] = 'GetStatus';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams, postParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.setControlValue('Status', data.Status);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

    private checkContractType(): void {
        if (this.getControlValue('ContractNumber')) {
            let searchParams: URLSearchParams = new URLSearchParams(), postParams: Object = {};

            searchParams = this.getURLSearchParamObject();
            searchParams.set(this.serviceConstants.Action, '6');
            searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
            searchParams.set('ContractTypeCode', this.riExchange.getCurrentContractType());
            postParams['Function'] = 'CheckContractType';
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams, postParams).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError)
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    else {
                        if (this.getControlValue('ContractNumber') !== '')
                            this.setControlValue('ContractNumber', this.getControlValue('ContractNumber'));
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                }
            );
        }
    }

    private promptConfirmSave(): void {
        let searchParams: URLSearchParams = new URLSearchParams(), formdata: Object = {};

        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '2');
        formdata = {
            ServiceCoverROWID: this.getControlValue('ServiceCoverRowID'),
            ContractNumber: this.getControlValue('ContractNumber'),
            PremiseNumber: this.getControlValue('PremiseNumber'),
            PremiseName: this.getControlValue('PremiseName'),
            ServiceVisitFrequency: this.getControlValue('ServiceVisitFrequency'),
            ServiceAnnualValue: this.getControlValue('ServiceAnnualValue'),
            ServiceQuantity: this.getControlValue('ServiceQuantity'),
            ServiceCommenceDate: this.getControlValue('ServiceCommenceDate'),
            InvoiceSuspendInd: this.utils.convertCheckboxValueToRequestValue(this.getControlValue('InvoiceSuspendInd')),
            InvoiceSuspendText: this.getControlValue('InvoiceSuspendText')
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams, formdata).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                    this.formPristine();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

    private doLookupformData(): void {
        let lookupIP: Array<any>;

        lookupIP = [{
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
            'table': 'Product',
            'query': {
                'BusinessCode': this.businessCode(),
                'ProductCode': this.getControlValue('ProductCode')
            },
            'fields': ['ProductDesc']
        }];

        this.LookUp.lookUpPromise(lookupIP).then(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    if (data && data.length > 0) {
                        if (data[0] && data[0].length > 0) {
                            this.setControlValue('ContractName', data[0][0].ContractName || '');
                        }
                        if (data[1] && data[1].length > 0) {
                            this.setControlValue('PremiseName', data[1][0].PremiseName || '');
                        }
                        if (data[2] && data[2].length > 0) {
                            this.setControlValue('ProductDesc', data[2][0].ProductDesc || '');
                        }
                        this.updateEllipsisConfig();
                    }
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private updateEllipsisConfig(): void {
        this.ellipsis.premises.childConfigParams.ContractNumber = this.getControlValue('ContractNumber') || '';
        this.ellipsis.premises.childConfigParams.ContractName = this.getControlValue('ContractName') || '';
        this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber') || '';
        this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName') || '';
        this.ellipsis.product.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber') || '';
        this.ellipsis.product.childConfigParams.PremiseName = this.getControlValue('PremiseName') || '';
        this.ellipsis.premises.childConfigParams.CurrentContractType = this.ellipsis.contract.childConfigParams.currentContractType;
        this.ellipsis.product.childConfigParams.CurrentContractTypeURLParameter = '<' + this.riExchange.getCurrentContractTypeLabel() + '>';
    }

    public ellipsisData(data: any, cntrlName: string): void {
        if (data) {
            switch (cntrlName) {
                case 'ContractNumber':
                    this.setControlValue('ContractNumber', data.ContractNumber);
                    this.setControlValue('ContractName', data.ContractName);
                    this.disableControl('PremiseNumber', false);
                    this.checkContractType();
                    break;
                case 'PremiseNumber':
                    this.setControlValue('PremiseNumber', data.PremiseNumber);
                    this.setControlValue('PremiseName', data.PremiseName);
                    this.disableControl('ProductCode', false);
                    break;
                case 'ProductCode':
                    this.setControlValue('ProductCode', data.ProductCode);
                    this.setControlValue('ProductDesc', data.ProductDesc);
                    this.setControlValue('ServiceCoverRowID', data.row.ttServiceCover);
                    this.fetchRecord();
                    break;
            }
            this.updateEllipsisConfig();
            this.doLookupformData();
        }
    }

    public onDataChange(data: any, target: string): void {
        if (event) {
            switch (target) {
                case 'ContractNumber':
                    this.uiForm.controls['ContractNumber'].markAsPristine();
                    if (!this.getControlValue('ContractNumber')) {
                        this.setControlValue('ContractName', '');
                        this.setControlValue('PremiseNumber', '');
                        this.setControlValue('PremiseName', '');
                        this.disableControl('PremiseNumber', true);
                        this.disableControl('ProductCode', true);
                    } else {
                        this.checkContractType();
                        this.doLookupformData();
                        this.disableControl('PremiseNumber', false);
                    }
                    break;
                case 'PremiseNumber':
                    this.uiForm.controls['PremiseNumber'].markAsPristine();
                    if (!this.getControlValue('ContractNumber')) {
                        this.setControlValue('PremiseNumber', '');
                        this.setControlValue('PremiseName', '');
                        this.setControlValue('ProductCode', '');
                        this.setControlValue('ProductDesc', '');
                    } else if (this.getControlValue('PremiseNumber')) {
                        this.doLookupformData();
                        this.disableControl('ProductCode', false);
                    } else {
                        this.setControlValue('PremiseName', '');
                        this.disableControl('ProductCode', true);
                    }
                    break;
                case 'ProductCode':
                    this.uiForm.controls['ProductCode'].markAsPristine();
                    if (!this.getControlValue('PremiseNumber')) {
                        this.setControlValue('PremiseNumber', '');
                        this.setControlValue('PremiseName', '');
                        this.setControlValue('ProductCode', '');
                        this.setControlValue('ProductDesc', '');
                    } else if (this.getControlValue('ProductCode')) {
                        this.fetchRecord();
                        this.doLookupformData();
                        this.disableControl('ProductCode', false);
                    } else {
                        this.disableControl('ProductCode', true);
                        this.setControlValue('ProductCode', '');
                        this.setControlValue('ProductDesc', '');
                    }
                    break;
            }
        }
    }

    public checkSuspendInvoice(): void {
        if (this.getControlValue('InvoiceSuspendInd') === true)
            this.disableControl('InvoiceSuspendText', false);
        else {
            this.disableControl('InvoiceSuspendText', true);
            this.setControlValue('InvoiceSuspendText', '');
        }
        this.disableControl('InvoiceSuspendInd', false);
    }

    public saveOnClick(): void {
        if (this.riExchange.validateForm(this.uiForm))
            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, '', this.promptConfirmSave.bind(this)));
    }

    public cancelOnClick(): void {
        if (this.getControlValue('ContractNumber')) {
            this.setControlValue('InvoiceSuspendText', this.invoiceSuspendText);
            this.fetchRecord();
        }
    }
}
