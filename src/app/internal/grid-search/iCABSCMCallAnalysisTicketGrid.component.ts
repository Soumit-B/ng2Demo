import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { GridComponent } from '../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EmployeeSearchComponent } from '../search/iCABSBEmployeeSearch';
import { AccountSearchComponent } from '../search/iCABSASAccountSearch';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { BranchSearchComponent } from '../search/iCABSBBranchSearch';
import { Subscription } from 'rxjs/Subscription';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { DatepickerComponent } from '../../../shared/components/datepicker/datepicker';
import { ScreenNotReadyComponent } from '../../../shared/components/screenNotReady';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { OrderBy } from './../../../shared/pipes/orderBy';
import { MntConst } from '../../../shared/services/riMaintenancehelper';


@Component({
    templateUrl: 'iCABSCMCallAnalysisTicketGrid.html',
    styles: [`
    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(1),
    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(2) {
        width: 10%;
    }
    :host /deep/ .gridtable tbody td:nth-child(1) div span {
        background: #FFF;
        border-radius: 2px;
        border: 1px solid #999;
        box-shadow: inset 0 1px 1px rgba(0,0,0,0.05);
        font-family: "Open Sans",sans-serif;
        font-weight: normal;
        font-size: 1em;
        padding: 0 0.5em;
        color: #5a5d60;
        line-height: 24px;
        text-align: center;
        padding: 0 7px;
        display: block;
        cursor: pointer;
    }
    :host /deep/ .gridtable tbody tr:hover {
         background-color: rgba(76, 157, 222, 0.75);
    }
  `]
})

