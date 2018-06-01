import { InternalGridSearchApplicationModuleRoutes, InternalGridSearchServiceModuleRoutes } from './../../../base/PageRoutes';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { BaseComponent } from '../../../base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { AppModuleRoutes, InternalGridSearchModuleRoutes } from '../../../base/PageRoutes';
import { RiExchange } from './../../../../shared/services/riExchange';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { SysCharConstants } from './../../../../shared/constants/syscharservice.constant';
import { MessageService } from './../../../../shared/services/message.service';
import { BranchSearchComponent } from './../../../internal/search/iCABSBBranchSearch';
import { EllipsisComponent } from '../../../../shared/components/ellipsis/ellipsis';
import { ClosedTemplateSearchComponent } from '../../../internal/search/iCABSBClosedTemplateSearch.component';
import { DropdownStaticComponent } from './../../../../shared/components/dropdown-static/dropdownstatic';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAClosedTemplateMaintenance.html'
})

export class ClosedTemplateMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('rollOverDropdown') rollOverDropdown: DropdownStaticComponent;
    @ViewChild('ClosedCalendarTemplateNumber') ClosedCalendarTemplateNumber: EllipsisComponent;
    @ViewChild('newBranchNumberSearch') newBranchNumberSearch: BranchSearchComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public pageId: string = '';
    @ViewChild('promptModalForSave') public promptModalForSave;
    public closeButtonSave: boolean = true;
    public showMessageHeaderSave: boolean = true;
    public showMessageHeader: boolean = true;
    public promptContentSave: string;
    public branchSearchDisabled: boolean = false;
    public showSaveDisable: boolean = false;
    public showDeleteDisable: boolean = false;
    public showCancelDisable: boolean = false;
    public tdRollOverType: boolean = true;
    public saveConfirm: boolean;
    public disableOptionMenu: boolean = true;
    public controls = [
        { name: 'ClosedCalendarTemplateNumber', disabled: false, type: MntConst.eTypeInteger },
        { name: 'TemplateName', disabled: false, required: true, type: MntConst.eTypeText },
        { name: 'OwnerBranchNumber', disabled: false },
        { name: 'PremiseSpecificInd', disabled: false, type: MntConst.eTypeCheckBox },
        { name: 'PremiseSpecificText', disabled: false, type: MntConst.eTypeText },
        { name: 'TemplateNotes', disabled: false, type: MntConst.eTypeText },
        { name: 'SelCalendarRolloverTypeCode', disabled: false },
        { name: 'ErrorMessageDesc', disabled: false, type: MntConst.eTypeText },
        { name: 'CalendarRolloverTypeCode', disabled: false, type: MntConst.eTypeInteger },
        { name: 'ClosedCalendarTemplateRowID' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACLOSEDTEMPLATEMAINTENANCE;
        this.pageTitle = this.browserTitle = 'Holiday/Closed Template Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.disableOptionMenu = false;
            this.lookupBranchName();
            this.setControlValue('ClosedCalendarTemplateNumber', this.pageParams.templatenumber);
            this.disableControl('ClosedCalendarTemplateNumber', true);
            if (this.pageParams.vbEnableCalendarRolloverType === true) {
                this.tdRollOverType = true;
            }
            else {
                this.tdRollOverType = false;
            }
            this.pageParams.modalAutoOpen = false;
            if (this.getControlValue('ClosedCalendarTemplateNumber') !== '') {
                this.templateNumberOnchange();
            }
        }
        else {
            this.getSysCharDtetails();
            this.pageParams.rollover = [];
            this.pageParams.modalAutoOpen = true;
        }
    }

    ngAfterViewInit(): void {
        if (this.pageParams.modalAutoOpen) {
            this.ellipsis.template.autoOpen = true;
            this.pageParams.IsDeleteEnable = false;
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public queryParams: any = {
        operation: 'Application/iCABSAClosedTemplateMaintenance',
        module: 'template',
        method: 'service-planning/maintenance'
    };

    public getSysCharDtetails(): any {
        let sysCharNumbers = [this.sysCharConstants.SystemCharEnableCalendarRolloverType];
        let sysCharIp = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharNumbers.toString()
        };
        this.speedScript.sysChar(sysCharIp).subscribe(
            (data) => {
                if (data.hasError) {
                    this.messageModal.show(data, true);
                }
                else {
                    if (data.records.length > 0) {
                        this.pageParams.lEnableCalendarRolloverType = data.records[0].Required;
                        this.pageParams.iDefaultRolloverType = data.records[0].Integer;
                        this.windowOnLoad();
                    }
                }
            },
            (error) => {
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public windowOnLoad(): void {
        this.disableControl('ClosedCalendarTemplateNumber', false);
        this.disableControl('TemplateName', true);
        this.branchSearchDisabled = true;
        this.disableControl('PremiseSpecificInd', true);
        this.disableControl('PremiseSpecificText', true);
        this.disableControl('TemplateNotes', true);
        this.disableControl('SelCalendarRolloverTypeCode', true);
        this.showSaveDisable = true;
        this.showCancelDisable = true;
        this.showDeleteDisable = true;
        this.pageParams.vbEnableCalendarRolloverType = this.pageParams.lEnableCalendarRolloverType;
        if (this.pageParams.vbEnableCalendarRolloverType === true) {
            this.tdRollOverType = true;
            this.rollOverDropdown.disabled = true;
            this.pageParams.vbDefaultRolloverType = this.pageParams.iDefaultRolloverType;
        }
        else {
            this.tdRollOverType = false;
            this.pageParams.vbDefaultRolloverType = 0;
        }
    }

    public templateNumberOnchange(): void {
        if (this.uiForm.controls['ClosedCalendarTemplateNumber'].valid) {
            this.setFormMode(this.c_s_MODE_UPDATE);
            if (this.pageParams.vbEnableCalendarRolloverType === true) {
                this.fetchRollOverValues();
            }
            this.fetchData();
            this.disableControl('ClosedCalendarTemplateNumber', true);
            this.disableControl('TemplateName', false);
            this.branchSearchDisabled = false;
            this.disableControl('PremiseSpecificInd', false);
            this.disableControl('PremiseSpecificText', false);
            this.disableControl('TemplateNotes', false);
            this.disableControl('SelCalendarRolloverTypeCode', false);
            this.pageParams.IsDeleteEnable = true;
            this.showSaveDisable = false;
            this.showCancelDisable = false;
            this.showDeleteDisable = false;
            if (this.tdRollOverType) {
                this.rollOverDropdown.disabled = false;
            }
        }
    }

    public ellipsis = {
        template: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Search',
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ClosedTemplateSearchComponent,
            showHeader: true
        }
    };

    public inputParamsBranch: any = {
        'Mode': 'LookUp-SeasonalTemplate',
        'negBranchNumberSelected': {
            id: '',
            text: ''
        }
    };
    public setClosedTemplateNumber(data: any): void {
        if (data.parentMode === 'SearchAdd') {
            this.disableOptionMenu = true;
            this.setFormMode(this.c_s_MODE_ADD);
            this.pageParams.IsDeleteEnable = false;
            this.uiForm.reset();
            this.inputParamsBranch.negBranchNumberSelected = {
                id: '',
                text: ''
            };
            this.setControlValue('OwnerBranchNumber', '');
            this.pageParams.addmodeflag = true;
            this.pageParams.updatemodeflag = false;
            if (this.pageParams.vbEnableCalendarRolloverType === true) {
                this.fetchRollOverValues();
                setTimeout(() => {
                    this.rollOverDropdown.selectedItem = this.pageParams.vbDefaultRolloverType.toString();
                }, 500);
            }
            this.disableControl('ClosedCalendarTemplateNumber', true);
            this.disableControl('TemplateName', false);
            this.branchSearchDisabled = false;
            this.disableControl('PremiseSpecificInd', false);
            this.disableControl('PremiseSpecificText', false);
            this.disableControl('TemplateNotes', false);
            this.disableControl('SelCalendarRolloverTypeCode', false);
            this.showSaveDisable = false;
            this.showCancelDisable = false;
            this.showDeleteDisable = false;
            if (this.tdRollOverType) {
                this.rollOverDropdown.disabled = false;
            }
        }
        else {
            this.setFormMode(this.c_s_MODE_UPDATE);
            this.formPristine();
            this.pageParams.updatemodeflag = true;
            this.pageParams.addmodeflag = false;
            this.pageParams.IsDeleteEnable = true;
            this.pageParams.ellipsisdata = data;
            this.pageParams.templatenumber = data.ClosedCalendarTemplateNumber;
            this.setControlValue('ClosedCalendarTemplateNumber', this.pageParams.templatenumber);
            this.pageParams.templatename = data.TemplateName;
            this.setControlValue('TemplateName', this.pageParams.templatename);
            this.disableControl('ClosedCalendarTemplateNumber', true);
            this.disableControl('TemplateName', false);
            this.branchSearchDisabled = false;
            this.disableControl('PremiseSpecificInd', false);
            this.disableControl('PremiseSpecificText', false);
            this.disableControl('TemplateNotes', false);
            this.disableControl('SelCalendarRolloverTypeCode', false);
            this.showSaveDisable = false;
            this.showCancelDisable = false;
            this.showDeleteDisable = false;
            if (this.pageParams.vbEnableCalendarRolloverType === true) {
                this.fetchRollOverValues();
            }
            if (this.tdRollOverType) {
                this.rollOverDropdown.disabled = false;
            }
            this.fetchData();
            this.fetchBranch();
        }
    }

    public fetchData(): void {
        let search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.businessCode());
        search.set(this.serviceConstants.CountryCode, this.countryCode());
        search.set('ClosedCalendarTemplateNumber', this.getControlValue('ClosedCalendarTemplateNumber'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (e) => {
                if (e.hasError) {
                    this.disableOptionMenu = true;
                    this.messageModal.show(e, true);
                    this.disableControl('ClosedCalendarTemplateNumber', false);
                    this.disableControl('TemplateName', true);
                    this.branchSearchDisabled = true;
                    this.disableControl('PremiseSpecificInd', true);
                    this.disableControl('PremiseSpecificText', true);
                    this.disableControl('TemplateNotes', true);
                    this.disableControl('SelCalendarRolloverTypeCode', true);
                    this.pageParams.IsDeleteEnable = false;
                    this.showSaveDisable = true;
                    this.showCancelDisable = true;
                    this.showDeleteDisable = true;
                    if (this.tdRollOverType) {
                        this.rollOverDropdown.disabled = true;
                    }
                }
                else {
                    this.disableOptionMenu = false;
                    this.pageParams.rowid = e.ttClosedCalendarTemplate;
                    this.setControlValue('TemplateName', e.TemplateName);
                    this.pageParams.branchNumber = e.OwnerBranchNumber;
                    this.lookupBranchName();
                    this.setControlValue('PremiseSpecificInd', e.PremiseSpecificInd);
                    this.setControlValue('PremiseSpecificText', e.PremiseSpecificText);
                    this.setControlValue('TemplateNotes', e.TemplateNotes);

                    if (this.pageParams.vbEnableCalendarRolloverType) {
                        this.rollOverDropdown.selectedItem = e.CalendarRolloverTypeCode;
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.disableOptionMenu = true;
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
        );
    }

    public fetchBranch(): void {
        let search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.businessCode());
        search.set(this.serviceConstants.CountryCode, this.countryCode());
        search.set('BranchNumber', this.utils.getBranchCode());
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (e) => {
                if (e.hasError) {
                    this.messageModal.show(e, true);
                }
                else {
                    this.setControlValue('OwnerBranchNumber', e.BranchNumber);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
        );
    }

    public onBranchDataReceived(obj: any): void {
        if (obj.BranchNumber === '') {
            this.setControlValue('OwnerBranchNumber', '');
            return;
        }
        this.pageParams.branchNumber = obj.BranchNumber;
        this.pageParams.BranchSearch = obj.BranchNumber + ' : ' + (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
        this.setControlValue('OwnerBranchNumber', this.pageParams.BranchSearch);
    }

    public lookupBranchName(): void {
        let lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.pageParams.branchNumber
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data.hasError) {
                this.messageModal.show(data, true);
            } else {
                let Branch = data[0][0];
                if (Branch) {
                    this.inputParamsBranch.negBranchNumberSelected = {
                        id: this.pageParams.branchNumber,
                        text: this.pageParams.branchNumber + ' - ' + Branch.BranchName
                    };
                    this.setControlValue('OwnerBranchNumber', this.pageParams.branchNumber);
                };
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            });
    }

    public fetchRollOverValues(): void {
        let formdata = [];
        if (this.pageParams.vbEnableCalendarRolloverType === true) {
            this.tdRollOverType = true;
            let search = this.getURLSearchParamObject();
            search.set(this.serviceConstants.Action, '6');
            search.set(this.serviceConstants.BusinessCode, this.businessCode());
            search.set(this.serviceConstants.CountryCode, this.countryCode());
            formdata['Function'] = 'GetCalendarRolloverValues';
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formdata).subscribe(
                (e) => {
                    if (e.hasError) {
                        this.messageModal.show(e, true);
                        this.setControlValue('CalendarRolloverTypeCode', this.pageParams.vbDefaultRolloverType);
                        this.disableControl('SelCalendarRolloverTypeCode', true);
                        this.pageParams.vbOriCalendarRolloverTypeCode = this.pageParams.vbDefaultRolloverType;
                    }
                    else {
                        this.pageParams.x = e.CalendarRolloverTypeDescList;
                        this.pageParams.y = e.CalendarRolloverTypeCodeList;
                        this.pageParams.rollovertype = this.pageParams.x.split('|');
                        this.pageParams.rollovertypecode = this.pageParams.y.split('|');
                        this.pageParams.rollover = [];
                        for (let i = 0; i < this.pageParams.rollovertype.length; i++) {
                            let obj = {
                                text: this.pageParams.rollovertype[i],
                                value: this.pageParams.rollovertypecode[i]
                            };
                            this.pageParams.rollover.push(obj);
                        }
                        this.setControlValue('SelCalendarRolloverTypeCode', this.pageParams.vbDefaultRolloverType);
                        this.disableControl('SelCalendarRolloverTypeCode', false);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.messageModal.show(error, true);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
        else {
            this.tdRollOverType = false;
        }
    }

    public beforeAdd(): void {
        this.disableControl('ClosedCalendarTemplateNumber', true);
        if (this.pageParams.vbEnableCalendarRolloverType) {
            this.setControlValue('SelCalendarRolloverTypeCode', this.pageParams.vbDefaultRolloverType);
            this.disableControl('SelCalendarRolloverTypeCode', false);
        }
        else {
            this.setControlValue('CalendarRolloverTypeCode', this.pageParams.vbDefaultRolloverType);
        }
    }

    public beforeUpdate(): void {
        if (this.pageParams.vbEnableCalendarRolloverType) {
            this.disableControl('SelCalendarRolloverTypeCode', false);
        }
    }

    public optionsChange(event: any): void {
        if ((this.getControlValue('ClosedCalendarTemplateNumber') !== '') && (this.getControlValue('TemplateName') !== '')) {
            switch (event) {
                case 'calendar':
                    this.navigate('CalendarTemplate', InternalGridSearchApplicationModuleRoutes.ICABSCLOSEDTEMPLATEDATEGRID);
                    break;
                case 'access':
                    this.navigate('CalendarTemplate', InternalGridSearchServiceModuleRoutes.ICABSACLOSEDTEMPLATEBRANCHACCESSGRID);
                    break;
                case 'templateuse':
                    this.navigate('CalendarTemplate', '/serviceplanning/Templates/HolidayClosedTemplateUse', {
                    });
                    break;
                case 'history':
                    this.messageModal.show({ msg: 'Page is not yet developed', title: '' }, false);
                    break;
                default:
                    break;
            }
        }
        else {
            this.messageModal.show({ msg: MessageConstant.Message.noRecordSelected, title: '' }, false);
        }
    }

    public isChecked(value: any): string {
        if (value) {
            return 'yes';
        } else {
            return 'no';
        }
    }

    public saveOnClick(): void {
        this.saveConfirm = true;
        if (this.riExchange.validateForm(this.uiForm) && (this.getControlValue('OwnerBranchNumber') !== '')) {
            this.promptContentSave = MessageConstant.Message.ConfirmRecord;
            this.promptModalForSave.show();
        }
        else {
            if (this.getControlValue('OwnerBranchNumber') === '') {
                this.newBranchNumberSearch.branchsearchDropDown.isError = true;
            }
        }
    }

    public cancelOnClick(): void {
        if (this.pageParams.addmodeflag === true) {
            this.uiForm.reset();
            this.pageParams.rollover = [];
            this.newBranchNumberSearch.branchsearchDropDown.isError = false;
            this.pageParams.modalAutoOpen = true;
            this.ClosedCalendarTemplateNumber.openModal();
            this.setFormMode(this.c_s_MODE_SELECT);
        }
        else if ((this.pageParams.updatemodeflag === true) && (this.getControlValue('ClosedCalendarTemplateNumber') !== '')) {
            this.setClosedTemplateNumber(this.pageParams.ellipsisdata);
            this.setFormMode(this.c_s_MODE_UPDATE);
        }
    }

    public deleteOnClick(): void {
        if (this.getControlValue('ClosedCalendarTemplateNumber') !== '') {
            this.promptContentSave = MessageConstant.Message.DeleteRecord;
            this.promptModalForSave.show();
        }
        else {
            this.messageModal.show({ msg: MessageConstant.Message.noRecordSelected, title: '' }, false);
        }
    }

    public promptConfirm(): void {
        if (this.saveConfirm === true) {
            let search = this.getURLSearchParamObject();
            let formdata = [];
            let makeRequest: boolean = false;
            if (this.pageParams.addmodeflag === true) {
                search.set(this.serviceConstants.Action, '1');
                search.set(this.serviceConstants.BusinessCode, this.businessCode());
                search.set(this.serviceConstants.CountryCode, this.countryCode());
                formdata['ClosedCalendarTemplateNumber'] = '';
                formdata['TemplateName'] = this.getControlValue('TemplateName');
                formdata['OwnerBranchNumber'] = this.pageParams.branchNumber;
                formdata['PremiseSpecificInd'] = this.isChecked(this.getControlValue('PremiseSpecificInd'));
                formdata['PremiseSpecificText'] = this.getControlValue('PremiseSpecificText');
                formdata['TemplateNotes'] = this.getControlValue('TemplateNotes');
                if (this.pageParams.vbEnableCalendarRolloverType === true) {
                    formdata['CalendarRolloverTypeCode'] = this.rollOverDropdown.selectedItem;
                }
                makeRequest = true;
            }
            else {
                search.set(this.serviceConstants.Action, '2');
                search.set(this.serviceConstants.BusinessCode, this.businessCode());
                search.set(this.serviceConstants.CountryCode, this.countryCode());
                formdata['ClosedCalendarTemplateROWID'] = this.pageParams.rowid;
                formdata['ClosedCalendarTemplateNumber'] = this.getControlValue('ClosedCalendarTemplateNumber');
                formdata['TemplateName'] = this.getControlValue('TemplateName');
                formdata['OwnerBranchNumber'] = this.pageParams.branchNumber;
                formdata['PremiseSpecificInd'] = this.isChecked(this.getControlValue('PremiseSpecificInd'));
                formdata['PremiseSpecificText'] = this.getControlValue('PremiseSpecificText');
                formdata['TemplateNotes'] = this.getControlValue('TemplateNotes');
                if (this.pageParams.vbEnableCalendarRolloverType === true) {
                    formdata['CalendarRolloverTypeCode'] = this.rollOverDropdown.selectedItem;
                }
                makeRequest = true;
            }

            if (makeRequest) {
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formdata).subscribe(
                    (e) => {
                        if (e.hasError) {
                            this.messageModal.show(e, true);
                        }
                        else {
                            if (this.pageParams.vbEnableCalendarRolloverType) {
                                this.disableControl('SelCalendarRolloverTypeCode', true);
                            }
                            this.pageParams.templatenumber = (this.getControlValue('ClosedCalendarTemplateNumber') !== '') ? this.getControlValue('ClosedCalendarTemplateNumber') : e.ClosedCalendarTemplateNumber;
                            this.pageParams.templatename = this.getControlValue('TemplateName');
                            this.navigate('CalendarTemplate', InternalGridSearchApplicationModuleRoutes.ICABSCLOSEDTEMPLATEDATEGRID, {
                                ClosedCalendarTemplate: e.ClosedCalendarTemplate,
                                ClosedCalendarTemplateNumber: e.ClosedCalendarTemplateNumber
                            });
                            this.formPristine();
                            this.pageParams.vbOriCalendarRolloverTypeCode = this.getControlValue('CalendarRolloverTypeCode');
                        }
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    },
                    (error) => {
                        this.messageModal.show(error, true);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                );
            }
        }
        else {
            let search = this.getURLSearchParamObject();
            let formdata: Object = {};
            search.set(this.serviceConstants.Action, '3');
            search.set(this.serviceConstants.BusinessCode, this.businessCode());
            search.set(this.serviceConstants.CountryCode, this.countryCode());
            formdata['ClosedCalendarTemplateROWID'] = this.pageParams.rowid;
            formdata['ClosedCalendarTemplateNumber'] = this.getControlValue('ClosedCalendarTemplateNumber');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formdata).subscribe(
                (e) => {
                    if (e.hasError) {
                        this.messageModal.show(e, true);
                    }
                    else {
                        this.uiForm.reset();
                        if (this.pageParams.vbEnableCalendarRolloverType) {
                            this.rollOverDropdown.selectedItem = '0';
                        }
                        this.inputParamsBranch.negBranchNumberSelected = {
                            id: '',
                            text: ''
                        };
                        this.messageModal.show({ msg: MessageConstant.Message.RecordDeletedSuccessfully, title: MessageConstant.Message.MessageTitle }, false); // change
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.messageModal.show(error, true);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
            );
        }
    }
}
