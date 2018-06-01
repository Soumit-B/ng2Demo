import { InternalGridSearchServiceModuleRoutes, InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { PremiseMaintenanceAddrRes } from './iCABSAPremiseMaintenanceAddrRes';
import { PremiseMaintenanceAddrRes1 } from './iCABSAPremiseMaintenanceAddrRes1';
import { PremiseMaintenanceAddrRes3 } from './iCABSAPremiseMaintenanceAddrRes3';

import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from './../../../shared/services/utility';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { InvoiceGroupGridComponent } from './../../internal/grid-search/iCABSAInvoiceGroupGrid';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
import { ContractActionTypes } from '../../actions/contract';
import { InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';

export class PremiseMaintenanceAddrRes2 {
    public sysCharConstants: SysCharConstants;

    //Duplicated Parent Class objects
    public utils: Utils;
    private xhr: any;
    private xhrParams: any;
    private uiForm: any;
    private controls: any;
    private uiDisplay: any;
    private pageParams: any;
    private attributes: any;
    private formData: any;
    private LookUp: any;
    private logger: any;
    private riExchange: RiExchange;
    private riMaintenance: RiMaintenance;
    private riTab: RiTab;
    private viewChild: any;
    public ellipsis: any;
    public pgPM_AR: PremiseMaintenanceAddrRes;
    public pgPM_AR1: PremiseMaintenanceAddrRes1;
    public pgPM_AR2: PremiseMaintenanceAddrRes2;
    public pgPM_AR3: PremiseMaintenanceAddrRes3;

    constructor(private parent: any) {
        this.utils = this.parent.utils;
        this.logger = this.parent.logger;
        this.xhr = this.parent.xhr;
        this.xhrParams = this.parent.xhrParams;
        this.LookUp = this.parent.LookUp;
        this.uiForm = this.parent.uiForm;
        this.controls = this.parent.controls;
        this.ellipsis = this.parent.ellipsis;
        this.uiDisplay = this.parent.uiDisplay;
        this.viewChild = this.parent.viewChild;
        this.pageParams = this.parent.pageParams;
        this.attributes = this.parent.attributes;
        this.formData = this.parent.formData;
        this.sysCharConstants = this.parent.sysCharConstants;
        this.riExchange = this.parent.riExchange;
        this.riMaintenance = this.parent.riMaintenance;
        this.riTab = this.parent.riTab;
    }

    public killSubscription(): void { /* No Subscriptions Present */ }

    //TODO - Move to parent - Duplicated in iCABSAPremiseMaintenanceAddrRes1.ts
    public PremiseAddressLine1Orignal: string = '';
    public PremiseAddressLine2Orignal: string = '';
    public PremiseAddressLine3Orignal: string = '';
    public PremiseAddressLine4Orignal: string = '';
    public PremiseAddressLine5Orignal: string = '';
    public PremisePostcodeOrignal: string = '';
    public HaveResolved: boolean = false;
    public PBusinessCode: string = '';

    public window_onload(): void {
        this.pgPM_AR = this.parent.pgPM_AR;
        this.pgPM_AR1 = this.parent.pgPM_AR1;
        this.pgPM_AR2 = this.parent.pgPM_AR2;
        this.pgPM_AR3 = this.parent.pgPM_AR3;
        //console.log('PremiseMaintenanceAddrRes2 window_onload:', this.utils.getBusinessCode());
        this.init();
    }

    public init(): void {
        //
    }

    public validateField(message: string, tabIndex: number, elem: string, patterStr?: any): boolean {
        if (message.length > 0) setTimeout(() => { this.parent.showAlert(message); }, 300);
        this.riTab.TabFocus(tabIndex);
        //this[elem].focus();
        this.riExchange.riInputElement.markAsError(this.uiForm, elem);
        return true;
    }

    //************************************************************************************
    //* BEFORE SAVE                                                                      *
    //************************************************************************************
    public riMaintenance_BeforeSave(): void {
        let ctrl = this.uiForm.controls;
        this.logger.log('LOG riMaintenance_BeforeSave', ctrl);
        let verror = false;
        let testCtrl: string = '';
        let testStr: string = '';
        let testStr1: string = '';
        let msgbox: string = '';
        let testStr2: number = 0;
        let charExists;

        let vHaveAreadyResolved;

        let AccessErrMsg = MessageConstant.PageSpecificMessage.AccessErrMsg;
        let DateErrMsg = MessageConstant.PageSpecificMessage.DateErrMsg;

        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=CheckLength';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        if (this.parent.getControlValue('PremiseSpecialInstructions') !== '') {
            this.riMaintenance.CBORequestAdd('PremiseSpecialInstructions');
        }
        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            this.logger.log('CBORequestExecute:', data);
            //Display error message
            if (data.hasError) {
                this.parent.showAlert(data.errorMessage);
                this.parent.setControlValue('ErrorMessageDesc', data.errorMessage);
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseSpecialInstructions', true);
                verror = true;
            }
        });

        // Validate input fields - validate the ServiceAdjHrs cannot be greater than 2
        if (!verror) {
            if (!isNaN(parseInt(this.parent.getControlValue('ServiceAdjHrs'), 10))) {
                if (parseInt(this.parent.getControlValue('ServiceAdjHrs'), 10) > 2) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.ServiceAdjHrs, 4, 'ServiceAdjHrs');
                }
            } else {
                verror = this.validateField('', 4, 'ServiceAdjHrs');
            }
        }
        //validate the ServiceAdjMins cannot be greater than 59
        if (!verror) {
            if (!isNaN(parseInt(this.parent.getControlValue('ServiceAdjMins'), 10))) {
                if (parseInt(this.parent.getControlValue('ServiceAdjMins'), 10) > 59) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.ServiceAdjMins, 4, 'ServiceAdjMins');
                }
            } else {
                verror = this.validateField('', 4, 'ServiceAdjMins');
            }
        }
        // has a numeric character been entered
        if (!verror) {
            if (!isNaN(parseInt(this.parent.getControlValue('PremiseType'), 10))) {
                verror = this.validateField('', 4, 'PremiseType');
            }
        }
        // test if (SS or NS has been entered in the PremiseType input field
        if (!verror) {
            if (this.parent.getControlValue('PremiseType') === '') {
                this.parent.setControlValue('PremiseType', 'NS');
            }
            if (this.parent.getControlValue('PremiseType').trim().toUpperCase() !== 'NS'
                && this.parent.getControlValue('PremiseType').trim().toUpperCase() !== 'SS') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.PremiseType, 4, 'PremiseType');
            }
        }

        // test that a Y or a blank has been entered in the proof of service by fax method
        if (!verror) {
            if (this.parent.getControlValue('ProofOfServFax').trim().toUpperCase() !== ''
                && this.parent.getControlValue('ProofOfServFax').trim().toUpperCase() !== 'Y') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.ProofOfServFax, 4, 'ProofOfServFax');
            }
        }

        // test the length of the POS fax number it must be 10 digits long and there are no chars in it
        if (!verror) {
            if (this.parent.getControlValue('ProofOfServFax').trim().toUpperCase() === 'Y') {
                if (this.parent.getControlValue('ProofOfServFax').trim().toUpperCase().length < 10) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.PosFax, 4, 'PosFax');
                } else if (this.pgPM_AR3.TestForChar(this.parent.getControlValue('ProofOfServFax').trim())) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.PosFaxChar, 4, 'ProofOfServFax');
                }
            }
        }
        // test that a Y or a blank has been entered in the proof of service by SMS method
        if (!verror) {
            testStr = this.parent.getControlValue('ProofOfServSMS').trim().toUpperCase();
            if (testStr !== '' && testStr !== 'Y') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.ProofOfServSMS, 4, 'ProofOfServSMS');
            }
        }
        // test the length of the POS SMS number it must be 10 digits long and there are no chars in it
        if (!verror) {
            if (this.parent.getControlValue('ProofOfServSMS').trim().toUpperCase() === 'Y') {
                testStr = this.parent.getControlValue('PosSMS').trim().toUpperCase();
                if (testStr.length < 10) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.PosSMS, 4, 'PosSMS');
                } else if (this.pgPM_AR3.TestForChar(testStr)) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.PosSMSChar, 4, 'PosSMS');
                }
            }
        }
        // test that a Y or a blank has been entered in the proof of service by email method
        if (!verror) {
            testStr = this.parent.getControlValue('ProofOfServEmail').trim().toUpperCase();
            if (testStr !== '' && testStr !== 'Y') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.ProofOfServEmail, 4, 'ProofOfServEmail');
            }
        }
        // test that the their is an email address if (it has been chosen as a delivery method
        // check that the email address does !have any invalid characters
        if (!verror) {
            testStr = this.parent.getControlValue('ProofOfServEmail').trim().toUpperCase();
            if (testStr === 'Y') {
                let testStr1: string = this.parent.getControlValue('PosEmail').trim();
                if (testStr1 === '') {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.PosEmail, 4, 'PosEmail');
                } else if (this.pgPM_AR3.TestForInvalidChar(testStr1)) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.EmailInvalid, 4, 'PosEmail');
                }

            }
        }
        // test that a Y or a blank has been entered in the notify of service by fax method
        if (!verror) {
            testStr = this.parent.getControlValue('NotifyFax').trim().toUpperCase();
            if (testStr !== '' && testStr !== 'Y') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyFax, 4, 'NotifyFax');
            }
        }
        // test the length of the Notify of service fax number it must be 10 digits long and there are no chars in it
        if (!verror) {
            testCtrl = 'NotifyFax';
            testStr = this.parent.getControlValue(testCtrl).trim().toUpperCase();
            if (testStr === 'Y') {
                testCtrl = 'NotifyFaxDetail';
                testStr1 = this.parent.getControlValue(testCtrl).trim().toUpperCase();
                if (testStr1.length < 10) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyFax10, 4, testCtrl);
                } else if (this.pgPM_AR3.TestForChar(testStr1)) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyFaxChar, 4, testCtrl);
                }
            }
        }
        // test that a Y or a blank has been entered in the notify of service by SMS method
        if (!verror) {
            testCtrl = 'NotifySMS';
            testStr = this.parent.getControlValue(testCtrl).trim().toUpperCase();
            if (testStr !== '' && testStr !== 'Y') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.NotifySMS, 4, testCtrl);
            }
        }
        // test the length of the Notify of service SMS number it must be 10 digits long and there are no chars in it
        if (!verror) {
            testCtrl = 'NotifySMS';
            testStr = this.parent.getControlValue(testCtrl).trim().toUpperCase();
            if (testStr === 'Y') {
                testCtrl = 'NotifySMSDetail';
                testStr1 = this.parent.getControlValue(testCtrl).trim().toUpperCase();
                if (testStr1.length < 10) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifySMS10, 4, testCtrl);
                } else if (this.pgPM_AR3.TestForChar(testStr1)) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifySMSChar, 4, testCtrl);
                }
            }
        }

        // test that a Y or a blank has been entered in the notify of service by Phone method
        if (!verror) {
            testCtrl = 'NotifyPhone';
            testStr = this.parent.getControlValue(testCtrl).trim().toUpperCase();
            if (testStr !== '' && testStr !== 'Y') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyPhone, 4, testCtrl);
            }
        }
        // test the length of the Notify of service Phone number it must be 10 digits long and there are no chars in it
        if (!verror) {
            testCtrl = 'NotifyPhone';
            testStr = this.parent.getControlValue(testCtrl).trim().toUpperCase();
            if (testStr === 'Y') {
                testCtrl = 'NotifyPhoneDetail';
                testStr1 = this.parent.getControlValue(testCtrl).trim().toUpperCase();
                if (testStr1.length < 10) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyPhone10, 4, testCtrl);
                } else if (this.pgPM_AR3.TestForChar(testStr1)) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyPhoneChar, 4, testCtrl);
                }
            }
        }

        // test that a Y or a blank has been entered in the notify of service by email method
        if (!verror) {
            testCtrl = 'NotifyEmail';
            testStr = this.parent.getControlValue(testCtrl).trim().toUpperCase();
            if (testStr !== '' && testStr !== 'Y') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyEmail, 4, testCtrl);
            }
        }
        // test that the their is an email address if (it has been chosen as a delivery method
        // also check that the email address does !have any invalid characters
        if (!verror) {
            testCtrl = 'NotifyEmail';
            testStr = this.parent.getControlValue(testCtrl).trim().toUpperCase();
            if (testStr === 'Y') {
                testCtrl = 'NotifyEmailDetail';
                testStr1 = this.parent.getControlValue(testCtrl).trim().toUpperCase();
                if (testStr1 === '') {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyEmailBlank, 4, testCtrl);
                } else if (this.pgPM_AR3.TestForInvalidChar(testStr1)) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.EmailInvalid, 4, testCtrl);
                }
            }
        }
        // check that the NotifyDaysBefore input field is !greater than 14 (or less than 0 just in some user is trying to smart)
        if (!verror) {
            testCtrl = 'NotifyDaysBefore';
            testStr2 = parseInt(this.parent.getControlValue(testCtrl), 10);
            if (!isNaN(testStr2)) {
                if (testStr2 > 14) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyDaysBefore14, 4, testCtrl);
                } else if (testStr2 < 0) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyDaysBefore0, 4, testCtrl);
                }
            }
        }

        if (!verror) {
            if (!this.pgPM_AR3.TestForY(this.parent.getControlValue('AllowAllTasks1'))) {
                msgbox = MessageConstant.PageSpecificMessage.AllowAllTasks;
                verror = this.validateField(msgbox, 6, 'AllowAllTasks1');
            } else if (!this.pgPM_AR3.TestForY(this.parent.getControlValue('AllowAllTasks2'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks2');
            } else if (!this.pgPM_AR3.TestForY(this.parent.getControlValue('AllowAllTasks3'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks3');
            } else if (!this.pgPM_AR3.TestForY(this.parent.getControlValue('AllowAllTasks4'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks4');
            } else if (!this.pgPM_AR3.TestForY(this.parent.getControlValue('AllowAllTasks5'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks5');
            } else if (!this.pgPM_AR3.TestForY(this.parent.getControlValue('AllowAllTasks6'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks6');
            } else if (!this.pgPM_AR3.TestForY(this.parent.getControlValue('AllowAllTasks7'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks7');
            } else if (!this.pgPM_AR3.TestForY(this.parent.getControlValue('AllowAllTasks8'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks8');
            } else if (!this.pgPM_AR3.TestForY(this.parent.getControlValue('AllowAllTasks9'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks9');
            } else if (!this.pgPM_AR3.TestForY(this.parent.getControlValue('AllowAllTasks10'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks10');
            }
        }

        if (!verror) {
            if (this.pgPM_AR3.TestForDupTechs(this.parent.getControlValue('EmployeeCode1') + 1) && this.parent.getControlValue('EmployeeCode1') !== '') {
                msgbox = MessageConstant.PageSpecificMessage.TechAddOnce;
                testCtrl = 'EmployeeCode1';
                verror = this.validateField(msgbox, 6, testCtrl);
            } else if (this.pgPM_AR3.TestForDupTechs(this.parent.getControlValue('EmployeeCode2') + 2) && this.parent.getControlValue('EmployeeCode2') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode2';
                verror = this.validateField(msgbox, 6, testCtrl);
            } else if (this.pgPM_AR3.TestForDupTechs(this.parent.getControlValue('EmployeeCode3') + 3) && this.parent.getControlValue('EmployeeCode3') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode3';
                verror = this.validateField(msgbox, 6, testCtrl);
            } else if (this.pgPM_AR3.TestForDupTechs(this.parent.getControlValue('EmployeeCode4') + 4) && this.parent.getControlValue('EmployeeCode4') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode4';
                verror = this.validateField(msgbox, 6, testCtrl);
            } else if (this.pgPM_AR3.TestForDupTechs(this.parent.getControlValue('EmployeeCode5') + 5) && this.parent.getControlValue('EmployeeCode5') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode5';
                verror = this.validateField(msgbox, 6, testCtrl);
            } else if (this.pgPM_AR3.TestForDupTechs(this.parent.getControlValue('EmployeeCode6') + 6) && this.parent.getControlValue('EmployeeCode6') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode6';
                verror = this.validateField(msgbox, 6, testCtrl);
            } else if (this.pgPM_AR3.TestForDupTechs(this.parent.getControlValue('EmployeeCode7') + 7) && this.parent.getControlValue('EmployeeCode7') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode7';
                verror = this.validateField(msgbox, 6, testCtrl);
            } else if (this.pgPM_AR3.TestForDupTechs(this.parent.getControlValue('EmployeeCode8') + 8) && this.parent.getControlValue('EmployeeCode8') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode8';
                verror = this.validateField(msgbox, 6, testCtrl);
            } else if (this.pgPM_AR3.TestForDupTechs(this.parent.getControlValue('EmployeeCode9') + 9) && this.parent.getControlValue('EmployeeCode9') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode9';
                verror = this.validateField(msgbox, 6, testCtrl);
            } else if (this.pgPM_AR3.TestForDupTechs(this.parent.getControlValue('EmployeeCode10') + 10) && this.parent.getControlValue('EmployeeCode10') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode10';
                verror = this.validateField(msgbox, 6, testCtrl);
            }
        }

        if (this.pageParams.vSCEnableValidatePostcodeSuburb) {
            if (!verror) {
                if (this.pgPM_AR3.ValidatePostcodeSuburb()) {
                    msgbox = MessageConstant.PageSpecificMessage.SuburbPostCode;
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseAddressLine4', true);
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseAddressLine5', true);
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremisePostcode', true);
                    this.riTab.TabFocus(1);
                    //this.viewChild.PremisePostcode.focus();
                    verror = true;
                }
            }
        }

        if (!verror) {
            // if (this.pgPM_AR3.ValidateTechs()) {
            //     verror = true;
            // }
            this.pgPM_AR3.ValidateTechs(function (): void {

                if (!verror) {
                    if (this.utils.StrComp(this.parent.getControlValue('DateFrom1'), '') !== 0) {
                        if (this.utils.StrComp(this.parent.getControlValue('DateTo1'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.parent.getControlValue('DateFrom1'), this.parent.getControlValue('DateTo1')) < 0) {
                                msgbox = DateErrMsg; this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                //this.DateFrom1.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom1', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo1', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.parent.getControlValue('DateFrom2'), '') !== 0) {
                        if (this.utils.StrComp(this.parent.getControlValue('DateTo2'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.parent.getControlValue('DateFrom2'), this.parent.getControlValue('DateTo2')) < 0) {
                                msgbox = DateErrMsg; this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                //this.DateFrom2.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom2', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo2', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.parent.getControlValue('DateFrom3'), '') !== 0) {
                        if (this.utils.StrComp(this.parent.getControlValue('DateTo3'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.parent.getControlValue('DateFrom3'), this.parent.getControlValue('DateTo3')) < 0) {
                                msgbox = DateErrMsg; this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                //this.DateFrom3.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom3', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo3', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.parent.getControlValue('DateFrom4'), '') !== 0) {
                        if (this.utils.StrComp(this.parent.getControlValue('DateTo4'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.parent.getControlValue('DateFrom4'), this.parent.getControlValue('DateTo4')) < 0) {
                                msgbox = DateErrMsg; this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                //this.DateFrom4.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom4', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo4', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.parent.getControlValue('DateFrom5'), '') !== 0) {
                        if (this.utils.StrComp(this.parent.getControlValue('DateTo5'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.parent.getControlValue('DateFrom5'), this.parent.getControlValue('DateTo5')) < 0) {
                                msgbox = DateErrMsg; this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                //this.DateFrom5.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom5', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo5', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.parent.getControlValue('DateFrom6'), '') !== 0) {
                        if (this.utils.StrComp(this.parent.getControlValue('DateTo6'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.parent.getControlValue('DateFrom6'), this.parent.getControlValue('DateTo6')) < 0) {
                                msgbox = DateErrMsg; this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                //this.DateFrom6.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom6', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo6', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.parent.getControlValue('DateFrom7'), '') !== 0) {
                        if (this.utils.StrComp(this.parent.getControlValue('DateTo7'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.parent.getControlValue('DateFrom7'), this.parent.getControlValue('DateTo7')) < 0) {
                                msgbox = DateErrMsg; this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                //this.DateFrom7.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom7', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo7', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.parent.getControlValue('DateFrom8'), '') !== 0) {
                        if (this.utils.StrComp(this.parent.getControlValue('DateTo8'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.parent.getControlValue('DateFrom8'), this.parent.getControlValue('DateTo8')) < 0) {
                                msgbox = DateErrMsg; this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                //this.DateFrom8.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.parent.getControlValue('DateFrom9'), '') !== 0) {
                        if (this.utils.StrComp(this.parent.getControlValue('DateTo9'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.parent.getControlValue('DateFrom9'), this.parent.getControlValue('DateTo9')) < 0) {
                                msgbox = DateErrMsg; this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                //this.DateFrom9.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.parent.getControlValue('DateFrom10'), '') !== 0) {
                        if (this.utils.StrComp(this.parent.getControlValue('DateTo10'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.parent.getControlValue('DateFrom10'), this.parent.getControlValue('DateTo10')) < 0) {
                                msgbox = DateErrMsg; this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                //this.DateFrom10.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
                                verror = true;
                            }
                        }

                    }
                }


                if (!verror) {
                    if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom2.value, ctrl.DateTo2.value)) {
                        this.pgPM_AR3.DateFrom_a1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom3.value, ctrl.DateTo3.value)) {
                        this.pgPM_AR3.DateFrom_a2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom4.value, ctrl.DateTo4.value)) {
                        this.pgPM_AR3.DateFrom_a3();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom5.value, ctrl.DateTo5.value)) {
                        this.pgPM_AR3.DateFrom_a4();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom6.value, ctrl.DateTo6.value)) {
                        this.pgPM_AR3.DateFrom_a5();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom7.value, ctrl.DateTo7.value)) {
                        this.pgPM_AR3.DateFrom_a6();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom8.value, ctrl.DateTo8.value)) {
                        this.pgPM_AR3.DateFrom_a7();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_a8();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_a9();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom3.value, ctrl.DateTo3.value)) {
                        this.pgPM_AR3.DateFrom_b1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom4.value, ctrl.DateTo4.value)) {
                        this.pgPM_AR3.DateFrom_b2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom5.value, ctrl.DateTo5.value)) {
                        this.pgPM_AR3.DateFrom_b3();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom6.value, ctrl.DateTo6.value)) {
                        this.pgPM_AR3.DateFrom_b4();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom7.value, ctrl.DateTo7.value)) {
                        this.pgPM_AR3.DateFrom_b5();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom8.value, ctrl.DateTo8.value)) {
                        this.pgPM_AR3.DateFrom_b6();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_b7();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_b8();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom3.value, ctrl.DateTo3.value, ctrl.DateFrom4.value, ctrl.DateTo4.value)) {
                        this.pgPM_AR3.DateFrom_c1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom3.value, ctrl.DateTo3.value, ctrl.DateFrom5.value, ctrl.DateTo5.value)) {
                        this.pgPM_AR3.DateFrom_c2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom3.value, ctrl.DateTo3.value, ctrl.DateFrom6.value, ctrl.DateTo6.value)) {
                        this.pgPM_AR3.DateFrom_c3();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom3.value, ctrl.DateTo3.value, ctrl.DateFrom7.value, ctrl.DateTo7.value)) {
                        this.pgPM_AR3.DateFrom_c4();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom3.value, ctrl.DateTo3.value, ctrl.DateFrom8.value, ctrl.DateTo8.value)) {
                        this.pgPM_AR3.DateFrom_c5();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom3.value, ctrl.DateTo3.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_c6();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom3.value, ctrl.DateTo3.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_c7();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom4.value, ctrl.DateTo4.value, ctrl.DateFrom5.value, ctrl.DateTo5.value)) {
                        this.pgPM_AR3.DateFrom_d1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom4.value, ctrl.DateTo4.value, ctrl.DateFrom6.value, ctrl.DateTo6.value)) {
                        this.pgPM_AR3.DateFrom_d2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom4.value, ctrl.DateTo4.value, ctrl.DateFrom7.value, ctrl.DateTo7.value)) {
                        this.pgPM_AR3.DateFrom_d3();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom4.value, ctrl.DateTo4.value, ctrl.DateFrom8.value, ctrl.DateTo8.value)) {
                        this.pgPM_AR3.DateFrom_d4();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom4.value, ctrl.DateTo4.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_d5();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom4.value, ctrl.DateTo4.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_d6();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom5.value, ctrl.DateTo5.value, ctrl.DateFrom6.value, ctrl.DateTo6.value)) {
                        this.pgPM_AR3.DateFrom_e1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom5.value, ctrl.DateTo5.value, ctrl.DateFrom7.value, ctrl.DateTo7.value)) {
                        this.pgPM_AR3.DateFrom_e2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom5.value, ctrl.DateTo5.value, ctrl.DateFrom8.value, ctrl.DateTo8.value)) {
                        this.pgPM_AR3.DateFrom_e3();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom5.value, ctrl.DateTo5.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_e4();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom5.value, ctrl.DateTo5.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_e5();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom6.value, ctrl.DateTo6.value, ctrl.DateFrom7.value, ctrl.DateTo7.value)) {
                        this.pgPM_AR3.DateFrom_f1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom6.value, ctrl.DateTo6.value, ctrl.DateFrom8.value, ctrl.DateTo8.value)) {
                        this.pgPM_AR3.DateFrom_f2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom6.value, ctrl.DateTo6.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_f3();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom6.value, ctrl.DateTo6.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_f4();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom7.value, ctrl.DateTo7.value, ctrl.DateFrom8.value, ctrl.DateTo8.value)) {
                        this.pgPM_AR3.DateFrom_g1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom7.value, ctrl.DateTo7.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_g2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom7.value, ctrl.DateTo7.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_g3();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom8.value, ctrl.DateTo8.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_h1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom8.value, ctrl.DateTo8.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_h2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom9.value, ctrl.DateTo9.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_i1();
                        verror = true;
                    }
                }

                if (!verror) {
                    if (this.utils.StrComp(ctrl.AccessFrom1.value, '') !== 0) {
                        if (this.utils.StrComp(ctrl.AccessTo1.value, '') !== 0) {
                            if (this.utils.TimeValue(ctrl.AccessFrom1.value) >= this.utils.TimeValue(ctrl.AccessTo1.value)) {
                                msgbox = AccessErrMsg;
                                this.riTab.TabFocus(8);
                                //this.AccessFrom1.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom1', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(ctrl.AccessFrom2.value, '') !== 0) {
                        if (this.utils.StrComp(ctrl.AccessTo2.value, '') !== 0) {
                            if (this.utils.TimeValue(ctrl.AccessFrom2.value) >= this.utils.TimeValue(ctrl.AccessTo2.value)) {
                                msgbox = AccessErrMsg;
                                this.riTab.TabFocus(8);
                                //this.AccessFrom2.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom2', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(ctrl.AccessFrom3.value, '') !== 0) {
                        if (this.utils.StrComp(ctrl.AccessTo3.value, '') !== 0) {
                            if (this.utils.TimeValue(ctrl.AccessFrom3.value) >= this.utils.TimeValue(ctrl.AccessTo3.value)) {
                                msgbox = AccessErrMsg;
                                this.riTab.TabFocus(8);
                                //this.AccessFrom3.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom3', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(ctrl.AccessFrom4.value, '') !== 0) {
                        if (this.utils.StrComp(ctrl.AccessTo4.value, '') !== 0) {
                            if (this.utils.TimeValue(ctrl.AccessFrom4.value) >= this.utils.TimeValue(ctrl.AccessTo4.value)) {
                                msgbox = AccessErrMsg;
                                this.riTab.TabFocus(8);
                                //this.AccessFrom4.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom4', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(ctrl.AccessFrom5.value, '') !== 0) {
                        if (this.utils.StrComp(ctrl.AccessTo5.value, '') !== 0) {
                            if (this.utils.TimeValue(ctrl.AccessFrom5.value) >= this.utils.TimeValue(ctrl.AccessTo5.value)) {
                                msgbox = AccessErrMsg;
                                this.riTab.TabFocus(8);
                                //this.AccessFrom5.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom5', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(ctrl.AccessFrom6.value, '') !== 0) {
                        if (this.utils.StrComp(ctrl.AccessTo6.value, '') !== 0) {
                            if (this.utils.TimeValue(ctrl.AccessFrom6.value) >= this.utils.TimeValue(ctrl.AccessTo6.value)) {
                                msgbox = AccessErrMsg;
                                this.riTab.TabFocus(8);
                                //this.AccessFrom6.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom6', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(ctrl.AccessFrom7.value, '') !== 0) {
                        if (this.utils.StrComp(ctrl.AccessTo7.value, '') !== 0) {
                            if (this.utils.TimeValue(ctrl.AccessFrom7.value) >= this.utils.TimeValue(ctrl.AccessTo7.value)) {
                                msgbox = AccessErrMsg;
                                this.riTab.TabFocus(8);
                                //this.AccessFrom7.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom7', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(ctrl.AccessFrom8.value, '') !== 0) {
                        if (this.utils.StrComp(ctrl.AccessTo8.value, '') !== 0) {
                            if (this.utils.TimeValue(ctrl.AccessFrom8.value) >= this.utils.TimeValue(ctrl.AccessTo8.value)) {
                                msgbox = AccessErrMsg;
                                this.riTab.TabFocus(8);
                                //this.AccessFrom8.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(ctrl.AccessFrom9.value, '') !== 0) {
                        if (this.utils.StrComp(ctrl.AccessTo9.value, '') !== 0) {
                            if (this.utils.TimeValue(ctrl.AccessFrom9.value) >= this.utils.TimeValue(ctrl.AccessTo9.value)) {
                                msgbox = AccessErrMsg;
                                this.riTab.TabFocus(8);
                                //this.AccessFrom9.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(ctrl.AccessFrom10.value, '') !== 0) {
                        if (this.utils.StrComp(ctrl.AccessTo10.value, '') !== 0) {
                            if (this.utils.TimeValue(ctrl.AccessFrom10.value) >= this.utils.TimeValue(ctrl.AccessTo10.value)) {
                                msgbox = AccessErrMsg;
                                this.riTab.TabFocus(8);
                                //this.AccessFrom10.focus();
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
                                verror = true;
                            }
                        }
                    }
                }

                if (!verror) {
                    if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom2.value, ctrl.AccessTo2.value)) {
                        this.pgPM_AR3.AccessFrom_a1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom3.value, ctrl.AccessTo3.value)) {
                        this.pgPM_AR3.AccessFrom_a2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom4.value, ctrl.AccessTo4.value)) {
                        this.pgPM_AR3.AccessFrom_a3();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom5.value, ctrl.AccessTo5.value)) {
                        this.pgPM_AR3.AccessFrom_a4();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom6.value, ctrl.AccessTo6.value)) {
                        this.pgPM_AR3.AccessFrom_a5();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom7.value, ctrl.AccessTo7.value)) {
                        this.pgPM_AR3.AccessFrom_a6();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom8.value, ctrl.AccessTo8.value)) {
                        this.pgPM_AR3.AccessFrom_a7();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_a8();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_a9();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom3.value, ctrl.AccessTo3.value)) {
                        this.pgPM_AR3.AccessFrom_b1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom4.value, ctrl.AccessTo4.value)) {
                        this.pgPM_AR3.AccessFrom_b2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom5.value, ctrl.AccessTo5.value)) {
                        this.pgPM_AR3.AccessFrom_b3();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom6.value, ctrl.AccessTo6.value)) {
                        this.pgPM_AR3.AccessFrom_b4();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom7.value, ctrl.AccessTo7.value)) {
                        this.pgPM_AR3.AccessFrom_b5();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom8.value, ctrl.AccessTo8.value)) {
                        this.pgPM_AR3.AccessFrom_b6();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_b7();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_b8();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom3.value, ctrl.AccessTo3value, ctrl.AccessFrom4.value, ctrl.AccessTo4.value)) {
                        this.pgPM_AR3.AccessFrom_c1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom3.value, ctrl.AccessTo3.value, ctrl.AccessFrom5.value, ctrl.AccessTo5.value)) {
                        this.pgPM_AR3.AccessFrom_c2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom3.value, ctrl.AccessTo3.value, ctrl.AccessFrom6.value, ctrl.AccessTo6.value)) {
                        this.pgPM_AR3.AccessFrom_c3();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom3.value, ctrl.AccessTo3.value, ctrl.AccessFrom7.value, ctrl.AccessTo7.value)) {
                        this.pgPM_AR3.AccessFrom_c4();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom3.value, ctrl.AccessTo3.value, ctrl.AccessFrom8.value, ctrl.AccessTo8.value)) {
                        this.pgPM_AR3.AccessFrom_c5();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom3.value, ctrl.AccessTo3.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_c6();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom3.value, ctrl.AccessTo3.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_c7();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom4.value, ctrl.AccessTo4.value, ctrl.AccessFrom5.value, ctrl.AccessTo5.value)) {
                        this.pgPM_AR3.AccessFrom_d1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom4.value, ctrl.AccessTo4.value, ctrl.AccessFrom6.value, ctrl.AccessTo6.value)) {
                        this.pgPM_AR3.AccessFrom_d2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom4.value, ctrl.AccessTo4.value, ctrl.AccessFrom7.value, ctrl.AccessTo7.value)) {
                        this.pgPM_AR3.AccessFrom_d3();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom4.value, ctrl.AccessTo4.value, ctrl.AccessFrom8.value, ctrl.AccessTo8.value)) {
                        this.pgPM_AR3.AccessFrom_d4();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom4.value, ctrl.AccessTo4.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_d5();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom4.value, ctrl.AccessTo4.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_d6();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom5.value, ctrl.AccessTo5.value, ctrl.AccessFrom6.value, ctrl.AccessTo6.value)) {
                        this.pgPM_AR3.AccessFrom_e1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom5.value, ctrl.AccessTo5.value, ctrl.AccessFrom7.value, ctrl.AccessTo7.value)) {
                        this.pgPM_AR3.AccessFrom_e2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom5.value, ctrl.AccessTo5.value, ctrl.AccessFrom8.value, ctrl.AccessTo8.value)) {
                        this.pgPM_AR3.AccessFrom_e3();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom5.value, ctrl.AccessTo5.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_e4();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom5.value, ctrl.AccessTo5.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_e5();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom6.value, ctrl.AccessTo6.value, ctrl.AccessFrom7.value, ctrl.AccessTo7.value)) {
                        this.pgPM_AR3.AccessFrom_f1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom6.value, ctrl.AccessTo6.value, ctrl.AccessFrom8.value, ctrl.AccessTo8.value)) {
                        this.pgPM_AR3.AccessFrom_f2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom6.value, ctrl.AccessTo6.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_f3();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom6.value, ctrl.AccessTo6.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_f4();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom7.value, ctrl.AccessTo7.value, ctrl.AccessFrom8.value, ctrl.AccessTo8.value)) {
                        this.pgPM_AR3.AccessFrom_g1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom7.value, ctrl.AccessTo7.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_g2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom7.value, ctrl.AccessTo7.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_g3();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom8.value, ctrl.AccessTo8.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_h1();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom8.value, ctrl.AccessTo8.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_h2();
                        verror = true;
                    } else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom9.value, ctrl.AccessTo9.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_i1();
                        verror = true;
                    }
                }
            });
        }

        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=WarnSRAEmployee';
        if (ctrl.PremiseSRAEmployee.value.trim() !== '') {
            this.riMaintenance.CBORequestAdd('PremiseSRAEmployee');
        }
        if (ctrl.PremiseSRADate.value !== '') {
            this.riMaintenance.CBORequestAdd('PremiseSRADate');
        }
        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            if (data.hasError) {
                this.parent.showAlert(data.errorMessage);
                this.parent.setControlValue('ErrorMessageDesc', data.errorMessage);
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseSRAEmployee', true);
                verror = true;
            }
        });

        //Check Address and Postcode
        if (this.pageParams.vSCPostCodeMustExistInPAF && (this.pageParams.vSCEnableHopewiserPAF || this.pageParams.vSCEnableDatabasePAF)) {
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=CheckPostcode';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);

            if (ctrl.PremiseName.value !== '') this.riMaintenance.CBORequestAdd('PremiseName');
            if (ctrl.PremiseAddressLine1.value !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine1');
            if (ctrl.PremiseAddressLine2.value !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine2');
            if (ctrl.PremiseAddressLine3.value !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine3');
            if (ctrl.PremiseAddressLine4.value !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine4');
            if (ctrl.PremiseAddressLine5.value !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine5');
            if (ctrl.PremisePostcode.value !== '') this.riMaintenance.CBORequestAdd('PremisePostcode');

            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                if (data.hasError) {
                    this.parent.showAlert(data.errorMessage);
                    this.parent.setControlValue('ErrorMessageDesc', data.errorMessage);
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseSRAEmployee', true);
                    verror = true;
                }
            });

            if (verror) {
                this.riMaintenance.CancelEvent = true;
            }
        }

        if (verror) {
            this.riMaintenance.CancelEvent = true;
        }

        this.riMaintenance.CustomBusinessObjectAdditionalPostData = '';

        //ctrl.DisableList.value = FieldDisableList; //TODO - Functionality not found

        this.PremiseAddressLine1Orignal = this.parent.getControlValue('PremiseAddressLine1');
        this.PremiseAddressLine2Orignal = this.parent.getControlValue('PremiseAddressLine2');
        this.PremiseAddressLine3Orignal = this.parent.getControlValue('PremiseAddressLine3');
        this.PremiseAddressLine4Orignal = this.parent.getControlValue('PremiseAddressLine4');
        this.PremiseAddressLine5Orignal = this.parent.getControlValue('PremiseAddressLine5');
        this.PremisePostcodeOrignal = this.parent.getControlValue('PremisePostcode');
        this.HaveResolved = true;
    }

    public riMaintenance_AfterSave(): void {
        this.parent.setControlValue('ErrorMessageDesc', '');
        if (this.parent.actionSave === 1) this.parent.setControlValue('ContractTypeCode', this.pageParams.currentContractType);

        // let fields = 'PremiseROWID, Premise, AccountNumber, NegBranchNumber, BusinessCode, ContractNumber, PremiseName, PremiseNumber, ClientReference, CustomerTypeCode, DiscountCode, InvoiceGroupNumber, LostBusinessRequestNumber, PremiseCommenceDate, PremiseAddressLine1, PremiseAddressLine2, PremiseAddressLine3, PremiseAddressLine4, PremiseAddressLine5, PremisePostcode, DrivingChargeInd, DrivingChargeValue, PremiseContactName, PremiseContactPosition, PremiseContactDepartment, PremiseContactEmail, PremiseContactFax, PremiseContactTelephone, PremiseContactMobile, NationalAccountBranch, ServiceBranchNumber, SalesAreaCode, PremiseSalesEmployee, PremiseSpecialInstructions, PremiseSRADate, PremiseSRAEmployee, PNOL, PNOLSiteRef, PNOLiCABSLevel, PNOLLevelDesc, PurchaseOrderNo, PurchaseOrderLineNo, PurchaseOrderExpiryDate, InvoiceSuspendInd, InvoiceSuspendText, PremiseDirectoryName, PremiseDirectoryPage, PremiseDirectoryGridRef, InvoiceNarrativeText, RetainServiceWeekdayInd, ServiceReceiptRequired, ProofOfServiceRequired, AccountName, InactiveEffectDate, LostBusinessDesc, LostBusinessDesc2, LostBusinessDesc3, Status, PremiseAnnualValue, ShowValueButton, AnyPendingBelow, CustomerInfoAvailable, ContractHasExpired, GPSCoordinateX, GPSCoordinateY, PremiseFixedServiceTime, VehicleTypeNumber, LanguageCode, PrintRequired, PNOLEffectiveDate, PNOLEffectiveDefault, PNOLUpliftAmount, PNOLSetupChargeToApply, origPNOL, origPNOLiCABSLevel, origPNOLEffectiveDate, PremiseRegNumber, PremiseReference, PremiseServiceNote, PremiseAliasName, LinkedToContractNumber, LinkedToPremiseNumber, PremiseParkingNote, PlanningHighlightInd, HyperSensitive, AppointmentRequiredInd, AppointmentDetailDesc, PremisePlanningNote, AdditionalComments1, AdditionalComments2, PreferredDayOfWeekReasonCode, PreferredDayOfWeekNote, WasteConsignmentNoteExemptInd, WasteConsignmentNoteExpiryDate, WasteRegulatoryPremiseRef, NextWasteConsignmentNoteNumber, ProofScanRequiredInd, ProofSignatureRequiredInd, ClosedCalendarTemplateNumber, SICCode, RegulatoryAuthorityNumber, RoutingSource, RoutingGeonode, RoutingScore, EnvironmentalRestrictedAreaInd, EnvironmentalRestrictedAreaText, InitialTreatmentInstructions, TechRetentionInd, TechRetentionReasonCode, PDACloseRecommendationInd, PremiseVtxGeoCode, OutsideCityLimits, AssociatedToPremiseNumber, TelesalesEmployeeCode, TelesalesInd, CustomerIndicationNumber, MatchedPremiseNumber, MatchedContractNumber, ServiceNotifyTemplateEmail, ServiceNotifyTemplateSMS, GblSRATypeCode, GblSRADesc, CreateNewSRA, GblSRAAdditionalSRA, GblSRAAdditionalSRADocRef, StoreType, StoreNumber, CICustRefReq, CIRWOReq, CICFWOReq, CICFWOSep, CICResponseSLA, CIFirstSLAEscDays, CISubSLAEscDays, WindowStart01, WindowEnd01, WindowStart02, WindowEnd02, WindowStart03, WindowEnd03, WindowStart04, WindowEnd04, WindowStart05, WindowEnd05, WindowStart06, WindowEnd06, WindowStart07, WindowEnd07, WindowStart08, WindowEnd08, WindowStart09, WindowEnd09, WindowStart10, WindowEnd10, WindowStart11, WindowEnd11, WindowStart12, WindowEnd12, WindowStart13, WindowEnd13, WindowStart14, WindowEnd14, WindowPreferredInd01, WindowPreferredInd02, WindowPreferredInd03, WindowPreferredInd04, WindowPreferredInd05, WindowPreferredInd06, WindowPreferredInd07';
        // fields = fields.replace(/\\t/g, '').replace(/\r?\n|\r/g, '').replace(/ /g, '');
        // let fieldsArr = fields.split(',');

        let fieldsArr = this.riExchange.getAllCtrl(this.controls);
        this.riMaintenance.clear();
        for (let i = 0; i < fieldsArr.length; i++) {
            let id = fieldsArr[i];
            let dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            let value = this.parent.getControlValue(id);
            switch (id) {
                case 'PremiseROWID':
                case 'PremiseRowID':
                    value = this.parent.getControlValue('Premise');
                    break;
            }
            //this.logger.log('   IP:', id, ' Value:', value, '   Datatype:', dataType);
            this.riMaintenance.PostDataAdd(id, value, dataType);
        }

        this.riMaintenance.PostDataAdd('Mode', 'NewUI', MntConst.eTypeText);

        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasError) {
                if (data.errorMessage.trim() !== '') {
                    this.logger.log('Post data Error', data);
                    this.parent.showAlert(data.errorMessage);
                }
            } else {
                this.logger.log('Post data Saved', data);
                this.parent.routeAwayGlobals.setSaveEnabledFlag(false);
                if (data.hasOwnProperty('InvoiceGroupDesc')) {
                    if (data.InvoiceGroupDesc !== '') {
                        this.parent.showAlert(MessageConstant.Message.SavedSuccessfully, 1);
                        this.parent.callbackHooks.push(function (): void {
                            this.parent.riMaintenance.renderResponseForCtrl(this, data);
                            this.parent.riMaintenance.CurrentMode = MntConst.eModeUpdate;
                            this.parent.pgPM2.riMaintenance_AfterSaveAdd_clbk();
                        });
                    } else {
                        this.parent.showAlert(MessageConstant.Message.SaveUnSuccessful, 0);
                    }
                }
            }
        }, 'POST', this.parent.actionSave);
    }

    //************************************************************************************
    //* AFTER SAVE ADD                                                                   *
    //************************************************************************************
    public riMaintenance_AfterSaveAdd_clbk(): void {
        //validate contracts are not added without premises
        if (this.pageParams.ParentMode === 'Contract-Add') {
            this.pageParams.PremiseAdded = true;
        }
        if (this.pageParams.CurrentContractType === 'C' || this.pageParams.CurrentContractType === 'J') {
            this.parent.navigate('Premise-Add', ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE);
        } else {  //(Product Sales)
            this.parent.navigate('Premise-Add', InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_1);
        }
        this.HaveResolved = true;
    }

    //************************************************************************************
    //* AFTER ABANDON                                                                    *
    //************************************************************************************
    public riMaintenance_AfterAbandon(): void {
        // if (ContractNumber.value !== '/wsscripts/riHTMLWrapper.p?riFileName=') {
        //     if (InactiveEffectDate.value !== '') {
        //         labelInactiveEffectDate.style.display = ''
        //         InactiveEffectDate.style.display = ''

        //         if (LostBusinessDesc.value !== '') {
        //             LostBusinessDesc.style.display = ''
        //         } else {
        //             LostBusinessDesc.style.display = 'none'
        //         } else {
        //             labelInactiveEffectDate.style.display = 'none'
        //             InactiveEffectDate.style.display = 'none'
        //             LostBusinessDesc.style.display = 'none'
        //         }
        //         if (ShowValueButton.checked = true) {
        //             cmdValue.style.display = ''
        //         } else {
        //             cmdValue.style.display = 'none'
        //         }
        //         if (SCEnableDrivingCharges And DrivingChargeInd.checked And CurrentContractType !== 'P') {
        //             tdDrivingChargeValueLab.style.display = ''
        //             tdDrivingChargeValue.style.display = ''
        //         } else {
        //             tdDrivingChargeValueLab.style.display = 'none'
        //             tdDrivingChargeValue.style.display = 'none'
        //         }
        //     }
        //     PremiseAddressLine1Orignal = PremiseAddressLine1.value
        //     PremiseAddressLine2Orignal = PremiseAddressLine2.value
        //     PremiseAddressLine3Orignal = PremiseAddressLine3.value
        //     PremiseAddressLine4Orignal = PremiseAddressLine4.value
        //     PremiseAddressLine5Orignal = PremiseAddressLine5.value
        //     PremisePostcodeOrignal = PremisePostcode.value
        //     HaveResolved = true
        // }
    }


    //************************************************************************************
    //* Functions (DefaultFromPostcode / CheckPostcode)                                  *
    //************************************************************************************
    public DefaultFromPostcode(): void {
        let ctrl = this.uiForm.controls;
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=DefaultFromPostcode' + '&ContractTypeCode=' + this.pageParams.CurrentContractType + '&NegBranchNumber=' + ctrl.NegBranchNumber.value;

        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestAdd('ContractNumber');
        this.riMaintenance.CBORequestAdd('PremisePostcode');
        this.riMaintenance.CBORequestAdd('PremiseAddressLine5'); //State
        this.riMaintenance.CBORequestAdd('PremiseAddressLine4'); //Town
        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            this.logger.log('CBORequestExecute:', data);
            if (data.hasError) {
                this.parent.showAlert(data.errorMessage);
                this.parent.setControlValue('ErrorMessageDesc', data.errorMessage);
            }
        });
    }

    public CheckPostcode(): void {
        let ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSCheckContractPostcode.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('SearchPostcode', ctrl.SearchPostcode.value, MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('strFoundPostcode', MntConst.eTypeText);

        this.riMaintenance.Execute(this, function (data: any): any {
            if (data['strFoundPostcode'] === 'Yes') {
                //TODO - verify the data returned
                // this.ContractNumber.removeAttribute('RenegContract')
                // this.PremisePostcode.removeAttribute('ContractNumber')
                // this.PremisePostcode.removeAttribute('PremiseNumber')
                // WindowPath = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAPremiseSearch.htm<maxwidth>' + CurrentContractTypeURLParameter
                // riExchange.Mode = 'PremisePostcodeSearch': window.location = WindowPath
            }
        });
    }


    //************************************************************************************
    //* Menu                                                                             *
    //************************************************************************************
    public BuildMenuOptions(): void {
        let menuOptions = [];
        menuOptions.push({ value: 'ContactManagement', label: 'Contact Management' });
        menuOptions.push({ value: 'ServiceCover', label: 'Service Covers' });
        menuOptions.push({ value: 'History', label: 'Premises History' });
        menuOptions.push({ value: 'ProRataCharge', label: 'Pro Rata Charge' });
        if (this.pageParams.vEnableLocations) {
            menuOptions.push({ value: 'Allocate', label: 'Allocate Locations' });
        }
        menuOptions.push({ value: 'InvoiceNarrative', label: 'Invoice Narrative' });
        menuOptions.push({ value: 'InvoiceCharge', label: 'Invoice Charge' });
        menuOptions.push({ value: 'InvoiceHistory', label: 'Invoice History' });
        menuOptions.push({ value: 'StaticVisits', label: 'Static Visits (SOS)' });
        menuOptions.push({ value: 'VisitSummary', label: 'Visit Summary' });
        menuOptions.push({ value: 'StateOfService', label: 'State of Service' });
        menuOptions.push({ value: 'CustomerInformation', label: 'Customer Information' });
        if (this.pageParams.vEnableInstallsRemovals) {
            menuOptions.push({ value: 'ThirdPartyInstall', label: '3rd Party Installation Note' });
        }
        menuOptions.push({ value: 'EventHistory', label: 'Event History' });
        menuOptions.push({ value: 'Contract', label: 'Contract' });
        //this.iefAddCustomOptions(); //Functionality not found

        this.parent.dropDown.menu = menuOptions;
        setTimeout(() => { this.parent.setControlValue('menu', 'Options'); }, 500);
    }

    //************************************************************************************
    //* Menu - onchange/ondeactivate actions                                             *
    //************************************************************************************
    public menu_onchange(menu: any): void {
        this.logger.log('menu_onchange', menu);
        let ctrl = this.uiForm.controls;
        if (this.riMaintenance.RecordSelected()) {
            let blnAccess;
            if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Full' ||
                this.riExchange.ClientSideValues.Fetch('BranchNumber') === ctrl.ServiceBranchNumber.value ||
                this.riExchange.ClientSideValues.Fetch('BranchNumber') === ctrl.NegBranchNumber.value) {
                blnAccess = true;
            } else {
                blnAccess = false;
            }

            switch (menu) {
                case 'ContactManagement': this.cmdContactManagement_onclick(); break;
                case 'ServiceCover': this.cmdServiceSummary_onclick(); break;
                case 'History': if (blnAccess) this.cmdHistory_onclick(); break;
                case 'Allocate': if (blnAccess) this.cmdAllocate_onclick(); break;
                case 'InvoiceNarrative': if (blnAccess) this.cmdInvoiceNarrative_onclick(); break;
                case 'ProRataCharge': if (blnAccess) this.cmdProRata_onclick(); break;
                case 'InvoiceCharge': if (blnAccess) this.cmdInvoiceCharge_onclick(); break;
                case 'InvoiceHistory': if (blnAccess) this.cmdInvoiceHistory_onclick(); break;
                case 'ThirdPartyInstall': if (blnAccess) this.cmdThirdPartyInstall_onclick(); break;
                case 'StaticVisits': if (blnAccess) this.cmdStaticVisits_onclick(); break;
                case 'VisitSummary': if (blnAccess) this.cmdVisitSummary_onclick(); break;
                case 'StateOfService': if (blnAccess) this.cmdStateOfService_onclick(); break;
                case 'EventHistory': this.cmdEventHistory_onclick(); break;
                case 'Contract': this.cmdContract_onclick(); break;
                case 'CustomerInformation': this.cmdCustomerInformation_onclick(); break;
            }
        }
    }

    public PremiseContactFax_ondeactivate(): void {
        this.parent.setControlValue('PosFax', this.parent.getControlValue('PremiseContactFax'));
    }

    public PremiseName_onchange(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.parent.getControlValue('SCRunPAFSearchOnFirstAddressLine') === 'true') {
                this.cmdGetAddress_onclick();
            }
        }
    }

    public PremisePostcode_ondeactivate(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.DefaultFromPostcode();
        }
    }

    public PremiseCommenceDate_ondeactivate(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.parent.getControlValue('ErrorMessageDesc') === '') {
                this.riTab.TabFocus(1);
            } else {
                this.parent.setControlValue('ErrorMessageDesc', '');
            }
            this.parent.pgPM_AR1.riExchange_CBORequest();
        }
    }

    public PremiseName_ondeactivate(): void {
        //No Functionality
    }

    //************************************************************************************
    //* Menu Options (onclick actions)                                                   *
    //************************************************************************************
    public grdAccess_onactivate(): void {
        //No Functionality
    }
    public grdTechs_onactivate(): void {
        //No Functionality
    }
    public grdDates_onactivate(): void {
        //No Functionality
    }
    public grdTimes_onactivate(): void {
        //No Functionality
    }
    // reset variable & disable buttons
    public cmdGetLatAndLong_onclick(): void {
        this.HaveResolved = true;
    }

    public cmdCustomerInformation_onclick(): void {
        this.parent.navigate('ServiceCover', InternalGridSearchServiceModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY.URL_1, {
            parentMode: 'ServiceCover',
            contractNumber: this.parent.getControlValue('ContractNumber'),
            contractName: this.parent.getControlValue('ContractName'),
            accountNumber: this.parent.getControlValue('AccountNumber')
        }); //iCABSACustomerInformationSummary.htm
    }

    public tdCustomerInfo_onclick(): void {
        this.cmdCustomerInformation_onclick();
    }

    public cmdContactManagement_onclick(): void {
        this.parent.navigate('Premise', 'ccm/contact/search');
    }

    public cmdHistory_onclick(): void {
        this.parent.navigate('Premise', InternalGridSearchSalesModuleRoutes.ICABSACONTRACTHISTORYGRID, {
            ContractNumber: this.parent.getControlValue('ContractNumber'),
            ContractName: this.parent.getControlValue('ContractName'),
            PremiseNumber: this.parent.getControlValue('PremiseNumber'),
            currentContractTypeURLParameter: this.pageParams.CurrentContractType,
            PremiseName: this.parent.getControlValue('PremiseName'),
            PremiseRowID: this.parent.getControlValue('Premise'),
            parentMode: 'Premise'
        });
    }

    public cmdServiceSummary_onclick(): void {
        if (this.pageParams.CurrentContractType === 'P') {
            this.parent.navigate('Premise', InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_2);
        } else {
            this.parent.navigate('Premise', InternalGridSearchSalesModuleRoutes.ICABSAPREMISESERVICESUMMARY);
        }
    }

    public cmdAllocate_onclick(): void {
        this.parent.navigate('Premise-Allocate', '/application/premiseLocationAllocation', {
            'ServiceCoverRowID': this.parent.getControlValue('Premise'),
            'ContractTypeCode': this.pageParams.CurrentContractType,
            'ContractNumber': this.parent.getControlValue('ContractNumber'),
            'PremiseNumber': this.parent.getControlValue('PremiseNumber')
        });
    }

    public cmdServiceCover_onclick(): void {
        if (this.pageParams.CurrentContractType === 'P') {
            this.parent.navigate('Premise', InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_1);
        } else {
            //TODO - Open as ellipsis
            //     riExchange.Mode = 'Premise'
            //     window.location = '/wsscripts/riHTMLWrapper.p?rif (ileName=Application/iCABSAServiceCoverSearch.htm' + CurrentContractTypeURLParameter
            this.parent.navigate('Premise', 'Application/iCABSAServiceCoverSearch'); // Need to verify route
        }
    }

    public cmdInvoiceNarrative_onclick(): void {
        this.parent.navigate('Premise', InternalMaintenanceSalesModuleRoutes.ICABSAINVOICENARRATIVEMAINTENANCE);
    }

    public cmdInvoiceCharge_onclick(): void {
        this.parent.navigate('Premise', 'contractmanagement/account/invoiceCharge');
    }

    public cmdThirdPartyInstall_onclick(): void {
        //   riExchange.Mode = 'Premise'
        //   window.location = '/wsscripts/riHTMLWrapper.p?rif (ileName=ApplicationReport/iCABSARThirdPartyInstallationNoteReport.htm' + CurrentContractTypeURLParameter
        this.parent.navigate('Premise', 'Application/iCABSARThirdPartyInstallationNoteReport'); //TODO - Page not ready
    }

    public cmdGetAddress_onclick(): void {
        this.logger.log('cmdGetAddress_onclick', this.pageParams.vSCEnableHopewiserPAF, this.pageParams.vSCEnableDatabasePAF, this.riMaintenance.CurrentMode);

        // if (this.pageParams.vSCEnableHopewiserPAF) {
        //     this.parent.ellipsis.MPAFSearch.childparams.PostCode = this.parent.getControlValue('PremisePostcode');
        //     this.parent.ellipsis.MPAFSearch.childparams.State = this.parent.getControlValue('PremiseAddressLine5');
        //     this.parent.ellipsis.MPAFSearch.childparams.Town = this.parent.getControlValue('PremiseAddressLine4');
        //     this.parent.ellipsis.MPAFSearch.childparams.BranchNumber = this.parent.utils.getBranchCode();
        //     setTimeout(() => { this.parent.MPAFSearch.openModal(); }, 200);
        // }
        if (this.pageParams.vSCEnableDatabasePAF) {
            this.parent.ellipsis.AUPostCodeSearch.childparams.postCode = this.parent.getControlValue('PremisePostcode');
            this.parent.ellipsis.AUPostCodeSearch.childparams.state = this.parent.getControlValue('PremiseAddressLine5');
            this.parent.ellipsis.AUPostCodeSearch.childparams.town = this.parent.getControlValue('PremiseAddressLine4');
            setTimeout(() => { this.parent.AUPostCodeSearch.openModal(); }, 200);
        }

        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) this.DefaultFromPostcode();
    }

    public cmdValue_onclick(): void {
        this.parent.navigate('Premise', InternalGridSearchServiceModuleRoutes.ICABSASERVICEVALUEGRID);
    }

    public cmdProRata_onclick(): void {
        this.parent.navigate('Premise', InternalGridSearchSalesModuleRoutes.ICABSAPRORATACHARGESUMMARY);
    }

    public cmdInvoiceHistory_onclick(): void {
        this.parent.navigate('Premise', '/billtocash/contract/invoice');
    }

    public cmdStateOfService_onclick(): void {
        this.parent.navigate('SOS', 'Application/iCABSSeStateOfServiceNatAccountGrid'); //TODO - Page not ready
    }

    public cmdStaticVisits_onclick(): void {
        this.parent.navigate('Premise', InternalGridSearchSalesModuleRoutes.ICABSASTATICVISITGRIDYEAR, {
            ContractNumber: this.parent.getControlValue('ContractNumber'),
            ContractName: this.parent.getControlValue('ContractName'),
            PremiseNumber: this.parent.getControlValue('PremiseNumber'),
            PremiseName: this.parent.getControlValue('PremiseName'),
            Premise: this.parent.getControlValue('Premise'),
            PremiseRowID: this.parent.getControlValue('Premise'),
            currentContractTypeURLParameter: this.pageParams.CurrentContractType
        });
    }

    public cmdVisitSummary_onclick(): void {
        this.parent.store.dispatch({
            type: ContractActionTypes.SAVE_DATA,
            payload: {
                'CurrentContractTypeURLParameter': this.pageParams.contractType,
                'ContractNumber': this.parent.getControlValue('ContractNumber'),
                'ContractName': this.parent.getControlValue('ContractName'),
                'PremiseNumber': this.parent.getControlValue('PremiseNumber'),
                'PremiseName': this.parent.getControlValue('PremiseName'),
                'ProductCode': this.parent.getControlValue('ProductCode'),
                'ProductDesc': this.parent.getControlValue('ProductDesc'),
                'PremiseRowID': this.parent.getControlValue('Premise'),
                'currentContractType': this.pageParams.CurrentContractType
            }
        });
        this.parent.navigate('ShowPremiseLevel', InternalGridSearchServiceModuleRoutes.ICABSASERVICEVISITSUMMARY);
    }

    public cmdEventHistory_onclick(): void {
        this.parent.navigate('Premise', InternalGridSearchServiceModuleRoutes.ICABSCMCUSTOMERCONTACTHISTORYGRID);
    }

    public cmdContract_onclick(): void {
        this.parent.navigate('Premise', ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
            ContractNumber: this.parent.getControlValue('ContractNumber'),
            ContractName: this.parent.getControlValue('ContractName'),
            currentContractTypeURLParameter: this.pageParams.CurrentContractType,
            parentMode: 'Premise'
        });
    }

    public DrivingChargeInd_onclick(): void {
        this.logger.log('DrivingChargeInd', this.riExchange.riInputElement.checked(this.uiForm, 'DrivingChargeInd'));
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (this.riExchange.riInputElement.checked(this.uiForm, 'DrivingChargeInd')) { //Checkbox
                this.uiDisplay.tdDrivingChargeValueLab = true;
                this.uiDisplay.tdDrivingChargeValue = true;
                // this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DrivingChargeValue', true);
            } else {
                this.uiDisplay.tdDrivingChargeValueLab = false;
                this.uiDisplay.tdDrivingChargeValue = false;
                // this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DrivingChargeValue', false);
            }
        }
    }

    //************************************************************************************
    //* LookUps (onkeydown actions)                                                      *
    //************************************************************************************
    public SalesAreaCode_onkeydown(obj: any): void {
        if (obj.keyCode === 34) {
            this.SalesAreaCodeSearch();
        }
    }

    public ServiceBranchNumber_onkeydown(obj: any): void {
        //Functionality changed to dropdown
    }

    public CustomerTypeCode_onkeydown(obj: any): void {
        // TODO Ellipsis no present yet
        // if (this.riExchange.riInputElement.isLookUpRequested('CustomerTypeCode')) {
        //     riExchange.Mode = 'LookUp': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=System/iCABSSCustomerTypeSearch.htm'
        // }
    }

    public PremiseSRAEmployee_onkeydown(obj: any): void {
        // TODO Ellipsis no present yet
        // if (window.event.keyCode = 34) {
        //     riExchange.Mode = 'LookUp-PremiseSRAEmployee': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBEmployeeSearch.htm'
        // }
    }

    public DiscountCode_onkeydown(obj: any): void {
        //TODO Dropdown Component not ready
        // if (window.event.keyCode = 34) {
        //     riExchange.Mode = 'LookUp': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBDiscountSearch.htm'
        // }
    }

    public InvoiceGroupNumber_onkeydown(obj: any): void {
        // TODO Refer InvoiceGroupGrid page
        // if (window.event.keyCode = 34) {
        //     riExchange.Mode = 'PremiseMaintenanceSearch': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAInvoiceGroupGrid.htm<maxwidth>'
        // }
    }


    // subprocedure to link to a Local development program
    public LinkToPremiseAccess(): void {
        let url;
        // get the parameters to send with the url
        let p_BusinessCode = this.PBusinessCode;
        let p_ContractNumber = this.parent.getControlValue('ContractNumber');
        let p_PremiseNumber = this.parent.getControlValue('PremiseNumber');

        url = '?Business_Code=' + p_BusinessCode + '&Contract_Number=' + p_ContractNumber + '&Premise_Number=' + p_PremiseNumber;
        url = '/wsscripts/TransPremAccessMaintiCABS.html' + url;

        // go to premise access program
        this.parent.navigate('TRANS', 'url'); //TODO

        // Force the page back to the first tab
        this.riTab.TabDraw();
    }

    public LinkToTechs(): void {
        let url;

        // get the parameters to send with the url
        let p_BusinessCode = this.PBusinessCode;
        let p_ContractNumber = this.parent.getControlValue('ContractNumber');
        let p_PremiseNumber = this.parent.getControlValue('PremiseNumber');

        url = '?Business_Code=' + p_BusinessCode + '&Contract_Number=' + p_ContractNumber + '&Premise_Number=' + p_PremiseNumber;
        url = '/wsscripts/TransPremPrefTechiCABS.html' + url;

        // go to premise access program
        this.parent.navigate('TRANS', 'url'); //TODO

        // Force the page back to the first tab
        this.riTab.TabDraw();
    }

    public LinkToDates(): void {
        let url;

        // get the parameters to send with the url
        let p_BusinessCode = this.PBusinessCode;
        let p_ContractNumber = this.parent.getControlValue('ContractNumber');
        let p_PremiseNumber = this.parent.getControlValue('PremiseNumber');

        url = '?Business_Code=' + p_BusinessCode + '&Contract_Number=' + p_ContractNumber + '&Premise_Number=' + p_PremiseNumber;
        url = '/wsscripts/TransAccessDateRest.html' + url;

        // go to premise access program
        this.parent.navigate('TRANS', 'url'); //TODO

        // Force the page back to the first tab
        this.riTab.TabDraw();
    }

    public LinkToTimes(): void {
        let url;

        // get the parameters to send with the url
        let p_BusinessCode = this.PBusinessCode;
        let p_ContractNumber = this.parent.getControlValue('ContractNumber');
        let p_PremiseNumber = this.parent.getControlValue('PremiseNumber');

        url = '?Business_Code=' + p_BusinessCode + '&Contract_Number=' + p_ContractNumber + '&Premise_Number=' + p_PremiseNumber;
        url = '/wsscripts/TransAccessTimeRest.html' + url;

        // go to premise access program
        this.parent.navigate('TRANS', 'url'); //TODO

        // Force the page back to the first tab
        this.riTab.TabDraw();
    }

    //************************************************************************************
    //* Query Unload HTML Document                                                       *
    //************************************************************************************
    public riExchange_QueryUnloadHTMLDocument(): void {
        // if (riExchange.ParentMode = '/wsscripts/riHTMLWrapper.p?riFileName=Contract-Add') {
        //     if (!PremiseAdded) {
        //         msgbox = 'No Premises Have Been Added For This Contract';
        //     }
        // }
    }

    public SalesAreaCodeSearch(): void {
        this.parent.ellipsis.SalesAreaSearchComponent.childparams.parentMode = 'LookUp-Premise';
        this.parent.ellipsis.SalesAreaSearchComponent.childparams.ContractTypeCode = this.pageParams.CurrentContractType;
        this.parent.openModal('SalesAreaSearchComponent');
    }

    public PremiseAddressLine4_onfocusout(): void {
        if (this.pageParams.vSCAddressLine4Required && this.pageParams.vSCEnableValidatePostcodeSuburb) {
            this.cmdGetAddress_onclick();
        }
    }

    public PremiseAddressLine5_onfocusout(): void {
        if (this.pageParams.vSCAddressLine5Required && this.pageParams.vSCEnableValidatePostcodeSuburb) {
            this.cmdGetAddress_onclick();
        }
    }

    public PremisePostcode_onfocusout(): void {
        if (this.pageParams.vSCPostCodeRequired) {
            // if (SCPostCodeRequired And Trim(PremisePostcode.value) = '' And document.ActiveElement.id !== 'PremisePostcode') { //TODO
            this.cmdGetAddress_onclick();
        }
        this.PremisePostcode_ondeactivate();
    }

    public PremisePostcode_onchange(): void {
        let ctrl = this.uiForm.controls;
        //TODO - Verify the if condition
        if (this.pageParams.SCEnablePostcodeDefaulting && this.pageParams.vSCEnableDatabasePAF && ctrl.PremisePostcode.value.trim() !== '') {
            this.riMaintenance.BusinessObject = 'iCABSGetPostCodeTownAndState.p';
            this.riMaintenance.clear();
            this.riMaintenance.PostDataAdd('Function', 'GetPostCodeTownAndState', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.riExchange.ClientSideValues.Fetch('BusinessCode'), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('Postcode', ctrl.PremisePostcode.value, MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('State', ctrl.PremiseAddressLine5.value, MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('Town', ctrl.PremiseAddressLine4.value, MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('UniqueRecordFound', MntConst.eTypeCheckBox);
            this.riMaintenance.ReturnDataAdd('Postcode', MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('State', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('Town', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data: any): any {
                if (!data['UniqueRecordFound']) {
                    setTimeout(() => { this.parent.PostCodeSearch.openModal(); }, 200);
                } else {
                    this.parent.setControlValue('PremisePostcode', data['Postcode']);
                    this.parent.setControlValue('PremiseAddressLine5', data['State']);
                    this.parent.setControlValue('PremiseAddressLine4', data['Town']);
                }
            });
        }
    }

    //*************************************************************************************************************************
    //*************** S P E E D S C R I P T   L O G I C ************************************************************************
    public SetSCVariables(): void {
        //Functionality not required
        this.pageParams.SCEnableHopewiserPAF = this.pageParams.vSCEnableHopewiserPAF;
        this.pageParams.SCEnableDatabasePAF = this.pageParams.vSCEnableDatabasePAF;
        this.pageParams.SCAddressLine3Logical = this.pageParams.vSCAddressLine3Logical;
        this.pageParams.SCAddressLine4Required = this.pageParams.vSCAddressLine4Required;
        this.pageParams.SCAddressLine5Required = this.pageParams.vSCAddressLine5Required;
        this.pageParams.SCPostCodeRequired = this.pageParams.vSCPostCodeRequired;
        this.pageParams.SCPostCodeMustExistInPAF = this.pageParams.vSCPostCodeMustExistInPAF;
        this.pageParams.SCRunPAFSearchOnFirstAddressLine = this.pageParams.vSCRunPAFSearchOn1stAddressLine;
        this.pageParams.SCServiceReceiptRequired = this.pageParams.vSCServiceReceiptRequired;
    }

    public SetHTMLPageSettings(param: any): any {
        //Hide/Show fields and set variables depending on whether System Chars are required or not
        this.uiDisplay.labelDiscountCode = this.pageParams.vEnableDiscountCode;
        this.uiDisplay.DiscountCode = this.pageParams.vEnableDiscountCode;
        this.uiDisplay.DiscountDesc = this.pageParams.vEnableDiscountCode;
        this.uiDisplay.trPremiseAddressLine3 = this.pageParams.vEnableAddressLine3;
        this.uiDisplay.trPremiseDirectoryName = this.pageParams.vEnableMapGridReference;
        this.uiDisplay.trRetainServiceWeekday = this.pageParams.vEnableRetentionOfServiceWeekDay;
        this.uiDisplay.trServiceReceiptRequired = this.pageParams.vSCServiceReceiptRequired;

        this.parent.setControlValue('NationalAccountChecked', this.pageParams.vEnableNationalAccountWarning);
        this.parent.setControlValue('SCEnableDrivingCharges', this.pageParams.vSCEnableDrivingCharges);

        if (this.pageParams.vSCEnableDrivingCharges && this.pageParams.CurrentContractType !== 'P') {
            this.uiDisplay.tdDrivingChargeIndLab = true;
            this.uiDisplay.tdDrivingChargeInd = true;
        } else {
            this.uiDisplay.tdDrivingChargeIndLab = false;
            this.uiDisplay.tdDrivingChargeInd = false;
        }

        this.logger.log('SetHTMLPageSettings Controls', this.pageParams);
    }

    //TODO - Verify below function & CheckPostcode()
    public PostcodeDefaultingEnabled(param: any): any {
        if (this.pageParams.vEnablePostcodeDefaulting) {  /* Only do the following if (Postcode Defaulting is enabled */
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ContractNumber')
                    || this.parent.getControlValue('PremiseName') === '') {
                    if (this.parent.getControlValue('PremisePostcode') !== '' && this.pageParams.CurrentContractType === 'C') {
                        this.CheckPostcode();
                    }
                }
                //Again if (the new postcode already exists in iCABS) { this may be a renegotiated premises, if (so this.Reneg Screen
                if (this.pageParams.CurrentContractType === 'C' && this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremisePostcode')) {
                    this.CheckPostcode();
                }
            }
        }
    }
}
