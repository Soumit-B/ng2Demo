import { Component, OnInit, Injector, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { Observable } from 'rxjs';

import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { AppModuleRoutes, InternalGridSearchSalesModuleRoutes, ContractManagementModuleRoutes } from './../../base/PageRoutes';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { DatepickerComponent } from '../../../shared/components/datepicker/datepicker';
import { ScreenNotReadyComponent } from '../../../shared/components/screenNotReady';
import { GridAdvancedComponent } from '../../../shared/components/grid-advanced/grid-advanced';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';

@Component({
    templateUrl: 'iCABSAPremiseServiceSuspendMaintenance.html'
})

export class PremiseServiceSuspendMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('suspendStartDate') public suspendStartDate: DatepickerComponent;

    public focusElement: any;
    public canDeactivateObservable: Observable<boolean>;
    public pageId: string = '';
    public controls: Array<any> = [
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'AccountBalance', type: MntConst.eTypeCurrency },
        { name: 'SuspendStartDate', type: MntConst.eTypeDate },
        { name: 'SuspendEndDate', type: MntConst.eTypeDate },
        { name: 'CreditSuspendServiceInd' },
        { name: 'ServiceVisitAnnivDateInd' },
        { name: 'UpdatedAnnivDate', type: MntConst.eTypeDate },
        { name: 'SuspendReasonCode', type: MntConst.eTypeCode },
        // Hidden Field
        { name: 'TaggedList', value: '' },
        { name: 'ServiceCoverRowID' },
        { name: 'Mode' },
        { name: 'PremiseRowID' },
        { name: 'ServiceSuspendQuantity' },
        { name: 'vSuspendList', value: '' },
        { name: 'ServiceCoverNumber', value: '' }
    ];
    public isEnableCreditSuspendService: boolean = false;
    public isAutoOpenContractSearch: boolean = false;
    public suspendReasonSelected: any = {
        id: '',
        text: ''
    };
    public doYouWishToContinueTranslated: string = '';
    public promptTitle: string = '';
    public promptContent: string = '';
    public promptModalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public isShowGrid: boolean = false;
    public suspendReasonSearchColumns: Array<string> = ['SuspendReasonCode', 'SuspendReasonDesc'];
    public suspendReasonSearchInputParams: any = {
        operation: 'Business/iCABSBSuspendReasonSearch',
        module: 'suspension',
        method: 'contract-management/search'
    };
    public isSuspendReasonSearchDisabled: boolean = true;

    // Grid Component Variables
    public gridConfig = {
        pageSize: 10,
        currentPage: 1,
        totalRecords: 1
    };

    // URL Query Parameters
    public queryParams: any = {
        operation: 'Application/iCABSAPremiseServiceSuspendMaintenance',
        module: 'suspension',
        method: 'contract-management/grid'
    };

    // Ellipsis configuration parameters
    public ellipsisParams: any = {
        contract: {
            isShowCloseButton: true,
            isShowHeader: true,
            isDisabled: false,
            childConfigParams: {
                parentMode: 'Search'
            },
            contentComponent: ContractSearchComponent
        },
        premise: {
            isShowCloseButton: true,
            isShowHeader: true,
            disabled: false,
            childConfigParams: {
                parentMode: 'LookUp'
            },
            contentComponent: PremiseSearchComponent
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
        this.pageId = PageIdentifier.ICABSAPREMISESERVICESUSPENDMAINTENANCE;

        this.browserTitle = 'Premises Service/Invoice Suspension Maintenance';
        this.pageTitle = 'Premises Service/Invoice Suspension';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnLoad();
    }

    ngAfterViewInit(): void {
        if (this.getControlValue('ContractNumber')) {
            this.isAutoOpenContractSearch = false;
        } else {
            this.isAutoOpenContractSearch = true;
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // Initializes data into different controls on page load
    public windowOnLoad(): void {
        this.disableControl('UpdatedAnnivDate', true);
        this.buildGrid();
        this.getSysCharDetails();
        this.getAllTranslations();

        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.populateGrid();
        } else {
            this.pageParams.isUpdateMode = false;
        }

        this.setControlStatusonMode();
    }

    // Get all the page level translation at once
    public getAllTranslations(): void {
        this.getTranslatedValuesBatch((data: any) => {
            if (data && data[0]) {
                this.doYouWishToContinueTranslated = data[0].toString();
            }
        },
            [MessageConstant.PageSpecificMessage.doYouWishToContinue]
        );
    }

    // Fetch business system char details
    public getSysCharDetails(): any {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharCreditSuspendService
        ];
        let sysCharIP = {
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.isEnableCreditSuspendService = record[0]['Required'];
        });
    }

    public getHeaderData(): void {
        let search = this.getURLSearchParamObject();
        search.set('ContractNumber', this.getControlValue('ContractNumber'));
        search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        search.set('Level', 'Premises');
        search.set(this.serviceConstants.Action, '0');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('ContractName', data.ContractName);
                    this.setControlValue('PremiseName', data.PremiseName);
                    this.setControlValue('AccountBalance', data.AccountBalance);
                    this.setControlValue('CreditSuspendServiceInd', String(data.CreditSuspendServiceInd).includes('yes'));
                    this.setControlValue('PremiseRowID', data.Premise);
                    this.populateGrid();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public resetHeaderData(): void {
        this.setControlValue('AccountBalance', '');
        this.setControlValue('CreditSuspendServiceInd', false);
        this.setControlValue('PremiseRowID', '');
    }

    // Builds the structure of the grid
    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.FunctionUpdateSupport = true;

        this.riGrid.AddColumn('ProductCode', 'ContractServiceSummary', 'ProductCode', MntConst.eTypeCode, 10, false);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('ProductDesc', 'ContractServiceSummary', 'ProductDesc', MntConst.eTypeText, 40);
        this.riGrid.AddColumnAlign('ProductDesc', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('SuspendLocation', 'ContractServiceSummary', 'SuspendLocation', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('SuspendLocation', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('ServiceCommenceDate', 'ContractServiceSummary', 'ServiceCommenceDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceCommenceDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceBranchNumber', 'ContractServiceSummary', 'ServiceBranchNumber', MntConst.eTypeInteger, 1);
        this.riGrid.AddColumnAlign('ServiceBranchNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceAreaCode', 'ContractServiceSummary', 'ServiceAreaCode', MntConst.eTypeCode, 1);
        this.riGrid.AddColumnAlign('ServiceAreacode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('SuspendQuantity', 'ContractServiceSummary', 'SuspendQuantity', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumnAlign('SuspendQuantity', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnUpdateSupport('SuspendQuantity', true);

        this.riGrid.AddColumn('ServiceQuantity', 'ContractServiceSummary', 'ServiceQuantity', MntConst.eTypeInteger, 10);
        this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('ServiceVisitFrequency', 'ContractServiceSummary', 'ServiceVisitFrequency', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('ServiceAnnualValue', 'ContractServiceSummary', 'ServiceAnnualValue', MntConst.eTypeCurrency, 8, false);
        this.riGrid.AddColumnAlign('ServiceAnnualValue', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('NextInvoiceStartDate', 'ContractServiceSummary', 'NextInvoiceStartDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('NextInvoiceStartDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('NextInvoiceEndDate', 'ContractServiceSummary', 'NextInvoiceEndDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('NextInvoiceEndDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceVisitAnnivDate', 'PremiseServiceSummary', 'ServiceVisitAnnivDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceVisitAnnivDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('StartDate', 'StartDate', 'StartDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('StartDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('EndDate', 'EndDate', 'EndDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('EndDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('Status', 'ContractServiceSummary', 'Status', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('Status', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('Tagged', 'Tagged', 'Tagged', MntConst.eTypeImage, 1);

        this.riGrid.Complete();
    }

    // Populate data into the grid
    public populateGrid(): void {
        this.isShowGrid = true;
        let formData: Object = {};
        let search = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '2');

        formData['FullAccess'] = 'Full';
        formData['LoggedInBranch'] = this.utils.getBranchCode();
        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formData['ServiceCoverNumber'] = this.getControlValue('ServiceCoverNumber');;
        formData['CreditSuspendServiceInd'] = this.getControlValue('CreditSuspendServiceInd');
        formData['fn'] = 'AnnivDate';
        formData['TaggedList'] = this.getControlValue('TaggedList');

        // set grid building parameters
        formData[this.serviceConstants.GridMode] = '0';
        formData[this.serviceConstants.GridHandle] = this.utils.randomSixDigitString();
        formData[this.serviceConstants.PageSize] = this.gridConfig.pageSize.toString();
        formData[this.serviceConstants.PageCurrent] = this.gridConfig.currentPage.toString();
        formData[this.serviceConstants.GridHeaderClickedColumn] = this.riGrid.HeaderClickedColumn;
        formData[this.serviceConstants.GridSortOrder] = this.riGrid.SortOrder;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
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

    // Populate data into the grid
    public updateGrid(): void {
        this.isShowGrid = true;
        let formData: Object = {};
        let search = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '2');

        formData['ProductCodeRowID'] = this.riGrid.Details.GetAttribute('ProductCode', 'RowID');
        formData['ProductCode'] = this.riGrid.Details.GetValue('ProductCode');
        formData['ProductDesc'] = this.riGrid.Details.GetValue('ProductDesc');
        formData['SuspendLocation'] = this.riGrid.Details.GetValue('SuspendLocation');
        formData['ServiceCommenceDate'] = this.globalize.parseDateToFixedFormat(this.riGrid.Details.GetValue('ServiceCommenceDate'));
        formData['ServiceBranchNumber'] = this.riGrid.Details.GetValue('ServiceBranchNumber');
        formData['ServiceAreaCode'] = this.riGrid.Details.GetValue('ServiceAreaCode');
        formData['SuspendQuantityRowID'] = this.riGrid.Details.GetAttribute('SuspendQuantity', 'RowID');
        formData['SuspendQuantity'] = this.riGrid.Details.GetValue('SuspendQuantity');
        formData['ServiceQuantity'] = this.riGrid.Details.GetValue('ServiceQuantity');
        formData['ServiceVisitFrequencyRowID'] = this.riGrid.Details.GetAttribute('ServiceVisitFrequency', 'RowID');
        formData['ServiceVisitFrequency'] = this.riGrid.Details.GetValue('ServiceVisitFrequency');
        formData['ServiceAnnualValue'] = this.globalize.parseCurrencyToFixedFormat(this.riGrid.Details.GetValue('ServiceAnnualValue'));
        formData['NextInvoiceStartDate'] = this.globalize.parseDateToFixedFormat(this.riGrid.Details.GetValue('NextInvoiceStartDate'));
        formData['NextInvoiceEndDate'] = this.globalize.parseDateToFixedFormat(this.riGrid.Details.GetValue('NextInvoiceEndDate'));
        formData['ServiceVisitAnnivDate'] = this.globalize.parseDateToFixedFormat(this.riGrid.Details.GetValue('ServiceVisitAnnivDate'));
        formData['StartDate'] = this.globalize.parseDateToFixedFormat(this.riGrid.Details.GetValue('StartDate'));
        formData['EndDate'] = this.globalize.parseDateToFixedFormat(this.riGrid.Details.GetValue('EndDate'));
        formData['Status'] = this.riGrid.Details.GetValue('Status');
        formData['FullAccess'] = 'Full';
        formData['LoggedInBranch'] = this.utils.getBranchCode();
        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formData['ServiceCoverNumber'] = this.getControlValue('ServiceCoverNumber');;
        formData['CreditSuspendServiceInd'] = this.getControlValue('CreditSuspendServiceInd');
        formData['fn'] = 'AnnivDate';
        formData['TaggedList'] = this.getControlValue('TaggedList');

        // set grid building parameters
        formData[this.serviceConstants.GridMode] = '3';
        formData[this.serviceConstants.GridHandle] = this.utils.randomSixDigitString();
        formData[this.serviceConstants.PageSize] = this.gridConfig.pageSize.toString();
        formData[this.serviceConstants.PageCurrent] = this.gridConfig.currentPage.toString();
        formData[this.serviceConstants.GridHeaderClickedColumn] = this.riGrid.HeaderClickedColumn;
        formData[this.serviceConstants.GridSortOrder] = this.riGrid.SortOrder;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    let modalVO: ICabsModalVO = new ICabsModalVO(data.errorMessage, data.fullError);
                    modalVO.closeCallback = this.onErrorCloseCallback.bind(this);
                    this.modalAdvService.emitError(modalVO);
                } else {
                    this.riGrid.Mode = MntConst.eModeNormal;
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public onErrorCloseCallback(): void {
        this.riGrid.setFocusBack(this.focusElement);
    }

    // Refresh the grid data on user click
    public riGridOnRefresh(event: any): void {
        if (!this.pageParams.isUpdateMode) {
            if (this.gridConfig.currentPage <= 0) {
                this.gridConfig.currentPage = 1;
            }
            this.populateGrid();
        }
    }

    // Callback to retrieve the current page on user clicks
    public getCurrentPage(currentPage: any): void {
        this.gridConfig.currentPage = currentPage.value;
        this.riGridOnRefresh(null);
    }

    // Populate data from ellipsis
    public onEllipsisDataReceived(type: string, data: any): void {
        switch (type) {
            case 'Contract':
                this.isAutoOpenContractSearch = false;
                this.setControlValue('ContractNumber', data.ContractNumber || '');
                this.setControlValue('ContractName', data.ContractName || '');

                this.contractNumberOnChange(null);
                break;
            case 'Premise':
                this.setControlValue('PremiseNumber', data.PremiseNumber || '');
                this.setControlValue('PremiseName', data.PremiseName || '');
                this.premiseNumberOnChange(null);
                break;
        }
    }

    public setControlStatusonMode(): void {
        this.disableControl('ContractName', true);
        this.disableControl('PremiseName', true);
        this.disableControl('AccountBalance', true);

        this.disableControl('SuspendStartDate', !this.pageParams.isUpdateMode);
        this.disableControl('SuspendEndDate', !this.pageParams.isUpdateMode);
        this.disableControl('CreditSuspendServiceInd', !this.pageParams.isUpdateMode);
        this.disableControl('ServiceVisitAnnivDateInd', !this.pageParams.isUpdateMode);
        this.isSuspendReasonSearchDisabled = !this.pageParams.isUpdateMode;
        this.disableControl('ContractNumber', this.pageParams.isUpdateMode);
        this.disableControl('PremiseNumber', this.pageParams.isUpdateMode);
        this.ellipsisParams.contract.isDisabled = this.pageParams.isUpdateMode;
        this.ellipsisParams.premise.isDisabled = this.pageParams.isUpdateMode;

        this.setControlRequiredStatus('SuspendStartDate', this.pageParams.isUpdateMode);
        this.setControlRequiredStatus('SuspendEndDate', this.pageParams.isUpdateMode);
    }

    public setControlRequiredStatus(ctrlName: string, status: boolean): void {
        this.riExchange.updateCtrl(this.controls, ctrlName, 'required', status);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, ctrlName, status);
    }

    // Form submit event
    public onSubmit(event: any): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.checkPremisePlanVisit();
        }
    }

    // Form cancel event
    public cancelOnClick(event: any): void {
        this.setControlValue('SuspendStartDate', '');
        this.setControlValue('SuspendEndDate', '');
        this.setControlValue('CreditSuspendServiceInd', false);
        this.setControlValue('ServiceVisitAnnivDateInd', false);
        this.setControlValue('UpdatedAnnivDate', '');
        this.setControlValue('SuspendReasonCode', '');
        this.suspendReasonSelected = {
            id: '',
            text: ''
        };
        this.formPristine();
    }

    // Form cancel suspension event
    public cancelSuspensionOnClick(event: any): void {
        if (this.getControlValue('TaggedList')) {
            let formData: Object = {};
            let search = this.getURLSearchParamObject();

            search.set(this.serviceConstants.Action, '6');

            formData['Function'] = 'WarnCancel';

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        let iCabsModalVO: ICabsModalVO = new ICabsModalVO(data.ErrorMessageDesc, null, this.cancelSuspension.bind(this));
                        iCabsModalVO.title = 'Cancel Suspension';
                        this.modalAdvService.emitPrompt(iCabsModalVO);
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }
    }

    public toggleServiceVisitAnnivDate(event: any): void {
        if (this.pageParams.isUpdateMode && this.getControlValue('ServiceVisitAnnivDateInd') && this.getControlValue('SuspendEndDate')) {
            this.setControlValue('UpdatedAnnivDate', this.utils.addDays(this.utils.formatDate(this.getControlValue('SuspendEndDate')), 1));
        } else {
            this.setControlValue('UpdatedAnnivDate', '');
        }
    }

    public premiseNumberOnChange(event: any): void {
        if (this.getControlValue('ContractNumber') && this.getControlValue('PremiseNumber')) {
            this.resetTaggedList();
            this.getHeaderData();
            this.formPristine();
        } else if (this.getControlValue('ContractNumber') && !this.getControlValue('PremiseNumber')) {
            this.setControlValue('PremiseName', '');
            this.resetHeaderData();
            this.isShowGrid = false;
        }
    }

    public contractNumberOnChange(event: any): void {
        if (event !== null) { this.setControlValue('ContractName', ''); }
        this.ellipsisParams.premise.childConfigParams['ContractNumber'] = this.getControlValue('ContractNumber');
        this.ellipsisParams.premise.childConfigParams['ContractName'] = this.getControlValue('ContractName');
        this.setControlValue('PremiseNumber', '');
        this.setControlValue('PremiseName', '');
        this.resetHeaderData();
        this.isShowGrid = false;
    }

    // Grid click event
    public riGridBodyOnClick(event: any): void {
        if (String(event.srcElement.className).includes('pointer')) {
            this.serviceCoverFocus(event.srcElement);
        }
    }

    // Grid double click event
    public riGridBodyOnDblClick(event: any): void {
        let rowID = this.riGrid.Details.GetAttribute('ProductCode', 'RowID');
        this.setAttribute('ServiceCoverRowID', rowID);
        this.setControlValue('ServiceCoverRowID', rowID);
        this.serviceCoverFocus(event.srcElement);

        switch (this.riGrid.CurrentColumnName) {
            case 'ServiceVisitFrequency':
                this.navigate('ServiceCover', InternalGridSearchSalesModuleRoutes.ICABSAPLANVISITGRIDYEAR, {
                    ContractNumber: this.getControlValue('ContractNumber'),
                    PremiseNumber: this.getControlValue('PremiseNumber'),
                    ServiceCoverRowID: rowID,
                    CurrentContractTypeURLParameter: this.riExchange.getCurrentContractTypeUrlParam()
                });
                break;
            case 'ProductCode':
                this.navigate('ServiceSuspend', AppModuleRoutes.SERVICECOVERMAINTENANCE + ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE_SUB, {
                    CurrentContractTypeURLParameter: this.riExchange.getCurrentContractTypeUrlParam()
                });
                break;
            case 'Tagged':
                if (rowID !== '1') {
                    this.toggleTagList(rowID);
                    this.validateSuspensionVisits();
                    this.populateGrid();
                    this.suspendStartDate.onFocus();
                }
                break;
            case 'SuspendLocation':
                if (this.riGrid.Details.GetAttribute('Tagged', 'AdditionalProperty') !== 'T') {
                    this.setControlValue('Mode', 'Insert');
                    this.setControlValue('ServiceCoverRowID', this.riGrid.Details.GetAttribute('ProductCode', 'AdditionalProperty'));
                    this.updateSuspendList();

                    // Todo Application/iCABSASuspendLocationSearch.htm
                    // this.navigate('ServiceSuspend', 'Application/iCABSASuspendLocationSearch.htm', {
                    //     CurrentContractTypeURLParameter: this.riExchange.getCurrentContractTypeUrlParam()
                    // });
                    this.modalAdvService.emitMessage(new ICabsModalVO('iCABSASuspendLocationSearch.htm - This screen is not yet developed!'));
                }
                break;
        }
    }

    // Grid keydown on "Up Arror", "Down Arrow" & "Tab"
    public riGridBodyOnKeyDown(event: any): void {
        let taggedList: string = this.getControlValue('TaggedList');
        let currentRowID: string = this.riGrid.Details.GetAttribute('ProductCode', 'RowID');

        if (this.InStr('TaggedList', currentRowID) >= 0) {
            // This will prevent the edit operation in grid if it is already checked
            event.returnValue = 0;
        } else {
            switch (event.keyCode) {
                // Up Arror
                case 38:
                    event.returnValue = 0;
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.serviceCoverFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
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
                                this.serviceCoverFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }
                    break;
            }
        }
    }

    // Grid column focus event
    public riGridBodyColumnFocus(event: any): void {
        if (String(event.srcElement.className).includes('pointer') &&
            this.riGrid.CurrentColumnName === 'SuspendQuantity') {
            this.focusElement = event.srcElement;
            this.setControlValue('ServiceCoverNumber', this.riGrid.Details.GetAttribute('SuspendQuantity', 'AdditionalProperty'));
            this.setControlValue('ServiceCoverRowID', this.riGrid.Details.GetAttribute('ProductCode', 'AdditionalProperty'));
            this.setControlValue('Mode', 'Insert');
            this.updateSuspendList();
        }
    }

    public riGridOnBlur(event: any): void {
        this.updateGrid();
    }

    public suspendReasonSearchDataRecieved(event: any): void {
        if (event.SuspendReasonCode) {
            this.setControlValue('SuspendReasonCode', event.SuspendReasonCode);
            this.suspendReasonSelected = {
                id: event.SuspendReasonCode,
                text: event.SuspendReasonCode + ' - ' + event.SuspendReasonDesc
            };
        } else {
            this.setControlValue('SuspendReasonCode', '');
            this.suspendReasonSelected = {
                id: '',
                text: ''
            };
        }
    }

    public checkPremisePlanVisit(): void {
        let formData: Object = {};
        let search = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'CheckPremisePlanVisit';
        formData['PremiseRowID'] = this.getControlValue('PremiseRowID');
        formData['TaggedList'] = this.getControlValue('TaggedList');
        formData['OrigSuspendStartDate'] = '';
        formData['OrigSuspendEndDate'] = '';
        formData['SuspendStartDate'] = this.getControlValue('SuspendStartDate');
        formData['SuspendEndDate'] = this.getControlValue('SuspendEndDate');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (data.DisplayMessage !== '') {
                        let iCabsModalVO: ICabsModalVO = new ICabsModalVO(data.DisplayMessage + this.doYouWishToContinueTranslated, null, this.validatePremiseSuspendQty.bind(this));
                        iCabsModalVO.title = 'Suspend';
                        this.modalAdvService.emitPrompt(iCabsModalVO);
                    } else {
                        this.validatePremiseSuspendQty();
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public validatePremiseSuspendQty(): void {
        let formData: Object = {};
        let search = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'ValidatePremiseSuspendQty';
        formData['PremiseRowID'] = this.getControlValue('PremiseRowID');
        formData['TaggedList'] = this.getControlValue('TaggedList');
        formData['SuspendStartDate'] = this.getControlValue('SuspendStartDate');
        formData['SuspendEndDate'] = this.getControlValue('SuspendEndDate');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (data.DisplayMessage !== '') {
                        this.modalAdvService.emitMessage(new ICabsModalVO(data.DisplayMessage));
                    } else {
                        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.saveRecord.bind(this)));
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public saveRecord(): void {
        let formData: Object = {};
        let search = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '2');

        formData['PremiseROWID'] = this.getControlValue('PremiseRowID');
        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formData['ContractName'] = this.getControlValue('ContractName');
        formData['PremiseName'] = this.getControlValue('PremiseName');
        formData['SuspendStartDate'] = this.getControlValue('SuspendStartDate');
        formData['SuspendEndDate'] = this.getControlValue('SuspendEndDate');
        formData['ServiceVisitAnnivDateInd'] = this.getControlValue('ServiceVisitAnnivDateInd') ? 'yes' : 'no';
        formData['AccountBalance'] = this.getControlValue('AccountBalance');
        formData['SuspendReasonCode'] = this.getControlValue('SuspendReasonCode');
        formData['ServiceSuspendQuantity'] = this.getControlValue('ServiceSuspendQuantity');
        formData['CreditSuspendServiceInd'] = this.getControlValue('CreditSuspendServiceInd') ? 'yes' : 'no';
        formData['ServiceCoverROWID'] = this.getControlValue('ServiceCoverRowID');
        formData['Mode'] = 'Grid';
        formData['Level'] = 'Premises';
        formData['TaggedList'] = this.getControlValue('TaggedList');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.formPristine();
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                    this.resetTaggedList();
                    this.cancelOnClick(null);
                    this.populateGrid();
                    this.setControlValue('Mode', 'Remove');
                    this.updateSuspendList();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public updateSuspendList(): void {
        let formData: Object = {};
        let search = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'UpdateSuspendList';
        formData['SuspendRowID'] = this.getControlValue('ServiceCoverRowID');
        formData['SuspendList'] = this.getControlValue('vSuspendList');
        formData['Mode'] = this.getControlValue('Mode');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('vSuspendList', data.NewSuspendlist);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public cancelSuspension(): void {
        let formData: Object = {};
        let search = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'CancelSuspension';
        formData['PremiseRowid'] = this.getControlValue('PremiseRowID');
        formData['Level'] = 'Premises';
        formData['TaggedList'] = this.getControlValue('TaggedList');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.resetTaggedList();
                    this.populateGrid();
                    this.cancelOnClick(null);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public toggleTagList(rowID: string): void {
        let taggedList: string = this.getControlValue('TaggedList');

        if (this.InStr('TaggedList', rowID) < 0) {
            this.setControlValue('TaggedList', taggedList + rowID);
        } else {
            this.setControlValue('TaggedList', taggedList.replace(rowID, ''));
        }

        if (this.getControlValue('TaggedList')) {
            this.pageParams.isUpdateMode = true;
        } else {
            this.pageParams.isUpdateMode = false;
        }
        this.setControlStatusonMode();
    }

    // Updates the pagelevel attributes on grid row activity
    public serviceCoverFocus(rsrcElement: any): void {
        let oTR = rsrcElement.parentElement.parentElement.parentElement;

        this.setAttribute('RowID', oTR.children[16].children[0].children[0].getAttribute('RowID'));
        this.setAttribute('Row', oTR.sectionRowIndex);

        if (this.utils.len(oTR.children[13].children[0].children[0].innerText) > 0) {
            this.setAttribute('StartDate', this.globalize.parseDateToFixedFormat(oTR.children[13].children[0].children[0].innerText));
        } else {
            this.setAttribute('StartDate', '');
        }

        if (this.utils.len(oTR.children[14].children[0].children[0].innerText) > 0) {
            this.setAttribute('EndDate', this.globalize.parseDateToFixedFormat(oTR.children[14].children[0].children[0].innerText));
        } else {
            this.setAttribute('EndDate', '');
        }
        if (this.riGrid.Details.GetAttribute('ServiceVisitFrequency', 'AdditionalProperty')) {
            this.setAttribute('SuspendReasonCode', this.riGrid.Details.GetAttribute('ServiceVisitFrequency', 'AdditionalProperty'));
        } else {
            this.setAttribute('SuspendReasonCode', '');
        }
        this.setControlValue('ServiceSuspendQuantity', this.riGrid.Details.GetValue('SuspendQuantity'));
    }

    public resetTaggedList(): void {
        this.setControlValue('TaggedList', '');
        this.setControlValue('UpdatedAnnivDate', '');
        this.pageParams.isUpdateMode = false;
        this.setControlStatusonMode();
    }

    public getSuspendResonDesc(suspendReasonCode: string): void {
        if (suspendReasonCode) {
            let formData: Object = {};
            let search = this.getURLSearchParamObject();

            search.set(this.serviceConstants.Action, '6');

            formData['Function'] = 'GetSuspendReasonDesc';
            formData['SuspendReasonCode'] = suspendReasonCode;

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.suspendReasonSelected = {
                            id: suspendReasonCode,
                            text: suspendReasonCode + ' - ' + data.SuspendResonDesc
                        };
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        } else {
            this.suspendReasonSelected = {
                id: '',
                text: ''
            };
            this.setControlValue('SuspendReasonCode', '');
        }
    }

    public validateSuspensionVisits(): void {
        let formData: Object = {};
        let search = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'ValidateSuspensionVisits';
        formData['PremiseRowID'] = this.getControlValue('PremiseRowID');
        formData['TaggedList'] = this.getControlValue('TaggedList');
        formData['EnableCreditSuspendService'] = this.isEnableCreditSuspendService ? 'yes' : 'no';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('CreditSuspendServiceInd', String(data.CreditSuspendServiceInd).includes('yes'));

                    if (data.DisplayMessage !== '') {
                        this.modalAdvService.emitMessage(new ICabsModalVO(data.DisplayMessage));
                        this.setControlValue('SuspendStartDate', '');
                        this.setControlValue('SuspendEndDate', '');
                        this.setControlValue('SuspendReasonCode', '');
                        this.getSuspendResonDesc('');
                    } else {
                        if (this.getControlValue('TaggedList')) {
                            this.setControlValue('SuspendStartDate', this.getAttribute('StartDate'));
                            this.setControlValue('SuspendEndDate', this.getAttribute('EndDate'));
                            this.setControlValue('SuspendReasonCode', this.getAttribute('SuspendReasonCode'));
                            this.getSuspendResonDesc(this.getAttribute('SuspendReasonCode'));
                        } else {
                            this.cancelOnClick(null);
                        }
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public resetRouteAwayStatus(): void {
        document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
        setTimeout(() => {
            this.router.navigate([], { skipLocationChange: true, preserveQueryParams: true });
        }, 0);
    }

    public canDeactivate(): Observable<boolean> {
        let flag: boolean = false;
        this.promptTitle = 'Suspend';
        this.promptContent = 'Please ensure all details of service suspension are entered. Do you wish to Continue ?';

        this.canDeactivateObservable = new Observable((observer) => {
            this.promptModal.saveEmit.subscribe((event) => {
                let formData: Object = {};
                let search = this.getURLSearchParamObject();

                search.set(this.serviceConstants.Action, '6');

                formData['Function'] = 'SuspendlistValidation';
                formData['SuspendList'] = this.getControlValue('vSuspendList');

                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                    .subscribe(
                    (data) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        if (data.hasError) {
                            this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                            observer.next(false);
                            this.resetRouteAwayStatus();
                        } else {
                            if (data.Status === 'yes') {
                                this.setControlValue('vSuspendList', '');
                                observer.next(true);
                            } else {
                                observer.next(false);
                                this.resetRouteAwayStatus();
                            }
                        }
                    },
                    (error) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                        observer.next(false);
                        this.resetRouteAwayStatus();
                    });
            });
            this.promptModal.cancelEmit.subscribe((event) => {
                observer.next(false);
                this.resetRouteAwayStatus();
            });
            if (this.getControlValue('vSuspendList')) {
                this.promptModal.show();
                return;
            }
        });

        if (this.getControlValue('vSuspendList')) {
            return this.canDeactivateObservable;
        } else {
            return super.canDeactivate();
        }
    }
}
