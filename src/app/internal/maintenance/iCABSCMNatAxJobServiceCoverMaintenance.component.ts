import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeWhile';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { AjaxConstant } from '../../../shared/constants/AjaxConstants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ProductSearchGridComponent } from '../../../app/internal/search/iCABSBProductSearch';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { ServiceTypeSearchComponent } from '../../../app/internal/search/iCABSBServiceTypeSearch.component';
import { BusinessOriginLangSearchComponent } from '../../../app/internal/search/iCABSBBusinessOriginLanguageSearch.component';
import { TaxCodeSearchComponent } from '../../../app/internal/search/iCABSSTaxCodeSearch.component';

@Component({
    templateUrl: 'iCABSCMNatAxJobServiceCoverMaintenance.html'
})

export class CMNatAxJobServiceCoverMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('serviceTypeCodeDropDown') public serviceTypeCodeDropDown: ServiceTypeSearchComponent;
    @ViewChild('businessOriginDropDown') public businessOriginDropDown: BusinessOriginLangSearchComponent;

    private rowId: string = '';
    private editMode: string = 'UPDATE';
    private routeParams: any;
    private sub: Subscription;
    private isAlive: boolean = true;

    public serviceTypeCodeSelected: Object = {
        id: '',
        text: ''
    };
    public pageId: string = '';
    public controls: any = [
        { name: 'ProspectNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'ProductCode', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'Quantity', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'AnnualValue', readonly: true, disabled: true, required: true, type: MntConst.eTypeDecimal2 },
        { name: 'VisitFrequency', readonly: true, disabled: true, required: true, type: MntConst.eTypeInteger },
        { name: 'ServiceTypeCode', readonly: true, disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'TaxCode', readonly: true, disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'BusinessOriginCode', readonly: true, disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'TaxCodeDesc', readonly: true, disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'BusinessOriginCodeDesc', readonly: true, disabled: true, required: true, type: MntConst.eTypeCode }
    ];
    public branchItemsToDisplay: Array<any> = ['item', 'desc'];
    public serviceTypeList: Array<any> = [];
    public vatCodeList: Array<any> = [];
    public businessOriginList: Array<any> = [];
    public search: URLSearchParams = new URLSearchParams();
    public headerParams: any = {
        method: 'prospect-to-contract/maintenance',
        operation: 'ContactManagement/iCABSCMNatAxJobServiceCoverMaintenance',
        module: 'natax'
    };
    public isAddUpdateDeleteVisible: boolean = true;
    public isSaveCancelVisible: boolean = false;
    public uiElement: any;
    public postSearchParams: URLSearchParams = new URLSearchParams();
    public promptConfirmTitle: string;
    public promptConfirmContent: string;
    public isDeleteButtonDisabled: boolean = true;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public taxCodeSelected: Object = {
        id: '',
        text: ''
    };
    public businessOriginCodeSelected: Object = {
        id: '',
        text: ''
    };
    public isServiceTypeCodeDisabled: boolean = false;
    public isTaxCodeDisabled: boolean = false;
    public isBusinessOriginCodeDisabled: boolean = false;
    public productSearchGridComponent = ProductSearchGridComponent;
    public taxCodeSearchComponent = TaxCodeSearchComponent;
    public inputParams: any = {
        'parentMode': 'LookUp'
    };
    public dropdown: Object = {
        serviceTypeSearch: {
            isRequired: true,
            isDisabled: false,
            params: {
                parentMode: 'LookUp'
            }
        },
        businessOriginLang: {
            triggerValidate: false
        }
    };
    public isProductCodeDisabled: boolean = false;

    constructor(injector: Injector, public router: Router, private route: ActivatedRoute) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMNATAXJOBSERVICECOVERMAINTENANCE;
        this.browserTitle = this.pageTitle = 'National Account Job Service Cover Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.sub = this.route.queryParams.subscribe(
            (params: any) => {
                this.routeParams = params;
            }
        );
        this.windowOnLoad();
        this.fetchJobServiceCoverMaintenanceData();
        this.onUpdateClicked();
    }

    ngAfterViewInit(): void {
        this.uiElement = this.riExchange.riInputElement;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        //Release memory
        this.serviceConstants = null;
        this.httpService = null;
        this.errorService = null;
        this.utils = null;
        this.ajaxSource = null;
        //Unsubscribe all subscription
        this.isAlive = false;
    }

    private windowOnLoad(): void {
        this.rowId = this.riExchange.getParentAttributeValue('ROWID');
    }

    private setUIFieldsEditablity(editability: string): void {
        this.riExchange.riInputElement[editability](this.uiForm, 'VisitFrequency');
        this.riExchange.riInputElement[editability](this.uiForm, 'Quantity');
        this.riExchange.riInputElement[editability](this.uiForm, 'AnnualValue');
        this.riExchange.riInputElement[editability](this.uiForm, 'VisitFrequency');
        this.riExchange.riInputElement[editability](this.uiForm, 'ServiceTypeCode');
        this.riExchange.riInputElement[editability](this.uiForm, 'TaxCode');
        this.riExchange.riInputElement[editability](this.uiForm, 'BusinessOriginCode');
        this.isServiceTypeCodeDisabled = (editability === 'Disable') ? true : false;
        this.isTaxCodeDisabled = (editability === 'Disable') ? true : false;
        this.isBusinessOriginCodeDisabled = (editability === 'Disable') ? true : false;
    }

    private setFieldsValue(data: any, isAddEditMode?: boolean): void {
        if (!isAddEditMode) {
            this.setControlValue('ProductCode', data['ProductCode']);
            this.setControlValue('ProspectNumber', data['ProspectNumber']);
        }
        this.setControlValue('VisitFrequency', data['VisitFrequency']);
        this.setControlValue('Quantity', data['Quantity']);
        this.setControlValue('AnnualValue', data['AnnualValue']);
        this.setControlValue('ServiceTypeCode', data['ServiceTypeCode']);
        this.setControlValue('TaxCode', data['TaxCode']);
        this.setControlValue('BusinessOriginCode', data['BusinessOriginDesc']);
    }

    private fetchOtherDetails(detailObj: any): void {
        let data: any = [{
            'table': 'Product',
            'query': { 'ProductCode': detailObj.ProductCode, 'BusinessCode': detailObj.BusinessCode },
            'fields': ['ProductDesc']
        },
        {
            'table': 'ServiceType',
            'query': { 'ServiceTypeCode': detailObj.ServiceTypeCode, 'BusinessCode': detailObj.BusinessCode },
            'fields': ['ServiceTypeDesc']
        },
        {
            'table': 'TaxCode',
            'query': { 'TaxCode': detailObj.TaxCode },
            'fields': ['TaxCodeDesc']
        },
        {
            'table': 'BusinessOriginLang',
            'query':

            { 'BusinessOriginCode': detailObj.BusinessOriginCode, 'LanguageCode': 'ENG', 'BusinessCode': detailObj.BusinessCode },
            'fields': ['BusinessOriginDesc']
        }
        ];
        this.lookUpRecord(data, 100).then(
            (e) => {
                let arr: any = [];
                let vatCodeArr: any = [];
                let businessOriginArr: any = [];
                let none: any = {
                    item: 'All',
                    desc: 'All'
                };
                let product: any = e['results'][0][0];
                let serviceType: any = e['results'][1][0];
                let taxCode: any = e['results'][2][0];
                let BusinessOrigin: any = e['results'][3][0];
                let serviceTypeDesc: string = '', taxCodeDesc: string = '', businessOriginDesc: string = '', productDesc: string = '';
                arr.push(none);
                if (serviceType !== null) {
                    serviceTypeDesc = serviceType.ServiceTypeDesc;
                }
                if (taxCode !== null) {
                    taxCodeDesc = taxCode.TaxCodeDesc;
                }
                if (BusinessOrigin !== null) {
                    businessOriginDesc = BusinessOrigin.BusinessOriginDesc;
                }
                if (product !== null) {
                    productDesc = product.ProductDesc;
                }
                let obj: any = {
                    item: detailObj.ServiceTypeCode,
                    desc: serviceTypeDesc
                };
                let resObj: any = JSON.parse(JSON.stringify(obj));
                if (resObj !== null) {
                    arr.push(resObj);
                }
                this.serviceTypeList = arr;
                this.serviceTypeCodeSelected = {
                    id: detailObj.ServiceTypeCode,
                    text: detailObj.ServiceTypeCode + ' - ' + serviceTypeDesc
                };

                vatCodeArr.push(none);
                let vatCodeobj: any = {
                    item: detailObj.TaxCode,
                    desc: taxCodeDesc
                };
                let resObj1: any = JSON.parse(JSON.stringify(vatCodeobj));
                if (resObj1 !== null) {
                    arr.push(resObj1);
                }
                vatCodeArr.push(resObj1);
                this.vatCodeList = vatCodeArr;
                this.taxCodeSelected = {
                    id: '',
                    text: detailObj.TaxCode + ' - ' + taxCodeDesc
                };

                businessOriginArr.push(none);
                let businessOriginObj: any = {
                    item: detailObj.BusinessOriginCode,
                    desc: businessOriginDesc
                };
                let resObj2: any = JSON.parse(JSON.stringify(businessOriginObj));
                if (resObj2 !== null) {
                    businessOriginArr.push(resObj2);
                }
                this.businessOriginList = businessOriginArr;
                this.businessOriginCodeSelected = {
                    id: detailObj.BusinessOriginCode,
                    text: detailObj.BusinessOriginCode + ' - ' + businessOriginDesc
                };
                this.setControlValue('ProductDesc', productDesc);
                this.setControlValue('ServiceTypeCode', detailObj.ServiceTypeCode);
                this.setControlValue('TaxCode', detailObj.TaxCode);
                this.setControlValue('BusinessOriginCode', detailObj.BusinessOriginCode);
                this.setControlValue('TaxCodeDesc', this.taxCodeSelected['text']);
                this.setControlValue('BusinessOriginCodeDesc', this.businessOriginCodeSelected['text']);
                this.businessOriginDropDown.active = this.businessOriginCodeSelected;
                this.serviceTypeCodeDropDown.active = this.serviceTypeCodeSelected;
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

    private lookUpRecord(data: any, maxresults: number): any {
        let queryLookUp: URLSearchParams = this.getURLSearchParamObject();
        queryLookUp.set(this.serviceConstants.Action, '5');
        queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpPromise(queryLookUp, data);
    }

    public fetchJobServiceCoverMaintenanceData(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('ROWID', this.rowId);
        this.ajaxSource.next(AjaxConstant.START);

        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
            this.headerParams.operation, this.search).takeWhile(() => this.isAlive)
            .subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    this.setFieldsValue(e);
                    let otherDtailsObj: any = {
                        ServiceTypeCode: e['ServiceTypeCode'],
                        TaxCode: e['TaxCode'],
                        BusinessOriginCode: e['BusinessOriginCode'],
                        BusinessCode: e['BusinessCode'],
                        ProductCode: e['ProductCode']
                    };
                    this.fetchOtherDetails(otherDtailsObj);
                }

            },
            (error) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public onUpdateClicked(): void {
        this.isAddUpdateDeleteVisible = false;
        this.isSaveCancelVisible = true;
        this.isProductCodeDisabled = true;
        this.setUIFieldsEditablity('Enable');
    }

    public addClicked(): void {
        this.editMode = 'ADD';
        this.isAddUpdateDeleteVisible = false;
        this.isSaveCancelVisible = true;
        this.setUIFieldsEditablity('Enable');
        let clearFieldObj: any = {
            ProspectNumber: '',
            ProductCode: '',
            VisitFrequency: '',
            Quantity: '',
            AnnualValue: ''
        };
        this.setFieldsValue(clearFieldObj, true);
    }

    public updateClicked(): void {
        this.editMode = 'UPDATE';
        this.onUpdateClicked();
    }

    public saveRecord(): void {
        if (!this.uiForm.invalid) {
            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.updateRecord.bind(this)));
        }
    }

    public addNewRecord(): void {
        let formData: Object = {};
        formData['ProspectNumber'] = this.getControlValue('ProspectNumber');
        formData['ProductCode'] = this.getControlValue('ProductCode');
        formData['VisitFrequency'] = this.getControlValue('VisitFrequency');
        formData['Quantity'] = this.getControlValue('Quantity');
        formData['AnnualValue'] = this.getControlValue('AnnualValue');
        formData['ServiceTypeCode'] = this.getControlValue('ServiceTypeCode');
        formData['TaxCode'] = this.getControlValue('TaxCode');
        formData['BusinessOriginCode'] = this.getControlValue('BusinessOriginCode');
        this.postSearchParams.set(this.serviceConstants.Action, '1');
        this.postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());


        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.postSearchParams, formData)
            .takeWhile(() => this.isAlive).subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                }
                else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public updateRecord(): void {
        let formData: Object = {};
        formData['TABLE'] = 'NatAxJobServiceCover';
        formData['ROWID'] = this.rowId;
        formData['VisitFrequency'] = this.getControlValue('VisitFrequency');
        formData['Quantity'] = this.getControlValue('Quantity');
        formData['AnnualValue'] = this.getControlValue('AnnualValue');
        formData['ServiceTypeCode'] = this.getControlValue('ServiceTypeCode');
        formData['TaxCode'] = this.getControlValue('TaxCode');
        formData['BusinessOriginCode'] = this.getControlValue('BusinessOriginCode');

        this.postSearchParams.set(this.serviceConstants.Action, '2');
        this.postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());


        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.postSearchParams, formData)
            .takeWhile(() => this.isAlive).subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                    this.fetchJobServiceCoverMaintenanceData();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public deleteRecord(): void {
        let formData: Object = {};
        formData['TABLE'] = 'NatAxJobServiceCover';
        formData['ROWID'] = this.rowId;
        this.postSearchParams.set(this.serviceConstants.Action, '3');
        this.postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());


        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.postSearchParams, formData)
            .takeWhile(() => this.isAlive).subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordDeletedSuccessfully));
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public beforeAdd(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set('Function', 'GetTaxCode');
        this.ajaxSource.next(AjaxConstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
            this.headerParams.operation, this.search)
            .takeWhile(() => this.isAlive).subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    // remove this comment and implement code to retrieve Tax code and Tax description here after dropdown is implemented
                }
            },
            (error) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public cancelClicked(): void {
        this.isAddUpdateDeleteVisible = true;
        this.isSaveCancelVisible = false;
        this.isProductCodeDisabled = false;
        this.fetchJobServiceCoverMaintenanceData();
        this.setUIFieldsEditablity('Disable');
    }

    public deleteClicked(): void {
        this.editMode = 'DELETE';
        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.DeleteRecord, null, this.deleteRecord.bind(this)));
    }

    public onServiceTypeSelected(event: any): void {
        this.setControlValue('ServiceTypeCode', event.value.item);
    }

    public onTaxCoceSelected(event: any): void {
        this.setControlValue('TaxCode', event.value.item);
    }

    public onBusinessOriginSelected(event: any): void {
        this.setControlValue('BusinessOriginCode', event.value.item);
    }

    public optionsChange(value: any): void {
        if (value === 'NatAxJobServiceDetail') {
            this.modalAdvService.emitMessage(new ICabsModalVO('This screen is not developed yet!'));
        }
    }

    public onProductSelectFromEllipsis(event: any, route: any): void {
        this.setControlValue('ProductCode', event.ProductCode);
        this.setControlValue('ProductDesc', event.ProductDesc);
    }

    public onBusinessOriginFromEllipsis(event: any): void {
        this.setControlValue('BusinessOriginCode', event['BusinessOriginLang.BusinessOriginCode']);
        this.setControlValue('BusinessOriginCodeDesc', event['BusinessOriginLang.BusinessOriginDesc']);
    }

    public onTaxCodeFromEllipsis(event: any): void {
        this.setControlValue('TaxCode', event.TaxCode);
        this.setControlValue('TaxCodeDesc', event.TaxCodeDesc);

    }

    public canDeactivate(): Observable<boolean> {
        this.routeAwayGlobals.setDirtyFlag(this.riExchange.validateForm(this.uiForm));
        return this.routeAwayComponent.canDeactivate();
    }

    public onServiceTypeDataReceived(data: any): void {
        if (data && data['ServiceTypeCode']) {
            this.setControlValue('ServiceTypeCode', data['ServiceTypeCode']);
        }
        else {
            this.setControlValue('ServiceTypeCode', '');
        }
    }

    public dropDownMarkError(fieldName: string): boolean {
        return (this.uiForm.controls[fieldName].invalid && this.uiForm.controls[fieldName].touched);
    }

}
