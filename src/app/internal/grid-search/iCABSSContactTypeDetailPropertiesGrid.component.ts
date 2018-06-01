import { Component, OnInit, ElementRef, Injector, ViewChild, OnDestroy, AfterViewInit, EventEmitter } from '@angular/core';

import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';

import { AccountSearchComponent } from './../search/iCABSASAccountSearch';
import { GroupAccountNumberComponent } from './../search/iCABSSGroupAccountNumberSearch';

@Component({
    templateUrl: 'iCABSSContactTypeDetailPropertiesGrid.html'
})

export class SContactTypeDetailPropertiesGridComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    private modalVO: ICabsModalVO;

    /* ========== Set Focus On =============== */
    public isFormControlAccountNumber = new EventEmitter<boolean>();
    public isformControlTierCode = new EventEmitter<boolean>();
    public isformControlBranchNumber = new EventEmitter<boolean>();
    public isformControlGroupAccountNumber = new EventEmitter<boolean>();

    public pageId: string = '';
    public controls: Array<any> = [
        { name: 'ContactTypeCode', readonly: false, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'ContactTypeSystemDesc', readonly: false, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'ContactTypeDetailCode', readonly: false, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'ContactTypeDetailSystemDesc', readonly: false, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'BranchGroupSelect', type: MntConst.eTypeTextFree },
        { name: 'TeamID', type: MntConst.eTypeTextFree },
        { name: 'EmailTemplateCode', type: MntConst.eTypeTextFree },
        { name: 'SMSTemplateCode' },
        { name: 'NotifyGroupCode' },
        { name: 'TierCode', type: MntConst.eTypeCode },
        { name: 'BranchNumber', type: MntConst.eTypeInteger },
        { name: 'AccountNumber', type: MntConst.eTypeCodeNumericAutoNumber },
        { name: 'GroupAccountNumber', type: MntConst.eTypeInteger }
    ];

    public xhrParams: any = {
        method: 'ccm/maintenance',
        module: 'tickets',
        operation: 'System/iCABSSContactTypeDetailPropertiesGrid'
    };

    public dropdown: any = {
        tierCode: {
            isRequired: false,
            disabled: false,
            inputParams: {
                'parentMode': 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        },
        emailTemplateCode: {
            isRequired: false,
            disabled: false,
            inputParams: {
                'parentMode': 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        },
        smsTemplateCode: {
            isRequired: false,
            disabled: false,
            inputParams: {
                'parentMode': 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        },
        notifyGroupCode: {
            isRequired: false,
            disabled: false,
            inputParams: {
                'parentMode': 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        },
        branchNumber: {
            isRequired: false,
            disabled: false,
            inputParams: {
                'parentMode': 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        }
    };

    public ellipsis: any = {
        accountNumber: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'showAddNewDisplay': false
            },
            contentComponent: AccountSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        groupAccountNumber: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'showAddNew': false
            },
            contentComponent: GroupAccountNumberComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSCONTACTTYPEDETAILPROPERTIESGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Contact Type Detail - Teams/Notifications Grid';
        this.utils.setTitle(this.pageTitle);
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.BuildGrid();
        } else {
            this.windowOnload();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public windowOnload(): void {
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContactTypeCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContactTypeSystemDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContactTypeDetailCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContactTypeDetailSystemDesc');

        this.setControlValue('ContactTypeCode', this.riExchange.getParentHTMLValue('ContactTypeCode'));
        this.setControlValue('ContactTypeSystemDesc', this.riExchange.getParentHTMLValue('ContactTypeSystemDesc'));
        this.setControlValue('ContactTypeDetailCode', this.riExchange.getParentHTMLValue('ContactTypeDetailCode'));
        this.setControlValue('ContactTypeDetailSystemDesc', this.riExchange.getParentHTMLValue('ContactTypeDetailSystemDesc'));
        this.setControlValue('BranchGroupSelect', 'All'); // Default selected as Angular 2 does not support 'selected' HTML feature

        this.pageParams.isGroupAccountNumberisDisplay = false;
        this.pageParams.isAccountNumberisDisplay = false;
        this.pageParams.isBranchNumberisDisplay = false;
        this.pageParams.isTierCodeisDisplay = false;

        /* ========= Initialize Grid properties ===== */
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.pageParams.pageSize = 10;
        this.pageParams.curPage = 1;
        this.pageParams.totalRecords = 0;
        this.pageParams.selectedRow = -1;

        this.BuildGrid();
    }

    public BuildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('KeyTypeCode', 'KeyTypeCode', 'KeyTypeCode', MntConst.eTypeTextFree, 16, false, '');
        this.riGrid.AddColumn('PropertiesCode', 'PropertiesCode', 'PropertiesCode', MntConst.eTypeCode, 10, false, '');
        this.riGrid.AddColumn('PropertyDesc', 'PropertyDesc', 'PropertyDesc', MntConst.eTypeTextFree, 20, false, '');
        this.riGrid.AddColumn('GridTeamID', 'GridTeamID', 'GridTeamID', MntConst.eTypeTextFree, 12, false, '');
        this.riGrid.AddColumn('SetTeam', 'SetTeam', 'SetTeam', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('CreateExtEmailNotifyTemplateInd', 'CreateExtEmailNotifyTemplateInd', 'CreateExtEmailNotifyTemplateInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('CreateExtSMSNotifyTemplateInd', 'CreateExtSMSNotifyTemplateInd', 'CreateExtSMSNotifyTemplateInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('CloseExtEmailNotifyTemplateInd', 'CloseExtEmailNotifyTemplateInd', 'CloseExtEmailNotifyTemplateInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('CloseExtSMSNotifyTemplateInd', 'CloseExtSMSNotifyTemplateInd', 'CloseExtSMSNotifyTemplateInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('CreateIntEmailNotifyTemplateInd', 'CreateIntEmailNotifyTemplateInd', 'CreateIntEmailNotifyTemplateInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('CreateIntSMSNotifyTemplateInd', 'CreateIntSMSNotifyTemplateInd', 'CreateIntSMSNotifyTemplateInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('CreateIntNotifyGroupInd', 'CreateIntNotifyGroupInd', 'CreateIntNotifyGroupInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('UpdateIntEmailNotifyTemplateInd', 'UpdateIntEmailNotifyTemplateInd', 'UpdateIntEmailNotifyTemplateInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('UpdateIntSMSNotifyTemplateInd', 'UpdateIntSMSNotifyTemplateInd', 'UpdateIntSMSNotifyTemplateInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('UpdateIntNotifyGroupInd', 'UpdateIntNotifyGroupInd', 'UpdateIntNotifyGroupInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('CloseIntEmailNotifyTemplateInd', 'CloseIntEmailNotifyTemplateInd', 'CloseIntEmailNotifyTemplateInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('CloseIntSMSNotifyTemplateInd', 'CloseIntSMSNotifyTemplateInd', 'CloseIntSMSNotifyTemplateInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('CloseIntNotifyGroupInd', 'CloseIntNotifyGroupInd', 'CloseIntNotifyGroupInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('PassedIntEmailNotifyTemplateInd', 'PassedIntEmailNotifyTemplateInd', 'PassedIntEmailNotifyTemplateInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('PassedIntSMSNotifyTemplateInd', 'PassedIntSMSNotifyTemplateInd', 'PassedIntSMSNotifyTemplateInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('PassedIntNotifyGroupInd', 'PassedIntNotifyGroupInd', 'PassedIntNotifyGroupInd', MntConst.eTypeImage, 1, false, '');

        this.riGrid.AddColumnAlign('PropertiesCode', MntConst.eAlignmentCenter);

        this.riGrid.Complete();
        this.riGridBeforeExecute();
    }

    public riGridBeforeExecute(): void {
        let gridQueryParams = this.getURLSearchParamObject();
        gridQueryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridQueryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        gridQueryParams.set(this.serviceConstants.Action, '2');
        gridQueryParams.set(this.serviceConstants.GridHandle, this.utils.gridHandle);
        gridQueryParams.set(this.serviceConstants.GridMode, '0');
        gridQueryParams.set(this.serviceConstants.GridCacheRefresh, 'True');
        gridQueryParams.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        gridQueryParams.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        gridQueryParams.set(this.serviceConstants.GridPageSize, this.pageParams.pageSize.toString());
        gridQueryParams.set(this.serviceConstants.GridPageCurrent, this.pageParams.curPage.toString());
        gridQueryParams.set('ContactTypeCode', this.getControlValue('ContactTypeCode'));
        gridQueryParams.set('ContactTypeDetailCode', this.getControlValue('ContactTypeDetailCode'));
        gridQueryParams.set('EmailTemplateCode', this.getControlValue('EmailTemplateCode'));
        gridQueryParams.set('SMSTemplateCode', this.getControlValue('SMSTemplateCode'));
        gridQueryParams.set('NotifyGroupCode', this.getControlValue('NotifyGroupCode'));
        gridQueryParams.set('BranchGroupSelect', this.getControlValue('BranchGroupSelect'));
        gridQueryParams.set('BranchNumber', this.getControlValue('BranchNumber'));
        gridQueryParams.set('AccountNumber', this.getControlValue('AccountNumber'));
        gridQueryParams.set('GroupAccountNumber', this.getControlValue('GroupAccountNumber'));
        gridQueryParams.set('TierCode', this.getControlValue('TierCode'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, gridQueryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.pageParams.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageParams.pageSize : 1;
                    this.riGrid.RefreshRequired();
                    if (this.riGrid.Update) {
                        this.riGrid.StartRow = this.riGrid.CurrentRow;
                        this.riGrid.StartColumn = 0;
                        this.riGrid.RowID = this.riGrid.Details.GetAttribute('SetTeam', 'RowID');
                        this.riGrid.UpdateHeader = false;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = false;
                    }
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riGridAfterExecute(): void {
        if (this.riGrid.Update) {
            this.riGrid.StartRow = this.riGrid.CurrentRow;
            this.riGrid.StartColumn = 0;
            this.riGrid.RowID = this.riGrid.Details.GetAttribute('SetTeam', 'RowID');
            this.riGrid.UpdateHeader = false;
            this.riGrid.UpdateBody = true;
            this.riGrid.UpdateFooter = false;
        }
    }

    public riGridBodyOnDblClick(event: any): void {
        let ResponseOK, vsrcElementName;
        let gridQueryParams = this.getURLSearchParamObject();
        ResponseOK = true;
        vsrcElementName = event.srcElement.name;
        if (this.utils.hasClass(event.srcElement, 'pointer')) {
            switch (this.riGrid.CurrentColumnName) {
                case 'KeyTypeCode':
                    this.riExchange.Mode = 'Display';
                    this.navigate('Display', 'sales/maintenance/contacttypedetailpropertiesmaintenance', {
                        RowID: this.riGrid.Details.GetAttribute('KeyTypeCode', 'RowID'),
                        ContactTypeCode: this.getControlValue('ContactTypeCode'),
                        ContactTypeSystemDesc: this.getControlValue('ContactTypeSystemDesc'),
                        ContactTypeDetailCode: this.getControlValue('ContactTypeDetailCode'),
                        ContactTypeDetailSystemDesc: this.getControlValue('ContactTypeDetailSystemDesc'),
                        PropertiesCode: this.riGrid.Details.GetValue('PropertiesCode'),
                        PropertyDesc: this.riGrid.Details.GetValue('PropertyDesc')
                    });
                    break;
                case 'SetTeam':
                    this.modalVO = new ICabsModalVO(MessageConstant.PageSpecificMessage.blankOutTeam, null, this.promptConfirm.bind(this));
                    if (!this.getControlValue('TeamID')) {
                        this.modalVO.data = 'TeamID';
                        this.modalAdvService.emitPrompt(this.modalVO);
                    } else {
                        this.modalVO.data = 'TeamID';
                        this.promptConfirm(this.modalVO);
                    }
                    break;
                case 'CreateExtEmailNotifyTemplateInd':
                case 'CloseExtEmailNotifyTemplateInd':
                case 'CreateIntEmailNotifyTemplateInd':
                case 'UpdateIntEmailNotifyTemplateInd':
                case 'CloseIntEmailNotifyTemplateInd':
                case 'PassedIntEmailNotifyTemplateInd':
                    this.modalVO = new ICabsModalVO(MessageConstant.PageSpecificMessage.blankOutEmail, null, this.promptConfirm.bind(this));
                    if (!this.getControlValue('EmailTemplateCode')) {
                        this.modalVO.data = 'EmailTemplateCode';
                        this.modalAdvService.emitPrompt(this.modalVO);
                    } else {
                        this.modalVO.data = 'EmailTemplateCode';
                        this.promptConfirm(this.modalVO);
                    }
                    break;
                case 'CreateExtSMSNotifyTemplateInd':
                case 'CloseExtSMSNotifyTemplateInd':
                case 'CreateIntSMSNotifyTemplateInd':
                case 'UpdateIntSMSNotifyTemplateInd':
                case 'CloseIntSMSNotifyTemplateInd':
                case 'PassedIntSMSNotifyTemplateInd':
                    this.modalVO = new ICabsModalVO(MessageConstant.PageSpecificMessage.blankOutSMS, null, this.promptConfirm.bind(this));
                    if (!this.getControlValue('SMSTemplateCode')) {
                        this.modalVO.data = 'SMSTemplateCode';
                        this.modalAdvService.emitPrompt(this.modalVO);
                    } else {
                        this.modalVO.data = 'SMSTemplateCode';
                        this.promptConfirm(this.modalVO);
                    }
                    break;
                case 'CreateIntNotifyGroupInd':
                case 'UpdateIntNotifyGroupInd':
                case 'CloseIntNotifyGroupInd':
                case 'PassedIntNotifyGroupInd':
                    this.modalVO = new ICabsModalVO(MessageConstant.PageSpecificMessage.blankOutGroup, null, this.promptConfirm.bind(this));
                    if (!this.getControlValue('NotifyGroupCode')) {
                        this.modalVO.data = 'NotifyGroupCode';
                        this.modalAdvService.emitPrompt(this.modalVO);
                    } else {
                        this.modalVO.data = 'NotifyGroupCode';
                        this.promptConfirm(this.modalVO);
                    }
                    break;
                default:
                    break;
            }
        }
    }

    public riGridOnRefresh(): void {
        if (this.pageParams.curPage <= 0) {
            this.pageParams.curPage = 1;
        }
        this.riGridBeforeExecute();
    }

    public riGridSort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public getCurrentPage(event: any): void {
        this.pageParams.curPage = event.value;
        this.riGridBeforeExecute();
    }

    public riGridHeaderClick(event: any): void {
        this.riGridBeforeExecute();
    }

    public btnPopulateOnClick(): void {
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSContactTypeDetailPropertiesGrid.p';
        this.riMaintenance.PostDataAdd('BusinessCode', this.businessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContactTypeCode', this.getControlValue('ContactTypeCode'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContactTypeDetailCode', this.getControlValue('ContactTypeDetailCode'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('BranchGroupSelect', this.getControlValue('BranchGroupSelect'), MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('BranchNumber', this.getControlValue('BranchNumber'), MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('AccountNumber', this.getControlValue('AccountNumber'), MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GroupAccountNumber', this.getControlValue('GroupAccountNumber'), MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('TierCode', this.getControlValue('TierCode'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('TeamID', this.getControlValue('TeamID'), MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('fn', 'Populate', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                this.riGridOnRefresh();
            }
        }, 'POST', 6);
    }

    // TODO: iCABSSTeamSearch - Npt yet developed
    /* public teamIDOnkeydown(): void {
     riExchange.Mode = "LookUp": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=System/iCABSSTeamSearch.htm
    } */

    // TODO: iCABSSNotificationTemplateSearch - Not yet developed
    /* public emailTemplateCodeOnkeydown(): void {
     riExchange.Mode = "LookUpEmail": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=System/iCABSSNotificationTemplateSearch.htm"
     } */

    public emailTemplateCodeOnChange(): void {
        this.riGrid.RefreshRequired();
    }

    // TODO:iCABSSNotificationTemplateSearch - Not yet ready
    /* public smsTemplateCodeOnkeydown(): void {
         riExchange.Mode = "LookUpSMS": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=System/iCABSSNotificationTemplateSearch.htm"
     } */

    public smsTemplateCodeOnChange(): void {
        this.riGrid.RefreshRequired();
    }

    // TODO: iCABSSNotificationGroupSearch - Not yet ready
    /* public notifyGroupCodeOnkeydown(): void {
     riExchange.Mode = "LookUp":
     window.location = "/wsscripts/riHTMLWrapper.p?riFileName=System/iCABSSNotificationGroupSearch.htm
     } */

    public notifyGroupCodeOnChange(): void {
        this.riGrid.RefreshRequired();
    }

    public branchNumberOnchange(data: any): void {
        if (data) {
            this.setControlValue('BranchNumber', data.BranchNumber);
        }
    }

    public groupAccountNumberOnchange(data: any): void {
        if (data) {
            this.setControlValue('GroupAccountNumber', data.GroupAccountNumber);
        }
    }

    public accountNumberOnchange(data: any): void {
        if (data) {
            this.setControlValue('AccountNumber', data.AccountNumber);
        }
    }

    public tierCodeOnChange(data: any): void {
        if (data) {
            this.setControlValue('TierCode', data.TierCode);
        }
    }

    public branchGroupSelectOnChange(): void {
        this.setControlValue('AccountNumber', '');
        this.setControlValue('GroupAccountNumber', '');
        this.setControlValue('BranchNumber', '');

        switch (this.getControlValue('BranchGroupSelect')) {
            case 'Business':
                this.pageParams.isGroupAccountNumberisDisplay = false;
                this.pageParams.isAccountNumberisDisplay = false;
                this.pageParams.isBranchNumberisDisplay = false;
                this.pageParams.isTierCodeisDisplay = false;
                break;
            case 'Tier':
                this.pageParams.isGroupAccountNumberisDisplay = false;
                this.pageParams.isAccountNumberisDisplay = false;
                this.pageParams.isBranchNumberisDisplay = false;
                this.pageParams.isTierCodeisDisplay = true;
                this.isformControlTierCode.emit(true);
                break;
            case 'Branch':
                this.pageParams.isGroupAccountNumberisDisplay = false;
                this.pageParams.isAccountNumberisDisplay = false;
                this.pageParams.isTierCodeisDisplay = false;
                this.pageParams.isBranchNumberisDisplay = true;
                this.isformControlBranchNumber.emit(true);
                break;
            case 'Account':
                this.pageParams.isGroupAccountNumberisDisplay = false;
                this.pageParams.isBranchNumberisDisplay = false;
                this.pageParams.isTierCodeisDisplay = false;
                this.pageParams.isAccountNumberisDisplay = true;
                this.isFormControlAccountNumber.emit(true);
                break;
            case 'GroupAccount':
                this.pageParams.isGroupAccountNumberisDisplay = true;
                this.pageParams.isAccountNumberisDisplay = false;
                this.pageParams.isBranchNumberisDisplay = false;
                this.pageParams.isTierCodeisDisplay = false;
                this.isformControlGroupAccountNumber.emit(true);
                break;
            case 'All':
                this.pageParams.isAccountNumberisDisplay = false;
                this.pageParams.isGroupAccountNumberisDisplay = false;
                this.pageParams.isBranchNumberisDisplay = false;
                this.pageParams.isTierCodeisdisplay = false;
                break;
            default:
                break;
        }
        this.riGrid.RefreshRequired();
    }

    public promptConfirm(data: any): void {
        switch (data.data) {
            case 'TeamID':
                this.riMaintenance.clear();
                this.riMaintenance.BusinessObject = 'iCABSContactTypeDetailPropertiesGrid.p';
                this.riMaintenance.PostDataAdd('RowID', this.riGrid.Details.GetAttribute('SetTeam', 'RowID'), MntConst.eTypeTextFree);
                this.riMaintenance.PostDataAdd('TeamID', this.getControlValue('TeamID'), MntConst.eTypeTextFree);
                this.riMaintenance.PostDataAdd('fn', 'SetTeamID', MntConst.eTypeText);
                this.riMaintenance.Execute(this, function (data: any): any {
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.riGridBeforeExecute();
                    }
                }, 'POST', 6);
                break;

            case 'EmailTemplateCode':
                this.riMaintenance.clear();
                this.riMaintenance.BusinessObject = 'iCABSContactTypeDetailPropertiesGrid.p';
                this.riMaintenance.PostDataAdd('RowID', this.riGrid.Details.GetAttribute('SetTeam', 'RowID'), MntConst.eTypeTextFree);
                this.riMaintenance.PostDataAdd('EmailTemplateCode', this.getControlValue('EmailTemplateCode'), MntConst.eTypeTextFree);
                this.riMaintenance.PostDataAdd('srcElementName', this.riGrid.CurrentColumnName, MntConst.eTypeTextFree);
                this.riMaintenance.PostDataAdd('fn', 'SetEmail', MntConst.eTypeText);
                this.riMaintenance.Execute(this, function (data: any): any {
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.riGridBeforeExecute();
                    }
                }, 'POST', 6);
                break;

            case 'NotifyGroupCode':
                this.riMaintenance.clear();
                this.riMaintenance.BusinessObject = 'iCABSContactTypeDetailPropertiesGrid.p';
                this.riMaintenance.PostDataAdd('RowID', this.riGrid.Details.GetAttribute('SetTeam', 'RowID'), MntConst.eTypeTextFree);
                this.riMaintenance.PostDataAdd('NotifyGroupCode', this.getControlValue('NotifyGroupCode'), MntConst.eTypeTextFree);
                this.riMaintenance.PostDataAdd('srcElementName', this.riGrid.CurrentColumnName, MntConst.eTypeTextFree);
                this.riMaintenance.PostDataAdd('fn', 'SetGroup', MntConst.eTypeText);
                this.riMaintenance.Execute(this, function (data: any): any {
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.riGridBeforeExecute();
                    }
                }, 'POST', 6);
                break;

            case 'SMSTemplateCode':
                this.riMaintenance.clear();
                this.riMaintenance.BusinessObject = 'iCABSContactTypeDetailPropertiesGrid.p';
                this.riMaintenance.PostDataAdd('RowID', this.riGrid.Details.GetAttribute('SetTeam', 'RowID'), MntConst.eTypeTextFree);
                this.riMaintenance.PostDataAdd('SMSTemplateCode', this.getControlValue('SMSTemplateCode'), MntConst.eTypeTextFree);
                this.riMaintenance.PostDataAdd('srcElementName', this.riGrid.CurrentColumnName, MntConst.eTypeTextFree);
                this.riMaintenance.PostDataAdd('fn', 'SetSMS', MntConst.eTypeText);
                this.riMaintenance.Execute(this, function (data: any): any {
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.riGridBeforeExecute();
                    }
                }, 'POST', 6);
                break;

            default:
                break;
        }
    }

    public accountNumberNumPadding(obj: any): void {
        if (this.riExchange.riInputElement.isNumber(this.uiForm, 'AccountNumber')) {
            this.setControlValue('AccountNumber', this.utils.numberPadding(obj.target.value, 9));
        } else {
            this.riExchange.riInputElement.markAsError(this.uiForm, 'AccountNumber');
        }
    }
}
