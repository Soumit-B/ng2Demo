import { Component, OnInit, Injector, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
import { ContractSearchComponent } from '../../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../../internal/search/iCABSAPremiseSearch';
import { ProductSearchGridComponent } from '../../../internal/search/iCABSBProductSearch';
import { AjaxConstant } from '../../../../shared/constants/AjaxConstants';
import { ICabsModalVO } from '../../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSARBranchContractReport.html'
})

export class BranchContractReportComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('ContractSearch') ContractSearch;
    @ViewChild('productSearch') public productSearch;
    public pageId: string = '';
    public isDateEnabled: boolean = false;
    public isRequesting: boolean;
    public thInformation: any;
    public thInformationDisplayed: boolean = false;
    public destinationType: any = {
        type: 'batch|ReportID'
    };
    public controls = [
        { name: 'ContractNumber', type: MntConst.eTypeCode, required: true, disabled: false },
        { name: 'ContractName', type: MntConst.eTypeText, required: false, disabled: true, readonly: true },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'IncludeContractDetails', value: true },
        { name: 'IncludeDeletedDetails', value: true },
        { name: 'IncludeContractHistory', value: false },
        { name: 'IncludeVisitHistory', value: false },
        { name: 'IncludeProductLocations', value: false },
        { name: 'RepDest' },
        { name: 'ServiceBranchNumber' },
        { name: 'IncludeCustomerInformation', value: false },
        { name: 'VisitDateFrom', type: MntConst.eTypeDate, required: true },
        { name: 'VisitDateTo', type: MntConst.eTypeDate, required: true }
    ];

    public ellipsisConfig = {
        contract: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'showAddNew': false,
                'currentContractType': 'C',
                'disabled': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ContractSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        premise: {
            disabled: false,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'showAddNew': false
            },
            component: PremiseSearchComponent
        },
        product: {
            disabled: false,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ProductSaleGroupCode': ''
            },
            component: ProductSearchGridComponent
        }
    };

    ngAfterViewInit(): void {
        this.ellipsisConfig.contract.autoOpen = true;
    }

    public dropdownConfig = {
        branch: {
            inputParamsBranch: {},
            negBranchNumberSelected: {
                id: '',
                text: ''
            }
        }
    };

    public queryParams: any = {
        operation: 'ApplicationReport/iCABSARBranchContractReport',
        module: 'report',
        method: 'contract-management/maintenance'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSARBRANCHCONTRACTREPORT;
        this.browserTitle = 'Branch Contract Report';
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    /*
    Method invoked On selecting Premise from ellipsis
    */
    public onPremiseSelect(data: any): void {
        if (data.PremiseNumber)
            this.setControlValue('PremiseNumber', data.PremiseNumber);
    }

    /*
    Method invoked on selecting branch from dropdown
    */
    public onBranchDataReceived(obj: any): void {
        if (obj) {
            if (obj.BranchNumber)
                this.setControlValue('ServiceBranchNumber', obj.BranchNumber);
        }
    }

    /*
    Method invoked on selecting Product from ellipsis
    */
    public onProductSelect(data: any): void {
        if (data.ProductCode)
            this.setControlValue('ProductCode', data.ProductCode);
    }

    /*
    Method invoked on checking IncludeVisitHistory checkbox
    */
    public onIncludeVisitHistoryClick(event: any): void {
        if (event.target.checked)
            this.isDateEnabled = true;
        else {
            this.isDateEnabled = false;
            this.setControlValue('VisitDateFrom', '');
            this.setControlValue('VisitDateTo', '');
            this.uiForm.controls['VisitDateFrom'].markAsUntouched();
            this.uiForm.controls['VisitDateTo'].markAsUntouched();
        }
    }

    /*
    Method invoked on changing report destination
    */
    public onRepDestChange(event: any): void {
        if (this.getControlValue('RepDest') === 'direct') {
            this.destinationType['type'] = 'batch|ReportID';
        } else {
            this.destinationType['type'] = 'email|User';
        }
    }

    /*
    Method invoked after receiving contractNumber
    */
    public onContractKeyDown(event: any, call: boolean): void {
        if (call) {
            if (event.srcElement.value) {
                let search = this.getURLSearchParamObject();
                search.set(this.serviceConstants.Action, '0');
                search.set('ContractNumber', event.srcElement.value);
                this.ajaxSource.next(AjaxConstant.START);
                this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search)
                    .subscribe(
                    (e) => {
                        this.ajaxSource.next(AjaxConstant.COMPLETE);
                        if (e.hasError) {
                            this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                            this.setControlValue('ContractName', '');
                            this.ellipsisConfig.premise.childConfigParams.ContractName = '';
                        } else {
                            this.setControlValue('ContractName', e.ContractName);
                            this.ellipsisConfig.premise.childConfigParams.ContractNumber = e.ContractNumber;
                            this.ellipsisConfig.premise.childConfigParams.ContractName = e.ContractName;
                        }
                    },
                    (error) => {
                        this.ajaxSource.next(AjaxConstant.COMPLETE);
                        this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    });
            }
            else {
                this.setControlValue('ContractName', '');
                this.ellipsisConfig.premise.childConfigParams.ContractNumber = '';
                this.ellipsisConfig.premise.childConfigParams.ContractName = '';
            }
        } else {
            if (event.ContractNumber) {
                this.setControlValue('ContractNumber', event.ContractNumber);
                this.ellipsisConfig.premise.childConfigParams.ContractNumber = event.ContractNumber;
                if (event.ContractName) {
                    this.setControlValue('ContractName', event.ContractName);
                    this.ellipsisConfig.premise.childConfigParams.ContractName = event.ContractName;
                }
            } else {
                this.setControlValue('ContractName', '');
                this.ellipsisConfig.premise.childConfigParams.ContractNumber = '';
                this.ellipsisConfig.premise.childConfigParams.ContractName = '';
            }
        }
        this.setControlValue('PremiseNumber', '');
        this.setControlValue('ProductCode', '');
        this.dropdownConfig.branch.inputParamsBranch = {};
        this.dropdownConfig.branch.negBranchNumberSelected = {
            id: '',
            text: ''
        };
        this.setControlValue('VisitDateFrom', '');
        this.setControlValue('VisitDateTo', '');
        this.uiForm.controls['VisitDateFrom'].markAsUntouched();
        this.uiForm.controls['VisitDateTo'].markAsUntouched();
        this.isDateEnabled = false;
        this.setControlValue('IncludeContractDetails', true);
        this.setControlValue('IncludeDeletedDetails', true);
        this.setControlValue('IncludeContractHistory', false);
        this.setControlValue('IncludeVisitHistory', false);
        this.setControlValue('IncludeProductLocations', false);
        this.setControlValue('IncludeCustomerInformation', false);
    }

    /*
    Method invoked on clicking Submit button
    */
    public onSubmitReportRequest(): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            let postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '2');
            let postParams: any = {};
            postParams.Description = 'Branch Contract Report';
            postParams.ProgramName = 'iCABSBranchContractReportGeneration.p';
            let date = new Date();
            postParams.StartDate = this.globalize.parseDateToFixedFormat(date);
            postParams.StartTime = ((date.getHours() * 60 + date.getMinutes()) * 60) + date.getSeconds();
            postParams.Report = 'report';
            postParams.ParameterName = 'ModeBusinessCodeContractNumberServiceBranchNumberProductCodePremiseNumberIncludeContractDetailsIncludeContractHistoryIncludeDeletedDetailsIncludeVisitHistoryIncludeProductLocationsIncludeCustomerInformationLoggedInBranchVisitDateFromVisitDateToRepManDest';
            postParams.ParameterValue = 'Branch' + this.businessCode() + '' + this.getControlValue('ContractNumber') + '' + this.getControlValue('ServiceBranchNumber') + '' + this.getControlValue('ProductCode') + '' + this.getControlValue('PremiseNumber') + '' +
                this.getControlValue('IncludeContractDetails') + '' + this.getControlValue('IncludeDeletedDetails') + '' + this.getControlValue('IncludeContractHistory') + '' + this.getControlValue('IncludeVisitHistory') + '' + this.getControlValue('IncludeProductLocations') + '' + this.getControlValue('IncludeCustomerInformation') + '' + this.utils.getBranchCode() + '' + this.globalize.parseDateToFixedFormat(this.getControlValue('VisitDateFrom')) + '' + this.globalize.parseDateToFixedFormat(this.getControlValue('VisitDateTo')) + '' + this.destinationType['type'];

            this.ajaxSource.next(AjaxConstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
                .subscribe(
                (e) => {
                    this.ajaxSource.next(AjaxConstant.COMPLETE);
                    if (e.hasError) {
                        this.thInformation = e.fullError;
                        this.thInformationDisplayed = true;
                    }
                },
                (error) => {
                    this.ajaxSource.next(AjaxConstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
                });
        }
    }
}
