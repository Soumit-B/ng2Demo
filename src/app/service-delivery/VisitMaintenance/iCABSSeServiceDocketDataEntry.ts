import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import * as moment from 'moment';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ContractActionTypes } from './../../actions/contract';
import { ErrorCallback } from './../../base/Callback';
import { PageIdentifier } from './../../base/PageIdentifier';
import { InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { BranchServiceAreaSearchComponent } from './../../internal/search/iCABSBBranchServiceAreaSearch';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { ServicePlanSearchComponent } from './../../internal/search/iCABSSeServicePlanSearch.component';

@Component({
    templateUrl: 'iCABSSeServiceDocketDataEntry.html'
})

export class ServiceDocketDataEntryComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy, ErrorCallback {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('visitDatepicker') public visitDatepicker: DatepickerComponent;
    @ViewChild('serviceDatepicker') public serviceDatepicker: DatepickerComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    public pageId: string = '';
    public controls = [
        { name: 'Barcode' },
        { name: 'BranchServiceAreaCode', required: true },
        { name: 'BranchServiceAreaDesc', disabled: true, required: false },
        { name: 'BarcodeOK' },
        { name: 'ServicePlanNumber', required: true },
        { name: 'EmployeeCode', required: true },
        { name: 'EmployeeSurname', disabled: true, required: false },
        { name: 'ContractNumber', required: true },
        { name: 'ContractName', disabled: true, required: false },
        { name: 'PremiseNumber', required: true },
        { name: 'PremiseName', disabled: true, required: false },
        { name: 'VisitDate', required: true, type: MntConst.eTypeDate },
        { name: 'ServiceDate', required: true, type: MntConst.eTypeDate },
        { name: 'ServiceDNPremiseRowID' },
        { name: 'ServiceBranchNumber' },
        { name: 'ProductCode' },
        { name: 'DateFrom' },
        { name: 'DateTo' },
        { name: 'ServiceCoverRowID' },
        { name: 'ContractRowID' }
    ];
    private currentContractType: string;
    private createServiceVisits: boolean = false;
    public ellipsisParams: any = {
        serviceAreaSearchParams: {
        },
        employeeSearchParams: {
            parentMode: 'LookUp-Service-All'
        },
        servicePlanSearchParams: {
            'parentMode': 'LookUp',
            'branchServiceAreaCode': '',
            'employeeSurname': ''
        }
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public serviceAreaSearchComponent = BranchServiceAreaSearchComponent;
    public employeeSearchComponent = EmployeeSearchComponent;
    public servicePlanSearchComponent = ServicePlanSearchComponent;
    public showMessageHeader: boolean = true;
    private headerParams: any = {
        method: 'service-delivery/grid',
        module: 'delivery-note',
        operation: 'Service/iCABSSeServiceDocketDataEntry'
    };
    public acceptAllDisabled: boolean = true;
    public showAcceptedLabel: boolean = false;
    public planVisitDate: Date;
    public serviceDate: Date;
    public gridParams: any = {
        totalRecords: 1,
        maxColumn: 11,
        itemsPerPage: 10,
        currentPage: 1,
        riGridMode: 0,
        riGridHandle: 16582842,
        riSortOrder: 'Descending'
    };
    private messages: any = {
        barcodeError: 'Barcode Error',
        barcodeDateError: 'Date In Barcode Is Invalid',
        barcodeOkInvalidError: 'Invalid Acceptance Barcode',
        gridNotLoadedError: 'Grid Not Loaded'
    };
    private dateFormat: any = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    private pageData: any;
    public employeeCodeDisabled: boolean = false;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEDOCKETDATAENTRY;
        this.pageTitle = this.browserTitle = 'Service Docket Data Entry';
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public ngAfterViewInit(): void {
        this.currentContractType = this.riExchange.setCurrentContractType();
        this.setErrorCallback(this);
        this.fetchTranslatedContent();
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.HidePageNumber = false;
        this.riGrid.FunctionUpdateSupport = true;
        this.buildGrid();
        this.utils.setTitle(this.browserTitle);
        if (this.formData.ContractNumber) {
            let visitDate = this.getControlValue('VisitDate');
            this.populateUIFromFormData();
            if (this.dateFormat.test(visitDate)) {
                this.planVisitDate = this.utils.convertDate(visitDate);
            } else {
                this.planVisitDate = this.utils.formatDate(visitDate);
            }
            this.loadGridData();
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data, title: 'Error' }, false);
    }

    public onBranchServiceAreaChange(): void {
        let branchServiceArea: string = this.getControlValue('BranchServiceAreaCode');
        let lookupQuery: any;
        let urlParams: URLSearchParams = this.getURLSearchParamObject();
        let formData: any = {};

        this.keyFieldChanged();

        this.ellipsisParams.servicePlanSearchParams['branchServiceAreaCode'] = branchServiceArea;

        if (!branchServiceArea) {
            this.setControlValue('BranchServiceAreaDesc', '');
            return;
        }
        this.setControlValue('BranchServiceAreaCode', branchServiceArea.toUpperCase());

        lookupQuery = [{
            'table': 'BranchServiceArea',
            'query': { 'BranchServiceAreaCode': branchServiceArea, 'BranchNumber': this.utils.getBranchCode() },
            'fields': ['BranchServiceAreaDesc']
        }];
        this.lookupDetails(lookupQuery, 'BranchServiceAreaDesc', 'BranchServiceAreaDesc', 'BranchServiceAreaCode');

        urlParams.set(this.serviceConstants.Action, '6');
        formData['BranchNumber'] = this.utils.getBranchCode();
        formData[this.serviceConstants.Function] = 'GetEmployee';
        formData['BranchServiceAreaCode'] = branchServiceArea;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            urlParams,
            formData).subscribe(data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (!data.EmployeeCode) {
                    this.displayError(MessageConstant.Message.noRecordFound);
                    return;
                }
                this.setControlValue('EmployeeCode', data.EmployeeCode);
                this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                this.ellipsisParams.servicePlanSearchParams['employeeSurname'] = data.EmployeeSurname;
            }, error => {
                this.displayError(MessageConstant.Message.GeneralError, error);
            });
    }

    public onServiceAreaSearchDataReceieved(data: any): void {
        this.keyFieldChanged();
        this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode);
        this.setControlValue('BranchServiceAreaDesc', data.BranchServiceAreaDesc);
        this.ellipsisParams.servicePlanSearchParams['branchServiceAreaCode'] = data.BranchServiceAreaCode;
        this.onBranchServiceAreaChange();
    }

    public onServicePlanSearchDataReceieved(data: any): void {
        this.setControlValue('ServicePlanNumber', data.ServicePlanNumber);
    }

    public onContractNumberChange(): void {
        let contractNumber: string = this.getControlValue('ContractNumber');
        let lookupQuery: any;

        this.keyFieldChanged();

        if (!contractNumber) {
            this.setControlValue('ContractName', '');
            return;
        }

        lookupQuery = [{
            'table': 'Contract',
            'query': { 'ContractNumber': contractNumber },
            'fields': ['ContractName']
        }];
        this.lookupDetails(lookupQuery, 'ContractName', 'ContractName', 'ContractNumber');
    }

    public onPremiseNumberChange(): void {
        let premiseNumber: string = this.getControlValue('PremiseNumber');
        let contractNumber: string = this.getControlValue('ContractNumber');
        let lookupQuery: any;

        this.keyFieldChanged();

        if (!premiseNumber || !contractNumber) {
            this.setControlValue('PremiseName', '');
            return;
        }

        lookupQuery = [{
            'table': 'Premise',
            'query': { 'PremiseNumber': premiseNumber, 'ContractNumber': contractNumber },
            'fields': ['PremiseName']
        }];
        this.lookupDetails(lookupQuery, 'PremiseName', 'PremiseName', 'PremiseNumber');
    }

    public onEmployeeCodeChange(): void {
        let employeeCode: string = this.getControlValue('EmployeeCode');
        let lookupQuery: any;

        if (!employeeCode) {
            this.setControlValue('EmployeeSurname', '');
            this.ellipsisParams.servicePlanSearchParams['employeeSurname'] = '';
            return;
        }

        lookupQuery = [{
            'table': 'Employee',
            'query': { 'EmployeeCode': employeeCode },
            'fields': ['EmployeeSurname']
        }];
        this.lookupDetails(lookupQuery, 'EmployeeSurname', 'EmployeeSurname', 'EmployeeCode');
    }

    public onEmployeeDataReceieved(data: any): void {
        this.setControlValue('EmployeeCode', data.EmployeeCode);
        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
        this.ellipsisParams.servicePlanSearchParams['employeeSurname'] = data.EmployeeSurname;
    }

    private lookupDetails(query: any, field: string, control: string, codeControl?: string): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (!data[0].length) {
                this.setControlValue(control, '');
                this.setControlValue(codeControl, '');
                this.displayError(MessageConstant.Message.noRecordFound);
                return;
            }
            this.setControlValue(control, data[0][0][field]);
        }).catch(error => {
            this.displayError(MessageConstant.Message.GeneralError, error);
        });
    }

    public onVisitDateSelect(data: any): void {
        if (!data.value) {
            return;
        }
        this.setControlValue('VisitDate', data.value);
        this.setControlValue('ServiceDate', data.value);

        setTimeout(() => {
            if (this.dateFormat.test(data.value)) {
                this.serviceDate = this.utils.convertDate(data.value);
            } else {
                this.serviceDate = this.utils.formatDate(data.value);
            }
        }, 0);
    }

    public onServiceDateSelect(data: any): void {
        this.setControlValue('ServiceDate', data.value);
    }

    private buildGrid(): void {
        this.riGrid.Clear();

        this.riGrid.AddColumn('grdServicePlanSequenceNumber', 'ServiceVisit', 'grdServicePlanSequenceNumber', MntConst.eTypeInteger, 5, true, 'Go to Service Visit Summary');
        this.riGrid.AddColumnAlign('grdServicePlanSequenceNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('grdContractNumber', 'ServiceVisit', 'grdContractNumber', MntConst.eTypeText, 10, true, 'Go to Contract Maintenance');
        this.riGrid.AddColumnAlign('grdContractNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('grdPremiseName', 'ServiceVisit', 'grdPremiseName', MntConst.eTypeText, 30, true, 'Go to Premise Maintenance');
        this.riGrid.AddColumnAlign('grdPremiseName', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('grdPremiseLocationDesc', 'ServiceVisit', 'grdPremiseLocationDesc', MntConst.eTypeText, 14, true, 'Go to Location Maintenance');
        this.riGrid.AddColumnAlign('grdPremiseLocationDesc', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('grdProductCode', 'ServiceVisit', 'grdProductCode', MntConst.eTypeCode, 10, true, 'Go to Service Cover Maintenance');
        this.riGrid.AddColumnAlign('grdProductCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('grdSharedVisitInd', 'ServiceVisit', 'grdSharedVisitInd', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('grdSharedVisitInd', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('grdVisitTypeCode', 'ServiceVisit', 'grdVisitTypeCode', MntConst.eTypeCode, 2);
        this.riGrid.AddColumnAlign('grdVisitTypeCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('grdServiceVisitFrequency', 'ServiceVisit', 'grdServiceVisitFrequency', MntConst.eTypeCode, 2);
        this.riGrid.AddColumnAlign('grdServiceVisitFrequency', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('grdServicedQuantity', 'ServiceVisit', 'grdServicedQuantity', MntConst.eTypeInteger, 4, false, 'Change quantity if needed');
        this.riGrid.AddColumnAlign('grdServicedQuantity', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnUpdateSupport('grdServicedQuantity', true);

        this.riGrid.AddColumn('grdPlannedEmployeeCode', 'ServiceVisit', 'grdPlannedEmployeeCode', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('grdPlannedEmployeeCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('grdServiceVisitExists', 'ServiceVisit', 'grdServiceVisitExists', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('grdServiceVisitExists', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('grdServicePlanSequenceNumber', true);
        this.riGrid.AddColumnOrderable('grdVisitTypeCode', true);
        this.riGrid.AddColumnOrderable('grdServiceVisitFrequency', true);
        this.riGrid.AddColumnOrderable('grdPremiseLocationDesc', true);

        this.riGrid.Complete();
    }

    private loadGridData(): void {
        let gridURLParams: URLSearchParams = this.getURLSearchParamObject();
        let gridInputParams: any = {};

        gridURLParams.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        gridURLParams.set(this.serviceConstants.GridHandle, this.gridParams.riGridHandle);
        gridURLParams.set(this.serviceConstants.GridSortOrder, this.gridParams.riSortOrder);
        gridURLParams.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
        gridURLParams.set(this.serviceConstants.PageCurrent, this.gridParams.currentPage);
        gridURLParams.set(this.serviceConstants.Action, '2');

        if (this.createServiceVisits) {
            gridURLParams.set(this.serviceConstants.Function, 'CreateServiceVisits');
        }
        gridURLParams.set('ServiceDNPremiseRowID', this.getControlValue('ServiceDNPremiseRowID'));
        gridURLParams.set('BranchNumber', this.utils.getBranchCode());
        gridURLParams.set(this.serviceConstants.ContractNumber, this.getControlValue(this.serviceConstants.ContractNumber));
        gridURLParams.set(this.serviceConstants.PremiseNumber, this.getControlValue(this.serviceConstants.PremiseNumber));
        gridURLParams.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        gridURLParams.set('VisitDate', this.getControlValue('VisitDate'));
        gridURLParams.set('ServiceDate', this.getControlValue('VisitDate'));

        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridURLParams.set('riSortOrder', sortOrder);
        gridURLParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);

        this.riGrid.RefreshRequired();

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(
            this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            gridURLParams).subscribe(data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    this.riGrid.ResetGrid();
                    return;
                }
                this.gridServiceOnSuccess(data);
            }, error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.displayError(MessageConstant.Message.GeneralError, error);
            });
    }

    public getCurrentPage(curPage: any): void {
        this.gridParams.currentPage = curPage ? curPage.value : this.gridParams.currentPage;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.loadGridData();
    }

    public refresh(): void {
        this.gridParams.currentPage = 1;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;

        if (!this.validateInputs()) {
            return;
        }
        if (!this.getControlValue('Barcode')) {
            this.fetchBarCode();
        } else {
            this.loadGridData();
        }
    }

    public sortGrid(data: any): void {
        this.riGrid.RefreshRequired();
        this.loadGridData();
    }

    private enableAccept(flag: boolean): void {
        this.acceptAllDisabled = flag;
        this.disableControl('BarcodeOK', flag);
        this.disableControl('EmployeeCode', flag);
        this.employeeCodeDisabled = flag;
        this.serviceDatepicker.isDisabled = flag;
        this.showAcceptedLabel = flag;
    }

    private fetchBarCode(): void {
        let urlParams: URLSearchParams = this.getURLSearchParamObject();
        let formData: any = {};

        urlParams.set(this.serviceConstants.Action, '6');

        formData[this.serviceConstants.Function] = 'GetBarcode';
        formData['BranchNumber'] = this.utils.getBranchCode();
        formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
        formData['ServicePlanNumber'] = this.getControlValue('ServicePlanNumber');
        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formData['VisitDate'] = this.getControlValue('VisitDate');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            urlParams,
            formData).subscribe(data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }
                this.setControlValue('Barcode', data.Barcode);
                this.setControlValue('ServiceDNPremiseRowID', data.ServiceDNPremiseRowID);
                if (this.validateInputs() && this.getControlValue('Barcode') && this.getControlValue('ServiceDNPremiseRowID')) {
                    this.loadGridData();
                }
            }, error => {
                this.displayError(MessageConstant.Message.GeneralError, error);
            });
    }

    private validateInputs(): boolean {
        let isValid: boolean = true;
        let controls: Array<string> = [
            'BranchServiceAreaCode',
            'ServicePlanNumber',
            'ContractNumber',
            'PremiseNumber',
            'VisitDate'
        ];

        for (let i = 0; i < controls.length; i++) {
            this.uiForm.controls[controls[i]].markAsTouched();
            if (this.uiForm.controls[controls[i]].invalid) {
                isValid = false;
            }
        }

        if (!this.getControlValue('VisitDate')) {
            let taxPointDate = document.querySelector('#visitDatepicker input[type="text"]');
            this.utils.removeClass(taxPointDate, 'ng-untouched');
            this.utils.addClass(taxPointDate, 'ng-touched');
            isValid = false;
        }

        return isValid;
    }

    public serviceVisitFocus(): void {
        let contractType: string = this.riGrid.Details.GetAttribute('grdContractNumber', 'additionalData');

        switch (contractType) {
            case 'J':
                this.currentContractType = '<job>';
                break;
            default:
                this.currentContractType = '';
                break;
        }
    }

    public onGridRowDoubleClick(data: any): void {
        let columnClicked: string = this.riGrid.CurrentColumnName;
        let serviceCoverRowID: string = this.riGrid.Details.GetAttribute('grdProductCode', 'rowID');
        let contractRowId: string = this.riGrid.Details.GetAttribute('grdContractNumber', 'rowID');
        let productCode: string = this.riGrid.Details.GetValue('grdProductCode');

        if (columnClicked === 'grdSharedVisitInd' || columnClicked === 'grdServiceVisitExists') {
            return;
        }

        this.serviceVisitFocus();

        switch (columnClicked) {
            case 'grdServicePlanSequenceNumber':
                this.setControlValue('DateFrom', this.getControlValue('ServiceDate'));
                this.setControlValue('DateTo', this.getControlValue('ServiceDate'));
                this.setControlValue('ServiceCoverRowID', serviceCoverRowID);
                this.attributes['ServiceCoverRowID'] = serviceCoverRowID;
                this.store.dispatch({
                    type: ContractActionTypes.SAVE_DATA,
                    payload: {
                        parentMode: 'Entitlement',
                        dateFrom: this.getControlValue('ServiceDate'),
                        dateTo: this.getControlValue('ServiceDate'),
                        ServiceCoverRowID: serviceCoverRowID,
                        ProductCode: productCode,
                        ContractNumber: this.getControlValue('ContractNumber'),
                        PremiseNumber: this.getControlValue('PremiseNumber'),
                        currentContractTypeURLParameter: this.currentContractType
                    }
                });
                this.navigate('Entitlement', InternalGridSearchServiceModuleRoutes.ICABSASERVICEVISITSUMMARY, {
                    parentMode: 'Entitlement',
                    dateFrom: this.getControlValue('ServiceDate'),
                    dateTo: this.getControlValue('ServiceDate'),
                    ServiceCoverRowID: serviceCoverRowID,
                    ProductCode: productCode,
                    ContractNumber: this.getControlValue('ContractNumber'),
                    PremiseNumber: this.getControlValue('PremiseNumber'),
                    currentContractTypeURLParameter: this.currentContractType
                });
                break;
            case 'grdContractNumber':
                let contractRowId: string = '';
                this.setControlValue('ContractRowID', contractRowId);
                this.navigate('FlatRateIncrease', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                    parentMode: 'FlatRateIncrease',
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName'),
                    currentContractType: this.currentContractType
                });
                break;
            case 'grdPremiseName':
                this.navigate('GridSearch', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                    currentContractType: this.currentContractType
                });
                break;
            case 'grdProductCode':
                this.setControlValue('ProductCode', this.riGrid.Details.GetValue('grdProductCode'));
                this.setControlValue('ServiceCoverRowID', serviceCoverRowID);
                this.attributes['ServiceCoverRowID'] = serviceCoverRowID;
                this.navigate('Search', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                    currentContractType: this.currentContractType
                });
                break;
        }
    }

    public saveVisitQty($event: any): void {
        let oldValue: string = this.riGrid.previousValues[8].value;
        let newValue: string = this.riGrid.Details.GetValue('grdServicedQuantity');
        let gridURLParams: URLSearchParams = this.getURLSearchParamObject();
        let gridInputParams: any = {};

        if (oldValue === newValue) {
            return;
        }

        gridURLParams.set(this.serviceConstants.GridMode, '3');
        gridURLParams.set(this.serviceConstants.GridHandle, this.gridParams.riGridHandle);
        gridURLParams.set(this.serviceConstants.GridSortOrder, this.gridParams.riSortOrder);
        gridURLParams.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
        gridURLParams.set(this.serviceConstants.PageCurrent, this.gridParams.currentPage);
        gridURLParams.set(this.serviceConstants.Action, '2');

        gridURLParams.set('ServiceDNPremiseRowID', this.getControlValue('ServiceDNPremiseRowID'));
        gridURLParams.set('BranchNumber', this.utils.getBranchCode());
        gridURLParams.set(this.serviceConstants.ContractNumber, this.getControlValue(this.serviceConstants.ContractNumber));
        gridURLParams.set(this.serviceConstants.PremiseNumber, this.getControlValue(this.serviceConstants.PremiseNumber));
        gridURLParams.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        gridURLParams.set('VisitDate', this.getControlValue('VisitDate'));
        gridURLParams.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        gridURLParams.set('ServicePlanNumber', this.getControlValue('ServicePlanNumber'));

        gridURLParams.set('grdServicePlanSequenceNumberRowID', this.riGrid.Details.GetAttribute('grdServicePlanSequenceNumber', 'rowid'));
        gridURLParams.set('grdServicePlanSequenceNumber', this.riGrid.Details.GetValue('grdServicePlanSequenceNumber'));
        gridURLParams.set('grdContractNumberRowID', this.riGrid.Details.GetAttribute('grdContractNumber', 'rowid'));
        gridURLParams.set('grdContractNumber', this.riGrid.Details.GetValue('grdContractNumber'));
        gridURLParams.set('grdPremiseName', this.riGrid.Details.GetValue('grdPremiseName'));
        gridURLParams.set('grdPremiseNameRowID', this.riGrid.Details.GetAttribute('grdPremiseName', 'rowid'));
        gridURLParams.set('grdPremiseLocationDesc', this.riGrid.Details.GetValue('grdPremiseLocationDesc'));
        gridURLParams.set('grdProductCodeRowID', this.riGrid.Details.GetAttribute('grdProductCode', 'rowid'));
        gridURLParams.set('grdProductCode', this.riGrid.Details.GetValue('grdProductCode'));
        gridURLParams.set('grdVisitTypeCode', this.riGrid.Details.GetValue('grdVisitTypeCode'));
        gridURLParams.set('grdServiceVisitFrequency', this.riGrid.Details.GetValue('grdServiceVisitFrequency'));
        gridURLParams.set('grdServicedQuantity', this.riGrid.Details.GetValue('grdServicedQuantity'));
        gridURLParams.set('grdServicedQuantityRowID', this.riGrid.Details.GetAttribute('grdServicedQuantity', 'rowid'));
        gridURLParams.set('grdPlannedEmployeeCode', this.riGrid.Details.GetValue('grdPlannedEmployeeCode'));
        gridURLParams.set('grdPlannedEmployeeCode', this.riGrid.Details.GetValue('grdPlannedEmployeeCode'));

        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridURLParams.set('riSortOrder', sortOrder);
        gridURLParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);

        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.RefreshRequired();

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(
            this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            gridURLParams).subscribe(data => {
                this.gridServiceOnSuccess(data);
            }, error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.displayError(MessageConstant.Message.GeneralError, error);
            });
    }

    private gridServiceOnSuccess(data: any): void {
        let footerRows: Array<any> = [];
        let footerInfo: Array<any> = [];
        let enable: boolean = false;

        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        this.riGrid.Mode = MntConst.eModeNormal;

        if (data.errorMessage) {
            this.displayError(data.errorMessage);
            return;
        }

        this.pageData = data;
        this.gridParams.currentPage = data.pageData ? data.pageData.pageNumber : 1;
        this.gridParams.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
        this.riGrid.Execute(data);

        footerRows = data.footer.rows;
        if (!footerRows || !footerRows.length) {
            return;
        }
        footerInfo = footerRows[0].text.split('|');
        if (footerInfo[1] === GlobalConstant.Configuration.Yes) {
            enable = true;
            this.setControlValue('EmployeeCode', footerInfo[3]);
            this.onEmployeeCodeChange();
        }
        this.enableAccept(enable);
    }

    public onBarcodeChange(): void {
        let barcode: string = this.getControlValue('Barcode');
        let barcodeParts: Array<any>;
        let reportNumber: string;
        let serviceDNPremise: string;
        let serviceDNPremisePage: string;
        let visitDate: any;
        let searchParams: URLSearchParams;
        let formData: any = {};
        if (!barcode) {
            this.clearAllButBarcode();
            this.toggleControls(false);
            return;
        }

        this.clearAllButBarcode();

        barcodeParts = barcode.split('/');
        if (barcodeParts.length < 3) {
            this.riGrid.ResetGrid();
            this.errorService.emitError(this.messages.barcodeError);
            this.enableAccept(false);
            return;
        }

        reportNumber = barcodeParts[0];
        serviceDNPremise = barcodeParts[1];
        serviceDNPremisePage = barcodeParts[2];
        visitDate = barcodeParts[3];

        if (visitDate.length < 8 || isNaN(visitDate)) {
            this.errorService.emitError(this.messages.barcodeDateError);
            this.enableAccept(false);
            return;
        }

        visitDate = moment(visitDate, 'YYYYMMDD', true);

        if (!visitDate.isValid()) {
            this.errorService.emitError(this.messages.barcodeDateError);
            this.enableAccept(false);
            return;
        }

        this.planVisitDate = this.serviceDate = visitDate.toDate();
        visitDate = this.utils.formatDate(visitDate.toDate());
        this.setControlValue('VisitDate', visitDate);
        this.setControlValue('ServiceDate', visitDate);

        this.riGrid.ResetGrid();
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '2');
        formData[this.serviceConstants.Function] = 'GetFromBarcode';
        formData['BranchNumber'] = this.utils.getBranchCode();
        formData['ReportNumber'] = reportNumber;
        formData['ServiceDNPremise'] = serviceDNPremise;
        formData['ServiceDNPremisePage'] = serviceDNPremisePage;
        formData['VisitDate'] = this.getControlValue('VisitDate');

        this.httpService.makePostRequest(this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            searchParams,
            formData).subscribe(data => {
                if (data.errorMessage) {
                    this.clearAllButBarcode();
                    this.displayError(data.errorMessage);
                    this.enableAccept(false);
                    return;
                }
                for (let key in data) {
                    if (!key) {
                        continue;
                    }
                    this.setControlValue(key, data[key]);
                }
                this.toggleControls(true);
                this.loadGridData();
            }, error => {
                this.displayError(MessageConstant.Message.GeneralError, error);
                this.clearAllButBarcode();
                this.toggleControls(false);
            });
    }

    public onBarcodeOkChange(): void {
        let barcodeOk: string = this.getControlValue('BarcodeOK');
        if (!barcodeOk) {
            return;
        }

        if (barcodeOk !== 'OK/') {
            this.errorService.emitError(this.messages.barcodeOkInvalidError);
            this.setControlValue('BarcodeOK', '');
            return;
        }

        if (!this.gridParams.totalRecords) {
            this.displayError(this.messages.gridNotLoadedError);
            return;
        }

        this.acceptAll();
    }

    public acceptAll(): void {
        let searchParams: URLSearchParams;
        let formData: any = {};
        if (!this.hasNoError('EmployeeCode') && !this.hasNoError('ServiceDate')) {
            this.displayError(this.messages.gridNotLoadedError);
            return;
        }

        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '6');

        formData[this.serviceConstants.Function] = 'ValidateInputData';
        formData['EmployeeCode'] = this.getControlValue('EmployeeCode');
        formData['ServiceDate'] = this.getControlValue('ServiceDate');

        this.httpService.makePostRequest(this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            searchParams,
            formData).subscribe(data => {
                if (data.errorMessage) {
                    this.displayError(data.errorMessage);
                    return;
                }
                this.createServiceVisits = true;
                this.loadGridData();
            }, error => {
                this.displayError(MessageConstant.Message.GeneralError, error);
            });
    }

    private fetchTranslatedContent(): void {
        this.getTranslatedValue(this.messages.barcodeError, null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.messages.barcodeError = res;
                }
            });
        });
        this.getTranslatedValue(this.messages.barcodeDateError, null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.messages.barcodeDateError = res;
                }
            });
        });
        this.getTranslatedValue(this.messages.barcodeOkInvalidError, null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.messages.barcodeOkInvalidError = res;
                }
            });
        });
        this.getTranslatedValue(this.messages.gridNotLoadedError, null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.messages.gridNotLoadedError = res;
                }
            });
        });
    }

    private clearAllButBarcode(): void {
        this.clearControls(['Barcode']);
        this.serviceDate = null;
        this.planVisitDate = null;
        this.riGrid.ResetGrid();
        this.acceptAllDisabled = true;
        this.showAcceptedLabel = false;
    }

    public toggleControls(disable: boolean): void {
        this.disableControl('BranchServiceAreaCode', disable);
        this.disableControl('ServicePlanNumber', disable);
        this.disableControl('ContractNumber', disable);
        this.disableControl('PremiseNumber', disable);
        this.visitDatepicker.isDisabled = disable;
    }

    private keyFieldChanged(): void {
        this.setControlValue('Barcode', '');
        this.setControlValue('BarcodeOK', '');
        this.setControlValue('ServiceDNPremiseRowID', '');
        this.disableControl('BarcodeOK', false);
        this.disableControl('EmployeeCode', false);
        this.serviceDatepicker.isDisabled = false;
        this.employeeCodeDisabled = false;
        this.showAcceptedLabel = false;
        this.riGrid.ResetGrid();
    }
}
