import { GlobalizeService } from './../../../shared/services/globalize.service';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import * as moment from 'moment';
import { PremiseSearchComponent } from './../search/iCABSAPremiseSearch';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GenericActionTypes } from './../../actions/generic';
import { Component, NgZone, OnInit, ViewChild, ElementRef, Renderer, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Injector } from '@angular/core';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { QueryParametersCallback, ErrorCallback } from '../../../app/base/Callback';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';

@Component({
    selector: 'icabs-recomendation-grid-search',
    templateUrl: 'iCABSARecommendationGrid.html',
    styles: [`
        :host /deep/ .max-col-class-8 .gridtable thead tr:nth-child(2) th:nth-child(1) {
            width: 7%;
        }
        :host /deep/ .max-col-class-8 .gridtable thead tr:nth-child(2) th:nth-child(2) {
            width: 9%;
        }
        :host /deep/ .max-col-class-8 .gridtable thead tr:nth-child(2) th:nth-child(3) {
            width: 14%;
        }
        :host /deep/ .max-col-class-8 .gridtable thead tr:nth-child(2) th:nth-child(4) {
            width: 14%;
        }
        :host /deep/ .max-col-class-8 .gridtable thead tr:nth-child(2) th:nth-child(5) {
            width: 7%;
        }
        :host /deep/ .max-col-class-8 .gridtable thead tr:nth-child(2) th:nth-child(7) {
            width: 9%;
        }
        :host /deep/ .max-col-class-8 .gridtable thead tr:nth-child(2) th:nth-child(8) {
            width: 9%;
        }

        :host /deep/ .max-col-class-8 .gridtable tbody tr td:nth-child(1) input{
            text-align: center;
        }
        :host /deep/ .max-col-class-8 .gridtable tbody tr td:nth-child(2) input{
            text-align: left;
        }
        :host /deep/ .max-col-class-8 .gridtable tbody tr td:nth-child(3) div{
            text-align: left;
        }
        :host /deep/ .max-col-class-8 .gridtable tbody tr td:nth-child(6) input{
            text-align: left;
        }
        :host /deep/ .max-col-class-8 .gridtable tbody tr td:nth-child(7) input{
            text-align: left;
        }
        :host /deep/ .max-col-class-8 .gridtable tbody tr td:nth-child(8) input{
            text-align: center;
        }


        :host /deep/ .max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(1) {
            width: 10%;
        }
        :host /deep/ .max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(1).premise {
            width: 7%;
        }
        :host /deep/ .max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(2) {
            width: 14%;
        }
        :host /deep/ .max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(3) {
            width: 14%;
        }
        :host /deep/ .max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(4) {
            width: 7%;
        }
        :host /deep/ .max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(6) {
            width: 10%;
        }
        :host /deep/ .max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(7) {
            width: 10%;
        }

        :host /deep/ .max-col-class-7 .gridtable tbody tr td:nth-child(1) input{
            text-align: left;
        }
        :host /deep/ .max-col-class-7 .gridtable tbody tr td:nth-child(1) input.premise{
            text-align: center;
        }
        :host /deep/ .max-col-class-7 .gridtable tbody tr td:nth-child(2) div{
            text-align: left;
        }
        :host /deep/ .max-col-class-7 .gridtable tbody tr td:nth-child(5) input{
            text-align: left;
        }
        :host /deep/ .max-col-class-7 .gridtable tbody tr td:nth-child(6) input{
            text-align: left;
        }
        :host /deep/ .max-col-class-7 .gridtable tbody tr td:nth-child(7) input{
            text-align: center;
        }

        :host /deep/ .max-col-class-6 .gridtable thead tr:nth-child(2) th:nth-child(1) {
            width: 12%;
        }
        :host /deep/ .max-col-class-6 .gridtable thead tr:nth-child(2) th:nth-child(2) {
            width: 12%;
        }
        :host /deep/ .max-col-class-6 .gridtable thead tr:nth-child(2) th:nth-child(3) {
            width: 7%;
        }
        :host /deep/ .max-col-class-6 .gridtable thead tr:nth-child(2) th:nth-child(5) {
            width: 10%;
        }
        :host /deep/ .max-col-class-6 .gridtable thead tr:nth-child(2) th:nth-child(6) {
            width: 10%;
        }

        :host /deep/ .max-col-class-6 .gridtable tbody tr td:nth-child(1) div{
            text-align: left;
        }
        :host /deep/ .max-col-class-6 .gridtable tbody tr td:nth-child(4) input{
            text-align: left;
        }
        :host /deep/ .max-col-class-6 .gridtable tbody tr td:nth-child(5) input{
            text-align: left;
        }
        :host /deep/ .max-col-class-6 .gridtable tbody tr td:nth-child(6) input{
            text-align: center;
        }
    `]
})

