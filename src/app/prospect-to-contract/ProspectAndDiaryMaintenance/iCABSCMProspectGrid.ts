import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { Subscription } from 'rxjs/Subscription';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { EmployeeSearchComponent } from '../../internal/search/iCABSBEmployeeSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { Observable } from 'rxjs/Rx';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSCMProspectGrid.html',
    styles: [`
    :host /deep/ .gridtable tbody tr:hover {
         background-color: rgba(76, 157, 222, 0.75);
    } 
  `]
})


export class ProspectGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('prospectGrid') prospectGrid: GridComponent;
    @ViewChild('prospectGridPagination') prospectGridPagination: PaginationComponent;
    @ViewChild('valueSelectDropdown') valueSelectDropdown: DropdownStaticComponent;
    @ViewChild('byViewOptionSelectDropdown') byViewOptionSelectDropdown: DropdownStaticComponent;
    @ViewChild('stageOptionSelectDropdown') stageOptionSelectDropdown: DropdownStaticComponent;
    @ViewChild('statusOptionSelectDropdown') statusOptionSelectDropdown: DropdownStaticComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('fromDateChild') fromDateChild: DatepickerComponent;
    @ViewChild('toDateChild') toDateChild: DatepickerComponent;

    public queryParams: any = {
        operation: 'ContactManagement/iCABSCMProspectGrid',
        module: 'prospect',
        method: 'prospect-to-contract/maintenance'
    };
    public pageId: string = '';
    public headerClickedColumn: string = '';
    public riSortOrder: string = '';
    public gridSortHeaders: Array<any> = [];
    public headerProperties: Array<any> = [];
    private stageAll: Array<any> = [];
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 22;
    public showTotalRow: boolean = true;
    public search = new URLSearchParams();
    public autoOpen: any = '';
    public autoOpenSearch: boolean = false;
    private riGrid: any = {};
    public showHeader: boolean = true;
    public currentContractType: string = '';
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public isEmployeeSearchEllipsisDisabled: boolean = false;
    public inputParamsEmployeeSearch: any = { 'parentMode': 'LookUp' };
    public employeeSearchComponent = EmployeeSearchComponent;
    public valueOptions: Array<any> = [{}];
    public byViewOptions: Array<any> = [{}];
    public stageOptions: Array<any> = [{ value: '', text: 'All' }];
    public statusOptions: Array<any> = [{}];
    public searchModalRoute: string = '';
    public searchPageRoute: string = '';
    public showCloseButton: boolean = true;
    public showErrorHeader: boolean = false;
    public showMessageHeader: boolean = false;
    public promptTitle: boolean = false;
    public promptContent: boolean = false;
    public isRequesting: boolean = false;
    public contractSearchComponent = ContractSearchComponent;
    private lookUpSubscription: Subscription;
    public valueOptionsDisabled: boolean = false;
    public ByViewOptionsDisabled: boolean = false;
    public stageOptionsDisabled: boolean = false;
    public statusOptionsDisabled: boolean = false;
    public fieldRequired: any = {
        FromDate: true,
        ToDate: true
    };
    public defaultFromdate: any;
    public defaultToDate: any;
    public validateProperties: Array<any> = [];

    public controls = [
        { name: 'ProspectNo', readonly: true, disabled: false, required: false, value: '', type: MntConst.eTypeInteger },
        { name: 'ByValue', readonly: true, disabled: false, required: false, value: '' },
        { name: 'EmployeeCode', readonly: true, disabled: false, required: false, value: '', commonValidator: true, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', readonly: true, disabled: true, required: false, value: '', type: MntConst.eTypeText },
        { name: 'ValueBy', readonly: true, disabled: false, required: false, value: '' },
        { name: 'ViewBy', readonly: true, disabled: false, required: false, value: '' },
        { name: 'StatusSelect', readonly: true, disabled: false, required: false, value: '' },
        { name: 'ProspectStatus', readonly: true, disabled: false, required: false, value: '' },
        { name: 'FromDate', readonly: true, disabled: false, required: false, value: '' },
        { name: 'ToDate', readonly: true, disabled: false, required: false, value: '' }
    ];

    constructor(injector: Injector, private ls: LocalStorageService) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMPROSPECTGRID;
    }

    /**
     * Initialize data and functions at the time of window_onload
     */
    private initData(): void {
        this.pageTitle = 'Contact Management - Prospect';
        this.createOptions();
        this.getProspectList();
    }
    /**
     * Create all dropdown
     */
    public createOptions(): void {
        this.valueOptions = [
            { text: 'Full', value: 'full' },
            { text: 'Weighted', value: 'weighted' }
        ];
        this.byViewOptions = [
            { text: 'Created', value: 'created' },
            { text: 'Closed', value: 'closed' }
        ];
        this.statusOptions = [
            { text: 'All', value: '' },
            { text: 'Open', value: 'open' },
            { text: 'Closed', value: 'closed' }
        ];
    }

    private getProspectList(): void {
        this.isRequesting = true;
        let cProspectStatusCode: string, cProspectStatusDesc: string, cProspectStatusCodeList: string, cProspectStatusDescList: string, lIncludedConverted: boolean;
        lIncludedConverted = false;
        let requestParam = [{
            'table': 'ProspectStatus',
            'query': {
                'BusinessCode': this.utils.getBusinessCode()
            },
            'fields': ['ProspectStatusCode', 'ProspectStatusSystemDesc']
        }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(requestParam).subscribe((data) => {
            this.stageAll = [];
            let observableBatch: Array<any> = [];
            for (let prospect of data[0]) {
                if (prospect.ProspectStatusCode === '02' || prospect.ProspectStatusCode === '03' || prospect.ProspectStatusCode === '04') {
                    if (lIncludedConverted === false) {
                        let convertedOption: any = {};
                        convertedOption['ProspectStatusCode'] = '-99';
                        convertedOption['ProspectStatusSystemDesc'] = 'Converted';
                        this.stageAll.push(convertedOption);
                        lIncludedConverted = true;
                    }
                } else {
                    this.stageAll.push(prospect);
                }
            }
            for (let p of this.stageAll) {
                observableBatch.push(this.getProspectLanguage(p));

            }
            Observable.forkJoin(
                observableBatch).subscribe((e) => {
                    let newStageOption: any = {}, lngth: number = 0;
                    lngth = e.length;
                    for (let i = 0; i < lngth; i++) {
                        if (e[i]['results'][0][0]) {
                            newStageOption['value'] = e[i]['results'][0][0].ProspectStatusCode;
                            newStageOption['text'] = e[i]['results'][0][0].ProspectStatusDesc;
                        } else {
                            newStageOption['value'] = this.stageAll[i].ProspectStatusCode;
                            newStageOption['text'] = this.stageAll[i].ProspectStatusSystemDesc;
                        }
                        this.stageOptions.push(JSON.parse(JSON.stringify(newStageOption)));
                    }
                    this.isRequesting = false;
                });
        });
    }

    private getProspectLanguage(prospect: any): any {
        let requestParam = [{
            'table': 'ProspectStatusLang',
            'query': {
                'ProspectStatusCode': prospect.ProspectStatusCode,
                'LanguageCode': this.riExchange.LanguageCode()
            },
            'fields': ['ProspectStatusCode', 'ProspectStatusDesc']
        }
        ];

        return this.lookUpRecord(requestParam, 0);
    }
    public lookUpRecord(data: any, maxresults: any): any {
        let queryLookUp: any = new URLSearchParams();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(queryLookUp, data);
    }

    /**
     * Change method for value option
     */
    public valueOptionsChange(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ByValue', data);
    }

    /**
     * Change method for value option
     */
    public byviewOptionsChange(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewBy', data);
    }
    /**
     * Change method for value option
     */
    public stageOptionsChange(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'StatusSelect', data);
    }
    /**
     * Change method for value option
     */
    public statusptionsChange(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectStatus', data);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProspectStatus') === 'open') {
            this.fieldRequired.FromDate = false;
            this.fieldRequired.ToDate = false;

        } else {
            this.fieldRequired.FromDate = true;
            this.fieldRequired.ToDate = true;
        }
    }
    /**
     * Date change method
     */
    public fromDateSelectedValue(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'FromDate', data.value);
    }
    /**
     * Date change method
     */
    public toDateSelectedValue(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ToDate', data.value);
    }

    public employeeCodeChange(): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode') !== '') {
            let postData = {};
            postData['PostDesc'] = 'EmployeeCode';
            postData['EmployeeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode');
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                (data) => {
                    try {
                        if (data.errorMessage) {
                            this.errorModal.show(data, true);
                        } else {
                            if (data.EmployeeSurname) {
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', data.EmployeeSurname);
                            }
                        }

                    } catch (error) {
                        this.logger.warn(error);
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', '');
        }

    }
    /**
     * Setting empoyeecode from look up call
     */
    public onAssignEmployeeDataReceived(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', data.EmployeeCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', data.EmployeeSurname);
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.initData();
    }

    ngOnDestroy(): void {
        this.lookUpSubscription.unsubscribe();
        super.ngOnDestroy();
    }


    private buildGrid(allowGridRefresh?: boolean): void {
        this.fromDateChild.validateDateField();
        this.toDateChild.validateDateField();
        if (((this.uiForm.controls['FromDate'].value && this.uiForm.controls['ToDate'].value) || this.riExchange.riInputElement.GetValue(this.uiForm, 'ProspectStatus') === 'open') || allowGridRefresh === true) {
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '2');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            //set parameters
            this.search.set('FromDate', this.uiForm.controls['FromDate'].value);
            this.search.set('ToDate', this.uiForm.controls['ToDate'].value);
            this.search.set('ViewBy', this.uiForm.controls['ViewBy'].value);
            this.search.set('ValueBy', this.uiForm.controls['ByValue'].value);
            this.search.set('ProspectStatus', this.uiForm.controls['ProspectStatus'].value);
            this.search.set('StatusSelect', this.uiForm.controls['StatusSelect'].value);
            this.search.set('EmployeeCode', this.uiForm.controls['EmployeeCode'].value);
            this.search.set('ProspectNumber', this.uiForm.controls['ProspectNo'].value);
            this.search.set('riCacheRefresh', 'True');
            this.search.set('GridType', 'Main');
            this.search.set(this.serviceConstants.GridMode, '0');
            this.search.set(this.serviceConstants.GridHandle, '0');
            this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClickedColumn);
            this.search.set(this.serviceConstants.GridSortOrder, this.riSortOrder);
            // set grid building parameters
            this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
            this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
            this.queryParams.search = this.search;
            this.prospectGrid.loadGridData(this.queryParams);
        }
    }

    public onGridRowClick(event: any): void {
        //
    }

    private setFormdata(): any {
        let formData: Object = {};
        for (let c of this.controls) {
            formData[c.name] = this.getControlValue(c.name);
        }

        return JSON.stringify(formData);
    }

    private populateFormData(formdata: any): void {
        formdata = JSON.parse(formdata);
        for (let p in formdata) {
            if (formdata.hasOwnProperty(p)) {
                if (this.uiForm.controls[p]) {
                    this.setControlValue(p, formdata[p]);
                    if (p === 'FromDate' || p === 'ToDate') {
                        this.defaultFromdate = this.getControlValue('FromDate');
                        this.defaultToDate = this.getControlValue('ToDate');
                    }
                    this.byViewOptionSelectDropdown.selectedItem = this.getControlValue('ViewBy');
                    this.stageOptionSelectDropdown.selectedItem = this.getControlValue('StatusSelect');
                    this.statusOptionSelectDropdown.selectedItem = this.getControlValue('ProspectStatus');
                    this.valueSelectDropdown.selectedItem = this.getControlValue('ByValue');
                }
            }
        }

    }

    public onGridRowDblClick(event: any): void {
        this.ls.store(this.pageId + 'formData', this.setFormdata());
        this.ls.store(this.pageId + 'isReturningFlag', 'True');
        switch (event.cellIndex) {
            case 0:
                this.router.navigate(['prospecttocontract/maintenance/prospect'],
                    {
                        queryParams: {
                            'parentMode': 'ContactManagement',
                            'ProspectNumber': event.trRowData[0].text

                        }
                    });
                break;
            case 4:
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: { parentMode: 'ProspectReport', AccountRowID: event.trRowData[4].rowID } });
                break;

            default:
                break;
        }
    }

    public getGridInfo(info: any): void {
        this.totalItems = info.totalRows;
    }

    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();

    }

    public ngAfterViewInit(): void {
        this.pageTitle = 'Contact Management - Prospect';
        let estimatedClosedDate: any = {
            'fieldName': 'EstimatedClosedDate',
            'index': 14,
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(estimatedClosedDate);
        this.utils.setTitle(this.pageTitle);
        this.headerProperties = [];
        let accountNameAdjust: Object = {
            'align': 'center',
            'width': '190px',
            'minWidth': '190px',
            'index': 4
        };
        let prospectNumberAdjust: Object = {
            'align': 'center',
            'width': '100px',
            'minWidth': '100px',
            'index': 0
        };
        this.headerProperties.push(accountNameAdjust);
        this.headerProperties.push(prospectNumberAdjust);
        if (this.ls.retrieve(this.pageId + 'isReturningFlag') && this.ls.retrieve(this.pageId + 'isReturningFlag') === 'True') {
            this.populateFormData(this.ls.retrieve(this.pageId + 'formData'));
            this.ls.clear(this.pageId + 'isReturningFlag');
            this.ls.clear(this.pageId + 'formData');
        } else {
            this.ls.clear(this.pageId + 'isReturningFlag');
            this.ls.clear(this.pageId + 'formData');
            this.populateFormData(this.ls.retrieve(this.pageId + 'formData'));
        }
        this.validateProperties = [{
            'type': MntConst.eTypeInteger,
            'index': 0,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 1,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 2,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 3,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 4,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 5,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 6,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 7,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 8,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 9,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 10,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 11,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 12,
            'align': 'center'
        }, {
            'type': MntConst.eTypeDate,
            'index': 13,
            'align': 'center'
        }, {
            'type': MntConst.eTypeDate,
            'index': 14,
            'align': 'center'
        }, {
            'type': MntConst.eTypeDate,
            'index': 15,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 16,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 17,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 18,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 19,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 20,
            'align': 'center'
        }, {
            'type': MntConst.eTypeDate,
            'index': 21,
            'align': 'center'
        }
        ];

    }

    public refresh(): void {
        this.buildGrid();
    }

    public sortGrid(data: any): void {
        this.headerClickedColumn = data.fieldname;
        this.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid(true);
    }

}
