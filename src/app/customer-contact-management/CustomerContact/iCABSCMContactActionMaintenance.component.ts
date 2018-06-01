import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Router, Data } from '@angular/router';
import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSCMContactActionMaintenance.html'
})
export class ContactActionMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('messageModal') public messageModal;
    public showMessageHeader: boolean = true;
    public pageId: string = '';
    public pageTitle: string = '';
    public xhr: any;
    public xhrParams: any = {
        operation: 'ContactManagement/iCABSCMContactActionMaintenance',
        module: 'tickets',
        method: 'ccm/maintenance'
    };
    public search = this.getURLSearchParamObject();
    public controls = [
        { name: 'CustomerContactNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeCodeNumeric },
        { name: 'ContactActionNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'ContactName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ContactPosition', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ContactTelephone', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ContactMediumCode', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'ContactMediumDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ContactFax', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ActionDate', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate },
        { name: 'ActionTime', readonly: true, disabled: true, required: false, type: MntConst.eTypeTime },
        { name: 'ActionEmployeeCode', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'ActionEmployeeName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ShortDescription', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'Comments', readonly: true, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'NextActionByDate', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate },
        { name: 'NextActionByTime', readonly: true, disabled: true, required: false, type: MntConst.eTypeTime },
        { name: 'NextActionEmployeeCode', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'NextActionEmployeeName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'chkKeepOwnership', readonly: true, disabled: true, required: false, type: MntConst.eTypeCheckBox },
        { name: 'ContactPassedToActioner', readonly: true, disabled: true, required: false, type: MntConst.eTypeCheckBox },
        { name: 'ROWID', readonly: true, disabled: true, required: false,type: MntConst.eTypeCode }

    ];
    constructor(injector: Injector, public router: Router) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCONTACTACTIONMAINTENANCE;
        this.riMaintenance = new RiMaintenance(this.logger, this.xhr, this.LookUp, this.utils, this.serviceConstants, this.globalize);
        this.xhr = this.httpService;
        this.browserTitle = 'Ticket History Detail';
    }
    public ellipsis: any;
    public showCloseButton: boolean = true;
    public ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Ticket History Detail';
        this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
        this.windowOnload();
    }
    public getTableCallbackData(data: any): void {
        if (!data['errorMessage']) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ShortDescription', data.ShortDescription);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactPosition', data.ContactPosition);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTelephone', this.utils.removeWhiteSpace(data.ContactTelephone));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactFax', data.ContactFax);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactName', data.ContactName);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ActionDate', this.utils.formatDate(data.ActionDate));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ActionTime', this.utils.secondsToHms((data.ActionTime)));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Comments', data.Comments);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'NextActionEmployeeCode', data.NextActionEmployeeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'NextActionByDate', this.utils.formatDate(data.NextActionByDate));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'NextActionByTime', this.utils.secondsToHms((data.NextActionByTime)));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ActionEmployeeCode', data.ActionEmployeeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'NextOwnerEmployeeCode', data.NextOwnerEmployeeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactMediumCode', data.ContactMediumCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactPassedToActioner', data.ContactPassedToActioner);
            if (data.NextOwnerEmployeeCode === data.ActionEmployeeCode) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'chkKeepOwnership', this.utils.convertResponseValueToCheckboxInput('Yes'));
            }
            else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'chkKeepOwnership', this.utils.convertResponseValueToCheckboxInput('No'));
            }
        }
        else {
            this.messageModal.show({ msg: data['errorMessage'], title: this.pageTitle }, false);
        }
    }

    public getEmployeeVirtualTableCallbackData(data: any): void {
        if (!data['errorMessage']) {
            //todo
        }
        else {
            this.messageModal.show({ msg: data['errorMessage'], title: this.pageTitle }, false);
        }
    }
    public getEmployee2VirtualTableCallbackData(data: any): void {
        if (!data['errorMessage']) {
            //todo
        }
        else {
            this.messageModal.show({ msg: data['errorMessage'], title: this.pageTitle }, false);
        }
    }
    public getContactMediumLangVirtualTableCallbackData(data: any): void {
        if (!data['errorMessage']) {
            //todo
        }
        else {
            this.messageModal.show({ msg: data['errorMessage'], title: this.pageTitle }, false);
        }
    }
    public windowOnload(): void {
        this.riMaintenance.AddTable('ContactAction');
        this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
        if (this.riExchange.getParentHTMLValue('CustomerContactNumber')) {
            this.riMaintenance.AddTableKey('CustomerContactNumber', MntConst.eTypeCodeNumeric, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        }
        if (this.riExchange.getParentHTMLValue('ContactActionNumber')) {
            this.riMaintenance.AddTableKey('ContactActionNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        }
        if (this.riExchange.getParentHTMLValue('ROWID')) {
            this.riMaintenance.AddTableKey('ROWID', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        }
        this.riMaintenance.AddTableField('ShortDescription', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ContactPosition', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ContactTelephone', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'ReadOnly');
        this.riMaintenance.AddTableField('ContactFax', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'ReadOnly');
        this.riMaintenance.AddTableField('ContactName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ActionDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ActionTime', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('Comments', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('NextActionEmployeeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('NextActionByDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('NextActionByTime', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ActionEmployeeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('NextOwnerEmployeeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ContactMediumCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ContactPassedToActioner', MntConst.eTypeCheckBox, MntConst.eFieldOptionRequried, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableCommit(this, this.getTableCallbackData);

        this.riMaintenance.AddTable('*');
        this.riMaintenance.AddTableField('chkKeepOwnership', MntConst.eTypeCheckBox, MntConst.eFieldOptionRequried, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableCommit(this);

        this.riMaintenance.AddVirtualTable('Employee');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'ActionEmployeeCode', 'Virtual');
        this.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual', 'ActionEmployeeName');
        this.riMaintenance.AddVirtualTableCommit(this, this.getEmployeeVirtualTableCallbackData);

        this.riMaintenance.AddVirtualTable('Employee', 'Employee2');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'NextActionEmployeeCode', 'Virtual');
        this.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual', 'NextActionEmployeeName');
        this.riMaintenance.AddVirtualTableCommit(this, this.getEmployee2VirtualTableCallbackData);

        this.riMaintenance.AddVirtualTable('ContactMediumLang');
        this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateReadOnly, '=', this.riExchange.LanguageCode(), '', '');
        this.riMaintenance.AddVirtualTableKey('ContactMediumCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateReadOnly, '', '', '', '');
        this.riMaintenance.AddVirtualTableField('ContactMediumDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateReadOnly, '');
        this.riMaintenance.AddVirtualTableCommit(this, this.getContactMediumLangVirtualTableCallbackData);
        this.riMaintenance.AddTableCommit(this);

        if ((this.riExchange.getParentHTMLValue('parentMode')) === 'ContactHistory') {
            if (!(this.riExchange.getParentHTMLValue('ROWID'))) {
                this.riMaintenance.RowID(this, 'ROWID', this.riExchange.getParentAttributeValue('ROWID'));
            }
            else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ROWID', this.riExchange.getParentHTMLValue('ROWID'));
            }
            this.riMaintenance.FetchRecord();
        }
        else {
            if (!(this.riExchange.getParentHTMLValue('ROWID'))) {
                this.riMaintenance.RowID(this, 'ROWID', this.riExchange.getParentAttributeValue('ROWID'));
                this.riMaintenance.RowID(this, 'CustomerContactNumber', this.riExchange.getParentAttributeValue('CustomerContactNumber'));
            }
            else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ROWID', this.riExchange.getParentHTMLValue('ROWID'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerContactNumber', this.riExchange.getParentHTMLValue('CustomerContactNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactActionNumber', this.riExchange.getParentHTMLValue('ContactActionNumber'));
            }
            this.riMaintenance.FetchRecord();
        }
    }
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
