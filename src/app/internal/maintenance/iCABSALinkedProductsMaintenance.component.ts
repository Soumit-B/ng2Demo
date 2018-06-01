import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { URLSearchParams } from '@angular/http';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
@Component({
    templateUrl: 'iCABSALinkedProductsMaintenance.html'
})

export class LinkedProductsMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public tbLinkedProduct: boolean = false;
    public tbNormalDisp: boolean = false;
    public serviceCoverSearchComponent: any = ServiceCoverSearchComponent;
    public linkedEllipseOpen: boolean = false;
    public inputParams: any = {
        method: 'contract-management/maintenance',
        module: 'service-cover',
        operation: 'Application/iCABSALinkedProductsMaintenance'
    };
    public pageTitle: string = '';
    public promptContent: string;
    @ViewChild('promptModal') public promptConfirmModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public controls = [
        { name: 'ContractNumber', disabled: true },
        { name: 'ContractName', disabled: true },
        { name: 'PremiseNumber', disabled: true },
        { name: 'PremiseName', disabled: true },
        { name: 'ProductCode', disabled: true },
        { name: 'ProductDesc', disabled: true },
        { name: 'ServiceVisitFrequency', disabled: true },
        { name: 'ServiceCoverNumber', disabled: true },
        { name: 'ParentProductCode', disabled: true },
        { name: 'ParentProductDesc', disabled: true },
        { name: 'ParentServiceVisitFrequency', disabled: true },
        { name: 'ParentServiceCoverNumber', disabled: true },
        { name: 'ChildProductCode', disabled: true },
        { name: 'ChildProductDesc', disabled: true },
        { name: 'ChildServiceVisitFrequency', disabled: true },
        { name: 'ChildServiceCoverNumber', disabled: true },
        { name: 'LinkedProductCode', required: true },
        { name: 'LinkedProductDesc', disabled: true },
        { name: 'LinkedServiceVisitFreq', disabled: false },
        { name: 'LinkedServiceCoverNumber', disabled: true },
        { name: 'DispenserInd' },
        { name: 'ConsumableInd' },
        { name: 'BusinessCode' },
        { name: 'LinkedProductROWID' }
    ];
    public ellipsis = {
        ServiceCover: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LinkedSearch',
                ContractNumber: '',
                PremiseNumber: '',
                LinkedProductCode: '',
                ServiceCoverNumber: '',
                ProductCode: '',
                SCProductCode: '',
                DispenserInd: '',
                ConsumableInd: '',
                ContractName: '',
                PremiseName: ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: this.serviceCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSALINKEDPRODUCTSMAINTENANCE;
        this.pageTitle = this.browserTitle = 'Linked Products Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.setControlValue('BusinessCode', this.utils.getBusinessCode());
        this.riExchange.getParentHTMLValue('ContractNumber');
        this.riExchange.getParentHTMLValue('ContractName');
        this.riExchange.getParentHTMLValue('PremiseNumber');
        this.riExchange.getParentHTMLValue('PremiseName');
        this.riExchange.getParentHTMLValue('ProductCode');
        this.riExchange.getParentHTMLValue('ProductDesc');
        this.riExchange.getParentHTMLValue('ServiceCoverNumber');
        this.riExchange.getParentHTMLValue('ServiceVisitFrequency');
        this.riExchange.getParentHTMLValue('DispenserInd');
        this.riExchange.getParentHTMLValue('ConsumableInd');
        this.ellipsis.ServiceCover.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.ServiceCover.childConfigParams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.ServiceCover.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.ellipsis.ServiceCover.childConfigParams.PremiseName = this.getControlValue('PremiseName');
        this.ellipsis.ServiceCover.childConfigParams.ProductCode = this.getControlValue('ProductCode');
        this.ellipsis.ServiceCover.childConfigParams.ServiceCoverNumber = this.getControlValue('ServiceCoverNumber');
        this.setUiOnParentMode();
    }

    private setUiOnParentMode(): void {
        switch (this.parentMode) {
            case 'Add':
                this.tbLinkedProduct = true;
                this.riExchange.riInputElement.Enable(this.uiForm, 'LinkedProductCode');
                break;
            default:
                this.tbNormalDisp = true;
                this.setControlValue('ParentProductCode', this.riExchange.getParentAttributeValue('BusinessCodeParentProductCode'));
                this.setControlValue('ParentServiceCoverNumber', this.riExchange.getParentAttributeValue('BusinessCodeParentServiceCoverNumber'));
                this.setControlValue('ChildProductCode', this.riExchange.getParentAttributeValue('BusinessCodeChildProductCode'));
                this.setControlValue('ChildServiceCoverNumber', this.riExchange.getParentAttributeValue('BusinessCodeChildServiceCoverNumber'));
                this.ServiceCoverLookUpCall(this.getControlValue('ParentProductCode'), 'ParentServiceVisitFrequency', 'ParentServiceCoverNumber', 'ParentProductDesc');
                this.ServiceCoverLookUpCall(this.getControlValue('ChildProductCode'), 'ChildServiceVisitFrequency', 'ChildServiceCoverNumber', 'ChildProductDesc');
                break;
        }
    }

    public onParentProductBlur(data: any): void {
        this.ServiceCoverLookUpCall(data, 'ParentServiceVisitFrequency', 'ParentServiceCoverNumber', 'ParentProductDesc');
    }
    public onChildProductBlur(data: any): void {
        this.ServiceCoverLookUpCall(data, 'ChildServiceVisitFrequency', 'ChildServiceCoverNumber', 'ChildProductDesc');
    }

    public onLinkedProductBlur(data: any): void {
        this.ellipsis.ServiceCover.childConfigParams.LinkedProductCode = this.getControlValue('LinkedProductCode');
        this.linkedEllipseOpen = true;
    }

    public onModalHidden(): void {
        this.linkedEllipseOpen = false;
    }

    public onServiceCoverSearch(event: any): void {
        this.setControlValue('LinkedProductCode', event.row.ProductCode);
        this.setControlValue('LinkedProductDesc', event.row.ProductDesc);
        this.setControlValue('LinkedServiceVisitFreq', event.row.ServiceVisitFrequency);
        this.setControlValue('LinkedServiceCoverNumber', event.row.ServiceCoverNumber);
    }

    private ServiceCoverLookUpCall(value: any, ServiceVisitFreq: string, ServiceCoverNumber: string, ProductDesc: string): void {
        let lookupIP = [
            {
                'table': 'ServiceCover',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'ProductCode': value
                },
                'fields': ['ServiceVisitFrequency', 'ServiceCoverNumber']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': value
                },
                'fields': ['ProductDesc']
            }
        ];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let ServiceCoverrecord = data[0];
            let Productrecord = data[1];
            this.setControlValue(ServiceVisitFreq, (ServiceCoverrecord.length && ServiceCoverrecord[0].ServiceVisitFrequency !== '') ? ServiceCoverrecord[0].ServiceVisitFrequency : '');
            this.setControlValue(ProductDesc, (Productrecord.length && Productrecord[0].ProductDesc !== '') ? Productrecord[0].ProductDesc : '');
        }).catch(e => {
            this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
            this.setControlValue(ServiceVisitFreq, '');
            this.setControlValue(ProductDesc, '');
        });
    }


    private doLookUpCall(): void {
        let lookupIP = [
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ProductDesc', 'DispenserInd', 'ConsumableInd']
            },
            {
                'table': 'ServiceCover',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'ProductCode': this.getControlValue('ProductCode'),
                    'ServiceCoverNumber': this.getControlValue('ServiceCoverNumber')
                },
                'fields': ['ServiceVisitFrequency']
            }
        ];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let Productrecord = data[0];
            let ServiceCoverrecord = data[1];
            this.setControlValue('ProductDesc', (Productrecord.length && Productrecord[0].ProductDesc !== '') ? Productrecord[0].ProductDesc : '');
            this.setControlValue('ConsumableInd', (Productrecord.length && Productrecord[0].ConsumableInd !== '') ? Productrecord[0].ConsumableInd : '');
            this.setControlValue('DispenserInd', (Productrecord.length && Productrecord[0].DispenserInd !== '') ? Productrecord[0].DispenserInd : '');
            this.setControlValue('ServiceVisitFrequency', (ServiceCoverrecord.length && ServiceCoverrecord[0].ServiceVisitFrequency !== '') ? ServiceCoverrecord[0].ServiceVisitFrequency : '');
            this.ellipsis.ServiceCover.childConfigParams.DispenserInd = this.getControlValue('DispenserInd');
            this.ellipsis.ServiceCover.childConfigParams.ConsumableInd = this.getControlValue('ConsumableInd');
        }).catch(e => {
            this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
            this.setControlValue('ServiceVisitFreq', '');
            this.setControlValue('ServiceCoverNumber', '');
            this.setControlValue('ProductDesc', '');
        });;

    }

    public addLinkedproduct(): void {
        if (this['uiForm'].valid) {
            this.promptContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
    }

    public deleteLinkedProduct(): void {
        this.promptContent = MessageConstant.Message.DeleteRecord;
        this.promptConfirmModal.show();
    }

    private getLinkedProduct(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '0');
        search.set('ContractNumber', this.getControlValue('ContractNumber'));
        search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        search.set('ParentProductCode', this.getControlValue('ParentProductCode'));
        search.set('ParentServiceCoverNumber', this.getControlValue('ParentServiceCoverNumber'));
        search.set('ChildProductCode', this.getControlValue('ChildProductCode'));
        search.set('ChildServiceCoverNumber', this.getControlValue('ChildServiceCoverNumber'));
        this.inputParams.search = search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('LinkedProductROWID', data.ttLinkedProduct);
                    this.callDeleteService();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    private callDeleteService(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '3');
        this.inputParams.search = search;
        let formdata: Object = {
            ContractNumber: this.getControlValue('ContractNumber'),
            PremiseNumber: this.getControlValue('PremiseNumber'),
            ParentProductCode: this.getControlValue('ParentProductCode'),
            ParentServiceCoverNumber: this.getControlValue('ParentServiceCoverNumber'),
            ChildProductCode: this.getControlValue('ChildProductCode'),
            ChildServiceCoverNumber: this.getControlValue('ChildServiceCoverNumber'),
            LinkedProductROWID: this.getControlValue('LinkedProductROWID')
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.formPristine();
                    this.location.back();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    public promptSave(event: any): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        if (this.parentMode === 'Add') {
            search.set(this.serviceConstants.Action, '1');
            this.inputParams.search = search;
            let formdata: Object = {
                ContractNumber: this.getControlValue('ContractNumber'),
                PremiseNumber: this.getControlValue('PremiseNumber'),
                ParentProductCode: this.getControlValue('ProductCode'),
                ParentServiceCoverNumber: this.getControlValue('ServiceCoverNumber'),
                ChildProductCode: this.getControlValue('LinkedProductCode'),
                ChildServiceCoverNumber: this.getControlValue('LinkedServiceCoverNumber'),
                ParentProductDesc: this.getControlValue('ProductDesc'),
                ChildProductDesc: this.getControlValue('LinkedProductDesc'),
                LinkedProductCode: this.getControlValue('LinkedProductCode'),
                LinkedServiceCoverNumber: this.getControlValue('LinkedServiceCoverNumber'),
                ProductCode: this.getControlValue('ProductCode'),
                ServiceCoverNumber: this.getControlValue('ServiceCoverNumber')
            };
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
                this.inputParams.operation, this.inputParams.search, formdata)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.formPristine();
                        this.location.back();
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                }
                );
        } else {
            this.getLinkedProduct();
        }
    }

    public onCancelClick(): void {
        this.setControlValue('LinkedProductCode', '');
        this.setControlValue('LinkedProductDesc', '');
        this.setControlValue('LinkedServiceVisitFreq', '');
        this.formPristine();
        this.location.back();
    }

}
