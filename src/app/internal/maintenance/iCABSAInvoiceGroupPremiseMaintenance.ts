import { FormGroup, FormControl } from '@angular/forms';
import { CBBService } from './../../../shared/services/cbb.service';
import { PremiseSearchComponent } from '../search/iCABSAPremiseSearch';
import { BehaviorSubject, Observable, Subscription } from 'rxjs/Rx';
import { InvoiceGroupGridComponent } from '../grid-search/iCABSAInvoiceGroupGrid';
import { Utils } from '../../../shared/services/utility';
import { SysCharConstants } from '../../../shared/constants/syscharservice.constant';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { PageDataService } from '../../../shared/services/page-data.service';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from '../../../shared/services/message.service';
import { ErrorService } from '../../../shared/services/error.service';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { HttpService } from '../../../shared/services/http-service';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { ContractActionTypes } from '../../actions/contract';
import { SpinnerComponent } from './../../../shared/components/spinner/spinner';
import { InvoiceActionTypes } from './../../actions/invoice';
import { BillToCashConstants } from './../../bill-to-cash/bill-to-cash-constants';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'ng2-webstorage';
import { Store } from '@ngrx/store';
import { TranslateService } from 'ng2-translate';
import { Title } from '@angular/platform-browser';
import { Logger } from '@nsalaun/ng2-logger';

