import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';

@Component({
    templateUrl: 'iCABSCMContactRedirection.html'
})
export class ContactRedirectionComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riPagination') riPagination: PaginationComponent;
    @ViewChild('employeeCodeEllipsis') employeeCodeEllipsis: EllipsisComponent;

    private muleConfig = {
        method: 'ccm/maintenance',
        module: 'rules',
        operation: 'ContactManagement/iCABSCMContactRedirection',
        contentType: 'application/x-www-form-urlencoded'
    };

    public pageId: string = '';
    public pageSize: number = 10;
    public gridCurPage: number = 1;
    public totalRecords: number = 0;
    public maxColumn: number = 8;
    public inputParams: any = {};
    public isRequesting: boolean = false;
    public ellipsisConfig = {
        employeeCode: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'currentContractType': '',
                'currentContractTypeURLParameter': '',
                'showAddNew': false,
                'countryCode': '',
                'businessCode': '',
                'negativeBranchNumber': '',
                'negBranchNumber': '',
                'serviceBranchNumber': '',
                'branchNumber': '',
                'salesBranchNumber': '',
                'OccupationCode': '',
                'NewServiceBranchNumber': '',
                'NewNegBranchNumber': '',
                action: 0
            },
            modalConfig: '',
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    public dropdownConfig = {
        branchSearch: {
            isDisabled: false,
            inputParams: {},
            selected: { id: '', text: '' }
        }
    };

    public datePickerConfig = {
        dateFrom: {
            value: new Date(),
            isRequired: false
        },
        dateTo: {
            value: new Date(),
            isRequired: false
        }
    };

    public showErrorHeader = true;
    public showMessageHeader = true;

    public controls: Array<any> = [
        { name: 'EmployeeCode', readonly: true, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'BranchNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'BranchName', readonly: true, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'DateFrom', value: 'DateFrom', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'DateTo', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCONTACTREDIRECTION;
        this.pageTitle = 'Contact Redirection';
        this.browserTitle = this.pageTitle;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private windowOnload(): void {
        let today: any;
        let getToDate: any;
        let getFromDate: any;

        this.disableControl('EmployeeSurname', true);
        this.dropdownConfig.branchSearch.selected = { id: this.utils.getBranchCode(), text: this.utils.getBranchText() };
        this.setControlValue('BranchNumber', this.utils.getBranchCode());
        this.setControlValue('BranchName', this.utils.getBranchText());
        today = new Date();
        getToDate = this.globalize.parseDateToFixedFormat(today);
        this.setControlValue('DateTo', this.globalize.parseDateStringToDate(getToDate.toString()));
        getFromDate = this.globalize.parseDateToFixedFormat(this.utils.removeDays(today, 28));
        this.setControlValue('DateFrom', this.globalize.parseDateStringToDate(getFromDate.toString()));

        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.setControlValue('DateTo', this.formData.DateTo);
            this.setControlValue('DateFrom', this.formData.DateFrom);
            this.setControlValue('EmployeeCode', this.formData.EmployeeCode);
        }

        this.dateFromOnChange();
        this.buildGrid();
    }

    private dateFromOnChange(): void {
        if (this.getControlValue('DateFrom') || this.getControlValue('DateTo')) {
            this.uiForm.controls['DateFrom'].setValidators(Validators.required);
            this.uiForm.controls['DateTo'].setValidators(Validators.required);
            if (!this.getControlValue('DateFrom')) {
                this.uiForm.controls['DateFrom'].setErrors({ remote: true });
            }
            if (!this.getControlValue('DateTo')) {
                this.uiForm.controls['DateTo'].setErrors({ remote: true });
            }
            this.uiForm.controls['DateTo'].updateValueAndValidity();
            this.uiForm.controls['DateFrom'].updateValueAndValidity();
            this.datePickerConfig.dateTo.isRequired = true;
            this.datePickerConfig.dateFrom.isRequired = true;
        }
        else {
            this.uiForm.controls['DateFrom'].clearValidators();
            this.uiForm.controls['DateFrom'].setErrors(null);
            this.uiForm.controls['DateFrom'].updateValueAndValidity();
            this.uiForm.controls['DateTo'].clearValidators();
            this.uiForm.controls['DateTo'].setErrors(null);
            this.uiForm.controls['DateTo'].updateValueAndValidity();
            this.datePickerConfig.dateTo.isRequired = false;
            this.datePickerConfig.dateFrom.isRequired = false;
        }
    }

    private buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('EmployeeCode', 'ContactRedirection', 'EmployeeCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('EmployeeSurname', 'ContactRedirection', 'EmployeeSurname', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('EmployeeSurname', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('EmployeeCode', true);
        this.riGrid.AddColumnOrderable('EmployeeSurname', true);

        this.riGrid.AddColumn('EmployeeCodeTo', 'ContactRedirection', 'EmployeeCodeTo', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('EmployeeCodeTo', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('EmployeeToSurname', 'ContactRedirection', 'EmployeeToSurname', MntConst.eTypeText, 16);
        this.riGrid.AddColumnAlign('EmployeeToSurname', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('EmployeeCodeTo', true);
        this.riGrid.AddColumnOrderable('EmployeeToSurname', true);

        this.riGrid.AddColumn('DateRedirectFrom', 'ContactRedirection', 'DateRedirectFrom', MntConst.eTypeDate, 16);
        this.riGrid.AddColumnAlign('DateRedirectFrom', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('DateRedirectFrom', true);

        this.riGrid.AddColumn('DateRedirectTo', 'ContactRedirection', 'DateRedirectTo', MntConst.eTypeDate, 16);
        this.riGrid.AddColumnAlign('DateRedirectTo', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('DateRedirectTo', true);

        this.riGrid.AddColumn('CreatedBy', 'ContactRedirection', 'CreatedBy', MntConst.eTypeTextFree, 20);
        this.riGrid.AddColumn('CreatedOn', 'ContactRedirection', 'CreatedOn', MntConst.eTypeDateText, 15);
        this.riGrid.AddColumnAlign('ParentServiceVisitFreq', MntConst.eAlignmentRight);
        this.riGrid.AddColumnAlign('ChildServiceVisitFreq', MntConst.eAlignmentRight);
        this.riGrid.Complete();
        this.riGridBeforeExecute();
    }

    private riGridBeforeExecute(): void {
        if (this.uiForm.invalid) return;

        let gridQueryParams: URLSearchParams = this.getURLSearchParamObject();
        gridQueryParams.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        gridQueryParams.set(this.serviceConstants.Action, '2');
        gridQueryParams.set('riGridMode', '0');
        gridQueryParams.set('riCacheRefresh', 'True');
        gridQueryParams.set('riGridHandle', this.utils.gridHandle);
        gridQueryParams.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        gridQueryParams.set(this.serviceConstants.PageCurrent, this.gridCurPage.toString());
        gridQueryParams.set('BranchNumber', this.getControlValue('BranchNumber'));
        gridQueryParams.set('DateFrom', this.globalize.parseDateToFixedFormat(this.getControlValue('DateFrom')).toString());
        gridQueryParams.set('DateTo', this.globalize.parseDateToFixedFormat(this.getControlValue('DateTo')).toString());
        gridQueryParams.set('EmployeeCode', this.getControlValue('EmployeeCode'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, gridQueryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data) {
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        this.totalRecords = 0;
                        this.riGrid.ResetGrid();
                    } else {
                        this.gridCurPage = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.Execute(data);
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public onSelectedDateFromValue(data: any): void {
        this.dateFromOnChange();
    }

    public onSelectedDateToValue(data: any): void {
        this.dateFromOnChange();
    }

    public onEmployeeSearchDataReceived(data: any, route: any): void {
        this.setControlValue('EmployeeCode', data.EmployeeCode);
        this.setControlValue('EmployeeSurname', data.fullObject.EmployeeSurname ? data.fullObject.EmployeeSurname : '');
    }

    public onBranchSearchReceived(data: any): void {
        if (data && data.BranchNumber) {
            this.setControlValue('BranchNumber', data.BranchNumber ? data.BranchNumber : '');
            this.setControlValue('BranchName', data.BranchName ? data.BranchName : '');
            this.setControlValue('EmployeeCode', '');
            this.setControlValue('EmployeeSurname', '');
        }
        else {
            this.setControlValue('BranchNumber', '');
            this.setControlValue('BranchName', '');
        }
    }

    public getCurrentPage(data: any): void {
        this.gridCurPage = data.value;
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public employeeCodeOnKeydown(event: any): void {
        if (this.employeeCodeEllipsis) {
            this.employeeCodeEllipsis.openModal();
        }
    }

    public employeeCodeOnChange(event: any): void {
        if (event.target.value) {
            let queryParams: URLSearchParams = this.getURLSearchParamObject();
            queryParams.set(this.serviceConstants.Action, '6');

            let postObj: any = {};
            postObj.Function = 'GetEmployeeName';
            postObj.EmployeeCode = event.target.value;

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryParams, postObj)
                .subscribe(
                (e) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (e.hasError) {
                        this.setControlValue('EmployeeSurname', '');
                        this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                    } else {
                        let desc: string = e['EmployeeSurname'] ? e['EmployeeSurname'] : '';
                        this.setControlValue('EmployeeSurname', desc);
                        this.uiForm.controls['EmployeeCode'].setErrors(null);
                        this.refresh();
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }
        else {
            this.setControlValue('EmployeeSurname', '');
        }
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public riGridSort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public riGridBodyOnDblClick(event: any): void {
        this.setAttribute('EmployeeCodeContactRowID', event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].getAttribute('RowID'));
    }

}
