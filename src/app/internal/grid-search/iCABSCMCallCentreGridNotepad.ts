import { BaseComponent } from '../../../app/base/BaseComponent';
import { Component, Input, OnInit, AfterViewInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Title } from '@angular/platform-browser';

@Component({
    templateUrl: 'iCABSCMCallCentreGridNotepad.html'
})
export class CallCentreGridNotepadComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public controls = [
        { name: 'CurrentCallLogID' },
        { name: 'CallContactName' },
        { name: 'CallNotepadSummary' },
        { name: 'CallNotepad' },
        { name: 'AccountNumber' },
        { name: 'ProspectNumber' },
        { name: 'CallNotepadText' },
        { name: 'NotificationCloseType' },
        { name: 'ClosedSuccess' },
        { name: 'WindowClosingName' },
        { name: 'InfoMessage' }
    ];
    private queryParams: any = {
        operation: 'ContactManagement/iCABSCMCallCentreGridNotepad',
        module: 'call-centre',
        method: 'ccm/maintenance'
    };
    public parentModeOfPage: any;
    public columns: Array<any> = [];
    public isRequesting: boolean = false;
    public showMessageHeader: boolean = true;
    public trContactDetails: boolean = false;
    public trContactName: boolean = false;
    public lValidatePageOk: boolean = false;
    public lClosingLogBeforeProceed: boolean = false;
    public promptConfirmContent: any;
    public promptConfirmContentSave: any;

    public pageId: string;
    constructor(injector: Injector, public titleService: Title) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCALLCENTREGRIDNOTEPAD;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.window_onload();
    }

    ngAfterViewInit(): void {
        let strDocTitle = 'Contact Centre - Notepad';
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            try {
                this.getTranslatedValue(strDocTitle, null).subscribe((res: string) => {
                    if (res) {
                        this.titleService.setTitle(res);
                    } else {
                        this.titleService.setTitle(strDocTitle);
                    }
                });
            } catch (e) {
                //
            }
        });
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
    }

    public window_onload(): void {
        this.pageTitle = 'Contact Centre - Notepad';
        this.parentModeOfPage = this.parentMode;
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        if (this.parentMode !== 'CallCentreSearchEndCall') {
            //
        } else {
            this.pageTitle = 'Contact Centre - End Log';
        }
        this.utils.getTranslatedval('Please Quote Call Log Reference: ').then((res: string) => {
            this.setControlValue('InfoMessage', res);
        });
        this.getSysCharDtetails();
        this.setUI();
    }

    /*Speed script*/
    private getSysCharDtetails(): void {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharDisableFirstCapitalOnAddressContact
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
            this.pageParams.vSCCapitalFirstLtr = record[0]['Required'];
            if (this.parentMode === 'CallCentreSearchEndCall') {
                if (this.pageParams.vSCCapitalFirstLtr) {
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallContactName', true);
                } else {
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallContactName', true);
                }
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallNotepadSummary', true);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallNotepad', true);
            } else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallContactName', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallNotepadSummary', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallNotepad', false);
                this.riExchange.riInputElement.Disable(this.uiForm, 'CallContactName');
            }
        });
    }

    /*Setting initial state of page*/
    private setUI(): void {

        if (this.riExchange.getParentHTMLValue('AccountNumber')) {
            if (this.utils.mid(this.riExchange.getParentHTMLValue('AccountNumber'), 1, 1) === '-') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', '');
            }
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'));
        this.riExchange.riInputElement.Disable(this.uiForm, 'CurrentCallLogID');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CurrentCallLogID', this.riExchange.getParentHTMLValue('CurrentCallLogID'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallContactName', this.riExchange.getParentHTMLValue('CallContactName'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallNotepadSummary', this.riExchange.getParentHTMLValue('CallNotepadSummary'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallNotepad', this.riExchange.getParentHTMLValue('CallNotepad'));
        if (this.parentMode === 'CallCentreSearchEndCall') {
            this.trContactDetails = true;
            this.trContactName = true;
        } else {
            //
        }
        if (this.parentMode === 'CallCentreSearchEndCall') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallNotepadSummary', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallNotepad', true);
            this.cmdDefault_OnClick();
        }
    }

    /** Default button clicked */
    public cmdDefault_OnClick(): void {

        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'DefaultCallDetails';
        postParams.CallLogID = this.uiForm.controls['CurrentCallLogID'].value;
        postParams.AccountNumber = this.uiForm.controls['AccountNumber'].value;
        postParams.ProspectNumber = this.uiForm.controls['ProspectNumber'].value;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.messageModal.show(e, true);
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CallNotepadSummary', e.CallSummary);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CallNotepad', e.CallDetails);
                }
            },
            (error) => {
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /** Clear button clicked */
    public cmdClearNotes_OnClick(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallNotepadSummary', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallNotepad', '');
    }

    /*Called when save is clicked and*/
    private riMaintenance_BeforeSave(): void {
        if (this.parentMode === 'CallCentreSearchEndCall') {
            this.validatePage();
        } else {
            this.lValidatePageOk = true;
        }
        if (this.lValidatePageOk) {
            if (this.parentMode === 'CallCentreSearchEndCall') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ClosedSuccess', 'OK');
                this.promptConfirmModal.show();
            } else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ClosedSuccess', 'OK');
                this.riExchange_UnLoadHTMLDocument();
                this.after_operation();
            }
        } else {
            if (this.parentMode === 'CallCentreSearchEndCall') {
                if (!this.getControlValue('CallNotepadSummary') || this.getControlValue('CallNotepadSummary') === '') {
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallNotepadSummary', true);
                    this.markControlAsTouched('CallNotepadSummary');
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'CallNotepadSummary', true);
                }
                if (!this.getControlValue('CallNotepad') || this.getControlValue('CallNotepad') === '') {
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallNotepad', true);
                    this.markControlAsTouched('CallNotepad');
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'CallNotepad', true);
                }
            } else {
                this.riExchange_UnLoadHTMLDocument();
                this.after_operation();
            }
        }
    }

    /*Called when cancel is clicked*/
    private riMaintenance_BeforeAbandon(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ClosedSuccess', 'NOTOK');
    }

    /*Checks page validity before save when parentmode is CallCentreSearchEndCall*/
    private validatePage(): void {
        this.lValidatePageOk = true;
        if (!this.getControlValue('CallNotepadSummary') || this.getControlValue('CallNotepadSummary') === '') {
            this.lValidatePageOk = false;
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallNotepadText', this.getControlValue('Callnotepad'));
        if (!this.getControlValue('CallNotepad') || this.getControlValue('CallNotepad') === '') {
            this.lValidatePageOk = false;
        }
    }

    /*Called when page is unloaded during navigation*/
    public riExchange_UnLoadHTMLDocument(): void {
        this.formPristine();
        if (this.parentMode === 'CallCentreSearchEndCall') {
            if (this.getControlValue('ClosedSuccess') === 'OK') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'WindowClosingName', 'NotepadEndCallOK');
            } else {
                this.lClosingLogBeforeProceed = false;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'WindowClosingName', 'NotepadEndCall');
            }
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'WindowClosingName', 'Notepad');
        }
        this.riExchange.setParentHTMLValue('WindowClosingName', this.getControlValue('WindowClosingName'));
        if (this.getControlValue('ClosedSuccess') === 'OK') {
            this.riExchange.setParentHTMLValue('CurrentCallLogID', this.getControlValue('CurrentCallLogID'));
            this.riExchange.setParentHTMLValue('CallNotepadSummary', this.getControlValue('CallNotepadSummary'));
            this.riExchange.setParentHTMLValue('CallNotepad', this.getControlValue('CallNotepad'));
            //     Call riExchange.SetParentHTMLUnknownElementAttribute("CallNotepad","value",CallNotepad.value)
        }
        //   Call riExchange.UpdateParentHTMLDocument()
    }

    /*Auto populate fields*/
    public callNotepadSummary_onChange(): void {
        if (!this.getControlValue('CallNotepad') || this.getControlValue('CallNotepad') === '') {
            this.setControlValue('CallNotepad', this.getControlValue('CallNotepadSummary'));
            this.setControlValue('CallNotepadText', this.getControlValue('Callnotepad'));
            this.setErrorStatusFalse('CallNotepad');
        }
    }

    /**
     * Save button clicked
     */
    public saveClicked(): void {
        this.riMaintenance_BeforeSave();
    }

    /*Save/update data on End Call*/
    private saveData(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'EndCall';
        postParams.CallLogID = this.uiForm.controls['CurrentCallLogID'].value || '';
        postParams.CallContactName = this.uiForm.controls['CallContactName'].value || '';
        postParams.CallSummary = this.uiForm.controls['CallNotepadSummary'].value || '';
        postParams.CallDetails = this.uiForm.controls['CallNotepad'].value || '';
        postParams.NotificationCloseType = this.uiForm.controls['NotificationCloseType'].value || '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.messageModal.show(e, true);
                } else {
                    this.messageModal.show({ msg: this.getControlValue('InfoMessage') + this.getControlValue('CurrentCallLogID'), title: 'Message' }, false);
                }
            },
            (error) => {
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /*Called on message modal OK click*/
    public onModalClose(): void {
        this.riExchange_UnLoadHTMLDocument();
        this.after_operation();
    }

    /*Called on successful save and on cancel/abandon*/
    private after_operation(): void {
        this.location.back();
    }

    /** Cancel button clicked */
    public cancelClicked(): void {
        this.riMaintenance_BeforeAbandon();
        this.riExchange_UnLoadHTMLDocument();
        this.after_operation();
    }

    /*Setting field error status as false when user starts typing*/
    public setErrorStatusFalse(data: any): void {
        if (data === 'CallNotepadSummary') {
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'CallNotepadSummary', false);
        }
        if (data === 'CallNotepad') {
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'CallNotepad', false);
        }
    }

    /*Capitalize contact name when syschar is off*/
    public contactName_Onchange(): void {
        if (!this.pageParams.vSCCapitalFirstLtr) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CallContactName', this.getControlValue('CallContactName').replace(/\b[a-z]/g, function (f: any): any { return f.toUpperCase(); }));
        }
    }

    /***After save modal confirmation*/
    public promptConfirm(mode: any): void {
        this.saveData();
    }
}
