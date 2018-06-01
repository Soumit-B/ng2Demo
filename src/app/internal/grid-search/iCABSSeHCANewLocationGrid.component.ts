import { InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { Component, OnInit, OnDestroy, Injector, ViewChild, Input, ChangeDetectorRef } from '@angular/core';

import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { GridAdvancedComponent } from '../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSSeHCANewLocationGrid.html'
})

export class SeHCANewLocationGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('EmployeeCode') employeeCode;

    public pageId: string = '';
    public controls = [
        { name: 'EmployeeCode', commonValidator: true, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', type: MntConst.eTypeText },
        { name: 'FormContractNumber', commonValidator: true, type: MntConst.eTypeCode },
        { name: 'FormContractName', type: MntConst.eTypeText },
        // Hidden Field
        { name: 'PremiseLocationDesc' }
    ];

    // Grid Component Variables
    public gridConfig = {
        pageSize: 10,
        currentPage: 1,
        totalRecords: 1
    };

    // URL Query Parameters
    public queryParams: any = {
        operation: 'Service/iCABSSeHCANewLocationGrid',
        module: 'pda',
        method: 'service-delivery/maintenance'
    };

    // Page level Variables
    public pageVariables = {
        errorMessageDesc: '',
        currentContractTypeURLParameter: '',
        deleteConfirmMessage: {
            key: 'Are You Sure You Wish To Continue ?',
            translatedValue: ''
        }
    };

    // Ellipsis configuration parameters
    public ellipsisParams: any = {
        employee: {
            showCloseButton: true,
            showHeader: true,
            disabled: false,
            childConfigParams: {
                parentMode: 'LookUp'
            },
            contentComponent: EmployeeSearchComponent
        },
        contractName: {
            showCloseButton: true,
            showHeader: true,
            disabled: false,
            childConfigParams: {
                parentMode: 'LookUp'
            },
            contentComponent: ContractSearchComponent
        },
        common: {
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            }
        }
    };

    constructor(injector: Injector, private ref: ChangeDetectorRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEHCANEWLOCATIONGRID;

        this.browserTitle = this.pageTitle = 'New Locations Update';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getAllTranslations();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.buildGrid();
            this.riGrid_onRefresh(null);
            if (this.riExchange.riInputElement.isDisabled(this.uiForm, 'EmployeeCode')) {
                this.ellipsisParams.employee.disabled = true;
            }
            if (this.riExchange.riInputElement.isDisabled(this.uiForm, 'FormContractNumber')) {
                this.ellipsisParams.contractName.disabled = true;
            }
        }
        else {
            this.window_onload();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // Get all the page level translation at once
    public getAllTranslations(): void {
        this.getTranslatedValuesBatch((data: any) => {
            if (data) {
                this.pageVariables.deleteConfirmMessage.translatedValue = data[0].toString();
            }
        },
            [this.pageVariables.deleteConfirmMessage.key]
        );
    }

    // Initializes data into different controls on page load
    public window_onload(): void {
        this.disableControl('EmployeeSurname', true);
        this.disableControl('FormContractName', true);

        this.buildGrid();

        if (this.parentMode === 'Debrief') {
            this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
            this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeSurname'));
            this.setControlValue('FormContractNumber', this.riExchange.getParentAttributeValue('ContractNumber'));

            this.populateDescriptions();

            this.disableControl('EmployeeCode', true);
            this.disableControl('FormContractNumber', true);
            this.ellipsisParams.employee.disabled = true;
            this.ellipsisParams.contractName.disabled = true;

            this.riGrid_onRefresh(null);
        }
        else {
            this.employeeCode.nativeElement.focus();
        }
    }

    // Builds the structure of the grid
    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = this.gridConfig.pageSize;

        this.riGrid.AddColumn('EmployeeCode', 'Update', 'EmployeeCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('EmployeeSurname', 'Update', 'EmployeeSurname', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('EmployeeSurname', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('ContractNumber', 'Update', 'ContractNumber', MntConst.eTypeCode, 8);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PremiseNumber', 'Update', 'PremiseNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PremiseName', 'Update', 'PremiseName', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('ProductCode', 'Update', 'ProductCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('QuantityAtLocation', 'Update', 'QuantityAtLocation', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('QuantityAtLocation', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PremiseLocationDesc', 'Update', 'PremiseLocationDesc', MntConst.eTypeText, 50);

        this.riGrid.AddColumn('NewLocation', 'Update', 'NewLocation', MntConst.eTypeImage, 1, false, 'Click here to create a location');
        this.riGrid.AddColumnAlign('NewLocation', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ViewLocations', 'Update', 'ViewLocations', MntConst.eTypeImage, 1, false, 'Click here to view current locations');
        this.riGrid.AddColumnAlign('ViewLocations', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('DeleteLocation', 'Update', 'DeleteLocation', MntConst.eTypeImage, 1, false, 'Click here to delete current location');
        this.riGrid.AddColumnAlign('DeleteLocation', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('EmployeeCode', true);
        this.riGrid.AddColumnOrderable('ContractNumber', true);

        this.riGrid.Complete();
    }

    // Refresh the grid data on user click
    public riGrid_onRefresh(event: any): void {
        if (this.gridConfig.currentPage <= 0) {
            this.gridConfig.currentPage = 1;
        }
        if (event) {
            this.riGrid.HeaderClickedColumn = '';
        }
        this.populateGrid();
    }

    // Populate data into the grid
    public populateGrid(): void {
        let _search = this.getURLSearchParamObject();
        _search.set('BranchNumber', this.utils.getBranchCode());
        _search.set('EmployeeCode', (this.getControlValue('EmployeeCode').toString().trim().length === 0 ? '' : this.getControlValue('EmployeeCode')));
        _search.set('ContractNumber', (this.getControlValue('FormContractNumber').toString().trim().length === 0 ? '' : this.getControlValue('FormContractNumber')));

        // set grid building parameters
        _search.set(this.serviceConstants.GridMode, '0');
        _search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        _search.set(this.serviceConstants.PageSize, this.gridConfig.pageSize.toString());
        _search.set(this.serviceConstants.PageCurrent, this.gridConfig.currentPage.toString());
        _search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        _search.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        _search.set(this.serviceConstants.Action, '2');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, _search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.riGrid.RefreshRequired();
                    this.gridConfig.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.gridConfig.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.gridConfig.pageSize : 1;
                    this.riGrid.Execute(data);
                    this.ref.detectChanges();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Callback to retrieve the current page on user clicks
    public getCurrentPage(currentPage: any): void {
        this.gridConfig.currentPage = currentPage.value;
        this.riGrid_onRefresh(null);
    }

    // Populate data from ellipsis
    public onEllipsisDataReceived(type: string, data: any): void {
        switch (type) {
            case 'Employee':
                this.setControlValue('EmployeeCode', data.EmployeeCode || '');
                this.setControlValue('EmployeeSurname', data.EmployeeSurname || '');
                break;
            case 'Contract':
                this.setControlValue('FormContractNumber', data.ContractNumber || '');
                this.setControlValue('FormContractName', data.ContractName || '');
                break;
            default:
        }
    }

    // EmployeeCode OnChange event
    public employeeCode_onchange(event: Event): void {
        if (this.getControlValue('EmployeeCode').toString().trim().length === 0) {
            this.setControlValue('EmployeeSurname', '');
        }
        else {
            this.populateDescriptions();
        }
    }

    // public ContractNumber OnChange event
    public contractNumber_onchange(event: Event): void {
        if (this.getControlValue('FormContractNumber').toString().trim().length === 0) {
            this.setControlValue('FormContractName', '');
        }
        else {
            this.populateDescriptions();
        }
    }

    // Populate EmployeeSurname & ContractName
    public populateDescriptions(): void {
        let _formData: Object = {};

        let _search = this.getURLSearchParamObject();
        _search.set(this.serviceConstants.Action, '6');

        _formData['Function'] = 'GetDescriptions';
        _formData['BranchNumber'] = this.utils.getBranchCode();
        if (this.getControlValue('EmployeeCode').toString().trim().length > 0) {
            _formData['EmployeeCode'] = this.getControlValue('EmployeeCode');
        }
        if (this.getControlValue('FormContractNumber').toString().trim().length > 0) {
            _formData['ContractNumber'] = this.getControlValue('FormContractNumber');
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, _search, _formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                    this.setControlValue('FormContractName', data.ContractName);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Grid body on double click
    public riGrid_BodyOnDblClick(event: any): void {
        let colName = this.riGrid.CurrentColumnName;
        if (colName === 'ViewLocations' || colName === 'NewLocation' || colName === 'DeleteLocation') {
            this.updateFocus(event.srcElement);

            if (this.pageVariables.errorMessageDesc !== '') {
                this.modalAdvService.emitError(new ICabsModalVO(this.pageVariables.errorMessageDesc));
                this.pageVariables.errorMessageDesc = '';
            }
            else {
                switch (colName) {
                    case 'NewLocation':
                        this.navigate('NewLocationGrid', InternalMaintenanceApplicationModuleRoutes.ICABSAPREMISELOCATIONMAINTENANCE,
                            { CurrentContractTypeURLParameter: this.pageVariables.currentContractTypeURLParameter });
                        break;
                    case 'ViewLocations':
                        this.navigate('NewLocationGrid', '/application/premiseLocationAllocation',
                            { CurrentContractTypeURLParameter: this.pageVariables.currentContractTypeURLParameter });
                        break;
                    case 'DeleteLocation':
                        this.modalAdvService.emitPrompt(new ICabsModalVO(this.pageVariables.deleteConfirmMessage.translatedValue, null,
                            this.deleteLocation.bind(this)));
                        break;
                    default:
                }
            }
        }
    }

    // Updates the pagelevel attributes on grid row activity
    public updateFocus(rsrcElement: any): void {
        let oTR = rsrcElement.parentElement.parentElement.parentElement;
        rsrcElement.focus();

        this.setAttribute('HCANewLocationRowID', oTR.children[9].children[0].children[0].getAttribute('RowID'));
        this.setAttribute('Row', oTR.sectionRowIndex);

        if (oTR.children[0].children[0].getAttribute('AdditionalProperty') === 'No Error') {
            this.setAttribute('ServiceCoverRowID', oTR.children[9].children[0].children[0].getAttribute('AdditionalProperty'));
            this.setAttribute('ContractNumber', oTR.children[2].children[0].children[0].innerText);
            this.setAttribute('ContractName', oTR.children[4].children[0].children[0].getAttribute('AdditionalProperty'));
            this.setAttribute('PremiseNumber', oTR.children[3].children[0].children[0].innerText);
            this.setAttribute('PremiseName', oTR.children[4].children[0].children[0].innerText);
            this.setAttribute('PremiseLocationDesc', oTR.children[7].children[0].children[0].innerText);
            this.setControlValue('PremiseLocationDesc', oTR.children[7].children[0].children[0].innerText);

            switch (oTR.children[2].children[0].getAttribute('AdditionalProperty')) {
                case 'C':
                    this.pageVariables.currentContractTypeURLParameter = '';
                    break;
                case 'J':
                    this.pageVariables.currentContractTypeURLParameter = '<job>';
                    break;
                case 'P':
                    this.pageVariables.currentContractTypeURLParameter = '<product>';
                    break;
            }
        }
        else {
            this.pageVariables.errorMessageDesc = oTR.children[0].children[0].children[0].getAttribute('AdditionalProperty');
        }
    }

    // Grid keydown on "Up Arror", "Down Arrow" & "Tab"
    public riGrid_BodyOnKeyDown(event: any): void {
        switch (event.keyCode) {
            // Up Arror
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                            this.updateFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                        }
                    }
                }
                break;
            // Down Arror Or Tab
            case 40:
            case 9:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.nextSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                        if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                            this.updateFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                        }
                    }
                }
                break;
        }
    }

    // Handles grid sort functionality
    public riGrid_Sort(event: any): void {
        this.riGrid_onRefresh(null);
    }

    // Delete location functionality
    public deleteLocation(data: any): void {
        let _formData: Object = {};

        let _search = this.getURLSearchParamObject();
        _search.set(this.serviceConstants.Action, '6');

        _formData['Function'] = 'DeleteLocation';
        _formData['RowID'] = this.getAttribute('HCANewLocationRowID');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, _search, _formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (data.DeleteInd.toString().toUpperCase() === 'YES') {
                        this.riGrid_onRefresh(null);
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }
}
