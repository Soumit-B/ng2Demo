import { Component, Input, ViewChild, Injector, OnInit, OnDestroy, Renderer } from '@angular/core';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { AppModuleRoutes, CCMModuleRoutes } from '../../base/PageRoutes';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';

@Component({
    templateUrl: 'iCABSCMCampaignEntry.html'
})
export class CampaignEntryComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('ContactName') contactName;
    @ViewChild('ScrNA') scrNA;
    @ViewChild('ScrCheckBox') scrCheckBox;
    @ViewChild('ScrCombo') scrCombo: DropdownStaticComponent;
    @ViewChild('ScrInputLogical') scrInputLogical;
    @ViewChild('ScrInputInteger') scrInputInteger;
    @ViewChild('ScrInputDecimal') scrInputDecimal;
    @ViewChild('ScrInputDate') scrInputDate;
    @ViewChild('ScrInputText') scrInputText;
    @ViewChild('ScrComments') scrComments;
    @ViewChild('EmployeeSearchEllipsis') employeeSearchEllipsis: EllipsisComponent;

    public pageId: string;
    public comboSelectList: Array<any> = [];
    public controls = [
        { name: 'AccountNumber', type: MntConst.eTypeCode },
        { name: 'AccountName', type: MntConst.eTypeCode },
        { name: 'CVCScore', type: MntConst.eTypeDecimal2 },
        { name: 'ContactName', type: MntConst.eTypeText },
        { name: 'ContactPosition', type: MntConst.eTypeText },
        { name: 'ContactTelephone', type: MntConst.eTypeText },
        { name: 'ContactMobile', type: MntConst.eTypeText },
        { name: 'ContactEmail', type: MntConst.eTypeText },
        { name: 'SuspendReviewInd' },
        { name: 'ReviewCycleMonths', type: MntConst.eTypeInteger },
        { name: 'NextReviewDate', type: MntConst.eTypeDate },
        { name: 'AccountReviewNotes', type: MntConst.eTypeTextFree },
        { name: 'ScrNA' },
        { name: 'ScrCheckBox' },
        { name: 'ScrCombo' },
        { name: 'ScrInputLogical' },
        { name: 'ScrInputInteger' },
        { name: 'ScrInputDecimal' },
        { name: 'ScrInputDate' },
        { name: 'ScrInputText' },
        { name: 'ScrComments' },
        // Hidden Field
        { name: 'CustomerContactNumber' },
        { name: 'IsAccountReviewInd' },
        { name: 'AccountPostcode' },
        { name: 'ContactPostcode' },
        { name: 'ContractNumber' },
        { name: 'PremiseNumber' },
        { name: 'SuspendReviewStrInd' },
        { name: 'CampaignID' },
        { name: 'CampaignCategoryCode' },
        { name: 'CampaignSectionID' },
        { name: 'CampaignQuestionID' },
        { name: 'CurrentAnswerNA' },
        { name: 'CurrentAnswer' },
        { name: 'CurrentComments' },
        { name: 'ErrorType' },
        { name: 'ErrorMessage' },
        { name: 'CampaignCompleteInd' },
        { name: 'CampaignPosn' },
        { name: 'CampaignDesc' },
        { name: 'CampaignCategoryDesc' },
        { name: 'CampaignSectionDesc' },
        { name: 'CampaignSectionColLabel1' },
        { name: 'CampaignSectionColLabel2' },
        { name: 'CampaignSectionColLabel3' },
        { name: 'QuestionDesc' },
        { name: 'QuestionAnswerStyle' },
        { name: 'QuestionAnswerFormat' },
        { name: 'QuestionDispComment' },
        { name: 'QuestionDefaultValue' },
        { name: 'QuestionResponseNAValue' },
        { name: 'QuestionResponseValue' },
        { name: 'QuestionCommentsValue' },
        { name: 'QuestionAnswerTextList' },
        { name: 'QuestionAnswerValueList' },
        { name: 'QuestionCommentMandList' },
        { name: 'QuestionAllowNA' }
    ];

    // URL Query Parameters
    public queryParams: any = {
        operation: 'ContactManagement/iCABSCMCampaignEntry',
        module: 'campaign',
        method: 'prospect-to-contract/grid'
    };

    // Page level Variables
    public pageVariables = {
        thAccountDetailsHeaderName: '',
        thScrCategoryDesc: '',
        thScrSectionName: '',
        thScrSectionPosn: '',
        isTdScrSectionColLabel1: false,
        ScrSectionColLabel1: '',
        isTdScrSectionColLabelNA: true,
        isTdScrSectionColLabel2: true,
        ScrSectionColLabel2: '',
        isTdScrSectionColLabel3: true,
        tdScrSectionColLabel3Colspan: 1,
        ScrSectionColLabel3: '',
        isTdScrQuestionText: true,
        ScrQuestionText: '',
        isTdScrNA: true,
        isTdScrCheckBox: false,
        isTdScrCombo: false,
        isTdScrInputLogical: false,
        isTdScrInputInteger: false,
        isTdScrInputDecimal: false,
        isTdScrInputDate: false,
        isTdScrInputText: false,
        isTdScrComments: true,
        translation: {
            key1: 'Confirm Account Details',
            translatedValue1: '',
            key2: 'Account Details',
            translatedValue2: '',
            key3: 'Complete',
            translatedValue3: '',
            key4: 'Next',
            translatedValue4: '',
            key5: 'Campaign Category',
            translatedValue5: '',
            key6: 'Campaign Section',
            translatedValue6: ''
        },
        isTrCampaignEntryInput: false,
        isShowBtnEmployee: false,
        isTdCVCScore: false,
        isTrAccountReviewLine1: false,
        isTrAccountReviewLine3: false,
        isTrAccountReviewLine4: false,
        isTrAccountReviewLine5: false,
        isTrAccountReviewLine7: false,
        isTrAccountReviewLine8: false,
        isTrAccountReviewLine9: false,
        isTrAccountReviewLine10: false,
        isTrAccountReviewLine11: false,
        btnNextText: '',
        isAccountReviewMandatory: false,
        isAccountReviewNotesMandatory: false,
        thSectionColspan: 1,
        btnDisableStatus: {
            isLastAnswered: false,
            isFirst: false,
            isPrevious: false,
            isNext: false
        },
        isNoQuestion: false
    };

    // Ellipsis configuration parameters
    public ellipsisParams: any = {
        employee: {
            isShowCloseButton: true,
            isShowHeader: true,
            isDisabled: false,
            childConfigParams: {
                parentMode: 'CampaignEntry'
            },
            contentComponent: EmployeeSearchComponent
        },
        common: {
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            }
        }
    };

    constructor(injector: Injector, private renderer: Renderer) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCAMPAIGNENTRY;

        this.browserTitle = this.pageTitle = 'Campaign Entry';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getAllTranslations();

        this.disableControl('AccountNumber', true);
        this.disableControl('AccountName', true);
        this.disableControl('CVCScore', true);

        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.prepareScreen(null);
        } else {
            this.windowOnLoad();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // Initializes data into different controls on page load
    public windowOnLoad(): void {
        this.setControlValue('CustomerContactNumber', this.riExchange.getParentHTMLValue('CustomerContactNumber'));
        this.setControlValue('ContactName', this.riExchange.getParentHTMLValue('ContactName'));
        this.setControlValue('ContactPosition', this.riExchange.getParentHTMLValue('ContactPosition'));
        this.setControlValue('ContactTelephone', this.riExchange.getParentHTMLValue('ContactTelephone'));
        this.setControlValue('ContactMobile', this.riExchange.getParentHTMLValue('ContactMobile'));
        this.setControlValue('ContactEmail', this.riExchange.getParentHTMLValue('ContactEmail'));

        this.getInitialSettings();
        this.getQuestion('first');
    }

    // Get all the page level translation at once
    public getAllTranslations(): void {
        this.getTranslatedValuesBatch((data: any) => {
            if (data) {
                this.pageVariables.translation.translatedValue1 = data[0].toString();
                this.pageVariables.translation.translatedValue2 = data[1].toString();
                this.pageVariables.translation.translatedValue3 = data[2].toString();
                this.pageVariables.translation.translatedValue4 = data[3].toString();
                this.pageVariables.translation.translatedValue5 = data[4].toString();
                this.pageVariables.translation.translatedValue6 = data[5].toString();
            }
        },
            [this.pageVariables.translation.key1],
            [this.pageVariables.translation.key2],
            [this.pageVariables.translation.key3],
            [this.pageVariables.translation.key4],
            [this.pageVariables.translation.key5],
            [this.pageVariables.translation.key6]
        );
    }

    public getInitialSettings(): void {
        let formData: Object = {};

        let search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'GetInitialSettings';
        formData['CustomerContactNumber'] = this.getControlValue('CustomerContactNumber');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('IsAccountReviewInd', data.IsAccountReviewInd);
                    this.setControlValue('AccountNumber', data.AccountNumber);
                    this.setControlValue('AccountName', data.AccountName);
                    this.setControlValue('AccountPostcode', data.AccountPostcode);
                    this.setControlValue('ContactPostcode', data.AccountPostcode);
                    this.setControlValue('ContractNumber', data.ContractNumber);
                    this.setControlValue('PremiseNumber', data.PremiseNumber);
                    if (this.getControlValue('IsAccountReviewInd') === 'Y') {
                        this.setControlValue('SuspendReviewStrInd', data.SuspendReviewInd);
                        this.setControlValue('ReviewCycleMonths', data.ReviewCycleMonths);
                        this.setControlValue('NextReviewDate', data.NextReviewDate);
                        this.setControlValue('AccountReviewNotes', data.AccountReviewNotes);
                        this.setControlValue('SuspendReviewInd', this.getControlValue('SuspendReviewStrInd') === 'Y');
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    /*
    This attempts to get the first or next question
    Before moving to the next question the response is validated and an appropriate error is shown
    */
    public getQuestion(cFunction: string): void {
        if (cFunction === 'next') {
            this.assignQuestionResponse();
        }

        let formData: Object = {};

        let search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = cFunction;
        formData['CustomerContactNumber'] = this.getControlValue('CustomerContactNumber');
        formData['CampaignID'] = this.getControlValue('CampaignID');
        formData['CampaignCategoryCode'] = this.getControlValue('CampaignCategoryCode');
        formData['CampaignSectionID'] = this.getControlValue('CampaignSectionID');
        formData['CampaignQuestionID'] = this.getControlValue('CampaignQuestionID');
        formData['CurrentAnswerNA'] = this.getControlValue('CurrentAnswerNA');
        formData['CurrentAnswer'] = this.getControlValue('CurrentAnswer');
        formData['CurrentComments'] = this.getControlValue('CurrentComments');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    if (cFunction === 'first') {
                        this.pageVariables.btnDisableStatus.isLastAnswered = true;
                        this.pageVariables.btnDisableStatus.isFirst = true;
                        this.pageVariables.btnDisableStatus.isPrevious = true;
                        this.pageVariables.btnDisableStatus.isNext = true;
                    }
                } else {
                    this.setControlValue('ErrorType', data.ErrorType);
                    this.setControlValue('ErrorMessage', data.ErrorMessage);
                    this.setControlValue('CampaignCompleteInd', data.CampaignCompleteInd);
                    this.setControlValue('CampaignPosn', data.CampaignScope);
                    this.setControlValue('CVCScore', data.CVCScore);
                    if (data.ErrorType === '0') {
                        this.formPristine();
                    }

                    this.prepareScreen(data);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public prepareScreen(data: any): void {
        if (this.getControlValue('CampaignCompleteInd') === 'Y') {
            // If at the end of the campaign then tell the user
            this.modalAdvService.emitMessage(new ICabsModalVO(this.getControlValue('ErrorMessage')));
            // window.close
        } else if (this.getControlValue('CampaignCompleteInd') === 'AccountReview') {
            // When account review related - show account review specific fields after all questions have been entered
            this.pageVariables.thAccountDetailsHeaderName = this.pageVariables.translation.translatedValue1;
            this.pageVariables.isTrCampaignEntryInput = false;
            this.pageVariables.isShowBtnEmployee = false;

            this.pageVariables.isAccountReviewMandatory = this.getControlValue('IsAccountReviewInd') === 'Y';
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactName', this.pageVariables.isAccountReviewMandatory);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactPosition', this.pageVariables.isAccountReviewMandatory);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactTelephone', this.pageVariables.isAccountReviewMandatory);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ReviewCycleMonths', this.pageVariables.isAccountReviewMandatory);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NextReviewDate', this.pageVariables.isAccountReviewMandatory);

            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AccountReviewNotes', false);
            this.pageVariables.isTdCVCScore = true;
            this.pageVariables.isTrAccountReviewLine1 = true;
            this.pageVariables.isTrAccountReviewLine3 = true;

            if (this.pageVariables.isAccountReviewMandatory) {
                this.pageVariables.isTrAccountReviewLine4 = true;
                this.pageVariables.isTrAccountReviewLine5 = true;
                this.pageVariables.isTrAccountReviewLine7 = true;
                this.pageVariables.isTrAccountReviewLine8 = true;
                this.pageVariables.isTrAccountReviewLine9 = true;
                this.pageVariables.isTrAccountReviewLine10 = true;
                this.pageVariables.isTrAccountReviewLine11 = true;
            }

            this.pageVariables.btnNextText = this.pageVariables.translation.translatedValue3;
            setTimeout(() => {
                this.renderer.invokeElementMethod(this.contactName.nativeElement, 'focus');
            }, 0);
        } else if (this.getControlValue('ErrorMessage') !== '') {
            this.modalAdvService.emitMessage(new ICabsModalVO(this.getControlValue('ErrorMessage')));
        } else {
            // When not account review related or NOT last question then show questions
            this.pageVariables.thAccountDetailsHeaderName = this.pageVariables.translation.translatedValue2;
            this.pageVariables.isTrCampaignEntryInput = true;
            this.pageVariables.isShowBtnEmployee = true;

            this.pageVariables.isAccountReviewMandatory = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactName', this.pageVariables.isAccountReviewMandatory);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactPosition', this.pageVariables.isAccountReviewMandatory);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactTelephone', this.pageVariables.isAccountReviewMandatory);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ReviewCycleMonths', this.pageVariables.isAccountReviewMandatory);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NextReviewDate', this.pageVariables.isAccountReviewMandatory);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AccountReviewNotes', false);

            this.pageVariables.isTdCVCScore = false;
            this.pageVariables.isTrAccountReviewLine1 = false;
            this.pageVariables.isTrAccountReviewLine3 = false;
            this.pageVariables.isTrAccountReviewLine4 = false;
            this.pageVariables.isTrAccountReviewLine5 = false;
            this.pageVariables.isTrAccountReviewLine7 = false;
            this.pageVariables.isTrAccountReviewLine8 = false;
            this.pageVariables.isTrAccountReviewLine9 = false;
            this.pageVariables.isTrAccountReviewLine10 = false;
            this.pageVariables.isTrAccountReviewLine11 = false;

            this.pageVariables.btnNextText = this.pageVariables.translation.translatedValue4;

            if (data) {
                this.setControlValue('CampaignID', data.CampaignID);
                this.setControlValue('CampaignCategoryCode', data.CampaignCategoryCode);
                this.setControlValue('CampaignSectionID', data.CampaignSectionID);
                this.setControlValue('CampaignQuestionID', data.CampaignQuestionID);

                this.setControlValue('CampaignDesc', data.CampaignDesc);
                this.setControlValue('CampaignCategoryDesc', data.CampaignCategoryDesc);
                this.setControlValue('CampaignSectionDesc', data.CampaignSectionDesc);
                this.setControlValue('CampaignSectionColLabel1', data.CampaignSectionColLabel1);
                this.setControlValue('CampaignSectionColLabel2', data.CampaignSectionColLabel2);
                this.setControlValue('CampaignSectionColLabel3', data.CampaignSectionColLabel3);

                this.setControlValue('QuestionDesc', data.QuestionDesc);
                this.setControlValue('QuestionAnswerStyle', data.QuestionAnswerStyle);
                this.setControlValue('QuestionAnswerFormat', data.QuestionAnswerFormat);

                this.setControlValue('QuestionDispComment', data.QuestionDispComment);
                this.setControlValue('QuestionDefaultValue', data.QuestionDefaultValue);
                this.setControlValue('QuestionResponseNAValue', data.QuestionResponseNAValue);
                this.setControlValue('QuestionResponseValue', data.QuestionResponseValue);
                this.setControlValue('QuestionCommentsValue', data.QuestionCommentsValue);
                this.setControlValue('QuestionAnswerTextList', data.QuestionAnswerTextList);
                this.setControlValue('QuestionAnswerValueList', data.QuestionAnswerValueList);
                this.setControlValue('QuestionCommentMandList', data.QuestionCommentMandList);
                this.setControlValue('QuestionAllowNA', data.QuestionAllowNA);
            }

            // Paint the screen with the relevant information
            this.paintScreen();
        }
    }

    public assignQuestionResponse(): void {
        this.setControlValue('CurrentComments', this.getControlValue('ScrComments'));
        this.setControlValue('CurrentAnswerNA', '');

        if (this.getControlValue('QuestionAllowNA') === 'Y') {
            this.setControlValue('CurrentAnswerNA', this.getControlValue('ScrNA') ? 'Y' : 'N');
        }

        switch (this.getControlValue('QuestionAnswerStyle')) {
            // None
            case '0':
                this.setControlValue('CurrentAnswer', '');
                break;
            // CheckBox
            case '1':
                this.setControlValue('CurrentAnswer', this.getControlValue('ScrCheckBox') ? 'TRUE' : 'FALSE');
                break;
            // Combo Box
            case '2':
                this.setControlValue('CurrentAnswer', this.scrCombo.selectedItem);
                break;
            // Input
            case '3':
                switch (this.getControlValue('QuestionAnswerFormat')) {
                    // Logical
                    case '1':
                        this.setControlValue('CurrentAnswer', this.getControlValue('ScrInputLogical'));
                        break;
                    // Integer
                    case '2':
                        this.setControlValue('CurrentAnswer', this.globalize.parseIntegerToFixedFormat(this.getControlValue('ScrInputInteger')));
                        break;
                    // Decimal
                    case '3':
                        this.setControlValue('CurrentAnswer', this.globalize.parseDecimal2ToFixedFormat(this.getControlValue('ScrInputDecimal')));
                        break;
                    // Date
                    case '4':
                        this.setControlValue('CurrentAnswer', this.globalize.parseDateToFixedFormat(this.getControlValue('ScrInputDate')));
                        break;
                    // Text
                    case '5':
                        this.setControlValue('CurrentAnswer', this.getControlValue('ScrInputText'));
                        break;
                }
                break;
        }
    }

    public paintScreen(): void {
        this.pageTitle = this.getControlValue('CampaignDesc');
        this.pageVariables.thScrCategoryDesc = this.pageVariables.translation.translatedValue5 + ': ' + this.getControlValue('CampaignCategoryDesc');
        this.pageVariables.thScrSectionName = this.pageVariables.translation.translatedValue6 + ': ' + this.getControlValue('CampaignSectionDesc');
        this.pageVariables.thScrSectionPosn = this.getControlValue('CampaignPosn');
        this.pageVariables.ScrSectionColLabel1 = this.getControlValue('CampaignSectionColLabel1');
        this.pageVariables.ScrSectionColLabel2 = this.getControlValue('CampaignSectionColLabel2');
        this.pageVariables.ScrSectionColLabel3 = this.getControlValue('CampaignSectionColLabel3');

        this.setControlValue('ScrNA', false);

        if (this.getControlValue('QuestionAllowNA') === 'Y') {
            this.pageVariables.isTdScrSectionColLabelNA = true;
            this.pageVariables.isTdScrNA = true;
            this.setControlValue('ScrNA', this.getControlValue('QuestionResponseNAValue') === 'Y');
            this.pageVariables.thSectionColspan = 2;
        } else {
            this.pageVariables.isTdScrSectionColLabelNA = false;
            this.pageVariables.isTdScrNA = false;
            this.pageVariables.thSectionColspan = 1;
        }

        this.setControlValue('ScrComments', this.getControlValue('QuestionCommentsValue'));

        // ***************** Display the correct fields *****************
        if (this.getControlValue('QuestionAnswerStyle') !== '0') {
            this.pageVariables.ScrQuestionText = this.getControlValue('QuestionDesc');
        } else {
            this.pageVariables.ScrQuestionText = '';
        }

        this.pageVariables.isTdScrComments = this.getControlValue('QuestionDispComment') === 'Y';
        this.pageVariables.tdScrSectionColLabel3Colspan = 1;
        this.pageVariables.isNoQuestion = false;

        switch (this.getControlValue('QuestionAnswerStyle')) {
            // None (no question)
            case '0':
                this.pageVariables.isTdScrSectionColLabel1 = false;
                this.pageVariables.isTdScrSectionColLabel2 = false;
                this.pageVariables.tdScrSectionColLabel3Colspan = 3;
                this.pageVariables.isNoQuestion = true;
                this.pageVariables.isTdScrQuestionText = false;
                this.pageVariables.isTdScrCheckBox = false;
                this.pageVariables.isTdScrInputLogical = false;
                this.pageVariables.isTdScrInputInteger = false;
                this.pageVariables.isTdScrInputDecimal = false;
                this.pageVariables.isTdScrInputDate = false;
                this.pageVariables.isTdScrInputText = false;
                this.pageVariables.isTdScrCombo = false;
                break;
            // CheckBox
            case '1':
                this.pageVariables.isTdScrSectionColLabel1 = true;
                this.pageVariables.isTdScrSectionColLabel2 = true;
                this.pageVariables.isTdScrQuestionText = true;
                this.pageVariables.isTdScrCheckBox = true;
                this.pageVariables.isTdScrInputLogical = false;
                this.pageVariables.isTdScrInputInteger = false;
                this.pageVariables.isTdScrInputDecimal = false;
                this.pageVariables.isTdScrInputDate = false;
                this.pageVariables.isTdScrInputText = false;
                this.pageVariables.isTdScrCombo = false;
                setTimeout(() => {
                    this.renderer.invokeElementMethod(this.scrCheckBox.nativeElement, 'focus');
                }, 0);
                break;
            // Combo Box
            case '2':
                this.pageVariables.isTdScrSectionColLabel1 = true;
                this.pageVariables.isTdScrSectionColLabel2 = true;
                this.pageVariables.isTdScrQuestionText = true;
                this.pageVariables.isTdScrCheckBox = false;
                this.pageVariables.isTdScrInputLogical = false;
                this.pageVariables.isTdScrInputInteger = false;
                this.pageVariables.isTdScrInputDecimal = false;
                this.pageVariables.isTdScrInputDate = false;
                this.pageVariables.isTdScrInputText = false;
                this.pageVariables.isTdScrCombo = true;

                let valArray = this.getControlValue('QuestionAnswerValueList').split('^');
                let descArray = this.getControlValue('QuestionAnswerTextList').split('^');
                this.comboSelectList = [];

                for (let index = 0; index < valArray.length; index++) {
                    this.comboSelectList.push({ text: descArray[index], value: valArray[index] });
                }

                let selectedValue = this.getControlValue('QuestionResponseValue');
                if (selectedValue !== '') {
                    let arrIndex = valArray.indexOf(selectedValue);
                    if (arrIndex > 0) {
                        setTimeout(() => {
                            if (this.scrCombo) { this.scrCombo.updateSelectedItem(arrIndex); }
                        }, 0);
                    }
                }

                this.setControlValue('ScrComments', this.getControlValue('QuestionCommentsValue'));
                //Todo ScrCombo.focus
                break;
            // Input
            case '3':
                this.pageVariables.isTdScrSectionColLabel1 = true;
                this.pageVariables.isTdScrSectionColLabel2 = true;
                this.pageVariables.isTdScrQuestionText = true;
                this.pageVariables.isTdScrCheckBox = false;
                this.pageVariables.isTdScrInputLogical = false;
                this.pageVariables.isTdScrInputInteger = false;
                this.pageVariables.isTdScrInputDecimal = false;
                this.pageVariables.isTdScrInputDate = false;
                this.pageVariables.isTdScrInputText = false;
                this.pageVariables.isTdScrCombo = false;

                // Based upon the Answer Format Show The Relevant Input Box
                switch (this.getControlValue('QuestionAnswerFormat')) {
                    // Logical
                    case '1':
                        this.pageVariables.isTdScrInputLogical = true;
                        setTimeout(() => {
                            this.renderer.invokeElementMethod(this.scrInputLogical.nativeElement, 'focus');
                        }, 0);
                        break;
                    // Integer
                    case '2':
                        this.pageVariables.isTdScrInputInteger = true;
                        if (this.getControlValue('QuestionResponseValue') !== '') {
                            this.setControlValue('ScrInputInteger', this.globalize.formatIntegerToLocaleFormat(this.getControlValue('QuestionResponseValue')));
                        } else {
                            this.setControlValue('ScrInputInteger', '');
                        }
                        setTimeout(() => {
                            this.renderer.invokeElementMethod(this.scrInputInteger.nativeElement, 'focus');
                        }, 0);
                        break;
                    // Decimal
                    case '3':
                        this.pageVariables.isTdScrInputDecimal = true;
                        if (this.getControlValue('QuestionResponseValue') !== '') {
                            this.setControlValue('ScrInputDecimal', this.globalize.formatDecimalToLocaleFormat(this.getControlValue('QuestionResponseValue'), 2));
                        } else {
                            this.setControlValue('ScrInputDecimal', '');
                        }
                        setTimeout(() => {
                            this.renderer.invokeElementMethod(this.scrInputDecimal.nativeElement, 'focus');
                        }, 0);
                        break;
                    // Date
                    case '4':
                        this.pageVariables.isTdScrInputDate = true;
                        if (this.getControlValue('QuestionResponseValue') !== '') {
                            this.setControlValue('ScrInputDate', this.globalize.formatDateToLocaleFormat(this.getControlValue('QuestionResponseValue')));
                        } else {
                            this.setControlValue('ScrInputDate', '');
                        }
                        setTimeout(() => {
                            this.renderer.invokeElementMethod(this.scrInputDate.nativeElement, 'focus');
                        }, 0);
                        break;
                    // Text
                    case '5':
                        this.pageVariables.isTdScrInputText = true;
                        this.setControlValue('ScrInputText', this.getControlValue('QuestionResponseValue'));
                        setTimeout(() => {
                            this.renderer.invokeElementMethod(this.scrInputText.nativeElement, 'focus');
                        }, 0);
                        break;
                }
                break;
        }
    }

    public btnIssuesOnClick(event: any): void {
        // Run ContactCentreSearch to allow entry of other tickets
        this.navigate('CampaignEntry', AppModuleRoutes.CCM + CCMModuleRoutes.ICABSCMCALLCENTREGRID, { CustomerContactNumber: this.getControlValue('CustomerContactNumber') });
    }

    public btnFirstOnClick(event: any): void {
        this.getQuestion('first');
    }

    public btnLastAnsweredOnClick(event: any): void {
        this.getQuestion('lastanswered');
    }

    public btnPreviousOnClick(event: any): void {
        if (this.getControlValue('CampaignCompleteInd') === 'AccountReview') {
            this.getQuestion('lastanswered');
        } else {
            this.getQuestion('previous');
        }
    }

    public btnNextOnClick(event: any): void {
        // Update the entered details and complete the review
        if (this.getControlValue('CampaignCompleteInd') === 'AccountReview') {
            if (this.riExchange.validateForm(this.uiForm)) {
                let formData: Object = {};
                let search = this.getURLSearchParamObject();

                search.set(this.serviceConstants.Action, '6');

                formData['Function'] = 'UpdateAccountDetails';
                formData['CustomerContactNumber'] = this.getControlValue('CustomerContactNumber');
                formData['ContactName'] = this.getControlValue('ContactName');
                formData['ContactPosition'] = this.getControlValue('ContactPosition');
                formData['ContactTelephone'] = this.getControlValue('ContactTelephone');
                formData['ContactMobile'] = this.getControlValue('ContactMobile');
                formData['ContactEmail'] = this.getControlValue('ContactEmail');
                formData['SuspendReviewInd'] = this.getControlValue('SuspendReviewStrInd');
                formData['ReviewCycleMonths'] = this.getControlValue('ReviewCycleMonths');
                formData['NextReviewDate'] = this.getControlValue('NextReviewDate');
                formData['AccountReviewNotes'] = this.getControlValue('AccountReviewNotes');

                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                    .subscribe(
                    (data) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        if (data.hasError) {
                            this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        } else {
                            this.setControlValue('ErrorType', data.ErrorType);
                            this.setControlValue('ErrorMessage', data.ErrorMessage);
                            this.setControlValue('CampaignDetailText', data.CampaignDetailText);
                            this.modalAdvService.emitMessage(new ICabsModalVO(this.getControlValue('ErrorMessage')));

                            if (this.getControlValue('ErrorType') === '0') {
                                this.setControlValue('CampaignCompleteInd', 'Y');
                                //Todo Need to open the line when the Parent navigation is available
                                // this.riExchange.SetParentHTMLInputValue('WindowClosingName', 'Campaign');
                                // this.riExchange.SetParentHTMLInputElementAttribute('Comments', this.getControlValue('CampaignDetailText'));
                                this.formPristine();
                                this.location.back();
                            }
                        }
                    },
                    (error) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    });
            }
        } else {
            this.getQuestion('next');
        }
    }

    public suspendReviewIndOnClick(event: any): void {
        this.pageVariables.isAccountReviewNotesMandatory = event.target.checked;
        this.setControlValue('SuspendReviewStrInd', this.pageVariables.isAccountReviewNotesMandatory ? 'Y' : 'N');
        //this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AccountReviewNotes', this.pageVariables.isAccountReviewNotesMandatory);
    }

    public btnCalcReviewDateOnClick(event: any): void {
        let formData: Object = {};
        let search = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'CalcNextReviewDate';
        formData['CustomerContactNumber'] = this.getControlValue('CustomerContactNumber');
        formData['ReviewCycleMonths'] = this.getControlValue('ReviewCycleMonths');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('ReviewCycleMonths', data.ReviewCycleMonths);
                    this.setControlValue('NextReviewDate', data.NextReviewDate);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public btnEmployeeOnClick(event: any): void {
        this.employeeSearchEllipsis.openModal();
    }

    // Populate data from ellipsis
    public onEllipsisDataReceived(type: string, data: any): void {
        switch (type) {
            case 'Employee':
                let scrComments = this.getControlValue('ScrComments');
                let returnData = data.EmployeeCode + ' ' + data.fullObject.EmployeeForename1 + ' ' + data.EmployeeSurName;

                if (scrComments.length > 0) {
                    returnData = returnData + '\n' + scrComments;
                }
                this.setControlValue('ScrComments', returnData);
                break;
            default:
        }
    }

    public fieldValidateTransform(event: any): void {
        let retObj = this.utils.fieldValidateTransform(event);
        this.setControlValue(retObj.id, retObj.value);
        if (!retObj.status) {
            this.riExchange.riInputElement.markAsError(this.uiForm, retObj.id);
        }
    }
}
