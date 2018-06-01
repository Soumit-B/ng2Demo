import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { Component, OnInit, OnDestroy, ViewChild, Injector, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';

@Component({
    templateUrl: 'iCABSSePESVisitGrid.html'
})

export class SePESVisitGridComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('sePESVisitGrid') sePESVisitGrid: GridComponent;
    @ViewChild('sePESVisitGridPagination') sePESVisitGridPagination: PaginationComponent;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('messageModal') public messageModal;

    public pageId: string = '';
    public controls = [
        { name: 'BranchNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'BranchName', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'EmployeeCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'DateFrom', readonly: true, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'DateTo', readonly: true, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'SupervisorEmployeeCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'SupervisorSurname', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'ShowInvalidEmployeeCodes', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox },
        { name: 'Level', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'BusinessCode', readonly: false, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'BusinessDesc', readonly: false, disabled: true, required: false, type: MntConst.eTypeText }
    ];

    //local variables
    public setFocusDateFrom = new EventEmitter<boolean>();
    public uiFormValueChanges: any;
    public level: string;
    public tdBranchDisplay: boolean = false;
    public tdBusinessDisplay: boolean = false;
    public grdPESVisit: any = {};
    public DateTo: Date = new Date();
    public DateFrom: string;
    public Date: Date = new Date();
    public dtNewFromDate: string;
    public dtNewToDate: string;
    public dateReadOnly: boolean = false;
    public headerClickedColumn: string = '';
    public riSortOrder: string = '';

    //grid components variables
    public search = new URLSearchParams();
    public riGrid: any = {};
    public pageSize: number = 30;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 15;
    private selectedRow: any = -1;
    public gridSortHeaders: Array<any>;
    public itemsPerPage: number;

    public ellipseConfig = {
        empSearchComponent: {
            inputParams: {
                parentMode: 'LookUp-Service-All',
                businessCode: this.utils.getBusinessCode(),
                countryCode: this.utils.getCountryCode()
            },
            isDisabled: false,
            isRequired: false,
            showCloseButton: true,
            config: {
                ignoreBackdropClick: true
            },
            showHeader: true
        },
        empSupervisorSearchComponent: {
            inputParams: {
                parentMode: 'LookUp-Supervisor',
                businessCode: this.utils.getBusinessCode(),
                countryCode: this.utils.getCountryCode()
            },
            isDisabled: false,
            isRequired: false,
            showCloseButton: true,
            config: {
                ignoreBackdropClick: true
            },
            showHeader: true
        }
    };

    public empSearchComponent = EmployeeSearchComponent;
    public empSearchDataReceived(eventObj: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', eventObj.EmployeeCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', eventObj.EmployeeSurname);
    };

    public empSupervisorSearchDataReceived(eventObj: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorEmployeeCode', eventObj.SupervisorEmployeeCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorSurname', eventObj.SupervisorSurname);
    };

    public pageVariables = {
        savecancelFlag: true,
        isRequesting: false
    };

    public xhrParams: any = {
        method: 'service-delivery/grid',
        module: 'pda',
        operation: 'Service/iCABSSePESVisitGrid'
    };

    public promptConfig = {
        forSave: {
            showPromptMessageHeader: true,
            promptConfirmTitle: '',
            promptConfirmContent: MessageConstant.Message.ConfirmRecord
        },
        promptFlag: 'save',
        config: {
            ignoreBackdropClick: true
        },
        isRequesting: false
    };

    public messageModalConfig = {
        showMessageHeader: true,
        config: {
            ignoreBackdropClick: true
        },
        title: '',
        content: '',
        showCloseButton: true
    };

    public validateProperties: Array<any> = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPESVISITGRID;
        this.browserTitle = 'Unprocessed Sync Visits';
    };

    public ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Unprocessed Sync Visits';
        this.initForm();
        this.uiFormValueChanges = this.uiForm.statusChanges.subscribe((value: any) => {
            this.formChanges(value);
        });
        this.window_onload();
        this.buildGridInit();
    };

    public buildGridInit(): void {
        this.validateProperties = [
            {
                'type': MntConst.eTypeCode,
                'index': 0,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeDate,
                'index': 1,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeTime,
                'index': 2,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 3
            },
            {
                'type': MntConst.eTypeDate,
                'index': 4,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeCode,
                'index': 5,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 6,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 7
            },
            {
                'type': MntConst.eTypeCode,
                'index': 8,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeCode,
                'index': 9,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeTime,
                'index': 10,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeTime,
                'index': 11,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeImage,
                'index': 12,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeImage,
                'index': 13,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeImage,
                'index': 14,
                'align': 'center'
            }];
        this.buildGrid();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.uiFormValueChanges.unsubscribe();
    };

    public formChanges(obj: any): void {
        if (obj === 'VALID') {
            this.pageVariables.savecancelFlag = false;
        } else {
            this.pageVariables.savecancelFlag = true;
        }
    };

    public initForm(): void {
        this.riExchange.renderForm(this.uiForm, this.controls);
    };

    public myDateFormat(): any {
        let dateFrom = new Date(new Date().setDate(1));
        return dateFrom;
    };

    public promptConfirm(eventObj: any): void {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                break;
            default:
                break;
        }
    };

    public promptCancel(eventObj: any): void {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                break;
            default:
                break;
        }
    };

    public messageModalClose(): void {
        //TODO
    };
    public window_onload(): void {

        this.DateFrom = this.myDateFormat();

        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BranchNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BranchName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'EmployeeSurname');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SupervisorSurname');

        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessCode', this.utils.getBusinessCode());
        this.utils.getBusinessDesc(this.utils.getBusinessCode(), this.countryCode()).subscribe((data) => {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessDesc', data.BusinessDesc);
        });
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchNumber', this.utils.getBranchCode());
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchName', this.utils.getBranchText());

        if (this.riExchange.URLParameterContains('Business')) {
            this.uiForm.controls['Level'].setValue('Business');
            this.tdBusinessDisplay = true;
        }
        else {
            this.uiForm.controls['Level'].setValue('Branch');
            this.tdBranchDisplay = true;
        }

        this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', this.DateFrom);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', this.DateTo);
        this.setFocusDateFrom.emit(true);
        this.uiForm.controls['BusinessCode'].setValue(this.utils.getBusinessCode());
        this.uiForm.controls['BusinessDesc'].setValue(this.utils.getBusinessDesc(this.utils.getBusinessCode()));
    };

    public validateScreenParameters(): boolean {
        let blnReturn: boolean = true;
        if (!(this.isDate(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom')))) {
            blnReturn = false;
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom', true);
        }
        if (!(this.isDate(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo')))) {
            blnReturn = false;
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo', true);
        }
        return blnReturn;
    };

    public isDate(date: any): boolean {
        let val = new Date(date).toString();
        let isDate: boolean;
        if (val !== 'Invalid Date')
            isDate = true;
        else
            isDate = false;
        return isDate;
    };

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            try {
                let dateArr = value.value.split('/');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', value.value);
                this.dtNewToDate = value.value;
            } catch (errorHandler) {
                let DateFrom = new Date(Date.parse(value.value));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', DateFrom);
            }
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', '');
        }
    };

    public dateToSelectedValue(value: any): void {
        if (value && value.value) {
            try {
                let dateArr = value.value.split('/');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', value.value);
                this.dtNewToDate = value.value;
            } catch (errorHandler) {
                let DateTo = new Date(Date.parse(value.value));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', DateTo);
            }
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', '');
        }
    };

    public dateFromOnChange(): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.refresh();
        }
    };

    public dateToOnChange(): void {
        if (this.riExchange.validateForm(this.uiForm))
            this.refresh();
    };

    public employeeCodeOnChange(): void {
        let searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '0');
        let postParams: any = {};
        postParams.PostDesc = 'Employee';
        postParams.BusinessCode = this.businessCode();
        postParams.EmployeeCode = this.getControlValue('EmployeeCode');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, searchPost, postParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public supervisorCodeOnChange(): void {
        if (!this.getControlValue('SupervisorEmployeeCode')) {
            this.setControlValue('SupervisorSurname', '');
            return;
        }
        let searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '0');
        let postParams: any = {};
        postParams.PostDesc = 'SupervisorEmployee';
        postParams.BusinessCode = this.businessCode();
        postParams.SupervisorEmployeeCode = this.getControlValue('SupervisorEmployeeCode');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, searchPost, postParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.setControlValue('SupervisorSurname', data.SupervisorSurname);
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public buildGrid(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('LanguageCode', this.riExchange.LanguageCode());
        this.search.set('Level', 'Business');
        this.search.set('BranchNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber'));
        this.search.set('EmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'));
        this.search.set('SupervisorEmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode'));
        this.search.set('ShowInvalidEmployeeCodes', this.getControlValue('ShowInvalidEmployeeCodes') ? 'True' : 'False');
        this.search.set('DateFrom', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom'));
        this.search.set('DateTo', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo'));

        this.search.set(this.serviceConstants.PageSize, '10');
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.search.set(this.serviceConstants.GridSortOrder, this.riSortOrder);
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClickedColumn);
        this.xhrParams.search = this.search;
        this.sePESVisitGrid.loadGridData(this.xhrParams);
    };

    public riExchangeUpDateHTMLDocument(): void {
        this.riGrid.update = true;
        this.refresh();
    };

    public selectedRowFocus(rsrcElement: any): void {
        this.grdPESVisit.Row = this.riGrid.rowIndex;
        if (this.riGrid.headerTitle === 'BranchNumber') {
            this.grdPESVisit.PESVisitRowID = this.riGrid.cellData.rowID;
        }
    };

    public branchNumberOnChange(obj: any): void {
        //To do
    };

    public gridOnDblClick(data: any): void {
        if (data.cellIndex === 0 || data.cellIndex === 3) {
            if (data.cellIndex === 0) {
                if (this.riExchange.URLParameterContains('Business')) {
                    if (this.sePESVisitGrid.getCellInfoForSelectedRow(data.rowIndex, '0')['additionalData'] !== 'PDASyncLogin') {
                        this.attributes.EmployeeCode = this.sePESVisitGrid.getCellInfoForSelectedRow(data.rowIndex, '0')['text'];
                        // this.navigate('PESVisit' , 'path for iCABSSePDASyncVisitEmployeeReplace');
                        this.messageModal.show({ msg: 'This screen is not yet Developed' }, false);
                    }
                }
            }
            if (data.cellIndex === 3) {
                if (this.sePESVisitGrid.getCellInfoForSelectedRow(data.rowIndex, '0')['additionalData'] === 'PESLogin') {
                    // this.navigate('PESVisit' , 'path for Service/iCABSSePESLoginMaintenance.htm');
                    this.messageModal.show({ msg: 'This screen is not yet Developed' }, false);
                } else {
                    // this.navigate('PESVisit' , 'path for Service/iCABSSePESVisitMaintenance.htm');
                    this.messageModal.show({ msg: 'This screen is not yet Developed' }, false);
                }
            }
        }
    };

    public getGridInfo(info: any): void {
        this.totalItems = info.totalRows;
    }

    public sortGridInfo(data: any): void {
        this.headerClickedColumn = data.fieldname;
        this.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    }

    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.buildGrid();
    }

    public refresh(): void {
        this.currentPage = 1;
        if (this.riExchange.validateForm(this.uiForm)) {
            this.sePESVisitGrid.clearGridData();
            this.buildGrid();
        }
    }

}
