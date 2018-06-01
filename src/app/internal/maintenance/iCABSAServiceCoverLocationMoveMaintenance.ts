import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PremiseLocationAllocationGridComponent } from '../search/iCABSAPremiseLocationAllocationGrid';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { ServiceCoverSearchComponent } from '../search/iCABSAServiceCoverSearch';
import { RiExchange } from './../../../shared/services/riExchange';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { ServiceCoverLocationEffectDateSearchComponent } from '../search/iCABSAServiceCoverLocationEffectDateSearch.component';
import { MntConst } from '../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAServiceCoverLocationMoveMaintenance.html'
})

export class ServiceCoverLocationMoveMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('premiseLocationEllipsis') public premiseLocationEllipsis: EllipsisComponent;
    @ViewChild('effectDateEllipsis') public effectDateEllipsis: EllipsisComponent;
    @ViewChild('serviceCoverSearch') public serviceCoverSearch: EllipsisComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('EffectiveDateFrom') public EffectiveDateFrom: DatepickerComponent;
    @ViewChild('EffectiveDateTo') public EffectiveDateTo: DatepickerComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('confirmOkModal') public confirmOkModal;
    @ViewChild('promptModalForSave') public promptModalForSave;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public pageId: string = '';
    public pageTitle: string = '';
    public uiForm: FormGroup;
    public messageContentRecord: string;
    public messageContentSave: string;
    public errorMessage: string;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public search: URLSearchParams = new URLSearchParams();
    public inputParams: any = {};
    public pageParams: any;
    public fromDateDisplay;
    public toDateDisplay;
    public showMessageHeaderSave: boolean = true;
    public showHeader: boolean = true;
    public showPromptCloseButtonSave: boolean = true;
    public promptTitleSave: string = '';
    public promptContentSave = MessageConstant.Message.ConfirmRecord;
    public promptModalConfigSave = {
        ignoreBackdropClick: true
    };
    public queryParams: any = {
        operation: 'Application/iCABSAServiceCoverLocationMoveMaintenance',
        module: 'locations',
        method: 'service-delivery/maintenance'
    };
    public disabledSearch: boolean = false;
    public riExchange: RiExchange;
    public CurrentContractTypeURLParameter: string;
    public currentContractTypeLabel: string;
    public labelnumber: any;
    public controls = [
        { name: 'ContractNumber', disabled: true, required: true, type: MntConst.eTypeText },
        { name: 'ContractName', disabled: true, required: true, type: MntConst.eTypeText },
        { name: 'ServiceVisitFrequency', disabled: true, required: true, type: MntConst.eTypeInteger },
        { name: 'PremiseNumber', disabled: true, required: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', disabled: true, required: true, type: MntConst.eTypeText },
        { name: 'ProductCode', disabled: true, required: true },
        { name: 'ProductDesc', disabled: true, required: true },
        { name: 'PremiseLocationNumber', disabled: false, required: true },
        { name: 'PremiseLocationDesc', disabled: true, required: true },
        { name: 'PremiseLocationNumberTo', disabled: false, required: true, type: MntConst.eTypeInteger },
        { name: 'PremiseLocationToDesc', disabled: true, required: true },
        { name: 'EffectiveDateFrom', disabled: false, required: true },
        { name: 'EffectiveDateTo', disabled: false, required: true },
        { name: 'SourceQuantity', disabled: true, required: true, type: MntConst.eTypeInteger },
        { name: 'TransferQuantity', disabled: false, required: true, type: MntConst.eTypeInteger },
        { name: 'ServiceCoverRowID' }
    ];

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Cover Location Transfer Maintenance';
        this.window_onload();
        this.serviceCoverSearchParams.ContractNumber = this.getControlValue('ContractNumber') || '';
        this.serviceCoverSearchParams.ContractName = this.getControlValue('ContractName') || '';
        this.serviceCoverSearchParams.PremiseNumber = this.getControlValue('PremiseNumber') || '';
        this.serviceCoverSearchParams.PremiseName = this.getControlValue('PremiseName') || '';


    }
    // tslint:disable-next-line:use-life-cycle-interface
    public ngAfterViewInit(): void {
        this.serviceCoverSearch.openModal();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERLOCATIONMOVEMAINTENANCE;
        this.search = this.getURLSearchParamObject();
        this.messageContentSave = MessageConstant.Message.SavedSuccessfully;
        this.messageContentRecord = MessageConstant.Message.RecordNotFound;
    }

    public window_onload(): void {
        this.CurrentContractTypeURLParameter = this.riExchange.getCurrentContractTypeUrlParam();
        this.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
        //this.pageTitle = this.currentContractTypeLabel + ' ' + 'Service Cover Location Transfer Maintenance';
        this.labelnumber = this.currentContractTypeLabel + ' ' + 'Number';
        this.serviceCoverSearchParams.CurrentContractTypeURLParameter = this.CurrentContractTypeURLParameter;
        this.premiselocationsearchparams.CurrentContractTypeURLParameter = this.CurrentContractTypeURLParameter;
        this.premiseLocationToSearchParams.CurrentContractTypeURLParameter = this.CurrentContractTypeURLParameter;

        if (this.parentMode === 'Verification' || this.parentMode === 'Premise-Allocate' || this.parentMode === 'ServiceCover-Increase' || this.parentMode === 'NewLocationGrid') {
            this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
            //this.setControlValue('ServiceCoverRowID', this.riExchange.getParentAttributeValue('ServiceCoverRowID'));
        }

        else if (this.parentMode === 'System-Allocate') {
            this.setControlValue('ContractNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.uiForm, 'ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.GetParentHTMLInputElementAttribute(this.uiForm, 'ContractName'));
            this.setControlValue('PremiseNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.uiForm, 'PremiseNumber'));
            this.setControlValue('PremiseName', this.riExchange.GetParentHTMLInputElementAttribute(this.uiForm, 'PremiseName'));
            //this.setControlValue('ServiceCoverRowID', this.riExchange.getParentAttributeValue('ServiceCoverRowID'));
        }

        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceVisitFrequency');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SourceQuantity');
    }

    // for product code
    public ellipsisdata = {};
    public serviceCoverSearchParams: any = {
        'parentMode': 'LookUp-Freq-Loc',
        'ContractNumber': '',
        'ContractName': '',
        'PremiseNumber': '',
        'PremiseName': '',
        'CurrentContractTypeURLParameter': ''
    };
    public serviceCoverSearchComponent = ServiceCoverSearchComponent;
    public setProductCode(data: any): void {
        this.ellipsisdata = data;
        this.setControlValue('ProductCode', data.row.ProductCode);
        this.setControlValue('ServiceVisitFrequency', data.row.ServiceVisitFrequency);
        this.setControlValue('ProductDesc', data.row.ProductDesc);
        this.setControlValue('ServiceCoverRowID', data.row.ttServiceCover);
        this.setAttribute('ServiceCoverRowID', data.row.ttServiceCover);
        this.setAttribute('ContractNumberServiceCoverRowID', data.row.ttServiceCover);
        this.disabledSearch = true;
        this.premiselocationsearchparams.ProductCode = this.getControlValue('ProductCode');
        this.premiselocationsearchparams.ProductDesc = this.getControlValue('ProductDesc');
        this.premiselocationsearchparams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
        this.premiseLocationToSearchParams.ProductCode = this.getControlValue('ProductCode');
        this.premiseLocationToSearchParams.ProductDesc = this.getControlValue('ProductDesc');
        this.premiseLocationToSearchParams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
    }

    // Effective Date from & Effective date to
    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            // this.fromDateDisplay = value.value;
            this.setControlValue('EffectiveDateFrom', value.value);
            //this.fromDateDisplay = new Date(this.utils.convertDateString(value.value));
            this.onChangeDateFrom();
        }
    }


    public dateToSelectedValue(value: any): void {
        if (value && value.value) {
            // this.toDateDisplay = value.value;
            this.setControlValue('EffectiveDateTo', value.value);

        }
    }

    //on changing premiselocationnumber
    public PremiseLocationNumberOnChange(): void {
        this.fromDateDisplay = null;
        this.riExchange_CBORequest();
    }

    public riExchange_CBORequest(): void {
        if ((this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremiseLocationNumber'))) {
            this.fromDateDisplay = null;
        }
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'EffectiveDateFrom') && this.getControlValue('EffectiveDateFrom') !== null) {
            this.onChangeDateFrom();
        }
    }
    // changing date functionality
    public datesearch: URLSearchParams = new URLSearchParams();
    public onChangeDateFrom(): void {
        this.datesearch = this.getURLSearchParamObject();
        let formdata: Object = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formdata['ProductCode'] = this.getControlValue('ProductCode');
        formdata['PremiseLocationNumber'] = this.getControlValue('PremiseLocationNumber');
        formdata['Function'] = 'GetSourceQuantities';
        formdata['EffectiveDateFrom'] = this.getControlValue('EffectiveDateFrom');
        formdata['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        this.inputParams.selectsearch = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, formdata)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.showErrorModal(e.errorMessage);
                } else {
                    this.setControlValue('SourceQuantity', e.SourceQuantity);
                }
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.showErrorModal(error);
            }
            );
        let fromDt = this.getControlValue('EffectiveDateFrom').split('/');
        let getToDate = this.globalize.parseDateToFixedFormat(this.getControlValue('EffectiveDateFrom')).toString();
        this.toDateDisplay = this.globalize.parseDateStringToDate(getToDate);

    }

    /* ellipse functionalities*/
    public premiselocationsearchparams: any = {
        'parentMode': 'Move-From',
        'ProductCode': '',
        'ProductDesc': '',
        'CurrentContractTypeURLParameter': ''
    };
    public premiseLocationComponent = PremiseLocationAllocationGridComponent;
    public setPremiseLocation(data: any): void {
        this.setControlValue('PremiseLocationNumber', data.PremiseLocationNumber);
        this.setControlValue('PremiseLocationDesc', data.PremiseLocationDesc);
        this.effectDatesearchparams.ProductCode = this.getControlValue('ProductCode');
        this.effectDatesearchparams.ProductDesc = this.getControlValue('ProductDesc');
        this.effectDatesearchparams.PremiseLocationNumber = this.getControlValue('PremiseLocationNumber');
        this.effectDatesearchparams.PremiseLocationDesc = this.getControlValue('PremiseLocationDesc');
        this.effectDatesearchparams.ServiceVisitFrequency = this.getControlValue('ServiceVisitFrequency');
        this.effectDatesearchparams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
    }

    public premiseLocationToSearchParams: any = {
        'parentMode': 'Move-To',
        'ProductCode': '',
        'ProductDesc': '',
        'CurrentContractTypeURLParameter': ''
    };
    public premiselocationallocationto = PremiseLocationAllocationGridComponent;
    public setPremiseLocationTo(data: any): void {
        this.setControlValue('PremiseLocationNumberTo', data.PremiseLocationNumber);
        this.setControlValue('PremiseLocationToDesc', data.PremiseLocationDesc);
    }

    //TODO

    //date ellipsis
    public effectDatesearchparams = {
        parentMode: 'LookUp',
        ProductCode: '',
        ProductDesc: '',
        PremiseLocationNumber: '',
        PremiseLocationDesc: '',
        ServiceVisitFrequency: '',
        ServiceCoverRowID: ''
    };
    public effectDateComponent = ServiceCoverLocationEffectDateSearchComponent;
    public setEffectDate(data: any): void {
        let getFromDate = this.globalize.parseDateToFixedFormat(data.EffectiveDateFrom).toString();
        this.fromDateDisplay = this.globalize.parseDateStringToDate(getFromDate);
        this.setControlValue('EffectiveDateFrom', data.EffectiveDateFrom);
    }

    // save logic
    public lookUpSubscription: Subscription;
    onSave(): void {
        if (this.uiForm.valid) {
            this.promptModalForSave.show();
        } else {
            this.riExchange.riInputElement.isError(this.uiForm, 'ContractNumber');
            this.riExchange.riInputElement.isError(this.uiForm, 'ContractName');
            this.riExchange.riInputElement.isError(this.uiForm, 'ServiceVisitFrequency');
            this.riExchange.riInputElement.isError(this.uiForm, 'PremiseNumber');
            this.riExchange.riInputElement.isError(this.uiForm, 'PremiseName');
            this.riExchange.riInputElement.isError(this.uiForm, 'ProductCode');
            this.riExchange.riInputElement.isError(this.uiForm, 'ProductDesc');
            this.riExchange.riInputElement.isError(this.uiForm, 'PremiseLocationNumber');
            this.riExchange.riInputElement.isError(this.uiForm, 'PremiseLocationDesc');
            this.riExchange.riInputElement.isError(this.uiForm, 'PremiseLocationNumberTo');
            this.riExchange.riInputElement.isError(this.uiForm, 'PremiseLocationToDesc');
            // this.riExchange.riInputElement.isError(this.uiForm, 'EffectiveDateFrom');
            // this.riExchange.riInputElement.isError(this.uiForm, 'EffectiveDateTo');
            this.riExchange.riInputElement.isError(this.uiForm, 'SourceQuantity');
            this.riExchange.riInputElement.isError(this.uiForm, 'TransferQuantity');
            this.EffectiveDateFrom.validateDateField();
            this.EffectiveDateTo.validateDateField();
        }
    }

    /* on clicking confirm*/

    public savesearch: URLSearchParams = new URLSearchParams();
    public promptContentSaveData(eventObj: any): void {
        this.search = this.getURLSearchParamObject();
        let formdata: Object = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, '1');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formdata['ProductCode'] = this.getControlValue('ProductCode');
        formdata['PremiseLocationNumber'] = this.getControlValue('PremiseLocationNumber');
        formdata['PremiseLocationNumberTo'] = this.getControlValue('PremiseLocationNumberTo');
        formdata['TransferQuantity'] = this.getControlValue('TransferQuantity');
        formdata['EffectiveDateFrom'] = this.getControlValue('EffectiveDateFrom');
        formdata['SourceQuantity'] = this.getControlValue('SourceQuantity');
        formdata['EffectiveDateTo'] = this.getControlValue('EffectiveDateTo');
        formdata['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        this.inputParams.selectsearch = this.search;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, formdata)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.showErrorModal(e);
                } else {
                        this.showMessageModal(e);
                        this.formPristine();
                    }
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.showErrorModal(error);
            }
            );
    }


    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    }
    //cancel logic
    public onCancel(): void {
        this.disabledSearch = false;
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');
        this.setControlValue('PremiseLocationNumber', '');
        this.setControlValue('PremiseLocationDesc', '');
        this.setControlValue('EffectiveDateFrom', '');
        this.fromDateDisplay = null;
        this.setControlValue('SourceQuantity', '');
        this.setControlValue('PremiseLocationNumberTo', '');
        this.setControlValue('PremiseLocationToDesc', '');
        this.toDateDisplay = null;
        this.EffectiveDateFrom.dtDisplay = '';
        this.EffectiveDateTo.dtDisplay = '';
        this.setControlValue('TransferQuantity', '');
        this.formPristine();
        this.serviceCoverSearch.openModal();
    }
}
