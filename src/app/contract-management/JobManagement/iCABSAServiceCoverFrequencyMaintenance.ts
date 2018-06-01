import { URLSearchParams } from '@angular/http';
import { Component, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { setTimeout } from 'timers';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { PromptModalComponent } from './../../../shared/components/prompt-modal/prompt-modal';
import { ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
//import { ProductSearchGridComponent } from './../../internal/search/iCABSBProductSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { CBBService } from '../../../shared/services/cbb.service';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAServiceCoverFrequencyMaintenance.html'
})

export class ServiceCoverFrequencyMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('promptModal') promptModal: PromptModalComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public pageId: string = '';

    public queryParams: any = {
        operation: 'Application/iCABSAServiceCoverFrequencyMaintenance',
        module: 'service-cover',
        method: 'contract-management/maintenance'
    };

    public controls = [
        { name: 'ContractNumber', required: true, type: MntConst.eTypeCode },
        { name: 'ContractName', required: true, disabled: true, type: MntConst.eTypeText },
        { name: 'Status', disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseNumber', required: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', required: true, disabled: true, type: MntConst.eTypeText },
        { name: 'ProductCode', required: true, type: MntConst.eTypeCode },
        { name: 'ProductDesc', required: true, disabled: true, type: MntConst.eTypeText },
        { name: 'ServiceAnnualValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'ServiceQuantity', disabled: true, type: MntConst.eTypeInteger },
        { name: 'ServiceCommenceDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'ServiceVisitFrequency', disabled: true, type: MntConst.eTypeInteger },
        { name: 'NewServiceVisitFrequency', required: true, disabled: true, type: MntConst.eTypeInteger },
        { name: 'ServiceCoverROWID' }
    ];

    public buttonDisable = {
        save: true,
        cancel: true
    };

    public lookUpSubscription: Subscription;
    public contractSearchComponent = ContractSearchComponent;
    public premiseSearchComponent = PremiseSearchComponent;
    public serviceCoverSearchComponent = ServiceCoverSearchComponent;
    public uiElement: any;
    public showpromptHeader: boolean = true;
    public promptTitle: string = 'Confirm Record?';
    public currentContractType: string = '';
    public dateReadOnly: boolean = true;
    public CommenceDate: any;
    public commenceDateDisplay: string;
    public labelNumber: string;
    public autoOpenSearch: boolean;

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    public contractSearchParams: any = {
        'parentMode': 'LookUp',
        'currentContractType': 'J',
        'showAddNew': false
    };

    public premiseSearchParams: any = {
        'parentMode': 'LookUp',
        'CurrentContractType': 'J',
        'showAddNew': false,
        'ContractNumber': '',
        'ContractName': ''
    };

    public serviceCoverSearchParams: any = {
        'parentMode': 'LookUp',
        'showAddNew': false,
        'ContractNumber': '',
        'ContractName': '',
        'PremiseNumber': '',
        'PremiseName': ''
    };

    constructor(injector: Injector, private cbb: CBBService) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERFREQUENCYMAINTENANCE;
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit(): void {
        super.ngOnInit();
        this.getPageTitle();
    }

    ngAfterViewInit(): void {
        this.autoOpenSearch = true;
    }

    public getPageTitle(): any {
        this.contractTypeCode();
        if (this.currentContractType === 'J') {
            this.pageTitle = 'Job Service Cover Frequency Maintenance';
            this.labelNumber = 'Job Number';
            this.utils.setTitle('Job Service Cover Frequency Maintenance');
        }
        else if (this.currentContractType === 'C') {
            this.pageTitle = 'Contract Service Cover Frequency Maintenance';
            this.labelNumber = 'Contract Number';
            this.utils.setTitle('Contract Service Cover Frequency Maintenance');
        }
        else if (this.currentContractType === 'P') {
            this.pageTitle = 'Product Service Cover Frequency Maintenance';
            this.labelNumber = 'Product Number';
            this.utils.setTitle('Product Service Cover Frequency Maintenance');
        }
    }

    private contractTypeCode(): void {
        let urlParams: any = this.riExchange.getRouterParams();
        let labels: any;
        this.currentContractType = 'J';
        if (urlParams.hasOwnProperty('contract')) {
            this.currentContractType = 'C';
        } else if (urlParams.hasOwnProperty('product')) {
            this.currentContractType = 'P';
        }
    }

    public getFormdata(): void {

        let contractnumber = this.getControlValue('ContractNumber');
        let premisenumber = this.getControlValue('PremiseNumber');
        let productcode = this.getControlValue('ProductCode');

        this.ajaxSource.next(this.ajaxconstant.START);

        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('ContractTypeCode', this.currentContractType);
        searchParams.set('ContractNumber', contractnumber);
        searchParams.set('PremiseNumber', premisenumber);
        searchParams.set('ProductCode', productcode);


        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams).subscribe(
            (data) => {
                if ((data.errorMessage && data.errorMessage !== '') || data.fullError) {
                    this.clearFormFields();
                    this.messageModal.show(data, true);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
                else {
                    this.doLookupformData();
                    this.setControlValue('Status', data.Status);
                    this.setControlValue('ServiceAnnualValue', parseFloat(data.ServiceAnnualValue).toFixed(2));
                    this.setControlValue('ServiceQuantity', data.ServiceQuantity);
                    this.setControlValue('ServiceCommenceDate', data.ServiceCommenceDate);
                    this.setControlValue('ServiceVisitFrequency', data.ServiceVisitFrequency);
                    this.setControlValue('ServiceCoverROWID', data.ServiceCover);
                    this.riExchange.riInputElement.Enable(this.uiForm, 'NewServiceVisitFrequency');
                    this.buttonDisable.save = false;
                    this.buttonDisable.cancel = false;
                    if (data.ServiceCommenceDate) {
                        let serviceCommenceDateString = this.globalize.parseDateToFixedFormat(data.ServiceCommenceDate).toString();
                        this.CommenceDate = this.globalize.parseDateStringToDate(serviceCommenceDateString);
                    } else {
                        this.CommenceDate = null;
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.setFormMode(this.c_s_MODE_UPDATE);
                }
            });
    }

    public doLookupformData(): void {
        let contractnumber = this.getControlValue('ContractNumber');
        let premisenumber = this.getControlValue('PremiseNumber');
        let productcode = this.getControlValue('ProductCode');
        let lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': contractnumber
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': contractnumber,
                    'PremiseNumber': premisenumber
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': productcode
                },
                'fields': ['ProductDesc']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0].length > 0) {
                this.setControlValue('ContractName', data[0][0].ContractName);
                this.premiseSearchParams.ContractNumber = this.getControlValue('ContractNumber');
                this.premiseSearchParams.ContractName = this.getControlValue('ContractName');
                this.serviceCoverSearchParams.ContractNumber = this.getControlValue('ContractNumber');
                this.serviceCoverSearchParams.ContractName = this.getControlValue('ContractName');
                this.cbb.disableComponent(true);
            } else {
                this.cbb.disableComponent(false);
            }
            if (data[1].length > 0) {
                this.setControlValue('PremiseName', data[1][0].PremiseName);
                this.serviceCoverSearchParams.PremiseNumber = this.getControlValue('PremiseNumber');
                this.serviceCoverSearchParams.PremiseName = this.getControlValue('PremiseName');
            }
            if (data[2].length > 0) {
                this.setControlValue('ProductDesc', data[2][0].ProductDesc);
            }
        });
    }

    public onContractDataChanged(data: any): void {
        let contractnumber = this.getControlValue('ContractNumber');
        this.setControlValue('ContractName', '');
        this.setControlValue('PremiseNumber', '');
        this.setControlValue('PremiseName', '');
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');
        this.premiseSearchParams.ContractNumber = '';
        this.premiseSearchParams.ContractName = '';
        this.serviceCoverSearchParams.ContractNumber = '';
        this.serviceCoverSearchParams.ContractName = '';
        this.serviceCoverSearchParams.PremiseNumber = '';
        this.serviceCoverSearchParams.PremiseName = '';
        this.clearFormFields();
        if (contractnumber !== '') {
            this.doLookupformData();
        } else {
            this.cbb.disableComponent(false);
        }

    }
    public onPremiseDataChanged(data: any): void {
        let premisenumber = this.getControlValue('PremiseNumber');
        this.setControlValue('PremiseName', '');
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');
        this.serviceCoverSearchParams.PremiseNumber = '';
        this.serviceCoverSearchParams.PremiseName = '';
        this.clearFormFields();
        if (premisenumber !== '') {
            this.doLookupformData();
        }
    }

    public onProductDataChanged(data: any): void {
        let productcode = this.getControlValue('ProductCode');
        this.setControlValue('ProductDesc', '');
        this.clearFormFields();
        if (productcode !== '') {
            this.doLookupformData();
            this.getFormdata();
        }
    }

    public clearFormFields(): void {
        this.setControlValue('Status', '');
        this.setControlValue('ServiceAnnualValue', '');
        this.setControlValue('ServiceQuantity', '');
        this.setControlValue('ServiceCommenceDate', '');
        this.CommenceDate = '';
        this.setControlValue('ServiceVisitFrequency', '');
        this.setControlValue('ServiceVisitFrequency', '');
        this.setControlValue('ServiceCoverROWID', '');
        this.setControlValue('NewServiceVisitFrequency', '');
        this.riExchange.riInputElement.Disable(this.uiForm, 'NewServiceVisitFrequency');
        this.buttonDisable.save = true;
        this.buttonDisable.cancel = true;
    }

    public onContractDataReceived(data: any): void {
        this.setControlValue('ContractName', data.ContractName);
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('PremiseNumber', '');
        this.setControlValue('PremiseName', '');
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');
        this.premiseSearchParams.ContractNumber = data.ContractNumber;
        this.premiseSearchParams.ContractName = data.ContractName;
        this.serviceCoverSearchParams.ContractName = data.ContractName;
        this.serviceCoverSearchParams.ContractNumber = data.ContractNumber;
        this.serviceCoverSearchParams.PremiseNumber = '';
        this.serviceCoverSearchParams.PremiseName = '';
        this.clearFormFields();
        this.cbb.disableComponent(true);
    }

    public onPremiseDataReceived(data: any): void {
        this.setControlValue('PremiseNumber', data.PremiseNumber);
        this.setControlValue('PremiseName', data.PremiseName);
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');
        this.serviceCoverSearchParams.PremiseNumber = data.PremiseNumber;
        this.serviceCoverSearchParams.PremiseName = data.PremiseName;
        this.clearFormFields();
    }

    public onProductDataReceived(data: any): void {
        this.setControlValue('ProductCode', data.ProductCode);
        this.setControlValue('ProductDesc', data.ProductDesc);
        let contractnumber = this.getControlValue('ContractNumber');
        let premisenumber = this.getControlValue('PremiseNumber');
        if (contractnumber !== '' && premisenumber !== '') {
            this.getFormdata();
        }
    }

    public saveData(): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.promptModal.show('', '');
        }
    }

    public promptSave(data: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);

        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        searchParams.set(this.serviceConstants.Action, '2');

        let bodyParams: Object = {};

        bodyParams['NewServiceVisitFrequency'] = this.getControlValue('NewServiceVisitFrequency');
        bodyParams['ServiceCoverROWID'] = this.getControlValue('ServiceCoverROWID');
        bodyParams['ContractNumber'] = this.getControlValue('ContractNumber');
        bodyParams['PremiseNumber'] = this.getControlValue('PremiseNumber');
        bodyParams['ProductCode'] = this.getControlValue('ProductCode');
        bodyParams['ServiceVisitFrequency'] = this.getControlValue('ServiceVisitFrequency');
        bodyParams['ServiceQuantity'] = this.getControlValue('ServiceQuantity');
        bodyParams['ServiceAnnualValue'] = this.getControlValue('ServiceAnnualValue');
        bodyParams['ServiceCommenceDate'] = this.getControlValue('ServiceCommenceDate');
        bodyParams['ContractTypeCode'] = this.getControlValue('ContractTypeCode');

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(
            (e) => {
                if ((e.errorMessage && e.errorMessage !== '') || e.fullError) {
                    this.messageModal.show(e, true);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
                else {
                    this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' }, false);
                    this.clearFormFields();
                    this.getFormdata();
                    this.uiForm.controls['NewServiceVisitFrequency'].markAsUntouched();
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
            });
    }

    public cancel(): void {
        this.setControlValue('NewServiceVisitFrequency', '');
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }

}
