import { Component, OnInit, Injector, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { ProductDetailSearchComponent } from './../../internal/search/iCABSBProductDetailSearch.component';
import { InfestationLevelSearchComponent } from './../../internal/search/iCABSBInfestationLevelSearch.component';

@Component({
    templateUrl: 'iCABSSeInfestationMaintenance.html'
})

export class InfestationMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('SelLevel') selLevel: DropdownStaticComponent;

    private queryParams: any = {
        operation: 'Service/iCABSSeInfestationMaintenance',
        module: 'service',
        method: 'service-delivery/maintenance'
    };

    public setFocusProductDetailCode = new EventEmitter<boolean>();
    public pageId: string = '';
    public comboSelLevelArray: Array<any> = [
        { text: 'High', value: 1 },
        { text: 'Medium', value: 2 },
        { text: 'Low', value: 3 },
        { text: 'None', value: 0 }
    ];
    public controls: Array<any> = [
        { name: 'ContractNumber', type: MntConst.eTypeCode, disabled: true },
        { name: 'ContractName', type: MntConst.eTypeText, disabled: true },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger, disabled: true },
        { name: 'PremiseName', type: MntConst.eTypeText, disabled: true },
        { name: 'ProductCode', type: MntConst.eTypeCode, disabled: true },
        { name: 'ProductDesc', type: MntConst.eTypeText, disabled: true },
        { name: 'InfestationNumber', type: MntConst.eTypeInteger, disabled: true },
        { name: 'ProductDetailCode', type: MntConst.eTypeCode, required: true },
        { name: 'ProductDetailDesc', type: MntConst.eTypeText, disabled: true },
        { name: 'InfestationGroupCode', type: MntConst.eTypeInteger, disabled: true },
        { name: 'InfestationGroupDesc', type: MntConst.eTypeText, disabled: true },
        { name: 'InfestationLevelCode', type: MntConst.eTypeInteger, required: true },
        { name: 'InfestationLevelDesc', type: MntConst.eTypeText, disabled: true },
        { name: 'InfestationLocationCode', type: MntConst.eTypeInteger, required: true },
        { name: 'Level', type: MntConst.eTypeInteger },
        { name: 'Note', type: MntConst.eTypeText },
        // Hidden Field
        { name: 'Level', type: MntConst.eTypeText }
    ];
    public ellipsisParams: any = {
        productDetailCode: {
            isShowCloseButton: true,
            isShowHeader: true,
            isDisabled: false,
            childConfigParams: {
                parentMode: 'LookUp-Infest'
            },
            contentComponent: ProductDetailSearchComponent
        },
        infestationLevelCode: {
            isShowCloseButton: true,
            isShowHeader: true,
            isDisabled: false,
            childConfigParams: {
                parentMode: 'LookUp',
                InfestationGroupCode: '',
                InfestationGroupDesc: ''
            },
            contentComponent: InfestationLevelSearchComponent
        },
        common: {
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            }
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEINFESTATIONMAINTENANCE;

        this.browserTitle = this.pageTitle = 'Infestation Maintenance';
        this.pageParams.isAddMode = false;
        this.checkAvailabilityOfAddFunctionality(false);
        this.pageParams.isFunctionSave = true;
        this.pageParams.isFunctionCancel = true;
        this.pageParams.isFunctionDelete = false;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.onWindowLoad();
        if (!this.getAttribute('ServiceVisitRowID')) {
            this.checkAvailabilityOfAddFunctionality(false);
            this.pageParams.isFunctionSave = false;
            this.pageParams.isFunctionCancel = false;
            this.pageParams.isFunctionDelete = false;
            this.uiForm.disable();
            this.ellipsisParams.productDetailCode.isDisabled = true;
            this.ellipsisParams.infestationLevelCode.isDisabled = true;
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // Initializes data into different controls on page load
    private onWindowLoad(): void {
        switch (this.parentMode) {
            case 'Search':
            case 'SearchAdd':
            case 'ServiceVisit':
            case 'ServiceVisitPrep':
                this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));

                let infestationNumber: string = this.riExchange.getParentAttributeValue('InfestationNumber');
                this.setControlValue('InfestationNumber', infestationNumber);
                this.setAttribute('InfestationNumber', infestationNumber);
                break;
        }

        this.getHeaderDataFromLookup();
        this.selLevel.disabled = true;

        if (this.parentMode === 'ServiceVisit' || this.parentMode === 'ServiceVisitPrep') {
            this.setAttribute('ServiceVisitRowID', this.riExchange.getParentHTMLValue('ServiceVisit'));
            if (!this.getAttribute('ServiceVisitRowID')) {
                this.setAttribute('ServiceVisitRowID', this.riExchange.getParentHTMLValue('ServiceVisitRowID'));
            }
        } else if (this.parentMode === 'Search' || this.parentMode === 'SearchAdd') {
            this.setAttribute('ServiceVisitRowID', this.riExchange.getParentAttributeValue('ServiceVisitRowID'));
        }

        this.setAttribute('InfestationROWID', this.riExchange.getParentAttributeValue('InfestationROWID'));

        if (this.parentMode === 'ServiceVisit' || this.parentMode === 'ServiceVisitPrep' || this.parentMode === 'SearchAdd') {
            this.pageParams.isAddMode = true;
        } else {
            this.pageParams.isAddMode = false;
            this.fetchInitialRecord();
        }
        this.setAllButtonDisplayStatus();
    }

    // Populate data into the grid
    private fetchInitialRecord(): void {
        if (this.getAttribute('InfestationROWID') && this.getAttribute('ServiceVisitRowID') && this.getAttribute('InfestationNumber')) {
            let search: URLSearchParams = this.getURLSearchParamObject();

            search.set('ContractNumber', this.getControlValue('ContractNumber'));
            search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
            search.set('ProductCode', this.getControlValue('ProductCode'));
            search.set('InfestationNumber', this.getAttribute('InfestationNumber'));
            search.set('ServiceVisitRowID', this.getAttribute('ServiceVisitRowID'));
            search.set('InfestationROWID', this.getAttribute('InfestationROWID'));
            search.set(this.serviceConstants.Action, '0');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.setAttribute('InfestationNumber', data.InfestationNumber);
                        this.setControlValue('InfestationNumber', data.InfestationNumber);
                        this.setControlValue('ProductDetailCode', data.ProductDetailCode);
                        this.setControlValue('InfestationGroupCode', data.InfestationGroupCode);
                        this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupCode = data.InfestationGroupCode;
                        this.setControlValue('InfestationLevelCode', data.InfestationLevelCode);
                        this.setControlValue('InfestationLocationCode', data.InfestationLocationCode);
                        this.setControlValue('Note', data.Note);
                        this.validateLookupData(false);
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }
    }

    private setAllButtonDisplayStatus(): void {
        this.pageParams.isFunctionSave = true;
        this.pageParams.isFunctionCancel = true;

        if (this.getAttribute('InfestationROWID')) {
            this.checkAvailabilityOfAddFunctionality(true);
            this.pageParams.isFunctionDelete = true;
        } else {
            this.checkAvailabilityOfAddFunctionality(false);
            this.pageParams.isFunctionDelete = false;
        }

        this.pageParams.isFunctionDelete = !this.pageParams.isAddMode;
        if (this.pageParams.isAddMode) {
            this.setValueToLevel('0');
            setTimeout(() => {
                this.setFocusProductDetailCode.emit(true);
            }, 0);
        }
        this.selLevel.disabled = !this.pageParams.isAddMode;
    }

    private clearEditableControls(): void {
        this.setControlValue('InfestationNumber', '');
        this.setControlValue('ProductDetailCode', '');
        this.setControlValue('ProductDetailDesc', '');
        this.setControlValue('InfestationGroupCode', '');
        this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupCode = '';
        this.setControlValue('InfestationGroupDesc', '');
        this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupDesc = '';
        this.setControlValue('InfestationLevelCode', '');
        this.setControlValue('InfestationLevelDesc', '');
        this.setValueToLevel('0');
        this.setControlValue('InfestationLocationCode', '');
        this.setControlValue('Note', '');

        this.resetMandetoryControls();
    }

    private resetMandetoryControls(): void {
        this.uiForm.controls['ProductDetailCode'].reset();
        this.uiForm.controls['InfestationLevelCode'].reset();
        this.uiForm.controls['InfestationLocationCode'].reset();
    }

    private setValueToLevel(levelValue: string): void {
        if (levelValue === '') {
            levelValue = '0';
        }

        let arrLength: number = this.comboSelLevelArray.length;
        for (let i = 0; i < arrLength; i++) {
            if (this.comboSelLevelArray[i] && this.comboSelLevelArray[i].value.toString() === levelValue) {
                setTimeout(() => {
                    if (this.selLevel) { this.selLevel.updateSelectedItem(i); }
                }, 0);
            }
        }
    }

    private getHeaderDataFromLookup(): void {
        let lookupIPDetails: Array<any> = [];
        let contractIndex: number = -1;
        let premiseIndex: number = -1;
        let productIndex: number = -1;

        if (this.getControlValue('ContractNumber') && !this.getControlValue('ContractName')) {
            lookupIPDetails.push({
                'table': 'Contract',
                'query': {
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ContractNumber', 'ContractName']
            });
            contractIndex = lookupIPDetails.length - 1;
        }

        if (this.getControlValue('ContractNumber') && this.getControlValue('PremiseNumber') && !this.getControlValue('PremiseName')) {
            lookupIPDetails.push({
                'table': 'Premise',
                'query': {
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'BusinessCode': this.businessCode()
                },
                'fields': ['PremiseNumber', 'PremiseName']
            });
            premiseIndex = lookupIPDetails.length - 1;
        }

        if (this.getControlValue('ProductCode') && !this.getControlValue('ProductDesc')) {
            lookupIPDetails.push({
                'table': 'Product',
                'query': {
                    'ProductCode': this.getControlValue('ProductCode'),
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ProductCode', 'ProductDesc']
            });
            productIndex = lookupIPDetails.length - 1;
        }

        if (lookupIPDetails.length > 0) {
            this.LookUp.lookUpPromise(lookupIPDetails).then((data) => {
                let contractDetail: any = null;
                let premiseDetail: any = null;
                let productDetail: any = null;

                if (contractIndex > -1 && data[contractIndex].length > 0) { contractDetail = data[contractIndex][0]; }
                if (premiseIndex > -1 && data[premiseIndex].length > 0) { premiseDetail = data[premiseIndex][0]; }
                if (productIndex > -1 && data[productIndex].length > 0) { productDetail = data[productIndex][0]; }

                if (contractDetail && contractDetail.ContractName) {
                    this.setControlValue('ContractName', contractDetail.ContractName);
                }

                if (premiseDetail && premiseDetail.PremiseName) {
                    this.setControlValue('PremiseName', premiseDetail.PremiseName);
                }

                if (productDetail && productDetail.ProductDesc) {
                    this.setControlValue('ProductDesc', productDetail.ProductDesc);
                }
            });
        }
    }

    private validateLookupData(isSubmit: boolean): void {
        let lookupIPDetails = [{
            'table': 'ProductDetail',
            'query': { 'ProductDetailCode': this.getControlValue('ProductDetailCode'), 'BusinessCode': this.businessCode },
            'fields': ['ProductDetailDesc', 'InfestationGroupCode']
        },
        {
            'table': 'InfestationGroup',
            'query': { 'InfestationGroupCode': this.getControlValue('InfestationGroupCode'), 'BusinessCode': this.businessCode },
            'fields': ['InfestationGroupDesc']
        },
        {
            'table': 'InfestationLevel',
            'query': { 'InfestationGroupCode': this.getControlValue('InfestationGroupCode'), 'InfestationLevelCode': this.getControlValue('InfestationLevelCode') ? this.getControlValue('InfestationLevelCode') : '', 'BusinessCode': this.businessCode },
            'fields': ['InfestationLevelDesc', 'Level']
        },
        {
            'table': 'InfestationLocation',
            'query': { 'InfestationLocationCode': this.getControlValue('InfestationLocationCode'), 'BusinessCode': this.businessCode },
            'fields': ['InfestationLocationDesc']
        }];

        this.LookUp.lookUpPromise(lookupIPDetails).then((data) => {
            let productDetail: any = null;
            let infestationGroup: any = null;
            let infestationLevel: any = null;
            let infestationLocation: any = null;

            if (data && data.length > 0 && data[0].length > 0) { productDetail = data[0][0]; }
            if (data && data.length > 1 && data[1].length > 0) { infestationGroup = data[1][0]; }
            if (data && data.length > 2 && data[2].length > 0) { infestationLevel = data[2][0]; }
            if (data && data.length > 3 && data[3].length > 0) { infestationLocation = data[3][0]; }

            if (productDetail) {
                if (productDetail.ProductDetailDesc) {
                    this.setControlValue('ProductDetailDesc', productDetail.ProductDetailDesc);
                }
                if (productDetail.InfestationGroupCode) {
                    if (this.getControlValue('InfestationGroupCode') !== productDetail.InfestationGroupCode.toString()) {
                        this.riExchange.riInputElement.markAsError(this.uiForm, 'InfestationGroupCode');
                    }
                }
            } else {
                this.riExchange.riInputElement.markAsError(this.uiForm, 'ProductDetailCode');
                if (this.getControlValue('ProductDetailCode')) {
                    this.riExchange.riInputElement.markAsError(this.uiForm, 'InfestationGroupCode');
                }
                this.setControlValue('ProductDetailDesc', '');
            }

            if (infestationGroup) {
                if (infestationGroup.InfestationGroupDesc) {
                    this.setControlValue('InfestationGroupDesc', infestationGroup.InfestationGroupDesc);
                    this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupDesc = infestationGroup.InfestationGroupDesc;
                }
            } else {
                if (this.getControlValue('ProductDetailCode')) {
                    this.riExchange.riInputElement.markAsError(this.uiForm, 'InfestationGroupCode');
                }
                this.setControlValue('InfestationGroupDesc', '');
                this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupDesc = '';
            }

            if (infestationLevel) {
                if (infestationLevel.InfestationLevelDesc) {
                    this.setControlValue('InfestationLevelDesc', infestationLevel.InfestationLevelDesc);
                }
                if (infestationLevel.Level) {
                    this.setControlValue('Level', infestationLevel.Level);
                    this.setValueToLevel(infestationLevel.Level);
                }
            } else {
                this.riExchange.riInputElement.markAsError(this.uiForm, 'InfestationLevelCode');
                this.setControlValue('InfestationLevelDesc', '');
            }

            if (infestationLocation) {
                if (infestationLocation.InfestationLocationDesc) {
                    this.setControlValue('InfestationLocationDesc', infestationLocation.InfestationLocationDesc);
                }
            } else {
                this.riExchange.riInputElement.markAsError(this.uiForm, 'InfestationLocationCode');
                this.setControlValue('InfestationLocationDesc', '');
            }

            if (isSubmit && this.riExchange.validateForm(this.uiForm)) {
                this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.saveRecord.bind(this)));
            }
        });
    }

    private checkAvailabilityOfAddFunctionality(isShow: boolean): void {
        let isCheck: boolean = true;
        if (this.parentMode !== 'ServiceVisit' && this.parentMode !== 'ServiceVisitPrep') {
            isCheck = false;
        }

        this.pageParams.isFunctionAdd = (isCheck && isShow);
    }

    // Save record
    private saveRecord(): void {
        let formData: Object = {};
        let search: URLSearchParams = this.getURLSearchParamObject();

        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formData['ProductCode'] = this.getControlValue('ProductCode');
        formData['InfestationNumber'] = this.getAttribute('InfestationNumber');
        formData['ProductDetailCode'] = this.getControlValue('ProductDetailCode');
        formData['InfestationGroupCode'] = this.getControlValue('InfestationGroupCode');
        formData['InfestationLevelCode'] = this.getControlValue('InfestationLevelCode');
        formData['InfestationLocationCode'] = this.getControlValue('InfestationLocationCode');
        formData['Note'] = this.getControlValue('Note');
        formData['ServiceVisitRowID'] = this.getAttribute('ServiceVisitRowID');

        if (this.pageParams.isAddMode) {
            search.set(this.serviceConstants.Action, '1');
        } else {
            search.set(this.serviceConstants.Action, '2');
            formData['InfestationROWID'] = this.getAttribute('InfestationROWID');
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (this.pageParams.isAddMode) {
                        this.setControlValue('InfestationNumber', data.InfestationNumber);
                        this.setAttribute('InfestationNumber', data.InfestationNumber);
                        this.setAttribute('InfestationROWID', data.Infestation);
                        this.pageParams.isAddMode = false;
                        this.setAllButtonDisplayStatus();
                    }
                    this.formPristine();
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Delete record
    private deleteRecord(): void {
        let formData: Object = {};
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '3');

        formData['ROWID'] = this.getAttribute('InfestationROWID');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setAttribute('InfestationROWID', '');
                    this.pageParams.isAddMode = true;
                    this.clearEditableControls();
                    this.setAllButtonDisplayStatus();
                    this.formPristine();
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordDeletedSuccessfully));
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Populate data from ellipsis
    public onEllipsisDataReceived(type: string, data: any): void {
        switch (type) {
            case 'ProductDetailCode':
                this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'ProductDetailCode');
                this.setControlValue('ProductDetailCode', data.ProductDetailCode || '');
                this.setControlValue('ProductDetailDesc', data.ProductDetailDesc || '');
                this.onProductDetailCodeChange(null);
                break;
            case 'InfestationLevelCode':
                this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'InfestationLevelCode');
                this.setControlValue('InfestationLevelCode', data.InfestationLevelCode || '');
                this.setControlValue('InfestationLevelDesc', data.InfestationLevelDesc || '');
                if (data.InfestationGroupCode) {
                    this.setControlValue('InfestationGroupCode', data.InfestationGroupCode);
                    this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupCode = data.InfestationGroupCode;
                }
                if (data.InfestationGroupDesc) {
                    this.setControlValue('InfestationGroupDesc', data.InfestationGroupDesc);
                    this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupDesc = data.InfestationGroupDesc;
                }
                this.onInfestationLevelCodeChange(null);
                break;
        }
    }

    public onLevelChange(): void {
        this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'Level');
    }

    // ProductDetailCode OnChange event
    public onProductDetailCodeChange(event: Event): void {
        if (this.getControlValue('ProductDetailCode')) {
            let formData: Object = {};
            let search: URLSearchParams = this.getURLSearchParamObject();

            search.set(this.serviceConstants.Action, '6');

            formData['Function'] = 'GetDefaults';
            formData['ProductDetailCode'] = this.getControlValue('ProductDetailCode');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.setControlValue('ProductDetailDesc', data.ProductDetailDesc);
                        this.setControlValue('InfestationGroupCode', data.InfestationGroupCode);
                        this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupCode = data.InfestationGroupCode;
                        this.setControlValue('InfestationGroupDesc', data.InfestationGroupDesc);
                        this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupDesc = data.InfestationGroupDesc;
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        } else {
            this.setControlValue('ProductDetailDesc', '');
            this.setControlValue('InfestationGroupCode', '');
            this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupCode = '';
            this.setControlValue('InfestationGroupDesc', '');
            this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupDesc = '';
        }
    }

    // InfestationLevelCode OnChange event
    public onInfestationLevelCodeChange(event: Event): void {
        if (this.getControlValue('InfestationLevelCode') && this.getControlValue('InfestationGroupCode')) {
            let formData: Object = {};
            let search: URLSearchParams = this.getURLSearchParamObject();

            search.set(this.serviceConstants.Action, '6');

            formData['Function'] = 'GetLevel';
            formData['InfestationGroupCode'] = this.getControlValue('InfestationGroupCode');
            formData['InfestationLevelCode'] = this.getControlValue('InfestationLevelCode');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.setControlValue('Level', data.Level);
                        this.setControlValue('InfestationLevelDesc', data.InfestationLevelDesc);
                        this.setValueToLevel(data.Level);
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }

        if (this.getControlValue('InfestationLevelCode') === false) {
            this.riExchange.riInputElement.markAsError(this.uiForm, 'InfestationLevelCode');
        }
    }

    // Form add event
    public onAddClick(event: any): void {
        this.clearEditableControls();
        this.selLevel.disabled = false;
        this.pageParams.isAddMode = true;
        this.checkAvailabilityOfAddFunctionality(false);
        this.pageParams.isFunctionDelete = false;
        this.formPristine();
    }

    // Form submit event
    public onSubmit(event: any): void {
        this.validateLookupData(true);
    }

    // Form delete event
    public onDeleteClick(event: any): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.DeleteRecord, null, this.deleteRecord.bind(this)));
    }

    // Form cancel event
    public onCancelClick(event: any): void {
        this.clearEditableControls();

        if (this.getAttribute('InfestationROWID')) {
            this.pageParams.isAddMode = false;
        } else {
            this.pageParams.isAddMode = true;
        }
        this.setAllButtonDisplayStatus();
        this.fetchInitialRecord();
        this.formPristine();
    }
}
