import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSSContactTypeDetailPropertiesMaint.html'
})
export class ContactTypeDetailPropertiesMaintComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    private xhrParams: any = {
        module: 'tickets',
        method: 'ccm/maintenance',
        operation: 'System/iCABSSContactTypeDetailPropertiesMaint'
    };
    private cacheData: any = {};
    public isRequesting: boolean = true;
    public pageId: string = '';
    public promptContentSave: string = MessageConstant.Message.ConfirmRecord;
    public promptContentDelete: string = MessageConstant.Message.DeleteRecord;
    public menuTeam: any = [];
    public menuTemp: any = [];
    public menuGroup: any = [];
    public keyTypeCodeLabel: string = 'Branch/Group Account';
    public controls: Array<any> = [
        { name: 'KeyTypeCode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false },
        { name: 'ContactTypeCode', readonly: false, disabled: true, type: MntConst.eTypeCode, required: true },
        { name: 'ContactTypeSystemDesc', readonly: false, disabled: true, type: MntConst.eTypeTextFree, required: false },
        { name: 'ContactTypeDetailCode', readonly: false, disabled: true, type: MntConst.eTypeCode, required: true },
        { name: 'ContactTypeDetailSystemDesc', readonly: false, disabled: true, type: MntConst.eTypeTextFree, required: false },
        { name: 'PropertiesCode', readonly: false, disabled: true, type: MntConst.eTypeCode, required: true },
        { name: 'PropertyDesc', readonly: false, disabled: true, type: MntConst.eTypeTextFree, required: false },
        { name: 'TeamID', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'TeamIDCreatorInd', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'CloseExtEmailNotifyTemplateCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'CreateExtSMSNotifyTemplateCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'CloseExtSMSNotifyTemplateCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'CreateIntEmailNotifyTemplateCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'CreateIntSMSNotifyTemplateCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'CreateIntNotifyGroupCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'UpdateIntEmailNotifyTemplateCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'UpdateIntSMSNotifyTemplateCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'UpdateIntNotifyGroupCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'CloseIntEmailNotifyTemplateCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'CloseIntSMSNotifyTemplateCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'CloseIntNotifyGroupCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'PassedIntEmailNotifyTemplateCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'PassedIntSMSNotifyTemplateCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'PassedIntNotifyGroupCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'CreateExtEmailNotifyTemplateCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false },
        { name: 'RowID', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSCONTACTTYPEDETAILPROPERTIESMAINT;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Contact Type Detail Properties Maintenance';
        this.onLoad();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public onLoad(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.utils.setTitle(this.pageTitle);

        this.setControlValue('ContactTypeCode', this.riExchange.getParentHTMLValue('ContactTypeCode'));
        this.setControlValue('ContactTypeSystemDesc', this.riExchange.getParentHTMLValue('ContactTypeSystemDesc'));
        this.setControlValue('ContactTypeDetailCode', this.riExchange.getParentHTMLValue('ContactTypeDetailCode'));
        this.setControlValue('ContactTypeDetailSystemDesc', this.riExchange.getParentHTMLValue('ContactTypeDetailSystemDesc'));
        this.setControlValue('PropertyDesc', this.riExchange.getParentHTMLValue('PropertyDesc'));
        this.setControlValue('RowID', this.riExchange.getParentHTMLValue('RowID'));

        this.getInitialSettings().then((data) => {
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '0');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            search.set('RowID', this.getControlValue('RowID'));
            this.httpService.xhrGet(
                this.xhrParams.method,
                this.xhrParams.module,
                this.xhrParams.operation,
                search
            ).then((data: any): void => {
                if (data) {
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    }
                    this.cacheData = data;
                    this.afterFetch(data);
                }
            });
        });
    }

    public afterFetch(data: any): void {
        let flds2Upper: Array<string> = 'TeamID,CreateExtEmailNotifyTemplateCode,CreateExtSMSNotifyTemplateCode,CloseExtEmailNotifyTemplateCode,CloseExtSMSNotifyTemplateCode,CreateIntEmailNotifyTemplateCode,CreateIntSMSNotifyTemplateCodeCreateIntNotifyGroupCode,UpdateIntEmailNotifyTemplateCode,UpdateIntSMSNotifyTemplateCode,UpdateIntNotifyGroupCode,CloseIntEmailNotifyTemplateCode,CloseIntSMSNotifyTemplateCode,CloseIntNotifyGroupCode,PassedIntEmailNotifyTemplateCode,PassedIntSMSNotifyTemplateCode,PassedIntNotifyGroupCode'.split(',');
        for (let i in data) {
            if (i) {
                let val = (data[i] === '') ? ' ' : data[i];
                val = (flds2Upper.indexOf(i) > -1) ? this.UCase(val) : val;
                this.setControlValue(i, val);
            }
        }

        switch (data.KeyTypeCode) {
            case 'A':
                this.keyTypeCodeLabel = 'Account Number';
                break;
            case 'B':
                this.keyTypeCodeLabel = 'Branch Number';
                break;
            case 'G':
                this.keyTypeCodeLabel = 'Group Account';
                break;
            case 'X':
                this.keyTypeCodeLabel = 'Business';
                break;
            case 'T':
                this.keyTypeCodeLabel = 'Tier';
                break;
        }

        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
    }

    public getInitialSettings(): Promise<any> {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '6');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('LanguageCode', this.riExchange.LanguageCode());

        let formData: any = { 'Fn': 'GetTeamTemplateGroupList' };
        return this.httpService.xhrPost(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search,
            formData
        ).then((data) => {
            let listGroupCode = { code: [], desc: [] };
            if (data && data.GroupCodeList) { listGroupCode.code = data.GroupCodeList.split('^'); }
            if (data && data.GroupDescList) { listGroupCode.desc = data.GroupDescList.split('^'); }
            let listTeamCode = { code: [], desc: [] };
            if (data && data.TeamCodeList) { listTeamCode.code = data.TeamCodeList.split('^'); }
            if (data && data.TeamDescList) { listTeamCode.desc = data.TeamDescList.split('^'); }
            let listTempCode = { code: [], desc: [] };
            if (data && data.TempCodeList) { listTempCode.code = data.TempCodeList.split('^'); }
            if (data && data.TempDescList) { listTempCode.desc = data.TempDescList.split('^'); }

            let retObj: any = {
                menuTeam: [],
                menuTemp: [],
                menuGroup: []
            };

            listGroupCode.code.forEach((val, index) => {
                retObj.menuGroup.push({ code: listGroupCode.code[index], desc: listGroupCode.desc[index] });
            });
            this.menuGroup = retObj.menuGroup;

            listTeamCode.code.forEach((val, index) => {
                retObj.menuTeam.push({ code: listTeamCode.code[index], desc: listTeamCode.desc[index] });
            });
            this.menuTeam = retObj.menuTeam;

            listTempCode.code.forEach((val, index) => {
                retObj.menuTemp.push({ code: listTempCode.code[index], desc: listTempCode.desc[index] });
            });
            this.menuTemp = retObj.menuTemp;

            return retObj;
        });
    }

    public save(mode?: any): void {
        let isStatus: boolean = true;
        isStatus = this.riExchange.validateForm(this.uiForm);
        if (this.uiForm.status === 'VALID') {
            isStatus = true;
        } else {
            if (!isStatus) {
                for (let control in this.uiForm.controls) {
                    if (this.uiForm.controls[control].invalid) {
                        this.logger.log('DEBUG validateForm -- INVALID formControl:', control);
                    }
                }
            }
        }

        if (isStatus) {
            this.modalAdvService.emitPrompt(new ICabsModalVO(this.promptContentSave, null, this.saveExecute.bind(this), this.cancelExecute.bind(this)));
        }
    }

    private saveExecute(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        let formData: any = {};
        for (let i = 0; i < this.controls.length; i++) {
            formData[this.controls[i].name] = this.getControlValue(this.controls[i].name);
        }
        this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
            this.logger.log('SAVED', data);
            this.routeAwayGlobals.setSaveEnabledFlag(false);
            this.markAsPristine();
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                //SAVED - navigate to prev page
                this.location.back();
            }
        });
    }
    private cancelExecute(): void {
        this.logger.log('CANCEL Clicked');
    }

    public cancel(): void {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.markAsPristine();
        this.afterFetch(this.cacheData);
    }

    public delete(): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(this.promptContentDelete, null, this.deleteExecute.bind(this), this.cancelExecute.bind(this)));
    }

    private deleteExecute(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '3');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        let formData = { 'RowID': this.getControlValue('RowID') };

        this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
            this.logger.log('DELETED', data);
            this.routeAwayGlobals.setSaveEnabledFlag(false);
            this.markAsPristine();
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                //DELETED - navigate to prev page
                this.location.back();
            }
        });
    }

    public markAsPristine(): void {
        for (let i = 0; i < this.controls.length; i++) {
            this.uiForm.controls[this.controls[i].name].markAsPristine();
        }
    }
}
