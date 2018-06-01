import { Component, Injector, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { PageIdentifier } from '../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { ScreenNotReadyComponent } from '../../../shared/components/screenNotReady';
import { ProductDetailSearchComponent } from './../../internal/search/iCABSBProductDetailSearch.component';
import { InfestationLevelSearchComponent } from './../../internal/search/iCABSBInfestationLevelSearch.component';

@Component({
    templateUrl: 'iCABSSePDAiCABSInfestationMaintenance.html'
})

export class PDAInfestationMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('ProductDetailCode') productDetailCode;
    @ViewChild('InfestationLevelCode') infestationLevelCode;

    public pageId: string = '';
    public controls: Array<any> = [
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc', type: MntConst.eTypeText },
        { name: 'ProductDetailCode', type: MntConst.eTypeCode },
        { name: 'ProductDetailDesc', type: MntConst.eTypeText },
        { name: 'InfestationGroupCode', type: MntConst.eTypeInteger },
        { name: 'InfestationGroupDesc', type: MntConst.eTypeText },
        { name: 'InfestationLocationCode', type: MntConst.eTypeInteger },
        { name: 'InfestationLocationDesc', type: MntConst.eTypeText },
        { name: 'InfestationLevelCode', required: true, type: MntConst.eTypeInteger },
        { name: 'InfestationLevelDesc', type: MntConst.eTypeText },
        // hidden
        { name: 'BusinessCode', type: MntConst.eTypeText }
    ];

    // URL Query Parameters
    public queryParams: any = {
        operation: 'Service/iCABSSePDAiCABSInfestationMaintenance',
        module: 'pda',
        method: 'service-delivery/maintenance'
    };

    // Page level Variables
    public pageVariables = {
        disableSave: false,
        disableCancel: false,
        disableDelete: false,
        addMode: false
    };

    // Ellipsis configuration parameters
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
        infestationLocationCode: {
            isShowCloseButton: true,
            isShowHeader: true,
            isDisabled: false,
            childConfigParams: {
                parentMode: 'LookUp'
            },
            contentComponent: ScreenNotReadyComponent // TODO will be iCABSBInfestationLocationSearch component
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
        this.pageId = PageIdentifier.ICABSSEPDAICABSINFESTATIONMAINTENANCE;

        this.browserTitle = this.pageTitle = 'Infestation Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.window_onload();
        if (this.parentMode === '' || this.getAttribute('PDAICABSActivityRowID') === '') {
            this.pageVariables.disableSave = true;
            this.pageVariables.disableCancel = true;
            this.pageVariables.disableDelete = true;
            this.uiForm.disable();
            this.ellipsisParams.infestationLevelCode.isDisabled = true;
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // Initializes data into different controls on page load
    public window_onload(): void {
        switch (this.parentMode) {
            case 'Search':
            case 'SearchInfest':
            case 'SearchAdd':
                this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));

                if (this.parentMode !== 'SearchAdd') {
                    this.setControlValue('ProductDetailCode', this.riExchange.getParentHTMLValue('ProductDetailCode'));
                    this.setControlValue('InfestationGroupCode', this.riExchange.getParentHTMLValue('InfestationGroupCode'));
                    this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupCode = this.riExchange.getParentHTMLValue('InfestationGroupCode');
                    this.setControlValue('InfestationLocationCode', this.riExchange.getParentHTMLValue('InfestationLocationCode'));
                }
                break;
        }

        this.setAttribute('PDAICABSActivityRowID', this.riExchange.getParentAttributeValue('PDAICABSActivityRowID'));

        if (this.parentMode === 'SearchAdd') {
            this.setPageMode(MntConst.eModeAdd);
            this.buildAndCallLookup();
        } else {
            this.setPageMode(MntConst.eModeUpdate);
            this.fetchInitialRecord();
        }
    }

    public setPageMode(mode: string): void {
        switch (mode) {
            case MntConst.eModeAdd:
                this.riMaintenance.AddMode();
                this.pageVariables.disableDelete = true;
                this.productDetailCode.nativeElement.focus();
                this.pageVariables.addMode = true;
                break;
            case MntConst.eModeUpdate:
                this.riMaintenance.UpdateMode();
                this.pageVariables.disableDelete = false;
                this.infestationLevelCode.nativeElement.focus();
                this.pageVariables.addMode = false;
                break;
        }

        let flag = mode === MntConst.eModeUpdate;
        this.disableControl('ProductDetailCode', flag);
        this.disableControl('InfestationGroupCode', true);
        this.disableControl('InfestationLocationCode', flag);
        this.ellipsisParams.productDetailCode.isDisabled = flag;
        this.ellipsisParams.infestationLocationCode.isDisabled = flag;

        this.disableControl('ProductDetailDesc', true);
        this.disableControl('InfestationGroupDesc', true);
        this.disableControl('InfestationLocationDesc', true);
        this.disableControl('InfestationLevelDesc', true);

        if (mode === MntConst.eModeAdd) {
            this.setControlRequiredStatus('ProductDetailCode', true);
            this.setControlRequiredStatus('InfestationLocationCode', true);
            this.setControlRequiredStatus('InfestationLevelCode', true);
        } else {
            this.setControlRequiredStatus('InfestationLevelCode', true);
        }
    }

    public setControlRequiredStatus(ctrlName: string, status: boolean): void {
        this.riExchange.updateCtrl(this.controls, ctrlName, 'required', status);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, ctrlName, status);
    }

    // Build and call loopup for multiple controls
    public buildAndCallLookup(): void {
        this.setControlValue('BusinessCode', this.businessCode());
        this.riMaintenance.setIndependentVTableLookup(true);

        if (this.parentMode === 'SearchAdd') {
            this.riMaintenance.AddVirtualTable('Contract');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);

            this.riMaintenance.AddVirtualTable('Premise');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('PremiseName', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);

            this.riMaintenance.AddVirtualTable('Product');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('ProductCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('ProductDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
        }

        this.riMaintenance.AddVirtualTable('ProductDetail');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ProductDetailCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('ProductDetailDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('InfestationGroup');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('InfestationGroupCode', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('InfestationGroupDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('InfestationLevel');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('InfestationGroupCode', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableKey('InfestationLevelCode', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('InfestationLevelDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('InfestationLocation');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('InfestationLocationCode', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('InfestationLocationDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.Complete();

        this.disableControl('ContractNumber', true);
        this.disableControl('ContractName', true);
        this.disableControl('PremiseNumber', true);
        this.disableControl('PremiseName', true);
        this.disableControl('ProductCode', true);
        this.disableControl('ProductDesc', true);
    }

    // Populate data into the grid
    public fetchInitialRecord(): void {
        let _search = this.getURLSearchParamObject();
        _search.set('ProductDetailCode', this.getControlValue('ProductDetailCode'));
        _search.set('InfestationGroupCode', this.getControlValue('InfestationGroupCode'));
        _search.set('InfestationLocationCode', this.getControlValue('InfestationLocationCode'));
        _search.set('PDAICABSActivityRowID', this.getAttribute('PDAICABSActivityRowID'));
        _search.set(this.serviceConstants.Action, '0');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, _search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setAttribute('PDAICABSInfestationROWID', data.PDAICABSInfestation);
                    this.setControlValue('InfestationLevelCode', data.InfestationLevelCode);
                    this.buildAndCallLookup();
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
            case 'productDetailCode':
                this.setControlValue('ProductDetailCode', data.ProductDetailCode || '');
                this.setControlValue('ProductDetailDesc', data.ProductDetailDesc || '');
                this.productDetailCode_onchange(null);
                break;
            case 'infestationLocationCode':
                this.setControlValue('InfestationLocationCode', data.InfestationLocationCode || '');
                this.setControlValue('InfestationLocationDesc', data.InfestationLocationDesc || '');
                break;
            case 'infestationLevelCode':
                this.setControlValue('InfestationLevelCode', data.InfestationLevelCode || '');
                this.setControlValue('InfestationLevelDesc', data.InfestationLevelDesc || '');
                if (data.InfestationGroupCode) { this.setControlValue('InfestationGroupCode', data.InfestationGroupCode); }
                if (data.InfestationGroupDesc) { this.setControlValue('InfestationGroupDesc', data.InfestationGroupDesc); }
                break;
            default:
        }
    }

    // public ProductDetailCode OnChange event
    public productDetailCode_onchange(event: Event): void {
        if (this.getControlValue('ProductDetailCode') !== '') {
            let _formData: Object = {};
            let _search = this.getURLSearchParamObject();

            _search.set(this.serviceConstants.Action, '6');

            _formData['Function'] = 'GetDefaults';
            _formData['ProductDetailCode'] = this.getControlValue('ProductDetailCode');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, _search, _formData)
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

    // Form submit event
    public onSubmit(event: any): void {
        this.validateLookupData();
    }

    // Save record
    public saveRecord(): void {
        let _formData: Object = {};
        let _search = this.getURLSearchParamObject();

        _formData['ContractNumber'] = this.getControlValue('ContractNumber');
        _formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        _formData['ProductCode'] = this.getControlValue('ProductCode');
        _formData['ProductDetailCode'] = this.getControlValue('ProductDetailCode');
        _formData['InfestationGroupCode'] = this.getControlValue('InfestationGroupCode');
        _formData['InfestationLocationCode'] = this.getControlValue('InfestationLocationCode');
        _formData['InfestationLevelCode'] = this.getControlValue('InfestationLevelCode');
        _formData['PDAICABSActivityRowID'] = this.getAttribute('PDAICABSActivityRowID');

        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            _search.set(this.serviceConstants.Action, '1');
        } else if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            _search.set(this.serviceConstants.Action, '2');
            _formData['PDAICABSInfestationROWID'] = this.getAttribute('PDAICABSInfestationROWID');
            _formData['ContractName'] = this.getControlValue('ContractName');
            _formData['PremiseName'] = this.getControlValue('PremiseName');
            _formData['ProductDesc'] = this.getControlValue('ProductDesc');
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, _search, _formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                        this.setAttribute('PDAICABSInfestationROWID', data.PDAICABSInfestation);
                        this.setPageMode(MntConst.eModeUpdate);
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

    // Form delete event
    public delete_OnClick(event: any): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.DeleteRecord, null, this.deleteRecord.bind(this)));
    }

    // Delete record
    public deleteRecord(): void {
        let _formData: Object = {};
        let _search = this.getURLSearchParamObject();

        _search.set(this.serviceConstants.Action, '3');

        _formData['ProductDetailCode'] = this.getControlValue('ProductDetailCode');
        _formData['InfestationGroupCode'] = this.getControlValue('InfestationGroupCode');
        _formData['InfestationLocationCode'] = this.getControlValue('InfestationLocationCode');
        _formData['PDAICABSActivityRowID'] = this.getAttribute('PDAICABSActivityRowID');
        _formData['PDAICABSInfestationROWID'] = this.getAttribute('PDAICABSInfestationROWID');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, _search, _formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setPageMode(MntConst.eModeAdd);
                    this.cancel_OnClick(null);
                    this.setAttribute('PDAICABSInfestationROWID', '');
                    this.formPristine();
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordDeletedSuccessfully));
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Form cancel event
    public cancel_OnClick(event: any): void {
        this.formPristine();
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.setControlValue('ProductDetailCode', '');
            this.setControlValue('ProductDetailDesc', '');
            this.setControlValue('InfestationGroupCode', '');
            this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupCode = '';
            this.setControlValue('InfestationGroupDesc', '');
            this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupDesc = '';
            this.setControlValue('InfestationLocationCode', '');
            this.setControlValue('InfestationLocationDesc', '');
            this.setControlValue('InfestationLevelCode', '');
            this.setControlValue('InfestationLevelDesc', '');
        } else if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (this.getControlValue('ProductDetailCode') && this.getControlValue('InfestationGroupCode') &&
                this.getControlValue('InfestationLocationCode') && this.getAttribute('PDAICABSActivityRowID')) {
                this.fetchInitialRecord();
            }
        }
    }

    public validateLookupData(): void {
        let lookupIP_details = [{
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
            'query': { 'InfestationGroupCode': this.getControlValue('InfestationGroupCode'), 'InfestationLevelCode': this.getControlValue('InfestationLevelCode'), 'BusinessCode': this.businessCode },
            'fields': ['InfestationLevelDesc']
        },
        {
            'table': 'InfestationLocation',
            'query': { 'InfestationLocationCode': this.getControlValue('InfestationLocationCode'), 'BusinessCode': this.businessCode },
            'fields': ['InfestationLocationDesc']
        }];

        this.LookUp.lookUpRecord(lookupIP_details).subscribe((data) => {
            let productDetail = data[0][0];
            let infestationGroup = data[1][0];
            let infestationLevel = data[2][0];
            let infestationLocation = data[3][0];

            if (productDetail) {
                if (productDetail.ProductDetailDesc) {
                    this.setControlValue('ProductDetailDesc', productDetail.ProductDetailDesc);
                }
                if (productDetail.InfestationGroupCode) {
                    if (this.getControlValue('InfestationGroupCode').toString() !== productDetail.InfestationGroupCode.toString()) {
                        this.riExchange.riInputElement.markAsError(this.uiForm, 'InfestationGroupCode');
                    }
                }
            } else {
                this.riExchange.riInputElement.markAsError(this.uiForm, 'ProductDetailCode');
                this.riExchange.riInputElement.markAsError(this.uiForm, 'InfestationGroupCode');
                this.setControlValue('ProductDetailDesc', '');
            }

            if (infestationGroup) {
                if (infestationGroup.InfestationGroupDesc) {
                    this.setControlValue('InfestationGroupDesc', infestationGroup.InfestationGroupDesc);
                    this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupDesc = infestationGroup.InfestationGroupDesc;
                }
            } else {
                this.riExchange.riInputElement.markAsError(this.uiForm, 'InfestationGroupCode');
                this.setControlValue('InfestationGroupDesc', '');
                this.ellipsisParams.infestationLevelCode.childConfigParams.InfestationGroupDesc = '';
            }

            if (infestationLevel) {
                if (infestationLevel.InfestationLevelDesc) {
                    this.setControlValue('InfestationLevelDesc', infestationLevel.InfestationLevelDesc);
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

            if (this.riExchange.validateForm(this.uiForm)) {
                this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.saveRecord.bind(this)));
            }
        });
    }
}
