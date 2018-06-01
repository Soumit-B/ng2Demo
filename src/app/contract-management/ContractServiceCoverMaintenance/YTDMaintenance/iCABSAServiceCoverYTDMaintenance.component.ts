import { Subscription } from 'rxjs';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { PremiseSearchComponent } from './../../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../../internal/search/iCABSAServiceCoverSearch';
import { ContractSearchComponent } from './../../../internal/search/iCABSAContractSearch';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { Utils } from './../../../../shared/services/utility';
import { DropdownComponent } from './../../../../shared/components/dropdown/dropdown';
import { HttpService } from './../../../../shared/services/http-service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { Logger } from '@nsalaun/ng2-logger';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, Injector, AfterViewInit } from '@angular/core';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { BaseComponent } from '../../../../app/base/BaseComponent';


@Component({
    templateUrl: 'iCABSAServiceCoverYTDMaintenance.html'
})
export class YTDMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChild('contractNumberEllipsis') contractNumberEllipsis: EllipsisComponent;
    @ViewChild('premisesNumberEllipsis') premisesNumberEllipsis: EllipsisComponent;
    @ViewChild('productcodeEllipsis') productcodeEllipsis: EllipsisComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;


    public controls = [
        { name: 'ContractNumber', readonly: false, disabled: false, required: true },
        { name: 'ContractName', readonly: true, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: true },
        { name: 'PremiseName', readonly: true, disabled: false, required: false },
        { name: 'ProductCode', readonly: false, disabled: false, required: true },
        { name: 'ProductDesc', readonly: true, disabled: false, required: false },
        { name: 'EntitlementAnnivDate', readonly: true, disabled: true, required: false },
        { name: 'EntitlementAnnualQuantity', readonly: true, disabled: true, required: false },
        { name: 'EntitlementYTDQuantity', readonly: false, disabled: false, required: false }
    ];

    public entitlementAnnivDate: Date = new Date();
    public modal: Object = {};
    public saveMode: boolean = false;
    public autoOpen: boolean = true;
    public promptTitle: string = '';
    public promptContent: string = '';
    private lookUpSubscription: Subscription;
    public ServiceCoverSearchComponent = ServiceCoverSearchComponent;

    public ellipsisConfig = {
        contract: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'currentContractType': 'C',
                'currentContractTypeURLParameter': '<contract>',
                'showAddNew': false
            },
            modalConfig: '',
            contentComponent: ContractSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        premises: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'currentContractType': 'C',
                'currentContractTypeURLParameter': '<contract>',
                'showAddNew': false
            },
            modalConfig: '',
            contentComponent: PremiseSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        product: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Search',
                'ContractNumber': '',
                'ContractName': '',
                'PremiseNumber': '',
                'PremiseName': '',
                'ProductCode': '',
                'ProductDesc': '',
                'currentContractType': 'C',
                'currentContractTypeURLParameter': '<contract>',
                'showAddNew': false
            },
            modalConfig: '',
            contentComponent: ServiceCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };
    public showErrorHeader = true;
    public showMessageHeader = true;

    public muleConfig = {
        method: 'contract-management/maintenance',
        module: 'contract-admin',
        operation: 'Application/iCABSAServiceCoverYTDMaintenance',
        contentType: 'application/x-www-form-urlencoded'
    };

    public dateObjectsEnabled = {
        EntitlementAnnivDate: false
    };


    public search: URLSearchParams;
    public pageId: string = '';
    public isRequesting: boolean = false;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERYTDMAINTENANCE;
        this.pageTitle = 'Service Cover Year To Date Maintenance';
        this.search = this.getURLSearchParamObject();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.populateUIFromFormData();
        this.utils.setTitle(this.pageTitle);
    }

    ngAfterViewInit(): void {
        if (this.autoOpen === true) {
            this.ellipsisConfig.contract.autoOpen = true;
            this.autoOpen = false;
        }
    }

    public onContractSearchDataReceived(data: any, route: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        this.ellipsisConfig.premises.childConfigParams.ContractNumber = data.ContractNumber;
        this.ellipsisConfig.product.childConfigParams.ContractNumber = data.ContractNumber;

        if (data.ContractName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
            this.ellipsisConfig.premises.childConfigParams.ContractName = data.ContractName;
            this.ellipsisConfig.product.childConfigParams.ContractName = data.ContractName;
        }

        //this.riMaintenanceSearch();
    }

    public onPremisesDataReceived(data: any, route: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
        this.ellipsisConfig.product.childConfigParams.PremiseNumber = data.PremiseNumber;

        if (data.PremiseName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
            this.ellipsisConfig.product.childConfigParams.PremiseName = data.PremiseName;
        }

        //this.riMaintenanceSearch();
    }

    public onProductDataReceived(data: any, route: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.ProductCode);
        this.ellipsisConfig.product.childConfigParams.ProductCode = data.ProductCode;
        if (data.ProductDesc) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.ProductDesc);
            this.ellipsisConfig.product.childConfigParams.ProductDesc = data.ProductDesc;
        }

        this.saveMode = false;
        this.setFormMode(this.c_s_MODE_SELECT);
        this.getYTDmaintenanceData('fetch');
    }

    public modalHiddenContract(): void {
        //No functionality
    }
    public modalHiddenPremises(): void {
        //No functionality
    }
    public modalHiddenProductCode(): void {
        //No functionality
    }

    public onKeyDown(event: any): void {
        //this.logger.warn('onKeyDown', event.target.id)
        if (event && event.target) {
            let elementValue = event.target.value;
            let _paddedValue = elementValue;
            if (elementValue.length > 0) {
                if (event.target.id === 'ContractNumber') {
                    if (this.contractNumberEllipsis)
                        this.contractNumberEllipsis.openModal();
                }
                else if (event.target.id === 'PremiseNumber') {
                    if (this.premisesNumberEllipsis)
                        this.premisesNumberEllipsis.openModal();
                }
                else if (event.target.id === 'ProductCode') {
                    if (this.productcodeEllipsis)
                        this.productcodeEllipsis.openModal();
                }
            }
        }
    };

    public onBlur(event: any): void {
        if (event && event.target) {
            let elementValue = event.target.value;
            let _paddedValue = elementValue;
            // if (elementValue.length > 0) {
            if (event.target.id === 'ContractNumber') {
                if (elementValue.length > 0) {
                    event.target.value = this.utils.fillLeadingZeros(elementValue, 8);
                    this.uiForm.controls['ContractNumber'].setValue(event.target.value);
                    this.getContractName();
                    this.getYTDmaintenanceData('fetch');
                }
                else {
                    this.ellipsisConfig.product.childConfigParams.ContractNumber = '';
                    this.ellipsisConfig.product.childConfigParams.ContractName = '';
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', '');
                }
            }
            else if (event.target.id === 'PremiseNumber') {
                if (elementValue.length > 0) {
                    this.getPremiseName();
                    this.getYTDmaintenanceData('fetch');
                }
                else {
                    this.ellipsisConfig.product.childConfigParams.PremiseNumber = '';
                    this.ellipsisConfig.product.childConfigParams.PremiseName = '';
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
                }
            }
            else if (event.target.id === 'ProductCode') {
                if (elementValue.length === 0) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                }
                this.saveMode = true;
                this.setFormMode(this.c_s_MODE_UPDATE);
                this.getProductName();
                this.ellipsisConfig.product.childConfigParams.ProductCode = this.uiForm.controls['ProductCode'].value || '';
                this.ellipsisConfig.product.childConfigParams.ProductDesc = this.uiForm.controls['ProductDesc'].value || '';
                this.getYTDmaintenanceData('fetch');

            }
            else if (event.target.id === 'EntitlementYTDQuantity') {
                if (elementValue !== '') {
                    if (this.isNumeric(elementValue)) {
                        event.target.value = this.round(elementValue, 0);
                    }
                    else {
                        this.uiForm.controls['EntitlementYTDQuantity'].setErrors({ remote: true });
                    }
                }
            }
            // }
        }
    };

    public processFormData(): void {

        if (this.saveMode) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'EntitlementAnnivDate');
            this.riExchange.riInputElement.Disable(this.uiForm, 'EntitlementAnnualQuantity');
            this.riExchange.riInputElement.Enable(this.uiForm, 'EntitlementYTDQuantity');
        }
        else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'EntitlementAnnivDate');
            this.riExchange.riInputElement.Disable(this.uiForm, 'EntitlementAnnualQuantity');
            this.riExchange.riInputElement.Disable(this.uiForm, 'EntitlementYTDQuantity');
        }
    }

    public riMaintenanceSearch(): void {

        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === '') {
            if (this.contractNumberEllipsis && typeof (this.contractNumberEllipsis) !== undefined)
                this.contractNumberEllipsis.openModal();
        }

        if ((this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '') &&
            (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') === '')) {
            if (this.premisesNumberEllipsis && typeof (this.premisesNumberEllipsis) !== undefined)
                this.premisesNumberEllipsis.openModal();
        }

        if ((this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '') &&
            (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '')) {
            if (this.productcodeEllipsis && typeof (this.productcodeEllipsis) !== undefined)
                this.productcodeEllipsis.openModal();
        }
    }

    public onSubmit(formdata: any, valid: any, event: any): void {
        event.preventDefault();
        this.promptContent = MessageConstant.Message.ConfirmRecord;
        if (this.isNumeric(this.uiForm.controls['EntitlementYTDQuantity'].value)) {
            this.promptModal.show();
        }
        else {
            this.uiForm.controls['EntitlementYTDQuantity'].setErrors({ remote: true });
        }
    }

    public onCancel(): void {
        this.setFormMode(this.c_s_MODE_SELECT);
        this.getYTDmaintenanceData('cancel');
        this.processFormData();
    }

    public getYTDmaintenanceData(actionMode: string): void {
        if (!this.uiForm.valid && (actionMode !== 'cancel')) {
            this.saveMode = false;
            this.setFormMode(this.c_s_MODE_SELECT);
            return;
        }

        let params = {
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')
        };

        this.riExchange.riInputElement.SetValue(this.uiForm, 'EntitlementAnnivDate', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EntitlementAnnualQuantity', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EntitlementYTDQuantity', '');

        this.saveMode = false;
        this.setFormMode(this.c_s_MODE_SELECT);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('', params).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.saveMode = false;
                    this.setFormMode(this.c_s_MODE_SELECT);
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e.errorMessage || e.error_description) {
                        this.saveMode = false;
                        this.setFormMode(this.c_s_MODE_SELECT);
                        this.showErrorMessage(e.errorMessage);
                    }
                    else {
                        this.modal = e;
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'EntitlementAnnivDate', e.EntitlementAnnivDate ? e.EntitlementAnnivDate : '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'EntitlementAnnualQuantity', e.EntitlementAnnualQuantity ? e.EntitlementAnnualQuantity : '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'EntitlementYTDQuantity', e.EntitlementYTDQuantity ? e.EntitlementYTDQuantity : '');

                        switch (actionMode) {
                            case 'fetch':
                                this.saveMode = true;
                                this.setFormMode(this.c_s_MODE_UPDATE);
                                break;
                            case 'cancel':
                                this.saveMode = true;
                                this.setFormMode(this.c_s_MODE_SELECT);
                                break;
                            default:
                                this.saveMode = false;
                                break;
                        }

                        this.processFormData();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.saveMode = false;
                this.setFormMode(this.c_s_MODE_SELECT);
                this.showErrorMessage(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
        );
    }

    public fetchRecordData(functionName: any, params: any): any {
        let querydata = new URLSearchParams();
        querydata.set(this.serviceConstants.BusinessCode, this.businessCode());
        querydata.set(this.serviceConstants.CountryCode, this.countryCode());

        querydata.set(this.serviceConstants.Action, '0');

        if (functionName !== '') {
            querydata.set(this.serviceConstants.Action, '6');
            querydata.set('Function', functionName);
        }
        for (let key in params) {
            if (key) {
                querydata.set(key, params[key]);
            }
        }

        return this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, querydata);
    }


    public updateRecordData(): any {
        let formdata: Object = {};
        let querydata = new URLSearchParams();

        querydata.set(this.serviceConstants.BusinessCode, this.businessCode());
        querydata.set(this.serviceConstants.CountryCode, this.countryCode());

        querydata.set(this.serviceConstants.Action, '2');

        formdata['ServiceCoverROWID'] = this.modal['ServiceCover'];
        formdata['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        formdata['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        formdata['ProductCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        formdata['EntitlementAnnivDate'] = this.globalize.parseDateToFixedFormat(this.entitlementAnnivDate);
        formdata['EntitlementAnnualQuantity'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EntitlementAnnualQuantity');
        formdata['EntitlementYTDQuantity'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EntitlementYTDQuantity');

        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, querydata, formdata).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    //TODO - No functionality
                }
            },
            (error) => {
                this.showErrorMessage(error);
            }
        );

    }


    public showErrorMessage(msgTxt: any, type?: number): void {
        let titleModal = '';
        if (!type) type = 0;

        switch (type) {
            default:
            case 0: titleModal = 'Error Message'; break;
            case 1: titleModal = 'Success Message'; break;
            case 2: titleModal = 'Warning Message'; break;
        }

        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
    }

    public promptSave(event: any): void {
        this.updateRecordData();
    }

    public getContractName(): void {
        let lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'ContractNumber': this.uiForm.controls['ContractNumber'].value, 'BusinessCode': this.businessCode()
                },
                'fields': ['ContractName']
            }
        ];

        this.lookupData(lookupIP, 'Contract');
    }

    public getPremiseName(): void {
        let lookupIP = [
            {
                'table': 'Premise',
                'query': {
                    'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                    'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                    'BusinessCode': this.businessCode()
                },
                'fields': ['PremiseName']
            }
        ];
        this.lookupData(lookupIP, 'Premise');
    }
    public getProductName(): void {
        let lookupIP = [
            {
                'table': 'Product',
                'query': {
                    'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                    'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                    'ProductCode': this.uiForm.controls['ProductCode'].value,
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ProductDesc']
            }
        ];

        this.lookupData(lookupIP, 'Product');

    }

    public lookupData(lookupIP: any, mode: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            switch (mode) {
                case 'Contract':
                    if (data && data[0][0] && data[0][0].ContractName) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data[0][0].ContractName);
                        this.ellipsisConfig.product.childConfigParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                        this.ellipsisConfig.product.childConfigParams.ContractName = data[0][0].ContractName;
                    }
                    else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', '');
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === '') {
                            this.ellipsisConfig.product.childConfigParams.ContractNumber = '';
                            this.ellipsisConfig.product.childConfigParams.ContractName = '';
                        }

                    }
                    break;
                case 'Premise':
                    if (data && data[0][0] && data[0][0].PremiseName) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data[0][0].PremiseName);
                        this.ellipsisConfig.product.childConfigParams.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
                        this.ellipsisConfig.product.childConfigParams.PremiseName = data[0][0].PremiseName;
                    }
                    else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') === '') {
                            this.ellipsisConfig.product.childConfigParams.PremiseNumber = '';
                            this.ellipsisConfig.product.childConfigParams.PremiseName = '';
                        }
                    }
                    break;
                case 'Product':
                    if (data && data[0][0] && data[0][0].ProductDesc) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data[0][0].ProductDesc);
                    }
                    else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                    }
                    break;
            }

            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }

    public round(value: any, precision: any): any {
        try {
            let multiplier = Math.pow(10, precision || 0);
            return Math.round(value * multiplier) / multiplier;
        }
        catch (e) {
            //TODO:
        }
        return value;
    }

    public isNumeric(input: any): boolean {
        //alert(parseFloat(input));
        // let re1 = /^-{0,1}\d*\.{0,1}\d+$/;
        // let reg = new RegExp(re1);
        // return (reg.test(input));
        try {
            return !isNaN(input - parseFloat(input));
        }
        catch (e) {
            //TODO:
        }
        return false;
    }

}
