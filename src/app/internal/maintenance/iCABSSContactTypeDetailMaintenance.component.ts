import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { ContactTypeSearchComponent } from './../search/iCABSSContactTypeSearch';
import { ContactTypeDetailSearchDropDownComponent } from './../search/iCABSSContactTypeDetailSearch.component';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { AssignToData } from './iCABSSContactTypeDetailMaintenanceAssignToData';
import { ScreenNotReadyComponent } from '../../../shared/components/screenNotReady';
import { InternalGridSearchSalesModuleRoutes, InternalGridSearchApplicationModuleRoutes } from './../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSSContactTypeDetailMaintenance.html'
})

export class ContactTypeDetailMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('contactTypeDropDown') contactTypeDropDown: ContactTypeSearchComponent;
    @ViewChild('ddContactTypeDetailSearch') ddContactTypeDetailSearch: ContactTypeDetailSearchDropDownComponent;
    @ViewChild('urlSelect') urlSelect: DropdownStaticComponent;
    @ViewChild('workOrderTypeDropdown') workOrderTypeDropdown: DropdownStaticComponent;
    @ViewChild('assignToEmployeeTypeSelect') assignToEmployeeTypeSelect: DropdownStaticComponent;
    @ViewChild('occupationCodeDropdown') occupationCodeDropdown: DropdownStaticComponent;
    @ViewChild('optionDropdown') optionDropdown: DropdownStaticComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModalSave') public promptModalSave;
    @ViewChild('promptModalDelete') public promptModalDelete;
    @ViewChild('errorModal') public errorModal;
    private action: string = '';
    private isOccupationRelated: boolean = false;
    private isSupervisorRelated: boolean = false;
    private gcCRContactTypeCode: any;
    private cCRContactTypeCode: any;
    private isFirstContactTypeSelected = false;
    private isCRAutoCreateProspect: boolean = false;
    private mode: string = 'UPDATE';
    private lookUpSubscription: Subscription;
    public pageId: string = '';
    public isDisableButtons: boolean = true;
    public isDisableDeleteButton: boolean = true;
    public isVisibleAdd: boolean = true;
    public isVisibleAddInputs: boolean = false;
    public isVisibleDelete: boolean = true;
    public isVisibleOccupationDropdown: boolean = false;
    public isVisibleClientRetention: boolean = false;
    public isVisibleSupervisorInput: boolean;
    public windowToRunOptions: Array<any> = [];
    public workOrderType: Array<any> = [{}];
    public assignToEmployeeType: Array<any> = [{}];
    public occupationTypeDropdown: Array<any> = [{}];
    public optionDropdownInput: Array<any> = [{}];
    public promptContentConfirm: string = MessageConstant.Message.ConfirmRecord;
    public promptContentDelete: string = MessageConstant.Message.DeleteRecord;
    public messageContentSaved: string = MessageConstant.Message.RecordSavedSuccessfully;
    public messageContentDeleted: string = MessageConstant.Message.RecordDeletedSuccessfully;
    public messageTitle: string = MessageConstant.Message.MessageTitle;
    public screenNotReadyComponent: Component = ScreenNotReadyComponent;
    public xhrParams = {
        operation: 'System/iCABSSContactTypeDetailMaintenance',
        module: 'tickets',
        method: 'ccm/admin'
    };
    public inputParams: any = {};
    public dropdown: any = {
        contactTypeDetailSearch: {
            params: {
                ContactTypeCode: '#999'
            },
            active: { id: '', text: '' },
            isDisabled: false,
            isRequired: true
        }
    };

    public controls = [
        { name: 'ContactTypeCode', disabled: true, required: true },
        { name: 'ContactTypeDetailCode', disabled: true, required: true },
        { name: 'ContactTypeDetailSystemDesc', disabled: true, required: true },
        { name: 'AccountRequiredInd', disabled: true, required: false },
        { name: 'ContractRequiredInd', disabled: true, required: false },
        { name: 'ServiceCoverRequiredInd', disabled: true, required: false },
        { name: 'PremiseRequiredInd', disabled: true, required: false },
        { name: 'PostcodeRequiredInd', disabled: true, required: false },
        { name: 'ValidForNewInd', disabled: true, required: false },
        { name: 'PassToPDAInd', disabled: true, required: false },
        { name: 'URLSelect', disabled: true, required: false },
        { name: 'CloseOnCreateInd', disabled: true, required: false },
        { name: 'WOTypeCodeSelect', disabled: true, required: false },
        { name: 'AssignToEmployeeTypeSelect', disabled: true, required: false },
        { name: 'OccupationCodeSelect', disabled: true, required: false },
        { name: 'SupervisorLevel', disabled: true, required: false },
        { name: 'PassedToActionerDefaultInd', disabled: true, required: false },
        { name: 'ContactManagementWarningInd', disabled: true, required: false },
        { name: 'ClientRetentionCreateProspectInd', disabled: true, required: false },
        { name: 'PassToTabletInd', disabled: true, required: false },
        { name: 'CallCentreInd', disabled: true, required: false },
        { name: 'CallCentreReviewInd', disabled: true, required: false },
        { name: 'ForceRootCauseInd', disabled: true, required: false },
        { name: 'ClosureProcessInd', disabled: true, required: false },
        { name: 'ScheduledResolutionInd', disabled: true, required: false },
        { name: 'ContactCreateSecurityLevel', disabled: true, required: false },
        { name: 'AccountReviewInd', disabled: true, required: false },
        { name: 'RiskInd', disabled: true, required: false },
        { name: 'OpportunityInd', disabled: true, required: false },
        { name: 'OnGuardCode', disabled: true, required: false },
        { name: 'Option', disabled: true, required: false }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSCONTACTTYPEDETAILMAINTENANCE;
        this.browserTitle = 'Contact Type Detail Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Contact Type Detail Maintenance';
        this.createOptions();
        this.doLookupWOTypeLang();
        this.occupationData();
        this.getSysCharDtetails();
        this.urlSelect.disabled = true;
        this.workOrderTypeDropdown.disabled = true;
        this.assignToEmployeeTypeSelect.disabled = true;
        this.optionDropdown.disabled = true;

    }

    ngAfterViewInit(): void {
        if (this.isReturning()) {
            this.contactTypeDropDown.isFirstItemSelected = false;
            this.ddContactTypeDetailSearch.isFirstItemSelected = false;
            this.setControlValue('ContactTypeCode', this.pageParams.ContactTypeCode);
            this.setControlValue('ContactTypeDetailCode', this.pageParams.ContactTypeDetailCode);
            this.setControlValue('ContactTypeDetailSystemDesc', this.pageParams.ContactTypeDetailSystemDesc);
            this.ddContactTypeDetailSearch.active = { id: this.pageParams.ContactTypeDetailCode, text: this.pageParams.ContactTypeDetailCode + ' - ' + this.pageParams.ContactTypeDetailSystemDesc };
            this.contactTypeDropDown.active = { id: this.pageParams.ContactTypeCode, text: this.pageParams.ContactTypeCode + ' - ' + this.pageParams.ContactTypeSystemDesc };
            this.dropdown.contactTypeDetailSearch.params.ContactTypeCode = this.getControlValue('ContactTypeCode');
            if (this.ddContactTypeDetailSearch)
                this.ddContactTypeDetailSearch.fetchData();
            this.ContactTypeDetailChange();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public clearForm(): void {
        this.setControlValue('AccountRequiredInd', false);
        this.setControlValue('ContractRequiredInd', false);
        this.setControlValue('ServiceCoverRequiredInd', false);
        this.setControlValue('PremiseRequiredInd', false);
        this.setControlValue('PostcodeRequiredInd', false);
        this.setControlValue('ValidForNewInd', false);
        this.setControlValue('PassToPDAInd', false);
        this.setControlValue('CloseOnCreateInd', false);
        this.setControlValue('PassedToActionerDefaultInd', false);
        this.setControlValue('ContactManagementWarningInd', false);
        this.setControlValue('ClientRetentionCreateProspectInd', false);
        this.setControlValue('PassToTabletInd', false);
        this.setControlValue('CallCentreInd', false);
        this.setControlValue('CallCentreReviewInd', false);
        this.setControlValue('ForceRootCauseInd', false);
        this.setControlValue('ClosureProcessInd', false);
        this.setControlValue('ScheduledResolutionInd', false);
        this.setControlValue('AccountReviewInd', false);
        this.setControlValue('RiskInd', false);
        this.setControlValue('OpportunityInd', false);
        this.setControlValue('ContactTypeDetailCode', '');
        this.setControlValue('ContactTypeDetailSystemDesc', '');
        this.setControlValue('ContactCreateSecurityLevel', '');
        this.setControlValue('OnGuardCode', '');
        this.setControlValue('SupervisorLevel', '');
        this.urlSelect.selectedItem = '0';
        this.workOrderTypeDropdown.selectedItem = '';
        this.assignToEmployeeTypeSelect.selectedItem = '39';
    }

    private onChangeAssignToEmployeeTypeSelect(): void {
        this.isAssignToOccupationRelated();
        this.isAssignToEmployeeSupervisorRelated();
        if (this.isOccupationRelated)
            this.isVisibleOccupationDropdown = true;
        this.isVisibleSupervisorInput = false;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SupervisorLevel', false);
        if (this.isSupervisorRelated) {
            this.isVisibleSupervisorInput = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SupervisorLevel', true);
        }
    }

    private isAssignToOccupationRelated(): void {
        this.isOccupationRelated = false;
        if (this.getControlValue('AssignToEmployeeTypeSelect') === '41' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '42' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '43' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '44' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '45' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '46' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '47' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '48' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '49' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '50') {
            this.isOccupationRelated = true;
        }
    }

    private isAssignToEmployeeSupervisorRelated(): void {
        this.isSupervisorRelated = false;
        if (this.getControlValue('AssignToEmployeeTypeSelect') === '4' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '11' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '17' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '28' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '31' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '32' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '33' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '34' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '37' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '40' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '42' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '44' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '46' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '48' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '50' ||
            this.getControlValue('AssignToEmployeeTypeSelect') === '52') {
            this.isSupervisorRelated = true;
        }
    }

    private createOptions(): void {
        this.windowToRunOptions = [
            { text: 'Customer Contact Maintenance', value: '0' },
            { text: 'Fixed Price Job', value: '3' },
            { text: 'New Prospect', value: '1' },
            { text: 'New Prospect (Existing Account)', value: '2' },
            { text: 'Telesales Entry', value: '7' }
        ];
        this.optionDropdownInput = [
            { text: 'Options', value: '' },
            { text: 'Assignees', value: 'assignto' },
            { text: 'Escalation/Timescales', value: 'escalation' },
            { text: 'Teams/Notifications', value: 'properties' }
        ];
        this.workOrderType = [];
        let txt = 'None';
        this.getTranslatedValue(txt, null).subscribe((res: string) => {
            if (res) {
                this.workOrderType.push({ value: '', text: res });
            }
        });
        this.occupationTypeDropdown = [];
        this.assignToEmployeeType = AssignToData.ASSIGNTO_DATA;
        this.assignToEmployeeType.sort(function (first: string, second: string): any {
            let firstl: string = first['text'].toLowerCase(), secondl: string = second['text'].toLowerCase();
            return firstl < secondl ? -1 : firstl > secondl ? 1 : 0;
        });
    }

    private beforeAdd(): void {
        this.setControlValue('ValidForNewInd', true);
        this.workOrderTypeDropdown.selectedItem = '';
        this.assignToEmployeeTypeSelect.selectedItem = '1';
        this.setControlValue('SupervisorLevel', '1');
        this.setControlValue('ContactCreateSecurityLevel', '400');
        this.setControlValue('CallCentreInd', true);
        this.setControlValue('CallCentreReviewInd', true);
        this.setControlValue('PassedToActionerDefaultInd', true);
        this.onChangeAssignToEmployeeTypeSelect();
    }

    private beforeSaveUpdate(): void {
        if (this.getControlValue('AssignToEmployeeTypeSelect') === 19)
            this.setControlValue('PostcodeRequiredInd', true);
        this.isAssignToOccupationRelated();
        if (!this.isOccupationRelated)
            this.setControlValue('OccupationCode', '');
        this.isAssignToEmployeeSupervisorRelated();
        if (!this.isSupervisorRelated)
            this.setControlValue('SupervisorLevel', '1');
    }

    private showHideClientRetentionSettings(): void {
        this.setControlValue('ClientRetentionCreateProspectInd', false);
        if (this.gcCRContactTypeCode && this.getControlValue('ContactTypeCode') === this.gcCRContactTypeCode.toString() && this.isCRAutoCreateProspect)
            this.isVisibleClientRetention = true;
    }

    private ContactTypeDetailChange(): void {
        if (!this.getControlValue('ContactTypeCode') || !this.getControlValue('ContactTypeDetailCode')) return;
        let searchPost: URLSearchParams;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '0');
        let postParams: any = {};
        postParams.BusinessCode = this.businessCode();
        postParams.ContactTypeCode = this.getControlValue('ContactTypeCode');
        postParams.ContactTypeDetailCode = this.getControlValue('ContactTypeDetailCode');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, searchPost, postParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.isDisableButtons = false;
                    this.isDisableDeleteButton = false;
                    this.uiForm.enable();
                    this.urlSelect.disabled = false;
                    this.workOrderTypeDropdown.disabled = false;
                    this.assignToEmployeeTypeSelect.disabled = false;
                    this.optionDropdown.disabled = false;
                    this.setControlValue('ContactTypeCode', data.ContactTypeCode);
                    this.setControlValue('ContactTypeDetailCode', data.ContactTypeDetailCode);
                    this.setControlValue('ContactTypeSystemDesc', data.ContactTypeSystemDesc);
                    this.setControlValue('ContactTypeDetailSystemDesc', data.ContactTypeDetailSystemDesc);
                    this.setControlValue('AccountRequiredInd', data.AccountRequiredInd === 'yes' ? true : false);
                    this.setControlValue('AccountReviewInd', data.AccountReviewInd === 'yes' ? true : false);
                    this.setControlValue('CallCentreInd', data.CallCentreInd === 'yes' ? true : false);
                    this.setControlValue('CallCentreReviewInd', data.CallCentreReviewInd === 'yes' ? true : false);
                    this.setControlValue('ClientRetentionCreateProspectInd', data.ClientRetentionCreateProspectInd === 'yes' ? true : false);
                    this.setControlValue('CloseOnCreateInd', data.CloseOnCreateInd === 'yes' ? true : false);
                    this.setControlValue('ClosureProcessInd', data.ClosureProcessInd === 'yes' ? true : false);
                    this.setControlValue('ContactManagementWarningInd', data.ContactManagementWarningInd === 'yes' ? true : false);
                    this.setControlValue('ForceRootCauseInd', data.ForceRootCauseInd === 'yes' ? true : false);
                    this.setControlValue('OpportunityInd', data.OpportunityInd === 'yes' ? true : false);
                    this.setControlValue('PassToPDAInd', data.PassToPDAInd === 'yes' ? true : false);
                    this.setControlValue('PassToTabletInd', data.PassToTabletInd === 'yes' ? true : false);
                    this.setControlValue('PassedToActionerDefaultInd', data.PassedToActionerDefaultInd === 'yes' ? true : false);
                    this.setControlValue('PostcodeRequiredInd', data.PostcodeRequiredInd === 'yes' ? true : false);
                    this.setControlValue('PremiseRequiredInd', data.PremiseRequiredInd === 'yes' ? true : false);
                    this.setControlValue('RiskInd', data.RiskInd === 'yes' ? true : false);
                    this.setControlValue('ScheduledResolutionInd', data.ScheduledResolutionInd === 'yes' ? true : false);
                    this.setControlValue('ServiceCoverRequiredInd', data.ServiceCoverRequiredInd === 'yes' ? true : false);
                    this.setControlValue('ContractRequiredInd', data.ContractRequiredInd === 'yes' ? true : false);
                    this.setControlValue('ValidForNewInd', data.ValidForNewInd === 'yes' ? true : false);
                    this.setControlValue('OnGuardCode', data.OnGuardCode);
                    this.setControlValue('ContactCreateSecurityLevel', data.ContactCreateSecurityLevel);
                    this.setControlValue('OccupationCode', data.OccupationCode);
                    if (this.isOccupationRelated)
                        this.occupationCodeDropdown.selectedItem = this.getControlValue('OccupationCode');
                    this.setControlValue('SupervisorLevel', data.SupervisorLevel);
                    this.setControlValue('WOTypeCodeSelect', data.WOTypeCode);
                    this.workOrderTypeDropdown.selectedItem = '';
                    if (this.getControlValue('WOTypeCodeSelect'))
                        this.workOrderTypeDropdown.selectedItem = data.WOTypeCode;
                    this.setControlValue('URLSelect', data.URL);
                    this.setControlValue('AssignToEmployeeTypeSelect', data.AssignToEmployeeType);
                    this.assignToEmployeeTypeSelect.selectedItem = data.AssignToEmployeeType;
                    this.urlSelect.selectedItem = data.URL;
                    this.showHideClientRetentionSettings();
                    this.isAssignToOccupationRelated();
                    this.onChangeAssignToEmployeeTypeSelect();
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    private optionChangeNavigation(): void {
        switch (this.getControlValue('Option')) {
            case 'assignto':
                this.navigate('ContactTypeDetail', InternalGridSearchApplicationModuleRoutes.ICABSSCONTACTTYPEDETAILASSIGNEEGRID);
                break;
            case 'escalation':
                this.navigate('ContactTypeDetail', InternalGridSearchSalesModuleRoutes.ICABSSCONTACTTYPEDETAILESCALATEGRID);
                break;
            case 'properties':
                this.navigate('ContactTypeDetail', InternalGridSearchSalesModuleRoutes.ICABSSCONTACTTYPEDETAILPROPERTIESGRID);
                break;
            default:
                break;
        }
    }

    private getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharAutoGenerateProspectFromClientRetention
        ];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.isCRAutoCreateProspect = record[0]['Required'];
        });
    }

    private doLookupWOTypeLang(): void {
        let lookupIP = [
            {
                'table': 'WOType',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ProspectInd', 'BusinessCode', 'WOTypeCode', 'WOTypeSystemDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let wOTypeData = data[0];
            wOTypeData.sort(function (first: string, second: string): any {
                let firstl: string = first['WOTypeSystemDesc'].toLowerCase(), secondl: string = second['WOTypeSystemDesc'].toLowerCase();
                return firstl < secondl ? -1 : firstl > secondl ? 1 : 0;
            });
            if (wOTypeData) {
                let lookupIP = [
                    {
                        'table': 'WOTypeLang',
                        'query': {
                            'LanguageCode': this.riExchange.LanguageCode()
                        },
                        'fields': ['WOTypeCode', 'BusinessCode', 'LanguageCode', 'WOTypeDesc']
                    }

                ];
                this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
                    let wOTypeLangData = data[0];
                    let newWorkOrderType: any = {}, lngth: number = 0, txt: string, desc: string, lengthLanguage: number = 0;
                    lngth = wOTypeData.length;
                    if (wOTypeLangData)
                        lengthLanguage = wOTypeLangData.length;
                    for (let i = 0; i < lngth; i++) {
                        if (wOTypeData[i].ProspectInd) {
                            txt = wOTypeData[i].WOTypeCode;
                            desc = wOTypeData[i].WOTypeSystemDesc;
                            for (let j = 0; j < lengthLanguage; j++) {
                                if (wOTypeData[i].WOTypeCode === wOTypeLangData[j].WOTypeCode) {
                                    desc = wOTypeLangData[j].WOTypeDesc;
                                    break;
                                }
                            }
                            newWorkOrderType['value'] = txt;
                            newWorkOrderType['text'] = desc;
                            this.workOrderType.push(JSON.parse(JSON.stringify(newWorkOrderType)));
                        }
                    }
                });

            }
        });
    }

    private occupationData(): void {
        let lookupIP = [
            {
                'table': 'Occupation',
                'query': {},
                'fields': ['OccupationCode', 'OccupationDesc']
            }

        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let occupationData = data[0];
            let newOccupationTypeDropdown: any = {}, lngth: number = 0, txt: string, desc: string;
            lngth = occupationData.length;
            occupationData.sort(function (first: string, second: string): any {
                let firstl: string = first['OccupationDesc'].toLowerCase(), secondl: string = second['OccupationDesc'].toLowerCase();
                return firstl < secondl ? -1 : firstl > secondl ? 1 : 0;
            });
            for (let i = 0; i < lngth; i++) {
                txt = occupationData[i].OccupationCode;
                desc = occupationData[i].OccupationDesc;
                newOccupationTypeDropdown['value'] = txt;
                newOccupationTypeDropdown['text'] = desc;
                this.occupationTypeDropdown.push(JSON.parse(JSON.stringify(newOccupationTypeDropdown)));
            }
        });
    }

    private contactTypeData(): void {
        let lookupIP = [
            {
                'table': 'ContactType',
                'query': {},
                'fields': ['ClientRetentionDefault', 'ContactTypeCode']
            }

        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let contactTypeData: any = data[0];
            let lngth: number = 0;
            lngth = contactTypeData.length;
            for (let i = 0; i < lngth; i++) {
                if (contactTypeData[i].ClientRetentionDefault) {
                    this.gcCRContactTypeCode = contactTypeData[i].ContactTypeCode;
                    break;
                }
            }
        });
    }

    public saveData(): any {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.promptModalSave.show();
        }
    }

    public deleteData(): any {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.promptModalDelete.show();
        }
    }

    public promptConfirm(type: string): any {
        switch (type) {
            case 'save':
                this.action = '2';
                if (this.mode === 'ADD') {
                    this.action = '1';
                }
                this.ContactDetailAllFunction();
                break;
            case 'delete':
                this.mode = 'deleteMode';
                this.action = '3';
                this.ContactDetailAllFunction();
                break;
        }
    }

    public changeMode(): any {
        this.mode = 'ADD';
        this.uiForm.enable();
        this.isVisibleDelete = false;
        this.isVisibleAdd = false;
        this.isVisibleAddInputs = true;
        this.isDisableDeleteButton = true;
        this.isDisableButtons = false;
        this.urlSelect.disabled = false;
        this.workOrderTypeDropdown.disabled = false;
        this.assignToEmployeeTypeSelect.disabled = false;
        this.optionDropdown.disabled = false;
        this.clearForm();
        this.beforeAdd();
    }

    public ContactDetailAllFunction(): void {
        let searchPost: URLSearchParams;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, this.action);
        let postParams: any = {};
        if (this.mode === 'UPDATE')
            this.beforeSaveUpdate();
        postParams.BusinessCode = this.businessCode();
        postParams.ContactTypeCode = this.getControlValue('ContactTypeCode');
        postParams.ContactTypeDetailCode = this.getControlValue('ContactTypeDetailCode');
        postParams.ContactTypeDetailSystemDesc = this.getControlValue('ContactTypeDetailSystemDesc');
        postParams.ValidForNewInd = this.getControlValue('ValidForNewInd') === true ? 'yes' : 'no';
        postParams.PassToPDAInd = this.getControlValue('PassToPDAInd') === true ? 'yes' : 'no';
        postParams.CloseOnCreateInd = this.getControlValue('CloseOnCreateInd') === true ? 'yes' : 'no';
        postParams.AccountRequiredInd = this.getControlValue('AccountRequiredInd') === true ? 'yes' : 'no';
        postParams.ContractRequiredInd = this.getControlValue('ContractRequiredInd') === true ? 'yes' : 'no';
        postParams.PremiseRequiredInd = this.getControlValue('PremiseRequiredInd') === true ? 'yes' : 'no';
        postParams.ServiceCoverRequiredInd = this.getControlValue('ServiceCoverRequiredInd') === true ? 'yes' : 'no';
        postParams.PostcodeRequiredInd = this.getControlValue('PostcodeRequiredInd') === true ? 'yes' : 'no';
        postParams.CallCentreInd = this.getControlValue('CallCentreInd') === true ? 'yes' : 'no';
        postParams.CallCentreReviewInd = this.getControlValue('CallCentreReviewInd') === true ? 'yes' : 'no';
        postParams.URL = this.getControlValue('URLSelect');
        postParams.AssignToEmployeeType = this.getControlValue('AssignToEmployeeTypeSelect');
        if (this.isOccupationRelated)
            postParams.OccupationCode = this.getControlValue('OccupationCodeSelect');
        postParams.WOTypeCode = this.getControlValue('WOTypeCodeSelect');
        postParams.ClosureProcessInd = this.getControlValue('ClosureProcessInd') === true ? 'yes' : 'no';
        postParams.PassedToActionerDefaultInd = this.getControlValue('PassedToActionerDefaultInd') === true ? 'yes' : 'no';
        postParams.ScheduledResolutionInd = this.getControlValue('ScheduledResolutionInd') === true ? 'yes' : 'no';
        postParams.ContactCreateSecurityLevel = this.getControlValue('ContactCreateSecurityLevel');
        postParams.ContactManagementWarningInd = this.getControlValue('ContactManagementWarningInd') === true ? 'yes' : 'no';
        postParams.OnGuardCode = this.getControlValue('OnGuardCode');
        postParams.SupervisorLevel = this.getControlValue('SupervisorLevel');
        postParams.AccountReviewInd = this.getControlValue('AccountReviewInd') === true ? 'yes' : 'no';
        postParams.RiskInd = this.getControlValue('RiskInd') === true ? 'yes' : 'no';
        postParams.OpportunityInd = this.getControlValue('OpportunityInd') === true ? 'yes' : 'no';
        postParams.PassToTabletInd = this.getControlValue('PassToTabletInd') === true ? 'yes' : 'no';
        postParams.ForceRootCauseInd = this.getControlValue('ForceRootCauseInd') === true ? 'yes' : 'no';
        postParams.ClientRetentionCreateProspectInd = this.getControlValue('ClientRetentionCreateProspectInd') === true ? 'yes' : 'no';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, searchPost, postParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (this.mode === 'ADD') {
                        this.messageModal.show({ msg: this.messageContentSaved, title: this.messageTitle }, false);
                        this.setControlValue('ContactTypeSystemDesc', data.ContactTypeSystemDesc);
                        this.setControlValue('ContactTypeDetailSystemDesc', data.ContactTypeDetailSystemDesc);
                        this.setControlValue('AccountRequiredInd', data.AccountRequiredInd === 'yes' ? true : false);
                        this.setControlValue('AccountReviewInd', data.AccountReviewInd === 'yes' ? true : false);
                        this.setControlValue('CallCentreInd', data.CallCentreInd === 'yes' ? true : false);
                        this.setControlValue('CallCentreReviewInd', data.CallCentreReviewInd === 'yes' ? true : false);
                        this.setControlValue('ClientRetentionCreateProspectInd', data.ClientRetentionCreateProspectInd === 'yes' ? true : false);
                        this.setControlValue('CloseOnCreateInd', data.CloseOnCreateInd === 'yes' ? true : false);
                        this.setControlValue('ClosureProcessInd', data.ClosureProcessInd === 'yes' ? true : false);
                        this.setControlValue('ContactManagementWarningInd', data.ContactManagementWarningInd === 'yes' ? true : false);
                        this.setControlValue('ClosureProcessInd', data.ClosureProcessInd === 'yes' ? true : false);
                        this.setControlValue('ForceRootCauseInd', data.ForceRootCauseInd === 'yes' ? true : false);
                        this.setControlValue('OpportunityInd', data.OpportunityInd === 'yes' ? true : false);
                        this.setControlValue('PassToPDAInd', data.PassToPDAInd === 'yes' ? true : false);
                        this.setControlValue('PassToTabletInd', data.PassToTabletInd === 'yes' ? true : false);
                        this.setControlValue('PassedToActionerDefaultInd', data.PassedToActionerDefaultInd === 'yes' ? true : false);
                        this.setControlValue('PostcodeRequiredInd', data.PostcodeRequiredInd === 'yes' ? true : false);
                        this.setControlValue('PremiseRequiredInd', data.PremiseRequiredInd === 'yes' ? true : false);
                        this.setControlValue('RiskInd', data.RiskInd === 'yes' ? true : false);
                        this.setControlValue('ScheduledResolutionInd', data.ScheduledResolutionInd === 'yes' ? true : false);
                        this.setControlValue('ServiceCoverRequiredInd', data.ServiceCoverRequiredInd === 'yes' ? true : false);
                        this.setControlValue('ContractRequiredInd', data.ContractRequiredInd === 'yes' ? true : false);
                        this.setControlValue('ValidForNewInd', data.ValidForNewInd === 'yes' ? true : false);
                        this.setControlValue('OnGuardCode', data.OnGuardCode);
                        this.setControlValue('ContactCreateSecurityLevel', data.ContactCreateSecurityLevel);
                        this.setControlValue('OccupationCode', data.OccupationCode);
                        this.setControlValue('SupervisorLevel', data.SupervisorLevel);
                        this.clearForm();
                        this.assignToEmployeeTypeSelect.disabled = false;
                        this.urlSelect.disabled = false;
                        this.workOrderTypeDropdown.disabled = false;
                        this.markControlAsUnTouched('ContactTypeDetailCode');
                        this.markControlAsUnTouched('ContactTypeDetailSystemDesc');
                    }
                    if (this.mode === 'UPDATE') {
                        this.messageModal.show({ msg: this.messageContentSaved, title: this.messageTitle }, false);
                        this.formPristine();
                        this.urlSelect.disabled = true;
                        if (this.isOccupationRelated)
                            this.occupationCodeDropdown.disabled = true;
                        this.assignToEmployeeTypeSelect.disabled = true;
                        this.workOrderTypeDropdown.disabled = true;
                    }
                    if (this.action === '3') {
                        this.messageModal.show({ msg: this.messageContentDeleted, title: this.messageTitle }, false);
                    }
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public onChangeContactType(): void {
        let searchPost: URLSearchParams;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'GetCreateOnClose';
        postParams.BusinessCode = this.businessCode();
        postParams.ContactTypeCode = this.getControlValue('ContactTypeCode');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, searchPost, postParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.disableControl('ContactTypeDetailCode', false);
                    this.setControlValue('CloseOnCreateInd', false);
                    if (data.CloseOnCreate === '1') {
                        this.setControlValue('CloseOnCreateInd', true);
                    }
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public onChangeContactTypeDetail(): void {
        if (this.mode === 'UPDATE')
            this.ContactTypeDetailChange();
    }

    public onreceivedContactType(data: any): void {
        this.isFirstContactTypeSelected = false;
        this.contactTypeData();
        this.isVisibleClientRetention = false;
        this.clearForm();
        this.setControlValue('ContactTypeCode', data.ContactTypeCode);
        this.pageParams.ContactTypeCode = this.getControlValue('ContactTypeCode');
        this.pageParams.ContactTypeSystemDesc = data.ContactTypeSystemDesc;
        if (this.mode === 'UPDATE') {
            this.ddContactTypeDetailSearch.active = { id: '', text: '' };
            this.dropdown.contactTypeDetailSearch.params.ContactTypeCode = this.getControlValue('ContactTypeCode');
            if (this.ddContactTypeDetailSearch)
                this.ddContactTypeDetailSearch.fetchData();
        }
        if (this.mode === 'ADD')
            this.changeMode();
        this.onChangeContactType();
        this.ContactTypeDetailChange();
    }

    public onFirstreceivedContactType(data: any): void {
        this.isFirstContactTypeSelected = true;
        this.contactTypeData();
        this.setControlValue('ContactTypeCode', data.firstRow.ContactTypeCode);
        this.pageParams.ContactTypeSystemDesc = data.firstRow.ContactTypeSystemDesc;
        this.pageParams.ContactTypeCode = this.getControlValue('ContactTypeCode');
        this.dropdown.contactTypeDetailSearch.params.ContactTypeCode = this.getControlValue('ContactTypeCode');
        if (this.ddContactTypeDetailSearch && this.getControlValue('ContactTypeCode'))
            this.ddContactTypeDetailSearch.fetchData();
        this.onChangeContactType();
        this.ContactTypeDetailChange();
    }



    public onWindowToRunChange(data: any): void {
        this.setControlValue('URLSelect', data);
    }

    public onWorkOrderTypeChange(data: any): void {
        this.setControlValue('WOTypeCodeSelect', data);
    }

    public onAssignToEmployeeTypeSelectChange(data: any): void {
        this.isVisibleOccupationDropdown = false;
        this.isVisibleSupervisorInput = false;
        this.setControlValue('AssignToEmployeeTypeSelect', data);
        this.onChangeAssignToEmployeeTypeSelect();
    }

    public onOptionChange(data: any): void {
        this.setControlValue('Option', data);
        this.optionChangeNavigation();
    }

    public cancelData(): void {
        if (this.mode === 'UPDATE')
            this.ContactTypeDetailChange();
        this.clearForm();
        this.mode = 'UPDATE';
        this.isVisibleAdd = true;
        this.isVisibleDelete = true;
        this.isVisibleAddInputs = false;
        this.dropdown.contactTypeDetailSearch.params.ContactTypeCode = this.getControlValue('ContactTypeCode');
        if (this.ddContactTypeDetailSearch && this.getControlValue('ContactTypeCode'))
            this.ddContactTypeDetailSearch.fetchData();
    }

    public onContactTypeDetailCodeDropdownDataReceived(data: any): void {
        if (data) {
            this.setControlValue('ContactTypeDetailCode', data['ContactTypeDetail.ContactTypeDetailCode']);
            this.setControlValue('ContactTypeDetailSystemDesc', data['ContactTypeDetail.ContactTypeDetailSystemDesc']);
            this.pageParams.ContactTypeDetailCode = this.getControlValue('ContactTypeDetailCode');
            this.pageParams.ContactTypeDetailSystemDesc = this.getControlValue('ContactTypeDetailSystemDesc');
            if (!this.getControlValue('ContactTypeCode')) {
                this.contactTypeDetailLookUp();
            }
            else {
                if (this.mode === 'UPDATE') {
                    this.ContactTypeDetailChange();
                }
            }
        }
    }
    public onFirstreceivedContactDetailType(data: any): void {
        if (data) {
            if (data.totalRecords === 0) {
                this.changeMode();
            } else {
                this.mode = 'UPDATE';
                this.isVisibleAddInputs = false;
                this.isVisibleDelete = true;
                this.isVisibleAdd = true;
                if (!this.isReturning()) {
                    this.setControlValue('ContactTypeDetailCode', data.firstRow['ContactTypeDetail.ContactTypeDetailCode']);
                    this.setControlValue('ContactTypeDetailSystemDesc', data.firstRow['ContactTypeDetail.ContactTypeDetailSystemDesc']);
                    this.ContactTypeDetailChange();
                }
                this.pageParams.ContactTypeDetailCode = this.getControlValue('ContactTypeDetailCode');
                this.pageParams.ContactTypeDetailSystemDesc = this.getControlValue('ContactTypeDetailSystemDesc');
            }
        }
    }


    private contactTypeDetailLookUp(): void {
        let lookupIP = [
            {
                'table': 'ContactTypeDetail',
                'query': { 'ContactTypeDetailCode': this.getControlValue('ContactTypeDetailCode') },
                'fields': ['ContactTypeCode']
            }

        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let contactTypeData = data[0][0];
            if (contactTypeData) {
                this.setControlValue('ContactTypeCode', contactTypeData['ContactTypeCode']);
                this.contactTypeDetailDescLookUp();
            }
        });
    }

    private contactTypeDetailDescLookUp(): void {
        let lookupIP = [
            {
                'table': 'ContactType',
                'query': { 'ContactTypeCode': this.getControlValue('ContactTypeCode') },
                'fields': ['ContactTypeSystemDesc']
            }

        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let contactTypeData = data[0][0];
            this.setControlValue('ContactTypeSystemDesc', contactTypeData['ContactTypeSystemDesc']);
            this.contactTypeDropDown.active = {
                id: this.getControlValue('ContactTypeCode'),
                text: this.getControlValue('ContactTypeCode') + ' - ' + contactTypeData['ContactTypeSystemDesc']
            };
            this.ContactTypeDetailChange();
            this.ddContactTypeDetailSearch.isFirstItemSelected = false;
            this.contactTypeDropDown.isFirstItemSelected = false;
            this.dropdown.contactTypeDetailSearch.params.ContactTypeCode = this.getControlValue('ContactTypeCode');
            this.pageParams.ContactTypeCode = this.getControlValue('ContactTypeCode');
            this.pageParams.ContactTypeSystemDesc = contactTypeData['ContactTypeSystemDesc'];
            if (this.ddContactTypeDetailSearch)
                this.ddContactTypeDetailSearch.fetchData();
        });
    }
}
