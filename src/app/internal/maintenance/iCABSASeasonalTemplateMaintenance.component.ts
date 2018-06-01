import { OnInit, OnDestroy, ViewChild, Component, Injector, AfterViewInit, ElementRef } from '@angular/core';

import { Subscription } from 'rxjs';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { GlobalizeService } from '../../../shared/services/globalize.service';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { SeasonalTemplateSearchComponent } from './../search/iCABSBSeasonalTemplateSearch';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { CustomerTypeSearchComponent } from './../search/iCABSSCustomerTypeSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { BranchSearchComponent } from './../search/iCABSBBranchSearch';
import { InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSASeasonalTemplateMaintenance.html'
})

export class SeasonalTemplateMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    /**
     * Template Selection Attribute
     */
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('branchSearchDropDown') public branchSearchDropDownField: BranchSearchComponent;
    @ViewChild('seasonaltemplatedetailEllipsis') public seasonaltemplatedetailEllipsis: EllipsisComponent;
    /**
     * Private Variables
     */
    private globalizeService: GlobalizeService;
    private isReturningStatus: boolean = false;

    //Subscription Variables
    private seasonalTemplateNumber: Subscription;
    private updateSeasonal: Subscription;

    //API Variables
    private queryParams: any = {
        method: 'service-planning/maintenance',
        module: 'template',
        operation: 'Application/iCABSASeasonalTemplateMaintenance'
    };
    /**
     * Public Variables
     */
    public pageId: string = '';
    public controls = [
        { name: 'SeasonalTemplateNumber', disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'TemplateName', disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'CustomerTypeCode', disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'CustomerTypeDesc', disabled: true, required: false },
        { name: 'NoOfSeasons', disabled: true, required: true, type: MntConst.eTypeInteger },
        { name: 'menu', disabled: false, required: false },
        //Hidden fields
        { name: 'SeasonalTemplateROWID' },
        { name: 'OwnerBranchNumber', disabled: false, required: true, type: MntConst.eTypeInteger },
        { name: 'ErrorMessageDesc', type: MntConst.eTypeText },
        { name: 'BusinessCode', type: MntConst.eTypeCode },
        { name: 'BranchNumber', type: MntConst.eTypeInteger },
        { name: 'BranchName', type: MntConst.eTypeText }
    ];
    //Ellipsis Config Variables
    public ellipsis: any = {
        inputParamsSeasonalTemplateNumber: {
            isAutoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'showAddNew': true,
                'ServiceBranchNumber': '',
                'BranchName': ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            component: SeasonalTemplateSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        customerTypeCodeEllipsis: {
            showCloseButton: true,
            showHeader: true,
            disabled: true,
            childparams: {
                'parentMode': 'LookUp'
            },
            component: CustomerTypeSearchComponent
        }
    };
    // Service Branch Dropdown Config
    public serviceBranchdDropdown: any = {
        servicebranch: {
            params: {
                'parentMode': 'LookUp-SeasonalTemplate'
            },
            active: {
                id: '',
                text: ''
            },
            disabled: false,
            required: true,
            isError: true,
            isTriggerValidate: false
        }
    };
    //Field Disable Variables
    public isFieldDisable: any = {
        saveButton: true,
        cancelButton: true,
        deleteButton: true
    };
    //Field Hidden Variable
    public isFieldHidden: any = {
        deleteButton: false
    };
    /**
     * Class Constructor With Dependency Injections
     */
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASEASONALTEMPLATEMAINTENANCE;
        this.pageTitle = this.browserTitle = 'Seasonal Template Maintenance';
    }
    /**
     * On Init Life Cycle Hook Inittate Funcationality
     */
    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.isReturningStatus = true;
            this.setFormMode(this.pageParams.formMode);
        }
    }
    /**
     * On Destroy Life Cycle Hook To Unsubscribe Subscription
     */
    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.seasonalTemplateNumber) {
            this.seasonalTemplateNumber.unsubscribe();
        }
        if (this.updateSeasonal) {
            this.updateSeasonal.unsubscribe();
        }
    }
    /**
     * After View Initialize Life Cycle Hook To Do After Page Load Operations
     */
    ngAfterViewInit(): void {
        if (this.isReturningStatus) {
            switch (this.pageParams.formMode) {
                case this.c_s_MODE_SELECT:
                    this.selectModeView();
                    break;
                case this.c_s_MODE_UPDATE:
                    if (this.pageParams.SeasonalTemplateNumber) {
                        this.resetUpdateFormDetails();
                    }
                    break;
                case this.c_s_MODE_ADD:
                    this.onSeasonalTemplateAddMode(this.c_s_MODE_ADD);
                    break;
            }
        } else {
            this.windowOnLoad();
        }
    }
    /**
     * Method to do Operations After Window Load
     * @params: params: void
     * @return: : void
     */
    private windowOnLoad(): void {
        this.pageParams = {
            formMode: this.c_s_MODE_SELECT,
            SeasonalTemplateNumber: '',
            TemplateName: '',
            CustomerTypeCode: '',
            CustomerTypeDesc: '',
            NoOfSeasons: '',
            menu: '',
            SeasonalTemplateROWID: '',
            OwnerBranchNumber: '',
            ErrorMessageDesc: '',
            SeasonalTemplate: '',
            BusinessCode: '',
            BranchNumber: '',
            BranchName: '',
            formHasError: false,
            saveClicked: false
        };
        this.selectModeView();
    }
    /**
     * Method to Fetch Branch Name
     * @params: params: void
     * @return: : void
     */
    private fetchBranchName(): void {
        let lookupIP: any = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'BranchNumber': this.getControlValue('OwnerBranchNumber')
                },
                'fields': ['BranchName']
            }
        ];

        this.LookUp.lookUpRecord(lookupIP, 500).subscribe((data) => {
            let lookUpRecord: any = data;
            if (lookUpRecord.length) {
                this.setControlValue('BranchName', lookUpRecord[0][0].BranchName);
                this.pageParams.BranchName = lookUpRecord[0][0].BranchName;
                this.serviceBranchdDropdown.servicebranch.active = {
                    id: this.getControlValue('BranchNumber'),
                    text: this.getControlValue('BranchNumber') + ' - ' + this.getControlValue('BranchName')
                };
            }
        });
    }
    /**
     * Method to Save Form
     * @params: void
     * @return: : void
     */
    private executeSaveForm(): void {
        switch (this.formMode) {
            case this.c_s_MODE_ADD:
                let promptVO1: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.addNewSeasonalTemplate.bind(this));
                this.modalAdvService.emitPrompt(promptVO1);
                break;
            case this.c_s_MODE_UPDATE:
                let promptVO2: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.updateSeasonalTemplate.bind(this));
                this.modalAdvService.emitPrompt(promptVO2);
                break;
            default:
                break;
        }
    }
    /**
     * Method to Fetch Customer Type Description
     * @params: params: boolean
     * @return: : void
     */
    public fetchCustomerTypeDescription(): void {
        let lookupIP: any = [
            {
                'table': 'CustomerTypeLanguage',
                'query': {
                    'CustomerTypeCode': this.getControlValue('CustomerTypeCode'),
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'BusinessCode': this.businessCode()
                },
                'fields': ['CustomerTypeDesc']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP, 500).subscribe((data) => {
            let lookUpRecord: any = data;
            if (lookUpRecord[0][0]) {
                this.setControlValue('CustomerTypeDesc', lookUpRecord[0][0].CustomerTypeDesc);
                this.pageParams.CustomerTypeDesc = lookUpRecord[0][0].CustomerTypeDesc;
                if (this.pageParams.saveClicked) {
                    this.executeSaveForm();
                }
            } else {
                if (this.getControlValue('CustomerTypeCode')) {
                    this.setControlValue('CustomerTypeDesc', '');
                    this.pageParams.CustomerTypeDesc = '';
                    this.riExchange.riInputElement.markAsError(this.uiForm, 'CustomerTypeCode');
                } else {
                    this.setControlValue('CustomerTypeDesc', '');
                    this.pageParams.CustomerTypeDesc = '';
                    if (this.pageParams.saveClicked) {
                        this.executeSaveForm();
                    }
                }
            }
        });
    }
    /**
     * Method to Implement Functionality on Template Number Change
     * @params: params: void
     * @return: : void
     */
    public onSeasonalTemplateNumberChange(): void {
        if (this.getControlValue('SeasonalTemplateNumber')) {
            let search: any = this.getURLSearchParamObject();
            search.set(this.serviceConstants.Action, '0');
            search.set('SeasonalTemplateNumber', this.getControlValue('SeasonalTemplateNumber'));
            this.pageParams.seasonalTemplateNumber = this.getControlValue('SeasonalTemplateNumber');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.seasonalTemplateNumber = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        this.setControlValue('TemplateName', '');
                    } else {
                        this.updateModeView();
                        this.setControlValue('TemplateName', data.TemplateName);
                        this.setControlValue('NoOfSeasons', data.NoOfSeasons);
                        this.setControlValue('CustomerTypeCode', data.CustomerTypeCode);
                        this.setControlValue('OwnerBranchNumber', data.OwnerBranchNumber);
                        this.setControlValue('BranchNumber', data.OwnerBranchNumber);
                        this.setControlValue('SeasonalTemplateROWID', data.ttSeasonalTemplate);
                        this.fetchBranchName();
                        this.fetchCustomerTypeDescription();
                        this.setPageParamsValue();
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    this.setControlValue('TemplateName', '');
                });
        } else {
            this.setControlValue('SeasonalTemplateNumber', '');
        }
    }
    /**
     * Method to Set Branch Number on Branch Number Dropdown Option Selection
     * @params: params: void
     * @return: : void
     */
    public onOwnerBranchNumberChange(data: any): void {
        if (data) {
            this.setControlValue('OwnerBranchNumber', data.BranchNumber);
            this.setControlValue('BranchName', data.BranchName);
            this.uiForm.controls['OwnerBranchNumber'].markAsDirty();
        }
    }
    /**
     * Method to do Operations After Seasoanl Template Number is Received From Ellipsis
     * @params: params: void
     * @return: : void
     */
    public onSeasonalTemplateNumberReceived(data: any): void {
        this.setControlValue('SeasonalTemplateNumber', data.TemplateNumber);
        this.setControlValue('TemplateName', data.TemplateName);
        this.uiForm.controls['SeasonalTemplateNumber'].markAsDirty();
        this.onSeasonalTemplateNumberChange();
    }
    /**
     * Method to do Functionality On Save Button Click
     * @params: params: void
     * @return: : void
     */
    public saveSeasonalTemplate(): void {
        if (this.uiForm.valid) {
            this.pageParams.saveClicked = true;
            this.fetchCustomerTypeDescription();
        } else {
            this.uiForm.markAsTouched();
            if (!this.uiForm.controls['OwnerBranchNumber'].valid) {
                this.serviceBranchdDropdown.servicebranch.isTriggerValidate = true;
            }
        }
    }
    /**
     * Method to do Functioanlity on Delete Button Click
     * @params: params: void
     * @return: : void
     */
    public deleteSeasonalTemplate(): void {
        let promptVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.DeleteRecord, null, this.deleteExistingSeasonalTemplate.bind(this));
        this.modalAdvService.emitPrompt(promptVO);
    }
    /**
     * Method to do Funcationality on Cancel Button Click
     * @params: params: void
     * @return: : void
     */
    public cancelSeasonalTemplate(): void {
        switch (this.formMode) {
            case this.c_s_MODE_ADD:
                this.selectModeView();
                break;
            case this.c_s_MODE_UPDATE:
                this.resetUpdateFormDetails();
                break;
            default:
                break;
        }
    }
    /**
     * Method to Update Seasonal Template Details
     * @params: params: void
     * @return: void
     */
    public updateSeasonalTemplate(): void {
        let formData: Object = {};

        let search: any = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');

        formData['SeasonalTemplateROWID'] = this.getControlValue('SeasonalTemplateROWID');
        formData['SeasonalTemplateNumber'] = this.getControlValue('SeasonalTemplateNumber');
        formData['TemplateName'] = this.getControlValue('TemplateName');
        formData['OwnerBranchNumber'] = this.getControlValue('OwnerBranchNumber');
        formData['CustomerTypeCode'] = this.getControlValue('CustomerTypeCode');
        formData['NoOfSeasons'] = this.getControlValue('NoOfSeasons');
        formData['ErrorMessageDesc'] = '';
        formData['Function'] = 'GetLatestProspectDetails';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.updateSeasonal = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                    this.updateModeView();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }
    /**
     * Method to Add New Seasonal Template Details
     * @params: params: void
     * @return: void
     */
    public addNewSeasonalTemplate(): void {
        let formData: Object = {};

        let search: any = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '1');

        formData['SeasonalTemplateNumber'] = '';
        formData['TemplateName'] = this.getControlValue('TemplateName');
        formData['OwnerBranchNumber'] = this.getControlValue('OwnerBranchNumber');
        formData['CustomerTypeCode'] = this.getControlValue('CustomerTypeCode');
        formData['NoOfSeasons'] = this.getControlValue('NoOfSeasons');
        formData['ErrorMessageDesc'] = '';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.updateSeasonal = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                    this.updateModeView();
                    this.pageParams.formMode = this.c_s_MODE_UPDATE;
                    this.setControlValue('SeasonalTemplateNumber', data.SeasonalTemplateNumber);
                    this.setPageParamsValue();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }
    /**
     * Method to Delete Existing Seasonal Template
     * @params: params: void
     * @return: void
     */
    public deleteExistingSeasonalTemplate(): void {
        let formData: Object = {};

        let search: any = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '3');

        formData['SeasonalTemplateROWID'] = this.getControlValue('SeasonalTemplateROWID');
        formData['SeasonalTemplateNumber'] = this.getControlValue('SeasonalTemplateNumber');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.updateSeasonal = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordDeleted));
                    this.selectModeView();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }
    /**
     * Method to Set Value On Customer Type Data Received
     * @params: params: void
     * @return: : void
     */
    public onCustomerTypeDataReceived(data: any): void {
        if (data) {
            this.setControlValue('CustomerTypeCode', data.CustomerTypeCode);
            this.setControlValue('CustomerTypeDesc', data.CustomerTypeDesc);
            this.uiForm.controls['CustomerTypeCode'].markAsDirty();
        }
    }
    /**
     * Method to Set Select Mode View
     * @params: params: void
     * @return: : void
     */
    private selectModeView(): void {
        this.setFormMode(this.c_s_MODE_SELECT);
        this.pageParams.formMode = this.c_s_MODE_SELECT;
        this.uiForm.reset();
        this.serviceBranchdDropdown.servicebranch.active = {
            id: '',
            text: ''
        };
        this.ellipsis.inputParamsSeasonalTemplateNumber.isAutoOpen = true;
        this.ellipsis.inputParamsSeasonalTemplateNumber.disabled = false;
        this.disableControl('SeasonalTemplateNumber', false);
        this.disableControl('TemplateName', true);
        this.disableControl('CustomerTypeCode', true);
        this.disableControl('NoOfSeasons', true);
        this.disableControl('menu', true);
        this.serviceBranchdDropdown.servicebranch.disabled = true;
        this.ellipsis.customerTypeCodeEllipsis.disabled = true;
        this.isFieldDisable.saveButton = true;
        this.isFieldDisable.cancelButton = true;
        this.isFieldDisable.deleteButton = true;
        this.isFieldHidden.deleteButton = false;
    }
    /**
     * Method to Set Update Mode View
     * @params: params: void
     * @return: : void
     */
    private updateModeView(): void {
        this.setFormMode(this.c_s_MODE_UPDATE);
        this.pageParams.formMode = this.c_s_MODE_UPDATE;
        this.disableControl('menu', false);
        this.disableControl('SeasonalTemplateNumber', true);
        this.disableControl('TemplateName', false);
        this.disableControl('CustomerTypeCode', false);
        this.disableControl('NoOfSeasons', false);
        this.ellipsis.inputParamsSeasonalTemplateNumber.isAutoOpen = false;
        this.ellipsis.inputParamsSeasonalTemplateNumber.disabled = false;
        this.serviceBranchdDropdown.servicebranch.disabled = false;
        this.ellipsis.customerTypeCodeEllipsis.disabled = false;
        this.isFieldDisable.saveButton = false;
        this.isFieldDisable.cancelButton = false;
        this.isFieldDisable.deleteButton = false;
        this.pageParams.saveClicked = false;
        this.isFieldHidden.deleteButton = true;
    }
    /**
     * Method to Set Add Mode
     * @params: params: data: any
     * @return: : void
     */
    public onSeasonalTemplateAddMode(data: any): void {
        this.setFormMode(this.c_s_MODE_ADD);
        this.pageParams.formMode = this.c_s_MODE_ADD;
        this.uiForm.reset();
        this.serviceBranchdDropdown.servicebranch.active = {
            id: '',
            text: ''
        };
        this.disableControl('menu', true);
        this.disableControl('SeasonalTemplateNumber', true);
        this.disableControl('TemplateName', false);
        this.ellipsis.inputParamsSeasonalTemplateNumber.isAutoOpen = false;
        this.ellipsis.inputParamsSeasonalTemplateNumber.disabled = true;
        this.disableControl('CustomerTypeCode', false);
        this.disableControl('NoOfSeasons', false);
        this.serviceBranchdDropdown.servicebranch.disabled = false;
        this.ellipsis.customerTypeCodeEllipsis.disabled = false;
        this.isFieldDisable.saveButton = false;
        this.isFieldDisable.cancelButton = false;
        this.isFieldDisable.deleteButton = true;
        this.isFieldHidden.deleteButton = false;
    }
    /**
     * Method to Reset Data to Previous Selected Template Number Details
     * @params: params: void
     * @return: : void
     */
    public resetUpdateFormDetails(): void {
        this.setControlValue('TemplateName', this.pageParams.TemplateName);
        this.setControlValue('NoOfSeasons', this.pageParams.NoOfSeasons);
        this.setControlValue('CustomerTypeCode', this.pageParams.CustomerTypeCode);
        this.setControlValue('OwnerBranchNumber', this.pageParams.OwnerBranchNumber);
        this.setControlValue('BranchNumber', this.pageParams.OwnerBranchNumber);
        this.setControlValue('SeasonalTemplateROWID', this.pageParams.ttSeasonalTemplate);
        this.serviceBranchdDropdown.servicebranch.active = {
            id: this.pageParams.OwnerBranchNumber,
            text: this.pageParams.OwnerBranchNumber + ' - ' + this.pageParams.BranchName
        };
        this.setControlValue('CustomerTypeDesc', this.pageParams.CustomerTypeDesc);
        this.updateModeView();
    }
    /**
     * Method to Page Params Value
     * @params: params: void
     * @return: : void
     */
    public setPageParamsValue(): void {
        this.pageParams.SeasonalTemplateNumber = this.getControlValue('SeasonalTemplateNumber');
        this.pageParams.TemplateName = this.getControlValue('TemplateName');
        this.pageParams.NoOfSeasons = this.getControlValue('NoOfSeasons');
        this.pageParams.CustomerTypeCode = this.getControlValue('CustomerTypeCode');
        this.pageParams.OwnerBranchNumber = this.getControlValue('OwnerBranchNumber');
        this.pageParams.BranchNumber = this.getControlValue('BranchNumber');
        this.pageParams.SeasonalTemplateROWID = this.getControlValue('SeasonalTemplateROWID');
        this.pageParams.BranchName = this.getControlValue('BranchName');
        this.pageParams.CustomerTypeDesc = this.getControlValue('CustomerTypeDesc');
    }
    /**
     * Method to Navigate on Option Menu Selection
     * @params: params: void
     * @return: : void
     */
    public onMenuOptionChange(): void {
        let optionSelectd: string = this.getControlValue('menu');
        this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'menu');
        switch (optionSelectd) {
            case 'seasons':
                this.navigate('SeasonalTemplate', InternalGridSearchServiceModuleRoutes.ICABSASEASONALTEMPLATEDETAILGRID, {
                    parentMode: 'SeasonalTemplate'
                });
                break;
            case 'access':
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                /**
                 * @Note: iCABSASeasonalTemplateBranchAccessGrid.htm is Not Developed Yet, Will Navigate With Parent Mode 'SeasonalTemplate'
                 */
                /*this.navigate('SeasonalTemplate', iCABSASeasonalTemplateBranchAccessGrid.htm, {
                    parentMode: 'SeasonalTemplate'
                });*/
                break;
            case 'templateuse':
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                /**
                 * @Note: iCABSASeasonalServiceGrid.htm is Not Developed Yet, Will Navigate With Parent Mode 'SeasonalTemplate'
                 */
                /*this.navigate('SeasonalTemplate', iCABSASeasonalServiceGrid.htm, {
                    parentMode: 'SeasonalTemplate'
                });*/
                break;
        }
    }
}