export class RecommendationGridComponent extends BaseComponent
    implements OnInit, ErrorCallback, QueryParametersCallback, AfterViewInit {
    // get parameter from HTML view
    @ViewChild('topContainer') container: ElementRef;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('recommendationGrid') recommendationGrid: GridComponent;
    @ViewChild('recommendationPagination') recommendationPagination: PaginationComponent;
    @ViewChild('ProductEllipsis') ProductEllipsis: EllipsisComponent;

    // Local page variable
    public pageHeader: string = 'Contract';
    public pageTitle: string = 'Service Recommendations';;

    public backLinkText: string = '';
    public showBackLabel: boolean = false;
    public currentContractType: string;
    public currentContractTypeLabel: string;
    public serviceTitle: string;
    public isRequesting: boolean = false;

    public dt: Date = new Date();
    public dtServiceDateFrom: string;
    public dtServiceDateTo: string;
    public ServiceDateTo: Date = new Date();
    public ServiceDateFrom: Date = new Date();
    public isServiceDateFromDisabled: boolean;
    public isServiceDateToDisabled: boolean;
    public validateProperties: Array<any> = [];
    public dateObjectsEnabled: Object = {
        ServiceDateFrom: false,
        ServiceDateTo: false
    };

    public filterList: Array<any> = [
        { name: 'All', value: 'All' },
        { name: 'Actioned', value: 'Actioned' },
        { name: 'Unactioned', value: 'Unactioned' }
    ];
    public gridSortHeaders: Array<any> = [];

    public showErrorHeader: string; // Store ErrorMessage
    public storeData: any; // to store Data from ngStore using storeSubscription
    public recommendationData: any; // to Data from ContractStore
    public searchParams: any; // to store dynamic API search params in query string

    // Dynamis ShowHide form fields
    public labelContractNumber: string = 'Contract';
    public trPremise: boolean = true;
    public trProduct: boolean = true;
    public trFilter: boolean = true;
    public viewEmployeeCode: boolean = false;
    public viewPDAVisitRef: boolean = false;
    public showCloseButton: boolean = true;
    public premiseSearchComponent: any;
    public showHeader: boolean = true;
    public inputParamsAccountPremise: any = {
        'parentMode': 'LookUp',
        'pageTitle': 'Premise Search',
        'currentContractType': 'C',
        'ContractNumber': ''
    };
    public inputParamsProductCode: any = {
        'parentMode': 'LookUp-Freq',
        'ContractNumber': '',
        'ContractName': '',
        'PremiseNumber': '',
        'PremiseName': ''
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    // call ellipsis child page
    public productComponent = ServiceCoverSearchComponent;
    public premiseComponent = '';

    //Grid bulding parameters
    public itemsPerPage: number;
    public currentPage: number;
    public maxColumn: number;
    public totalItems: string;
    public pageId: string = '';
    public headerClicked: string = '';
    public sortType: string = '';
    public rowId = '';
    public pattern = /^[a-zA-Z0-9]+(([\'\,\.\-_ \/)(:][a-zA-Z0-9_ ])?[a-zA-Z0-9_ .]*)*$/;
    // parameters for webservice API call
    public search: URLSearchParams = new URLSearchParams();
    public queryParams: any = {
        operation: 'Application/iCABSARecommendationGrid',
        module: 'pda',
        method: 'service-delivery/maintenance',
        contentType: 'application/x-www-form-urlencoded'
    };
    public controls = [
        { name: 'ContractNumber', readonly: false, disabled: false, required: false },
        { name: 'ContractName', readonly: false, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
        { name: 'PremiseName', readonly: false, disabled: false, required: false },
        { name: 'ProductCode', readonly: false, disabled: false, required: false },
        { name: 'ProductDesc', readonly: false, disabled: false, required: false },
        { name: 'EmployeeCode', readonly: false, disabled: false, required: false },
        { name: 'PDAVisitRef', readonly: false, disabled: false, required: false },
        { name: 'ShowType', readonly: false, disabled: false, required: false },
        { name: 'ServiceDateFrom', readonly: false, disabled: false, required: false },
        { name: 'ServiceDateTo', readonly: false, disabled: false, required: false, value: this.filterList[0].value }
    ];

    constructor(injector: Injector, public renderer: Renderer, public elRef: ElementRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSARECOMMENDATIONGRID;
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
    }

    /**
     * Implement callback methods
     */
    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public getURLQueryParameters(param: any): void {
        if (param['parentMode']) {
            this.pageParams.ParentMode = param['parentMode'];
            this.pageParams.ContractNumber = param['ContractNumber'];
            this.pageParams.ContractName = param['ContractName'];
            this.pageParams.PremiseNumber = param['PremiseNumber'];
            this.pageParams.PremiseName = param['PremiseName'];
            this.pageParams.ProductCode = param['ProductCode'];
            this.pageParams.ProductDesc = param['ProductDesc'];
            this.pageParams.PDAVisitRef = param['PDAVisitRef'];
            this.pageParams.EmployeeCode = param['EmployeeCode'];
            this.pageParams.ServiceDateFrom = param['ServiceDateFrom'];
            this.pageParams.ServiceDateTo = param['ServiceDateTo'];

            this.inputParamsProductCode = {
                'parentMode': 'LookUp-Freq',
                'ContractNumber': param['ContractNumber'],
                'ContractName': param['ContractName'],
                'PremiseNumber': param['PremiseNumber'],
                'PremiseName': param['PremiseName']
            };
            if (this.pageParams.ParentMode === 'Summary') {
                this.pageParams.ServiceDateFrom = param['ServiceDateStart'];
                this.pageParams.ServiceDateTo = param['ServiceDateStart'];
            }
            this.pageParams.currentContractType = param['currentContractType'];
            this.pageParams.BackLabel = param['backLabel'];
            this.store.dispatch({
                type: GenericActionTypes.SAVE_RECOMMENDATION_DATA, payload: this.pageParams
            });
        } else {
            this.pageParams = this.recommendationData;
        }
    }

    public setCurrentContractType(): void {
        this.currentContractType = this.riExchange.getCurrentContractType();
        this.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.setCurrentContractType();
        this.inputParamsAccountPremise.currentContractType = this.currentContractType;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.setControlValue('ShowType', 'All');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.storeSubscription = this.store.select('generic').subscribe(data => {
            this.recommendationData = data['recommendation_data'];
        });

        this.componentInteractionService.emitMessage(false);
        this.errorService.emitError(0);
        // grid building property assign
        this.itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
        this.currentPage = 1;
        this.maxColumn = 8;
        this.setPageTitle();
        this.setFormData();
        this.buildGrid();
        setTimeout(() => {
            this.backLinkText = GlobalConstant.Configuration.BackText;
        }, 0);

        this.inputParamsAccountPremise['ContractNumber'] = this.getControlValue('ContractNumber');
        this.inputParamsAccountPremise['ContractName'] = this.getControlValue('ContractName');

    };

    ngAfterViewInit(): void {
        this.setWindowTitle();
    }

    public setPageTitle(): void {
        switch (this.parentMode) {
            case 'Contract':
                this.pageHeader = this.currentContractTypeLabel;
                break;
            case 'Premise':
                this.pageHeader = 'Premises';
                break;
            case 'ServiceCover':
            case 'CallCentreSearch':
                this.pageHeader = 'Service Cover';
                break;
            default:
                break;
        }

        this.labelContractNumber = this.currentContractTypeLabel;
    }

    public setWindowTitle(): void {
        this.getTranslatedValuesBatch((data: any) => {
            if (data) {
                let pageTitle = data[0] + ' - ' + data[1];
                this.utils.setTitle(pageTitle);
            }
        },
            [this.pageHeader],
            ['Service Recommendations']);
    }


    public setFormData(): void {
        if (this.pageParams.PremiseNumber) {
            this.trPremise = true;
            this.uiForm.controls['PremiseNumber'].disable();
        }

        if (this.pageParams.ProductCode) {
            this.trProduct = true;
            this.uiForm.controls['ProductCode'].disable();
        }

        if (this.pageParams) {
            if (this.pageParams.ContractNumber) {
                if (this.pageParams.ParentMode === 'TechWorkSummary') {
                    let strContractType: string[];
                    strContractType = this.pageParams.ContractNumber.split('/');
                    this.uiForm.controls['ContractNumber'].setValue(strContractType[1]);
                } else {
                    this.uiForm.controls['ContractNumber'].setValue(this.pageParams.ContractNumber);
                }
            }
            if (this.pageParams.ContractName) {
                this.uiForm.controls['ContractName'].setValue(this.pageParams.ContractName);
            }
            if (this.pageParams.PremiseNumber) {
                this.uiForm.controls['PremiseNumber'].setValue(this.pageParams.PremiseNumber);
            }
            if (this.pageParams.PremiseName) {
                this.uiForm.controls['PremiseName'].setValue(this.pageParams['PremiseName']);
            }
            if (this.pageParams['ProductCode']) {
                this.uiForm.controls['ProductCode'].setValue(this.pageParams['ProductCode']);
            }
            if (this.pageParams['ProductDesc']) {
                this.uiForm.controls['ProductDesc'].setValue(this.pageParams['ProductDesc']);
            }
            if (this.pageParams['PDAVisitRef']) {
                this.uiForm.controls['PDAVisitRef'].setValue(this.pageParams['PDAVisitRef']);
            }
            if (this.pageParams['EmployeeCode']) {
                this.uiForm.controls['EmployeeCode'].setValue(this.pageParams['EmployeeCode']);
            }
            if (this.pageParams['ServiceDateFrom']) {
                this.dtServiceDateFrom = this.globalize.parseDateToFixedFormat(this.pageParams['ServiceDateFrom']).toString();
                this.ServiceDateFrom = new Date(this.dtServiceDateFrom);
            } else {
                this.ServiceDateFrom = new Date(new Date().setFullYear(this.dt.getFullYear() - 1));
                this.dtServiceDateFrom = this.globalize.parseDateToFixedFormat(this.ServiceDateFrom).toString();
            }
            if (this.pageParams['ServiceDateTo']) {
                this.dtServiceDateTo = this.globalize.parseDateToFixedFormat(this.pageParams['ServiceDateTo']).toString();
                this.ServiceDateTo = new Date(this.dtServiceDateTo);
            } else {
                this.ServiceDateTo = new Date();
                this.dtServiceDateTo = this.globalize.parseDateToFixedFormat(this.ServiceDateTo).toString();
            }
        }
        this.applyGridFilter();
    }

    public onPremiseSearchDataReceived(data: any): void {
        if (data) {
            this.setControlValue('PremiseNumber', data.PremiseNumber);
            this.setControlValue('PremiseName', data.PremiseName);
            this.inputParamsProductCode.PremiseNumber = data.PremiseNumber;
            this.inputParamsProductCode.PremiseName = data.PremiseName;
            if (this.uiForm.controls['PremiseNumber'].value === '') {
                this.inputParamsProductCode.PremiseNumber = '';
                this.inputParamsProductCode.PremiseName = '';
                this.ProductEllipsis.updateComponent();
            }
            this.recommendationGrid.clearGridData();
            this.applyGridFilter();
        }
    }
    public onProductSearchDataReceived(data: any): void {
        if (data) {
            this.setControlValue('ProductCode', data.ProductCode);
            this.setControlValue('ProductDesc', data.ProductDesc);
            this.recommendationGrid.clearGridData();
            this.applyGridFilter();
        }
    }

    public serviceDateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.dtServiceDateFrom = this.globalize.parseDateToFixedFormat(value.value).toString();
        } else {
            this.dtServiceDateFrom = '';
        }
    }

    public serviceDateToSelectedValue(value: any): void {
        if (value && value.value) {
            this.dtServiceDateTo = this.globalize.parseDateToFixedFormat(value.value).toString();
        } else {
            this.dtServiceDateTo = '';
        }
    }

    public formatDate(date: Date): any {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    }

    public setPostData(): any {
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        this.search.set('EmployeeCode', this.uiForm.controls['EmployeeCode'].value);
        this.search.set('ShowType', this.uiForm.controls['ShowType'].value ? this.uiForm.controls['ShowType'].value : 'All');
        this.search.set('serviceDateFrom', this.dtServiceDateFrom);
        this.search.set('serviceDateTo', this.dtServiceDateTo);
    }

    public applyGridFilter(): void {
        let pIndex, pdIndex, sIndex;
        this.gridSortHeaders = [];

        if (!this.uiForm.controls['PremiseNumber'].value) {
            pIndex = 0;
        }
        if (!this.uiForm.controls['ProductCode'].value) {
            pdIndex = (pIndex === 0) ? 1 : 0;
        }

        if (pIndex === 0 && pdIndex === 1) sIndex = 6;
        else if (pIndex === 0 || pdIndex === 0) sIndex = 5;
        else sIndex = 4;

        if (!this.uiForm.controls['PremiseNumber'].value) {
            let obj = {
                'fieldName': 'GridPremiseNumber',
                'index': pIndex,
                'sortType': 'ASC'
            };
            this.gridSortHeaders.push(obj);
        }
        if (!this.uiForm.controls['ProductCode'].value) {
            let obj = {
                'fieldName': 'GridProductCode',
                'index': pdIndex,
                'sortType': 'ASC'
            };
            this.gridSortHeaders.push(obj);
        }

        let obj = {
            'fieldName': 'Actioned',
            'index': sIndex,
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(obj);
    }
    public buildGrid(): void {
        if (this.uiForm.controls['PremiseNumber'].value &&
            !this.pattern.test(this.uiForm.controls['PremiseNumber'].value)) {
            let data1 = { errorMessage: MessageConstant.Message.NoSpecialCharecter };
            this.errorModal.show(data1, true);
        } else {
            this.search = new URLSearchParams();
            this.setPostData();
            this.search.set(this.serviceConstants.Action, '2');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

            // set grid building parameters
            this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
            this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
            this.search.set(this.serviceConstants.GridMode, '0');
            this.search.set(this.serviceConstants.GridHandle, '398282');
            this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
            this.search.set(this.serviceConstants.GridSortOrder, this.sortType);
            this.setMaxColumns();
            this.queryParams.search = this.search;
            this.recommendationGrid.loadGridData(this.queryParams, this.rowId);
            this.rowId = '';
        }

    }

    getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.search.set('PageCurrent', String(this.currentPage));
        this.buildGrid();
    }

    public getGridInfo(info: any): void {
        setTimeout(() => {
            if (!this.uiForm.controls['PremiseNumber'].value && this.uiForm.controls['ProductCode'].value) {
                let elHead = this.elRef.nativeElement.querySelector('.max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(1)');
                let elBody = this.elRef.nativeElement.querySelectorAll('.max-col-class-7 .gridtable tbody tr td:nth-child(1) input');
                if (elHead) this.renderer.setElementClass(elHead, 'premise', true);
                if (elBody) {
                    for (let i = 0; i < elBody.length; i++) {
                        this.renderer.setElementClass(elBody[i], 'premise', true);
                    }
                }
            }
        }, 500);

        this.recommendationPagination.totalItems = info.totalRows;
    }

    public onGridRowClick(event: any): void {
        this.attributes.Row = event.rowIndex;
        if (event.columnClicked.fieldName) {
            switch (event.columnClicked.fieldName) {
                case 'GridPremiseNumber':
                    if (!this.getControlValue('PremiseNumber')) {
                        this.attributes.PremiseRowID = event.cellData.rowID;
                    }
                    this.navigate('Summary', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE);
                    break;
                case 'GridProductCode':
                    this.attributes.ServiceCoverRowID = event.cellData.rowID;
                    this.navigate('Summary', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE);
                    break;
                case 'Actioned':
                    this.rowId = event.cellData.rowID;
                    this.cycleThroughStatuses(event.cellData.rowID);
                    break;
            }
        } else {
            if (event.cellIndex) {
                this.attributes.ServiceVisitRecommendationRowID = event.cellData.rowID;
                //this.navigate('Summary', 'maintenance/iCABSSeServiceVisitRecommendationMaintenance');
            }
        }
    }

    public cycleThroughStatuses(rowID: string): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set('Function', 'Actioned');
        this.search.set('Rowid', rowID);
        this.search.set(this.serviceConstants.MethodType, 'maintenance');

        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
            .subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e) {
                        this.buildGrid();
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
            );
    }

    public sortGrid(data: any): void {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    }

    public onChangeShow(event: any): void {
        //Nothing to do now
    }

    public refresh(): void {
        this.currentPage = 1;
        this.headerClicked = '';
        this.sortType = '';
        this.applyGridFilter();
        this.buildGrid();
    }

    private getProductDesc(): void {
        if (this.uiForm.controls['PremiseNumber'].value &&
            !this.pattern.test(this.uiForm.controls['PremiseNumber'].value)) {
            let data1 = { errorMessage: MessageConstant.Message.NoSpecialCharecter };
            this.errorModal.show(data1, true);
        } else {
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set('Function', 'SetDisplayFields');
            this.search.set(this.serviceConstants.MethodType, 'maintenance');
            if (this.uiForm.controls['PremiseNumber'].value === '') {
                this.inputParamsProductCode.PremiseNumber = '';
                this.inputParamsProductCode.PremiseName = '';
                this.ProductEllipsis.updateComponent();
            }
            if (this.uiForm.controls['ContractNumber'].value) {
                this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
                this.inputParamsProductCode.ContractNumber = this.uiForm.controls['ContractNumber'].value;
                this.inputParamsProductCode.ContractName = this.uiForm.controls['ContractName'].value;
            }
            if (this.uiForm.controls['PremiseNumber'].value) {
                this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
            }
            if (this.uiForm.controls['ProductCode'].value) {
                this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
            }

            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
                .subscribe(
                (e) => {
                    if (e.status === 'failure') {
                        this.errorService.emitError(e.oResponse);
                    } else {
                        if (e) {
                            if (e.errorMessage) {
                                this.errorService.emitError(e);
                                return;
                            }
                            if (e.ContractNumber) {
                                this.uiForm.controls['ContractNumber'].setValue(e.ContractNumber);
                                this.inputParamsProductCode.PremiseNumber = e.ContractNumber;
                            }
                            if (e.ContractName) {
                                this.uiForm.controls['ContractName'].setValue(e.ContractName);
                                this.inputParamsProductCode.PremiseName = e.ContractName;
                            }
                            if (e.PremiseNumber && e.PremiseNumber !== '0') {
                                this.uiForm.controls['PremiseNumber'].setValue(e.PremiseNumber);
                                this.inputParamsProductCode.PremiseNumber = e.PremiseNumber;

                            }
                            if (e.PremiseName) {
                                this.uiForm.controls['PremiseName'].setValue(e.PremiseName);
                                this.inputParamsProductCode.PremiseName = e.PremiseName;
                            }
                            if (e.ProductCode) {
                                this.uiForm.controls['ProductCode'].setValue(e.ProductCode.toUpperCase());
                            }
                            if (e.ProductDesc) {
                                this.uiForm.controls['ProductDesc'].setValue(e.ProductDesc);
                            }
                            this.recommendationGrid.clearGridData();
                            this.applyGridFilter();
                        }
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                }
                );
        }
    }

    private setMaxColumns(): void {
        let count = 6;
        let col = 0;

        if (!this.uiForm.controls['ContractNumber'].value) {
            count++;
            this.validateProperties.push({
                'type': MntConst.eTypeText,
                'index': col,
                'align': 'center'
            });
            col++;
        }

        if (!this.uiForm.controls['PremiseNumber'].value || this.uiForm.controls['PremiseNumber'].value === '0') {
            count++;
            this.validateProperties.push({
                'type': MntConst.eTypeText,
                'index': col,
                'align': 'center'
            });
            col++;
        }
        if (!this.uiForm.controls['ProductCode'].value) {
            count++;
            this.validateProperties.push({
                'type': MntConst.eTypeCode,
                'index': col,
                'align': 'center'
            });
            col++;
        }
        this.validateProperties.push({
            'type': MntConst.eTypeTextFree,
            'index': col,
            'align': 'center'
        });
        col++;
        this.validateProperties.push({
            'type': MntConst.eTypeDate,
            'index': col,
            'align': 'center'
        });
        col++;
        this.validateProperties.push({
            'type': MntConst.eTypeCode,
            'index': col,
            'align': 'center'
        });
        col++;
        this.validateProperties.push({
            'type': MntConst.eTypeTextFree,
            'index': col,
            'align': 'center'
        });
        col++;
        this.validateProperties.push({
            'type': MntConst.eTypeText,
            'index': col,
            'align': 'center'
        });
        col++;
        this.validateProperties.push({
            'type': MntConst.eTypeDate,
            'index': col,
            'align': 'center'
        });
        this.maxColumn = count;

    }


    public onPremiseBlur(): void {
        this.uiForm.controls['PremiseName'].setValue('');
        if (this.uiForm.controls['PremiseNumber'].value === '') {
            this.inputParamsProductCode.PremiseNumber = '';
            this.inputParamsProductCode.PremiseName = '';
        }
        if (this.uiForm.controls['PremiseNumber'].value && this.uiForm.controls['PremiseNumber'].value !== '0') {
            this.getProductDesc();
        }
        this.recommendationGrid.clearGridData();
    }

    public onProductCodeBlur(): void {
        this.uiForm.controls['ProductDesc'].setValue('');
        if (this.uiForm.controls['ProductCode'].value && this.uiForm.controls['ProductCode'].value !== '0') {
            this.getProductDesc();
        }
        this.recommendationGrid.clearGridData();
    }

    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }

    public getMaxColClass(): string {
        return 'max-col-class-' + this.maxColumn;
    }
}
