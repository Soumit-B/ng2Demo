import * as moment from 'moment';
import { InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { Observable } from 'rxjs';
import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy, Injector } from '@angular/core';

import { BaseComponent } from '../../base/BaseComponent';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Utils } from './../../../shared/services/utility';
import { MessageConstant } from './../../../shared/constants/message.constant';

import { PremiseLocationSearchComponent } from './../search/iCABSAPremiseLocationSearch.component';
import { ProductSearchGridComponent } from './../search/iCABSBProductSearch';
import { ServiceCoverSearchComponent } from './../search/iCABSAServiceCoverSearch';

@Component({
    templateUrl: 'iCABSAServiceCoverLocationMaintenance.html'
})

export class ServiceCoverLocationMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    public isRequesting = false;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;

    @ViewChild('premiseLocationEllipsis') premiseLocationEllipsis: EllipsisComponent;
    @ViewChild('productCodeEllipsis') productCodeEllipsis: EllipsisComponent;
    @ViewChild('serviceCoverEllipsis') serviceCoverEllipsis: EllipsisComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public openModal(ellipsisName: string): void { this[ellipsisName].openModal(); }

    public showCloseButton = true;
    public modalConfig: any = { backdrop: 'static', keyboard: true };

    public EffectiveDate: any;
    public dateReadOnly: boolean = false;
    public clearDate: boolean = false;

    // message Modal popup
    public errorTitle: string;
    public errorContent: string;
    public showErrorHeader: boolean = true;
    // message Modal popup
    public messageTitle: string;
    public messageContent: string;
    public showMessageHeader: boolean = true;
    // Prompt Modal popup
    public promptTitle: string = MessageConstant.Message.ConfirmTitle;
    public promptContent: string = MessageConstant.Message.ConfirmRecord;
    public showPromptHeader: boolean = false;

    public pageId: string = '';
    public inpTitle: string;
    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: true, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ContractName', readonly: true, disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseNumber', readonly: true, disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'PremiseName', readonly: true, disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ProductCode', readonly: false, disabled: true, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ProductDesc', readonly: false, disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ServiceQuantity', readonly: false, disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'UnallocatedQuantity', readonly: false, disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'ServiceVisitFrequency', readonly: false, disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'PremiseLocationNumber', readonly: false, disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'PremiseLocationDesc', readonly: false, disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'QuantityAtLocation', readonly: false, disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'QuantityChange', readonly: false, disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'EffectiveDate', readonly: false, disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'menu', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'ROWID', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'ServiceCoverRowID', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'ServiceCoverLocationRowID', readonly: false, disabled: false, type: '', required: false, value: '' }
    ];
    public uiDisplay = {};
    public dropDown = {
        menu: []
    };

    // inputParams for Ellipsis
    public ellipsis = {
        productCodeEllipsis: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'PremiseAllocate-Search',
                'currentContractType': this.riExchange.getCurrentContractType(),
                'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel(),
                'showAddNew': false,
                ContractNumber: '',
                ContractName: '',
                PremiseNumber: '',
                PremiseName: ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            component: ProductSearchGridComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        serviceCoverEllipsis: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'currentContractType': this.riExchange.getCurrentContractType(),
                'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel(),
                'showAddNew': false,
                ContractNumber: '',
                ContractName: '',
                PremiseNumber: '',
                PremiseName: ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            component: ServiceCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        premiseLocationEllipsis: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-Allocate',
                'currentContractType': this.riExchange.getCurrentContractType(),
                'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel(),
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            component: PremiseLocationSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false,
            hideIcon: false
        }
    };

    public getData: any;
    public xhr: any;
    public xhrParams = {
        module: 'locations',
        method: 'service-delivery/maintenance',
        operation: 'Application/iCABSAServiceCoverLocationMaintenance'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERLOCATIONMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.setTitle(); //pageTitle = 'Service Cover Location Maintenance';

        if (this.isReturning()) {
            this.populateUIFromFormData();
            let getDate = this.getControlValue('EffectiveDate');
            if (getDate) {
                if (moment(getDate, 'DD/MM/YYYY', true).isValid()) {
                    getDate = this.utils.convertDate(getDate);
                } else {
                    getDate = this.utils.formatDate(getDate);
                }
                this.EffectiveDate = getDate;
            }
            this.setControlValue('menu', 'Options');
        } else {
            this.init();
        }
        // this.routeAwayUpdateSaveFlag();
        this.routeAwayGlobals.setEllipseOpenFlag(false);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.routeAwayGlobals.resetRouteAwayFlags();
    }

    //////////////////////////////////////////////
    private doLookup(): any {
        //No Lookups reqd
    }
    private getSysCharDtetails(): any {
        //No Syschars reqd
    }
    public setTitle(): void {
        let strInpTitle = '^1^ Number';
        let strDocTitle = '^1^ Service Cover Location Maintenance';
        this.getTranslatedValue(strDocTitle, null).subscribe((res: string) => {
            if (res) { strDocTitle = res; }
            this.getTranslatedValue(this.riExchange.getCurrentContractTypeLabel(), null).subscribe((data: string) => {
                if (data) { this.pageParams.currentContractTypeLabel = data; }
                strDocTitle = strDocTitle.replace('^1^', this.pageParams.currentContractTypeLabel);
                this.pageParams.strDocTitle = strDocTitle;
                this.utils.setTitle(strDocTitle);
            });
        });
        this.getTranslatedValue(strInpTitle, null).subscribe((res: string) => {
            if (res) { this.pageParams.strInpTitle = res; }
            strInpTitle = strInpTitle.replace('^1^', this.pageParams.currentContractTypeLabel);
        });
        // this.pageParams.strInpTitle = this.pageParams.strInpTitle.replace('^1^', this.pageParams.currentContractTypeLabel);
        // this.pageParams.strDocTitle = this.pageParams.strDocTitle.replace('^1^', this.pageParams.currentContractTypeLabel);
        // this.utils.setTitle(this.pageParams.strDocTitle);
    }
    public showAlert(msgTxt: string, type?: number): void {
        let titleModal = '';
        if (typeof type === 'undefined') type = 0;
        switch (type) {
            default:
            case 0: titleModal = MessageConstant.Message.ErrorTitle; break;
            case 1: titleModal = MessageConstant.Message.MessageTitle; break;
            case 2: titleModal = MessageConstant.Message.MessageTitle; break;
        }
        this.isModalOpen(true);
        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
    }
    public showSpinner(): void { this.isRequesting = true; }
    public hideSpinner(): void { this.isRequesting = false; }

    public actionAfterSave: number = 0;
    public currentActivity = '';
    public save(): void {
        this.currentActivity = 'SAVE';
        this.riMaintenance.CancelEvent = false;
        // this.logger.log('SAVE clicked', this.checkErrorStatus(), this.currentActivity, this.riMaintenance.CurrentMode);
        if (this.checkErrorStatus()) {
            switch (this.currentActivity) {
                case 'SAVE':
                    this.currentActivity = '';
                    switch (this.riMaintenance.CurrentMode) {
                        case 'eModeAdd':
                        case 'eModeSaveAdd':
                            this.actionAfterSave = 1;
                            this.riMaintenance.execMode(MntConst.eModeSaveAdd, [this]);
                            break;
                        case 'eModeUpdate':
                        case 'eModeSaveUpdate':
                            this.actionAfterSave = 2;
                            this.riMaintenance.execMode(MntConst.eModeSaveUpdate, [this]);
                            break;
                    }
                    break;
            }
            this.routeAwayGlobals.setSaveEnabledFlag(true);
        }
    }
    public confirm(): any {
        this.promptModal.show();
    }
    public confirmed(obj: any): any {
        this.riMaintenance.CancelEvent = false;
        this.riMaintenance.execContinue(this.riMaintenance.CurrentMode, [this]);
    }
    public closeModal(): void {
        this.isModalOpen(false);
        this.riMaintenance.handleConfirm(this);

        if (this.flagNavigateBack) {
            this.flagNavigateBack = false;
            this.location.back();
        }
    }
    public isModalOpen(flag: boolean): void {
        this.riMaintenance.isModalOpen = flag;
    }
    public cancel(): void {
        this.riMaintenance.CurrentMode = MntConst.eModeUpdate;

        this.setControlValue('QuantityChange', '');
        this.riExchange.riInputElement.isCorrect(this.uiForm, 'QuantityChange');

        if (this.EffectiveDate) {
            if (this.EffectiveDate === null) { this.EffectiveDate = void 0; }
            else { this.EffectiveDate = null; }
        }
        let elem = document.querySelector('#EffectiveDate').parentElement;
        if (elem.firstElementChild.firstElementChild) {
            let dateField = elem.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
            let dateFieldID = dateField.getAttribute('id');
            setTimeout(() => { document.getElementById(dateFieldID)['value'] = ''; }, 200);
        }

        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.markAsPrestine();
    }
    public checkErrorStatus(): boolean {
        this.uiForm.controls['EffectiveDate'].markAsDirty();
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProductCode', true);
        let hasError_ProductCode = this.riExchange.riInputElement.isError(this.uiForm, 'ProductCode');

        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseLocationNumber', true);
        let hasError_PremiseLocationNumber = this.riExchange.riInputElement.isError(this.uiForm, 'PremiseLocationNumber');

        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EffectiveDate', true);
        let hasError_EffectiveDate = this.riExchange.riInputElement.isError(this.uiForm, 'EffectiveDate');

        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'QuantityChange', true);
        let hasError_QuantityChange = this.riExchange.riInputElement.isError(this.uiForm, 'QuantityChange');

        if (!hasError_ProductCode
            && !hasError_PremiseLocationNumber
            && !hasError_EffectiveDate
            && !hasError_QuantityChange) {
            return true;
        } else {
            return false;
        }
    }
    //////////////////////////////////////////////

    public labelContractNumber = 'Contract Number';

    public getValue(ctrlName: string): any {
        let retValue = '';
        if (ctrlName) {
            retValue = (this.riExchange.getParentAttributeValue(ctrlName)) ? (this.riExchange.getParentAttributeValue(ctrlName)) : retValue; //Check in parent page attributes
            if (!retValue) {
                retValue = (this.riExchange.getParentHTMLValue(ctrlName)) ? (this.riExchange.getParentHTMLValue(ctrlName)) : retValue; //Check in query params
            }
        }
        return retValue;
    }

    public init(): void {
        this.pageParams.WindowPath = '';
        this.pageParams.blnNoneInstalled = '';
        this.pageParams.blnAutoSearch = '';

        this.pageParams.RecordType = '';
        this.pageParams.AmendedServiceCoverRowID = '';
        this.pageParams.ServiceCoverQuantityChange = '';
        this.pageParams.DefaultEffectiveDate = '';
        this.pageParams.DefaultEffectiveDateProduct = '';
        this.pageParams.blnUnitsInHold = false;
        this.pageParams.RecordType = this.getValue('RecordType');
        if (!this.pageParams.RecordType) this.pageParams.RecordType = this.getValue('ContractNumberRecordType');
        if (!this.pageParams.RecordType) this.pageParams.RecordType = this.getValue('RecordType');

        this.setControlValue('menu', 'Options');

        if (this.pageParams.RecordType === 'ServiceCoverLocation' || this.pageParams.RecordType === 'ServiceCover') {
            this.setControlValue('ServiceVisitFrequency', this.getValue('ServiceVisitFrequency'));
        }

        this.pageParams.DefaultEffectiveDate = this.getValue('DefaultEffectiveDate');
        this.pageParams.DefaultEffectiveDateProduct = this.getValue('DefaultEffectiveDateProduct');

        if (this.pageParams.RecordType === 'ServiceCover') {
            this.pageParams.AmendedServiceCoverRowID = this.getValue('AmendedServiceCoverRowID');
            this.pageParams.ServiceCoverQuantityChange = this.getValue('ServiceCoverQuantityChange');
        }

        let CurrentContractType = this.riExchange.setCurrentContractType();
        switch (this.riExchange.getCurrentContractType()) {
            case 'J':
                this.labelContractNumber = 'Job Number';
                break;

            case 'P':
                this.labelContractNumber = 'Product Sale Number';
                break;
            default:
                this.labelContractNumber = 'Contract Number';
                break;
        }
        this.riExchange.riInputElement.Add(this.uiForm, 'ServiceQuantity');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceQuantity');
        this.riExchange.riInputElement.Add(this.uiForm, 'UnallocatedQuantity');
        this.riExchange.riInputElement.Disable(this.uiForm, 'UnallocatedQuantity');

        if (this.parentMode === 'Premise-Allocate' || this.parentMode === 'ServiceCover-Increase') {
            this.setControlValue('ContractNumber', this.getValue('ContractNumber'));
            this.setControlValue('ContractName', this.getValue('ContractName'));
            this.setControlValue('PremiseNumber', this.getValue('PremiseNumber'));
            this.setControlValue('PremiseName', this.getValue('PremiseName'));
        } else if (this.parentMode === 'System-Allocate') {
            this.setControlValue('ContractNumber', this.getValue('ContractNumber'));
            this.setControlValue('ContractName', this.getValue('ContractName'));
            this.setControlValue('PremiseNumber', this.getValue('PremiseNumber'));
            this.setControlValue('PremiseName', this.getValue('PremiseName'));
        }

        this.riExchange.riInputElement.Add(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');

        this.riExchange.riInputElement.Add(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');

        this.riExchange.riInputElement.Add(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');

        this.riExchange.riInputElement.Add(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');

        this.riExchange.riInputElement.Add(this.uiForm, 'ServiceVisitFrequency');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceVisitFrequency');

        if (this.pageParams.RecordType !== 'PremiseLocation') {
            this.setControlValue('ProductCode', this.getValue('ProductCode'));
            this.setControlValue('ProductDesc', this.getValue('ProductDesc'));
        }

        switch (this.pageParams.RecordType) {
            case 'ServiceCover':
                this.setControlValue('ServiceCoverRowID', this.getValue('ServiceCoverRowID'));
                break;
            case 'PremiseLocation':
                this.setControlValue('PremiseLocationNumber', this.getValue('PremiseLocationNumber'));
                this.setControlValue('PremiseLocationDesc', this.getValue('PremiseLocationDesc'));
                break;
            case 'ServiceCoverLocation':
                this.setControlValue('ServiceCoverLocationRowID', this.getValue('ServiceCoverLocationRowID'));
                this.setControlValue('ROWID', this.getValue('ServiceCoverLocationRowID'));
                this.setControlValue('ServiceCoverRowID', this.getValue('ServiceCoverRowID'));
                this.setControlValue('PremiseLocationNumber', this.getValue('PremiseLocationNumber'));
                break;
        }

        if (this.pageParams.RecordType === 'ServiceCover' || this.pageParams.RecordType === 'PremiseLocation') {
            this.ellipsis.premiseLocationEllipsis.disabled = true;
            this.riMaintenance.AddMode();
            this.disableControl('PremiseLocationNumber', true);
            this.riMaintenance.setIndependentVTableLookup(true);
        } else {
            this.ellipsis.premiseLocationEllipsis.disabled = false;
            this.riMaintenance.UpdateMode();
        }

        if (!this.getControlValue('ProductCode') || !this.getControlValue('PremiseLocationNumber')) {
            setTimeout(() => { this.autoOpenEllipsis(); }, 1000);
            return;
        } else this.window_onload();
    }

    public autoOpenEllipsis(): void {
        this.setEllipsisParams();

        if (!this.getControlValue('ProductCode')) {
            if (this.pageParams.RecordType === 'PremiseLocation') {
                this.serviceCoverEllipsis.openModal();
            } else {
                this.productCodeEllipsis.openModal();
            }
        } else if (!this.getControlValue('PremiseLocationNumber')) {
            if (!this.getControlValue('PremiseLocationNumber')) {
                this.disableControl('PremiseLocationNumber', false);
                this.ellipsis.premiseLocationEllipsis.disabled = false;
            }
            setTimeout(() => { this.premiseLocationEllipsis.openModal(); }, 100);
        }
    }

    public window_onload(): void {
        this.riMaintenance.clearQ();

        this.riMaintenance.BusinessObject = 'riControl.p';
        this.riMaintenance.CustomBusinessObject = 'iCABSServiceCoverLocEntry.p';
        this.riMaintenance.CustomBusinessObjectSelect = false;
        this.riMaintenance.CustomBusinessObjectConfirm = false;
        this.riMaintenance.CustomBusinessObjectInsert = true;
        this.riMaintenance.CustomBusinessObjectUpdate = true;
        this.riMaintenance.CustomBusinessObjectDelete = false;
        this.riMaintenance.FunctionSnapShot = false;

        if (this.parentMode === 'Premise-Allocate' || this.parentMode === 'ServiceCover-Increase') {
            this.riMaintenance.FunctionSearch = false;
        }
        if ((this.parentMode === 'Premise-Allocate' || this.parentMode === 'ServiceCover-Increase') && this.pageParams.RecordType === 'ServiceCoverLocation') {
            this.riMaintenance.FunctionDelete = true;
        } else {
            this.riMaintenance.FunctionDelete = false;
        }
        if (this.pageParams.RecordType === 'ServiceCoverLocation') {
            this.riMaintenance.FunctionAdd = false;
            this.riMaintenance.FunctionDelete = false;
        }

        this.riMaintenance.AddTable('ServiceCoverLocation');
        this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddTableKey('ROWID', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKey('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKeyAlignment('ProductCode', MntConst.eAlignmentRight);
        if (this.pageParams.RecordType === 'PremiseLocation') {
            this.riMaintenance.AddTableKey('PremiseLocationNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        } else {
            this.riMaintenance.AddTableKey('PremiseLocationNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        }

        this.riMaintenance.AddTableField('QuantityAtLocation', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('QuantityChange', MntConst.eTypeInteger, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('EffectiveDate', MntConst.eTypeDate, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableCommit(this, this.getTableCallbackData);

        if ((this.parentMode === 'Premise-Allocate' || this.parentMode === 'ServiceCover-Increase') && this.pageParams.RecordType === 'ServiceCoverLocation') {
            this.riMaintenance.RowID(this, 'ServiceCoverLocation', this.getControlValue('ServiceCoverLocationRowID'));
        }

        this.riMaintenance.Complete();

        if (this.pageParams.RecordType !== 'PremiseLocation') {
            this.GetUnallocated();
        }

        this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this]);
    }

    public getTableCallbackData(): void {
        this.riMaintenance.AddVirtualTable('Contract');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('Premise');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('PremiseName', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('Product');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ProductCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('ProductDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        if ((this.parentMode === 'Premise-Allocate' || this.parentMode === 'ServiceCover-Increase') && this.pageParams.RecordType === 'PremiseLocation') {
            this.riMaintenance.AddVirtualTable('PremiseLocation');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeCodeNumeric, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('PremiseLocationNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('PremiseLocationDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateFixed, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
        } else {
            this.riMaintenance.AddVirtualTable('PremiseLocation');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeCodeNumeric, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('PremiseLocationNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('PremiseLocationDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
        }
    }

    public setEllipsisParams(): void {
        this.ellipsis.premiseLocationEllipsis.childConfigParams['ContractNumber'] = this.getControlValue('ContractNumber');
        this.ellipsis.premiseLocationEllipsis.childConfigParams['ContractName'] = this.getControlValue('ContractName');
        this.ellipsis.premiseLocationEllipsis.childConfigParams['PremiseNumber'] = this.getControlValue('PremiseNumber');
        this.ellipsis.premiseLocationEllipsis.childConfigParams['PremiseName'] = this.getControlValue('PremiseName');

        this.ellipsis.serviceCoverEllipsis.childConfigParams['ContractNumber'] = this.getControlValue('ContractNumber');
        this.ellipsis.serviceCoverEllipsis.childConfigParams['ContractName'] = this.getControlValue('ContractName');
        this.ellipsis.serviceCoverEllipsis.childConfigParams['PremiseNumber'] = this.getControlValue('PremiseNumber');
        this.ellipsis.serviceCoverEllipsis.childConfigParams['PremiseName'] = this.getControlValue('PremiseName');

        this.ellipsis.productCodeEllipsis.childConfigParams['ContractNumber'] = this.getControlValue('ContractNumber');
        this.ellipsis.productCodeEllipsis.childConfigParams['ContractName'] = this.getControlValue('ContractName');
        this.ellipsis.productCodeEllipsis.childConfigParams['PremiseNumber'] = this.getControlValue('PremiseNumber');
        this.ellipsis.productCodeEllipsis.childConfigParams['PremiseName'] = this.getControlValue('PremiseName');
    }

    public ProductCode_onkeydown(): void {
        // if (window.event.keyCode = 34) {
        //     if (RecordType = 'PremiseLocation') {
        //         riExchange.Mode = 'PremiseAllocate-Search';: window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceCoverSearch.htm';
        //     } else {
        //         riExchange.Mode = 'LookUp';: window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBProductSearch.htm';
        //     }
        // }
    }
    public productCodeSelection(obj: any): void {
        if (obj) {
            this.setControlValue('ProductCode', obj.ProductCode);
            this.setControlValue('ProductDesc', obj.ProductDesc);
            this.setControlValue('ServiceCoverRowID', obj.row.ttServiceCover);
            this.setControlValue('ServiceVisitFrequency', obj.row.ServiceVisitFrequency);
            this.window_onload();
            this.riExchange_UpdateHTMLDocument();
        }
    }
    public productCode_onChange(e: any): void {
        if (e.target.value) {
            this.riMaintenance.AddVirtualTable('Product');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('ProductCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('ProductDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.window_onload();
        }
    }

    public PremiseLocationNumber_onkeydown(): void {
        // if (window.event.keyCode = 34) {
        //     this.LocationSearch();
        // }
    }
    public premiseLocationSelection(obj: any): void {
        if (obj) {
            // clear page data
            this.setControlValue('QuantityAtLocation', '');
            this.setControlValue('EffectiveDate', '');
            this.setControlValue('QuantityChange', '');
            this.clearDate = true;

            this.setControlValue('PremiseLocationNumber', obj.PremiseLocationNumber);
            this.setControlValue('PremiseLocationDesc', obj.PremiseLocationDesc);
            this.setControlValue('ROWID', '');
            this.window_onload();
        }
    }
    public premiseLocationNumber_onChange(e: any): void {
        if (e.target.value) {
            // clear page data
            this.setControlValue('QuantityAtLocation', '');
            this.setControlValue('EffectiveDate', '');
            this.setControlValue('QuantityChange', '');
            this.clearDate = true;

            this.riMaintenance.AddVirtualTable('PremiseLocation');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeCodeNumeric, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('PremiseLocationNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('PremiseLocationDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateFixed, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.setControlValue('ROWID', '');
            this.window_onload();
        }
    }

    public LocationSearch(): void {
        // riExchange.Mode = 'LookUp-Allocate';
        // window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAPremiseLocationSearch.htm' + CurrentContractTypeURLParameter;
    }

    public effectiveDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EffectiveDate', value.value);
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EffectiveDate', '');
        }
    }

    public riExchange_CBORequest(): void {
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ProductCode')) {
            if (this.getControlValue('ProductCode') === this.pageParams.DefaultEffectiveDateProduct) {
                this.setControlValue('EffectiveDate', this.pageParams.DefaultEffectiveDate);
                this.setDatePicker();
            }
        }
    }

    public riMaintenance_AfterAbandon(): void {
        if (this.pageParams.RecordType === 'PremiseLocation') {
            this.setControlValue('ProductDesc', '');
            this.setControlValue('ServiceVisitFrequency', '');
            this.setControlValue('ServiceQuantity', '');
            this.setControlValue('UnallocatedQuantity', '');
        }
    }

    public riMaintenance_BeforeSave(): void {
        let TempServiceCoverRowID, strCheckRowID;
        if (this.pageParams.RecordType === 'ServiceCover' || this.pageParams.RecordType === 'PremiseLocation') {
            TempServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
            strCheckRowID = TempServiceCoverRowID;
        } else {
            TempServiceCoverRowID = '';
            strCheckRowID = this.getControlValue('ServiceCoverLocationRowID');
        }

        if (this.pageParams.blnUnitsInHold) {
            this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.msg2517));
        }

        this.riMaintenance.BusinessObject = 'iCABSCheckPremiseAllocation.p';
        this.riMaintenance.clear();

        this.riMaintenance.PostDataAdd('CheckType', 'ServiceCover', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ChangeDate', this.getControlValue('EffectiveDate'), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('RecordType', this.pageParams.RecordType, MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ChangeQuantity', this.getControlValue('QuantityChange'), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ServiceCoverRowID', strCheckRowID, MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('PremiseLocationNumber', this.getControlValue('PremiseLocationNumber'), MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('ErrorMessage', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.ErrorMessage) {
                this.modalAdvService.emitError(new ICabsModalVO(data.ErrorMessage));
            }
        }, 'POST', 0);
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'ServiceCoverRowID=' + TempServiceCoverRowID;
    }

    public riMaintenance_BeforeUpdateMode(): void {
        if (this.getControlValue('ProductCode') === this.pageParams.DefaultEffectiveDateProduct) {
            this.setControlValue('EffectiveDate', this.pageParams.DefaultEffectiveDate);
            this.setDatePicker();
        }
    }

    public riMaintenance_BeforeAddMode(): void {
        switch (this.pageParams.RecordType) {
            case 'PremiseLocation':
                this.setControlValue('QuantityAtLocation', '0');
                break;
            case 'ServiceCover':
                this.LocationSearch();
                if (this.getControlValue('ProductCode') === this.pageParams.DefaultEffectiveDateProduct) {
                    this.setControlValue('EffectiveDate', this.pageParams.DefaultEffectiveDate);
                    this.setDatePicker();
                }
        }
    }

    public riExchange_UpdateHTMLDocument(): void {
        if (this.pageParams.RecordType === 'PremiseLocation') {
            this.attributes.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
            if (this.getControlValue('ProductCode') !== '') {
                this.GetUnallocated();
            }
        }
    }

    private flagNavigateBack = false;
    public riMaintenance_AfterSave(): void {
        let fields = `QuantityChange, EffectiveDate, ServiceCoverLocationRowID, ContractNumber, PremiseNumber, ProductCode,
        PremiseLocationNumber, QuantityAtLocation, ServiceCoverRowID`;
        fields = fields.replace(/\\t/g, '').replace(/\r?\n|\r/g, '').replace(/ /g, '');
        let fieldsArr = fields.split(',');

        this.riMaintenance.clear();
        for (let i = 0; i < fieldsArr.length; i++) {
            let id = fieldsArr[i];
            let dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            let value = this.riExchange.riInputElement.GetValue(this.uiForm, id);
            if (value) this.riMaintenance.PostDataAdd(id, value, dataType);
        }
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
            } else {
                this.markAsPrestine();
                this.routeAwayGlobals.setSaveEnabledFlag(false);
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                this.flagNavigateBack = true;
                if (this.pageParams.RecordType === 'ServiceCover' || this.pageParams.RecordType === 'ServiceCoverLocation') {
                    this.GetUnallocated();
                }
                this.location.back();
            }
        }, 'POST', this.actionAfterSave);
    }

    public riMaintenance_AfterEvent(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd
            || this.riMaintenance.CurrentMode === MntConst.eModeUpdate
            || this.riMaintenance.CurrentMode === MntConst.eModeDelete) {
            this.closeWindowSafe();
        }
    }

    public closeWindowSafe(): void {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
    }

    public riExchange_UnLoadHTMLDocument(): void {
        //Not Required
        // this.riExchange.UpdateParentHTMLDocument();
    }

    public GetUnallocated(): void {
        let tempServiceCoverRowID;
        this.riMaintenance.BusinessObject = 'iCABSCheckServiceCoverAllocation.p';
        this.riMaintenance.clear();
        if (this.parentMode === 'Premise-Allocate' || this.parentMode === 'ServiceCover-Increase') {
            switch (this.pageParams.RecordType) {
                case 'PremiseLocation':
                    tempServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
                    break;
                case 'ServiceCover':
                    tempServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
                    break;
                default:
                    tempServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
                    break;
            }
        } else {
            tempServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
        }

        if (tempServiceCoverRowID !== '') {
            this.riMaintenance.PostDataAdd('ServiceCoverRowID', tempServiceCoverRowID, MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('ServiceCoverLocationRowID', this.getControlValue('ServiceCoverLocationRowID'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('RecordType', this.pageParams.RecordType, MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('PremiseLocationNumber', this.getControlValue('PremiseLocationNumber'), MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('UnallocatedQuantity', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('ServiceQuantity', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('UnitsInHold', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('NewServiceCoverRowID', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data: any): any {
                this.pageParams.blnUnitsInHold = false;
                if (data['UnitsInHold']) {
                    this.pageParams.blnUnitsInHold = (data['UnitsInHold'].toLowerCase() === 'yes') ? true : false;
                }
                this.setControlValue('UnallocatedQuantity', data['UnallocatedQuantity']);
                this.setControlValue('ServiceQuantity', data['ServiceQuantity']);
                this.attributes.RowID = data['NewServiceCoverRowID'];
                this.setControlValue('ServiceCoverRowID', this.attributes.RowID);
            }, 'GET', 0);
        }
    }

    public menu_onchange(menu: string): void {
        switch (menu) {
            case 'ServiceValue':
                this.navigate('ServiceCoverHistory-All', InternalGridSearchServiceModuleRoutes.ICABSASERVICEVALUEGRID, {
                    CurrentContractTypeURLParameter: this.riExchange.getCurrentContractType(),
                    ServiceCoverRowID: this.getControlValue('ServiceCoverRowID'),
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName'),
                    PremiseNumber: this.getControlValue('PremiseNumber'),
                    PremiseName: this.getControlValue('PremiseName'),
                    ProductCode: this.getControlValue('ProductCode'),
                    ProductDesc: this.getControlValue('ProductDesc')
                });
                break;
        }
    }

    public setDatePicker(): void {
        //To Date
        let tempEffectiveDate = this.pageParams.DefaultEffectiveDate;
        if (moment(this.EffectiveDate, 'DD/MM/YYYY', true).isValid()) {
            tempEffectiveDate = this.utils.convertDate(this.getValue('EffectiveDate'));
        } else {
            tempEffectiveDate = this.utils.formatDate(this.getValue('EffectiveDate'));
        }
        this.EffectiveDate = new Date(tempEffectiveDate);
    }

    public canDeactivate(): Observable<boolean> {
        this.checkFormStatus();
        return super.canDeactivate();
    }
    public checkFormStatus(): void {
        /* Check Form Status */
        for (let i = 0; i < this.controls.length; i++) {
            if (!this.uiForm.controls[this.controls[i].name].pristine) {
                if (this.controls[i].name.toLowerCase().indexOf('date') > -1) {
                    let elem = document.querySelector('#' + this.controls[i].name).parentElement;
                    let dateField = elem.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
                    let checkClassName = 'ng-untouched';
                    if (this.utils.hasClass(dateField, checkClassName)) {
                        this.uiForm.controls[this.controls[i].name].markAsPristine();
                    }
                }
            }
        }

        this.uiForm.controls['menu'].markAsPristine();
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (!this.uiForm.pristine) this.routeAwayGlobals.setSaveEnabledFlag(true);
        }
    }
    public markAsPrestine(): void {
        for (let i = 0; i < this.controls.length; i++) {
            this.uiForm.controls[this.controls[i].name].markAsPristine();
        }
    }

    public fieldValidateTransform(event: any): void {
        let retObj = this.utils.fieldValidateTransform(event);
        this.setControlValue(retObj.id, retObj.value);
        if (!retObj.status) {
            this.riExchange.riInputElement.markAsError(this.uiForm, retObj.id);
        }
    }
}
