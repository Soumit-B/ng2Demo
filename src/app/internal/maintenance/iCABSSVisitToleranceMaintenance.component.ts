import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { Component, OnInit, Injector, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { RiExchange } from './../../../shared/services/riExchange';
import { Subscription } from 'rxjs/Subscription';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';

import { GroupAccountNumberComponent } from './../../internal/search/iCABSSGroupAccountNumberSearch';
import { AccountSearchComponent } from './../../internal/search/iCABSASAccountSearch';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSSVisitToleranceMaintenance.html'
})
export class VisitToleranceMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('promptModal') public promptModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('ContractSearchComponent') ContractSearchComponent;
    @ViewChild('PremiseSearchEllipsis') PremiseSearchComponent;
    @ViewChild('productSearchEllipsis') productSearchEllipsis: EllipsisComponent;

    public queryParams: any = {
        operation: 'System/iCABSSVisitToleranceMaintenance',
        module: 'csi',
        method: 'service-planning/admin',
        ActionSearch: '0',
        Actionupdate: '6',
        ActionEdit: '2',
        ActionDelete: '3',
        ActionInsert: '1'
    };

    // Prompt Modal popup
    public promptTitle: string;
    public promptContent: string;
    public showPromptHeader: boolean = true;

    // Local String Variables
    public pageId: string;
    public mode: string;
    public selectedTolTableType: string;
    public selectedType: string;

    // Local Array variables
    public routeParams: any = {};
    public saveDataAdd: any = {};
    public saveDataDelete: any = {};

    // Local boolean variable
    public IsValidField: boolean;
    public isRequesting: boolean = false;
    public IsAddEnable: boolean = true;
    public IsUpdateEnable: boolean = true;
    public IsDeleteEnable: boolean = false;
    public setFocusOnAccount = new EventEmitter<boolean>();

    public controls = [
        { name: 'AccountNumber', type: MntConst.eTypeText },
        { name: 'AccountName', type: MntConst.eTypeText },
        { name: 'GroupAccountNumber', type: MntConst.eTypeInteger },
        { name: 'GroupName', type: MntConst.eTypeText },
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc', type: MntConst.eTypeText },
        { name: 'SelTolTableType', type: MntConst.eTypeCode },
        { name: 'SelType', type: MntConst.eTypeCode },
        { name: 'VisitFrequency', disabled: false, required: true, type: MntConst.eTypeInteger },
        { name: 'Tolerance', disabled: false, required: true, type: MntConst.eTypeInteger },
        { name: 'ClearVisit', type: MntConst.eTypeInteger },
        { name: 'FinalFollowUp', type: MntConst.eTypeInteger },
        // hidden
        { name: 'ServiceCoverNumber', type: MntConst.eTypeInteger },
        { name: 'ServiceCoverRowID', type: MntConst.eTypeText },
        { name: 'TolTableType', type: MntConst.eTypeCode },
        { name: 'TypeText', type: MntConst.eTypeText },
        // button
        { name: 'save' },
        { name: 'cancel' },
        { name: 'delete' }
    ];

    // inputParams for Ellipsis
    public ellipsis = {
        groupaccount: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'currentContractType': this.routeParams.currentContractType,
                'currentContractTypeURLParameter': this.routeParams.currentContractTypeLabel
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: GroupAccountNumberComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        account: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'currentContractType': this.routeParams.currentContractType,
                'currentContractTypeURLParameter': this.routeParams.currentContractTypeLabel
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: AccountSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        contract: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-All',
                'currentContractType': this.routeParams.currentContractType,
                'currentContractTypeURLParameter': this.routeParams.currentContractTypeLabel,
                'showAddNew': false,
                'AccountNumber': '',
                'AccountName': ''
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
        premises: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'currentContractType': this.routeParams.currentContractType,
                'currentContractTypeURLParameter': this.routeParams.currentContractTypeLabel
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: PremiseSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        product: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'PremiseNumber': '',
                'PremiseName': '',
                'ProductCode': '',
                'ProductDesc': '',
                'currentContractType': this.routeParams.currentContractType,
                'currentContractTypeURLParameter': this.routeParams.currentContractTypeLabel
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ServiceCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            closeModalManual: false,
            disabled: false
        }
    };

    // Select Dropdown List array
    public SelTolTableTypeArray: Array<any>;

    public SelTypeArry: Array<any>;


    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSVISITTOLERANCEMAINTENANCE;
        this.setCurrentContractType();
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
        this.handleBackNavigation(this);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.mode = 'NEUTRAL';
        this.window_onload();
    }

    public window_onload(): void {
        this.routeParams = this.riExchange.getRouterParams();
        this.pageTitle = 'Visit Tolerance Maintenance';
        this.utils.setTitle(this.pageTitle);
        this.getSysCharDtetails(); // set System Charecters - SPEED SCRIPT
        this.setDefaultFormData();
        this.pageParams.productCodeOpenModal = false;
        // if (this.mode === 'NEUTRAL') {
        //     this.populateDescriptions();
        // }
    }

    public getURLQueryParameters(param: any): void {
        if (param['Mode']) {
            this.pageParams.ParentMode = param['Mode'];
        } else {
            this.pageParams.ParentMode = this.riExchange.getParentMode();
        }
        this.routeParams.CurrentContractTypeURLParameter = param['currentContractTypeURLParameter'];
        this.routeParams.currentContractType = param['currentContractTypeURLParameter'];
    }

    public setCurrentContractType(): void {
        this.routeParams.currentContractType =
            this.utils.getCurrentContractType(this.routeParams.CurrentContractTypeURLParameter);
        this.routeParams.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.routeParams.CurrentContractTypeURLParameter);
    }

    public getSysCharDtetails(): any {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableWeeklyVisitPattern // SYSTEMCHAR_EnableWeeklyVisitPattern
        ];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vbVisitPatternRequired = !(record[0]['Required']);
            this.pageParams.vbVisitPatternLogical = !(record[0]['Logical']);
        });
    }

    public setDefaultFormData(): void {
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'GroupName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');

        this.SelTolTableTypeArray = [
            { title: 'Business', value: '1' },
            { title: 'Contract', value: '2' },
            { title: 'Premise', value: '3' },
            { title: 'Service Cover', value: '4' },
            { title: 'Account', value: '5' },
            { title: 'Group Account', value: '6' }
        ];

        this.SelTypeArry = [
            { title: 'Annually', value: 'Annually' },
            { title: 'Bi-Annually', value: 'Bi-Annually' },
            { title: 'Quarterly', value: 'Quarterly' },
            { title: 'Monthly', value: 'Monthly' },
            { title: '4 Weekly', value: '4 Weekly' },
            { title: 'Weekly', value: 'Weekly' }
        ];

        switch (this.pageParams.ParentMode) {
            case 'AddVisitTolerance':
            case 'VisitToleranceAdd':
                this.IsDeleteEnable = false;
                this.btnAddOnClick();
                break;
            case 'VisitToleranceGrid':
                this.mode = 'UPDATE';
                this.IsAddEnable = false;
                this.IsDeleteEnable = true;
                this.riExchange.riInputElement.Enable(this.uiForm, 'delete');
                this.formData.VisitToleranceRowID = this.riExchange.getBridgeObjValue('VisitToleranceRowID');
                this.fetchRecord();
                this.disableFields();
                break;
            default:
                this.fetchRecord();
        }
    }

    public isNumValidatorVisitFrequency(e: any): void {
        if (this.riExchange.riInputElement.isNumber(this.uiForm, 'VisitFrequency') && this.getControlValue('VisitFrequency')) {
            this.setControlValue('VisitFrequency', parseInt(this.getControlValue('VisitFrequency'), 10));
        } else {
            this.setControlValue('VisitFrequency', '');
        }
    }

    public isNumValidatorTolerance(e: any): void {
        if (this.riExchange.riInputElement.isNumber(this.uiForm, 'Tolerance') && this.getControlValue('Tolerance')) {
            this.setControlValue('Tolerance', parseInt(this.getControlValue('Tolerance'), 10));
        } else {
            this.setControlValue('Tolerance', '');
        }
    }

    public isNumValidatorClearVisit(e: any): void {
        if (this.riExchange.riInputElement.isNumber(this.uiForm, 'ClearVisit') && this.getControlValue('ClearVisit')) {
            this.setControlValue('ClearVisit', parseInt(this.getControlValue('ClearVisit'), 10));
        } else {
            this.setControlValue('ClearVisit', '');
        }
    }

    public isNumValidatorFinalFollowUp(e: any): void {
        if (this.riExchange.riInputElement.isNumber(this.uiForm, 'FinalFollowUp') && this.getControlValue('FinalFollowUp')) {
            this.setControlValue('FinalFollowUp', parseInt(this.getControlValue('FinalFollowUp'), 10));
        } else {
            this.setControlValue('FinalFollowUp', '');
        }
    }

    public fetchRecord(): void {
        this.setControlValue('GroupAccountNumber', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'GroupAccountNumber', true));
        this.setControlValue('GroupName', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'GroupName', true));
        this.setControlValue('AccountNumber', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'AccountNumber', true));
        this.setControlValue('AccountName', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'AccountName', true));
        this.setControlValue('ContractNumber', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'ContractNumber', true));
        this.setControlValue('ContractName', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'ContractName', true));
        this.setControlValue('PremiseNumber', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'PremiseNumber', true));
        this.setControlValue('PremiseName', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'PremiseName', true));
        this.setControlValue('ProductCode', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'ProductCode', true));
        this.setControlValue('ProductDesc', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'ProductDesc', true));
        this.setControlValue('ServiceCoverNumber', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'ServiceCoverNumber', true));
        this.setControlValue('ServiceCoverRowID', this.riExchange.getParentAttributeValue('VisitToleranceRowID') || this.riExchange.GetParentHTMLInputValue(this.uiForm, 'ServiceCoverRowID', true));
        this.formData.VisitToleranceRowID = this.riExchange.getParentAttributeValue('VisitToleranceRowID') || this.riExchange.getBridgeObjValue('VisitToleranceRowID');
        if (this.mode === 'ADD') {
            this.selectedTolTableType = '1';
            this.selectedType = 'Annually';

            this.ellipsis.contract.childConfigParams.AccountNumber = this.getControlValue('AccountNumber') || '';
            this.ellipsis.contract.childConfigParams.AccountName = this.getControlValue('AccountName') || '';

            this.ellipsis.premises.childConfigParams.ContractNumber = this.getControlValue('ContractNumber') || '';
            this.ellipsis.premises.childConfigParams.ContractName = this.getControlValue('ContractName') || '';

            this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber') || '';
            this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName') || '';
            this.ellipsis.product.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber') || '';
            this.ellipsis.product.childConfigParams.PremiseName = this.getControlValue('PremiseName') || '';
        } else {
            this.fetchGridRecord();
        }
    }

    public fetchGridRecord(): void {
        let GetParentHTMLGridData = this.riExchange.GetParentHTMLInputValue(this.uiForm, 'gridData', true);
        if (GetParentHTMLGridData) {
            switch (GetParentHTMLGridData.rowData['Tolerance Table Type']) {
                case 'Business':
                    this.selectedTolTableType = '1';
                    break;
                case 'Contract':
                    this.selectedTolTableType = '2';
                    break;
                case 'Premise':
                    this.selectedTolTableType = '3';
                    break;
                case 'Service Cover':
                    this.selectedTolTableType = '4';
                    break;
                case 'Account':
                    this.selectedTolTableType = '5';
                    break;
                case 'Group Account':
                    this.selectedTolTableType = '6';
                    break;
                default:
                    this.selectedTolTableType = '1';
                    break;
            }
            this.selectedType = GetParentHTMLGridData.rowData['Type'];
            this.setControlValue('VisitFrequency', GetParentHTMLGridData.rowData['Visit Frequency']);
            this.setControlValue('TolTableType', GetParentHTMLGridData.rowData['Tolerance Table Type']);
            this.setControlValue('TypeText', GetParentHTMLGridData.rowData['Type']);
            this.setControlValue('Tolerance', GetParentHTMLGridData.rowData['Tolerance']);
            this.setControlValue('ClearVisit', GetParentHTMLGridData.rowData['Clear Visit']);
            this.setControlValue('FinalFollowUp', GetParentHTMLGridData.rowData['Final Follow Up']);
        }
    }

    public riMaintenanceSearch(): void {
        // TODO: this.navigate('Search', '/path/to/System/iCABSSSystemPDAActivityStatusSearchComponent');
    }

    public accountNumberFormatOnChange(): void {
        let paddedValue = this.utils.numberPadding(this.getControlValue('AccountNumber'), 9);
        this.setControlValue('AccountNumber', paddedValue);
    }

    public contractNumberFormatOnChange(): void {
        let paddedValue = this.utils.numberPadding(this.getControlValue('ContractNumber'), 8);
        this.setControlValue('ContractNumber', paddedValue);
    }

    public accountNumberOnkeydown(obj: any, call: boolean): void {
        if (call) {
            if (obj.AccountNumber) {
                this.setControlValue('AccountNumber', obj.AccountNumber);
            }
            if (obj.AccountName) {
                this.setControlValue('AccountName', obj.AccountName);
            }

            this.ellipsis.contract.childConfigParams.AccountNumber = this.getControlValue('AccountNumber') ? this.getControlValue('AccountNumber') : '';
            this.ellipsis.contract.childConfigParams.AccountName = this.getControlValue('AccountName') ? this.getControlValue('AccountName') : '';
        }
    }

    public groupAccountNumberOnkeydown(obj: any, call: boolean): void {
        if (call) {
            if (obj.GroupAccountNumber) {
                this.setControlValue('GroupAccountNumber', obj.GroupAccountNumber);
            }
            if (obj.GroupName) {
                this.setControlValue('GroupName', obj.GroupName);
            }
        }
    }

    public contractNumberOnkeydown(obj: any, call: boolean): void {
        if (call) {
            if (obj.ContractNumber) {
                this.setControlValue('ContractNumber', obj.ContractNumber);
            }
            if (obj.ContractName) {
                this.setControlValue('ContractName', obj.ContractName);
            }

            this.ellipsis.premises.childConfigParams.ContractNumber = this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '';
            this.ellipsis.premises.childConfigParams.ContractName = this.getControlValue('ContractName') ? this.getControlValue('ContractName') : '';

            this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '';
            this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName') ? this.getControlValue('ContractName') : '';
        }
    }

    public premiseNumberOnkeydown(obj: any, call: boolean): void {
        if (call) {
            if (obj.PremiseNumber) {
                this.setControlValue('PremiseNumber', obj.PremiseNumber);
            }
            if (obj.PremiseName) {
                this.setControlValue('PremiseName', obj.PremiseName);
            }

            this.ellipsis.product.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '';
            this.ellipsis.product.childConfigParams.PremiseName = this.getControlValue('PremiseName') ? this.getControlValue('PremiseName') : '';
        }
    }

    public productCodeOnkeydown(obj: any, call: boolean): void {
        if (call) {
            if (obj.ProductCode) {
                this.setControlValue('ProductCode', obj.ProductCode);
            }
            if (obj.ProductDesc) {
                this.setControlValue('ProductDesc', obj.ProductDesc);
            }
        }
    }

    public accountNumberOnchange(): void {
        if (this.getControlValue('AccountNumber')) {
            this.accountNumberFormatOnChange();
            this.populateDescriptions();
        } else {
            this.setControlValue('AccountName', '');
        }
    }

    public groupAccountNumberOnchange(): void {
        if (this.getControlValue('GroupAccountNumber')) {
            this.populateDescriptions();
        }
    }

    public contractNumberOnchange(): void {
        //set parameters
        if (this.getControlValue('ContractNumber')) {
            this.contractNumberFormatOnChange();
            this.populateDescriptions();
        } else {
            this.setControlValue('ContractName', '');
        }
    }

    public premiseNumberOnchange(): void {
        if (this.getControlValue('PremiseNumber')) {
            this.populateDescriptions();
        } else {
            this.setControlValue('PremiseName', '');
        }
    }

    public productCodeOnchange(): void {
        //set parameters
        if (this.getControlValue('ProductCode')) {
            this.populateDescriptions();
        } else {
            this.setControlValue('ProductDesc', '');
        }
    }

    public populateDescriptions(): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        //set parameters
        if (this.getControlValue('ContractNumber')) {
            this.contractNumberFormatOnChange();
        }
        let postData: any = {};
        if (this.getControlValue('ContractNumber')) postData.ContractNumber = this.getControlValue('ContractNumber');
        if (this.getControlValue('AccountNumber')) postData.AccountNumber = this.getControlValue('AccountNumber');
        if (this.getControlValue('PremiseNumber')) postData.PremiseNumber = this.getControlValue('PremiseNumber');
        if (this.getControlValue('ProductCode')) postData.ProductCode = this.getControlValue('ProductCode');
        if (this.getControlValue('ServiceCoverRowID')) postData.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
        if (this.getControlValue('GroupAccountNumber')) postData.GroupAccountNumber = this.getControlValue('GroupAccountNumber');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, postData)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (data.ContractName) {
                        this.setControlValue('ContractName', data.ContractName);
                    } else {
                        this.setControlValue('ContractNumber', '');
                    }
                    if (data.PremiseName) {
                        this.setControlValue('PremiseName', data.PremiseName);
                    } else {
                        this.setControlValue('PremiseNumber', '');
                    }
                    if (data.ProductDesc) {
                        this.setControlValue('ProductDesc', data.ProductDesc);
                    } else {
                        this.setControlValue('ProductCode', '');
                    }
                    if (data.ServiceCoverNumber === '0') {
                        this.setControlValue('ServiceCoverNumber', '');
                    }
                    if (data.AccountName === null)
                        this.setControlValue('AccountName', '');
                    if (data.GroupAccountNumber === '0') {
                        this.setControlValue('GroupAccountNumber', '');
                    }
                    if (data.GroupName === null)
                        this.setControlValue('GroupName', '');
                    if (data.ServiceCoverNumber === null) {
                        this.setAttribute('ServiceCoverRowID', '');
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public btnAddOnClick(): void {
        this.mode = 'ADD';
        this.setFocusOnAccount.emit(true);
        this.fetchRecord();
        this.enableFields();
    }

    public btnUpdateOnClick(): void {
        this.mode = 'UPDATE';
    }

    public btnDeleteOnClick(): void {
        this.mode = 'DELETE';
        this.disableFields();
        this.promptTitle = MessageConstant.Message.DeleteRecord;
        this.promptModal.show();
    }

    public productCode_onCloseModal(event: any): void {
        this.pageParams.productCodeOpenModal = false;
        this.confirm();
    }

    public enableFields(): void {
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelTolTableType');
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelType');
        this.riExchange.riInputElement.Enable(this.uiForm, 'GroupAccountNumber');
        this.riExchange.riInputElement.Enable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Enable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Enable(this.uiForm, 'ProductCode');
        this.riExchange.riInputElement.Enable(this.uiForm, 'VisitFrequency');
    }

    public disableFields(): void {
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelTolTableType');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelType');
        this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'VisitFrequency');
        this.populateDescriptions();
    }

    public validateField(data: any): boolean {
        if (data !== null
            && data !== 'undefined'
            && data !== '') {
            return true;
        } else {
            return false;
        }
    }

    public riMaintenance_BeforeSave(): void {
        this.setControlValue('TolTableType', this.getControlValue('SelTolTableType'));
        this.setControlValue('TypeText', this.getControlValue('SelType'));
        if (this.validateField(this.getControlValue('ContractNumber'))
            && this.validateField(this.getControlValue('PremiseNumber'))
            && this.validateField(this.getControlValue('ProductCode'))
            && this.getControlValue('ServiceCoverNumber') === '') {
            this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber') || '';
            this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName') || '';
            this.ellipsis.product.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber') || '';
            this.ellipsis.product.childConfigParams.PremiseName = this.getControlValue('PremiseName') || '';
            this.ellipsis.product.childConfigParams.ProductCode = this.getControlValue('ProductCode') || '';
            this.ellipsis.product.childConfigParams.ProductDesc = this.getControlValue('ProductDesc') || '';
            this.productSearchEllipsis.openModal();
            this.pageParams.productCodeOpenModal = true;
        }
    }

    public riMaintenance_BeforeAdd(): void {
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelTolTableType');
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelType');
    }

    public riMaintenance_BeforeSelect(): void {
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelTolTableType');
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelType');
    }

    public riMaintenance_BeforeUpdate(): void {
        this.disableFields();
    }

    /*
   Method: onAbandon():
   Params:
   Details: Cancels your current action
   */
    public onAbandon(): void {
        this.mode = 'NEUTRAL';
        this.redirectToParent();
    }

    public redirectToParent(): void {
        this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSSVISITTOLERANCEGRID], {
            queryParams: {
                parentMode: this.riExchange.GetParentHTMLInputValue(this.uiForm, 'ParentPageMode', true),
                currentContractTypeURLParameter: this.routeParams.currentContractType,
                ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                CurrentServiceCoverRowID: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID')
            }
        });
    }

    /*
    Method: onSubmit():
    Params:
    Details: Add or Updates record
    */
    public onSubmit(): void {
        this.riMaintenance_BeforeSave();
        this.riExchange.validateForm(this.uiForm);
        if (!this.pageParams.productCodeOpenModal) {
            this.confirm();
        }
    }

    public confirm(): void {
        if (this.uiForm.status === 'VALID') {
            this.promptTitle = MessageConstant.Message.ConfirmRecord;
            this.promptModal.show();
        }
    }
    /*
   Method: promptCancel():
   Params:
   Details: Called if prompt gets Cancel
   */
    public promptCancel(event: any): void {
        if (this.mode === 'DELETE') {
            this.mode = 'NEUTRAL';
        }
        if (this.mode === 'ADD') {
            this.mode = 'ADD';
        }
        if (this.mode === 'UPDATE') {
            this.mode = 'NEUTRAL';
            this.fetchGridRecord();
        }
    }
    /*
    Method: promptSave():
    Params:
    Details: Called if prompt gets Yes
    */
    public promptSave(event: any): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        if (this.mode === 'ADD') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionInsert);
            this.saveDataAdd.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
        }
        if (this.mode === 'UPDATE') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
            this.saveDataAdd.VisitToleranceROWID = this.formData.VisitToleranceRowID ? this.formData.VisitToleranceRowID : this.getControlValue('ServiceCoverRowID');
            this.saveDataAdd.ServiceCoverRowID = '';
        }
        if (this.mode === 'DELETE') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionDelete);
        }
        if (this.mode === 'ADD' || this.mode === 'UPDATE') {
            //set parameters
            this.saveDataAdd.AccountNumber = this.getControlValue('AccountNumber');
            this.saveDataAdd.AccountName = this.getControlValue('AccountName');
            this.saveDataAdd.GroupAccountNumber = this.getControlValue('GroupAccountNumber');
            this.saveDataAdd.GroupName = this.getControlValue('GroupName');
            this.saveDataAdd.ContractNumber = this.getControlValue('ContractNumber');
            this.saveDataAdd.ContractName = this.getControlValue('ContractName');
            this.saveDataAdd.PremiseNumber = this.getControlValue('PremiseNumber');
            this.saveDataAdd.PremiseName = this.getControlValue('PremiseName');
            this.saveDataAdd.ProductCode = this.getControlValue('ProductCode');
            this.saveDataAdd.ProductDesc = this.getControlValue('ProductDesc');
            this.saveDataAdd.TolTableType = this.getControlValue('SelTolTableType');
            this.saveDataAdd.Type = this.getControlValue('SelType');
            this.saveDataAdd.ServiceVisitFrequency = this.getControlValue('VisitFrequency');
            this.saveDataAdd.Tolerance = this.getControlValue('Tolerance');
            this.saveDataAdd.ClearVisit = this.getControlValue('ClearVisit');
            this.saveDataAdd.FinalFollowUp = this.getControlValue('FinalFollowUp');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, query, this.saveDataAdd)
                .subscribe(
                (e) => {
                    if (e.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                    } else {
                        this.formPristine();
                        this.redirectToParent();
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.onAbandon();
                });
        }
        if (this.mode === 'DELETE') {
            this.saveDataDelete.ROWID = this.formData.VisitToleranceRowID ? this.formData.VisitToleranceRowID : this.getControlValue('ServiceCoverRowID');
            this.saveDataDelete.Table = 'VisitTolerance';

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, query, this.saveDataDelete)
                .subscribe(
                (e) => {
                    if (e.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                    } else {
                        this.formPristine();
                        this.onAbandon();
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.onAbandon();
                });
        }
    }
}
