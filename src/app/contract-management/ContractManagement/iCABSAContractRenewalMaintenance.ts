import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { AppModuleRoutes, InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ErrorCallback, MessageCallback } from './../../base/Callback';
import { GridComponent } from './../../../shared/components/grid/grid';
import { LookUpData } from './../../../shared/services/lookup';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { ContractDurationComponent } from './../../internal/search/iCABSBContractDurationSearch';
import { Observable } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { StaticUtils } from './../../../shared/services/static.utility';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit, state } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';

@Component({
    templateUrl: 'iCABSAContractRenewalMaintenance.html'
})

export class ContractRenewalMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy, ErrorCallback, MessageCallback {
    @ViewChild('contractDurationDropDown') contractDurationDropDown: ContractDurationComponent;
    @ViewChild('effectiveDatePicker') effectiveDatePicker: DatepickerComponent;
    @ViewChild('contractRenewalGrid') contractRenewalGrid: GridComponent;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', disabled: false },
        { name: 'ContractName', disabled: true },
        { name: 'Status', disabled: true },
        { name: 'AccountNumber', disabled: true },
        { name: 'AccountName', disabled: true },
        { name: 'ContractAddressLine1', disabled: true },
        { name: 'NegBranchNumber', disabled: true },
        { name: 'BranchName', disabled: true },
        { name: 'ContractAddressLine2', disabled: true },
        { name: 'InvoiceFrequencyCode', disabled: true },
        { name: 'ContractAddressLine3', disabled: true },
        { name: 'InvoiceAnnivDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'ContractAddressLine4', disabled: true },
        { name: 'ContractAddressLine5', disabled: true },
        { name: 'ContractPostcode', disabled: true },
        { name: 'ContractCommenceDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'ContractDurationCode', disabled: true },
        { name: 'NegBranchNumber', disabled: true },
        { name: 'BranchName', disabled: true },
        { name: 'ContractAnnualValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'ContractExpiryDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'NewContractExpiryDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'ContinuousInd', disabled: true },
        { name: 'ContractSalesEmployee', disabled: true },
        { name: 'SalesEmployeeSurname', disabled: true },
        { name: 'NewContractDurationCode' },
        { name: 'LastChangeEffectDate', type: MntConst.eTypeDate },
        { name: 'ContractROWID' }
    ];
    public tabs: any = {
        tab0: { active: true },
        tab1: { active: false }
    };
    public contractSearchComponent = ContractSearchComponent;
    public autoOpen: boolean;
    public contractSearchParams: any = {
        parentMode: 'LookUp'
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    private headerParams: any = {
        method: 'contract-management/grid',
        module: 'duration',
        operation: 'Application/iCABSAContractRenewalMaintenance'
    };
    private recordRenewalSalesStats: boolean = false;
    public inputParamsContractDuration = {
        parentMode: 'LookUp-NewContract',
        businessCode: this.utils.getBusinessCode(),
        countryCode: this.utils.getCountryCode()
    };
    public effectiveDate: Date;
    public expiryDate: Date;
    public isContinuousContract: boolean = false;
    private contractStatus: string;
    public gridParams: any = {
        totalRecords: 0,
        maxColumn: 10,
        itemsPerPage: 10,
        currentPage: 1,
        riGridMode: 0,
        riGridHandle: 2820822,
        riSortOrder: 'Descending',
        HeaderClickedColumn: ''
    };
    public gridSortHeaders: Array<any> = [];
    public showValueControl: boolean = false;
    public employeeSearchParams: any = {
        parentMode: 'LookUp-ContractSalesEmployee'
    };
    public employeeSearchComponent = EmployeeSearchComponent;
    public contractDurationCode: string = '';
    public showMessageHeader: boolean = true;
    public promptConfirmTitle: string;
    public promptConfirmContent: string;
    public promptOptionYesNo: boolean = false;
    public contractDurationDefault: any = {
        id: '',
        text: ''
    };
    public contractTypeTexts: any = {
        title: 'Contract Renewal Maintenance',
        label: 'Contract Number'
    };
    public dataSelected: boolean = false;
    public menuDisabled: boolean = true;
    public menuValue: string = '';
    public validateProperties: Array<any> = [{
        'type': MntConst.eTypeText,
        'index': 0
    }, {
        'type': MntConst.eTypeCode,
        'index': 1
    }, {
        'type': MntConst.eTypeText,
        'index': 2
    }, {
        'type': MntConst.eTypeDate,
        'index': 3
    }, {
        'type': MntConst.eTypeInteger,
        'index': 4
    }, {
        'type': MntConst.eTypeCode,
        'index': 5
    }, {
        'type': MntConst.eTypeInteger,
        'index': 6
    }, {
        'type': MntConst.eTypeInteger,
        'index': 7
    }, {
        'type': MntConst.eTypeCurrency,
        'index': 8
    }, {
        'type': MntConst.eTypeCurrency,
        'index': 9
    }];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACONTRACTRENEWALMAINTENANCE;
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public ngAfterViewInit(): void {
        this.setMessageCallback(this);
        this.setErrorCallback(this);

        this.contractRenewalGrid.update = true;

        switch (this.riExchange.getCurrentContractType()) {
            case 'C':
                this.contractTypeTexts.title = 'Contract Renewal Maintenance';
                this.contractTypeTexts.label = 'Contract Number';
                break;
            case 'J':
                this.contractTypeTexts.title = 'Job Renewal Maintenance';
                this.contractTypeTexts.label = 'Job Number';
                break;
            case 'P':
                this.contractTypeTexts.title = 'Product Renewal Maintenance';
                this.contractTypeTexts.label = 'Product Number';
                break;
        }
        this.utils.setTitle(this.contractTypeTexts.title);
        this.contractSearchParams = {
            parentMode: 'LookUp',
            currentContractType: this.riExchange.getCurrentContractType()
        };

        let productCode: any = {
            'fieldName': 'ProductCode',
            'index': 1,
            'sortType': 'ASC'
        };
        let commenceDate: any = {
            'fieldName': 'CommenceDate',
            'index': 3,
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(productCode);
        this.gridSortHeaders.push(commenceDate);

        if (this.isReturning()) {
            this.autoOpen = false;
            this.fetchDetails();
            return;
        }
        this.autoOpen = true;
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public onTabClick(index: number): void {
        if (this.tabs['tab' + index].active) {
            return;
        }

        for (let key in this.tabs) {
            if (!key) {
                continue;
            }

            if (key === 'tab' + index) {
                this.tabs[key].active = true;
                continue;
            }

            this.tabs[key].active = false;
        }
    }

    public onContractNumberChange(event: any): void {
        if (this.getControlValue('ContractNumber') !== '') {
            this.onContractDataReceived({
                'ContractNumber': this.getControlValue('ContractNumber'),
                'ContractName': ''
            });
        } else {
            this.formReset();
        }
    }

    public formReset(): void {
        let contractNumber = this.getControlValue('ContractNumber');
        this.uiForm.reset();
        this.setControlValue('ContractNumber', contractNumber);
        this.uiForm.controls['ContinuousInd'].disable();
        this.isContinuousContract = false;
        this.dataSelected = false;
        this.contractRenewalGrid.clearGridData();
    }

    public onContractDataReceived(data: any): void {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);
        this.inputParamsContractDuration = {
            parentMode: 'LookUp-NewContract',
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode()
        };
        this.fetchDetails();
    }

    public fetchDetails(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();

        search.set(this.serviceConstants.SystemCharNumber, '2580');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.sysCharRequest(search).subscribe(data => {
            this.recordRenewalSalesStats = data.records[0].Required;
            this.getFormData();
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        }, error => {
            this.displayError(MessageConstant.Message.GeneralError, error);
        });
    }

    public getFormData(): void {
        let contractTypeStatusSearch: URLSearchParams = this.getURLSearchParamObject();
        let contractTypeFormData: any = {};
        let contractStatusFormData: any = {};
        let contractDetailsQuery: any = {};

        contractTypeStatusSearch.set(this.serviceConstants.Action, '6');

        contractTypeFormData['ContractNumber'] = this.getControlValue('ContractNumber');
        contractTypeFormData['Function'] = 'CheckContractType';

        contractStatusFormData['ContractNumber'] = this.getControlValue('ContractNumber');
        contractStatusFormData['Function'] = 'GetStatus';

        this.setFormMode(this.c_s_MODE_UPDATE);

        contractDetailsQuery = [{
            'table': 'Contract',
            'query': { 'ContractNumber': this.getControlValue('ContractNumber'), 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['LastChangeEffectDate', 'ContractDurationCode', 'ContractEffectDate', 'ContractExpiryDate', 'ContractName', 'AccountNumber', 'ContractCommenceDate', 'InvoiceAnnivDate', 'InvoiceFrequencyCode', 'NegBranchNumber']
        }];

        this.ajaxSource.next(this.ajaxconstant.START);
        Observable.forkJoin(
            this.httpService.makePostRequest(
                this.headerParams.method,
                this.headerParams.module,
                this.headerParams.operation,
                contractTypeStatusSearch,
                contractTypeFormData),
            this.httpService.makePostRequest(
                this.headerParams.method,
                this.headerParams.module,
                this.headerParams.operation,
                contractTypeStatusSearch,
                contractStatusFormData),
            this.httpService.lookUpRequest(contractTypeStatusSearch, contractDetailsQuery)
        ).subscribe(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            let contractDetails: any;
            if (data[0].errorMessage) {
                this.displayError(data[0].errorMessage);
                this.formReset();
                return;
            }
            if ((data[1].fullError || data[1].errorMessage) || (data[1].results && data[1].results.errorMessage)) {
                this.displayError(data[1].errorMessage || data[1].results.errorMessage);
                this.formReset();
                return;
            }
            this.contractStatus = data[1].Status;
            this.setControlValue('Status', data[1].Status);
            this.setControlValue('ContractAnnualValue', this.utils.numToDecimal(data[1].ContractAnnualValue, 2).toString());

            this.isContinuousContract = true;
            contractDetails = data[2].results[0][0];
            this.contractDurationCode = contractDetails['ContractDurationCode'];
            this.toggleContinuousContract();
            if (this.riExchange.ClientSideValues.Fetch('FullAccess') && contractDetails['NegBranchNumber'].toString() === this.utils.getBranchCode().toString()) {
                this.showValueControl = true;
            }
            for (let control in contractDetails) {
                if (!control) {
                    continue;
                }
                if (control === 'ContractCommenceDate' && contractDetails[control]) {
                    this.setControlValue(control, contractDetails[control]);
                    continue;
                }
                if (control === 'ContractExpiryDate' && contractDetails[control]) {
                    this.setControlValue(control, contractDetails[control]);
                    continue;
                }
                if (control === 'InvoiceAnnivDate' && contractDetails[control]) {
                    this.setControlValue(control, contractDetails[control]);
                    continue;
                }
                this.setControlValue(control, contractDetails[control]);
            }
            this.setControlValue('ContractROWID', contractDetails['ttContract']);
            this.getAccountDetails();
            this.dataSelected = true;
        }, error => {
            this.displayError(MessageConstant.Message.GeneralError, error);
        });
    }

    private getAccountDetails(): void {
        let accountDetailsQuery: any = [];

        accountDetailsQuery = [{
            'table': 'Branch',
            'query': { 'BranchNumber': this.utils.getBranchCode(), 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['BranchName']
        }, {
            'table': 'Account',
            'query': { 'AccountNumber': this.getControlValue('AccountNumber'), 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
        }];

        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(accountDetailsQuery).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0] && data[0].length) {
                this.setControlValue('BranchName', data[0][0]['BranchName']);
            }
            if (!data[1] || !data[1].length) {
                this.displayError(MessageConstant.Message.RecordNotFound);
                return;
            }
            let accountDetails: any = data[1][0];
            this.setControlValue('AccountName', accountDetails['AccountName']);
            this.setControlValue('ContractAddressLine1', accountDetails['AccountAddressLine1']);
            this.setControlValue('ContractAddressLine2', accountDetails['AccountAddressLine2']);
            this.setControlValue('ContractAddressLine3', accountDetails['AccountAddressLine3']);
            this.setControlValue('ContractAddressLine4', accountDetails['AccountAddressLine4']);
            this.setControlValue('ContractAddressLine5', accountDetails['AccountAddressLine5']);
            this.setControlValue('ContractPostcode', accountDetails['AccountPostcode']);

            this.loadGrid();
        }).catch(error => {
            this.displayError(MessageConstant.Message.GeneralError, error);
        });
    }

    private loadGrid(): void {
        let gridSearchParams: URLSearchParams = this.getURLSearchParamObject();
        let gridInputParams: any;

        gridInputParams = this.headerParams;

        gridSearchParams.set(this.serviceConstants.Action, '2');
        gridSearchParams.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        gridSearchParams.set(this.serviceConstants.GridHandle, this.gridParams.riGridHandle);
        gridSearchParams.set(this.serviceConstants.GridSortOrder, this.gridParams.riSortOrder);
        gridSearchParams.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
        gridSearchParams.set(this.serviceConstants.PageCurrent, this.gridParams.currentPage);
        gridSearchParams.set(this.serviceConstants.GridHeaderClickedColumn, this.gridParams.HeaderClickedColumn);
        gridSearchParams.set(this.serviceConstants.GridSortOrder, this.gridParams.riSortOrder);
        gridSearchParams.set(this.serviceConstants.ContractNumber, this.getControlValue('ContractNumber'));
        gridSearchParams.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());

        gridInputParams.search = gridSearchParams;

        this.contractRenewalGrid.loadGridData(gridInputParams);

        this.enableControls();
    }

    public refresh(): void {
        this.gridParams.currentPage = 1;
        this.loadGrid();
    }

    public getCurrentPage(curPage: any): void {
        this.gridParams.currentPage = curPage ? curPage.value : this.gridParams.currentPage;
        this.loadGrid();
    }

    public getGridInfo(info: any): void {
        let gridTotalItems = this.gridParams.itemsPerPage;
        if (info) {
            this.gridParams.totalRecords = info.totalRows;
        }
        StaticUtils.setGridInputReadonly(2);
    }

    public enableControls(): void {
        this.disableControl('ContinuousInd', false);
        //this.disableControl('Menu', false);
        this.menuDisabled = false;
        this.disableControl('ContractSalesEmployee', false);
    }

    private clearForm(ignore: Array<string>): void {
        this.isContinuousContract = false;
        this.clearControls(ignore);
        this.uiForm.disable();
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data, title: 'Error' }, false);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data, title: 'Message' }, false);
    }

    public onEmployeeDataReceived(data: any): void {
        this.setControlValue('ContractSalesEmployee', data.ContractSalesEmployee);
        this.setControlValue('SalesEmployeeSurname', data.SalesEmployeeSurname);
    }

    private toggleContinuousContract(): void {
        let controlValue: boolean = this.contractDurationCode ? false : true;
        this.setControlValue('ContinuousInd', controlValue);
        this.onContinuousContractChange();
    }

    public onContinuousContractChange(): void {
        this.isContinuousContract = !this.getControlValue('ContinuousInd');
        this.contractDurationDefault = {
            id: '',
            text: ''
        };
        this.setControlValue('NewContractDurationCode', '');
        this.effectiveDate = null;
        this.effectiveDatePicker.dtDisplay = '';
        this.setControlValue('LastChangeEffectDate', '');
        this.setControlValue('NewContractExpiryDate', '');
        this.setControlValue('ContractSalesEmployee', '');
        this.setControlValue('SalesEmployeeSurname', '');
    }

    public onMenuChange($event: any): void {
        this.menuValue = $event.target.value;
        switch (this.menuValue) {
            case 'Contract':
                this.navigate('LoadByKeyFields', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                    parentMode: 'LoadByKeyFields',
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName')
                });
                break;
            case 'Premises':
                this.navigate('Contract', InternalGridSearchServiceModuleRoutes.ICABSAPREMISESEARCHGRID.URL_1, {
                    parentMode: 'Contract',
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName'),
                    ContractTypeCode: this.riExchange.getCurrentContractType()
                });
                break;
            case 'ServiceCover':
                this.navigate('Contract', InternalGridSearchServiceModuleRoutes.ICABSACONTRACTSERVICESUMMARY, {
                    parentMode: 'Contract',
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName')
                });
                break;
        }
    }

    public onGenerateLetterClick(): void {
        this.showMessageHeader = true;
        this.promptConfirmContent = 'Are You Sure You Wish To Generate the Contract Renewal Letter ?';
        this.promptConfirmTitle = 'Contract Renewal';
        this.promptOptionYesNo = true;
        this.promptModalClose = this.generateContractRenewalLetter;
        this.promptConfirmModal.show();
    }

    private generateContractRenewalLetter(): void {
        let generateQuery: URLSearchParams = this.getURLSearchParamObject();
        let formData: any = {};

        generateQuery.set(this.serviceConstants.Action, '6');

        formData[this.serviceConstants.Function] = 'GenerateContractRenewalLetter';
        formData[this.serviceConstants.ContractNumber] = this.getControlValue('ContractNumber');
        formData[this.serviceConstants.AccountNumber] = this.getControlValue('AccountNumber');
        formData[this.serviceConstants.AccountNumber] = this.getControlValue('AccountNumber');

        this.httpService.makePostRequest(
            this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            generateQuery,
            formData
        ).subscribe(data => {
            if (data.errorMessage) {
                this.displayError(data.errorMessage);
                return;
            }
            let reportQuery: URLSearchParams = this.getURLSearchParamObject();
            let formData: any = {};

            reportQuery.set(this.serviceConstants.Action, '2');

            formData['ReportNumber'] = data.ReportNumber;
            this.httpService.makePostRequest(
                this.headerParams.method,
                this.headerParams.module,
                this.headerParams.operation,
                reportQuery,
                formData
            ).subscribe(data => {
                if (data.errorMessage) {
                    this.displayError(data.errorMessage);
                    return;
                }
                if (data.url) {
                    window.open(data.url, '_blank');
                }
            }, error => {
                this.displayError(MessageConstant.Message.GeneralError, error);
            });
        }, error => {
            this.displayError(MessageConstant.Message.GeneralError, error);
        });
    }

    public onGridDoubleClick(data: any): void {
        if (data.cellIndex === 1) {
            this.attributes['ServiceCoverRowID'] = data.cellData['rowID'];
            this.navigate('ProRataCharge', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                parentMode: 'ProRataCharge',
                ContractNumber: this.getControlValue('ContractNumber'),
                ContractName: this.getControlValue('ContractName')
            });
        }
    }

    public onReceivedContractDuration(data: any): void {
        this.setControlValue('NewContractDurationCode', data['NewContractDurationCode']);
        this.uiForm.markAsDirty();

        if (this.getControlValue('NewContractDurationCode')) {
            this.getNewExpiryDate();
        }
    }

    public onServiceDateSelect(data: any): void {
        this.setControlValue('LastChangeEffectDate', data['value']);
        if (data.value) {
            this.uiForm.markAsDirty();
        }

        if (this.getControlValue('LastChangeEffectDate') && this.getControlValue('NewContractDurationCode')) {
            this.getNewExpiryDate();
        }
    }

    private getNewExpiryDate(): void {
        let expiryDateQuery: URLSearchParams = this.getURLSearchParamObject();
        let formData: any = {};

        expiryDateQuery.set(this.serviceConstants.Action, '6');

        formData[this.serviceConstants.Function] = 'GetDates';
        formData['NewContractDurationCode'] = this.getControlValue('NewContractDurationCode');
        if (this.getControlValue('LastChangeEffectDate')) {
            formData['LastChangeEffectDate'] = this.getControlValue('LastChangeEffectDate');
        }
        formData[this.serviceConstants.ContractNumber] = this.getControlValue('ContractNumber');

        this.httpService.makePostRequest(
            this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            expiryDateQuery,
            formData
        ).subscribe(data => {
            if (!data['NewContractExpiryDate']) {
                return;
            }
            this.effectiveDatePicker.dtDisplay = this.globalize.formatDateToLocaleFormat(data['LastChangeEffectDate']);
            this.setControlValue('LastChangeEffectDate', data['LastChangeEffectDate']);
            this.setControlValue('NewContractExpiryDate', data['NewContractExpiryDate']);
        }, error => {
            this.displayError(MessageConstant.Message.GeneralError, error);
        });
    }

    public validateSave(): void {
        this.showMessageHeader = true;
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.promptOptionYesNo = false;
        this.promptModalClose = this.saveData;
        if (!this.getControlValue('ContractSalesEmployee')) {
            this.setControlValue('SalesEmployeeSurname', '');
        }
        this.promptConfirmModal.show();
    }

    public saveData(): void {
        let saveQueryParams: URLSearchParams = this.getURLSearchParamObject();
        let formData: any = {};
        let controlList: Array<string> = [
            'ContractNumber',
            'ContractROWID',
            'LastChangeEffectDate',
            'ContractDurationCode',
            'ContractExpiryDate',
            'ContractName',
            'AccountNumber',
            'ContractAnnualValue',
            'ContractCommenceDate',
            'InvoiceFrequencyCode',
            'InvoiceAnnivDate',
            'NegBranchNumber',
            'NewContractDurationCode',
            'NewContractExpiryDate',
            'ContractSalesEmployee'
        ];

        saveQueryParams.set(this.serviceConstants.Action, '2');

        for (let i = 0; i < controlList.length; i++) {
            formData[controlList[i]] = this.getControlValue(controlList[i]) || '';
        }
        formData[this.serviceConstants.Function] = 'GetStatus';
        formData['ContinuousInd'] = StaticUtils.convertCheckboxValueToRequestValue(this.getControlValue('ContinuousInd'));

        this.httpService.makePostRequest(
            this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            saveQueryParams,
            formData
        ).subscribe(data => {
            if (data.errorMessage) {
                this.displayError(data.errorMessage);
                return;
            }
            this.messageService.emitMessage(MessageConstant.Message.RecordSavedSuccessfully);
            this.formPristine();
        }, error => {
            this.displayError(MessageConstant.Message.GeneralError, error);
        });
    }

    private clearUpdates(): void {
        this.toggleContinuousContract();
        this.formPristine();
    }

    // tslint:disable-next-line:no-empty
    public promptModalClose(): void {
    }

    public onSaveFocus(e: any): void {
        let nextTab: number = 0;
        let code = (e.keyCode ? e.keyCode : e.which);
        let elemList = document.querySelectorAll('.nav-tabs li');
        let currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('.nav-tabs li.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            nextTab = currentSelectedIndex + 1;
            this.onTabClick(nextTab);
            setTimeout(() => {
                let elem = document.querySelector('.tab-content .tab-pane.active input:not([disabled])');
                if (elem) {
                    elem['focus']();
                }
            }, 100);
        }
        return;
    }

    public sortGrid(data: any): void {
        this.gridParams.HeaderClickedColumn = data.fieldname;
        this.gridParams.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGrid();
    }

    public onCellClickBlur(data: any): void {
        let urlParams: URLSearchParams = this.getURLSearchParamObject();
        let formData: any = {};

        if (data.cellIndex !== 9 || data.updateValue === data.cellData.text) {
            return;
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        urlParams.set(this.serviceConstants.Action, '2');

        formData[this.serviceConstants.GridMode] = '3';
        formData[this.serviceConstants.GridHandle] = this.gridParams.riGridHandle;
        formData[this.serviceConstants.GridSortOrder] = this.gridParams.riSortOrder;
        formData[this.serviceConstants.PageSize] = this.gridParams.itemsPerPage;
        formData[this.serviceConstants.PageCurrent] = this.gridParams.currentPage;
        formData[this.serviceConstants.GridHeaderClickedColumn] = this.gridParams.HeaderClickedColumn;
        formData[this.serviceConstants.ContractNumber] = this.getControlValue(this.serviceConstants.ContractNumber);
        formData[this.serviceConstants.LanguageCode] = this.getControlValue(this.riExchange.LanguageCode());
        formData['ProductCodeRowID'] = data.cellData.rowID;
        formData['ProductCode'] = data.completeRowData[1].text;
        formData['ProductDesc'] = data.completeRowData[2].text;
        formData['ServiceCommenceDate'] = data.completeRowData[3].text;
        formData['ServiceBranchNumber'] = data.completeRowData[4].text;
        formData['ServiceAreaCode'] = data.completeRowData[5].text;
        formData['ServiceQuantity'] = data.completeRowData[6].text;
        formData['ServiceVisitFrequency'] = data.completeRowData[7].text;
        formData['ServiceAnnualValue'] = data.completeRowData[8].text;
        formData['ProposedNewPriceRowID'] = data.cellData.rowID;
        formData['ProposedNewPrice'] = data.updateValue;
        formData['RowID'] = data.cellData.rowID;


        this.httpService.makePostRequest(
            this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            urlParams,
            formData
        ).subscribe(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                this.displayError(data.errorMessage);
                return;
            }
            if (data.fullError) {
                this.displayError(data.fullError);
            }
        }, error => {
            this.displayError(MessageConstant.Message.GeneralError, error);
        });
    }

    public onRouteCancel(): void {
        this.menuValue = '';
    }

    public onMessageClose(): void {
        this.navigate('Contract', InternalGridSearchServiceModuleRoutes.ICABSACONTRACTSERVICESUMMARY, {
            parentMode: 'Contract',
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName')
        });
    }
}
