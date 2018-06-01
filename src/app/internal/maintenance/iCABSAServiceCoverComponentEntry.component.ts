import { InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { RouteAwayGlobals } from './../../../shared/services/route-away-global.service';
import { Observable } from 'rxjs';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, OnDestroy, ViewChild, ElementRef, Renderer, EventEmitter, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ScreenNotReadyComponent } from '../../../shared/components/screenNotReady';
import { ProductSearchGridComponent } from '../search/iCABSBProductSearch';
import { ProductAttributeValuesSearchComponent } from '../search/iCABSBProductAttributeValuesSearch.component';

@Component({
    templateUrl: 'iCABSAServiceCoverComponentEntry.html'
})
export class ServiceCoverEntryComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('cddCompTypeLangSearch') public ddComponentType;

    public canDeactivate(): Observable<boolean> {
        return this.routeAwayComponent.canDeactivate();
    }

    /**
     * Page Vairables
     */
    public dummyProductCodes: Array<any> = [];
    public singleQtyComponents: Array<any> = [];
    public errorMessageFlag: boolean = false;
    public queryParams = {
        operation: 'Application/iCABSAServiceCoverComponentEntry',
        module: 'components',
        method: 'contract-management/maintenance'
    };
    public promptContent: string = '';
    public promptTitle: string;
    public searchParams: URLSearchParams;
    public serviceCoverROWID: string;

    public attr1Mandatory: boolean = false;
    public attr2Mandatory: boolean = false;
    public showHeader: boolean = true;
    public showComponentRange: boolean = false;
    public showRotationalInterval: boolean = false;
    public showCustomUpdateBtn: boolean = false;

    public mode = 'N';
    public setFocusComponentTypeCode = new EventEmitter<boolean>();
    public setFocusProductComponentDesc = new EventEmitter<boolean>();
    public storeValues: any = {};
    public ellipsisConfig = {
        attribute1: {
            showCloseButton: true,
            showHeader: true,
            showAddNew: false,
            childConfigParams: {
                parentMode: 'Attribute1',
                AttributeCode: '',
                AttributeLabel: ''
            },
            component: ProductAttributeValuesSearchComponent,
            disabled: true
        },
        attribute2: {
            showCloseButton: true,
            showHeader: true,
            showAddNew: false,
            childConfigParams: {
                parentMode: 'Attribute2',
                AttributeCode: '',
                AttributeLabel: ''
            },
            component: ProductAttributeValuesSearchComponent,
            disabled: true
        },
        product: {
            showCloseButton: true,
            showHeader: true,
            component: ProductSearchGridComponent,
            parentMode: 'DisplayEntry',
            ProductCode: '',
            SelComponentTypeCode: '',
            disabled: true

        },
        alternateProduct: {
            showCloseButton: true,
            showHeader: true,
            component: ProductSearchGridComponent,
            parentMode: 'AlternateDisplayEntry',
            ProductCode: '',
            SelComponentTypeCode: '',
            disabled: true
        },
        productRange: {
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp',
            showAddNew: false,
            component: ScreenNotReadyComponent,//RangeHeaderSearch
            disabled: true
        }
    };

    public dropdown = {
        compTypeLangSearch: {
            inputParams: null,
            itemsToDisplay: ['ComponentTypeDescLang.ComponentTypeCode', 'ComponentTypeDescLang.ComponentTypeDescLang'],
            isDisabled: true,
            isRequired: true,
            triggerValidate: false,
            active: {
                id: '',
                text: ''
            }
        }
    };

    /**
     * Base Component Variables
     */
    public pageId: string = '';
    public controls = [
        //Primary Section
        { name: 'ContractNumber', disabled: true },
        { name: 'ContractName', disabled: true },
        { name: 'PremiseNumber', disabled: true },
        { name: 'PremiseName', disabled: true },
        { name: 'ProductCode', disabled: true },
        { name: 'ProductDesc', disabled: true },
        { name: 'ItemDescription', disabled: true },
        { name: 'PremiseLocationNumber', disabled: true },
        { name: 'PremiseLocationDesc', disabled: true },
        //Section 2
        { name: 'ComponentTypeCode', disabled: true, required: true },
        { name: 'ComponentTypeDesc', disabled: true },
        { name: 'ProductComponentCode', disabled: true, required: true },
        { name: 'ProductComponentDesc', disabled: true },
        { name: 'AttributeLabel1', disabled: true },
        { name: 'AttributeValue1', disabled: true },
        { name: 'AttributeLabel2', disabled: true },
        { name: 'AttributeValue2', disabled: true },
        { name: 'AlternateProductCode', disabled: true },
        { name: 'ComponentQuantity', disabled: true, required: true },
        { name: 'btnCompReplace', disabled: false },
        //Section 3
        { name: 'ProductRange', disabled: true },
        { name: 'ProductRangeDesc', disabled: true },
        { name: 'SequenceNumber', disabled: true },
        { name: 'RotationalRule', disabled: true },
        { name: 'RotationalInterval', disabled: true },
        { name: 'btnCustomUpdate', disabled: true },
        //hidden
        { name: 'ServiceCoverNumber' },
        { name: 'ServiceCoverItemNumber' },
        { name: 'ServiceCoverComponentNumber' },
        { name: 'SelProductCode' },
        { name: 'SelProductDesc' },
        { name: 'SelComponentTypeCode' },
        { name: 'ComponentTypeDescLang' },
        { name: 'LanguageCode' },
        { name: 'SelProductAlternateCode' },
        { name: 'AttributeCode1' },
        { name: 'AttributeCode2' },
        { name: 'SelAttributeValue1' },
        { name: 'SelAttributeValue2' },
        { name: 'ServiceCoverCompRotation' },
        { name: 'SelProductRange' },
        { name: 'SelProductRangeDesc' }
    ];

    constructor(injector: Injector, public routeAwayGlobals: RouteAwayGlobals) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERCOMPONENTENTRY;
        this.searchParams = this.getURLSearchParamObject();
        //this.utils.setTitle();
        this.promptTitle = MessageConstant.Message.DeleteRecord;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            if (this.pageParams.isReturningSCCmpntRpl)
                this.location.back();
        }
    }

    public ngAfterViewInit(): void {
        this.window_onload();
        this.routeAwayUpdateSaveFlag();
    }

    public ngOnDestroy(): void {
        this.routeAwayGlobals.resetRouteAwayFlags();
        super.ngOnDestroy();
    }

    /**
     * Method: window_onload()
     * Desc: Executed when page is loaded initially
     */
    public window_onload(): void {
        this.utils.setTitle(this.getTranslatedValue('Display Component Maintenance').value);
        this.serviceCoverROWID = this.riExchange.getParentAttributeValue('ServiceCoverComponentRowID');
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.setControlValue('PremiseLocationNumber', this.riExchange.getParentHTMLValue('PremiseLocationNumber'));
        this.setControlValue('PremiseLocationDesc', this.riExchange.getParentHTMLValue('PremiseLocationDesc'));
        this.setControlValue('ItemDescription', this.riExchange.getParentHTMLValue('ItemDescription'));
        this.dropdown.compTypeLangSearch.inputParams = {};
        this.dropdown.compTypeLangSearch.inputParams.ProductCode = this.riExchange.getParentHTMLValue('ProductCode');
        this.ddComponentType.fetchData(this.dropdown.compTypeLangSearch.inputParams);
        //Disbale ellipsis
        this.toggleEllipsis(true);
        this.getPageData();

    }

    /**
     *
     */
    public getPageData(): void {
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        searchParams.set('action', '0');
        searchParams.set('ServiceCoverComponentROWID', this.serviceCoverROWID);
        searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        searchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        searchParams.set('ProductCode', this.getControlValue('ProductCode'));
        searchParams.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber'));
        searchParams.set('ServiceCoverItemNumber', this.getControlValue('ServiceCoverItemNumber'));
        searchParams.set('ServiceCoverComponentNumber', this.getControlValue('ServiceCoverComponentNumber'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }

                this.setControlValue('ServiceCoverNumber', data.ServiceCoverNumber);
                this.setControlValue('ServiceCoverItemNumber', data.ServiceCoverItemNumber);
                this.setControlValue('ServiceCoverComponentNumber', data.ServiceCoverComponentNumber);
                this.setControlValue('ComponentTypeCode', data.ComponentTypeCode);
                this.setControlValue('ComponentTypeDesc', data.ComponentTypeDesc);
                this.setControlValue('ProductComponentCode', data.ProductComponentCode);
                this.setControlValue('ProductComponentDesc', data.ProductComponentDesc);
                this.setControlValue('ComponentQuantity', data.ComponentQuantity);
                this.setControlValue('AlternateProductCode', data.AlternateProductCode);
                this.setControlValue('AttributeLabel1', data.AttributeLabel1);
                this.setControlValue('AttributeValue1', data.AttributeValue1);
                this.setControlValue('AttributeCode1', data.AttributeCode1);
                this.setControlValue('AttributeLabel2', data.AttributeLabel2);
                this.setControlValue('AttributeValue2', data.AttributeValue2);
                this.setControlValue('AttributeCode2', data.AttributeCode2);
                this.setControlValue('ServiceCoverCompRotation', data.ServiceCoverCompRotation);
                this.setControlValue('ProductRange', data.ProductRange);
                this.setControlValue('ProductRangeDesc', data.ProductRangeDesc);
                this.setControlValue('SequenceNumber', data.SequenceNumber);
                this.setControlValue('RotationalRule', data.RotationalRule);
                this.setControlValue('RotationalInterval', data.RotationalInterval);
                this.ellipsisConfig.product.ProductCode = this.getControlValue('ProductCode');
                this.ellipsisConfig.product.SelComponentTypeCode = this.getControlValue('ComponentTypeCode');
                this.ellipsisConfig.alternateProduct.ProductCode = this.getControlValue('ProductCode');
                this.ellipsisConfig.alternateProduct.SelComponentTypeCode = this.getControlValue('ComponentTypeCode');
                this.ellipsisConfig.attribute1.childConfigParams.AttributeCode = this.getControlValue('AttributeCode1');
                this.ellipsisConfig.attribute1.childConfigParams.AttributeLabel = this.getControlValue('AttributeLabel1');
                this.ellipsisConfig.attribute2.childConfigParams.AttributeCode = this.getControlValue('AttributeCode2');
                this.ellipsisConfig.attribute2.childConfigParams.AttributeLabel = this.getControlValue('AttributeLabel2');
                this.dropdown.compTypeLangSearch.active = {
                    id: data.ComponentTypeCode,
                    text: data.ComponentTypeCode + ' - ' + data.ComponentTypeDesc
                };
                this.fetchRecords();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            });
    }

    /**
     *
     */
    public fetchRecords(): void {
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        searchParams.set('action', '6');

        let bodyParams: Object = {
            'Function': 'DummyProductCodeList,SingleQtyComponents',
            'ProductCode': this.getControlValue('ProductCode')
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }
                if (data['DummyProductCodes']) {
                    if (data['DummyProductCodes'].indexOf('|') >= 0) {
                        this.dummyProductCodes = data['DummyProductCodes'].split('|');
                    } else {
                        this.dummyProductCodes = data['DummyProductCodes'].split('');
                    }
                }
                if (data['SingleQtyComponents']) {
                    if (data['SingleQtyComponents'].indexOf('|') >= 0) {
                        this.singleQtyComponents = data['SingleQtyComponents'].split('|');
                    } else {
                        this.singleQtyComponents = data['SingleQtyComponents'].split('');
                    }
                }

                this.riMaintenance_AfterFetch();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            });
    }

    /**
     *
     */
    public riMaintenance_AfterFetch(): void {
        let serviceCoverCompRotation = this.getControlValue('ServiceCoverCompRotation');
        if (serviceCoverCompRotation === 'yes') {
            this.showComponentRange = true;
            let rotationalRule = this.getControlValue('RotationalRule').toUpperCase();

            if (rotationalRule === 'C' || rotationalRule === 'S') {
                this.showRotationalInterval = true;
            } else {
                this.showRotationalInterval = false;
            }

            if (rotationalRule === 'C') {
                this.showCustomUpdateBtn = true;
                //disable Product Range - auto populated
                this.riExchange.riInputElement.Disable(this.uiForm, 'ProductRange');
            } else {
                this.showCustomUpdateBtn = false;
            }
        } else {
            this.showComponentRange = false;
        }
        this.setFormMode(this.c_s_MODE_UPDATE);
    }

    /**
     * Method gets executed when Add button is clicked
     */
    public riMaintenance_BeforeAdd(): void {
        this.mode = 'A';
        this.setControlValue('ServiceCoverComponentNumber', 1);
        this.updateFieldDisableStatus();
        this.clearFieldValues();
        this.setFocusComponentTypeCode.emit(true);
        this.setFormMode(this.c_s_MODE_ADD);
        //Enable Ellipis
        this.toggleEllipsis(false);
        this.ellipsisConfig.attribute1.childConfigParams.AttributeCode = '';
        this.ellipsisConfig.attribute1.childConfigParams.AttributeLabel = '';
        this.ellipsisConfig.attribute2.childConfigParams.AttributeCode = '';
        this.ellipsisConfig.attribute2.childConfigParams.AttributeLabel = '';
    }

    /**
     * Method gets executed when Update button is clicked
     */
    public riMaintenance_BeforeUpdate(): void {
        this.mode = 'U';
        this.updateFieldDisableStatus();
        this.componentTypeCode_onChange();
        //Enable ellipsis
        this.toggleEllipsis(false);
        this.setFormMode(this.c_s_MODE_UPDATE);
        let productComponentCode = this.getControlValue('ProductComponentCode');
        if (productComponentCode !== '' || productComponentCode) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
            for (let i in this.dummyProductCodes) {
                if (this.dummyProductCodes[i]) {
                    if (this.dummyProductCodes[i].toString().toUpperCase() === productComponentCode.toUpperCase()) {
                        this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDesc');
                        this.setFocusProductComponentDesc.emit(true);
                        return;
                    }
                }
            }
        } else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
            this.setControlValue('ProductComponentDesc', '');
        }

        let rotationalRule = this.getControlValue('RotationalRule').toUpperCase();
        if (rotationalRule === 'C') {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductRange');
        }

        this.setFocusComponentTypeCode.emit(true);
        this.ellipsisConfig.attribute1.childConfigParams.AttributeCode = this.getControlValue('AttributeCode1');
        this.ellipsisConfig.attribute1.childConfigParams.AttributeLabel = this.getControlValue('AttributeLabel1');
        this.ellipsisConfig.attribute2.childConfigParams.AttributeCode = this.getControlValue('AttributeCode2');
        this.ellipsisConfig.attribute2.childConfigParams.AttributeLabel = this.getControlValue('AttributeLabel2');
    }

    /**
     * Method gets executed when Save button is clicked
     */
    public riMaintenance_BeforeSave(): void {
        if (!this.getControlValue('ComponentTypeCode')) {
            this.dropdown.compTypeLangSearch.triggerValidate = true;
        }
        if (!this.uiForm.valid) {
            for (let control in this.uiForm.controls) {
                if (control) {
                    this.uiForm.controls[control].markAsTouched();
                }
            }
        }
        //if (this.uiForm.valid) {
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        searchParams.set('action', '6');

        let bodyParams: Object = {
            'Function': 'PopulateFields',
            'PremiseNumber': this.getControlValue('PremiseNumber'),
            'ProductCode': this.getControlValue('ProductCode'),
            'ServiceCoverNumber': this.getControlValue('ServiceCoverNumber'),
            'ComponentTypeCode': this.getControlValue('ComponentTypeCode'),
            'ProductComponentCode': this.getControlValue('ProductComponentCode')
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.dropdown.compTypeLangSearch.triggerValidate = false;
                if (!this.getControlValue('ComponentTypeCode')) {
                    this.dropdown.compTypeLangSearch.triggerValidate = true;
                }
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }

                let include: Boolean = false;
                if (data['ComponentTypeDesc']) {
                    this.setControlValue('ComponentTypeDesc', data.ComponentTypeDesc.toUpperCase());
                }
                if (data['ProductComponentDesc']) {
                    this.setControlValue('ProductComponentDesc', data.ProductComponentDesc);
                }

                let productComponentCode = this.getControlValue('ProductComponentCode').toUpperCase();
                let productComponentDesc = this.getControlValue('ProductComponentDesc');
                for (let productCode in this.dummyProductCodes) {
                    if (this.dummyProductCodes[productCode]) {
                        if (productComponentCode.toString().toUpperCase() === this.dummyProductCodes[productCode].toUpperCase() && productComponentDesc !== '') {
                            include = false;
                            break;
                        }
                    }
                }
                if (include) {
                    this.setControlValue('ProductComponentDesc', data.ProductComponentDesc);
                }

                this.riMaintenance_SaveRecord();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            });
        //}

    }

    /**
     * Method gets executed after succesful completion of PopulateFields API
     */
    public riMaintenance_SaveRecord(): void {

        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        if (this.mode === 'A') {
            searchParams.set('action', '1');
        } else {
            searchParams.set('action', '2');
        }

        let bodyParams: Object = {
            'ComponentTypeCode': this.getControlValue('ComponentTypeCode'),
            'ComponentTypeDesc': this.getControlValue('ComponentTypeDesc'),
            'ProductComponentDesc': this.getControlValue('ProductComponentDesc'),
            'PremiseLocationNumber': this.getControlValue('PremiseLocationNumber'),
            'PremiseLocationDesc': this.getControlValue('PremiseLocationDesc'),
            'ItemDescription': this.getControlValue('ItemDescription'),
            'AttributeLabel1': this.getControlValue('AttributeLabel1'),
            'AttributeValue1': this.getControlValue('AttributeValue1'),
            'AttributeCode1': this.getControlValue('AttributeCode1'),
            'AttributeLabel2': this.getControlValue('AttributeLabel2'),
            'AttributeValue2': this.getControlValue('AttributeValue2'),
            'AttributeCode2': this.getControlValue('AttributeCode2'),
            'ServiceCoverCompRotation': this.getControlValue('ServiceCoverCompRotation'),
            'ProductRangeDesc': this.getControlValue('ProductRangeDesc'),
            'SequenceNumber': this.getControlValue('SequenceNumber'),
            'RotationalInterval': this.getControlValue('RotationalInterval'),
            'ContractNumber': this.getControlValue('ContractNumber'),
            'PremiseNumber': this.getControlValue('PremiseNumber'),
            'ProductCode': this.getControlValue('ProductCode'),
            'ServiceCoverNumber': this.getControlValue('ServiceCoverNumber'),
            'ServiceCoverItemNumber': this.getControlValue('ServiceCoverItemNumber'),
            'ServiceCoverComponentNumber': this.getControlValue('ServiceCoverComponentNumber'),
            'ProductComponentCode': this.getControlValue('ProductComponentCode'),
            'ComponentQuantity': this.getControlValue('ComponentQuantity'),
            'AlternateProductCode': this.getControlValue('AlternateProductCode'),
            'ProductRange': this.getControlValue('ProductRange'),
            'RotationalRule': this.getControlValue('RotationalRule')
        };

        if (this.mode === 'U') {
            bodyParams['ServiceCoverComponentROWID'] = this.serviceCoverROWID;
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }
                if (this.mode === 'A') {
                    this.setControlValue('ServiceCoverComponentNumber', data.ServiceCoverComponentNumber);
                    this.serviceCoverROWID = data.RowID;
                    this.setControlValue('ProductRange', data.ProductRange);
                }
                this.updateFieldDisableStatus();// save new value
                this.mode = 'N';
                this.updateFieldDisableStatus();// restire saved values and disable fields
                this.routeAwayComponent.resetDirtyFlagAfterSaveUpdate();
                this.setFormMode(this.c_s_MODE_SELECT);
                //Disable ellipsis
                this.toggleEllipsis(true);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                this.errorService.emitError(error);
                this.setFormMode(this.c_s_MODE_SELECT);
            });
    }

    /**
     * Method gets executed when Abandon button is clicked
     */
    public riMaintenance_AfterAbandon(): void {
        this.mode = 'N';
        this.routeAwayComponent.resetDirtyFlagAfterSaveUpdate();
        this.updateFieldDisableStatus();
        this.setFormMode(this.c_s_MODE_SELECT);
        //Disable ellipsis
        this.toggleEllipsis(true);
        this.formPristine();
        this.dropdown.compTypeLangSearch.triggerValidate = false;
        for (let control in this.uiForm.controls) {
            if (control) {
                this.uiForm.controls[control].markAsUntouched();
            }
        }
        //    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'ProductComponentCode', false);
        //    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'ComponentQuantity', false);
    }

    /**
     * Method gets executed when Delete button is clicked
     */
    public riMaintenance_BeforeDelete(): void {
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        searchParams.set('action', '3');

        this.setFormMode(this.c_s_MODE_UPDATE);
        let bodyParams: Object = {
            'ContractNumber': this.getControlValue('ContractNumber'),
            'PremiseNumber': this.getControlValue('PremiseNumber'),
            'ProductCode': this.getControlValue('ProductCode'),
            'ServiceCoverNumber': this.getControlValue('ServiceCoverNumber'),
            'ServiceCoverItemNumber': this.getControlValue('ServiceCoverItemNumber'),
            'ServiceCoverComponentNumber': this.getControlValue('ServiceCoverComponentNumber')
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }
                this.location.back();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                this.errorService.emitError(error);
            });

    }

    /**
     * Method gets executed after ComponentTypeCode input field on blur()
     */
    public componentTypeCode_onChange(): void {
        this.riExchange.riInputElement.Enable(this.uiForm, 'ComponentQuantity');
        let componentTypeCode = this.getControlValue('ComponentTypeCode');
        //if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'HasChanged')) {
        if (this.getControlValue('ComponentTypeCode')) {
            this.ellipsisConfig.product.ProductCode = this.getControlValue('ProductCode');
            this.ellipsisConfig.product.SelComponentTypeCode = this.getControlValue('ComponentTypeCode');
            this.ellipsisConfig.alternateProduct.ProductCode = this.getControlValue('ProductCode');
            this.ellipsisConfig.alternateProduct.SelComponentTypeCode = this.getControlValue('ComponentTypeCode');
            for (let component in this.singleQtyComponents) {
                if (this.singleQtyComponents[component]) {
                    if (componentTypeCode.toString().toUpperCase() === this.singleQtyComponents[component].toUpperCase()) {
                        this.setControlValue('ComponentQuantity', 1);
                        this.riExchange.riInputElement.Disable(this.uiForm, 'ComponentQuantity');
                        return;
                    }
                }
            }

            this.populateAttributes();
        }
        else {
            this.setControlValue('ComponentTypeDesc', '');
            this.setControlValue('ProductComponentCode', '');
            this.setControlValue('ProductComponentDesc', '');
            this.setControlValue('ComponentQuantity', '');
            this.setControlValue('AttributeLabel1', '');
            this.setControlValue('AttributeValue1', '');
            this.setControlValue('AttributeLabel2', '');
            this.setControlValue('AttributeValue2', '');
            this.ellipsisConfig.product.SelComponentTypeCode = 'All';
            this.ellipsisConfig.alternateProduct.SelComponentTypeCode = 'All';
        }
        //}
    }

    /**
     *  Method gets executed after ProductComponentCode input field on blur()
     */
    public productComponentCode_onChange(): void {
        let productComponentCode = this.getControlValue('ProductComponentCode');

        if (productComponentCode) {
            let searchParams: URLSearchParams = this.getURLSearchParamObject();
            searchParams.set('action', '6');
            searchParams.set('Function', 'GetProductValues');
            searchParams.set('ProductComponentCode', productComponentCode);

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                        return;
                    }

                    this.setControlValue('AlternateProductCode', data.AlternateProductCode.toUpperCase());
                    this.setControlValue('ProductComponentDesc', data.ProductComponentDesc);
                    this.displayRotational();
                    this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
                    for (let productCode in this.dummyProductCodes) {
                        if (this.dummyProductCodes[productCode]) {
                            if (this.dummyProductCodes[productCode].toString().toUpperCase() === productComponentCode.toUpperCase()) {
                                this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDesc');
                                this.setFocusProductComponentDesc.emit(true);
                                return;
                            }
                        }
                    }
                },
                // tslint:disable-next-line:no-empty
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });


        } else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
            this.setControlValue('ProductComponentDesc', '');
            this.setControlValue('AlternateProductCode', '');
            this.setControlValue('ProductRange', '');
            this.setControlValue('RotationalRule', '');
            this.showComponentRange = false;
        }

        //ProductComponentDesc.title = this.getControlValue( 'ProductComponentDesc');
    }

    /**
     * Method gets executed after ProductRange input field on blur()
     */
    public productRange_onChange(): void {
        let productRange = this.getControlValue('ProductRange');

        if (productRange) {
            let searchParams: URLSearchParams = this.getURLSearchParamObject();
            searchParams.set('action', '6');
            searchParams.set('Function', 'GetRange');
            searchParams.set('ProductRange', this.getControlValue('ProductRange'));
            searchParams.set('ProductComponentCode', this.getControlValue('ProductComponentCode'));

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                        return;
                    }
                    if (data) {
                        this.setControlValue('ProductRangeDesc', data.ProductRangeDesc);
                        this.setControlValue('SequenceNumber', data.SequenceNumber);
                        this.setControlValue('RotationalInterval', data.RotationalInterval);
                    } else {
                        this.setControlValue('ProductRange', '');
                        this.setControlValue('ProductRangeDesc', '');
                        this.setControlValue('SequenceNumber', '0');
                        this.setControlValue('RotationalInterval', '0');
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.errorService.emitError(error);
                });
        } else {
            this.setControlValue('ProductRange', '');
            this.setControlValue('ProductRangeDesc', '');
            this.setControlValue('SequenceNumber', '0');
            this.setControlValue('RotationalInterval', '0');
        }
    }

    /**
     * Method gets executed after RotationalRule input field on blur()
     * Rotation Period only displayed for Schedule or Custom Rule
     */
    public rotationalRule_onChange(): void {
        let rotationalRule = this.getControlValue('RotationalRule').toUpperCase();

        if (rotationalRule === 'C' || rotationalRule === 'S') {
            this.showRotationalInterval = true;
        } else {
            this.showRotationalInterval = false;
        }

        //Enable update button if Custom selected
        if (rotationalRule === 'C') {
            this.showCustomUpdateBtn = true;

            let searchParams: URLSearchParams = this.getURLSearchParamObject();
            searchParams.set('action', '6');
            searchParams.set('Function', 'DefaultCustomRange');
            searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
            searchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
            searchParams.set('ProductCode', this.getControlValue('ProductCode'));
            searchParams.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber'));
            searchParams.set('ServiceCoverItemNumber', this.getControlValue('ServiceCoverItemNumber'));
            searchParams.set('ServiceCoverComponentNumber', this.getControlValue('ServiceCoverComponentNumber'));
            searchParams.set('ProductComponentCode', this.getControlValue('ProductComponentCode'));
            searchParams.set('ProductComponentDesc', this.getControlValue('ProductComponentDesc'));

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                        return;
                    }

                    if (data) {
                        this.setControlValue('ProductRange', data.ProductRange);
                        this.setControlValue('ProductRangeDesc', this.getControlValue('PremiseName'));
                        this.setControlValue('SequenceNumber', data.SequenceNumber);
                        this.setControlValue('RotationalInterval', data.RotationalInterval);
                    } else {
                        this.setControlValue('ProductRange', '');
                        this.setControlValue('ProductRangeDesc', '');
                        this.setControlValue('SequenceNumber', '');
                        this.setControlValue('RotationalInterval', '');
                    }
                    //disable Product Range - auto populated
                    this.riExchange.riInputElement.Disable(this.uiForm, 'ProductRange');

                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        } else {
            this.showCustomUpdateBtn = false;
            this.riExchange.riInputElement.Enable(this.uiForm, 'ProductRange');
        }
    }

    /**
     * Method gets executed after AlternateProductCode input field on blur()
     * Rotation Period only displayed for Schedule or Custom Rule
     */
    public alternateProductCode_onChange(): void {
        let alternateProductCode = this.getControlValue('AlternateProductCode');

        if (alternateProductCode) {
            let searchParams: URLSearchParams = this.getURLSearchParamObject();
            searchParams.set('action', '6');
            searchParams.set('Function', 'GetAlternateProductValues');
            searchParams.set('AlternateProductCode', this.getControlValue('AlternateProductCode'));

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                        return;
                    }

                    this.setControlValue('ProductComponentCode', data.ProductComponentCode.toUpperCase());
                    this.setControlValue('ProductComponentDesc', data.ProductComponentDesc);

                    this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');

                    for (let productCode in this.dummyProductCodes) {
                        if (this.dummyProductCodes[productCode]) {
                            if (data.ProductComponentCode.toUpperCase() === this.dummyProductCodes[productCode].toUpperCase()) {
                                this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDesc');
                                this.setFocusProductComponentDesc.emit(true);
                                return;
                            }
                        }
                    }
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'ProductComponentDesc', false);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    /**
     * Method gets executed after Attribute1 ellipsis is clicked
     */
    public attributeValue1_onkeydown(data: any): void {
        console.log('data - keydown', data);
        this.setControlValue('AttributeValue1', data.SelAttributeValue1);
    }

    /**
     * Method gets executed after Attribute2 ellipsis is clicked
     */
    public attributeValue2_onkeydown(data: any): void {
        console.log('data - keydown', data);
        this.setControlValue('AttributeValue2', data.SelAttributeValue2);
    }

    /**
     * Method gets executed after Attribute1 ellipsis is clicked
     */
    public productRange_onkeydown(data: any): void {
        let productRange = this.getControlValue('ProductRange');
        let productRangeDesc = this.getControlValue('ProductRangeDesc');
        this.setControlValue('SelProductRange', productRange);
        this.setControlValue('SelProductRangeDesc', productRangeDesc);
    }

    /**
     * Method is called to enable/disable formfields
     */
    public updateFieldDisableStatus(): void {
        if (this.mode === 'N') {
            this.dropdown.compTypeLangSearch.isDisabled = true;
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentCode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'AlternateProductCode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'AttributeValue1');
            this.riExchange.riInputElement.Disable(this.uiForm, 'AttributeValue2');
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
            this.riExchange.riInputElement.Disable(this.uiForm, 'ComponentQuantity');
            this.riExchange.riInputElement.Enable(this.uiForm, 'btnCompReplace');
            this.restoreFieldValues();
        } else {
            this.dropdown.compTypeLangSearch.isDisabled = false;
            this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'AlternateProductCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'AttributeValue1');
            this.riExchange.riInputElement.Enable(this.uiForm, 'AttributeValue2');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDesc');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ComponentQuantity');
            this.riExchange.riInputElement.Disable(this.uiForm, 'btnCompReplace');
            this.storeFieldValues();
        }
    }

    /**
     *  Method is called to store formfields before Add/Update
     */
    public storeFieldValues(): void {
        this.storeValues.ComponentTypeCode = this.getControlValue('ComponentTypeCode');
        this.storeValues.ComponentTypeDesc = this.getControlValue('ComponentTypeDesc');
        this.storeValues.ProductComponentCode = this.getControlValue('ProductComponentCode');
        this.storeValues.ProductComponentDesc = this.getControlValue('ProductComponentDesc');
        this.storeValues.ComponentQuantity = this.getControlValue('ComponentQuantity');
        this.storeValues.AlternateProductCode = this.getControlValue('AlternateProductCode');
        this.storeValues.AttributeLabel1 = this.getControlValue('AttributeLabel1');
        this.storeValues.AttributeValue1 = this.getControlValue('AttributeValue1');
        this.storeValues.AttributeLabel2 = this.getControlValue('AttributeLabel2');
        this.storeValues.AttributeValue2 = this.getControlValue('AttributeValue2');
        this.storeValues.ProductRange = this.getControlValue('ProductRange');
        this.storeValues.ProductRangeDesc = this.getControlValue('ProductRangeDesc');
        this.storeValues.SequenceNumber = this.getControlValue('SequenceNumber');
        this.storeValues.RotationalRule = this.getControlValue('RotationalRule');
        this.storeValues.RotationalInterval = this.getControlValue('RotationalInterval');
    }

    /**
     *  Method is called to store formfields back to original values when Abandon is clicked
     */
    public restoreFieldValues(): void {
        this.setControlValue('ComponentTypeCode', this.storeValues.ComponentTypeCode);
        this.setControlValue('ComponentTypeDesc', this.storeValues.ComponentTypeDesc);
        this.setControlValue('ProductComponentCode', this.storeValues.ProductComponentCode);
        this.setControlValue('ProductComponentDesc', this.storeValues.ProductComponentDesc);
        this.setControlValue('ComponentQuantity', this.storeValues.ComponentQuantity);
        this.setControlValue('AlternateProductCode', this.storeValues.AlternateProductCode);
        this.setControlValue('AttributeLabel1', this.storeValues.AttributeLabel1);
        this.setControlValue('AttributeValue1', this.storeValues.AttributeValue1);
        this.setControlValue('AttributeLabel2', this.storeValues.AttributeLabel2);
        this.setControlValue('AttributeValue2', this.storeValues.AttributeValue2);
        this.setControlValue('ProductRange', this.storeValues.ProductRange);
        this.setControlValue('ProductRangeDesc', this.storeValues.ProductRangeDesc);
        this.setControlValue('SequenceNumber', this.storeValues.SequenceNumber);
        this.setControlValue('RotationalRule', this.storeValues.RotationalRule);
        this.setControlValue('RotationalInterval', this.storeValues.RotationalInterval);
        this.dropdown.compTypeLangSearch.active = {
            id: this.storeValues.ComponentTypeCode,
            text: this.storeValues.ComponentTypeCode + ' - ' + this.storeValues.ComponentTypeDesc
        };
    }

    /**
     *  Method is called to clearFieldValues formfields before Add/Update
     */
    public clearFieldValues(): void {
        this.setControlValue('ComponentTypeCode', '');
        this.setControlValue('ComponentTypeDesc', '');
        this.setControlValue('ProductComponentCode', '');
        this.setControlValue('ProductComponentDesc', '');
        this.setControlValue('ComponentQuantity', '');
        this.setControlValue('AlternateProductCode', '');
        this.setControlValue('AttributeLabel1', '');
        this.setControlValue('AttributeValue1', '');
        this.setControlValue('AttributeLabel2', '');
        this.setControlValue('AttributeValue2', '');
        this.setControlValue('ProductRange', '');
        this.setControlValue('ProductRangeDesc', '');
        this.setControlValue('SequenceNumber', '');
        this.setControlValue('RotationalRule', '');
        this.setControlValue('RotationalInterval', '');
        this.dropdown.compTypeLangSearch.active = {
            id: '',
            text: ''
        };
    }

    /**
     * hide/display rotational fields
     */
    public displayRotational(): void {
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        searchParams.set('action', '6');
        searchParams.set('Function', 'DisplayRotational');
        searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        searchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        searchParams.set('ProductCode', this.getControlValue('ProductCode'));
        searchParams.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber'));
        searchParams.set('ServiceCoverItemNumber', this.getControlValue('ServiceCoverItemNumber'));
        searchParams.set('ServiceCoverComponentNumber', this.getControlValue('ServiceCoverComponentNumber'));
        searchParams.set('ProductComponentCode', this.getControlValue('ProductComponentCode'));
        searchParams.set('ProductComponentDesc', this.getControlValue('ProductComponentDesc'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }
                if (data.RotationalProductInd === 'yes') {
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProductRange', true);
                    this.showComponentRange = true;
                    this.setControlValue('ProductRange', data.ProductRange);
                    this.setControlValue('ProductRangeDesc', data.ProductRangeDesc);
                    this.setControlValue('SequenceNumber', data.SequenceNumber);
                    this.setControlValue('RotationalRule', data.RotationalRule);
                    this.setControlValue('RotationalInterval', data.RotationalInterval);

                    if (data.RotationalRule === 'C') {
                        this.setControlValue('ProductRangeDesc',
                            this.getControlValue('PremiseName'));
                    }
                } else {
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProductRange', false);
                    this.showComponentRange = false;
                    this.setControlValue('ProductRange', '');
                    this.setControlValue('ProductRangeDesc', '');
                    this.setControlValue('SequenceNumber', '');
                    this.setControlValue('RotationalRule', '');
                    this.setControlValue('RotationalInterval', '');
                }
                this.rotationalRule_onChange();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            });
    }

    /**
     * Populate Attributes before Save Operation
     */
    public populateAttributes(): void {
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        searchParams.set('action', '6');

        let bodyParams: Object = {
            'Function': 'PopulateAttributes',
            'ProductCode': this.getControlValue('ProductCode'),
            'ComponentTypeCode': this.getControlValue('ComponentTypeCode')
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }
                this.setControlValue('AttributeLabel1', data.AttributeLabel1);
                this.setControlValue('AttributeLabel2', data.AttributeLabel2);
                this.setControlValue('AttributeCode1', data.AttributeCode1);
                this.setControlValue('AttributeCode2', data.AttributeCode2);

                if (data.AttributeMandatory1 === 'yes') {
                    this.attr1Mandatory = true;
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AttributeValue1', true);
                } else {
                    this.attr1Mandatory = false;
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AttributeValue1', false);
                }

                if (data.AttributeMandatory2 === 'yes') {
                    this.attr2Mandatory = true;
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AttributeValue2', true);
                } else {
                    this.attr2Mandatory = false;
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AttributeValue2', false);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            });
    }

    /**
     * Check if Product is Valid on Product Code change
     */
    public checkValidProduct(): void {
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        searchParams.set('action', '6');
        searchParams.set('Function', 'CheckValidProduct');
        searchParams.set('ProductComponentCode', this.getControlValue('ProductComponentCode'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    this.errorMessageFlag = true;
                    return;
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            });
    }
    /**
     *
     */
    public productCode_OnChange(e: any, name: any): void {
        this.setControlValue('SelProductCode', this.getControlValue('ProductComponentCode'));
        this.setControlValue('SelProductAlternateCode', this.getControlValue('AlternateProductCode'));
        this.setControlValue('SelProductDesc', this.getControlValue('ProductComponentDesc'));
        this.setControlValue('SelComponentTypeCode', this.getControlValue('ComponentTypeCode'));

        if (name === 'AlternateProduct') {
            this.setControlValue('ProductComponentCode', e.ProductCode);
            this.setControlValue('AlternateProductCode', e.PrimaryAlternateCode);
            this.setControlValue('ProductComponentDesc', e.ProductDesc);
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
            for (let productCode in this.dummyProductCodes) {
                if (this.dummyProductCodes[productCode]) {
                    if (e.ProductCode.toString().toUpperCase() === this.dummyProductCodes[productCode].toUpperCase()) {
                        this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDesc');
                        this.setFocusProductComponentDesc.emit(true);
                        return;
                    }
                }
            }
        } else {
            this.setControlValue('ProductComponentCode', e.ProductCode);
            this.setControlValue('AlternateProductCode', e.PrimaryAlternateCode);
            this.setControlValue('ProductComponentDesc', e.ProductDesc);
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
            for (let productCode in this.dummyProductCodes) {
                if (this.dummyProductCodes[productCode]) {
                    if (this.dummyProductCodes[productCode].toString().toUpperCase() === e.ProductCode.toString().toUpperCase()) {
                        this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDesc');
                        this.setFocusProductComponentDesc.emit(true);
                        return;
                    }
                }
            }
        }
    }

    public onCapitalize(control: any): void {
        if (this.uiForm.controls[control])
            this.uiForm.controls[control].setValue(this.uiForm.controls[control].value.toString().toUpperCase());
    }

    public capitalizeFirstLetter(control: any): void {
        if (this.uiForm.controls[control])
            this.uiForm.controls[control].setValue(this.utils.toTitleCase(this.uiForm.controls[control].value));
    }

    /**
     * On Button Delete click
     */
    public btnDelete_Click(): void {
        this.promptModal.show();
    }


    /**
     * Opens modal to confirm Delete operation
     */
    public promptSave(ev: any): void {
        this.riMaintenance_BeforeDelete();
    }

    /**
     * Calls when button Replace is clicked
     */
    public btnCompReplace_onClick(): void {
        this.pageParams.isReturningSCCmpntRpl = true;
        this.navigate('DisplayEntry', InternalMaintenanceSalesModuleRoutes.ICABSASERVICECOVERCOMPONENTREPLACEMENT, {
            'ServiceCoverComponentRowID': this.serviceCoverROWID
        });
    }

    /**
     * Calls when button Custonm Update is clicked
     */
    public btnCustomUpdate_onClick(): void {
        this.checkValidProduct();

        if (!this.errorMessageFlag) {
            this.navigate('CustomComponentUpdate', 'business/RangeDetailGrid');
        }
    }

    /**
     * To Prevent route to another page when in Add/update mode
     */
    public routeAwayUpdateSaveFlag(): void {
        this.uiForm.statusChanges.subscribe((value: any) => {
            if (this.mode !== 'N') {
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            } else {
                this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    }

    private toggleEllipsis(flag: boolean): void {
        //Enable/Disbale ellipsis
        this.ellipsisConfig.product.disabled = flag;
        this.ellipsisConfig.alternateProduct.disabled = flag;
        this.ellipsisConfig.attribute1.disabled = flag;
        this.ellipsisConfig.attribute2.disabled = flag;
    }

    public onSelectCompTypeLangSearchDD(data: any): void {
        this.setControlValue('ComponentTypeCode', data['ComponentTypeDescLang.ComponentTypeCode']);
        this.setControlValue('ComponentTypeDesc', data['ComponentTypeDescLang.ComponentTypeDescLang']);
        this.ellipsisConfig.product.ProductCode = this.getControlValue('ProductCode');
        this.ellipsisConfig.product.SelComponentTypeCode = this.getControlValue('ComponentTypeCode');
        this.ellipsisConfig.alternateProduct.ProductCode = this.getControlValue('ProductCode');
        this.ellipsisConfig.alternateProduct.SelComponentTypeCode = this.getControlValue('ComponentTypeCode');
        this.populateAttributes();
    }
}
