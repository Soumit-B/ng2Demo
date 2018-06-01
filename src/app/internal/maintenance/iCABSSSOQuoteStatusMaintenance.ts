import { ConfirmOkComponent } from './../../../shared/components/confirm-ok/confirm-ok';
import { el } from '@angular/platform-browser/testing/browser_util';
import { arrayify } from 'tslint/lib/utils';
import { Logger } from '@nsalaun/ng2-logger';
import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy, enableProdMode, AfterViewInit, ElementRef } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Router, ActivatedRoute } from '@angular/router';
import { DlRejectionSearchComponent } from '../../../app/internal/search/iCABSBdlRejectionSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { Title } from '@angular/platform-browser';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { Observable } from 'rxjs/Rx';
import { LostBusinessLanguageSearchComponent } from '../../../app/internal/search/iCABSBLostBusinessLanguageSearch.component';
import { LostBusinessDetailSearchComponent } from '../../../app/internal/search/iCABSBLostBusinessDetailSearch.component';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';


@Component({
    templateUrl: 'iCABSSSOQuoteStatusMaintenance.html',
    styles: [`
    textarea {
        height:150px;
    }
    `]
})

export class QuoteStatusMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    /*   @ViewChild('confirmOkModal') confirmOkModal: ConfirmOkComponent;
       @ViewChild('confirmstatusOkModal') confirmstatusOkModal: ConfirmOkComponent; */
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('iCABSBLostBusinessLanguageSearch') iCABSBLostBusinessLanguageSearch: LostBusinessLanguageSearchComponent;
    public queryParams: any = {
        operation: 'Sales/iCABSSSOQuoteStatusMaintenance',
        module: 'advantage',
        method: 'prospect-to-contract/maintenance'
    };
    private sub: Subscription;
    public pageId: string = '';
    private lookUpSubscription: Subscription;
    public search = new URLSearchParams();
    public ValidStatusesArray: Array<string>;
    public ValidStatusesIndividualArray: Array<any>;
    public ValidStatusesIndividual: Array<Array<any>>;
    public confirmdata: any = {};
    public showHeader: boolean = true;
    public showCancel: boolean = true;
    public showCloseButton: boolean = true;
    public btnstatusdisable: boolean = false;
    public promptTitle: string;
    public promptConfirmContent: string;
    public isRejected: boolean = false;
    private routeParams: any;
    public dlRejectionSearchComponent: Component;
    public LostBusinessLanguageSearchComponent: any;
    public showMessageHeader: any = true;
    public isRejectionReason: boolean = false;
    public currentMode: string = '';
    public isSaveCancelDisabled: boolean = false;
    private dlContractRowId: string;
    private selectedStatus: string = '';
    private rejectionCode: string;
    public selectedItem: string;
    public validStatuses: string = '';
    public selectedUpdateStatus: string = 'none';
    public screenNotReadyComponent: Component;
    public lostBusinessLangDetailInputParams: any = { languageCode: this.riExchange.LanguageCode() };
    public lostBusinessDetailSearchComponent: Component;
    public lostBusinessDetailSearchhParams: any = {
        lostBusinessCode: '',
        parentMode: 'LookUp-Active'
    };

    public controls = [
        { name: 'ProspectName', readonly: false, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ProspectNumber', readonly: false, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'QuoteNumber', readonly: false, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'dlContractRef', readonly: false, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'dlStatusCode', readonly: false, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'dlStatusDesc', readonly: false, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'dlRejectionCode', readonly: false, disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'dlRejectionDesc', readonly: false, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'LostBusinessCode', readonly: false, disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'LostBusinessDesc', readonly: false, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'LostBusinessDetailCode', readonly: false, disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'LostBusinessDetailDesc', readonly: false, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'SMSMessage', readonly: false, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'dlHistoryNarrative', readonly: false, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'SalesEmailInd', readonly: false, disabled: true, required: false },
        { name: 'ManagerEmailInd', readonly: false, disabled: true, required: false },
        { name: 'OtherEmailInd', readonly: false, disabled: true, required: false },
        { name: 'OtherEmailAddress', readonly: false, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'StatusSelect', readonly: false, disabled: true, required: false, value: 'none' },
        { name: 'ValueInd' },
        { name: 'ReasonInd' },
        { name: 'RejectionInd' },
        { name: 'LanguageCode' },
        { name: 'UpdateableInd' },
        { name: 'OpenWONumber' },
        { name: 'PassWONumber' },
        { name: 'ValidStatuses' },
        { name: 'UpdateStatusCode' }
    ];

    public uiDisplay = {
        trProspect: true,
        trLostBusiness: false,
        trLostBusinessDetail: false,
        trRejection: false,
        tdOtherEmailAddress: false,
        trEmail: false,
        btnSaveCancel: false,
        btnStatusUpdate: true
    };

    public updateStatusResposeValue: any = {
        valueInd: '',
        reasonInd: '',
        rejectionInd: '',
        updateableInd: 'no'
    };

    private _isFormDirty: boolean = false;

    constructor(injector: Injector,
        private route: ActivatedRoute,
        private elem: ElementRef,
        private titleService: Title
    ) {
        super(injector);
        this.ValidStatusesIndividual = [];
        this.pageId = PageIdentifier.ICABSSSOQUOTESTATUSMAINTENANCE;
        this.pageTitle = 'Advantage Quote Status Maintenance';
        this.titleService.setTitle(this.pageTitle);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.parentMode = this.riExchange.getParentMode(); //'SOQuote';
        this.screenNotReadyComponent = ScreenNotReadyComponent;
        this.sub = this.route.queryParams.subscribe(
            (params: any) => {
                this.routeParams = params;
            }
        );
        this.window_onload();
        //this.riExchange.renderForm(this.uiForm, this.controls);
        this.dlRejectionSearchComponent = DlRejectionSearchComponent;
        this.lostBusinessDetailSearchComponent = LostBusinessDetailSearchComponent;
    }

    ngAfterViewInit(): void {
        this.uiForm.valueChanges.subscribe(() => {
            this._isFormDirty = this.elem.nativeElement.querySelector('form').classList.contains('ng-dirty');
        });
    }

    private window_onload(): void {
        if (this.parentMode === 'SOQuote') {
            this.uiDisplay.trProspect = true;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectName', this.riExchange.getParentHTMLValue('ProspectName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'QuoteNumber', this.riExchange.getParentHTMLValue('QuoteNumber'));
            this.dlContractRowId = this.riExchange.getParentHTMLValue('ReportParams');
            /*   this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectName', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ProspectName'));
               this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ProspectNumber'));
               this.riExchange.riInputElement.SetValue(this.uiForm, 'QuoteNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'QuoteNumber'));*/

        }
        else if (this.parentMode === 'Approval' || this.parentMode === 'Signature') {
            this.uiDisplay.trProspect = false;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectName', this.riExchange.GetParentHTMLInputElementAttribute('Misc', 'ContractName'));
            //   ProspectName.value = riExchange.GetParentHTMLInputElementAttribute("Misc","ContractName")
            this.getUrlData();
        }

        this.riExchange.riInputElement.Disable(this.uiForm, 'ProspectNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProspectName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'QuoteNumber');

        this.loadservice();

    }

    private getUrlData(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.dlContractRowId = this.riExchange.getParentHTMLValue('ReportParams');
            if (params.hasOwnProperty('dlContractRowID')) {
                this.dlContractRowId = params['dlContractRowID'];
            }
            if (params.hasOwnProperty('ContractName')) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectName', params['ContractName']);
            }
            if (params.hasOwnProperty('ContractTypeCode')) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectNumber', params['ContractTypeCode']);
            }
        });
    }


    private loadservice(): void {
        this.ajaxSource.next(this.ajaxconstant.START);


        let searchParams = this.getURLSearchParamObject();

        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());// this.businessCode);
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());// this.countryCode);
        // searchParams.set('dlContractROWID', '0x0000000009bb1340');  ///////////////////////////////////////////////////////////////////////////////////////hardcoded 0x0000000009cab805'
        searchParams.set('dlContractROWID', this.dlContractRowId); //this.riExchange.getParentHTMLValue('dlContractROWID'));
        // this.dlContractRowId = this.riExchange.getParentHTMLValue('dlContractROWID');
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams).subscribe(
            (data) => {
                if (data.errorMessage) {
                    this.messageModal.show({ msg: data.errorMessage, title: 'Message' }, false);
                } else {
                    this.rejectionCode = data.dlRejectionCode;
                    this.updateStatusResposeValue.valueInd = data.ValueInd;
                    this.updateStatusResposeValue.reasonInd = data.ReasonInd;
                    this.updateStatusResposeValue.rejectionInd = data.RejectionInd;
                    this.ShowHideFields();
                    //    if (data['dlStatusCode'] === 'R' || data['dlStatusCode'] === 'C' ) {
                    if (data['dlStatusCode'] !== '') {
                        //  this.isRejected = true;
                        let obj = { target: { value: data['dlStatusCode'] } };
                        this.StatusSelect_OnChange(obj);
                        // this.ShowHideFields();
                    } /*else {
                       this.isRejected = false;
                    }*/
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessCode', data['LostBusinessCode']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDetailCode', data['LostBusinessDetailCode']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OpenWONumber', data['OpenWONumber']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ReasonInd', data['ReasonInd']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'RejectionInd', data['RejectionInd']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SMSMessage', data['SMSMessage']);
                    //  this.riExchange.riInputElement.SetValue(this.uiForm, 'UpdateableInd', data['UpdateableInd']);
                    this.updateStatusResposeValue.updateableInd = data['UpdateableInd'];
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ValidStatuses', data['ValidStatuses']);
                    this.validStatuses = data['ValidStatuses'];
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ValueInd', data['ValueInd']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'dlContractRef', data['dlContractRef']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'dlHistoryNarrative', data['dlHistoryNarrative']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'dlRejectionCode', data['dlRejectionCode']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'dlStatusCode', data['dlStatusCode']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'dlStatusDesc', data['dlStatusDesc']);
                    // not coming
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesEmailInd', data['SalesEmailInd']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ManagerEmailInd', data['ManagerEmailInd']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OtherEmailInd', data['OtherEmailInd']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OtherEmailAddress', data['OtherEmailAddress']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'UpdateStatusCode', data['UpdateStatusCode']);
                    if (data['dlRejectionCode'] === '') {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlRejectionDesc', ''); // needs refactor

                    }


                    this.doLookupformData(); // commented for now

                    this.BuildStatusSelect();

                    this.riMaintenance_BeforeUpdate();
                    // if (data['dlStatusCode'] === 'C' || data['dlStatusCode'] === 'E' || this.parentMode === 'Approval') {
                    //     this.selectedUpdateStatus = data['dlStatusCode'];
                    //     this.isRejectionReason = true;
                    // } else {
                    //     this.selectedUpdateStatus = 'none';
                    //     this.isRejectionReason = false;
                    // }
                }
                //  this.riExchange_CBORequest(); // commenting as during load sms message not required until it has saved version

                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onDlRejectionCodeBlur(): void {
        this.riExchange_CBORequest();
        this.doLookupformData();
    }

    public doLookupformData(): void {

        let lookupIP = [
            {
                'table': 'dlStatus',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'dlStatusCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'dlStatusCode')
                },
                'fields': ['dlStatusDesc']
            },
            {
                'table': 'dlRejection',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'dlRejectionCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'dlRejectionCode')
                },
                'fields': ['dlRejectionDesc']
            },
            {
                'table': 'LostBusinessLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'LostBusinessCode': this.getControlValue('LostBusinessCode')
                },
                'fields': ['LostBusinessDesc']
            },
            {
                'table': 'LostBusinessDetailLang',
                'query': {
                    'BusinessCode': this.businessCode,
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'LostBusinessDetailCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailCode')
                },
                'fields': ['LostBusinessDetailDesc']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            try {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'dlRejectionDesc', data[1][0]['dlRejectionDesc']);
            } catch (e) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'dlRejectionDesc', '');
            }

            try {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDesc', data[2][0]['LostBusinessDesc']);
            } catch (e) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDesc', '');
            }
            try {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDetailDesc', data[3][0]['LostBusinessDetailDesc']);
            } catch (e) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDetailDesc', '');
            }
        });
    }

    public BuildStatusSelect(): void {
        this.selectedUpdateStatus = 'none';
        this.ValidStatusesArray = this.validStatuses.split('|');// this.riExchange.riInputElement.GetValue(this.uiForm, 'ValidStatuses').split('|');
        for (let i = 0; i < this.ValidStatusesArray.length; i++) {
            this.ValidStatusesIndividualArray = this.ValidStatusesArray[i].split('%');

            this.ValidStatusesIndividual[i] = [];
            /*  if (this.ValidStatusesIndividualArray.length >= 3) { // added to mitigate the % issue in word
                  this.ValidStatusesIndividual[i][0] = this.ValidStatusesIndividualArray[0];
                  this.ValidStatusesIndividual[i][1] = this.ValidStatusesIndividualArray[1] + '%' + this.ValidStatusesIndividualArray[2];
                  this.ValidStatusesIndividual[i][2] = this.ValidStatusesIndividualArray[3];
              } else { */
            this.ValidStatusesIndividual[i][0] = this.ValidStatusesIndividualArray[0];
            this.ValidStatusesIndividual[i][1] = this.ValidStatusesIndividualArray[1];
            this.ValidStatusesIndividual[i][2] = this.ValidStatusesIndividualArray[2];
            // }
            if (this.ValidStatusesIndividualArray[2].toUpperCase().trim() === 'TRUE') {
                this.selectedUpdateStatus = this.ValidStatusesIndividualArray[0];
                this.selectedItem = this.ValidStatusesIndividualArray[0];
            }
            this.isRejectionReason = false;
            this.uiDisplay.trLostBusinessDetail = false;
        }
    }

    public riMaintenance_AfterFetch(): void {
        // riMaintenance.FunctionUpdate = UpdateableInd.checked
        // riMaintenance.FunctionAdd    = UpdateableInd.checked
        //  this.ShowHideFields();
    }

    public enableDisableStatusRequiredFields(mode: string): void {
        this.riExchange.riInputElement[mode](this.uiForm, 'SalesEmailInd');
        this.riExchange.riInputElement[mode](this.uiForm, 'ManagerEmailInd');
        this.riExchange.riInputElement[mode](this.uiForm, 'OtherEmailInd');
        this.riExchange.riInputElement[mode](this.uiForm, 'dlHistoryNarrative');
        this.riExchange.riInputElement[mode](this.uiForm, 'StatusSelect');
        this.riExchange.riInputElement[mode](this.uiForm, 'SMSMessage');
        this.riExchange.riInputElement[mode](this.uiForm, 'dlRejectionCode');
        this.riExchange.riInputElement[mode](this.uiForm, 'LostBusinessCode');
        this.riExchange.riInputElement[mode](this.uiForm, 'LostBusinessDetailCode');
        // this.uiDisplay.tdOtherEmailAddress = false;
        //  this.riExchange.riInputElement.SetValue(this.uiForm, 'OtherEmailAddress', '');
        // this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OtherEmailAddress', false);
        //Call riExchange.Functions.riInputElement.focusEx("StatusSelect", true)
    }

    public riMaintenance_BeforeUpdate(): void {
        // this.ShowHideFields();
        //  this.riExchange.riInputElement.Disable(this.uiForm, 'dlRejectionCode');
        // this.riExchange.riInputElement.Disable(this.uiForm, 'LostBusinessCode');
        //   this.riExchange.riInputElement.Disable(this.uiForm, 'LostBusinessDetailCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SMSMessage');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SalesEmailInd');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ManagerEmailInd');
        this.riExchange.riInputElement.Disable(this.uiForm, 'OtherEmailInd');
        this.riExchange.riInputElement.Disable(this.uiForm, 'OtherEmailAddress');
        //this.riExchange.riInputElement.Disable(this.uiForm, 'dlHistoryNarrative');
        this.uiDisplay.tdOtherEmailAddress = false;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'OtherEmailAddress', '');
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OtherEmailAddress', false);

    }

    public riMaintenance_AfterSaveAdd(): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'OpenWONumber') !== '0') {

            //this.messageModal.show({ msg: '', title: 'Message' },false);
            // if MsgBox ("<%=riT("An open WorkOrder exists. Do you want to close it now?")%>", vbYesNo OR vbQuestion, "<%=riT("Open WorkOrder Exists")%>") = vbYes Then
            //riExchange.Mode = "QuoteStatusMaintenance"
            //this.promptTitle = 'SHOW';
            //this.promptConfirmContent = 'An open WorkOrder exists. Do you want to close it now?';
            //this.promptConfirmModal.show();
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PassWONumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'OpenWoNumber'));
            this.modalAdvService.emitPrompt(new ICabsModalVO('Message', 'An open WorkOrder exists. Do you want to close it now?', this.confirmCallBack.bind(this)));
            // window.location = "/wsscripts/riHTMLWrapper.p?riFileName=ContactManagement/iCABSCMWorkOrderMaintenance.htm"
        }
    }

    public confirmCallBack(instance: Object): void {
        this.navigate('QuoteStatusMaintenance', InternalMaintenanceServiceModuleRoutes.ICABSCMWORKORDERMAINTENANCE, {
            PassWONumber: this.getControlValue('PassWONumber')
        });
    }

    public promptSave(event: any): void {
        this.saveData();
        // this.riExchange.riInputElement.SetValue(this.uiForm, 'PassWONumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'OpenWoNumber'));
    }


    public riMaintenance_AfterSave(): void {
        // riMaintenance.RequestWindowClose = True
    }

    public riMaintenance_BeforeSaveAdd(): void {
        //  riMaintenance.CustomBusinessObjectAdditionalPostData = "dlContractRowID="   & riExchange.GetParentHTMLInputElementAttribute("Misc","dlContractRowID") & _
        // "&LanguageCode="   & LanguageCode.value
        /*  if (this.riExchange.riInputElement.GetValue(this.uiForm, 'dlRejectionCode') === '') {
                 this.makeInvalid(this.elem.nativeElement.querySelector('#dlRejectionCode'));
             }*/

        if (this.elem.nativeElement.querySelector('#LostBusinessCode') !== null) {
            if (this.getControlValue('LostBusinessCode') === '') {
                this.elem.nativeElement.querySelector('#LostBusinessCode').classList.remove('ng-valid');
                this.elem.nativeElement.querySelector('#LostBusinessCode').classList.add('ng-invalid');
                this.elem.nativeElement.querySelector('#LostBusinessCode').style.borderColor = 'red';
            } else {
                this.elem.nativeElement.querySelector('#LostBusinessCode').style.borderColor = '#999';

            }
        }

        if (this.elem.nativeElement.querySelector('#LostBusinessDetailCode') !== null) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailCode') === '') {
                this.elem.nativeElement.querySelector('#LostBusinessDetailCode').classList.remove('ng-valid');
                this.elem.nativeElement.querySelector('#LostBusinessDetailCode').classList.add('ng-invalid');
                this.elem.nativeElement.querySelector('#LostBusinessDetailCode').style.borderColor = 'red';
            } else {
                this.elem.nativeElement.querySelector('#LostBusinessDetailCode').style.borderColor = '#999';

            }
        }

        if (this.elem.nativeElement.querySelector('#dlRejectionCode') !== null) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'dlRejectionCode') === '') {
                this.elem.nativeElement.querySelector('#dlRejectionCode').classList.remove('ng-valid');
                this.elem.nativeElement.querySelector('#dlRejectionCode').classList.add('ng-invalid');
                this.elem.nativeElement.querySelector('#dlRejectionCode').style.borderColor = 'red';
            } else {
                this.elem.nativeElement.querySelector('#dlRejectionCode').style.borderColor = '#999';

            }
        }
    }

    public onCancel(): void {
        this.currentMode = '';
        this.uiDisplay.btnStatusUpdate = true;
        this.uiDisplay.btnSaveCancel = false;
        this.uiDisplay.trEmail = false;
        this.enableDisableStatusRequiredFields('Disable');
        this.loadservice();
        // this.ShowHideFields();
        // this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OtherEmailAddress', false);
        // this.riExchange.riInputElement.Disable(this.uiForm, 'StatusSelect');
        //  this.riExchange.riInputElement.Disable(this.uiForm, 'dlRejectionDesc');

    }

    public riMaintenance_Search(): void {
        //riExchange.Mode = "Search":	window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBdlStatusSearch.htm"
    }

    public riExchange_CBORequest(): void {
        //has changed for dlRejectionCode
        this.rejectionCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlRejectionCode');
        if (this.rejectionCode !== '') {

            this.ajaxSource.next(this.ajaxconstant.START);

            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            searchParams.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
            //  searchParams.set('dlRejectionCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlRejectionCode')); //
            //    searchParams.set('dlContractROWID', this.dlContractRowId); /////////////////////////////////////////////////////////////////////// hardcoded
            searchParams.set(this.serviceConstants.Action, '6');

            let bodyParams: any = {};
            bodyParams['Function'] = 'GetSMSMessage';
            bodyParams['dlContractROWID'] = this.dlContractRowId;
            bodyParams['dlRejectionCode'] = this.rejectionCode;

            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(
                (data) => {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SMSMessage', data['SMSMessage']);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    public ShowHideFields(): void {
        // if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ReasonInd')) { // checked check
        if (this.updateStatusResposeValue.reasonInd === 'yes') {
            this.uiDisplay.trLostBusiness = true;
            this.uiDisplay.trLostBusinessDetail = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessCode', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessDetailCode', true);
            setTimeout(() => {
                this.iCABSBLostBusinessLanguageSearch.fetchLostBusinessLangSearchData();
            }, 10);
        }
        else {
            this.uiDisplay.trLostBusiness = false;
            this.uiDisplay.trLostBusinessDetail = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessCode', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessDetailCode', false);
        }
        //  if (this.riExchange.riInputElement.GetValue(this.uiForm, 'RejectionInd')) { // checked check
        if (this.updateStatusResposeValue.rejectionInd === 'yes') {
            this.uiDisplay.trRejection = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'dlRejectionCode', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessDetailCode', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessCode', true);
        }
        else {
            this.uiDisplay.trRejection = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'dlRejectionCode', false);
        }



    }

    public OtherEmailInd_OnClick(): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'OtherEmailInd')) { // checked check
            this.uiDisplay.tdOtherEmailAddress = true;
            this.riExchange.riInputElement.Enable(this.uiForm, 'OtherEmailAddress');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OtherEmailAddress', true);
        }
        else {
            this.uiDisplay.tdOtherEmailAddress = false;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OtherEmailAddress', '');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OtherEmailAddress', false);
        }
    }

    public StatusSelect_OnChange(event: any): void {
        this.selectedStatus = event.target.value;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'UpdateStatusCode' ,event.target.value);
        if (this.selectedStatus.toUpperCase() !== 'NONE') {
            //  this.isRejectionReason = true;
            //this.riExchange.riInputElement.SetValue(this.uiForm, 'UpdateStatusCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'StatusSelect'));
            // if (this.riExchange.riInputElement.GetValue(this.uiForm, 'UpdateStatusCode') !== '') {
            this.ajaxSource.next(this.ajaxconstant.START);
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            // searchParams.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
            //   searchParams.set('dlStatusCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlStatusCode'));
            searchParams.set(this.serviceConstants.Action, '6');
            let bodyParams: any = {};
            bodyParams['Function'] = 'GetStatus';
            bodyParams['dlStatusCode'] = this.selectedStatus;
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(
                (data) => {
                    this.updateStatusResposeValue.valueInd = data.ValueInd;
                    this.updateStatusResposeValue.reasonInd = data.ReasonInd;
                    this.updateStatusResposeValue.rejectionInd = data.RejectionInd;
                    // this.riExchange.riInputElement.SetValue(this.uiForm, 'ReasonInd', this.utils.convertResponseValueToCheckboxInput(data['ReasonInd']));
                    // this.riExchange.riInputElement.SetValue(this.uiForm, 'RejectionInd', this.utils.convertResponseValueToCheckboxInput(data['RejectionInd']));
                    // this.riExchange.riInputElement.SetValue(this.uiForm, 'ValueInd', this.utils.convertResponseValueToCheckboxInput(data['ValueInd']));
                    this.ShowHideFields();
                    try {
                        this.elem.nativeElement.querySelector('#dlRejectionCode').focus();
                    } catch (e) {
                        //console.log(e);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });

        }
        if (this.selectedStatus === 'D') {
            //  this.isRejected = true;
            // this.uiDisplay.trLostBusinessDetail = true;

        } else {
            if (this.selectedStatus !== 'none') {
                //  this.isRejected = false;
                // this.uiDisplay.trLostBusinessDetail = false;
            }
        }
    }

    ngOnDestroy(): void {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }

    public onStatus(): void {
        this.currentMode = 'STATUS';
        this.uiDisplay.trEmail = true;
        this.uiDisplay.btnStatusUpdate = false;
        this.uiDisplay.btnSaveCancel = true;
        this.riExchange.riInputElement.Enable(this.uiForm, 'SMSMessage');
        this.enableDisableStatusRequiredFields('Enable');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlHistoryNarrative', '');
    }

    public saveData(): void {
        this.isSaveCancelDisabled = true;
        if (this.currentMode === 'UPDATE') {
            this.saveUpdateData();
        } else if (this.currentMode === 'STATUS') {
            this.saveStatusData();
        }
        //this.currentMode = '';

    }

    public saveUpdateData(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        searchParams.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        searchParams.set(this.serviceConstants.Action, '2');

        let bodyParams: Object = {};

        bodyParams['dlStatusCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlStatusCode');
        bodyParams['dlRejectionCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlRejectionCode');
        bodyParams['dlContractRef'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContractRef');
        bodyParams['LostBusinessCode'] = this.getControlValue('LostBusinessCode');
        bodyParams['LostBusinessDetailCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailCode');
        bodyParams['SMSMessage'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'SMSMessage');
        bodyParams['dlHistoryNarrative'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlHistoryNarrative');
        bodyParams['ValueInd'] = this.updateStatusResposeValue.valueInd;
        bodyParams['ReasonInd'] = this.updateStatusResposeValue.reasonInd;
        bodyParams['RejectionInd'] = this.updateStatusResposeValue.rejectionInd;
        bodyParams['SalesEmailInd'] = this.getControlValue('SalesEmailInd') === true ? 'yes' : 'no';
        bodyParams['ManagerEmailInd'] = this.getControlValue('ManagerEmailInd') === true ? 'yes' : 'no';
        bodyParams['OtherEmailInd'] = this.getControlValue('OtherEmailInd') === true ? 'yes' : 'no';
        bodyParams['OtherEmailAddress'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'OtherEmailAddress');
        bodyParams['UpdateableInd'] = this.updateStatusResposeValue.updateableInd;//this.riExchange.riInputElement.GetValue(this.uiForm, 'UpdateableInd');
        bodyParams['OpenWONumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'OpenWONumber');
        bodyParams['ValidStatuses'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ValidStatuses');
        bodyParams['UpdateStatusCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'UpdateStatusCode');
        bodyParams['dlContractROWID'] = this.dlContractRowId;

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(
            (e) => {
                if (e.errorMessage && e.errorMessage !== '') {
                    //  this.messageModal.show({ msg: e.errorMessage, title: 'Message' }, false);
                    this.messageModal.show(e, true);
                } else {
                    this._isFormDirty = false;
                    this.location.back();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.riMaintenance_AfterSaveAdd();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
        this.isSaveCancelDisabled = false;
    }
    //update mode
    public onSaveData(): void {
        this.riMaintenance_BeforeSaveAdd();
        /*  this.confirmdata.title = 'Confirm';
          this.confirmdata.msg = MessageConstant.Message.ConfirmRecord;
          this.confirmOkModal.show(this.confirmdata, false);*/
        // if (((document.querySelectorAll('.ng-invalid').length < 1 && this.selectedUpdateStatus === 'D')) || this.selectedUpdateStatus !== 'D') {
        if (document.querySelectorAll('.ng-invalid').length < 2) {
            this.promptTitle = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
        // this.riMaintenance_AfterSave();

    }

    //status mode
    public savestatusfunction(): void {
        this.riMaintenance_BeforeSaveAdd();
        //   this.confirmdata.title = 'Confirm';
        this.confirmdata.msg = MessageConstant.Message.ConfirmRecord;
        //  this.confirmstatusOkModal.show(this.confirmdata, false);
        //this.riMaintenance_AfterSave();


    }

    public onUpdate(): void {
        this.currentMode = 'UPDATE';
        this.uiDisplay.btnStatusUpdate = false;
        this.uiDisplay.btnSaveCancel = true;
        this.enableDisableUpdateRequiredFields('Enable');
    }

    public enableDisableUpdateRequiredFields(mode: string): void {
        this.riExchange.riInputElement[mode](this.uiForm, 'dlHistoryNarrative');
    }

    public saveStatusData(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        // this.selectedStatus = this.selectedItem;

        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        searchParams.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        searchParams.set(this.serviceConstants.Action, '1');

        let bodyParams: Object = {};

        bodyParams['dlStatusCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlStatusCode');
        bodyParams['dlRejectionCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlRejectionCode');
        bodyParams['dlContractRef'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContractRef');
        bodyParams['LostBusinessCode'] = this.getControlValue('LostBusinessCode');
        bodyParams['LostBusinessDetailCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailCode');
        bodyParams['SMSMessage'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'SMSMessage');
        bodyParams['dlHistoryNarrative'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlHistoryNarrative');
        bodyParams['ValueInd'] = this.updateStatusResposeValue.valueInd;
        bodyParams['ReasonInd'] = this.updateStatusResposeValue.reasonInd;
        bodyParams['RejectionInd'] = this.updateStatusResposeValue.rejectionInd;
        bodyParams['SalesEmailInd'] = this.getControlValue('SalesEmailInd') === true ? 'yes' : 'no';
        bodyParams['ManagerEmailInd'] = this.getControlValue('ManagerEmailInd') === true ? 'yes' : 'no';
        bodyParams['OtherEmailInd'] = this.getControlValue('OtherEmailInd') === true ? 'yes' : 'no';
        bodyParams['OtherEmailAddress'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'OtherEmailAddress');
        bodyParams['UpdateableInd'] = this.updateStatusResposeValue.updateableInd; // this.riExchange.riInputElement.GetValue(this.uiForm, 'UpdateableInd');
        bodyParams['OpenWONumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'OpenWONumber');
        bodyParams['ValidStatuses'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ValidStatuses');
        bodyParams['UpdateStatusCode'] = this.selectedStatus;
        bodyParams['dlContractRowID'] = this.dlContractRowId; //'0x0000000009bb1340';//this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContractRowID');
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(
            (e) => {
                if (e.errorMessage && e.errorMessage !== '') {
                    // this.messageModal.show({ msg: e.errorMessage, title: 'Message' }, false);
                    this.messageModal.show(e, true);
                } else {
                    this._isFormDirty = false;
                    this.location.back();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
        this.riMaintenance_AfterSaveAdd();
        this.isSaveCancelDisabled = false;
    }
    public onRejectionReasonFromEllipsis(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlRejectionCode', data.dlRejectionCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlRejectionDesc', data.dlRejectionDesc);
        this.riExchange_CBORequest();
    }
    public onLostBusinessDeatilSearchFromEllipsis(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDetailCode', data.LostBusinessDetailCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDetailDesc', data.LostBusinessDetailDesc);
        this.riExchange_CBORequest();
    }
    // Since auto validation not working on SIT hence implementing these 2 methods below
    public checkIfValid(target: any): void {
        if (target.value === '') {
            target.classList.remove('ng-valid');
            target.classList.add('ng-invalid');
        } else {
            target.style.borderColor = '#999';
            target.classList.add('ng-valid');
            target.classList.remove('ng-invalid');
        }
    }

    /*
  *   Alerts user when user is moving away without saving the changes.
  */

    public canDeactivate(): Observable<boolean> {
        this.routeAwayGlobals.setSaveEnabledFlag(this.isFormDirty());
        return this.routeAwayComponent.canDeactivate();
    }

    private isFormDirty(): boolean {
        if (!this._isFormDirty) {
            return false;
        }
        return this.elem.nativeElement.querySelector('form').classList.contains('ng-dirty');
    }

    public onLostBusinessLangSearchDataReceived(event: any): void {
        this.setControlValue('LostBusinessCode', event['LostBusinessLang.LostBusinessCode']);
    }

}