export class CallAnalysisTicketGridComponent extends BaseComponent implements AfterViewInit, OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'ViewBy', value: 'employee', disabled: false, required: false },
        { name: 'ViewByValue', disabled: false, required: false },
        { name: 'ViewByValueDesc', disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'ContactType', disabled: false, required: false },
        { name: 'ContactTypeDetail', disabled: false, required: false },
        { name: 'ContactStatusCode', disabled: false, required: false },
        { name: 'FromDate', disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'ToDate', disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'fromDateValue', disabled: false, required: false },
        { name: 'toDateValue', disabled: false, required: false },
        { name: 'chkIncludeInactive', value: 'false', disabled: false, required: false },
        { name: 'IncludeInactive', value: 'false', disabled: false, required: false },
        { name: 'PassLevel', disabled: false, required: false },
        { name: 'PassContactStatusCode', disabled: false, required: false },
        { name: 'ThisLevel', disabled: false, required: false },
        { name: 'ContactTypeCode', disabled: false, required: false },
        { name: 'LanguageCode', disabled: false, required: false },
        { name: 'ContactTypeDesc', disabled: false, required: false },
        { name: 'ContactStatusCode', disabled: false, required: false },
        { name: 'ContactStatusDesc', disabled: false, required: false }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCALLANALYSISTICKETGRID;
        this.browserTitle = 'Contact Management - Call Analysis - Calls/Tickets';
        this.orderBy = injector.get(OrderBy);
    }

    @ViewChild('ContactTypeCodeDropdown') ContactTypeCodeDropdown: DropdownStaticComponent;
    @ViewChild('contactDetailDropdown') contactDetailDropdown: DropdownStaticComponent;
    @ViewChild('errorModal') public errorModal;

    @ViewChild('CallAnalysisTicketGrid') CallAnalysisTicketGrid: GridComponent;
    @ViewChild('CallAnalysisTicketGridPagination') CallAnalysisTicketGridPagination: PaginationComponent;
    @ViewChild('fromDate') fromDatePicker: DatepickerComponent;
    @ViewChild('toDate') toDatePicker: DatepickerComponent;


    public queryParams: any = {
        operation: 'ContactManagement/iCABSCMCallAnalysisTicketGrid',
        module: 'tickets',
        method: 'ccm/maintenance'
    };

    //Global variable
    private orderBy: OrderBy;
    public PassContactStatusCode: string;
    public ContactStatusCode: string;
    public ContactType: string;
    public PassLevel: string;
    public ViewByValue: string;
    public inputParamsBranch: any = {};
    public ViewBy: string;
    public chkIncludeInactive: any;
    public ConvertchkIncludeInactive: any;
    public viewByOption: string;
    private lookUpSubscription: Subscription;
    public ContactTypeCodeList = [

    ];
    public contactTypeDetailCodesList: Array<Object> = [];
    public branchSelected: Object = {
        id: '',
        text: ''
    };
    public validateProperties: Array<any> = [];

    //Datepicker variable
    public todayDate: Date = new Date();
    public fromDateValue: Date = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), 1);
    public toDateValue: Date = new Date();
    public isGridRefreshClicked: boolean = false;
    public fromGridDate;
    public toGridDate;

    //ellipsis components
    public DynamicComponent1 = EmployeeSearchComponent;
    public DynamicComponent2 = AccountSearchComponent;
    public inputParamsEmployee: any = {
        parentMode: 'CallCentreAnalysis',
        showAddNewDisplay: false
    };
    public inputParamsAccount: any = {
        parentMode: 'CallCentreAnalysis',
        showAddNewDisplay: false
    };
    public inputParamsRegion: any = {
        parentMode: 'CallCentreAnalysis',
        showAddNewDisplay: false
    };
    public inputParamsTeam: any = {
        parentMode: 'CallCentreAnalysis',
        showAddNewDisplay: false
    };


    // Grid Component Variables
    public search: URLSearchParams = new URLSearchParams();
    public pageSize: number = 16;
    public itemsPerPage: number = 11;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 6;
    private selectedRow: any = -1;
    public gridSortHeaders: Array<any>;

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Contact Management - Call Analysis - Calls/Tickets';
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.buildGrid();
        } else
            this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
    public ngAfterViewInit(): void {
        this.setErrorCallback(this);
        this.setMessageCallback(this);
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.lookupData();
            if (this.getControlValue('ViewBy') === 'branch')
                this.branchSelected = {
                    id: this.getControlValue('ViewByValue'),
                    text: this.getControlValue('ViewByValue') + ' - ' + this.getControlValue('ViewByValueDesc')
                };
            else {
                this.setControlValue('ViewBy', 'employee');
            }
            this.buildGrid();
            return;
        }
        this.setControlValue('FromDate', this.riExchange.getParentHTMLValue('PassFromDate'));
        this.setControlValue('ToDate', this.riExchange.getParentHTMLValue('PassToDate'));
        this.fromDateValue = this.getControlValue('FromDate');
        this.toDateValue = this.getControlValue('ToDate');
    }

    private allOption: any = [{
        text: 'All',
        value: 'all'
    }];

    public window_onload(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ThisLevel', 'CallAnalysisTicketView');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PassContactStatusCode', this.riExchange.getParentHTMLValue('PassContactStatusCode'));
        this.PassContactStatusCode = this.getControlValue('PassContactStatusCode');
        if (this.PassContactStatusCode !== '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactStatusCode', this.PassContactStatusCode);

        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewBy', this.riExchange.getParentHTMLValue('PassViewBy'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewByValue', this.riExchange.getParentHTMLValue('PassViewByValue'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewByValueDesc', this.riExchange.getParentHTMLValue('PassViewByValueDesc'));
        this.setControlValue('ContactType', this.riExchange.getParentHTMLValue('PassContactType'));
        this.setControlValue('ContactTypeDetail', this.riExchange.getParentHTMLValue('PassContactTypeDetail'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PassLevel', this.riExchange.getParentHTMLValue('PassLevel'));
        this.ContactTypeCodeDropdown.selectedItem = this.getControlValue('ContactType');

        if (this.ContactTypeCodeDropdown.selectedItem !== 'all') {
            this.ContactTypeOnChange(event);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTypeDetail', this.riExchange.getParentHTMLValue('PassContactTypeDetail'));
        }
        this.PassLevel = this.getControlValue('PassLevel');
        this.ViewByValue = this.getControlValue('ViewByValue');
        if (this.PassLevel === 'BranchInRegion') {
            if (this.ViewByValue !== '') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewBy', 'branch');
            }
            else
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewByValue', this.riExchange.getParentHTMLValue('ViewByValue'));
        }
        else {
            //
        }

        //While page loading initially,based on the viewby dropdown ellipsis will change
        this.viewByOption = this.getControlValue('ViewBy');
        this.buildGrid();
        this.lookupData();

    }

    //Look UP
    public lookupData(): void {
        let lookupIP = [
            {
                'table': 'ContactTypeLang',
                'query': {
                    /*'ContactTypeCode': 'C',*/
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['ContactTypeCode', 'ContactTypeDesc']
            },
            {
                'table': 'ContactStatusLang',
                'query': {
                    /*'ContactTypeCode': 'C',*/
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['ContactStatusCode', 'ContactStatusDesc']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {

            if (data[0]) {
                let obj = {};
                for (let i = 0; i < data[0].length; i++) {

                    if (data[0][i].ContactTypeDesc.indexOf('.') === 1) {
                        obj = {

                            text: data[0][i].ContactTypeDesc.split('.')[1].replace(/\s/g, ''),
                            value: data[0][i].ContactTypeCode
                        };
                    }
                    else {

                        obj = {

                            text: data[0][i].ContactTypeDesc,
                            value: data[0][i].ContactTypeCode
                        };
                    }
                    this.ContactTypeCodeList = this.orderBy.transform(this.ContactTypeCodeList, 'text');
                    //this.ContactTypeCodeList.sort(this.compare).push(obj);
                    this.ContactTypeCodeList.push(obj);

                }
                this.ContactTypeCodeList = this.allOption.concat(this.ContactTypeCodeList);
            }
            // TODO: Sorting functionality yet TBD
            /*if (data[1]) {
                for (let i = 0; i < data[1].length; i++) {
                    let obj = {
                        text: data[1][i].ContactStatusCode,
                        value: data[1][i].ContactStatusDesc
                    }
                    this.ContactTypeCodeList.push(obj);
                }
        }*/
            if (this.isReturning()) {
                this.ContactTypeCodeDropdown.selectedItem = this.getControlValue('ContactType');
                this.ContactTypeOnChange(this.getControlValue('ContactType'));
            } else {
                this.ContactTypeCodeDropdown.selectedItem = 'all';
                this.ContactTypeOnChange('all');
            }
            this.refresh();

        });
    }

    public datePickerSelectedValue(data: any, handle: string): void {
        switch (handle) {
            case 'FromDate':
                this.setControlValue('FromDate', data.value);
                this.fromDatePicker.validateDateField();
                break;
            case 'ToDate':
                this.setControlValue('ToDate', data.value);
                this.toDatePicker.validateDateField();
                break;
        }
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    };

    public selectedViewBy(event: string): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewByValue', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewByValueDesc', '');
        this.viewByOption = event;
        //this.buildGrid();
    }

    public selectedContactStatusCode(event: string): void {
        this.buildGrid();
    }

    private setGridSettings(): void {
        this.validateProperties = [
            {
                'type': MntConst.eTypeInteger,
                'index': 0,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 1,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 2,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 3,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 4,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 5,
                'align': 'center'
            }];

    }

    public buildGrid(): void {
        this.setGridSettings();
        //converting check box value to true/false
        this.chkIncludeInactive = this.getControlValue('chkIncludeInactive');

        if (this.chkIncludeInactive === 'yes' || this.chkIncludeInactive === 'no' || this.chkIncludeInactive === 'Yes' || this.chkIncludeInactive === 'No') {
            this.ConvertchkIncludeInactive = this.utils.convertResponseValueToCheckboxInput(this.chkIncludeInactive);
        }
        else
            this.ConvertchkIncludeInactive = this.getControlValue('chkIncludeInactive');


        //populating the grid
        if (this.isGridRefreshClicked && this.riExchange.validateForm(this.uiForm)) {
            let search: URLSearchParams = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '2');
            this.search.set(this.serviceConstants.BusinessCode, 'D');
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

            //set parameters
            this.search.set('Level', this.riExchange.riInputElement.GetValue(this.uiForm, 'ThisLevel'));
            this.search.set('FromDate', this.getControlValue('FromDate'));
            this.search.set('ToDate', this.getControlValue('ToDate'));
            this.search.set('ViewBy', this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewBy'));
            this.search.set('ViewByValue', this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewByValue'));
            this.search.set('ViewByValueDesc', this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewByValueDesc'));
            this.search.set('ContactStatus', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContactStatusCode'));
            this.search.set('ContactType', this.getControlValue('ContactType'));
            this.search.set('ContactTypeDetail', this.getControlValue('ContactTypeDetail'));
            this.search.set('IncludeInactive', this.ConvertchkIncludeInactive);

            // set grid building parameters
            this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage - 1).toString());
            this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
            this.search.set(this.serviceConstants.GridMode, '0');
            this.search.set(this.serviceConstants.GridHandle, '1247082');
            this.queryParams.search = this.search;
            this.CallAnalysisTicketGrid.loadGridData(this.queryParams);
        }
        else
            this.CallAnalysisTicketGrid.clearGridData();

    }


    public ContactTypeOnChange(event: any): void {
        this.setControlValue('ContactType', event);

        //converting check box value to yes/no
        this.chkIncludeInactive = this.getControlValue('chkIncludeInactive');
        if (this.chkIncludeInactive === 'true' || this.chkIncludeInactive === 'false' || this.chkIncludeInactive === 'True' || this.chkIncludeInactive === 'False') {
            this.ConvertchkIncludeInactive = this.utils.convertCheckboxValueToRequestValue(this.chkIncludeInactive);
        }
        else
            this.ConvertchkIncludeInactive = this.getControlValue('chkIncludeInactive');

        this.getContactTypeDetailCodes();
    }

    public getContactTypeDetailCodes(): void {
        this.contactTypeDetailCodesList = [];
        //Post request
        this.ajaxSource.next(this.ajaxconstant.START);

        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.Action, '6');
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        let postData: Object = {};

        postData['Function'] = 'GetContactTypeDetailCodes';
        postData['IncludeInactive'] = this.ConvertchkIncludeInactive;
        postData['ContactType'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContactType');

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation,
            searchParams, postData).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    let contactTypeDetailCodes = data.ContactTypeDetailCodes.split('\n'),
                        contactTypeDetailDescs = data.ContactTypeDetailDescs.split('\n');
                    for (let i = 0; i < contactTypeDetailCodes.length; i++) {
                        this.contactTypeDetailCodesList.push({
                            value: contactTypeDetailCodes[i],
                            text: contactTypeDetailDescs[i]
                        });
                    }
                    if (this.isReturning())
                        this.contactDetailDropdown.selectedItem = this.getControlValue('ContactTypeDetail');
                    else
                        this.contactDetailDropdown.selectedItem = 'all';
                }

            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
        this.refresh();
    }

    public onContactTypeDetailSelect(data: any): void {
        this.setControlValue('ContactTypeDetail', data);
        this.buildGrid();
    }

    public onEmpDataReceived(data: any): void {
        this.setControlValue('ViewByValue', data.EmployeeCode);
        this.setControlValue('ViewByValueDesc', data.EmployeeSurName);
        this.buildGrid();
    }

    public onAccDataReceived(data: any): void {

        this.setControlValue('ViewByValue', data.AccountNumber);
        this.setControlValue('ViewByValueDesc', data.AccountName);
        this.buildGrid();

    }

    public onBranchDataReceived(data: any): void {
        this.setControlValue('ViewByValue', data.BranchNumber);
        this.setControlValue('ViewByValueDesc', data.BranchName);
        this.buildGrid();
    }

    public gridOnClick(data: any): void {
        //Getting data on single click
    }
    public selectedDataOnDoubleClick(event: any): void {

        switch (event.cellIndex) {
            case 0:
                if (event.cellData.text !== '0')
                    this.navigate('CallCentreReview', '/ccm/callcentersearch', {
                        'SelectedCallLogID': event.cellData.text
                    });
                break;
            case 1:
                //TODO: Screen not yet developed
                //this.navigate('CallCentreReview', 'ContactManagement/iCABSCMCustomerContactMaintenance.htm'); TODO
                this.modalAdvService.emitMessage(new ICabsModalVO('ContactManagement/iCABSCMCustomerContactMaintenance ' + MessageConstant.Message.PageNotDeveloped));
                break;

        }
    }


    public getGridInfo(info: any): void {
        this.CallAnalysisTicketGridPagination.totalItems = info.totalRows;
    }

    public getCurrentPage(curPage: any): void {
        this.currentPage = curPage ? curPage.value : this.currentPage;
        this.buildGrid();
    }
    public refresh(): void {
        this.isGridRefreshClicked = true;
        this.buildGrid();
    }

    //Implementing sorting function
    private compare(a: any, b: any): any {
        if (a.text < b.text)
            return -1;
        if (a.text > b.text)
            return 1;
        return 0;
    }

}
