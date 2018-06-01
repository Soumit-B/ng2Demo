import { InternalGridSearchApplicationModuleRoutes } from './../../base/PageRoutes';
import { Subscription } from 'rxjs/Rx';
import { PageIdentifier } from './../../base/PageIdentifier';
import { CBBConstants } from './../../../shared/constants/cbb.constants';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { ActionTypes } from './../../actions/preview';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { URLSearchParams } from '@angular/http';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PromptModalComponent } from '../../../shared/components/prompt-modal/prompt-modal';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { MntConst } from '../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAApplyApiGrid.html'
})

export class ApplyApiGridComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('ApplyApiGrid') apiGrid: GridComponent;
    @ViewChild('ApiGridPagination') apiPagination: PaginationComponent;
    @ViewChild('BusinessCodeDropdown') businessCodesDropdown: DropdownStaticComponent;
    @ViewChild('CountryCodeDropdown') countryCodesDropdown: DropdownStaticComponent;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('errorModal') public errorModal;

    public cbbSubscription: Subscription;
    public pageSize: number = 10;
    public maxColumn: number = 11;
    public gridCurPage: number = 1;
    public totalRecords: number;
    public itemsPerPage: number = 11;
    public validateProperties: Array<any> = [];
    public gridSortHeaders: Array<any>;
    public errorMessage: string;
    public search: URLSearchParams;
    public pageId: string = '';
    public controls = [
        { name: 'BusinessCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'BusinessDesc', readonly: true, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'YearNo', readonly: true, disabled: false, required: true, type: MntConst.eTypeInteger },
        { name: 'LessThan', readonly: false, disabled: false, required: true, type: MntConst.eTypeDecimal2 },
        { name: 'MonthName', readonly: false, disabled: false, required: true },
        { name: 'ViewBy', readonly: false, disabled: false, required: true }
    ];
    public headerParams: any = {
        method: 'contract-management/maintenance',
        operation: 'Application/iCABSAApplyAPIGrid',
        module: 'api'
    };

    public viewTypesArray: Array<any> = [
        { text: 'Branch', value: 'Branch' },
        { text: 'Region', value: 'Region' }
    ];

    public formValidFlag: number = 1;
    public lessThanValidFlag: boolean = false;
    public yearNoValidFlag: boolean = false;
    public showPromptMessageHeader: boolean = true;
    public promptConfirmTitle: string = '';
    public promptConfirmContent: any;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAAPPLYAPIGRID;
        this.pageTitle = 'Preview API';
        this.browserTitle = 'Preview API';
        this.search = this.getURLSearchParamObject();
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessDesc');
        this.cbbSubscription = this.cbbService.changeEmitter.subscribe(
            data => {
                switch (data[CBBConstants.c_s_CHANGED_PROPERTY]) {
                    case CBBConstants.c_s_CHANGE_BRANCH_CODE:
                    case CBBConstants.c_s_CHANGE_BUSINESS_CODE:
                    case CBBConstants.c_s_CHANGE_COUNTRY_CODE:
                        console.log(' CBB change');
                        this.getFormData('Business');
                        break;
                }
            });
        if (this.attributes.MonthNo) {
            this.populateUIFromFormData();
            this.setControlValue('ViewBy', this.attributes.ViewBy);
            this.search = this.getURLSearchParamObject();
            this.buildGrid();
        } else {
            this.pageParams.months = [];
            this.setControlValue('ViewBy', 'Branch');
            this.attributes.ViewBy = 'Branch';
            this.gridSortHeaders = [{
                'fieldName': 'BranchNumber',
                'colName': 'Branch Number',
                'sortType': 'ASC'
            }];
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessCode', this.businessCode());
            this.getFormData('Business');
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.cbbSubscription) {
            this.cbbSubscription = null;
        }
    }
    public onViewTypeCodeChange(viewType: any): void {
        if (viewType === 'Branch') {
            this.gridSortHeaders = [{
                'fieldName': 'BranchNumber',
                'colName': 'Branch Number',
                'sortType': 'ASC'
            }];
        }
        else {
            this.gridSortHeaders = [{
                'fieldName': 'RegionCode',
                'colName': 'Region Code',
                'sortType': 'ASC'
            }];
        }
        this.attributes.ViewBy = viewType;
    }

    public getGridInfo(info: any): void {
        this.totalRecords = info.totalRows;
    }

    public getSelectedRowInfo(info: any): void {
        if (info.cellIndex === 0 && info.cellData['rowID'] !== 'TOTAL') {
            if (this.attributes.ViewBy === 'Branch') {
                this.attributes.BranchName = info.trRowData[1].text;
                this.attributes.BranchNumber = info.trRowData[0].text;
            } else {
                this.attributes.RegionCode = info.trRowData[0].text;
                this.attributes.RegionDescription = info.trRowData[1].text;
            }
            this.attributes.MonthNo = this.getControlValue('MonthName');
            this.attributes.MonthName = this.pageParams.months[parseInt(this.getControlValue('MonthName'), 10) - 1].text;
            this.attributes.BusinessCode = this.businessCode;
            this.attributes.CountryCode = this.countryCode;
            this.attributes.Row = this.businessCode;
            this.attributes.YearNo = this.riExchange.riInputElement.GetValue(this.uiForm, 'YearNo', MntConst.eTypeInteger);
            this.attributes.Row = info.cellData['rowID'];
            for (let key in this.attributes) {
                if (key) {
                    this.riExchange.setParentAttributeValue(key, this.attributes[key]);
                }
            }
            this.navigate('ApplyAPIGrid', InternalGridSearchApplicationModuleRoutes.ICABSAAPPLYAPICONTRACTGRID);
        }
    }

    public getCurrentPage(data: any): void {
        this.gridCurPage = data.value;
        this.buildGrid();
    }


    public sortGrid(data: any): void {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, data.sort === 'DESC' ? 'Descending' : 'Ascending');
        this.buildGrid();
    }

    public refresh(): void {
        if (this.validateEditableFields()) {
            this.gridCurPage = 1;
            this.apiGrid.clearGridData();
            this.buildGrid();
        } else {
            this.errorModal.showHeader = true;
            this.errorModal.showCloseButton = true;
            let data = {
                'errorMessage': MessageConstant.Message.NoSpecialCharecter
            };
            this.errorModal.show(data, true);
        }
    }

    public onLessThanValueChange(): void {
        let temp = this.getControlValue('LessThan');
        this.setControlValue('LessThan', this.utils.numToDecimal(temp, 2));
    }

    public validateEditableFields(): boolean {
        let valYearNo = this.riExchange.riInputElement.GetValue(this.uiForm, 'YearNo', MntConst.eTypeInteger);
        if (valYearNo.length === 0) {
            this.formValidFlag = 0;
            this.yearNoValidFlag = true;
            return false;
        } else if (valYearNo.toString() === 'false') {
            this.formValidFlag = 0;
            this.yearNoValidFlag = true;
            return false;
        } else if (!isNaN(Number(valYearNo))) {
            this.formValidFlag = 1;
            this.yearNoValidFlag = false;
        } else {
            this.formValidFlag = 0;
            this.yearNoValidFlag = true;
            return false;
        }

        let valLessThan = this.riExchange.riInputElement.GetValue(this.uiForm, 'LessThan', MntConst.eTypeDecimal2);
        if (valLessThan.length === 0) {
            this.formValidFlag = 0;
            this.lessThanValidFlag = true;
            return false;
        } else if (valLessThan.toString() === 'false') {
            this.formValidFlag = 0;
            this.lessThanValidFlag = true;
            return false;
        } else if (!isNaN(Number(valLessThan))) {
            this.formValidFlag = 1;
            this.lessThanValidFlag = false;
        } else {
            this.formValidFlag = 0;
            this.lessThanValidFlag = true;
            return false;
        }

        if (this.formValidFlag === 1) {
            return true;
        }
    }

    public buildGrid(): void {
        this.setGridHeaders();
        this.search.delete('YearNo');
        this.search.delete('MonthNo');
        this.search.delete('postDesc');
        this.search.set('ViewBy', this.attributes.ViewBy);

        let previewMonth = this.getControlValue('MonthName');
        this.search.set(this.serviceConstants.Action, '2');

        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'YearNo', MntConst.eTypeInteger) && previewMonth) {
            this.search.set('YearNo', this.riExchange.riInputElement.GetValue(this.uiForm, 'YearNo', MntConst.eTypeInteger));
            this.search.set('MonthNo', previewMonth);
        }
        this.search.set('Level', 'Business');
        this.search.set('LessThan', this.riExchange.riInputElement.GetValue(this.uiForm, 'LessThan', MntConst.eTypeDecimal2));
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '2229546');
        this.search.set(this.serviceConstants.GridCacheRefresh, 'true');
        this.search.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        this.search.set(this.serviceConstants.GridPageCurrent, this.gridCurPage.toString());
        let apiParams: any = {};
        apiParams.module = this.headerParams.module;
        apiParams.method = this.headerParams.method;
        apiParams.operation = this.headerParams.operation;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessCode', this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        apiParams.search = this.search;
        this.apiGrid.itemsPerPage = this.pageSize;
        this.apiGrid.loadGridData(apiParams);
    }

    private setGridHeaders(): void {
        this.validateProperties = [];

        switch (this.attributes.ViewBy) {
            case 'Region':
                this.validateProperties.push({ 'type': MntConst.eTypeCode, 'index': 0 });
                this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 1 });
                break;
            case 'Branch':
                this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 0 });
                this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 1 });
                break;
            default:
                this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 0 });
                this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 1 });
        }

        this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 2 });
        this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 3 });
        this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 4 });
        this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 5 });
        this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 6 });
        this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 7 });
        this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 8 });
        this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 9 });
        this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 10 });
        this.validateProperties.push({ 'type': MntConst.eTypeText, 'index': 11 });
    }

    public getFormData(postDesc: string): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('postDesc', postDesc);
        this.ajaxSource.next(AjaxConstant.START);

        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
            this.headerParams.operation, this.search)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                } else {
                    if (postDesc && postDesc === 'GetMonthNames') {
                        this.pageParams.months = [];
                        let monthString = e.MonthNames;
                        let monthArray = monthString.split(',');
                        for (let i = 1; i <= monthArray.length; i++) {
                            let month = { text: monthArray[i - 1], value: i };
                            this.pageParams.months.push(month);
                        }
                        if (this.attributes.MonthNo) {
                            this.setControlValue('MonthName', this.attributes.MonthNo);
                            this.search = this.getURLSearchParamObject();
                            this.buildGrid();
                        } else {
                            this.getFormData('APIMonth');
                        }
                    } else if (postDesc && postDesc === 'APIMonth') {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'LessThan', this.utils.numToDecimal(e.LessThanValue, 2));
                        this.setControlValue('MonthName', (e.APIMonth).toString());
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'YearNo', e.APIYear);
                    } else if (postDesc && postDesc === 'Business') {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessDesc', e.BusinessDesc);
                        this.getFormData('GetMonthNames');
                    }
                }
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                this.buildGrid();
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            });
    }
}

