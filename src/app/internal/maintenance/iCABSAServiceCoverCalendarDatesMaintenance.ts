import { PromptModalComponent } from './../../../shared/components/prompt-modal/prompt-modal';
import { Subscription } from 'rxjs/Subscription';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Component, Input, ViewChild, Injector, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { LocalStorageService } from 'ng2-webstorage';
import { HttpService } from './../../../shared/services/http-service';
import { Utils } from './../../../shared/services/utility';
import { ErrorCallback, MessageCallback } from '../../base/Callback';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { CalendarTemplateSearchComponent } from './../../internal/search/iCABSBCalendarTemplateSearch.component';
import { Router, ActivatedRoute } from '@angular/router';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { InternalGridSearchSalesModuleRoutes, InternalGridSearchApplicationModuleRoutes } from './../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSAServiceCoverCalendarDatesMaintenance.html'
})
export class ServiceCoverCalendarDatesMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    public parent: ServiceCoverCalendarDatesMaintenanceComponent = this;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('contractNumberEllipsis') public contractNumberEllipsis: EllipsisComponent;
    @ViewChild('premiseNumberEllipsis') public premiseNumberEllipsis: EllipsisComponent;
    @ViewChild('productCodeEllipsis') public productCodeEllipsis: EllipsisComponent;
    @ViewChild('AnnualCalendarTemplateEllipsis') public AnnualCalendarTemplateEllipsis: EllipsisComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public controls = [
        { name: 'ContractNumber', readonly: false, disabled: false, required: false },
        { name: 'ContractName', readonly: false, disabled: true, required: false },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
        { name: 'PremiseName', readonly: false, disabled: true, required: false },
        { name: 'ProductCode', readonly: false, disabled: false, required: false },
        { name: 'ProductDesc', readonly: false, disabled: true, required: false },
        { name: 'Status', readonly: false, disabled: true, required: false },
        { name: 'ServiceVisitFrequency', readonly: false, disabled: true, required: false },
        { name: 'ServiceQuantity', readonly: false, disabled: true, required: false },
        { name: 'ServiceCommenceDate', readonly: false, disabled: true, required: false, type: MntConst.eTypeDate },
        { name: 'AnnualCalendarInd', readonly: false, disabled: true, required: false, type: MntConst.eTypeCheckBox },
        { name: 'FollowTemplateInd', readonly: false, disabled: true, required: false, type: MntConst.eTypeCheckBox },
        { name: 'AnnualCalendarTemplateNumber', readonly: true, disabled: true, required: false },
        { name: 'TemplateName', readonly: false, disabled: true, required: false },
        { name: 'menu', readonly: false, disabled: true, required: false, value: 'Options' },
        { name: 'LastChangeEffectDate', readonly: true, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'CalendarUpdateAllowed', readonly: false, disabled: false, required: false },
        { name: 'ContractTypeCode', readonly: false, disabled: false, required: false },
        { name: 'Function', readonly: false, disabled: false, required: false },
        { name: 'ServiceCoverRowID', readonly: false, disabled: false, required: false }
    ];
    public pageId: string;
    public lookUpSubscription: Subscription;
    public visibleEffectiveDate: boolean = true;
    public dataPostModeAction: number;
    public promptTitle: string = 'Confirm';
    public showPromptHeader: boolean = true;
    public LastChangeEffectDate: string;
    public dtLastChangeEffectiveDate: Date;
    public visibleAnnualCalendar: boolean = false;
    public disableAnnualCalendarEllipsis: boolean = true;
    public visibleLastChangeEffecDate: boolean = true;
    public isInvalidAnnualTemplate: boolean = true;
    public disableSaveCancel: boolean = true;
    public promptContent: string = MessageConstant.Message.ConfirmRecord;
    public messageContentSaved: string = MessageConstant.Message.RecordSavedSuccessfully;
    public messageTitle: string = MessageConstant.Message.MessageTitle;
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERCALENDARDATESMAINTENANCE;
        this.browserTitle = 'Service Cover Calendar Maintenance';
    };

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Cover Calendar Maintenance';
        this.setControlValue('CalendarUpdateAllowed', 'False');
        this.setControlValue('ContractTypeCode', this.riExchange.getCurrentContractType());
        this.setControlValue('Function', 'CheckContractType');
        this.disableControl('PremiseNumber', true);
        this.disableControl('ProductCode', true);
        this.setErrorCallback(this);
        this.setMessageCallback(this);
        this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
        if (!this.isReturning()) {
            setTimeout(() => {
                this.contractNumberEllipsis.openModal();
            }, 1000);
        }
        else {
            this.setControlValue('ContractNumber', this.pageParams.ContractNumber);
            this.setControlValue('PremiseNumber', this.pageParams.PremiseNumber);
            this.setControlValue('ProductCode', this.pageParams.ProductCode);
            this.setControlValue('ServiceCoverRowID', this.pageParams.ServiceCoverRowID);
            this.CallRimaintenance();
        }
        if (this.parentMode === 'ServiceCover') {
            this.riExchange.getParentHTMLValue('ContractNumber');
            this.riExchange.getParentHTMLValue('ContractName');
            this.riExchange.getParentHTMLValue('PremiseNumber');
            this.riExchange.getParentHTMLValue('PremiseName');
            this.riExchange.getParentHTMLValue('ProductCode');
            this.riExchange.getParentHTMLValue('ProductDesc');
            this.riMaintenance.FetchRecord();
        }
    }

    ngAfterViewInit(): void {
        this.setControlValue('tdMenu', 'Options');
    }

    public xhrParams = {
        operation: 'Application/iCABSAServiceCoverCalendarDatesMaintenance',
        module: 'template',
        method: 'service-planning/maintenance'
    };
    public ellipsis = {
        contractNumberEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp',
                'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel()
            },
            component: ContractSearchComponent
        },
        premiseNumberEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel()
            },
            component: PremiseSearchComponent
        },
        ProductCodeEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'PremiseNumber': '',
                'PremiseName': '',
                'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel()
            },
            component: ServiceCoverSearchComponent
        },
        AnnualCalendarTemplateEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp',
                'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel()
            },
            component: CalendarTemplateSearchComponent
        }
    };
    public premiseLocationOnKeyDown(obj: any, call: boolean): void {
        if (call) {
            if (obj.PremiseNumber) {
                this.setControlValue('PremiseNumber', obj.PremiseNumber);
            }
            if (obj.PremiseName) {
                this.setControlValue('PremiseName', obj.PremiseName);
            }
            this.ellipsis.ProductCodeEllipsis.childparams['ContractNumber'] = this.getControlValue('ContractNumber');
            this.ellipsis.ProductCodeEllipsis.childparams['ContractName'] = this.getControlValue('ContractName');
            this.ellipsis.ProductCodeEllipsis.childparams['PremiseNumber'] = this.getControlValue('PremiseNumber');
            this.ellipsis.ProductCodeEllipsis.childparams['PremiseNumber'] = this.getControlValue('PremiseNumber');
            this.setControlValue('ProductCode', '');
            this.setControlValue('ProductDesc', '');
            this.disableSaveCancel = true;
            this.resetSecondaryFields();
            this.disableControl('ProductCode', false);
        }
    }
    public contractNumberOnKeyDown(obj: any, call: boolean): void {
        if (call) {
            if (obj.ContractNumber) {
                this.setControlValue('ContractNumber', obj.ContractNumber);
            }
            if (obj.ContractName) {
                this.setControlValue('ContractName', obj.ContractName);
            }
            this.ellipsis.premiseNumberEllipsis.childparams['ContractNumber'] = this.getControlValue('ContractNumber');
            this.ellipsis.premiseNumberEllipsis.childparams['ContractName'] = this.getControlValue('ContractName');
            this.setControlValue('PremiseNumber', '');
            this.setControlValue('PremiseName', '');
            this.setControlValue('ProductCode', '');
            this.setControlValue('ProductDesc', '');
            this.disableSaveCancel = true;
            this.resetSecondaryFields();
            this.disableControl('PremiseNumber', false);
        }
    }
    public ProductNumberOnKeyDown(obj: any, call: boolean): void {
        if (call) {
            if (obj.row.ProductCode) {
                this.setControlValue('ProductCode', obj.row.ProductCode);
            }
            if (obj.row.ProductDesc) {
                this.setControlValue('ProductDesc', obj.row.ProductDesc);
            }
            if (obj.row.ttServiceCover) {
                this.setControlValue('ServiceCoverRowID', obj.row.ttServiceCover);
            }
        }
        this.postRequestContract();
    }

    public annualCalendarTemplateEllipsisrOnKeyDown(obj: any, call: boolean): void {
        if (call) {
            if (obj.AnnualCalendarTemplateNumber) {
                this.setControlValue('AnnualCalendarTemplateNumber', obj.AnnualCalendarTemplateNumber);
                this.uiForm.controls['AnnualCalendarTemplateNumber'].markAsDirty();
            }
            if (obj.TemplateName) {
                this.setControlValue('TemplateName', obj.TemplateName);
                this.uiForm.controls['TemplateName'].markAsDirty();
            } else {
                this.setControlValue('TemplateName', '');
            }
        }
    }

    public resetSecondaryFields(): void {
        this.disableControl('AnnualCalendarInd', true);
        this.disableControl('FollowTemplateInd', true);
        this.disableControl('AnnualCalendarTemplateNumber', true);
        this.disableControl('LastChangeEffectDate', true);
        this.visibleLastChangeEffecDate = true;
        this.disableControl('menu', true);
        this.setControlValue('Status', '');
        this.setControlValue('ServiceVisitFrequency', '');
        this.setControlValue('ServiceVisitFrequency', '');
        this.setControlValue('ServiceQuantity', '');
        this.setControlValue('ServiceCommenceDate', '');
        this.setControlValue('AnnualCalendarInd', '');
        this.setControlValue('FollowTemplateInd', '');
        this.setControlValue('AnnualCalendarTemplateNumber', '');
        this.setControlValue('TemplateName', '');
        this.setControlValue('ServiceCoverRowID', '');
        this.LastChangeEffectDate = null;
        if (this.dtLastChangeEffectiveDate === null)
            this.dtLastChangeEffectiveDate = void 0;
        else
            this.dtLastChangeEffectiveDate = null;
    }

    public sendContractNumber(): void {
        this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.disableControl('PremiseNumber', false);
        document.querySelector('#PremiseNumber')['focus']();
    }
    public sendContractPremiseNumber(): void {
        this.ellipsis.ProductCodeEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.ProductCodeEllipsis.childparams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.disableControl('ProductCode', false);
        document.querySelector('#ProductCode')['focus']();
    }

    public ProductEllipsisModalOpen(): void {
        this.productCodeEllipsis.openModal();
    }
    public currentActivity = '';
    public save(): void {
        if (!this.isInvalidAnnualTemplate)
            return;
        this.riMaintenance.execMode(MntConst.eModeUpdate, [this]);
        this.currentActivity = 'SAVE';
        this.riMaintenance.CancelEvent = false;
        switch (this.currentActivity) {
            case 'SAVE':
                this.currentActivity = '';
                switch (this.riMaintenance.CurrentMode) {
                    case 'eModeUpdate':
                    case 'eModeSaveUpdate':
                        this.dataPostModeAction = 2;
                        this.riMaintenance.execMode(MntConst.eModeSaveUpdate, [this]);
                        break;
                }
                break;
        }
        this.routeAwayGlobals.setSaveEnabledFlag(true);
    }
    public confirm(): any {
        this.setControlValue('LastChangeEffectDate', this.LastChangeEffectDate);
        if (!this.getControlValue('LastChangeEffectDate')) {
            let LastChangeEffectDate = document.querySelector('#LastChangeEffectDate input[type="text"]');
            this.utils.removeClass(LastChangeEffectDate, 'ng-untouched');
            this.utils.addClass(LastChangeEffectDate, 'ng-touched');
        }
        if (this.riExchange.validateForm(this.uiForm)) {
            this.promptModal.show();
        }
    }
    public confirmed(obj: any): any {
        this.riMaintenance.CancelEvent = false;
        this.riMaintenance.execContinue(this.riMaintenance.CurrentMode, [this]);
    }
    public closeModal(): void {
        this.isModalOpen(false);
        this.riMaintenance.handleConfirm(this);
    }
    public isModalOpen(flag: boolean): void {
        this.riMaintenance.isModalOpen = flag;
    }
    public cancel(): void {
        this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
        this.LastChangeEffectDate = null;
        if (this.dtLastChangeEffectiveDate === null)
            this.dtLastChangeEffectiveDate = void 0;
        else
            this.dtLastChangeEffectiveDate = null;
        this.CallRimaintenance();
    }
    public riMaintenance_BeforeUpdate(): void {
        this.visibleEffectiveDate = true;
        this.SetFieldStatus();
    }
    public riMaintenance_AfterSave(): void {
        this.annualCalanderLookUp();
        this.setControlValue('LastChangeEffectDate', this.LastChangeEffectDate);

        let fields = `ContractNumber, PremiseNumber , ProductCode , ServiceVisitFrequency,ServiceQuantity,ServiceCommenceDate,
        ServiceQuantity , AnnualCalendarInd , FollowTemplateInd , ContractName , PremiseName,
        ProductDesc,LastChangeEffectDate,CalendarUpdateAllowed,Function,ContractTypeCode , AnnualCalendarTemplateNumber , TemplateName,ServiceCoverRowID`;
        fields = fields.replace(/\\t/g, '').replace(/\r?\n|\r/g, '').replace(/ /g, '');
        let fieldsArr = fields.split(',');
        this.riMaintenance.clear();
        for (let i = 0; i < fieldsArr.length; i++) {
            let id = fieldsArr[i];
            let dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            let value = this.riExchange.riInputElement.GetValue(this.uiForm, id);
            this.riMaintenance.PostDataAdd(id, value, dataType);
        }
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                this.messageModal.show({ msg: this.messageContentSaved, title: this.messageTitle }, false);
                this.setControlValue('TemplateName', data.TemplateName);
                this.setControlValue('AnnualCalendarTemplateNumber', data.AnnualCalendarTemplateNumber);
                if (data.AnnualCalendarInd === 'yes') {
                    this.setControlValue('AnnualCalendarInd', true);
                } else {
                    this.setControlValue('AnnualCalendarInd', false);
                }
                if (data.FollowTemplateInd === 'yes') {
                    this.setControlValue('FollowTemplateInd', true);
                    this.visibleAnnualCalendar = true;
                } else {
                    this.setControlValue('FollowTemplateInd', false);
                    this.visibleAnnualCalendar = false;
                }
                this.formPristine();
            }
        }, 'POST', this.dataPostModeAction);
    }

    public showAlart(): void {
        //
    }
    public riMaintenance_BeforeFetch(): void {
        if (!this.getControlValue('ContractNumber')) {
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=CheckContractType' + '&ContractTypeCode=' + this.riExchange.getCurrentContractTypeLabel();
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestAdd('ContractNumber');
            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                //
            });
        }
    }
    public AnnualCalendarInd_onClick(): void {
        if (this.getControlValue('AnnualCalendarInd')) {
            this.setControlValue('FollowTemplateInd', true);
        }
        this.SetFieldStatus();
    }
    public FollowTemplateInd_onClick(): void {
        this.SetFieldStatus();
    }
    public riMaintenance_Search(): void {
        if (this.getControlValue('ContractNumber') === '')
            this.ellipsis.contractNumberEllipsis.childparams.parentMode = 'Search';
        if (this.getControlValue('ContractNumber') !== '' && this.getControlValue('PremiseNumber') === '')
            this.ellipsis.premiseNumberEllipsis.childparams.parentMode = 'Search';
        if (this.getControlValue('ContractNumber') !== '' && this.getControlValue('PremiseNumber') !== '')
            this.ellipsis.premiseNumberEllipsis.childparams.parentMode = 'Search';
    }
    public SetFieldStatus(): void {
        if (this.getControlValue('AnnualCalendarInd')) {
            this.disableAnnualCalendarEllipsis = false;
            this.riExchange.riInputElement.Enable(this.uiForm, 'FollowTemplateInd');
            this.riExchange.riInputElement.Enable(this.uiForm, 'AnnualCalendarTemplateNumber');
        } else {
            this.disableAnnualCalendarEllipsis = true;
            this.riExchange.riInputElement.Disable(this.uiForm, 'FollowTemplateInd');
            this.riExchange.riInputElement.Disable(this.uiForm, 'AnnualCalendarTemplateNumber');
            this.setControlValue('FollowTemplateInd', false);
            this.setControlValue('AnnualCalendarTemplateNumber', '');
            this.setControlValue('TemplateName', '');
        }
        if (this.getControlValue('FollowTemplateInd')) {
            this.riMaintenance.SetRequiredStatus('AnnualCalendarTemplateNumber', true);
            this.visibleAnnualCalendar = true;
        } else {
            this.riMaintenance.SetRequiredStatus('AnnualCalendarTemplateNumber', false);
            this.visibleAnnualCalendar = false;
        }
    }
    public menu_onchange(): void {
        this.uiForm.controls['menu'].markAsPristine();
        switch (this.getControlValue('menu')) {
            case 'Calendar':
                this.cmdCalendar_onclick();
                break;
            case 'PlanVisit':
                this.cmdPlanVisit_onclick();
                break;
            case 'StaticVisit':
                this.cmdStaticVisit_onclick();
                break;
        }
    }

    public cmdCalendar_onclick(): void {
        this.navigate('ServiceCover', InternalGridSearchApplicationModuleRoutes.ICABSASERVICECOVERCALENDARDATEGRID, {
            'ServiceCover': this.getControlValue('ServiceCoverRowID')
        });
    }
    public cmdPlanVisit_onclick(): void {
        this.navigate('ServiceCover', InternalGridSearchSalesModuleRoutes.ICABSAPLANVISITGRIDYEAR, {
            'ContractNumber': this.getControlValue('ContractNumber'),
            'ContractName': this.getControlValue('ContractName'),
            'PremiseNumber': this.getControlValue('PremiseNumber'),
            'PremiseName': this.getControlValue('PremiseName'),
            'ProductCode': this.getControlValue('ProductCode'),
            'ProductDesc': this.getControlValue('ProductDesc'),
            'ServiceCoverRowID': this.getControlValue('ServiceCoverRowID')
        });
    }
    public cmdStaticVisit_onclick(): void {
        this.navigate('ServiceCover', InternalGridSearchSalesModuleRoutes.ICABSASTATICVISITGRIDYEAR, {
            'ContractNumber': this.getControlValue('ContractNumber'),
            'ContractName': this.getControlValue('ContractName'),
            'PremiseNumber': this.getControlValue('PremiseNumber'),
            'PremiseName': this.getControlValue('PremiseName'),
            'ProductCode': this.getControlValue('ProductCode'),
            'ProductDesc': this.getControlValue('ProductDesc'),
            'ServiceCoverRowID': this.getControlValue('ServiceCoverRowID')
        });
    }
    public annualCalanderLookUp(): void {
        this.riMaintenance.AddVirtualTable('AnnualCalendarTemplate');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('AnnualCalendarTemplateNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('TemplateName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);
    }

    public postRequestContract(): void {
        let searchPost: URLSearchParams;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'CheckContractType';
        postParams.ContractNumber = this.getControlValue('ContractNumber');
        postParams.ContractTypeCode = this.getControlValue('ContractTypeCode');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, searchPost, postParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.CallRimaintenance();
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public doLookupAnnualTemplate(): void {
        let lookupIP = [
            {
                'table': 'AnnualCalendarTemplate',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'AnnualCalendarTemplateNumber': this.getControlValue('AnnualCalendarTemplateNumber')
                },
                'fields': ['TemplateName']
            }

        ];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            this.setControlValue('TemplateName', '');
            this.uiForm.controls['AnnualCalendarTemplateNumber'].markAsTouched();
            this.riExchange.validateForm(this.uiForm);
            let AnnualCalendarTemplate = data[0][0];
            if (AnnualCalendarTemplate) {
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AnnualCalendarTemplateNumber', false);
                this.setControlValue('TemplateName', AnnualCalendarTemplate.TemplateName);
                this.isInvalidAnnualTemplate = true;
            } else {
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AnnualCalendarTemplateNumber', true);
                this.riExchange.riInputElement.markAsError(this.uiForm, 'AnnualCalendarTemplateNumber');
                this.isInvalidAnnualTemplate = false;
            }
        }).catch(e => {
            //TO DO
        });
    }

    public CallRimaintenance(): void {
        this.riMaintenance.BusinessObject = 'riControl.p';

        this.riMaintenance.CustomBusinessObject = 'iCABSServiceCoverCalendarEntry.p';
        this.riMaintenance.CustomBusinessObjectSelect = true;
        this.riMaintenance.CustomBusinessObjectConfirm = false;
        this.riMaintenance.CustomBusinessObjectInsert = false;
        this.riMaintenance.CustomBusinessObjectUpdate = true;
        this.riMaintenance.CustomBusinessObjectDelete = false;

        this.riMaintenance.FunctionSnapShot = false;
        this.riMaintenance.FunctionAdd = false;
        this.riMaintenance.FunctionDelete = false;

        this.riMaintenance.AddTable('ServiceCover');

        this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableKey('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableKey('Function', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableKey('ServiceCoverRowID', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableKey('ContractTypeCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');

        this.riMaintenance.AddTableField('ServiceVisitFrequency', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServiceQuantity', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServiceCommenceDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('AnnualCalendarInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('FollowTemplateInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('Status', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('Status', false);
        this.riMaintenance.AddTableField('ContractName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('PremiseName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ProductDesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ErrorMessageDesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('AnnualCalendarTemplateNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('TemplateName', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('LastChangeEffectDate', MntConst.eTypeDate, MntConst.eFieldOptionRequired, MntConst.eFieldStateRequired, 'Required');
        this.riMaintenance.AddTableField('CalendarUpdateAllowed', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableCommit(this, this.getTableData);
    }

    public getTableData(data: any): void {
        if (data.hasError) {
            this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
        } else {
            if (data.findResult === '<Single>') {
                this.pageParams.ContractNumber = this.getControlValue('ContractNumber');
                this.pageParams.PremiseNumber = this.getControlValue('PremiseNumber');
                this.pageParams.ProductCode = this.getControlValue('ProductCode');
                this.pageParams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
                this.disableControl('ContractNumber', true);
                this.disableControl('PremiseNumber', true);
                this.disableControl('ProductCode', true);
                this.disableControl('AnnualCalendarInd', false);
                this.disableControl('FollowTemplateInd', false);
                this.disableControl('LastChangeEffectDate', false);
                this.disableControl('menu', false);
                this.visibleLastChangeEffecDate = false;
                this.disableSaveCancel = false;
                this.setControlValue('CalendarUpdateAllowed', data.CalendarUpdateAllowed);
                this.setControlValue('TemplateName', data.TemplateName);
                if (this.getControlValue('AnnualCalendarInd') === 'yes' || this.getControlValue('AnnualCalendarInd') === true) {
                    this.setControlValue('AnnualCalendarInd', true);
                } else {
                    this.setControlValue('AnnualCalendarInd', false);
                }
                if (this.getControlValue('FollowTemplateInd') === 'yes' || this.getControlValue('FollowTemplateInd') === true) {
                    this.setControlValue('FollowTemplateInd', true);
                } else {
                    this.setControlValue('FollowTemplateInd', false);
                }
                this.setControlValue('ContractName', data.ContractName);
                this.setControlValue('PremiseName', data.PremiseName);
                this.setControlValue('ProductDesc', data.ProductDesc);
                this.setControlValue('AnnualCalendarTemplateNumber', data.AnnualCalendarTemplateNumber);
                this.setControlValue('ServiceCoverRowID', data.ServiceCover);
                this.SetFieldStatus();
                this.formPristine();
            }
            if (data.findResult === '<Multi>') {
                this.ProductEllipsisModalOpen();
            }
        }
    }
    public LastChangeEffectiveDateValue(value: any): void {
        if (value && value.value) {
            this.LastChangeEffectDate = value.value;
        }
    }
}
