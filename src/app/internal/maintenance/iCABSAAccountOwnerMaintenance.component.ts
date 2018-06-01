import * as moment from 'moment';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { Observable } from 'rxjs/Observable';
import { PageIdentifier } from '../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, Injector } from '@angular/core';
import { EmployeeSearchComponent } from './../search/iCABSBEmployeeSearch';
import { PremiseSearchComponent } from './../search/iCABSAPremiseSearch';
import { ContractSearchComponent } from './../search/iCABSAContractSearch';
import { AccountSearchComponent } from './../search/iCABSASAccountSearch';
import { URLSearchParams } from '@angular/http';
import { MntConst } from '../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAAccountOwnerMaintenance.html'
})
export class AccountOwnerMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('datepicker') public datepicker;

    public pageId: string = '';

    /* public Variables */
    public dtNextReviewDate: boolean | Date = null;
    public accountPortfolioOwnerID: string;
    public parentAccountNumber: string;
    public parentAccountName: string;
    public showMessageHeader: boolean = true;
    public promptTitle: string;
    public promptContent: any;
    public setFocusEmployeeCode = new EventEmitter<boolean>();
    public setFocusContractNumber = new EventEmitter<boolean>();
    private storedFieldData: Object = new Object();

    public headerParams: any = {
        method: 'contract-management/maintenance',
        module: 'account',
        operation: 'Application/iCABSAAccountOwnerMaintenance'
    };

    public ellipsisConfig = {
        contract: {
            disabled: true,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp',
            showAddNew: false,
            component: ContractSearchComponent,
            currentContractType: 'C'
        },
        premise: {
            disabled: true,
            showCloseButton: true,
            showHeader: true,
            showAddNew: false,
            parentMode: 'LookUp',
            ContractNumber: '',
            ContractName: '',
            component: PremiseSearchComponent,
            currentContractTypeURLParameter: '<contract>'
        },
        employee: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp',
            showAddNew: false,
            component: EmployeeSearchComponent
        }
    };

    public controls: any[] = [
        { name: 'AccountReviewPortfolioOwnerID', required: true, type: MntConst.eTypeCode },
        { name: 'AccountNumber', required: true, type: MntConst.eTypeCode },
        { name: 'AccountName', type: MntConst.eTypeTextFree },
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeTextFree },
        { name: 'EmployeeCode', required: true, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', type: MntConst.eTypeTextFree },
        { name: 'ReviewCycleMonths', required: true, type: MntConst.eTypeInteger },
        { name: 'AccountReviewNotes', type: MntConst.eTypeTextFree },
        { name: 'SuspendReviewInd' },
        { name: 'NumberReviews', type: MntConst.eTypeInteger },
        { name: 'FirstReview', type: MntConst.eTypeDate },
        { name: 'LastReview', type: MntConst.eTypeDate },
        { name: 'NextReviewDate', type: MntConst.eTypeDate }
    ];

    /*
    Constructor Method
    */
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAACCOUNTOWNERMAINTENANCE;
        this.browserTitle = 'Account Review Owner Maintenance';
    };

    /*
    Method: ngOnInit():
    Params:
    Details: Calls when page is initialized for the first time, after loading
    */
    public ngOnInit(): void {
        super.ngOnInit();
        this.getInitialDefaults();
    }

    /*
    Method: getInitialDefaults():
    Params:
    Details: Configures the page with values send from parent
    */
    public getInitialDefaults(): void {
        this.accountPortfolioOwnerID = this.riExchange.getParentHTMLValue('SelectedOwner');
        this.parentAccountNumber = this.riExchange.getParentHTMLValue('AccountNumber');
        this.parentAccountName = this.riExchange.getParentHTMLValue('AccountName');
        if (this.parentMode === 'add') {
            this.riMaintenance_BeforeAdd();
        } else if (this.parentMode === 'update') {
            this.fetchRecord();
        }
        this.ellipsisConfig.contract['accountNumber'] = this.getControlValue('AccountNumber');
        this.ellipsisConfig.contract['accountName'] = this.getControlValue('AccountName');
        this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.enableDisableFields();
    }

    /*
    Method: fetchRecord():
    Params:
    Details: Loads page as per parent data
    */
    public fetchRecord(): void {
        let fetchSearchParams: URLSearchParams = new URLSearchParams();
        fetchSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        fetchSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        fetchSearchParams.set(this.serviceConstants.Action, '0');
        fetchSearchParams.set('accountReviewPortfolioOwnerID', this.accountPortfolioOwnerID);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, fetchSearchParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.messageModal.show(data, true);
                    return;
                }
                this.setControlValue('AccountReviewPortfolioOwnerID', data.AccountReviewPortfolioOwnerID);
                this.setControlValue('AccountNumber', data.AccountNumber);
                this.setControlValue('AccountName', data.AccountName);
                this.setControlValue('ContractNumber', data.ContractNumber);
                this.setControlValue('ContractName', data.ContractName);
                this.setControlValue('PremiseNumber', data.PremiseNumber);
                this.setControlValue('PremiseName', data.PremiseName);
                this.setControlValue('FirstReview', data.FirstReview);
                this.setControlValue('LastReview', data.LastReview);
                this.setControlValue('EmployeeCode', data.EmployeeCode);
                this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                this.setControlValue('ReviewCycleMonths', data.ReviewCycleMonths);
                this.setControlValue('NextReviewDate', data.NextReviewDate);
                if (data.NextReviewDate) {
                    this.dtNextReviewDate = this.globalize.parseDateStringToDate(data.NextReviewDate);
                }
                this.setControlValue('SuspendReviewInd', this.utils.convertResponseValueToCheckboxInput(data.SuspendReviewInd));
                this.setControlValue('AccountReviewNotes', data.AccountReviewNotes);
                this.setControlValue('NumberReviews', data.NumberReviews);

                this.storeFieldData();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /*
    Method: updateDatePickerValue():
    Params:value , selected Date
    Details: Updates date in textbox
    */
    public updateDatePickerValue(value: any): void {
        if (value && value.value) {
            this.datepicker.resetDateField();
            this.setControlValue('NextReviewDate', value.value);
            /*if (!this.getControlValue('NextReviewDate')) {
                this.dtNextReviewDate = null;
            } else {
                this.dtNextReviewDate = this.utils.convertDate(this.getControlValue('NextReviewDate'));
            }*/
        }
    }

    /*
    Method: enableDisableFields():
    Params:
    Details: Enable or disable fields as per mode
    */
    public enableDisableFields(): void {
        this.ellipsisConfig.employee.disabled = false;
        this.riExchange.riInputElement.Enable(this.uiForm, 'EmployeeCode');
        this.riExchange.riInputElement.Enable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Enable(this.uiForm, 'ReviewCycleMonths');
        this.riExchange.riInputElement.Enable(this.uiForm, 'AccountReviewNotes');
        this.riExchange.riInputElement.Enable(this.uiForm, 'SuspendReviewInd');
        if (this.parentMode === 'update') {
            this.setFocusEmployeeCode.emit(true);
            this.ellipsisConfig.contract.disabled = true;
            this.ellipsisConfig.premise.disabled = true;
            this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        } else if (this.parentMode === 'add') {
            this.ellipsisConfig.contract.disabled = false;
            this.ellipsisConfig.premise.disabled = false;
            this.ellipsisConfig.employee.disabled = false;
            this.riExchange.riInputElement.Enable(this.uiForm, 'ContractNumber');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseNumber');
            setTimeout(() => {
                this.setFocusContractNumber.emit(true);
            }, 0);
        }

        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'EmployeeSurname');
        this.riExchange.riInputElement.Disable(this.uiForm, 'NumberReviews');
        this.riExchange.riInputElement.Disable(this.uiForm, 'FirstReview');
        this.riExchange.riInputElement.Disable(this.uiForm, 'LastReview');
    }

    /**
     * Before Add operation
     */
    public riMaintenance_BeforeAdd(): void {
        this.setControlValue('AccountReviewPortfolioOwnerID', '1');
        this.setControlValue('AccountNumber', this.parentAccountNumber);
        this.setControlValue('AccountName', this.parentAccountName);
        this.setControlValue('ReviewCycleMonths', '12');
        this.setControlValue('NumberReviews', '0');
        this.setControlValue('FirstReview', '');
        this.setControlValue('LastReview', '');
        this.dtNextReviewDate = null;

        let fetchSearchParams: URLSearchParams = new URLSearchParams();
        fetchSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        fetchSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        fetchSearchParams.set(this.serviceConstants.Action, '8');
        fetchSearchParams.set('AccountNumber', this.getControlValue('AccountNumber'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, fetchSearchParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.messageModal.show(data, true);
                    return;
                }
                this.setControlValue('EmployeeCode', data.EmployeeCode);
                this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                this.setControlValue('ReviewCycleMonths', data.ReviewCycleMonths);
                this.setControlValue('AccountReviewPortfolioOwnerID', data.AccountReviewPortfolioOwnerID);

                this.storeFieldData();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /*
    Method: btnDelete_onClick():
    Params:
    Details: Initializes Add
    */
    public btnDelete_onClick(): void {
        if (this.getControlValue('AccountReviewPortfolioOwnerID') === '1') {
            let data: Object = {};
            data['errorMessage'] = 'No record selected';
            this.messageModal.show(data, true);
            return;
        } else {
            this.promptTitle = MessageConstant.Message.DeleteRecord;
        }
        this.promptModal.show();
    }

    /*
    Method: promptSave():
    Params:
    Details: Called if
    */
    public promptSave(event: any): void {
        let deleteSearchParams: URLSearchParams = new URLSearchParams();
        deleteSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        deleteSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        deleteSearchParams.set(this.serviceConstants.Action, '3');

        let bodyParams = {};
        bodyParams['AccountReviewPortfolioOwnerID'] = this.getControlValue('AccountReviewPortfolioOwnerID');
        bodyParams['table'] = 'AccountReviewPortfolioOwner';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, deleteSearchParams, bodyParams).subscribe(
            (data) => {
                if (data.errorMessage) {
                    this.messageModal.show(data, true);
                    return;
                }

                this.clearFields();
                this.parentMode = 'add';
                this.getInitialDefaults();
                this.routeAwayGlobals.setSaveEnabledFlag(false);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /**
     * Clear field data on delete success
     */
    private clearFields(): void {
        this.dtNextReviewDate = null;
        this.uiForm.reset();
    }

    private storeFieldData(): void {
        this.storedFieldData = {};
        this.storedFieldData['AccountReviewPortfolioOwnerID'] = this.getControlValue('AccountReviewPortfolioOwnerID');
        this.storedFieldData['AccountNumber'] = this.getControlValue('AccountNumber');
        this.storedFieldData['AccountName'] = this.getControlValue('AccountName');
        this.storedFieldData['ContractNumber'] = this.getControlValue('ContractNumber');
        this.storedFieldData['ContractName'] = this.getControlValue('ContractName');
        this.storedFieldData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        this.storedFieldData['PremiseName'] = this.getControlValue('PremiseName');
        this.storedFieldData['FirstReview'] = this.getControlValue('FirstReview');
        this.storedFieldData['LastReview'] = this.getControlValue('LastReview');
        this.storedFieldData['EmployeeCode'] = this.getControlValue('EmployeeCode');
        this.storedFieldData['EmployeeSurname'] = this.getControlValue('EmployeeSurname');
        this.storedFieldData['ReviewCycleMonths'] = this.getControlValue('ReviewCycleMonths');
        this.storedFieldData['NextReviewDate'] = this.getControlValue('NextReviewDate');
        this.storedFieldData['SuspendReviewInd'] = this.getControlValue('SuspendReviewInd');
        this.storedFieldData['AccountReviewNotes'] = this.getControlValue('AccountReviewNotes');
        this.storedFieldData['NumberReviews'] = this.getControlValue('NumberReviews');
    }

    private restoreFieldData(): void {
        this.setControlValue('AccountReviewPortfolioOwnerID', this.storedFieldData['AccountReviewPortfolioOwnerID']);
        this.setControlValue('AccountNumber', this.storedFieldData['AccountNumber']);
        this.setControlValue('AccountName', this.storedFieldData['AccountName']);
        this.setControlValue('ContractNumber', this.storedFieldData['ContractNumber']);
        this.setControlValue('ContractName', this.storedFieldData['ContractName']);
        this.setControlValue('PremiseNumber', this.storedFieldData['PremiseNumber']);
        this.setControlValue('PremiseName', this.storedFieldData['PremiseName']);
        this.setControlValue('FirstReview', this.storedFieldData['FirstReview']);
        this.setControlValue('LastReview', this.storedFieldData['LastReview']);
        this.setControlValue('EmployeeCode', this.storedFieldData['EmployeeCode']);
        this.setControlValue('EmployeeSurname', this.storedFieldData['EmployeeSurname']);
        this.setControlValue('ReviewCycleMonths', this.storedFieldData['ReviewCycleMonths']);
        this.setControlValue('SuspendReviewInd', this.storedFieldData['SuspendReviewInd']);
        this.setControlValue('AccountReviewNotes', this.storedFieldData['AccountReviewNotes']);
        this.setControlValue('NumberReviews', this.storedFieldData['NumberReviews']);
        if (this.storedFieldData['NextReviewDate'] && this.parentMode === 'update') {
            this.setControlValue('NextReviewDate', this.storedFieldData['NextReviewDate']);
            this.dtNextReviewDate = this.globalize.parseDateStringToDate(this.getControlValue('NextReviewDate'));
        }
    }

    /*
    Method: onSubmit():
    Params:
    Details: Add or Updates record
    */
    public onSubmit(): void {
        let employeeCode_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'EmployeeCode');
        let reviewCycleMonths_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'ReviewCycleMonths');
        let isDateValid = moment(this.getControlValue('NextReviewDate'), 'DD/MM/YYYY', true).isValid();

        if (employeeCode_hasError || reviewCycleMonths_hasError || !isDateValid) {
            if (!isDateValid) {
                this.datepicker.validateDateField();
            }
            return;
        }

        let updateSearchParams: URLSearchParams = new URLSearchParams();
        updateSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        updateSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        if (this.parentMode === 'add') {
            updateSearchParams.set(this.serviceConstants.Action, '1');
        } else {
            updateSearchParams.set(this.serviceConstants.Action, '2');
        }

        let bodyParams = {};
        bodyParams['AccountReviewPortfolioOwnerID'] = this.getControlValue('AccountReviewPortfolioOwnerID');
        bodyParams['AccountNumber'] = this.getControlValue('AccountNumber');
        bodyParams['AccountName'] = this.getControlValue('AccountName');
        if (this.parentMode === 'add') {
            bodyParams['ContractNumber'] = this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '';
            bodyParams['ContractName'] = this.getControlValue('ContractName') ? this.getControlValue('ContractName') : '';
            bodyParams['PremiseNumber'] = this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '';
            bodyParams['PremiseName'] = this.getControlValue('PremiseName') ? this.getControlValue('PremiseName') : '';
        }
        bodyParams['EmployeeCode'] = this.getControlValue('EmployeeCode');
        bodyParams['EmployeeSurname'] = this.getControlValue('EmployeeSurname');
        bodyParams['ReviewCycleMonths'] = this.getControlValue('ReviewCycleMonths');
        bodyParams['NextReviewDate'] = this.getControlValue('NextReviewDate');
        bodyParams['SuspendReviewInd'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('SuspendReviewInd') ? this.getControlValue('SuspendReviewInd') : '');
        bodyParams['AccountReviewNotes'] = this.getControlValue('AccountReviewNotes') ? this.getControlValue('AccountReviewNotes') : '';
        bodyParams['NumberReviews'] = this.getControlValue('NumberReviews');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, updateSearchParams, bodyParams).subscribe(
            (data) => {
                if (data.errorMessage) {
                    this.messageModal.show(data, true);
                } else {
                    let info = {
                        title: 'Message',
                        msg: MessageConstant.Message.SavedSuccessfully
                    };
                    this.formPristine();
                    this.messageModal.show(info, false);
                    this.parentMode = 'update';
                    this.setControlValue('AccountReviewPortfolioOwnerID', data.AccountReviewPortfolioOwnerID);
                    this.storeFieldData();
                    this.enableDisableFields();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /**
     *
     *
     */
    public inputField_OnChange(e: any, name: any): void {
        if (e.type === 'blur') {
            let updateValue: string;
            if (name === 'Contract' && e.target.value.length > 0) {
                updateValue = this.utils.numberPadding(e.target.value, 8);
                this.setControlValue('ContractNumber', updateValue);
                this.ellipsisConfig.premise.ContractNumber = updateValue;
            }
        }
        else {
            if (name === 'Contract') {
                this.setControlValue('ContractNumber', e.ContractNumber);
                this.setControlValue('ContractName', e.ContractName);
                this.ellipsisConfig.premise.ContractNumber = e.ContractNumber;
                this.ellipsisConfig.premise.ContractName = e.ContractName;
            } else if (name === 'Premise') {
                this.setControlValue('PremiseNumber', e.PremiseNumber);
                this.setControlValue('PremiseName', e.PremiseName);
            } else if (name === 'Employee') {
                this.setControlValue('EmployeeCode', e.EmployeeCode);
                this.setControlValue('EmployeeSurname', e.EmployeeSurname);
            }
        }
    }

    /*
   Method: onAbandon():
   Params:
   Details: Cancels your current action
   */
    public onAbandon(): void {
        if (this.parentMode === 'add') {
            this.clearFields();
        }
        this.restoreFieldData();
    }
    /*
    Method: ngOnDestroy():
    Params:
    Details: Call on page destroys
    */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.routeAwayGlobals.resetRouteAwayFlags();
    }
}

