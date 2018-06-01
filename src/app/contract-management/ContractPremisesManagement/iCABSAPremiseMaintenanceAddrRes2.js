import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var PremiseMaintenanceAddrRes2 = (function () {
    function PremiseMaintenanceAddrRes2(parent) {
        this.parent = parent;
        this.PremiseAddressLine1Orignal = '';
        this.PremiseAddressLine2Orignal = '';
        this.PremiseAddressLine3Orignal = '';
        this.PremiseAddressLine4Orignal = '';
        this.PremiseAddressLine5Orignal = '';
        this.PremisePostcodeOrignal = '';
        this.HaveResolved = false;
        this.PBusinessCode = '';
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
    PremiseMaintenanceAddrRes2.prototype.killSubscription = function () { };
    PremiseMaintenanceAddrRes2.prototype.window_onload = function () {
        this.pgPM_AR = this.parent.pgPM_AR;
        this.pgPM_AR1 = this.parent.pgPM_AR1;
        this.pgPM_AR2 = this.parent.pgPM_AR2;
        this.pgPM_AR3 = this.parent.pgPM_AR3;
        this.init();
    };
    PremiseMaintenanceAddrRes2.prototype.init = function () {
    };
    PremiseMaintenanceAddrRes2.prototype.validateField = function (message, tabIndex, elem, patterStr) {
        var _this = this;
        if (message.length > 0)
            setTimeout(function () { _this.parent.showAlert(message); }, 300);
        this.riTab.TabFocus(tabIndex);
        this.riExchange.riInputElement.markAsError(this.uiForm, elem);
        return true;
    };
    PremiseMaintenanceAddrRes2.prototype.riMaintenance_BeforeSave = function () {
        var ctrl = this.uiForm.controls;
        this.logger.log('LOG riMaintenance_BeforeSave', ctrl);
        var verror = false;
        var testCtrl = '';
        var testStr = '';
        var testStr1 = '';
        var msgbox = '';
        var testStr2 = 0;
        var charExists;
        var vHaveAreadyResolved;
        var AccessErrMsg = MessageConstant.PageSpecificMessage.AccessErrMsg;
        var DateErrMsg = MessageConstant.PageSpecificMessage.DateErrMsg;
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=CheckLength';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseSpecialInstructions') !== '') {
            this.riMaintenance.CBORequestAdd('PremiseSpecialInstructions');
        }
        this.riMaintenance.CBORequestExecute(this, function (data) {
            this.logger.log('CBORequestExecute:', data);
            if (data.hasError) {
                this.parent.showAlert(data.errorMessage);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', data.errorMessage);
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseSpecialInstructions', true);
                verror = true;
            }
        });
        if (!verror) {
            if (!isNaN(parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceAdjHrs'), 10))) {
                if (parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceAdjHrs'), 10) > 2) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.ServiceAdjHrs, 4, 'ServiceAdjHrs');
                }
            }
            else {
                verror = this.validateField('', 4, 'ServiceAdjHrs');
            }
        }
        if (!verror) {
            if (!isNaN(parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceAdjMins'), 10))) {
                if (parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceAdjMins'), 10) > 59) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.ServiceAdjMins, 4, 'ServiceAdjMins');
                }
            }
            else {
                verror = this.validateField('', 4, 'ServiceAdjMins');
            }
        }
        if (!verror) {
            if (!isNaN(parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseType'), 10))) {
                verror = this.validateField('', 4, 'PremiseType');
            }
        }
        if (!verror) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseType') === '') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseType', 'NS');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseType').trim().toUpperCase() !== 'NS'
                && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseType').trim().toUpperCase() !== 'SS') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.PremiseType, 4, 'PremiseType');
            }
        }
        if (!verror) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProofOfServFax').trim().toUpperCase() !== ''
                && this.riExchange.riInputElement.GetValue(this.uiForm, 'ProofOfServFax').trim().toUpperCase() !== 'Y') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.ProofOfServFax, 4, 'ProofOfServFax');
            }
        }
        if (!verror) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProofOfServFax').trim().toUpperCase() === 'Y') {
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProofOfServFax').trim().toUpperCase().length < 10) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.PosFax, 4, 'PosFax');
                }
                else if (this.pgPM_AR3.TestForChar(this.riExchange.riInputElement.GetValue(this.uiForm, 'ProofOfServFax').trim())) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.PosFaxChar, 4, 'ProofOfServFax');
                }
            }
        }
        if (!verror) {
            testStr = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProofOfServSMS').trim().toUpperCase();
            if (testStr !== '' && testStr !== 'Y') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.ProofOfServSMS, 4, 'ProofOfServSMS');
            }
        }
        if (!verror) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProofOfServSMS').trim().toUpperCase() === 'Y') {
                testStr = this.riExchange.riInputElement.GetValue(this.uiForm, 'PosSMS').trim().toUpperCase();
                if (testStr.length < 10) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.PosSMS, 4, 'PosSMS');
                }
                else if (this.pgPM_AR3.TestForChar(testStr)) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.PosSMSChar, 4, 'PosSMS');
                }
            }
        }
        if (!verror) {
            testStr = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProofOfServEmail').trim().toUpperCase();
            if (testStr !== '' && testStr !== 'Y') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.ProofOfServEmail, 4, 'ProofOfServEmail');
            }
        }
        if (!verror) {
            testStr = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProofOfServEmail').trim().toUpperCase();
            if (testStr === 'Y') {
                var testStr1_1 = this.riExchange.riInputElement.GetValue(this.uiForm, 'PosEmail').trim();
                if (testStr1_1 === '') {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.PosEmail, 4, 'PosEmail');
                }
                else if (this.pgPM_AR3.TestForInvalidChar(testStr1_1)) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.EmailInvalid, 4, 'PosEmail');
                }
            }
        }
        if (!verror) {
            testStr = this.riExchange.riInputElement.GetValue(this.uiForm, 'NotifyFax').trim().toUpperCase();
            if (testStr !== '' && testStr !== 'Y') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyFax, 4, 'NotifyFax');
            }
        }
        if (!verror) {
            testCtrl = 'NotifyFax';
            testStr = this.riExchange.riInputElement.GetValue(this.uiForm, testCtrl).trim().toUpperCase();
            if (testStr === 'Y') {
                testCtrl = 'NotifyFaxDetail';
                testStr1 = this.riExchange.riInputElement.GetValue(this.uiForm, testCtrl).trim().toUpperCase();
                if (testStr1.length < 10) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyFax10, 4, testCtrl);
                }
                else if (this.pgPM_AR3.TestForChar(testStr1)) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyFaxChar, 4, testCtrl);
                }
            }
        }
        if (!verror) {
            testCtrl = 'NotifySMS';
            testStr = this.riExchange.riInputElement.GetValue(this.uiForm, testCtrl).trim().toUpperCase();
            if (testStr !== '' && testStr !== 'Y') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.NotifySMS, 4, testCtrl);
            }
        }
        if (!verror) {
            testCtrl = 'NotifySMS';
            testStr = this.riExchange.riInputElement.GetValue(this.uiForm, testCtrl).trim().toUpperCase();
            if (testStr === 'Y') {
                testCtrl = 'NotifySMSDetail';
                testStr1 = this.riExchange.riInputElement.GetValue(this.uiForm, testCtrl).trim().toUpperCase();
                if (testStr1.length < 10) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifySMS10, 4, testCtrl);
                }
                else if (this.pgPM_AR3.TestForChar(testStr1)) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifySMSChar, 4, testCtrl);
                }
            }
        }
        if (!verror) {
            testCtrl = 'NotifyPhone';
            testStr = this.riExchange.riInputElement.GetValue(this.uiForm, testCtrl).trim().toUpperCase();
            if (testStr !== '' && testStr !== 'Y') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyPhone, 4, testCtrl);
            }
        }
        if (!verror) {
            testCtrl = 'NotifyPhone';
            testStr = this.riExchange.riInputElement.GetValue(this.uiForm, testCtrl).trim().toUpperCase();
            if (testStr === 'Y') {
                testCtrl = 'NotifyPhoneDetail';
                testStr1 = this.riExchange.riInputElement.GetValue(this.uiForm, testCtrl).trim().toUpperCase();
                if (testStr1.length < 10) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyPhone10, 4, testCtrl);
                }
                else if (this.pgPM_AR3.TestForChar(testStr1)) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyPhoneChar, 4, testCtrl);
                }
            }
        }
        if (!verror) {
            testCtrl = 'NotifyEmail';
            testStr = this.riExchange.riInputElement.GetValue(this.uiForm, testCtrl).trim().toUpperCase();
            if (testStr !== '' && testStr !== 'Y') {
                verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyEmail, 4, testCtrl);
            }
        }
        if (!verror) {
            testCtrl = 'NotifyEmail';
            testStr = this.riExchange.riInputElement.GetValue(this.uiForm, testCtrl).trim().toUpperCase();
            if (testStr === 'Y') {
                testCtrl = 'NotifyEmailDetail';
                testStr1 = this.riExchange.riInputElement.GetValue(this.uiForm, testCtrl).trim().toUpperCase();
                if (testStr1 === '') {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyEmailBlank, 4, testCtrl);
                }
                else if (this.pgPM_AR3.TestForInvalidChar(testStr1)) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.EmailInvalid, 4, testCtrl);
                }
            }
        }
        if (!verror) {
            testCtrl = 'NotifyDaysBefore';
            testStr2 = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, testCtrl), 10);
            if (!isNaN(testStr2)) {
                if (testStr2 > 14) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyDaysBefore14, 4, testCtrl);
                }
                else if (testStr2 < 0) {
                    verror = this.validateField(MessageConstant.PageSpecificMessage.NotifyDaysBefore0, 4, testCtrl);
                }
            }
        }
        if (!verror) {
            if (!this.pgPM_AR3.TestForY(this.riExchange.riInputElement.GetValue(this.uiForm, 'AllowAllTasks1'))) {
                msgbox = MessageConstant.PageSpecificMessage.AllowAllTasks;
                verror = this.validateField(msgbox, 6, 'AllowAllTasks1');
            }
            else if (!this.pgPM_AR3.TestForY(this.riExchange.riInputElement.GetValue(this.uiForm, 'AllowAllTasks2'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks2');
            }
            else if (!this.pgPM_AR3.TestForY(this.riExchange.riInputElement.GetValue(this.uiForm, 'AllowAllTasks3'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks3');
            }
            else if (!this.pgPM_AR3.TestForY(this.riExchange.riInputElement.GetValue(this.uiForm, 'AllowAllTasks4'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks4');
            }
            else if (!this.pgPM_AR3.TestForY(this.riExchange.riInputElement.GetValue(this.uiForm, 'AllowAllTasks5'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks5');
            }
            else if (!this.pgPM_AR3.TestForY(this.riExchange.riInputElement.GetValue(this.uiForm, 'AllowAllTasks6'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks6');
            }
            else if (!this.pgPM_AR3.TestForY(this.riExchange.riInputElement.GetValue(this.uiForm, 'AllowAllTasks7'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks7');
            }
            else if (!this.pgPM_AR3.TestForY(this.riExchange.riInputElement.GetValue(this.uiForm, 'AllowAllTasks8'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks8');
            }
            else if (!this.pgPM_AR3.TestForY(this.riExchange.riInputElement.GetValue(this.uiForm, 'AllowAllTasks9'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks9');
            }
            else if (!this.pgPM_AR3.TestForY(this.riExchange.riInputElement.GetValue(this.uiForm, 'AllowAllTasks10'))) {
                msgbox = 'The allow all tasks field must be either Y or blank';
                verror = this.validateField(msgbox, 6, 'AllowAllTasks10');
            }
        }
        if (!verror) {
            if (this.pgPM_AR3.TestForDupTechs(this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode1') + 1) && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode1') !== '') {
                msgbox = MessageConstant.PageSpecificMessage.TechAddOnce;
                testCtrl = 'EmployeeCode1';
                verror = this.validateField(msgbox, 6, testCtrl);
            }
            else if (this.pgPM_AR3.TestForDupTechs(this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode2') + 2) && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode2') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode2';
                verror = this.validateField(msgbox, 6, testCtrl);
            }
            else if (this.pgPM_AR3.TestForDupTechs(this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode3') + 3) && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode3') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode3';
                verror = this.validateField(msgbox, 6, testCtrl);
            }
            else if (this.pgPM_AR3.TestForDupTechs(this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode4') + 4) && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode4') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode4';
                verror = this.validateField(msgbox, 6, testCtrl);
            }
            else if (this.pgPM_AR3.TestForDupTechs(this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode5') + 5) && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode5') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode5';
                verror = this.validateField(msgbox, 6, testCtrl);
            }
            else if (this.pgPM_AR3.TestForDupTechs(this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode6') + 6) && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode6') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode6';
                verror = this.validateField(msgbox, 6, testCtrl);
            }
            else if (this.pgPM_AR3.TestForDupTechs(this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode7') + 7) && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode7') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode7';
                verror = this.validateField(msgbox, 6, testCtrl);
            }
            else if (this.pgPM_AR3.TestForDupTechs(this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode8') + 8) && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode8') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode8';
                verror = this.validateField(msgbox, 6, testCtrl);
            }
            else if (this.pgPM_AR3.TestForDupTechs(this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode9') + 9) && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode9') !== '') {
                msgbox = 'A tech can be added only once';
                testCtrl = 'EmployeeCode9';
                verror = this.validateField(msgbox, 6, testCtrl);
            }
            else if (this.pgPM_AR3.TestForDupTechs(this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode10') + 10) && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode10') !== '') {
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
                    verror = true;
                }
            }
        }
        if (!verror) {
            this.pgPM_AR3.ValidateTechs(function () {
                if (!verror) {
                    if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom1'), '') !== 0) {
                        if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo1'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom1'), this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo1')) < 0) {
                                msgbox = DateErrMsg;
                                this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom1', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo1', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom2'), '') !== 0) {
                        if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo2'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom2'), this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo2')) < 0) {
                                msgbox = DateErrMsg;
                                this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom2', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo2', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom3'), '') !== 0) {
                        if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo3'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom3'), this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo3')) < 0) {
                                msgbox = DateErrMsg;
                                this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom3', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo3', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom4'), '') !== 0) {
                        if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo4'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom4'), this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo4')) < 0) {
                                msgbox = DateErrMsg;
                                this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom4', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo4', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom5'), '') !== 0) {
                        if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo5'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom5'), this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo5')) < 0) {
                                msgbox = DateErrMsg;
                                this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom5', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo5', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom6'), '') !== 0) {
                        if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo6'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom6'), this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo6')) < 0) {
                                msgbox = DateErrMsg;
                                this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom6', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo6', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom7'), '') !== 0) {
                        if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo7'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom7'), this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo7')) < 0) {
                                msgbox = DateErrMsg;
                                this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom7', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo7', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom8'), '') !== 0) {
                        if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo8'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom8'), this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo8')) < 0) {
                                msgbox = DateErrMsg;
                                this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom9'), '') !== 0) {
                        if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo9'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom9'), this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo9')) < 0) {
                                msgbox = DateErrMsg;
                                this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
                                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
                                verror = true;
                            }
                        }
                    }
                }
                if (!verror) {
                    if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom10'), '') !== 0) {
                        if (this.utils.StrComp(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo10'), '') !== 0) {
                            if (this.utils.DateDiff('d', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom10'), this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo10')) < 0) {
                                msgbox = DateErrMsg;
                                this.parent.showAlert(msgbox);
                                this.riTab.TabFocus(7);
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
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom3.value, ctrl.DateTo3.value)) {
                        this.pgPM_AR3.DateFrom_a2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom4.value, ctrl.DateTo4.value)) {
                        this.pgPM_AR3.DateFrom_a3();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom5.value, ctrl.DateTo5.value)) {
                        this.pgPM_AR3.DateFrom_a4();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom6.value, ctrl.DateTo6.value)) {
                        this.pgPM_AR3.DateFrom_a5();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom7.value, ctrl.DateTo7.value)) {
                        this.pgPM_AR3.DateFrom_a6();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom8.value, ctrl.DateTo8.value)) {
                        this.pgPM_AR3.DateFrom_a7();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_a8();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom1.value, ctrl.DateTo1.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_a9();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom3.value, ctrl.DateTo3.value)) {
                        this.pgPM_AR3.DateFrom_b1();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom4.value, ctrl.DateTo4.value)) {
                        this.pgPM_AR3.DateFrom_b2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom5.value, ctrl.DateTo5.value)) {
                        this.pgPM_AR3.DateFrom_b3();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom6.value, ctrl.DateTo6.value)) {
                        this.pgPM_AR3.DateFrom_b4();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom7.value, ctrl.DateTo7.value)) {
                        this.pgPM_AR3.DateFrom_b5();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom8.value, ctrl.DateTo8.value)) {
                        this.pgPM_AR3.DateFrom_b6();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_b7();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom2.value, ctrl.DateTo2.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_b8();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom3.value, ctrl.DateTo3.value, ctrl.DateFrom4.value, ctrl.DateTo4.value)) {
                        this.pgPM_AR3.DateFrom_c1();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom3.value, ctrl.DateTo3.value, ctrl.DateFrom5.value, ctrl.DateTo5.value)) {
                        this.pgPM_AR3.DateFrom_c2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom3.value, ctrl.DateTo3.value, ctrl.DateFrom6.value, ctrl.DateTo6.value)) {
                        this.pgPM_AR3.DateFrom_c3();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom3.value, ctrl.DateTo3.value, ctrl.DateFrom7.value, ctrl.DateTo7.value)) {
                        this.pgPM_AR3.DateFrom_c4();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom3.value, ctrl.DateTo3.value, ctrl.DateFrom8.value, ctrl.DateTo8.value)) {
                        this.pgPM_AR3.DateFrom_c5();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom3.value, ctrl.DateTo3.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_c6();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom3.value, ctrl.DateTo3.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_c7();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom4.value, ctrl.DateTo4.value, ctrl.DateFrom5.value, ctrl.DateTo5.value)) {
                        this.pgPM_AR3.DateFrom_d1();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom4.value, ctrl.DateTo4.value, ctrl.DateFrom6.value, ctrl.DateTo6.value)) {
                        this.pgPM_AR3.DateFrom_d2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom4.value, ctrl.DateTo4.value, ctrl.DateFrom7.value, ctrl.DateTo7.value)) {
                        this.pgPM_AR3.DateFrom_d3();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom4.value, ctrl.DateTo4.value, ctrl.DateFrom8.value, ctrl.DateTo8.value)) {
                        this.pgPM_AR3.DateFrom_d4();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom4.value, ctrl.DateTo4.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_d5();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom4.value, ctrl.DateTo4.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_d6();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom5.value, ctrl.DateTo5.value, ctrl.DateFrom6.value, ctrl.DateTo6.value)) {
                        this.pgPM_AR3.DateFrom_e1();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom5.value, ctrl.DateTo5.value, ctrl.DateFrom7.value, ctrl.DateTo7.value)) {
                        this.pgPM_AR3.DateFrom_e2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom5.value, ctrl.DateTo5.value, ctrl.DateFrom8.value, ctrl.DateTo8.value)) {
                        this.pgPM_AR3.DateFrom_e3();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom5.value, ctrl.DateTo5.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_e4();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom5.value, ctrl.DateTo5.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_e5();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom6.value, ctrl.DateTo6.value, ctrl.DateFrom7.value, ctrl.DateTo7.value)) {
                        this.pgPM_AR3.DateFrom_f1();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom6.value, ctrl.DateTo6.value, ctrl.DateFrom8.value, ctrl.DateTo8.value)) {
                        this.pgPM_AR3.DateFrom_f2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom6.value, ctrl.DateTo6.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_f3();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom6.value, ctrl.DateTo6.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_f4();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom7.value, ctrl.DateTo7.value, ctrl.DateFrom8.value, ctrl.DateTo8.value)) {
                        this.pgPM_AR3.DateFrom_g1();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom7.value, ctrl.DateTo7.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_g2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom7.value, ctrl.DateTo7.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_g3();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom8.value, ctrl.DateTo8.value, ctrl.DateFrom9.value, ctrl.DateTo9.value)) {
                        this.pgPM_AR3.DateFrom_h1();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom8.value, ctrl.DateTo8.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
                        this.pgPM_AR3.DateFrom_h2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckDatesErr(ctrl.DateFrom9.value, ctrl.DateTo9.value, ctrl.DateFrom10.value, ctrl.DateTo10.value)) {
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
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom3.value, ctrl.AccessTo3.value)) {
                        this.pgPM_AR3.AccessFrom_a2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom4.value, ctrl.AccessTo4.value)) {
                        this.pgPM_AR3.AccessFrom_a3();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom5.value, ctrl.AccessTo5.value)) {
                        this.pgPM_AR3.AccessFrom_a4();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom6.value, ctrl.AccessTo6.value)) {
                        this.pgPM_AR3.AccessFrom_a5();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom7.value, ctrl.AccessTo7.value)) {
                        this.pgPM_AR3.AccessFrom_a6();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom8.value, ctrl.AccessTo8.value)) {
                        this.pgPM_AR3.AccessFrom_a7();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_a8();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom1.value, ctrl.AccessTo1.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_a9();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom3.value, ctrl.AccessTo3.value)) {
                        this.pgPM_AR3.AccessFrom_b1();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom4.value, ctrl.AccessTo4.value)) {
                        this.pgPM_AR3.AccessFrom_b2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom5.value, ctrl.AccessTo5.value)) {
                        this.pgPM_AR3.AccessFrom_b3();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom6.value, ctrl.AccessTo6.value)) {
                        this.pgPM_AR3.AccessFrom_b4();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom7.value, ctrl.AccessTo7.value)) {
                        this.pgPM_AR3.AccessFrom_b5();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom8.value, ctrl.AccessTo8.value)) {
                        this.pgPM_AR3.AccessFrom_b6();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_b7();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom2.value, ctrl.AccessTo2.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_b8();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom3.value, ctrl.AccessTo3value, ctrl.AccessFrom4.value, ctrl.AccessTo4.value)) {
                        this.pgPM_AR3.AccessFrom_c1();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom3.value, ctrl.AccessTo3.value, ctrl.AccessFrom5.value, ctrl.AccessTo5.value)) {
                        this.pgPM_AR3.AccessFrom_c2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom3.value, ctrl.AccessTo3.value, ctrl.AccessFrom6.value, ctrl.AccessTo6.value)) {
                        this.pgPM_AR3.AccessFrom_c3();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom3.value, ctrl.AccessTo3.value, ctrl.AccessFrom7.value, ctrl.AccessTo7.value)) {
                        this.pgPM_AR3.AccessFrom_c4();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom3.value, ctrl.AccessTo3.value, ctrl.AccessFrom8.value, ctrl.AccessTo8.value)) {
                        this.pgPM_AR3.AccessFrom_c5();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom3.value, ctrl.AccessTo3.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_c6();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom3.value, ctrl.AccessTo3.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_c7();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom4.value, ctrl.AccessTo4.value, ctrl.AccessFrom5.value, ctrl.AccessTo5.value)) {
                        this.pgPM_AR3.AccessFrom_d1();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom4.value, ctrl.AccessTo4.value, ctrl.AccessFrom6.value, ctrl.AccessTo6.value)) {
                        this.pgPM_AR3.AccessFrom_d2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom4.value, ctrl.AccessTo4.value, ctrl.AccessFrom7.value, ctrl.AccessTo7.value)) {
                        this.pgPM_AR3.AccessFrom_d3();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom4.value, ctrl.AccessTo4.value, ctrl.AccessFrom8.value, ctrl.AccessTo8.value)) {
                        this.pgPM_AR3.AccessFrom_d4();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom4.value, ctrl.AccessTo4.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_d5();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom4.value, ctrl.AccessTo4.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_d6();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom5.value, ctrl.AccessTo5.value, ctrl.AccessFrom6.value, ctrl.AccessTo6.value)) {
                        this.pgPM_AR3.AccessFrom_e1();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom5.value, ctrl.AccessTo5.value, ctrl.AccessFrom7.value, ctrl.AccessTo7.value)) {
                        this.pgPM_AR3.AccessFrom_e2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom5.value, ctrl.AccessTo5.value, ctrl.AccessFrom8.value, ctrl.AccessTo8.value)) {
                        this.pgPM_AR3.AccessFrom_e3();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom5.value, ctrl.AccessTo5.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_e4();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom5.value, ctrl.AccessTo5.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_e5();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom6.value, ctrl.AccessTo6.value, ctrl.AccessFrom7.value, ctrl.AccessTo7.value)) {
                        this.pgPM_AR3.AccessFrom_f1();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom6.value, ctrl.AccessTo6.value, ctrl.AccessFrom8.value, ctrl.AccessTo8.value)) {
                        this.pgPM_AR3.AccessFrom_f2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom6.value, ctrl.AccessTo6.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_f3();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom6.value, ctrl.AccessTo6.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_f4();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom7.value, ctrl.AccessTo7.value, ctrl.AccessFrom8.value, ctrl.AccessTo8.value)) {
                        this.pgPM_AR3.AccessFrom_g1();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom7.value, ctrl.AccessTo7.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_g2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom7.value, ctrl.AccessTo7.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_g3();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom8.value, ctrl.AccessTo8.value, ctrl.AccessFrom9.value, ctrl.AccessTo9.value)) {
                        this.pgPM_AR3.AccessFrom_h1();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom8.value, ctrl.AccessTo8.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
                        this.pgPM_AR3.AccessFrom_h2();
                        verror = true;
                    }
                    else if (this.pgPM_AR3.CheckTimesErr(ctrl.AccessFrom9.value, ctrl.AccessTo9.value, ctrl.AccessFrom10.value, ctrl.AccessTo10.value)) {
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
        this.riMaintenance.CBORequestExecute(this, function (data) {
            if (data.hasError) {
                this.parent.showAlert(data.errorMessage);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', data.errorMessage);
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseSRAEmployee', true);
                verror = true;
            }
        });
        if (this.pageParams.vSCPostCodeMustExistInPAF && (this.pageParams.vSCEnableHopewiserPAF || this.pageParams.vSCEnableDatabasePAF)) {
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=CheckPostcode';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            if (ctrl.PremiseName.value !== '')
                this.riMaintenance.CBORequestAdd('PremiseName');
            if (ctrl.PremiseAddressLine1.value !== '')
                this.riMaintenance.CBORequestAdd('PremiseAddressLine1');
            if (ctrl.PremiseAddressLine2.value !== '')
                this.riMaintenance.CBORequestAdd('PremiseAddressLine2');
            if (ctrl.PremiseAddressLine3.value !== '')
                this.riMaintenance.CBORequestAdd('PremiseAddressLine3');
            if (ctrl.PremiseAddressLine4.value !== '')
                this.riMaintenance.CBORequestAdd('PremiseAddressLine4');
            if (ctrl.PremiseAddressLine5.value !== '')
                this.riMaintenance.CBORequestAdd('PremiseAddressLine5');
            if (ctrl.PremisePostcode.value !== '')
                this.riMaintenance.CBORequestAdd('PremisePostcode');
            this.riMaintenance.CBORequestExecute(this, function (data) {
                if (data.hasError) {
                    this.parent.showAlert(data.errorMessage);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', data.errorMessage);
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
        this.PremiseAddressLine1Orignal = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine1');
        this.PremiseAddressLine2Orignal = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine2');
        this.PremiseAddressLine3Orignal = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine3');
        this.PremiseAddressLine4Orignal = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine4');
        this.PremiseAddressLine5Orignal = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine5');
        this.PremisePostcodeOrignal = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremisePostcode');
        this.HaveResolved = true;
    };
    PremiseMaintenanceAddrRes2.prototype.riMaintenance_AfterSave = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', '');
        if (this.parent.actionSave === 1)
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.pageParams.currentContractType);
        var fieldsArr = this.riExchange.getAllCtrl(this.controls);
        this.riMaintenance.clear();
        for (var i = 0; i < fieldsArr.length; i++) {
            var id = fieldsArr[i];
            var dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            var value = this.riExchange.riInputElement.GetValue(this.uiForm, id);
            switch (id) {
                case 'PremiseROWID':
                case 'PremiseRowID':
                    value = this.riExchange.riInputElement.GetValue(this.uiForm, 'Premise');
                    break;
            }
            this.riMaintenance.PostDataAdd(id, value, dataType);
        }
        this.riMaintenance.PostDataAdd('Mode', 'NewUI', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data) {
            if (data.hasError) {
                if (data.errorMessage.trim() !== '') {
                    this.logger.log('Post data Error', data);
                    this.parent.showAlert(data.errorMessage);
                }
            }
            else {
                this.logger.log('Post data Saved', data);
                this.parent.routeAwayGlobals.setSaveEnabledFlag(false);
                if (data.hasOwnProperty('InvoiceGroupDesc')) {
                    if (data.InvoiceGroupDesc !== '') {
                        this.parent.showAlert(MessageConstant.Message.SavedSuccessfully, 1);
                        this.parent.callbackHooks.push(function () {
                            this.parent.riMaintenance.renderResponseForCtrl(this, data);
                            this.parent.riMaintenance.CurrentMode = MntConst.eModeUpdate;
                            this.parent.pgPM2.riMaintenance_AfterSaveAdd_clbk();
                        });
                    }
                    else {
                        this.parent.showAlert(MessageConstant.Message.SaveUnSuccessful, 0);
                    }
                }
            }
        }, 'POST', this.parent.actionSave);
    };
    PremiseMaintenanceAddrRes2.prototype.riMaintenance_AfterSaveAdd_clbk = function () {
        if (this.pageParams.ParentMode === 'Contract-Add') {
            this.pageParams.PremiseAdded = true;
        }
        if (this.pageParams.CurrentContractType === 'C' || this.pageParams.CurrentContractType === 'J') {
            this.parent.navigate('Premise-Add', ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE);
        }
        else {
            this.parent.navigate('Premise-Add', 'grid/application/productSalesSCEntryGrid');
        }
        this.HaveResolved = true;
    };
    PremiseMaintenanceAddrRes2.prototype.riMaintenance_AfterAbandon = function () {
    };
    PremiseMaintenanceAddrRes2.prototype.DefaultFromPostcode = function () {
        var ctrl = this.uiForm.controls;
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=DefaultFromPostcode' + '&ContractTypeCode=' + this.pageParams.CurrentContractType + '&NegBranchNumber=' + ctrl.NegBranchNumber.value;
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestAdd('ContractNumber');
        this.riMaintenance.CBORequestAdd('PremisePostcode');
        this.riMaintenance.CBORequestAdd('PremiseAddressLine5');
        this.riMaintenance.CBORequestAdd('PremiseAddressLine4');
        this.riMaintenance.CBORequestExecute(this, function (data) {
            this.logger.log('CBORequestExecute:', data);
            if (data.hasError) {
                this.parent.showAlert(data.errorMessage);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', data.errorMessage);
            }
        });
    };
    PremiseMaintenanceAddrRes2.prototype.CheckPostcode = function () {
        var ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSCheckContractPostcode.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('SearchPostcode', ctrl.SearchPostcode.value, MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('strFoundPostcode', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data) {
            if (data['strFoundPostcode'] === 'Yes') {
            }
        });
    };
    PremiseMaintenanceAddrRes2.prototype.BuildMenuOptions = function () {
        var _this = this;
        var menuOptions = [];
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
        this.parent.dropDown.menu = menuOptions;
        setTimeout(function () { _this.parent.setControlValue('menu', 'Options'); }, 500);
    };
    PremiseMaintenanceAddrRes2.prototype.menu_onchange = function (menu) {
        this.logger.log('menu_onchange', menu);
        var ctrl = this.uiForm.controls;
        if (this.riMaintenance.RecordSelected()) {
            var blnAccess = void 0;
            if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Full' ||
                this.riExchange.ClientSideValues.Fetch('BranchNumber') === ctrl.ServiceBranchNumber.value ||
                this.riExchange.ClientSideValues.Fetch('BranchNumber') === ctrl.NegBranchNumber.value) {
                blnAccess = true;
            }
            else {
                blnAccess = false;
            }
            switch (menu) {
                case 'ContactManagement':
                    this.cmdContactManagement_onclick();
                    break;
                case 'ServiceCover':
                    this.cmdServiceSummary_onclick();
                    break;
                case 'History':
                    if (blnAccess)
                        this.cmdHistory_onclick();
                    break;
                case 'Allocate':
                    if (blnAccess)
                        this.cmdAllocate_onclick();
                    break;
                case 'InvoiceNarrative':
                    if (blnAccess)
                        this.cmdInvoiceNarrative_onclick();
                    break;
                case 'ProRataCharge':
                    if (blnAccess)
                        this.cmdProRata_onclick();
                    break;
                case 'InvoiceCharge':
                    if (blnAccess)
                        this.cmdInvoiceCharge_onclick();
                    break;
                case 'InvoiceHistory':
                    if (blnAccess)
                        this.cmdInvoiceHistory_onclick();
                    break;
                case 'ThirdPartyInstall':
                    if (blnAccess)
                        this.cmdThirdPartyInstall_onclick();
                    break;
                case 'StaticVisits':
                    if (blnAccess)
                        this.cmdStaticVisits_onclick();
                    break;
                case 'VisitSummary':
                    if (blnAccess)
                        this.cmdVisitSummary_onclick();
                    break;
                case 'StateOfService':
                    if (blnAccess)
                        this.cmdStateOfService_onclick();
                    break;
                case 'EventHistory':
                    this.cmdEventHistory_onclick();
                    break;
                case 'Contract':
                    this.cmdContract_onclick();
                    break;
                case 'CustomerInformation':
                    this.cmdCustomerInformation_onclick();
                    break;
            }
        }
    };
    PremiseMaintenanceAddrRes2.prototype.PremiseContactFax_ondeactivate = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PosFax', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseContactFax'));
    };
    PremiseMaintenanceAddrRes2.prototype.PremiseName_onchange = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'SCRunPAFSearchOnFirstAddressLine') === 'true') {
                this.cmdGetAddress_onclick();
            }
        }
    };
    PremiseMaintenanceAddrRes2.prototype.PremisePostcode_ondeactivate = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.DefaultFromPostcode();
        }
    };
    PremiseMaintenanceAddrRes2.prototype.PremiseCommenceDate_ondeactivate = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ErrorMessageDesc') === '') {
                this.riTab.TabFocus(1);
            }
            else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', '');
            }
            this.parent.pgPM_AR1.riExchange_CBORequest();
        }
    };
    PremiseMaintenanceAddrRes2.prototype.PremiseName_ondeactivate = function () {
    };
    PremiseMaintenanceAddrRes2.prototype.grdAccess_onactivate = function () {
    };
    PremiseMaintenanceAddrRes2.prototype.grdTechs_onactivate = function () {
    };
    PremiseMaintenanceAddrRes2.prototype.grdDates_onactivate = function () {
    };
    PremiseMaintenanceAddrRes2.prototype.grdTimes_onactivate = function () {
    };
    PremiseMaintenanceAddrRes2.prototype.cmdGetLatAndLong_onclick = function () {
        this.HaveResolved = true;
    };
    PremiseMaintenanceAddrRes2.prototype.cmdCustomerInformation_onclick = function () {
        this.parent.navigate('ServiceCover', 'grid/maintenance/contract/customerinformation', {
            parentMode: 'ServiceCover',
            contractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            contractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
            accountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber')
        });
    };
    PremiseMaintenanceAddrRes2.prototype.tdCustomerInfo_onclick = function () {
        this.cmdCustomerInformation_onclick();
    };
    PremiseMaintenanceAddrRes2.prototype.cmdContactManagement_onclick = function () {
        this.parent.navigate('Premise', 'ccm/contact/search');
    };
    PremiseMaintenanceAddrRes2.prototype.cmdHistory_onclick = function () {
        this.parent.navigate('Premise', 'grid/application/contract/history', {
            ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
            PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            currentContractTypeURLParameter: this.pageParams.CurrentContractType,
            PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
            PremiseRowID: this.riExchange.riInputElement.GetValue(this.uiForm, 'Premise'),
            parentMode: 'Premise'
        });
    };
    PremiseMaintenanceAddrRes2.prototype.cmdServiceSummary_onclick = function () {
        if (this.pageParams.CurrentContractType === 'P') {
            this.parent.navigate('Premise', 'grid/contractmanagement/maintenance/productSalesSCEntryGrid');
        }
        else {
            this.parent.navigate('Premise', 'grid/application/premiseServiceSummary');
        }
    };
    PremiseMaintenanceAddrRes2.prototype.cmdAllocate_onclick = function () {
        this.parent.navigate('Premise-Allocate', '/grid/application/premiseLocationAllocation', {
            'ServiceCoverRowID': this.riExchange.riInputElement.GetValue(this.uiForm, 'Premise'),
            'ContractTypeCode': this.pageParams.CurrentContractType,
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
        });
    };
    PremiseMaintenanceAddrRes2.prototype.cmdServiceCover_onclick = function () {
        if (this.pageParams.CurrentContractType === 'P') {
            this.parent.navigate('Premise', 'grid/application/productSalesSCEntryGrid');
        }
        else {
            this.parent.navigate('Premise', 'Application/iCABSAServiceCoverSearch');
        }
    };
    PremiseMaintenanceAddrRes2.prototype.cmdInvoiceNarrative_onclick = function () {
        this.parent.navigate('Premise', 'contractmanagement/maintenance/contract/invoicenarrative');
    };
    PremiseMaintenanceAddrRes2.prototype.cmdInvoiceCharge_onclick = function () {
        this.parent.navigate('Premise', 'contractmanagement/account/invoiceCharge');
    };
    PremiseMaintenanceAddrRes2.prototype.cmdThirdPartyInstall_onclick = function () {
        this.parent.navigate('Premise', 'Application/iCABSARThirdPartyInstallationNoteReport');
    };
    PremiseMaintenanceAddrRes2.prototype.cmdGetAddress_onclick = function () {
        var _this = this;
        this.logger.log('cmdGetAddress_onclick', this.pageParams.vSCEnableHopewiserPAF, this.pageParams.vSCEnableDatabasePAF, this.riMaintenance.CurrentMode);
        if (this.pageParams.vSCEnableHopewiserPAF) {
            this.parent.ellipsis.MPAFSearch.childparams.PostCode = this.parent.getControlValue('PremisePostcode');
            this.parent.ellipsis.MPAFSearch.childparams.State = this.parent.getControlValue('PremiseAddressLine5');
            this.parent.ellipsis.MPAFSearch.childparams.Town = this.parent.getControlValue('PremiseAddressLine4');
            this.parent.ellipsis.MPAFSearch.childparams.BranchNumber = this.parent.utils.getBranchCode();
            setTimeout(function () { _this.parent.MPAFSearch.openModal(); }, 200);
        }
        if (this.pageParams.vSCEnableDatabasePAF) {
            this.parent.ellipsis.PostCodeSearch.childparams.PremisePostCode = this.parent.getControlValue('PremisePostcode');
            this.parent.ellipsis.PostCodeSearch.childparams.PremiseAddressLine5 = this.parent.getControlValue('PremiseAddressLine5');
            this.parent.ellipsis.PostCodeSearch.childparams.PremiseAddressLine4 = this.parent.getControlValue('PremiseAddressLine4');
            this.parent.ellipsis.PostCodeSearch.childparams.BranchNumber = this.parent.utils.getBranchCode();
            setTimeout(function () { _this.parent.PostCodeSearch.openModal(); }, 200);
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd)
            this.DefaultFromPostcode();
    };
    PremiseMaintenanceAddrRes2.prototype.cmdValue_onclick = function () {
        this.parent.navigate('Premise', 'contractmanagement/account/serviceValue');
    };
    PremiseMaintenanceAddrRes2.prototype.cmdProRata_onclick = function () {
        this.parent.navigate('Premise', 'grid/application/proRatacharge/summary');
    };
    PremiseMaintenanceAddrRes2.prototype.cmdInvoiceHistory_onclick = function () {
        this.parent.navigate('Premise', '/billtocash/contract/invoice');
    };
    PremiseMaintenanceAddrRes2.prototype.cmdStateOfService_onclick = function () {
        this.parent.navigate('SOS', 'Application/iCABSSeStateOfServiceNatAccountGrid');
    };
    PremiseMaintenanceAddrRes2.prototype.cmdStaticVisits_onclick = function () {
        this.parent.navigate('Premise', 'grid/application/service/StaticVisitGridYear', {
            ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
            PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
            Premise: this.riExchange.riInputElement.GetValue(this.uiForm, 'Premise'),
            PremiseRowID: this.riExchange.riInputElement.GetValue(this.uiForm, 'Premise'),
            currentContractTypeURLParameter: this.pageParams.CurrentContractType
        });
    };
    PremiseMaintenanceAddrRes2.prototype.cmdVisitSummary_onclick = function () {
        this.parent.navigate('Premise', 'grid/contractmanagement/maintenance/contract/visitsummary');
    };
    PremiseMaintenanceAddrRes2.prototype.cmdEventHistory_onclick = function () {
        this.parent.navigate('Premise', 'grid/contactmanagement/customercontactHistorygrid');
    };
    PremiseMaintenanceAddrRes2.prototype.cmdContract_onclick = function () {
        this.parent.navigate('Premise', ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
            ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
            currentContractTypeURLParameter: this.pageParams.CurrentContractType,
            parentMode: 'Premise'
        });
    };
    PremiseMaintenanceAddrRes2.prototype.DrivingChargeInd_onclick = function () {
        this.logger.log('DrivingChargeInd', this.riExchange.riInputElement.checked(this.uiForm, 'DrivingChargeInd'));
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (this.riExchange.riInputElement.checked(this.uiForm, 'DrivingChargeInd')) {
                this.uiDisplay.tdDrivingChargeValueLab = true;
                this.uiDisplay.tdDrivingChargeValue = true;
            }
            else {
                this.uiDisplay.tdDrivingChargeValueLab = false;
                this.uiDisplay.tdDrivingChargeValue = false;
            }
        }
    };
    PremiseMaintenanceAddrRes2.prototype.SalesAreaCode_onkeydown = function (obj) {
        if (obj.keyCode === 34) {
            this.SalesAreaCodeSearch();
        }
    };
    PremiseMaintenanceAddrRes2.prototype.ServiceBranchNumber_onkeydown = function (obj) {
    };
    PremiseMaintenanceAddrRes2.prototype.CustomerTypeCode_onkeydown = function (obj) {
    };
    PremiseMaintenanceAddrRes2.prototype.PremiseSRAEmployee_onkeydown = function (obj) {
    };
    PremiseMaintenanceAddrRes2.prototype.DiscountCode_onkeydown = function (obj) {
    };
    PremiseMaintenanceAddrRes2.prototype.InvoiceGroupNumber_onkeydown = function (obj) {
    };
    PremiseMaintenanceAddrRes2.prototype.LinkToPremiseAccess = function () {
        var url;
        var p_BusinessCode = this.PBusinessCode;
        var p_ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        var p_PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        url = '?Business_Code=' + p_BusinessCode + '&Contract_Number=' + p_ContractNumber + '&Premise_Number=' + p_PremiseNumber;
        url = '/wsscripts/TransPremAccessMaintiCABS.html' + url;
        this.parent.navigate('TRANS', 'url');
        this.riTab.TabDraw();
    };
    PremiseMaintenanceAddrRes2.prototype.LinkToTechs = function () {
        var url;
        var p_BusinessCode = this.PBusinessCode;
        var p_ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        var p_PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        url = '?Business_Code=' + p_BusinessCode + '&Contract_Number=' + p_ContractNumber + '&Premise_Number=' + p_PremiseNumber;
        url = '/wsscripts/TransPremPrefTechiCABS.html' + url;
        this.parent.navigate('TRANS', 'url');
        this.riTab.TabDraw();
    };
    PremiseMaintenanceAddrRes2.prototype.LinkToDates = function () {
        var url;
        var p_BusinessCode = this.PBusinessCode;
        var p_ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        var p_PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        url = '?Business_Code=' + p_BusinessCode + '&Contract_Number=' + p_ContractNumber + '&Premise_Number=' + p_PremiseNumber;
        url = '/wsscripts/TransAccessDateRest.html' + url;
        this.parent.navigate('TRANS', 'url');
        this.riTab.TabDraw();
    };
    PremiseMaintenanceAddrRes2.prototype.LinkToTimes = function () {
        var url;
        var p_BusinessCode = this.PBusinessCode;
        var p_ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        var p_PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        url = '?Business_Code=' + p_BusinessCode + '&Contract_Number=' + p_ContractNumber + '&Premise_Number=' + p_PremiseNumber;
        url = '/wsscripts/TransAccessTimeRest.html' + url;
        this.parent.navigate('TRANS', 'url');
        this.riTab.TabDraw();
    };
    PremiseMaintenanceAddrRes2.prototype.riExchange_QueryUnloadHTMLDocument = function () {
    };
    PremiseMaintenanceAddrRes2.prototype.SalesAreaCodeSearch = function () {
        this.parent.ellipsis.SalesAreaSearchComponent.childparams.parentMode = 'LookUp-Premise';
        this.parent.ellipsis.SalesAreaSearchComponent.childparams.ContractTypeCode = this.pageParams.CurrentContractType;
        this.parent.openModal('SalesAreaSearchComponent');
    };
    PremiseMaintenanceAddrRes2.prototype.PremiseAddressLine4_onfocusout = function () {
        var ctrl = this.uiForm.controls;
        if (this.pageParams.vSCAddressLine4Required && ctrl.PremiseAddressLine4.ServiceValueGridComponent.trim() === '' && this.pageParams.vSCEnableValidatePostcodeSuburb) {
            this.cmdGetAddress_onclick();
        }
    };
    PremiseMaintenanceAddrRes2.prototype.PremiseAddressLine5_onfocusout = function () {
        var ctrl = this.uiForm.controls;
        if (this.pageParams.vSCAddressLine5Required && ctrl.PremiseAddressLine4.ServiceValueGridComponent.trim() === '' && this.pageParams.vSCEnableValidatePostcodeSuburb) {
            this.cmdGetAddress_onclick();
        }
    };
    PremiseMaintenanceAddrRes2.prototype.PremisePostcode_onfocusout = function () {
        var ctrl = this.uiForm.controls;
        if (this.pageParams.vSCPostCodeRequired && ctrl.PremisePostcode.ServiceValueGridComponent.trim() === '') {
            this.cmdGetAddress_onclick();
        }
        this.PremisePostcode_ondeactivate();
    };
    PremiseMaintenanceAddrRes2.prototype.PremisePostcode_onchange = function () {
        var ctrl = this.uiForm.controls;
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
            this.riMaintenance.Execute(this, function (data) {
                var _this = this;
                if (!data['UniqueRecordFound']) {
                    setTimeout(function () { _this.parent.PostCodeSearch.openModal(); }, 200);
                }
                else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremisePostcode', data['Postcode']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine5', data['State']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine4', data['Town']);
                }
            });
        }
    };
    PremiseMaintenanceAddrRes2.prototype.SetSCVariables = function () {
        this.pageParams.SCEnableHopewiserPAF = this.pageParams.vSCEnableHopewiserPAF;
        this.pageParams.SCEnableDatabasePAF = this.pageParams.vSCEnableDatabasePAF;
        this.pageParams.SCAddressLine3Logical = this.pageParams.vSCAddressLine3Logical;
        this.pageParams.SCAddressLine4Required = this.pageParams.vSCAddressLine4Required;
        this.pageParams.SCAddressLine5Required = this.pageParams.vSCAddressLine5Required;
        this.pageParams.SCPostCodeRequired = this.pageParams.vSCPostCodeRequired;
        this.pageParams.SCPostCodeMustExistInPAF = this.pageParams.vSCPostCodeMustExistInPAF;
        this.pageParams.SCRunPAFSearchOnFirstAddressLine = this.pageParams.vSCRunPAFSearchOn1stAddressLine;
        this.pageParams.SCServiceReceiptRequired = this.pageParams.vSCServiceReceiptRequired;
    };
    PremiseMaintenanceAddrRes2.prototype.SetHTMLPageSettings = function (param) {
        this.uiDisplay.labelDiscountCode = this.pageParams.vEnableDiscountCode;
        this.uiDisplay.DiscountCode = this.pageParams.vEnableDiscountCode;
        this.uiDisplay.DiscountDesc = this.pageParams.vEnableDiscountCode;
        this.uiDisplay.trPremiseAddressLine3 = this.pageParams.vEnableAddressLine3;
        this.uiDisplay.trPremiseDirectoryName = this.pageParams.vEnableMapGridReference;
        this.uiDisplay.trRetainServiceWeekday = this.pageParams.vEnableRetentionOfServiceWeekDay;
        this.uiDisplay.trServiceReceiptRequired = this.pageParams.vSCServiceReceiptRequired;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'NationalAccountChecked', this.pageParams.vEnableNationalAccountWarning);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SCEnableDrivingCharges', this.pageParams.vSCEnableDrivingCharges);
        if (this.pageParams.vSCEnableDrivingCharges && this.pageParams.CurrentContractType !== 'P') {
            this.uiDisplay.tdDrivingChargeIndLab = true;
            this.uiDisplay.tdDrivingChargeInd = true;
        }
        else {
            this.uiDisplay.tdDrivingChargeIndLab = false;
            this.uiDisplay.tdDrivingChargeInd = false;
        }
        this.logger.log('SetHTMLPageSettings Controls', this.pageParams);
    };
    PremiseMaintenanceAddrRes2.prototype.PostcodeDefaultingEnabled = function (param) {
        if (this.pageParams.vEnablePostcodeDefaulting) {
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ContractNumber')
                    || this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName') === '') {
                    if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremisePostcode') !== '' && this.pageParams.CurrentContractType === 'C') {
                        this.CheckPostcode();
                    }
                }
                if (this.pageParams.CurrentContractType === 'C' && this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremisePostcode')) {
                    this.CheckPostcode();
                }
            }
        }
    };
    return PremiseMaintenanceAddrRes2;
}());
