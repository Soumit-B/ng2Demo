import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';

import { ErrorService } from '../../../shared/services/error.service';
import { BaseComponent } from '../../base/BaseComponent';
import { ModalComponent } from './../../../shared/components/modal/modal';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { StaticUtils } from './../../../shared/services/static.utility';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { PostCodeSearchComponent } from './../../internal/search/iCABSBPostcodeSearch.component';

/**
 * @class PostcodeMoveBranchComponent
 * @extends BaseComponent
 * @implements AfterViewInit
 */
@Component({
    templateUrl: 'iCABSAPostcodeMoveBranch.html',
    providers: [ErrorService]
})

export class PostcodeMoveBranchComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    // Child Modal
    @ViewChild('infoModal') public infoModal: ModalComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    // Class properties
    public pageId: string = '';
    public controls: Array<any> = [];
    public sysCharParams: any = {};
    // Ellipsis properties
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public ellipsisParams: any = {
        showCloseButton: true,
        showHeader: true,
        contractSearchParams: {
            parentMode: 'LookUp',
            currentContractType: 'C'
        },
        premiseSearchParams: {
            parentMode: 'LookUp'
        },
        postcodeSearchParams: {
            parentMode: 'Premise'
        },
        commisssionEmployeeSearchParams: {
            parentMode: 'LookUp-Commission'
        },
        newCommisssionEmployeeSearchParams: {
            parentMode: 'LookUp-CommissionBranch-Employee'
        },
        newPremiseSalesEmployeeSearchParams: {
            parentMode: 'LookUp-PremiseBranch-Employee'
        },
        newContractSalesEmployeeSearchParams: {
            parentMode: 'LookUp-ContractBranch-Employee'
        }
    };
    public contractSearchComponent: any;
    public premiseSearchComponent: any;
    public postcodeSearchComponent: any;
    public employeeSearchComponent: any;
    public autoOpen: boolean;
    // Modal properties
    public showMessageHeader: boolean = true;
    public promptConfirmTitle: string;
    public promptConfirmContent: string;
    // Element States
    public elementShowHide: any = {
        serviceAreaCode: false,
        salesAreaCode: false,
        transferTurnover: true,
        isControlRequired: false
    };
    public elementDisabled: any = {
        isPremisesDisabled: true,
        newServiceBranchNumber: true,
        isContractSalesEmployeeDisabled: true
    };
    // Form Modes
    public formModes: any = {
        addMode: false,
        updateMode: true,
        selectMode: false
    };
    public isRequesting: boolean = false;
    public pageTitle: string = '';
    public showHeader: boolean = false;
    public showPromptMessageHeader: boolean = false;
    // Service Params
    private readonly serviceParams: any = {
        method: 'contract-management/maintenance',
        module: 'contract-admin',
        operation: 'Application/iCABSAPostcodeMoveBranch'
    };
    // Service Data
    private pageData: any = {};

    constructor(injector: Injector,
        private titleService: Title) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPOSTCODEMOVEBRANCH;

        // Initialize content components
        this.contractSearchComponent = ContractSearchComponent;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.postcodeSearchComponent = PostCodeSearchComponent;
        this.employeeSearchComponent = EmployeeSearchComponent;

        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;

        // Initialize controls
        this.controls = [
            { name: 'ContractNumber', required: true },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'PremiseNumber', disabled: true, required: true },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'PremiseAddressLine1', disabled: true, required: false },
            { name: 'ServiceBranchNumber', disabled: true, required: false, type: MntConst.eTypeInteger },
            { name: 'NewServiceBranchNumber', required: true, type: MntConst.eTypeInteger },
            { name: 'PremiseAddressLine2', disabled: true, required: false },
            { name: 'PremiseSalesEmployee', readonly: true, disabled: true, required: false },
            { name: 'NewPremiseSalesEmployee', required: true },
            { name: 'PremiseAddressLine3', disabled: true, required: false },
            { name: 'Processas1', readonly: true, disabled: true },
            { name: 'PremiseAddressLine4', required: false },
            { name: 'Processas2', readonly: true, disabled: true },
            { name: 'PremiseAddressLine5', required: false },
            { name: 'CommissionEmployeeCode', required: true },
            { name: 'NewCommissionEmployeeCode', required: true },
            { name: 'PremisePostcode', required: true },
            { name: 'BranchSalesAreaCode', required: true },
            { name: 'BranchServiceAreaCode', required: true },
            { name: 'ContractAddressLine1', readonly: true, disabled: true },
            { name: 'MoveNegBranchYes', readonly: true, disabled: true },
            { name: 'MoveNegBranchNo', readonly: true, disabled: true },
            { name: 'ContractAddressLine2', readonly: true, disabled: true },
            { name: 'NegBranchNumber', disabled: true, type: MntConst.eTypeInteger },
            { name: 'NewNegBranchNumber', required: true, type: MntConst.eTypeInteger },
            { name: 'ContractAddressLine3', readonly: true, disabled: true },
            { name: 'ContractSalesEmployee', readonly: true, disabled: true },
            { name: 'NewContractSalesEmployee', required: true },
            { name: 'ContractAddressLine4', readonly: true, disabled: true },
            { name: 'ContractAddressLine5', readonly: true, disabled: true },
            { name: 'ContractPostcode', readonly: true, disabled: true },
            { name: 'TransferTurnover' },
            { name: 'ProcessType' },
            { name: 'PremisePostcodeDefaults' },
            { name: 'MoveNegBranch' }
        ];
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    // Lifecycle hooks
    public ngAfterViewInit(): void {
        // Display modal
        this.infoModal.childModal.modalConfig = this.modalConfig;
        this.infoModal.childModal.show();

        // Modify control states
        this.toggleRequiredStatus('BranchSalesAreaCode', false);
        this.toggleRequiredStatus('BranchServiceAreaCode', false);

        // Set default value
        this.setControlValue('PremisePostcodeDefaults', 'Default');

        // Disable all controls except ContractNumber
        this.toggleFormDisabledState(true, ['ContractNumber']);

        // Set message call back
        this.setMessageCallback(this);

        // Set error message call back
        this.setErrorCallback(this);

        this.messageModal.config = this.modalConfig;
        this.errorModal.config = this.modalConfig;
        this.autoOpen = true;

        this.getSysChars();

        this.getTranslatedValue('Postcode Move Between Branches', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.titleService.setTitle(res);
                }
            });
        });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // Methods
    /**
     * Set update mode for the forms; BeforeUpdate method from VB script
     * @method setFormModeUpdate
     * @return void
     */
    private setFormModeUpdate(): void {
        // Call base component method to update CBB component state
        this.setFormMode(this.c_s_MODE_UPDATE);
        this.formPristine();

        // Fetch record and populate
        this.fetchRecord();
    }


    /**
     * Called from syschar call back
     * Modifies control states and validators
     * @method modifyControlStates
     * @return void
     */
    private modifyControlStates(): void {
        let status1: boolean = false;
        let status2: boolean = true;

        // Enable controls
        this.toggleDisabled('Processas1', false);
        this.toggleDisabled('Processas2', false);
        this.toggleDisabled('MoveNegBranchNo', false);
        this.toggleDisabled('MoveNegBranchYes', false);

        // Set default values
        this.setControlValue('Processas1', true);
        this.setControlValue('Processas2', false);
        this.setControlValue('MoveNegBranch', 'No');
        this.setControlValue('MoveNegBranchYes', false);
        this.setControlValue('MoveNegBranchNo', true);

        if (this.getControlValue('PremisePostcodeDefaults') === 'Default') {
            status1 = true;
            status2 = false;
        }

        this.toggleDisabled('NewServiceBranchNumber', status1);
        this.toggleDisabled('NewPremiseSalesEmployee', status1);
        this.toggleRequiredStatus('BranchServiceAreaCode', status2);
        this.toggleRequiredStatus('BranchSalesAreaCode', status2);
        this.elementShowHide.serviceAreaCode = status2;
        this.elementShowHide.salesAreaCode = status2;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BranchSalesAreaCode', status2);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BranchServiceAreaCode', status2);

        // Modify town and county
        this.elementShowHide.isControlRequired = false;
        if (this.sysCharParams['EnableValidatePostcodeSuburb'] && this.sysCharParams['EnablePostcodeSuburbLog']) {
            this.elementShowHide.isControlRequired = true;
        }
        this.toggleRequiredStatus('PremiseAddressLine4', this.sysCharParams['EnablePostcodeSuburbLog']);
        this.toggleRequiredStatus('PremiseAddressLine5', this.sysCharParams['EnablePostcodeSuburbLog']);
        this.toggleDisabled('PremiseAddressLine4', !this.sysCharParams['EnableValidatePostcodeSuburb']);
        this.toggleDisabled('PremiseAddressLine5', !this.sysCharParams['EnableValidatePostcodeSuburb']);
    }

    /**
     * Sets required status for the controls; Added a wrapper to riExchange method so that form need not to be passed every time
     * @method toggleRequiredStatus
     * @param control - Control name to set status
     * @param status - On/Off flag for status
     * @return void
     */
    private toggleRequiredStatus(control: string, status: boolean): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, control, status);
    }

    /**
     * Enables/Diasables control; Added a wrapper to riExchange method so that form need not to be passed every time
     * @method toggleDisabled
     * @param control - Control to enable/disable
     * @param disable - Flag to set status
     * @return void
     */
    private toggleDisabled(control: string, disable: boolean): void {
        if (disable) {
            this.riExchange.riInputElement.Disable(this.uiForm, control);
        } else {
            this.riExchange.riInputElement.Enable(this.uiForm, control);
        }
    }

    /**
     * Create comma seperated list of syschars
     * @method createSysCharListForQuery
     * @return string
     */
    private createSysCharListForQuery(): string {
        let sysCharList = [
            this.sysCharConstants.SystemCharEnableRecordingOfNegEmpMoves,
            this.sysCharConstants.SystemCharEnableValidatePostcodeSuburb];

        return sysCharList.join(',');
    }

    /**
     * Fetch syschar values from service
     * @method getSysChars
     * @return void
     */
    private getSysChars(): void {
        let sysCharURLParams: URLSearchParams = this.getURLSearchParamObject();

        // Set list in URL params
        sysCharURLParams.set(this.serviceConstants.SystemCharNumber, this.createSysCharListForQuery());

        // Get syschars
        this.httpService.sysCharRequest(sysCharURLParams).subscribe(
            data => {
                let records: Object;

                // If no record is returned break out
                if (!data || !data.records.length) {
                    return;
                }

                records = data.records;

                // Set syschar params
                this.sysCharParams['enableRecordingOfNegEmpMoves'] = records[0].Required;
                this.sysCharParams['EnableValidatePostcodeSuburb'] = records[1].Required;
                this.sysCharParams['EnablePostcodeSuburbLog'] = records[1].Logical;

                this.modifyControlStates();
            },
            error => {
                this.logger.log(error);
                this.errorService.emitError({
                    msg: MessageConstant.Message.GeneralError
                });
            }
        );
    }

    /**
     * Fetch records from  service
     * @method fetchRecord
     * @return void
     */
    private fetchRecord(): void {
        let contractNumber: string = this.getControlValue('ContractNumber');
        let premiseNumber: string = this.getControlValue('PremiseNumber');
        let fetchURLParams: URLSearchParams = this.getURLSearchParamObject();

        fetchURLParams.set(this.serviceConstants.ContractNumber, contractNumber);
        fetchURLParams.set(this.serviceConstants.PremiseNumber, premiseNumber);
        fetchURLParams.set(this.serviceConstants.Action, '0');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.serviceParams.method,
            this.serviceParams.module,
            this.serviceParams.operation,
            fetchURLParams).subscribe(
            data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorService.emitError({
                        msg: data.errorMessage
                    });
                    this.toggleFormDisabledState(true, ['ContractNumber', 'PremiseNumber']);
                    return;
                }
                // Enable all controls except contract and premise name and contract address details
                this.toggleFormDisabledState(false, ['ContractName', 'PremiseName', 'ContractSalesEmployee', 'NewContractSalesEmployee', 'NegBranchNumber', 'NewNegBranchNumber', 'ServiceBranchNumber', 'PremiseSalesEmployee',
                    'ContractAddressLine1', 'ContractAddressLine2', 'ContractAddressLine3', 'ContractAddressLine4', 'ContractAddressLine5',
                    'ContractPostcode', 'PremiseAddressLine1', 'PremiseAddressLine2', 'PremiseAddressLine3']);
                this.pageData = data;
                this.populateForm();
                this.modifyControlStates();
            },
            error => {
                this.logger.log(error);
                this.errorService.emitError({
                    msg: MessageConstant.Message.GeneralError
                });
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    /**
     * Populate form controls from data
     * @method populateForm
     * @return void
     */
    private populateForm(): void {
        // Remove controls values
        this.setControlValue('NewServiceBranchNumber', '');
        this.setControlValue('NewPremiseSalesEmployee', '');
        this.setControlValue('NewNegBranchNumber', '');
        this.setControlValue('NewContractSalesEmployee', '');
        this.setControlValue('NewCommissionEmployeeCode', '');
        this.setControlValue('BranchSalesAreaCode', '');
        this.setControlValue('BranchServiceAreaCode', '');
        this.setControlValue('NewNegBranchNumber', '');

        // Loop through the data and set value
        for (let key in this.pageData) {
            if (!key) {
                continue;
            }

            this.setControlValue(key.trim(), this.pageData[key]);
        }

        this.ellipsisParams.commisssionEmployeeSearchParams = {
            parentMode: 'LookUp-Commission',
            NewNegBranchNumber: this.pageData['NewNegBranchNumber']
        };
        this.ellipsisParams.newCommisssionEmployeeSearchParams = {
            parentMode: 'LookUp-CommissionBranch-Employee',
            NewNegBranchNumber: this.pageData['ServiceBranchNumber']
        };
        this.ellipsisParams.newPremiseSalesEmployeeSearchParams = {
            parentMode: 'LookUp-PremiseBranch-Employee',
            NewServiceBranchNumber: this.pageData['ServiceBranchNumber']
        };
        this.ellipsisParams.newContractSalesEmployeeSearchParams = {
            parentMode: 'LookUp-ContractBranch-Employee',
            NewNegBranchNumber: this.pageData['ServiceBranchNumber']
        };

        // Set post code search params
        this.ellipsisParams.postcodeSearchParams['PremiseAddressLine4'] = this.getControlValue('PremiseAddressLine4');
        this.ellipsisParams.postcodeSearchParams['PremiseAddressLine5'] = this.getControlValue('PremiseAddressLine5');
        this.ellipsisParams.postcodeSearchParams['PremisePostCode'] = this.getControlValue('PremisePostcode');
    }

    /**
     * Loops through all the controls and enables/disables controls
     * Ingores the controls passed in ignore list
     * @method toggleFormDisableState
     * @param disable - Enable/Disable flag
     * @param ignore - Optional - Controls to be ignored for state change
     * @return void
     */
    private toggleFormDisabledState(disable: boolean, ignore?: Array<string>): void {
        for (let control in this.uiForm.controls) {
            if (!control) {
                continue;
            }

            if (ignore.indexOf(control) < 0) {
                this.toggleDisabled(control, disable);
            }
        }
    }

    /**
     * Checks if the control is disabled
     * Sets ellipsis enable/disable status based on the return
     * @method isControlDisabled
     * @param control - Control to check
     * @return void
     */
    public isControlDisabled(control: string): boolean {
        return this.uiForm.controls[control].disabled;
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    }

    public afterSave(): void {
        let controlStates: boolean = true;

        this.formPristine();

        if (this.getControlValue('PremisePostcodeDefaults') === 'Default') {
            controlStates = false;
        }

        this.toggleDisabled('NewServiceBranchNumber', !controlStates);
        this.toggleDisabled('NewPremiseSalesEmployee', !controlStates);
        this.toggleRequiredStatus('BranchServiceAreaCode', controlStates);
        this.toggleRequiredStatus('BranchSalesAreaCode', controlStates);
        this.elementShowHide.salesAreaCode = controlStates;
        this.elementShowHide.serviceAreaCode = controlStates;

        // Enable CBB component
        this.cbbService.disableComponent(false);
        this.formPristine();
    }

    // Events
    /**
     * Populate contract controls from the data received
     * @method onContractDataReceived
     * @param data - Received from ellipsis
     * @return void
     */
    public onContractDataReceived(data: any): void {
        // Set contract control values
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);

        // Enable premise search ellipsis
        this.elementDisabled.isPremisesDisabled = false;
        // Disable all controls except ContractNumber
        this.toggleFormDisabledState(true, ['ContractNumber', 'PremiseNumber']);
        this.toggleDisabled('PremiseNumber', false);

        this.ellipsisParams.premiseSearchParams = {
            parentMode: 'LookUp',
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName')
        };

        this.getSysChars();

        if (this.getControlValue('PremiseNumber')) {
            this.setFormModeUpdate();
        }

        this.ellipsisParams.newCommisssionEmployeeSearchParams = {
            parentMode: 'LookUp-CommissionBranch-Employee',
            NewNegBranchNumber: this.utils.getBranchCode()
        };
        this.ellipsisParams.newPremiseSalesEmployeeSearchParams = {
            parentMode: 'LookUp-PremiseBranch-Employee',
            NewServiceBranchNumber: this.utils.getBranchCode()
        };
        this.ellipsisParams.newContractSalesEmployeeSearchParams = {
            parentMode: 'LookUp-ContractBranch-Employee',
            NewNegBranchNumber: this.utils.getBranchCode()
        };
    }

    /**
     * Execute lookup and get the contract name
     * @param event - Event object
     * @return void
     */
    public onContractNumberChange(event: any): void {
        let contractNumber: string = this.getControlValue('ContractNumber');
        let lookupContractNameData: Array<any>;


        this.clearControls(['ContractNumber']);
        /**
         * If changed value is null
         *  - modify name to blank
         */
        if (!contractNumber) {
            this.setControlValue('ContractName', '');
            return;
        }

        // Fill leading zero if length is less than 9
        if (contractNumber.length < 9) {
            contractNumber = StaticUtils.fillLeadingZeros(contractNumber, 8);
            this.setControlValue('ContractNumber', contractNumber);
        }

        this.ellipsisParams.premiseSearchParams = {
            parentMode: 'LookUp',
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName'),
            ContractTypeCode: 'C'
        };

        // Set lookup parameter
        lookupContractNameData = [{
            'table': 'Contract',
            'query': { 'ContractNumber': contractNumber, 'ContractTypeCode': 'C' },
            'fields': ['ContractName']
        }];

        // Get the  contract name if not populated
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(lookupContractNameData).then(
            data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                // Enable premise search ellipsis
                this.elementDisabled.isPremisesDisabled = false;
                this.toggleDisabled('PremiseNumber', false);

                if (!data[0].length) {
                    this.setControlValue('ContractName', '');
                    return;
                }
                this.setControlValue('ContractName', data[0][0].ContractName);

                if (this.getControlValue('PremiseNumber')) {
                    this.setFormModeUpdate();
                }
            }
        ).catch(
            error => {
                this.logger.error(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    /**
     * Populate premise controls from the data recevied
     * @method onPremiseDataReceived
     * @param data - Data received from ellipsis
     * @return void
     */
    public onPremiseDataReceived(data: any): void {
        this.setControlValue('PremiseNumber', data.PremiseNumber);
        this.setControlValue('PremiseName', data.PremiseName);

        // Set form mode to update
        this.setFormModeUpdate();
    }

    /**
     * Execute lookup and get the premise name
     * @method onPremisesNumberChange
     * @param event - Event object
     * @return void
     */
    public onPremisesNumberChange(event: any): void {
        let contractNumber: string = this.getControlValue('ContractNumber');
        let premiseNumber: string = this.getControlValue('PremiseNumber');
        let lookupPremiseNameData: Array<any>;

        // Break if changed value is null and modify name to blank
        if (!premiseNumber) {
            this.clearControls(['ContractNumber', 'ContractName', 'PremiseNumber']);
            return;
        }

        // Set lookup parameter
        lookupPremiseNameData = [{
            'table': 'Premise',
            'query': { 'PremiseNumber': premiseNumber, 'ContractNumber': contractNumber, 'ContractTypeCode': 'C' },
            'fields': ['PremiseName']
        }];

        // Get the  contract name if not populated
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(lookupPremiseNameData).then(
            data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                // Set form mode to update
                this.setFormModeUpdate();
                if (!data[0].length) {
                    return;
                }
                this.setControlValue('PremiseName', data[0][0].PremiseName);
            }
        ).catch(
            error => {
                this.logger.error(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    /**
     * Executes on change of Processas1 checkbox
     * @method onProcessAsTransferChange
     * @param event - Event object
     * @return void
     */
    public onProcessAsTransferChange(event: any): void {
        let status: boolean = false;
        let processTypeValue: string = 'Transfer';

        if (!this.getControlValue('Processas1')) {
            processTypeValue = 'Cancellation';
            status = true;
        }

        this.setControlValue('Processas2', status);
        this.setControlValue('ProcessType', processTypeValue);
        this.elementShowHide.transferTurnover = !status;
    }

    /**
     * Executes on change of Processas2 checkbox
     * @method onCancellationChange
     * @param event - Event object
     * @return void
     */
    public onCancellationChange(event: any): void {
        let status: boolean = false;
        let processTypeValue: string = 'Cancellation';

        if (!this.getControlValue('Processas2')) {
            processTypeValue = 'Transfer';
            status = true;
        }

        this.setControlValue('Processas1', status);
        this.setControlValue('ProcessType', processTypeValue);
        this.elementShowHide.transferTurnover = status;
    }

    /**
     * Executes on change of MoveNegBranchYes checkbox
     * @method onMoveNegBranchYesChange
     * @param event - Event object
     * @return void
     */
    public onMoveNegBranchYesChange(event: any): void {
        let moveNegBranch: string = 'No';
        let status: boolean = true;
        let postCodeDefaultsStatus: boolean = true;

        if (this.getControlValue('MoveNegBranchYes')) {
            moveNegBranch = 'Yes';
            status = false;
            postCodeDefaultsStatus = false;
            if (this.getControlValue('PremisePostcodeDefaults') === 'Default') {
                postCodeDefaultsStatus = true;
            }
        }

        // Modify the controls
        this.setControlValue('MoveNegBranch', moveNegBranch);
        this.setControlValue('MoveNegBranchNo', status);
        this.elementDisabled.isContractSalesEmployeeDisabled = postCodeDefaultsStatus;
        this.toggleDisabled('NewContractSalesEmployee', postCodeDefaultsStatus);
        this.toggleDisabled('NewNegBranchNumber', postCodeDefaultsStatus);
    }

    /**
     * Executes on change of MoveNegBranchNo checkbox
     * @method onMoveNegBranchNoChange
     * @param event - Event object
     * @return void
     */
    public onMoveNegBranchNoChange(event: any): void {
        let moveNegBranch: string = 'Yes';
        let status: boolean = true;
        let postCodeDefaultsStatus: boolean = false;

        if (this.getControlValue('MoveNegBranchNo')) {
            moveNegBranch = 'No';
            status = false;
            postCodeDefaultsStatus = true;
            if (this.getControlValue('PremisePostcodeDefaults') !== 'Default') {
                postCodeDefaultsStatus = false;
            }
        }

        // Modify the controls
        this.setControlValue('MoveNegBranch', moveNegBranch);
        this.setControlValue('MoveNegBranchYes', status);
        this.elementDisabled.isContractSalesEmployeeDisabled = postCodeDefaultsStatus;
        this.toggleDisabled('NewContractSalesEmployee', true);
        this.toggleDisabled('NewNegBranchNumber', true);
    }

    public onPremisesStateTownPostcodeChange(event: any): void {
        this.ellipsisParams.postcodeSearchParams['PremiseAddressLine4'] = this.getControlValue('PremiseAddressLine4');
        this.ellipsisParams.postcodeSearchParams['PremiseAddressLine5'] = this.getControlValue('PremiseAddressLine5');
        this.setControlValue('PremisePostcode', this.getControlValue('PremisePostcode').toUpperCase());
        this.ellipsisParams.postcodeSearchParams['PremisePostCode'] = this.getControlValue('PremisePostcode');

        this.postCodeChange();
    }

    /**
     * Populate town, country, postcode when data receieved
     * @method onPostcodeDataReceived
     * @param data - data sent from ellipsis component
     * @return void
     */
    public onPostcodeDataReceived(data: any): void {
        if (data.PremisePostcode) {
            this.setControlValue('PremisePostcode', data.PremisePostcode);
        }
        if (data.PremiseAddressLine4) {
            this.setControlValue('PremiseAddressLine4', data.PremiseAddressLine4);
        }
        if (data.PremiseAddressLine5) {
            this.setControlValue('PremiseAddressLine5', data.PremiseAddressLine5);
        }
    }

    private postCodeChange(): void {
        let formData: any = {};
        let postCodeChangeParams: URLSearchParams = this.getURLSearchParamObject();
        let requestParams: Array<string> = [
            'PremiseNumber',
            'ContractNumber',
            'PremisePostcode',
            'PremiseAddressLine4',
            'PremiseAddressLine5',
            'ProcessType',
            'MoveNegBranch',
            'PremiseSalesEmployee',
            'CommissionEmployeeCode',
            'TransferTurnover'
        ];

        postCodeChangeParams.set(this.serviceConstants.Action, '6');
        formData['Function'] = 'GetBranch';
        formData['BranchNumber'] = this.utils.getBranchCode();

        for (let i = 0; i < requestParams.length; i++) {
            let name: string = requestParams[i];
            if (this.getControlValue(name)) {
                formData[name] = this.getControlValue(name);
            }
        }


        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.xhrPost(
            this.serviceParams.method,
            this.serviceParams.module,
            this.serviceParams.operation,
            postCodeChangeParams,
            formData
        ).then(
            data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorService.emitError({
                        msg: data.errorMessage
                    });
                    return;
                }

                // Loop through data and populate controls
                for (let key in data) {
                    if (!key) {
                        continue;
                    }
                    this.setControlValue(key, data[key]);
                }
                this.setControlValue('NewCommissionEmployeeCode', data['NewPremiseSalesEmployee']);
            }
            ).catch(
            error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log(error);
                this.errorService.emitError({
                    msg: MessageConstant.Message.GeneralError
                });
            }
            );
    }

    /**
     * Populate new contract employee data
     * One function will be called from all 3 employee search ellipsis
     * @method onEmployeeDataReceived
     * @param control - Control name to populate data
     * @param data - Data recieved from employee search
     * @return void
     */
    public onEmployeeDataReceived(control: string, data: any): void {
        this.setControlValue(control, data[control] || '');
    }

    /**
     * @method onMessageClose
     * @return void
     */
    public onMessageClose(): void {
        this.infoModal.hide();
    }

    public confirmSave(): void {
        let isValidForm: boolean = this.riExchange.validateForm(this.uiForm);

        if (!isValidForm) {
            return;
        }

        this.promptConfirmModal.show();
    }

    /**
     * Executes save logic
     * @method saveData
     * @param $event - Event object
     * @return void
     */
    public saveData(event: any): void {
        let formData: any = {};
        let saveQueryParams: URLSearchParams = this.getURLSearchParamObject();

        // Save logic
        for (let control in this.uiForm.controls) {
            if (!control) {
                continue;
            }
            formData[control] = this.getControlValue(control);
        }
        formData['ContractROWID'] = this.pageData.Contract;
        saveQueryParams.set(this.serviceConstants.Action, '2');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(
            this.serviceParams.method,
            this.serviceParams.module,
            this.serviceParams.operation,
            saveQueryParams,
            formData
        ).subscribe(
            data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorService.emitError({
                        msg: data.errorMessage
                    });
                    return;
                }
                this.afterSave();

                if (data.InfoMessage) {
                    this.messageService.emitMessage({
                        msg: data.InfoMessage
                    });
                    this.onMessageModalClose = function (): void {
                        this.onMessageModalClose = this.utils.noop;
                        this.messageService.emitMessage({
                            msg: MessageConstant.Message.SavedSuccessfully
                        });
                    };
                    return;
                }

                this.onMessageModalClose = this.utils.noop;
                this.messageService.emitMessage({
                    msg: MessageConstant.Message.SavedSuccessfully
                });
            },
            error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log(error);
                this.errorService.emitError({
                    msg: MessageConstant.Message.GeneralError
                });
            }
            );
    }

    /**
     * Cancel all updates and reset form
     */
    public cancelData(): void {

        this.populateForm();
        this.toggleDisabled('NewNegBranchNumber', true);
        this.toggleDisabled('NewContractSalesEmployee', true);
        this.setFormModeUpdate();
        this.formPristine();
    }

    public onNewServiceBranchNumberChange(): void {
        this.ellipsisParams.newPremiseSalesEmployeeSearchParams = {
            parentMode: 'LookUp-PremiseBranch-Employee',
            NewServiceBranchNumber: this.getControlValue('NewServiceBranchNumber')
        };
        this.ellipsisParams.newCommisssionEmployeeSearchParams = {
            parentMode: 'LookUp-CommissionBranch-Employee',
            NewNegBranchNumber: this.getControlValue('NewServiceBranchNumber')
        };
    }

    public onNewNegBranchNumberChange(): void {
        this.ellipsisParams.newContractSalesEmployeeSearchParams = {
            parentMode: 'LookUp-ContractBranch-Employee',
            NewNegBranchNumber: this.getControlValue('NewNegBranchNumber')
        };
    }

    public capitialize(control: string): void {
        this.setControlValue(control, this.getControlValue(control).toUpperCase());
    }

    public clearControls(ignore: Array<string>): void {
        for (let control in this.uiForm.controls) {
            if (control && ignore.indexOf(control) < 0) {
                this.uiForm.controls[control].setValue('');
                this.toggleDisabled(control, true);
            }
        }
    }

    // tslint:disable-next-line:no-empty
    public onMessageModalClose(): void {
    }
}