@Component({
    selector: 'icabs-invoicegrouppremise',
    templateUrl: 'iCABSAInvoiceGroupPremiseMaintenance.html'
})
export class InvoiceGroupPremiseMaintenanceComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('confirmOkModal') public confirmOkModal;
    @ViewChild('messageModal2') public messageModal2;
    @ViewChild('uiForm') public uiForm: FormGroup;

    @ViewChild('accountSearchComponentRef') accountSearchComponentRef: EllipsisComponent;
    @ViewChild('invoiceGroupMaintenanceSearchRef') invoiceGroupMaintenanceSearchRef: EllipsisComponent;
    @ViewChild('contractSearchComponent1Ref') contractSearchComponent1Ref: EllipsisComponent;
    @ViewChild('contractSearchComponent11Ref') contractSearchComponent11Ref: EllipsisComponent;
    @ViewChild('componentPremiseNumber2Ref') componentPremiseNumber2Ref: EllipsisComponent;
    @ViewChild('componentPremiseNumber3Ref') componentPremiseNumber3Ref: EllipsisComponent;
    @ViewChild('contractSearchComponent4Ref') contractSearchComponent4Ref: EllipsisComponent;
    @ViewChild('contractSearchComponent3Ref') contractSearchComponent3Ref: EllipsisComponent;
    @ViewChild('componentPremiseNumberStart3Ref') componentPremiseNumberStart3Ref: EllipsisComponent;
    @ViewChild('componentPremiseNumberEnd3Ref') componentPremiseNumberEnd3Ref: EllipsisComponent;
    @ViewChild('componentPremiseRangeStart1Ref') componentPremiseRangeStart1Ref: EllipsisComponent;
    @ViewChild('componentPremiseRangeEnd1Ref') componentPremiseRangeEnd1Ref: EllipsisComponent;
    @ViewChild('componentPremiseRangeStart2Ref') componentPremiseRangeStart2Ref: EllipsisComponent;
    @ViewChild('componentPremiseRangeEnd2Ref') componentPremiseRangeEnd2Ref: EllipsisComponent;
    @ViewChild('componentPremiseRangeStart3Ref') componentPremiseRangeStart3Ref: EllipsisComponent;
    @ViewChild('componentPremiseRangeEnd3Ref') componentPremiseRangeEnd3Ref: EllipsisComponent;
    @ViewChild('componentPremiseRangeEnd4Ref') componentPremiseRangeEnd4Ref: EllipsisComponent;
    @ViewChild('componentPremiseRangeStart4Ref') componentPremiseRangeStart4Ref: EllipsisComponent;
    @ViewChild('contractSearchComponentRef') contractSearchComponentRef: EllipsisComponent;

    public contractSearchComponent = ContractSearchComponent;
    public ellipsisParams: any = {
        showCloseButton: true,
        showHeader: true,
        contractSearchParams: {
            parentMode: 'Account',
            accountNumber: '',
            accountName: ''
        }
    };
    public onContractDataReceived(data: any): void {
        // Set contract control values
        //this.setControlValue('ContractNumber', data.ContractNumber);
        //this.setControlValue('ContractName', data.ContractName);
    }

    public queryPost: URLSearchParams = new URLSearchParams();
    public errorMessage: string;
    @ViewChild('promptModalForSave') public promptModalForSave;
    public showMessageHeaderSave: boolean = true;
    public showPromptCloseButtonSave: boolean = true;
    public promptTitleSave: string = '';
    public promptContentSave: string = MessageConstant.Message.ConfirmRecord;
    public showErrorHeader: boolean = true;
    public promptModalConfigSave = {
        ignoreBackdropClick: true
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    public isRequesting: boolean = false;
    public showCloseButton: boolean = true;
    public formControl: any = {
        AccountNumber: '',
        AccountName: '',
        InvoiceGroupNumber: '',
        InvoiceGroupDesc: '',
        InvoiceGroupROWID: '',
        chkEntireAccount: false,
        chkSeparateInvoice: false,
        ContractNumber: '',
        ContractNumber1: '',
        ContractNumber2: '',
        PremiseNumber2: '',
        ContractNumber4: '',
        ContractNumber3: '',
        PremiseNumberStart3: '',
        PremiseNumberEnd3: '',
        PremiseRangeStart1: '',
        PremiseRangeEnd1: '',
        PremiseRangeStart2: '',
        PremiseRangeEnd2: '',
        PremiseRangeStart3: '',
        PremiseRangeEnd3: '',
        PremiseRangeStart4: '',
        PremiseRangeEnd4: '',
        parentMode: '',
        PremiseNumber33: ''
    };
    public pageLabels: any = {
        AreMandatoryFields: 'are mandatory fields',
        AccountNumber: 'Account Number',
        InvoiceGroupNumber: 'Invoice Group Number',
        ByAccount: 'By Account',
        ByContract: 'By Contract',
        ByPremiseRangeTab: 'By Premises Range',
        MoveAllPremisesOnAccountTo: 'Move all Premises on Account To:',
        SelectedInvoiceGroup: 'Selected Invoice Group',
        SeperateInvoiceGroup: 'Separate Invoice Groups',
        AddAllPremisesFromContract: 'Add all Premises from Contract',
        AddASinglePremiseFromContract: 'Add a single Premise from Contract',
        Premise: 'Premises',
        CreateSepInvoceGroup: 'Create Sep. Invoice Group For ALL Premises on Contract',
        AddARangeOfPremiseFromContract: 'Add a range of Premises from Contract',
        FromPremise: 'From Premises',
        ToPremise: 'To Premises',
        Save: 'Save',
        Cancel: 'Cancel',
        Options: 'Options',
        Contract: 'Contract'
    };
    public formControlEnableFlag: any = {
        AccountNumber: false,
        AccountName: true,
        InvoiceGroupNumber: false,
        InvoiceGroupDesc: true,
        chkEntireAccount: false,
        chkSeparateInvoice: false,
        ContractNumber: false,
        ContractNumber1: false,
        ContractNumber2: false,
        PremiseNumber2: false,
        ContractNumber4: false,
        ContractNumber3: false,
        PremiseNumberStart3: false,
        PremiseNumberEnd3: false,
        PremiseRangeStart1: false,
        PremiseRangeEnd1: false,
        PremiseRangeStart2: false,
        PremiseRangeEnd2: false,
        PremiseRangeStart3: false,
        PremiseRangeEnd3: false,
        PremiseRangeStart4: false,
        PremiseRangeEnd4: false
    };
    public formControlErrorFlag: any = {
        AccountNumber: false,
        AccountName: false,
        InvoiceGroupNumber: false,
        InvoiceGroupDesc: false,
        chkEntireAccount: false,
        chkSeparateInvoice: false,
        ContractNumber: false,
        ContractNumber1: false,
        ContractNumber2: false,
        PremiseNumber2: false,
        ContractNumber4: false,
        ContractNumber3: false,
        PremiseNumberStart3: false,
        PremiseNumberEnd3: false,
        PremiseRangeStart1: false,
        PremiseRangeEnd1: false,
        PremiseRangeStart2: false,
        PremiseRangeEnd2: false,
        PremiseRangeStart3: false,
        PremiseRangeEnd3: false,
        PremiseRangeStart4: false,
        PremiseRangeEnd4: false,
        by_premise_range: false
    };
    public errorClass = 'has-error';
    public menu = '';
    public spanDisplay: any = {
        spanAccountNumber: true,
        spanInvoiceGroupNumber: true,
        spanchkEntireAccount: true,
        spanchkSeparateInvoice: true,
        spanContractNumber: true,
        spanContractNumber2: true,
        spanPremiseNumber2: true,
        spanContractNumber4: true,
        spanContractNumber3: true,
        spanPremiseNumberStart3: true,
        spanPremiseNumberEnd3: true,
        spanPremiseRangeStart1: true,
        spanPremiseRangeEnd1: true,
        spanPremiseRangeStart2: true,
        spanPremiseRangeEnd2: true,
        spanPremiseRangeStart3: true,
        spanPremiseRangeEnd3: true,
        spanPremiseRangeStart4: true,
        spanPremiseRangeEnd4: true
    };
    public tabNameMap: any = {
        by_account: true,
        by_contract: false,
        by_premise_range: false
    };
    public buttonDisplay: any = {
        bttnSave: true,
        bttnCancel: true
    };
    public ellipseDisplay: any = {
        accountNumberEllipse: true,
        invoiceGroupEllipse: true
    };
    public inputParams: any = {
        operation: 'Application/iCABSAInvoiceGroupPremiseMaintenance',
        method: 'contract-management/maintenance',
        module: 'contract-admin',
        action: '',
        businessCode: '',
        countryCode: ''
    };
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;

    public showHeader = false;

    /**
     * Account number serarch ellipse functionalities
     * updating Account Number and Account Name fields
     */
    public autoOpenConfig = {
        accountSearchComponent: false,
        invoiceGroupMaintenanceSearch: false,
        contractSearchComponent1: false,
        contractSearchComponent2: false,
        componentPremiseNumber2: false,
        contractSearchComponent4: false,
        contractSearchComponent3: false,
        componentPremiseNumberStart3: false,
        componentPremiseNumberEnd3: false,
        componentPremiseRangeStart1: false,
        componentPremiseRangeEnd1: false,
        componentPremiseRangeStart2: false,
        componentPremiseRangeEnd2: false,
        componentPremiseRangeStart3: false,
        componentPremiseRangeEnd3: false,
        componentPremiseRangeStart4: false,
        componentPremiseRangeEnd4: false
    };
    public ellipseHiddenFlag = {
        accountSearchComponent: true,
        invoiceGroupMaintenanceSearch: true,
        contractSearchComponent1: true,
        contractSearchComponent2: true,
        componentPremiseNumber2: true,
        contractSearchComponent4: true,
        contractSearchComponent3: true,
        componentPremiseNumberStart3: true,
        componentPremiseNumberEnd3: true,
        componentPremiseRangeStart1: true,
        componentPremiseRangeEnd1: true,
        componentPremiseRangeStart2: true,
        componentPremiseRangeEnd2: true,
        componentPremiseRangeStart3: true,
        componentPremiseRangeEnd3: true,
        componentPremiseRangeStart4: true,
        componentPremiseRangeEnd4: true
    };
    public accountSearchComponent = AccountSearchComponent;
    public accountSearchAutoOpen = false;
    public inputParamsAccSearch: any = { 'parentMode': 'InvoiceGroupMaintenanceSearch' };
    public setAccountNumber(data: any): void {
        this.clearFields();
        this.enableAllFields();
        this.formControl.AccountNumber = data.AccountNumber;
        this.formControl.AccountName = data.AccountName;
        this.storeInvoice = {
            AccountNumber: this.formControl.AccountNumber,
            AccountName: this.formControl.AccountName,
            AccountNumberChanged: true
        };
        this.ellipsisParams.contractSearchParams.accountNumber = this.formControl.AccountNumber;
        this.ellipsisParams.contractSearchParams.accountName = this.formControl.AccountName;
        // Set Invoice Group Number In Store
        this.storeInvoiceObj.dispatch({
            type: InvoiceActionTypes.SAVE_INVOICE,
            payload: this.storeInvoice
        });
        this.inputContractSearchComponent1['accountNumber'] = this.formControl.AccountNumber;
        this.inputContractSearchComponent1['accountName'] = this.formControl.AccountName;
        this.inputContractSearchComponent2['accountName'] = this.formControl.AccountName;
        this.inputContractSearchComponent2['accountNumber'] = this.formControl.AccountNumber;
        this.inputContractSearchComponent4['accountName'] = this.formControl.AccountName;
        this.inputContractSearchComponent4['accountNumber'] = this.formControl.AccountNumber;
        this.inputContractSearchComponent3['accountName'] = this.formControl.AccountName;
        this.inputContractSearchComponent3['accountNumber'] = this.formControl.AccountNumber;
        this.inputInvoiceGroupMaintenanceSearch['AccountNumber'] = this.formControl.AccountNumber;
        this.inputInvoiceGroupMaintenanceSearch['AccountName'] = this.formControl.AccountName;
        //this.autoOpenConfig.invoiceGroupMaintenanceSearch = true;
        //this.invoiceGroupMaintenanceSearchRef.openModal();
        this.cbbService.disableComponent(true);
        this.ref.detectChanges();
    }

    /**
     * Invoice group search functionalities
     * updating InvoiceGroupNumber, InvoiceGroupDesc and InvoiceGroupROWID
     */
    public invoiceGroupMaintenanceSearch = InvoiceGroupGridComponent; //TO DO: InvoiceGroupMaintenanceSearch is not created
    public inputInvoiceGroupMaintenanceSearch: any = { 'parentMode': 'InvoiceGroupMaintenanceSearch', 'AccountNumber': '', 'AccountName': '' };
    public setInvoiceGroupNumber(data: any): void {
        this.clearFieldsInvoice();
        this.formControl.InvoiceGroupNumber = data.Number;
        this.formControl.InvoiceGroupDesc = data.Description;
        this.formControl.InvoiceGroupROWID = data.InvoiceGroupROWID;
        this.cbbService.disableComponent(true);
        this.afterNewPremises();
    }

    /**
     * ContractNumber1 search functionalities
     */
    public contractSearchComponent1 = ContractSearchComponent;
    public inputContractSearchComponent1: any = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 1, 'accountNumber': '', 'accountName': '', 'currentContractType': 'C' }; //TO DO at present Contract Search Component do not respond to parentMode 'InvGrpPremiseMaintenance'
    public setContract1(data: any): void {
        this.formControl.ContractNumber1 = data.ContractNumber;
        this.inputPremiseNumber2['ContractNumber'] = data.ContractNumber;
        this.inputPremiseNumber2['ContractName'] = data.ContractName;
    }

    /**
     * ContractNumber2 search functionalities
     */
    public contractSearchComponent2 = ContractSearchComponent;
    public inputContractSearchComponent2: any = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 2, 'currentContractType': 'C' };
    public setContract2(data: any): void {
        this.formControl.ContractNumber2 = data.ContractNumber;
        this.inputPremiseNumber2['ContractNumber'] = this.formControl.ContractNumber2;
        this.inputPremiseNumber2['ContractName'] = data.ContractName;
        //this.autoOpenConfig.componentPremiseNumber2 = true;
        this.inputPremiseNumber2['ContractNumber'] = data.ContractNumber;
        this.inputPremiseNumber2['ContractName'] = data.ContractName;
        this.componentPremiseNumber2Ref.openModal();
        //this.ContractNumber2Dependents(false);
    }

    /**
     * ContractNumber3 search functionalities.
     * Updating the dependend fields show hide feature
     */
    public contractSearchComponent3 = ContractSearchComponent;
    public inputContractSearchComponent3: any = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 3, 'currentContractType': 'C' };
    public setContract3(data: any): void {
        this.formControl.ContractNumber3 = data.ContractNumber;
        //this.autoOpenConfig.componentPremiseNumberStart3 = true;
        this.inputPremiseNumberStart3['ContractNumber'] = data.ContractNumber;
        this.inputPremiseNumberStart3['ContractName'] = data.ContractName;
        this.inputPremiseNumberEnd3['ContractNumber'] = data.ContractNumber;
        this.inputPremiseNumberEnd3['ContractName'] = data.ContractName;
        this.autoOpenConfig = {
            accountSearchComponent: false,
            invoiceGroupMaintenanceSearch: false,
            contractSearchComponent1: false,
            contractSearchComponent2: false,
            componentPremiseNumber2: false,
            contractSearchComponent4: false,
            contractSearchComponent3: false,
            componentPremiseNumberStart3: true,
            componentPremiseNumberEnd3: true,
            componentPremiseRangeStart1: true,
            componentPremiseRangeEnd1: true,
            componentPremiseRangeStart2: true,
            componentPremiseRangeEnd2: true,
            componentPremiseRangeStart3: true,
            componentPremiseRangeEnd3: true,
            componentPremiseRangeStart4: true,
            componentPremiseRangeEnd4: true
        };
        this.inputPremiseNumberStart3['ContractNumber'] = data.ContractNumber;
        this.inputPremiseNumberStart3['ContractName'] = data.ContractName;
        this.inputPremiseNumberEnd3['ContractNumber'] = data.ContractNumber;
        this.inputPremiseNumberEnd3['ContractName'] = data.ContractName;
        this.inputPremiseRangeStart1['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeStart1['ContractName'] = data.ContractName;
        this.inputPremiseRangeEnd1['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeEnd1['ContractName'] = data.ContractName;
        this.inputPremiseRangeStart2['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeStart2['ContractName'] = data.ContractName;
        this.inputPremiseRangeEnd2['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeEnd2['ContractName'] = data.ContractName;
        this.inputPremiseRangeStart3['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeStart3['ContractName'] = data.ContractName;
        this.inputPremiseRangeEnd3['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeEnd3['ContractName'] = data.ContractName;
        this.inputPremiseRangeStart4['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeStart4['ContractName'] = data.ContractName;
        this.inputPremiseRangeEnd4['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeEnd4['ContractName'] = data.ContractName;
        this.componentPremiseNumberStart3Ref.openModal();
        this.ContractNumber3Dependents(false);
    }

    /**
     * ContractNumber4 search functionalities.
     */
    public contractSearchComponent4 = ContractSearchComponent;
    public inputContractSearchComponent4: any = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 4, 'currentContractType': 'C' };
    public setContract4(data: any): void {
        this.formControl.ContractNumber4 = data.ContractNumber;
    }

    /**
     * PremiseNumber2 search functionalities.
     */
    // TO DO: Premise search grid do not respond to the below parent mode and action
    public componentPremiseNumber2 = PremiseSearchComponent;
    public inputPremiseNumber2 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 2, 'StartPremiseSet': '', 'ContractNumber': '', 'ContractName': '' };
    public setPremiseNumber2(data: any): void {
        this.formControl.PremiseNumber2 = data.PremiseNumber;
    }

    public componentPremiseNumber3 = PremiseSearchComponent;
    public inputPremiseNumber3 = { 'parentMode': 'ShowPremisesOnInvoiceGroup', 'AccountNumber': '', 'AccountName': '', 'InvoiceGroupNumber': '', 'showAddNew': false };
    public setPremiseNumber3(data: any): void {
        this.formControl.PremiseNumber33 = data.PremiseNumber;
    }

    /**
     * PremiseNumberStart3 search functionalities.
     */
    public componentPremiseNumberStart3 = PremiseSearchComponent;
    public inputPremiseNumberStart3 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 3, 'StartPremiseSet': '' };
    public setPremiseNumberStart3(data: any): void {
        this.formControl.PremiseNumberStart3 = data.PremiseNumber;
        //this.autoOpenConfig.componentPremiseNumberEnd3 = true;
        this.componentPremiseNumberEnd3Ref.openModal();
    }

    /**
     * PremiseNumberEnd3 search functionalities.
     */
    public componentPremiseNumberEnd3 = PremiseSearchComponent;
    public inputPremiseNumberEnd3 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 3, 'StartPremiseSet': true };
    public setPremiseNumberEnd3(data: any): void {
        this.formControl.PremiseNumberEnd3 = data.PremiseNumber;
        //this.componentPremiseRangeStart1Ref.openModal();
    }

    /**
     * PremiseRangeStart1 search functionalities.
     */
    public componentPremiseRangeStart1 = PremiseSearchComponent;
    public inputPremiseRangeStart1 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R5', 'StartPremiseSet': '' };
    public setPremiseRangeStart1(data: any): void {
        this.formControl.PremiseRangeStart1 = data.PremiseNumber;
        //this.componentPremiseRangeEnd1Ref.openModal();
    }

    /**
     * PremiseRangeEnd1 search functionalities.
     */
    public componentPremiseRangeEnd1 = PremiseSearchComponent;
    public inputPremiseRangeEnd1 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R5', 'StartPremiseSet': true };
    public setPremiseRangeEnd1(data: any): void {
        this.formControl.PremiseRangeEnd1 = data.PremiseNumber;
        //this.componentPremiseRangeStart2Ref.openModal();
    }

    /**
     * PremiseRangeStart2 search functionalities.
     */
    public componentPremiseRangeStart2 = PremiseSearchComponent;
    public inputPremiseRangeStart2 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R6', 'StartPremiseSet': '' };
    public setPremiseRangeStart2(data: any): void {
        this.formControl.PremiseRangeStart2 = data.PremiseNumber;
        //this.componentPremiseRangeEnd2Ref.openModal();
    }
    public setPremiseRangeEnd22(data: any): void {
        this.formControl.PremiseRangeEnd2 = data.PremiseNumber;
        //this.componentPremiseRangeStart3Ref.openModal();
    }

    /**
     * PremiseRangeEnd2 search functionalities.
     */
    public componentPremiseRangeEnd2 = PremiseSearchComponent;
    public inputPremiseRangeEnd2 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R6', 'StartPremiseSet': true };
    public setPremiseRangeEnd2(data: any): void {
        this.formControl.PremiseRangeEnd2 = data.PremiseNumber;
    }

    /**
     * PremiseRangeStart3 search functionalities.
     */
    public componentPremiseRangeStart3 = PremiseSearchComponent;
    public inputPremiseRangeStart3 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R7', 'StartPremiseSet': '' };
    public setPremiseRangeStart3(data: any): void {
        this.formControl.PremiseRangeStart3 = data.PremiseNumber;
        //this.componentPremiseRangeEnd3Ref.openModal();
    }

    /**
     * PremiseRangeEnd3 search functionalities.
     */
    public componentPremiseRangeEnd3 = PremiseSearchComponent;
    public inputPremiseRangeEnd3 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R7', 'StartPremiseSet': true };
    public setPremiseRangeEnd3(data: any): void {
        this.formControl.PremiseRangeEnd3 = data.PremiseNumber;
        //this.componentPremiseRangeStart4Ref.openModal();
    }

    /**
     * PremiseRangeStart4 search functionalities.
     */
    public componentPremiseRangeStart4 = PremiseSearchComponent;
    public inputPremiseRangeStart4 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R8', 'StartPremiseSet': '' };
    public setPremiseRangeStart4(data: any): void {
        this.formControl.PremiseRangeStart4 = data.PremiseNumber;
        //this.componentPremiseRangeEnd4Ref.openModal();
    }

    /**
     * PremiseRangeEnd4 search functionalities.
     */
    public componentPremiseRangeEnd4 = PremiseSearchComponent;
    public inputPremiseRangeEnd4 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R8', 'StartPremiseSet': true };
    public setPremiseRangeEnd4(data: any): void {
        this.formControl.PremiseRangeEnd4 = data.PremiseNumber;
    }

    public storeSubscription: Subscription;
    public storeData: any;

    /**
     * This function is triggered when the user inputs some values to ContractNumber2 and ContractNumber3 fields.
     * This function enable or disable form controls accordingly.
     */
    public inputValueChange(inputKey: any): void {
        let regex = /^[a-zA-Z]+$/;
        switch (inputKey) {
            case 'ContractNumber2':
                if (!this.formControl.ContractNumber2.match(regex) && this.formControl.ContractNumber2.length > 0) {
                    this.ContractNumber2Dependents(false);
                }
                this.inputPremiseNumber2['ContractNumber'] = this.formControl.ContractNumber2;
                break;
            case 'ContractNumber3':
                this.autoOpenConfig = {
                    accountSearchComponent: false,
                    invoiceGroupMaintenanceSearch: false,
                    contractSearchComponent1: false,
                    contractSearchComponent2: false,
                    componentPremiseNumber2: false,
                    contractSearchComponent4: false,
                    contractSearchComponent3: false,
                    componentPremiseNumberStart3: false,
                    componentPremiseNumberEnd3: false,
                    componentPremiseRangeStart1: false,
                    componentPremiseRangeEnd1: false,
                    componentPremiseRangeStart2: false,
                    componentPremiseRangeEnd2: false,
                    componentPremiseRangeStart3: false,
                    componentPremiseRangeEnd3: false,
                    componentPremiseRangeStart4: false,
                    componentPremiseRangeEnd4: false
                };
                if (!this.formControl.ContractNumber3.match(regex) && this.formControl.ContractNumber3.length > 0) {
                    this.ContractNumber3Dependents(false);
                }
                break;
            default:
        }
    }

    /**
     * This method enable/disable the status of the ContractNumber3 dependent fields.
     */
    public ContractNumber3Dependents(flag: boolean): any {
        this.formControlEnableFlag.PremiseNumberStart3 = flag;
        this.formControlEnableFlag.PremiseNumberEnd3 = flag;
        this.formControlEnableFlag.PremiseRangeStart1 = flag;
        this.formControlEnableFlag.PremiseRangeEnd1 = flag;
        this.formControlEnableFlag.PremiseRangeStart2 = flag;
        this.formControlEnableFlag.PremiseRangeEnd2 = flag;
        this.formControlEnableFlag.PremiseRangeStart3 = flag;
        this.formControlEnableFlag.PremiseRangeEnd3 = flag;
        this.formControlEnableFlag.PremiseRangeStart4 = flag;
        this.formControlEnableFlag.PremiseRangeEnd4 = flag;
    }

    /**
     * This method enable/disable ContractNumber2 dependant fields.
     */
    public ContractNumber2Dependents(flag: boolean): any {
        this.formControlEnableFlag.PremiseNumber2 = flag;
    }

    public urlHeaders: any = { 'BusinessCode': '', 'CountryCode': '' };
    public storeSubscriptionInvoice: Subscription;
    public storeInvoice: Object;
    public storeCode: any;
    public sysCharParams: Object = {
        vSCEnablePayTypeAtInvGroupLevel: '',
        SCEnablePayTypeAtInvGroupLev: ''
    };
    public storeFormData: any;

    /**
     * Component constructor method.
     */
    constructor(
        private httpService: HttpService,
        private serviceConstants: ServiceConstants,
        private errorService: ErrorService,
        private messageService: MessageService,
        private authService: AuthService,
        private ajaxconstant: AjaxObservableConstant,
        private router: Router,
        private pageData: PageDataService,
        private titleService: Title,
        private zone: NgZone,
        private store: Store<any>,
        private storeInvoiceObj: Store<any>,
        private translate: TranslateService,
        private ls: LocalStorageService,
        private http: Http,
        private localeTranslateService: LocaleTranslationService,
        private sysCharConstants: SysCharConstants,
        private logger: Logger,
        private utils: Utils,
        private activatedRoute: ActivatedRoute,
        private _router: Router,
        private SysCharConstants: SysCharConstants,
        private routeAwayGlobals: RouteAwayGlobals,
        private cbbService: CBBService,//CR Changes
        private ref: ChangeDetectorRef
    ) {
        this.storeSubscription = store.select('account').subscribe(data => {
            this.storeData = data;
        });

        // Subscribe To Store
        this.storeSubscriptionInvoice = this.storeInvoiceObj.select('invoice').subscribe((data) => {
            this.storeFormData = data;
            this.storeUpdateHandler(data);
            if (this.storeFormData && this.storeFormData.data && !(Object.keys(this.storeFormData.data).length === 0 && this.storeFormData.data.constructor === Object)) {
                this.formControl = this.storeFormData.data;
            }
            //this.formControl = this.storeFormData && this.storeFormData.data ? this.storeFormData.data : this.formControl;

        });
    }

    private storeUpdateHandler(data: any): void {
        this.storeInvoice = {};
        if (data['code']) {
            this.storeCode = data['code'];
        }
        switch (data && data['action']) {
            case InvoiceActionTypes.SAVE_MODE:
                this.storeInvoice = data['invoice'];
                this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { 'parentMode': 'InvGrpPremiseMaintenance' } });
                break;
        }
    }

    public ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.routeAwayGlobals.setEllipseOpenFlag(false); //CR implementation
        this.routeAwayGlobals.setDirtyFlag(false); //CR implementation
        this.localeTranslateService.setUpTranslation();
        this.inputParams.businessCode = this.utils.getBusinessCode();
        this.inputParams.countryCode = this.utils.getCountryCode();
        this.triggerFetchSysChar(false, true);
        this.getUrlParams();
        this.getDataFromStore();
        this.setUpApi();
        // tslint:disable-next-line:typedef
        window.onerror = function () {
            return true;
        };
        this.utils.getTranslatedval('Invoice Group Premises Maintenance').then((res) => {
            this.utils.setTitle(res);
        });
        this.messageModal2.showHeader = true;
        this.messageModal2.showCloseButton = true;
        if (this.storeFormData && this.storeFormData.data && !(Object.keys(this.storeFormData.data).length === 0 && this.storeFormData.data.constructor === Object)) {
            this.formControl = this.storeFormData.data;
            this.setAccountNumber(this.formControl);
            this.lookupSearch('InvoiceGroupNumber');
        }
    }

    public ngAfterViewInit(): void {
        //this.autoOpenConfig.accountSearchComponent = true;
        if (this.formControl.parentMode === '')
            this.accountSearchComponentRef.openModal();
        this.accountSearchComponentRef.modalConfig = this.modalConfig;
        this.invoiceGroupMaintenanceSearchRef.modalConfig = this.modalConfig;
    }

    public ngOnDestroy(): void {
        this.storeFormData.data = this.formControl;
        this.routeAwayGlobals.resetRouteAwayFlags(); //CR implementation

    }

    /**
     * Get the data from the Store
     */
    public getDataFromStore(): void {
        if (this.storeData && (typeof this.storeData.from !== 'undefined' || typeof this.storeData.to !== 'undefined')) {
            if (typeof this.storeData.from !== 'undefined') {
                this.onDataReceived(this.storeData.from, false);
            }
        }
    }
    /**
     * Assign store data to the respective form controls.
     */
    public onDataReceived(data: any, route: any): void {
        if (data.hasOwnProperty('parentMode'))
            this.formControl.parentMode = data.parentMode;
        if (data.hasOwnProperty('AccountNumber'))
            this.formControl.AccountNumber = data.AccountNumber;
        if (data.hasOwnProperty('AccountName'))
            this.formControl.AccountName = data.AccountName;
        if (data.hasOwnProperty('InvoiceGroupNumber'))
            this.formControl.InvoiceGroupNumber = data.InvoiceGroupNumber;
        if (data.hasOwnProperty('InvoiceGroupDesc'))
            this.formControl.InvoiceGroupDesc = data.InvoiceGroupDesc;
    }

    /**
     * Get required parameters from url, if supplied
     */
    public getUrlParams(): void {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (params['parentMode'] !== undefined) {
                this.formControl.parentMode = params['parentMode'];
            }
            if (params['AccountNumber'] !== undefined) {
                this.formControlEnableFlag.AccountNumber = true;
                this.formControl.AccountNumber = params['AccountNumber'];
                this.lookupSearch('AccountNumber');
            }
            if (params['AccountName'] !== undefined) {
                this.formControlEnableFlag.AccountName = true;
            }
            if (params['InvoiceGroupNumber'] !== undefined) {
                this.formControlEnableFlag.InvoiceGroupNumber = true;
                this.formControl.InvoiceGroupNumber = params['InvoiceGroupNumber'];
                this.lookupSearch('InvoiceGroupNumber');
            }
            if (params['InvoiceGroupDesc'] !== undefined) {
                this.formControlEnableFlag.InvoiceGroupDesc = true;
            }
        });
    }

    /**
     * Enable/disable form controls based on the parent mode.
     */
    public setUpApi(): void {
        if (this.formControl.parentMode === 'InvoiceGroup') {
            this.formControlEnableFlag.AccountNumber = true;
            this.formControlEnableFlag.AccountName = true;
            this.formControlEnableFlag.InvoiceGroupNumber = true;
            this.formControlEnableFlag.InvoiceGroupDesc = true;
        } else {
            this.formControlEnableFlag.AccountNumber = false;
            this.formControlEnableFlag.AccountName = false;
            this.formControlEnableFlag.InvoiceGroupNumber = false;
            this.formControlEnableFlag.InvoiceGroupDesc = false;
        }
    }

    /**
     * Response to change tab events.
     */
    public changeTab(tabname: string): void {
        for (let key in this.tabNameMap) {
            if (this.tabNameMap.hasOwnProperty(key)) {
                this.tabNameMap[key] = false;
            }
        }
        this.tabNameMap[tabname] = true;
        // if (tabname === 'by_contract') {
        //     this.contractSearchComponent1Ref.modalConfig = this.modalConfig;
        //     this.contractSearchComponent11Ref.modalConfig = this.modalConfig;
        //     this.componentPremiseNumber2Ref.modalConfig = this.modalConfig;
        //     this.contractSearchComponent4Ref.modalConfig = this.modalConfig;
        // }
        // if (tabname === 'by_premise_range') {
        //     this.contractSearchComponent3Ref.modalConfig = this.modalConfig;
        //     this.componentPremiseNumberStart3Ref.modalConfig = this.modalConfig;
        //     this.componentPremiseNumberEnd3Ref.modalConfig = this.modalConfig;
        //     this.componentPremiseRangeStart1Ref.modalConfig = this.modalConfig;
        //     this.componentPremiseRangeEnd1Ref.modalConfig = this.modalConfig;
        //     this.componentPremiseRangeStart2Ref.modalConfig = this.modalConfig;
        //     this.componentPremiseRangeEnd2Ref.modalConfig = this.modalConfig;
        //     this.componentPremiseRangeStart3Ref.modalConfig = this.modalConfig;
        //     this.componentPremiseRangeEnd3Ref.modalConfig = this.modalConfig;
        //     this.componentPremiseRangeEnd4Ref.modalConfig = this.modalConfig;
        // }
    }

    /**
     * Reset form data to previous state depending upon the conditions.
     */
    public resetFormData(tabname: string): void {
        //this.formControl.AccountNumber = '';
        //this.formControl.AccountName = '';
        //this.formControl.InvoiceGroupNumber = '';
        //this.formControl.InvoiceGroupDesc = '';
        switch (tabname) {
            case 'by_account':
                this.formControl.chkEntireAccount = false;
                this.formControl.chkSeparateInvoice = false;
                break;
            case 'by_contract':
                this.formControl.ContractNumber1 = '';
                this.formControl.ContractNumber2 = '';
                this.formControl.PremiseNumber2 = '';
                this.formControl.ContractNumber4 = '';
                break;
            case 'by_premise_range':
                this.formControl.ContractNumber3 = '';
                this.formControl.PremiseNumberStart3 = '';
                this.formControl.PremiseNumberEnd3 = '';
                this.formControl.PremiseRangeStart1 = '';
                this.formControl.PremiseRangeEnd1 = '';
                this.formControl.PremiseRangeStart2 = '';
                this.formControl.PremiseRangeEnd2 = '';
                this.formControl.PremiseRangeStart3 = '';
                this.formControl.PremiseRangeEnd3 = '';
                this.formControl.PremiseRangeStart4 = '';
                this.formControl.PremiseRangeEnd4 = '';
                break;
            default:
        }
    }

    /**
     * This method enable the save feature.
     */
    public saveOnclick(): any {
        this.routeAwayComponent.resetDirtyFlagAfterSaveUpdate();
        if (this.formControl.AccountNumber.length <= 0) {
            this.formControlErrorFlag.AccountNumber = true;
        } else {
            this.formControlErrorFlag.AccountNumber = false;
        }
        if (this.formControl.InvoiceGroupNumber.length <= 0) {
            this.formControlErrorFlag.InvoiceGroupNumber = true;
        } else {
            this.formControlErrorFlag.InvoiceGroupNumber = false;
        }
        let errorFlag = 0;
        for (let err in this.formControlErrorFlag) {
            if (err) {
                if (this.formControlErrorFlag[err] === true) {
                    errorFlag = 1;
                }
            }
        }
        this.messageModal.showHeader = true;
        this.messageModal.showCloseButton = true;
        if (errorFlag === 0) {
            if (this.sysCharParams['SCEnablePayTypeAtInvGroupLev'] === true) {
                let data = { title: '', msg: 'Moving Premises to another Invoice Group may result in a change to the Payment Method' };
                this.confirmOkModal.show(data, false);
            } else {
                this.cbbService.disableComponent(false);
                this.promptModalForSave.show();
            }
            //this.promptModalForSave.show();
        }
    }

    public confirmOkClose(eventobj: any): void {
        this.cbbService.disableComponent(false);
        this.promptModalForSave.show();
    }

    public promptContentSaveData(eventObj: any): void {
        this.messageModalClose();
        // let formdata: Object = {};
        // this.queryPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        // this.queryPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        // this.queryPost.set(this.serviceConstants.Action, '2');
        // formdata['InvoiceGroupROWID'] = this.formControl.InvoiceGroupROWID;
        // formdata['AccountNumber'] = this.formControl.AccountNumber;
        // formdata['InvoiceGroupNumber'] = this.formControl.InvoiceGroupNumber;
        // formdata['InvoiceGroupDesc'] = this.formControl.InvoiceGroupDesc;
        // formdata['chkEntireAccount'] = this.formControl.chkEntireAccount;
        // formdata['chkSeparateInvoice'] = this.formControl.chkSeparateInvoice;
        // formdata['ContractNumber'] = this.formControl.ContractNumber1;
        // formdata['ContractNumber2'] = this.formControl.ContractNumber2;
        // formdata['ContractNumber3'] = this.formControl.ContractNumber3;
        // formdata['ContractNumber4'] = this.formControl.ContractNumber4;
        // formdata['PremiseNumber2'] = this.formControl.PremiseNumber2;
        // formdata['PremiseNumberStart3'] = this.formControl.PremiseNumberStart3;
        // formdata['PremiseNumberEnd3'] = this.formControl.PremiseNumberEnd3;
        // formdata['PremiseRangeStart1'] = this.formControl.PremiseRangeStart1;
        // formdata['PremiseRangeEnd1'] = this.formControl.PremiseRangeEnd1;
        // formdata['PremiseRangeStart2'] = this.formControl.PremiseRangeStart2;
        // formdata['PremiseRangeEnd2'] = this.formControl.PremiseRangeEnd2;
        // formdata['PremiseRangeStart3'] = this.formControl.PremiseRangeStart3;
        // formdata['PremiseRangeEnd3'] = this.formControl.PremiseRangeEnd3;
        // formdata['PremiseRangeStart4'] = this.formControl.PremiseRangeStart4;
        // formdata['PremiseRangeEnd4'] = this.formControl.PremiseRangeEnd4;
        // this.inputParams.search = this.queryPost;
        // this.ajaxSource.next(this.ajaxconstant.START);
        // this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.queryPost, formdata)
        //     .subscribe(
        //     (e) => {
        //         if (e.status === 'failure') {
        //             this.errorService.emitError(e.oResponse);
        //         } else {
        //             if (e.errorMessage && e.errorMessage !== '') {
        //                 setTimeout(() => {
        //                     this.errorService.emitError(e);
        //                 }, 200);

        //             } else {
        //                 this.messageService.emitMessage(e);
        //                 this.resetForm();
        //             }
        //         }
        //         this.ajaxSource.next(this.ajaxconstant.COMPLETE);

        //     },
        //     (error) => {
        //         this.errorMessage = error as any;
        //         this.errorService.emitError(error);
        //         this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        //     }
        //     );
    }

    public resetForm(): void {
        this.formControl = {
            AccountNumber: '',
            AccountName: '',
            InvoiceGroupNumber: '',
            InvoiceGroupDesc: '',
            InvoiceGroupROWID: '',
            chkEntireAccount: '',
            chkSeparateInvoice: '',
            ContractNumber: '',
            ContractNumber1: '',
            ContractNumber2: '',
            PremiseNumber2: '',
            ContractNumber4: '',
            ContractNumber3: '',
            PremiseNumberStart3: '',
            PremiseNumberEnd3: '',
            PremiseRangeStart1: '',
            PremiseRangeEnd1: '',
            PremiseRangeStart2: '',
            PremiseRangeEnd2: '',
            PremiseRangeStart3: '',
            PremiseRangeEnd3: '',
            PremiseRangeStart4: '',
            PremiseRangeEnd4: ''
        };
    }


    /**
     * On close of the modal, this method save the form datas by caklling the respected api.
     */
    public messageModalClose(): any {
        let queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        let _formData: any = {};
        for (let key in this.formControl) {
            if (key) {
                _formData[key] = this.formControl[key];
                if ((key === 'chkSeparateInvoice') || (key === 'chkEntireAccount')) {
                    if (this.formControl[key] === true || this.formControl[key] === '') {
                        _formData[key] = 'yes';
                    } else {
                        _formData[key] = 'no';
                    }
                }
            }
        }
        if (this.formControl['chkSeparateInvoice'] === '' || this.formControl['chkSeparateInvoice'] === null || this.formControl['chkSeparateInvoice'] === false) {
            _formData['chkSeparateInvoice'] = 'no';
        } else {
            _formData['chkSeparateInvoice'] = 'yes';
        }
        if (this.formControl['chkEntireAccount'] === '' || this.formControl['chkEntireAccount'] === null || this.formControl['chkEntireAccount'] === false) {
            _formData['chkEntireAccount'] = 'no';
        } else {
            _formData['chkEntireAccount'] = 'yes';
        }
        _formData['action'] = '2';
        _formData['ContractNumber'] = this.formControl.ContractNumber1;
        queryParams.set('action', '2');
        let _method = this.inputParams.method;
        let _module = this.inputParams.module;
        let _operation = this.inputParams.operation;
        let _search = queryParams;
        this.isRequesting = true;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(_method, _module, _operation, _search, _formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
                if (data.errorMessage) {
                    if (data.errorMessage !== '') {
                        this.messageModal2.show({ msg: data.errorMessage, title: MessageConstant.Message.ErrorTitle }, false);
                    }
                } else {
                    this.messageModal2.show({ msg: MessageConstant.Message.SavedSuccessfully, title: '' }, false);
                    this.uiForm['control'].markAsPristine();
                }
            },
            error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });
    }

    /**
     * This method is invoked on click of the cancel button.
     */
    public cancelOnclick(): any {
        this.resetFormData('by_account');
        this.resetFormData('by_contract');
        this.resetFormData('by_premise_range');
        this.formControlEnableFlag.chkEntireAccount = false;
        this.formControlEnableFlag.chkSeparateInvoice = false;
        document.getElementById('cancelButton').blur();
        this.cbbService.disableComponent(false);
        let flagIf = true;
        for (let key in this.formControlEnableFlag) {
            if (flagIf)
                this.formControlEnableFlag[key] = false;
        }
        for (let key in this.formControlErrorFlag) {
            if (flagIf)
                this.formControlErrorFlag[key] = false;
        }
        this.uiForm['control'].markAsPristine();
    }

    /**
     * This method is invoked when the EntireAccount checkbox is clicked.
     */
    public clickEntireAccount(eventObject: any): void {
        if (eventObject.target.checked === true) {
            this.disableFields();
            this.formControlEnableFlag.chkSeparateInvoice = true;
        } else {
            this.enableFields();
            this.formControlEnableFlag.chkSeparateInvoice = false;
        }
    }

    /**
     * This method is invoked when SeperateInvoice checkbod is clicked.
     */
    public clickSeperateInvoice(eventObject: any): void {
        if (eventObject.target.checked === true) {
            this.disableFields();
            this.formControlEnableFlag.chkEntireAccount = true;
        } else {
            this.enableFields();
            this.formControlEnableFlag.chkEntireAccount = false;
        }
    }

    /**
     * Disable form controls when EntireAccount/SeperateInvoice checkbox is clicked
     */
    public disableFields(): void {
        this.formControlEnableFlag.ContractNumber1 = true;
        this.formControlEnableFlag.ContractNumber2 = true;
        this.formControlEnableFlag.PremiseNumber2 = true;
        this.formControlEnableFlag.ContractNumber3 = true;
        this.formControlEnableFlag.PremiseNumberStart3 = true;
        this.formControlEnableFlag.PremiseNumberEnd3 = true;
    }

    /**
     * Enable form controls when EntireAccount/SeperateInvoice checkbox is clicked
     */
    public enableFields(): void {
        this.formControlEnableFlag.ContractNumber1 = false;
        this.formControlEnableFlag.ContractNumber2 = false;
        this.formControlEnableFlag.PremiseNumber2 = false;
        this.formControlEnableFlag.ContractNumber3 = false;
        this.formControlEnableFlag.PremiseNumberStart3 = false;
        this.formControlEnableFlag.PremiseNumberEnd3 = false;
    }

    /**
     * This method is invoked when menu select dropdown os changed.
     */
    public menuOnchange(): void {
        if (this.menu === 'Premise') {
            this.cmdPremiseOnclick();
        }
        if (this.menu === 'Contract') {
            this.cmdContractOnclick();
        }
    }

    /**
     * This method will navigate to iCABSAPremiseSearch page.
     */
    public cmdPremiseOnclick(): void {
        //this.messageModal.show({ msg: 'The page is under construction', title: 'Message' }, false);
        //this._router.navigate(['/Application/iCABSAPremiseSearch'], { queryParams: { 'parentMode': 'ShowPremisesOnInvoiceGroup' } });
        if (this.formControl.AccountName !== '' && this.formControl.AccountName !== null && this.formControl.InvoiceGroupNumber !== '' && this.formControl.InvoiceGroupNumber !== null) {
            this.inputPremiseNumber3 = { 'parentMode': 'ShowPremisesOnInvoiceGroup', 'AccountNumber': this.formControl.AccountNumber, 'AccountName': this.formControl.AccountName, 'InvoiceGroupNumber': this.formControl.InvoiceGroupNumber, 'showAddNew': false };
            this.ref.detectChanges();
            this.componentPremiseNumber3Ref.openModal();
        } else {
            this.messageModal.show({ msg: MessageConstant.Message.noRecordSelected, title: MessageConstant.Message.ErrorTitle }, false);
        }
    }

    /**
     * This method will navigate to iCABSAContractSearch page.
     */
    public cmdContractOnclick(): void {
        this.contractSearchComponentRef.openModal();
        //this._router.navigate(['contractmanagement/application/contractsearch'], { queryParams: { 'parentMode': 'Account' } });
    }


    public sysCharParameters(): string {
        let sysCharList = [
            this.SysCharConstants.SystemCharEnablePayTypeAtInvoiceGroupLevel,
            this.SysCharConstants.SystemCharEnablePayTypeAtInvGroupLev
        ];
        return sysCharList.join(',');
    }
    public onSysCharDataReceive(e: any): void {
        if (e.records && e.records.length > 0) {
            this.sysCharParams['vSCEnablePayTypeAtInvGroupLevel'] = e.records[0].Required;
            this.sysCharParams['SCEnablePayTypeAtInvGroupLev'] = e.records[0].Required;
        }
    }
    public fetchSysChar(sysCharNumbers: any): any {
        let querySysChar: URLSearchParams = new URLSearchParams();
        querySysChar.set(this.serviceConstants.Action, '0');
        querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(querySysChar);
    }
    public triggerFetchSysChar(saveModeData: any, returnSubscription: boolean): any {
        let sysCharNumbers = this.sysCharParameters();
        this.fetchSysChar(sysCharNumbers).subscribe((data) => {
            this.onSysCharDataReceive(data);
        });
    }

    /**
     * This method is invoked on manual entry for AccountNumber and InvoiceGroupNumber fields.
     * Makes the lookup call to populate the Account Name / InvoiceGroupDesc fields.
     */
    public lookupSearch(formKey: string): void {
        let queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.MethodType, 'maintenance');
        let lookupQuery: any = '';
        let tempInvoiceGroupNumber = this.formControl.InvoiceGroupNumber;
        if (formKey === 'AccountNumber') {
            if (this.formControl.AccountNumber.length > 0) {
                this.formControl.AccountNumber = this.utils.fillLeadingZeros(this.formControl.AccountNumber, 9);
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                    'table': 'Account',
                    'query': { 'BuisinessCode': this.utils.getBusinessCode(), 'AccountNumber': this.formControl.AccountNumber },
                    'fields': ['AccountName']
                }];
            } else {
                this.clearFields();
            }
        };
        if (formKey === 'InvoiceGroupNumber') {
            if (this.formControl.InvoiceGroupNumber.length > 0) {
                queryParams.set(this.serviceConstants.Action, '0');
                lookupQuery = [{
                    'table': 'InvoiceGroup',
                    'query': { 'BuisinessCode': this.utils.getBusinessCode(), 'AccountNumber': this.formControl.AccountNumber, 'InvoiceGroupNumber': this.formControl.InvoiceGroupNumber },
                    'fields': ['InvoiceGroupDesc']
                }];
            } else {
                this.formControl.InvoiceGroupDesc = '';
            }
        };
        if (lookupQuery !== '') {
            this.isRequesting = true;
            this.invokeLookupSearch(queryParams, lookupQuery).subscribe(
                value => {
                    if (value['results']['0']['0'] !== undefined) {
                        if (formKey === 'AccountNumber') {
                            this.clearFieldsInvoice();
                            if (value['results'][0].length > 0) {
                                this.formControl.AccountName = value['results']['0']['0']['AccountName'];
                                this.inputContractSearchComponent1['accountName'] = this.formControl.AccountName;
                                this.inputContractSearchComponent1['accountNumber'] = this.formControl.AccountNumber;
                                this.inputContractSearchComponent2['accountName'] = this.formControl.AccountName;
                                this.inputContractSearchComponent2['accountNumber'] = this.formControl.AccountNumber;
                                this.inputContractSearchComponent4['accountName'] = this.formControl.AccountName;
                                this.inputContractSearchComponent4['accountNumber'] = this.formControl.AccountNumber;
                                this.inputContractSearchComponent3['accountName'] = this.formControl.AccountName;
                                this.inputContractSearchComponent3['accountNumber'] = this.formControl.AccountNumber;
                                this.inputInvoiceGroupMaintenanceSearch['AccountNumber'] = this.formControl.AccountNumber;
                                this.inputInvoiceGroupMaintenanceSearch['AccountName'] = this.formControl.AccountName;
                                //this.invoiceGroupMaintenanceSearchRef.openModal();
                                this.cbbService.disableComponent(true);
                            } else {
                                this.clearFields();
                            }
                        }
                        if (formKey === 'InvoiceGroupNumber') {
                            this.clearFieldsInvoice();
                            this.formControl.InvoiceGroupNumber = tempInvoiceGroupNumber;
                            this.formControl.InvoiceGroupDesc = value['results']['0']['0']['InvoiceGroupDesc'];
                            this.formControl.InvoiceGroupROWID = value['results']['0']['0']['ttInvoiceGroup'];
                            this.cbbService.disableComponent(true);
                        }
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    } else {
                        if (formKey === 'AccountNumber') {
                            this.clearFields();
                        }
                        if (formKey === 'InvoiceGroupNumber') {
                            this.formControl.InvoiceGroupDesc = '';
                            this.formControl.InvoiceGroupNumber = '';
                        }
                    }
                    this.isRequesting = false;
                },
                error => {
                    //console.log('lookup search error');
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.isRequesting = false;
                },
                () => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.isRequesting = false;
                }
            );
        }
    }

    /**
     * Making the lookup API call
     */
    public invokeLookupSearch(queryParams: any, data: any): Observable<any> {
        this.ajaxSource.next(this.ajaxconstant.START);
        return this.httpService.lookUpRequest(queryParams, data);
    }

    //in component ts at end
    /*
    *   Alerts user when user is moving away without saving the changes.
    */
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        this.routeAwayGlobals.setDirtyFlag(this.uiForm.dirty);
        return this.routeAwayComponent.canDeactivate();
    }

    public clearFields(): void {
        this.formControl = {
            AccountNumber: '',
            AccountName: '',
            InvoiceGroupNumber: '',
            InvoiceGroupDesc: '',
            InvoiceGroupROWID: '',
            chkEntireAccount: '',
            chkSeparateInvoice: '',
            ContractNumber: '',
            ContractNumber1: '',
            ContractNumber2: '',
            PremiseNumber2: '',
            ContractNumber4: '',
            ContractNumber3: '',
            PremiseNumberStart3: '',
            PremiseNumberEnd3: '',
            PremiseRangeStart1: '',
            PremiseRangeEnd1: '',
            PremiseRangeStart2: '',
            PremiseRangeEnd2: '',
            PremiseRangeStart3: '',
            PremiseRangeEnd3: '',
            PremiseRangeStart4: '',
            PremiseRangeEnd4: ''
        };
    }
    public clearFieldsInvoice(): void {
        this.formControl = {
            AccountNumber: this.formControl.AccountNumber,
            AccountName: this.formControl.AccountName,
            InvoiceGroupNumber: '',
            InvoiceGroupDesc: '',
            InvoiceGroupROWID: '',
            chkEntireAccount: '',
            chkSeparateInvoice: '',
            ContractNumber: '',
            ContractNumber1: '',
            ContractNumber2: '',
            PremiseNumber2: '',
            ContractNumber4: '',
            ContractNumber3: '',
            PremiseNumberStart3: '',
            PremiseNumberEnd3: '',
            PremiseRangeStart1: '',
            PremiseRangeEnd1: '',
            PremiseRangeStart2: '',
            PremiseRangeEnd2: '',
            PremiseRangeStart3: '',
            PremiseRangeEnd3: '',
            PremiseRangeStart4: '',
            PremiseRangeEnd4: ''
        };
    }

    public afterNewPremises(): void {
        this.zone.run(() => {
            this.formControl = {
                AccountNumber: this.formControl.AccountNumber,
                AccountName: this.formControl.AccountName,
                InvoiceGroupNumber: this.formControl.InvoiceGroupNumber,
                InvoiceGroupDesc: this.formControl.InvoiceGroupDesc,
                InvoiceGroupROWID: this.formControl.InvoiceGroupROWID,
                chkEntireAccount: '',
                chkSeparateInvoice: '',
                ContractNumber: '',
                ContractNumber1: '',
                ContractNumber2: '',
                PremiseNumber2: '',
                ContractNumber4: '',
                ContractNumber3: '',
                PremiseNumberStart3: '',
                PremiseNumberEnd3: '',
                PremiseRangeStart1: '',
                PremiseRangeEnd1: '',
                PremiseRangeStart2: '',
                PremiseRangeEnd2: '',
                PremiseRangeStart3: '',
                PremiseRangeEnd3: '',
                PremiseRangeStart4: '',
                PremiseRangeEnd4: ''
            };
        });
        this.enableAllFields();
    }
    public enableAllFields(): void {
        this.zone.run(() => {
            this.formControlEnableFlag.AccountNumber = false;
            this.formControlEnableFlag.AccountName = false;
            this.formControlEnableFlag.InvoiceGroupNumber = false;
            this.formControlEnableFlag.InvoiceGroupDesc = false;
            this.formControlEnableFlag.chkEntireAccount = false;
            this.formControlEnableFlag.chkSeparateInvoice = false;
            this.formControlEnableFlag.ContractNumber = false;
            this.formControlEnableFlag.ContractNumber1 = false;
            this.formControlEnableFlag.ContractNumber2 = false;
            this.formControlEnableFlag.PremiseNumber2 = false;
            this.formControlEnableFlag.ContractNumber4 = false;
            this.formControlEnableFlag.ContractNumber3 = false;
            this.formControlEnableFlag.PremiseNumberStart3 = false;
            this.formControlEnableFlag.PremiseNumberEnd3 = false;
            this.formControlEnableFlag.PremiseRangeStart1 = false;
            this.formControlEnableFlag.PremiseRangeEnd1 = false;
            this.formControlEnableFlag.PremiseRangeStart2 = false;
            this.formControlEnableFlag.PremiseRangeEnd2 = false;
            this.formControlEnableFlag.PremiseRangeStart3 = false;
            this.formControlEnableFlag.PremiseRangeEnd3 = false;
            this.formControlEnableFlag.PremiseRangeStart4 = false;
            this.formControlEnableFlag.PremiseRangeEnd4 = false;
        });
    }
    public checkFormat(key: string): void {
        if (/\D/.test(this.formControl[key])) {
            this.formControlErrorFlag[key] = true;
        } else {
            this.formControlErrorFlag[key] = false;
        }
        let statusArr = ['PremiseNumberStart3', 'PremiseNumberEnd3', 'PremiseRangeStart1', 'PremiseRangeEnd1', 'PremiseRangeStart2', 'PremiseRangeEnd2', 'PremiseRangeStart3', 'PremiseRangeEnd3', 'PremiseRangeStart4', 'PremiseRangeEnd4'];
        let statusFlag = false;
        for (key in statusArr) {
            if (this.formControlErrorFlag[statusArr[key]]) {
                statusFlag = true;
                break;
            }
        }
        if (statusFlag) {
            this.formControlErrorFlag['by_premise_range'] = true;
        } else {
            this.formControlErrorFlag['by_premise_range'] = false;
        }
    }
}
