import { InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { URLSearchParams } from '@angular/http';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit, EventEmitter } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';

@Component({
    templateUrl: 'iCABSAContractAnniversaryChange.html'
})

export class ContractAnniversaryChangeComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') public riGrid: GridAdvancedComponent;
    public setFocusContractNumber = new EventEmitter<boolean>();

    public itemsPerPage: number = 10;
    public totalRecords: number;
    public pageCurrent: number = 1;

    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', required: true },
        { name: 'ContractName', disabled: true },
        { name: 'InvoiceFrequencyCode', disabled: true },
        { name: 'AccountNumber', disabled: true },
        { name: 'AccountName', disabled: true },
        { name: 'InvoiceAnnivDate', disabled: true },
        { name: 'NegBranchNumber', disabled: true },
        { name: 'NegBranchName', disabled: true },
        { name: 'ContractAnnualValue', disabled: true },
        { name: 'StatusSearchType', disabled: true },
        { name: 'btnSelect', disabled: true },
        { name: 'NewAnnivDate', disabled: true },
        { name: 'EffectiveDate', disabled: true },
        { name: 'FilterPremiseNumber' },
        //{ name: 'btnSelect', disabled: true },
        { name: 'btnAnnivChange' },

        //hidden field
        { name: 'PremiseNumber' },
        { name: 'TaggedList' },
        { name: 'SelectedLine' }
    ];

    private headerParams: any = {
        operation: 'Application/iCABSAContractAnniversaryChange',
        module: 'contract',
        method: 'contract-management/maintenance'
    };

    public ellipsisConfig = {
        contract: {
            disabled: false,
            showHeader: true,
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'Search',
                currentContractType: 'C',
                showAddNew: false
            },
            component: ContractSearchComponent
        },
        premise: {
            disabled: false,
            showHeader: true,
            autoOpen: false,
            showCloseButton: true,
            parentMode: 'LookUp-ProRataChargeSummary',
            CurrentContractTypeURLParameter: '<contract>',
            ContractNumber: '',
            ContractName: '',
            showAddNew: false,
            component: PremiseSearchComponent
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACONTRACTANNIVERSARYCHANGE;
        this.browserTitle = 'Contract Visit Anniversary Date Change';
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Contract Visit Anniversary Date Change';
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.riMaintenance_AfterFetch();
        } else {
            this.loadSyscharVariables();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private loadSyscharVariables(): void {
        //SysChar
        this.ajaxSource.next(this.ajaxconstant.START);
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableServiceCoverDetail
        ];
        let sysCharIP = {
            module: this.headerParams.module,
            operation: this.headerParams.operation,
            action: '0',
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vSCEnableServiceCoverDetail = record[0]['Logical'];
            this.performLookupOperation();
        });
    }

    private performLookupOperation(): void {
        let lookUpSys = [{
            'table': 'UserAuthority',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'UserCode': this.utils.getUserCode()
            },
            'fields': ['AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd']
        }, {
            'table': 'ProductComponent',
            'query': { 'BusinessCode': this.utils.getBusinessCode() },
            'fields': []
        }];

        this.LookUp.lookUpRecord(lookUpSys).subscribe((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            let userAuthority = data[0][0];
            let productComponent = data[1][0];

            if (userAuthority) {
                this.pageParams.lAllowUserAuthView = data[0][0].AllowViewOfSensitiveInfoInd;
                this.pageParams.lAllowUserAuthUpdate = data[0][0].AllowUpdateOfContractInfoInd;
            }
            this.pageParams.lCompositesInUse = productComponent ? true : false;
            this.window_onload();
        });
    }

    private window_onload(): void {
        //if( user does not have Full Access, Annual Values are hidden
        this.utils.getUserAccessType().subscribe((type) => {
            this.pageParams.userAccessType = type;
            if (type === 'Restricted' && this.utils.getBranchCode() !== this.getControlValue('NegBranchNumber')) {
                this.pageParams.showAnnualValue = false;
            } else {
                this.pageParams.showAnnualValue = true;
            }
        });
        this.ContractNotSelected();
    }

    public onContractNumberChange(): void {
        if (this.getControlValue('ContractNumber')) {
            let lookUpContract = [{
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName', 'NegBranchNumber', 'ContractAnnualValue', 'AccountNumber', 'InvoiceFrequencyCode', 'InvoiceAnnivDate']
            }];

            this.ajaxSource.next(this.ajaxconstant.START);
            this.LookUp.lookUpRecord(lookUpContract).subscribe((data) => {
                let contract = data[0][0];

                if (contract) {
                    this.setControlValue('ContractName', contract.ContractName);
                    this.ellipsisConfig.premise.ContractNumber = this.getControlValue('ContractNumber');
                    this.ellipsisConfig.premise.ContractName = this.getControlValue('ContractName');
                    this.setControlValue('NegBranchNumber', contract.NegBranchNumber);
                    this.setControlValue('ContractAnnualValue', this.utils.cCur(contract.ContractAnnualValue.toString()));
                    this.setControlValue('AccountNumber', contract.AccountNumber);
                    this.setControlValue('InvoiceFrequencyCode', contract.InvoiceFrequencyCode);
                    this.setControlValue('InvoiceAnnivDate', this.utils.formatDate(contract.InvoiceAnnivDate));

                    let lookUpOther = [{
                        'table': 'Branch',
                        'query': {
                            'BusinessCode': this.businessCode(),
                            'BranchNumber': contract.NegBranchNumber
                        },
                        'fields': ['BranchName']
                    }, {
                        'table': 'Account',
                        'query': {
                            'BusinessCode': this.businessCode(),
                            'AccountNumber': contract.AccountNumber
                        },
                        'fields': ['AccountName']
                    }];

                    this.LookUp.lookUpRecord(lookUpOther).subscribe((data) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                        let branch = data[0][0];
                        let account = data[1][0];

                        if (branch) {
                            this.setControlValue('NegBranchName', branch.BranchName);
                        }

                        if (account) {
                            this.setControlValue('AccountName', account.AccountName);
                        }
                        this.riMaintenance_AfterFetch();
                    });
                } else {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
                    this.clearAndResetFields();
                }
            });
        } else {
            this.clearAndResetFields();
        }
    }

    //Clear populated fields and reset grid
    private clearAndResetFields(): void {
        this.setControlValue('ContractNumber', '');
        this.setControlValue('ContractName', '');
        this.ellipsisConfig.premise.ContractNumber = '';
        this.ellipsisConfig.premise.ContractName = '';
        this.setControlValue('NegBranchNumber', '');
        this.setControlValue('NegBranchName', '');
        this.setControlValue('ContractAnnualValue', '');
        this.setControlValue('AccountNumber', '');
        this.setControlValue('AccountName', '');
        this.setControlValue('InvoiceFrequencyCode', '');
        this.setControlValue('InvoiceAnnivDate', '');
        //this.setControlValue('EffectiveDate', '');
        // this.setControlValue('NewAnnivDate', '');
        //this.setControlValue('StatusSearchType', '');
        //this.setControlValue('FilterPremiseNumber', '');
        this.ContractNotSelected();
        this.totalRecords = 0;
        this.riGrid.ResetGrid();
    }

    private riMaintenance_AfterFetch(): void {
        this.EnableUpdate();
        // Default Effective date to the 1st of Jan
        this.setControlValue('EffectiveDate', '01/01/' + this.utils.year(new Date()));
        this.riMaintenance_AfterEvent();
    }

    public onDataReceived(data: any, type: string): void {
        switch (type) {
            case 'contract':
                this.setControlValue('ContractNumber', data.ContractNumber);
                this.setControlValue('ContractName', data.ContractName);
                this.ellipsisConfig.premise.ContractNumber = data.ContractNumber;
                this.ellipsisConfig.premise.ContractName = data.ContractName;
                this.onContractNumberChange();
                break;
            case 'premise':
                this.setControlValue('FilterPremiseNumber', data.PremiseNumber);
                break;
        }
    }

    private ContractNotSelected(): void {
        // Disable Status filter
        this.disableControl('StatusSearchType', true);

        // Disable Update fields
        this.DisableUpdate();
    }

    private ContractSelected(): void {
        // Enable Status filter
        this.disableControl('StatusSearchType', false);

        // Enable Update fields
        this.EnableUpdate();
    }

    private DisableUpdate(): void {
        this.disableControl('FilterPremiseNumber', true);
        this.disableControl('EffectiveDate', true);
        this.disableControl('NewAnnivDate', true);

        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EffectiveDate', false);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NewAnnivDate', false);

        this.disableControl('btnAnnivChange', true);
        this.setControlValue('TaggedList', '');
    }

    private EnableUpdate(): void {
        this.disableControl('FilterPremiseNumber', false);
        this.disableControl('EffectiveDate', false);
        this.disableControl('NewAnnivDate', false);

        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EffectiveDate', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NewAnnivDate', true);

        this.disableControl('btnAnnivChange', false);
        this.setControlValue('TaggedList', '');
    }

    public BuildGrid(): void {
        this.riGrid.Clear();

        this.riGrid.AddColumn('PremiseNumber', 'ContractServiceSummary', 'PremiseNumber', MntConst.eTypeText, 5, false);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ProductCode', 'ContractServiceSummary', 'ProductCode', MntConst.eTypeCode, 10, false);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('ProductDesc', 'ContractServiceSummary', 'ProductDesc', MntConst.eTypeText, 40);
        this.riGrid.AddColumnAlign('ProductDesc', MntConst.eAlignmentLeft);

        if (this.pageParams.lCompositesInUse) {
            this.riGrid.AddColumn('CompositeCode', 'PremiseServiceSummary', 'CompositeCode', MntConst.eTypeText, 10);
            this.riGrid.AddColumnAlign('CompositeCode', MntConst.eAlignmentCenter);
        }

        this.riGrid.AddColumn('ServiceCommenceDate', 'ContractServiceSummary', 'ServiceCommenceDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceCommenceDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceBranchNumber', 'ContractServiceSummary', 'ServiceBranchNumber', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumnAlign('ServiceBranchNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceAreaCode', 'ContractServiceSummary', 'ServiceAreaCode', MntConst.eTypeCode, 1);
        this.riGrid.AddColumnAlign('ServiceAreacode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceQuantity', 'ContractServiceSummary', 'ServiceQuantity', MntConst.eTypeInteger, 10);
        this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('ServiceVisitFrequency', 'ContractServiceSummary', 'ServiceVisitFrequency', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('ServiceAnnualValue', 'ContractServiceSummary', 'ServiceAnnualValue', MntConst.eTypeCurrency, 14, false);
        this.riGrid.AddColumnAlign('ServiceAnnualValue', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('NextInvoiceStartDate', 'ContractServiceSummary', 'NextInvoiceStartDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('NextInvoiceStartDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('NextInvoiceEndDate', 'ContractServiceSummary', 'NextInvoiceEndDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('NextInvoiceEndDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceVisitAnnivDate', 'PremiseServiceSummary', 'ServiceVisitAnnivDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceVisitAnnivDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('TaxCode', 'ContractServiceSummary', 'TaxCode', MntConst.eTypeCode, 5);
        this.riGrid.AddColumnAlign('TaxCode', MntConst.eAlignmentLeft);

        if (this.getControlValue('StatusSearchType') === '') {
            this.riGrid.AddColumn('Status', 'ContractServiceSummary', 'Status', MntConst.eTypeText, 20);
            this.riGrid.AddColumnAlign('Status', MntConst.eAlignmentLeft);
        }

        this.riGrid.AddColumn('Tagged', 'Tagged', 'Tagged', MntConst.eTypeImage, 1);

        this.riGrid.AddColumn('LOSCode', 'ContractServiceSummary', 'LOSCode', MntConst.eTypeText, 2);
        this.riGrid.AddColumnAlign('LOSCode', MntConst.eAlignmentLeft);


        this.riGrid.Complete();
    }

    public riGrid_BeforeExecute(): void {
        // ContractNumber must not be blank
        if (this.riExchange.riInputElement.isError(this.uiForm, 'ContractNumber')) {
            this.setFocusContractNumber.emit(true);
            return;
        }

        let gridQueryParams: URLSearchParams = new URLSearchParams();
        gridQueryParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridQueryParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridQueryParams.set(this.serviceConstants.Action, '2');

        gridQueryParams.set('FullAccess', this.pageParams.userAccessType);
        gridQueryParams.set('LoggedInBranch', this.utils.getBranchCode());
        gridQueryParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        gridQueryParams.set('PortfolioStatusCode', this.getControlValue('StatusSearchType'));
        gridQueryParams.set('PremiseNumber', this.getControlValue('FilterPremiseNumber'));
        gridQueryParams.set('AllowUserAuthView', this.pageParams.lAllowUserAuthView.toString());
        gridQueryParams.set('DetailInd', 'False');
        gridQueryParams.set('Level', 'AnnivDate');
        gridQueryParams.set('TaggedList', this.RetTaggedList(this.getControlValue('TaggedList')));

        gridQueryParams.set('riCacheRefresh', 'true');
        gridQueryParams.set(this.serviceConstants.GridMode, '0');
        gridQueryParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        gridQueryParams.set(this.serviceConstants.GridHeaderClickedColumn, '');
        gridQueryParams.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        gridQueryParams.set(this.serviceConstants.GridPageSize, this.itemsPerPage.toString());

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, gridQueryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                    return;
                }

                this.riGrid.RefreshRequired();
                this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.itemsPerPage : 1;
                this.riGrid.Execute(data);
            },
            (error) => {
                this.logger.log('Error', error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private ToggleTagList(ipRowID: string): void {
        let taggedListValue = this.getControlValue('TaggedList');

        if (taggedListValue.search(ipRowID) === -1) {
            taggedListValue = taggedListValue + ipRowID + ',';
        } else {
            taggedListValue = taggedListValue.replace(ipRowID + ',', '');
        }
        this.setControlValue('TaggedList', taggedListValue);
    }

    private RetTaggedList(str: any): string {
        let List = '';
        let taggedListValue = this.getControlValue('TaggedList');

        if (str !== '') {
            List = this.utils.Left(taggedListValue, taggedListValue.length - 1);
        }

        return List;
    }

    private ServiceCoverFocus(rsrcElement: any): void {
        let oTR = rsrcElement.parentElement.parentElement.parentElement;
        // get RowID from the last column
        this.setAttribute('RowID', oTR.children[oTR.getElementsByTagName('TD').length - 2].children[0].getAttribute('RowID'));
        this.setAttribute('Row', oTR.sectionRowIndex);
    }

    public riGrid_BodyOnDblClick(event: any): void {
        switch (event.srcElement.parentElement.getAttribute('name')) {
            case 'ProductCode':
                if (event.srcElement.getAttribute('RowID') !== '1') {
                    this.setAttribute('ServiceCoverRowID', event.srcElement.getAttribute('RowID'));
                    this.navigate('Search', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                        'currentContractType': this.riExchange.getCurrentContractType()
                    });
                }
                break;

            case 'Tagged':
                if (event.srcElement.getAttribute('RowID') !== '1') {
                    this.ServiceCoverFocus(event.srcElement);
                    this.ToggleTagList(event.srcElement.getAttribute('RowID'));
                    this.riGrid_BeforeExecute();
                }
                break;

        }
    }

    public tbodyContractServiceSummary_OnDblClick(event: any): void {
        if (this.riGrid.CurrentColumnName === 'ServiceAnnualValue') {
            let oTR = this.riGrid.CurrentHTMLRow;
            this.setAttribute('PremiseNumber', oTR.children[0].children[0].children[0].innerText);
            this.setAttribute('ServiceCoverRowID', oTR.children[1].children[0].getAttribute('RowID'));
            this.setAttribute('ProductCode', oTR.children[1].children[0].children[0].value);
            this.setAttribute('ProductDesc', oTR.children[2].children[0].children[0].innerText);

            this.navigate('Contract-ServiceSummary', InternalGridSearchServiceModuleRoutes.ICABSASERVICEVALUEGRID, {
                'ServiceCoverRowID': oTR.children[1].children[0].getAttribute('RowID'),
                'PremiseNumber': oTR.children[0].children[0].children[0].innerText,
                'ContractNumber': this.getControlValue('ContractNumber'),
                'ContractName': this.getControlValue('ContractName'),
                'ProductCode': oTR.children[1].children[0].children[0].value,
                'ProductDesc': oTR.children[2].children[0].children[0].innerText,
                'currentContractType': this.riExchange.getCurrentContractType()
            });
        }
    }

    private riMaintenance_AfterEvent(): void {
        // Re-Enable fields
        this.ContractSelected();

        this.BuildGrid();
        this.riGrid.Update = false;
        this.riGrid_BeforeExecute();
    }

    public StatusSearchType_onchange(): void {
        this.riGrid.Update = false;
        this.ClearTable();
    }

    private ClearTable(): void {
        this.totalRecords = 0;
        this.riGrid.RefreshRequired();
        this.BuildGrid();
    }

    public btnAnnivChange_OnClick(): void {
        let vErr = false, MsgText, MsgTitle, MsgResult;

        if (!this.riExchange.validateForm(this.uiForm)) {
            vErr = true;
        }

        if (!vErr) {
            let effectiveDate = this.globalize.parseDateToFixedFormat(this.getControlValue('EffectiveDate')) as string;
            let effectiveYear = effectiveDate.split('/')[0].toString();
            let currentYear = this.utils.year(new Date()).toString();

            if (effectiveYear !== currentYear) {
                this.modalAdvService.emitPrompt(new ICabsModalVO('Effective Date Is Not In Current Year - Do You Wish To Continue'));
            } else {
                this.onAnnivDateChange();
            }
        }
    }

    public getCurrentPage(data: any): void {
        this.pageCurrent = data.value;
        this.riGrid_BeforeExecute();
    }

    public onAnnivDateChange(): void {
        let dateChangeParams: URLSearchParams = new URLSearchParams();
        dateChangeParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        dateChangeParams.set(this.serviceConstants.CountryCode, this.countryCode());
        dateChangeParams.set(this.serviceConstants.Action, '6');

        let bodyParams = {};
        bodyParams['Function'] = 'AnnivDateChange';
        bodyParams['ContractNumber'] = this.getControlValue('ContractNumber');
        bodyParams['TaggedList'] = this.RetTaggedList(this.getControlValue('TaggedList'));
        bodyParams['NewAnnivDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('NewAnnivDate'));
        bodyParams['EffectiveDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('EffectiveDate'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, dateChangeParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data) {
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                        return;
                    }

                    this.modalAdvService.emitMessage(new ICabsModalVO(data.ResultMsg));

                    this.setControlValue('TaggedList', '');
                    this.BuildGrid();
                    this.riGrid.Update = false;
                    this.riGrid_BeforeExecute();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public dateOnChange(data: any, type: string): void {
        if (data && data.value) {
            this.setControlValue(type, data.value);
        }
    }
}
