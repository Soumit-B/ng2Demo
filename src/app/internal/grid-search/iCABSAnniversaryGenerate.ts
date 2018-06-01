import * as moment from 'moment';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { FormControl, FormGroup } from '@angular/forms';
import { CBBService } from '../../../shared/services/cbb.service';
import { MntConst } from '../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAnniversaryGenerate.html'
})

export class AnniversaryGenerateComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('errorModal') public errorModal;
    public lastDay: Date;
    public firstDay: Date;
    public fromdate: any;
    public todate: any;
    public uiForm: FormGroup;
    public pageTitle: string;
    public pageId: string = '';
    public search: URLSearchParams = new URLSearchParams();
    public fromDateDisplay: string = '';
    public toDateDisplay: string = '';
    public dateObjects: any = {
        AnniversaryDateFrom: new Date(),
        AnniversaryeDateTo: new Date()
    };
    public uiDisplay = {
        showWasteTransferNotes: false,
        showPreAcceptanceLetters: false,
        showCustomerQuarterlyReturns: false
    };
    public IsMedical: boolean = false;
    public inputParams: any = {};
    public information: string = '';
    public brunchNumber: string;
    public BranchSearch: any;
    public trInformation: boolean = false;
    public queryParams: any = {
        operation: 'ApplicationReport/iCABSAnniversaryGenerate',
        module: 'letters',
        method: 'ccm/batch'
    };
    public readonly c_s_MODE_ADD = 'add';
    public readonly c_s_MODE_UPDATE = 'update';
    public readonly c_s_MODE_SELECT = 'select';

    public controls = [
        { name: 'BranchNumber', readonly: true, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'BranchName', readonly: false, disabled: false, required: false },
        { name: 'ANDateFrom', readonly: false, disabled: false, required: true },
        { name: 'ANDateTo', readonly: false, disabled: false, required: true },
        { name: 'AnniversaryLetterInd', readonly: false, disabled: false, required: false },
        { name: 'WasteTransferNoteInd', readonly: false, disabled: false, required: false },
        { name: 'PreAcceptanceLetterInd', readonly: false, disabled: false, required: false },
        { name: 'CustomerQuarterlyReturnInd', readonly: false, disabled: false, required: false }
    ];

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Anniversary Letter Generation';
        this.window_onload();
        setTimeout(() => {
            this.cbb.disableComponent(true);
        }, 0);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    constructor(injector: Injector, private cbb: CBBService) {
        super(injector);
        this.pageId = PageIdentifier.ICABSANNIVERSARYGENERATE;
        this.search = this.getURLSearchParamObject();
        // Set Form Mode
        this.setFormMode('');
    }

    //Anniversary from date and to date

    public dateFromSelectedValue(value: Object): void {
        if (value && value['value']) {
            this.fromDateDisplay = value['value'];
            this.uiForm.controls['ANDateFrom'].setValue(this.fromDateDisplay);
        }
        else {
            this.fromDateDisplay = '';
            this.uiForm.controls['ANDateFrom'].setValue('');
        }
    }


    public dateToSelectedValue(value: Object): void {
        if (value && value['value']) {
            this.toDateDisplay = value['value'];
            this.uiForm.controls['ANDateTo'].setValue(this.toDateDisplay);

        }
        else {
            this.toDateDisplay = '';
            this.uiForm.controls['ANDateTo'].setValue('');
        }
    }


    public window_onload(): void {
        this.brunchNumber = this.utils.getBranchCode();
        this.setControlValue('BranchNumber', this.utils.getBranchCode());
        this.setControlValue('AnniversaryLetterInd', true);
        this.lookupBranchName();
        this.lookupwatertransfertype();

        let date = new Date();
        this.firstDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        this.lastDay = new Date(date.getFullYear(), date.getMonth() + 2, 0);
        this.fromdate = this.utils.formatDate(this.firstDay);
        this.todate = this.utils.formatDate(this.lastDay);
        //prefilling from date
        let getFromDate = this.globalize.parseDateToFixedFormat(this.fromdate).toString();
        this.dateObjects.fromDateDisplay = this.globalize.parseDateStringToDate(getFromDate);

        //prefilling to date
        let getToDate = this.globalize.parseDateToFixedFormat(this.todate).toString();
        this.dateObjects.toDateDisplay = this.globalize.parseDateStringToDate(getToDate);


    }


    /*# Get and Set Branch Name #*/
    public lookupBranchName(): any {
        let lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.utils.getBranchCode()
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data.hasError) {
                this.errorService.emitError(data);
            } else {
                let Branch = data[0][0];
                if (Branch) {
                    this.setControlValue('BranchName', Branch.BranchName);
                };
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            });
    }

    public onBranchDataReceived(obj: any): void {
        this.brunchNumber = obj.BranchNumber;
        this.BranchSearch = obj.BranchNumber + ' : ' + (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
    }

    //checkbox
    public ischecked(value: any): string {
        if (value) {
            return 'yes';
        } else {
            return 'no';
        }
    }

    //submit button functionalities

    public submitBatchProcess(event: any): void {
        this.search = new URLSearchParams();
        let formdata: Object = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '0');

        //body
        formdata['BranchNumber'] = this.utils.getBranchCode();
        formdata['ANDateFrom'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ANDateFrom');
        formdata['ANDateTo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ANDateTo');
        formdata['IncludeRN'] = 'no';
        formdata['AnniversaryLetterInd'] = this.ischecked(this.getControlValue('AnniversaryLetterInd'));
        formdata['WasteTransferNoteInd'] = this.ischecked(this.getControlValue('WasteTransferNoteInd'));
        formdata['PreAcceptanceLetterInd'] = this.ischecked(this.getControlValue('PreAcceptanceLetterInd'));
        formdata['CustomerQuarterlyReturnInd'] = this.ischecked(this.getControlValue('CustomerQuarterlyReturnInd'));

        this.inputParams.search = this.search;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, formdata)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    this.errorModal.show(e, true);
                } else {
                    this.messageService.emitMessage(e);
                    this.trInformation = true;
                    this.information = e.ReturnHTML;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {

                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    //medical business
    public lookupwatertransfertype(): any {
        let lookupIP = [
            {
                'table': 'WasteTransferType',
                'query': {
                    'BusinessCode': this.businessCode
                },
                'fields': ['WasteTransferNoteRequiredInd']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data.hasError) {
                this.errorModal.show(data, true);
            }
            else {
                for (let i = 0; i < data[0].length; i++) {
                    if (data[0][i].WasteTransferNoteRequiredInd === true) {
                        this.IsMedical = true;
                        this.uiDisplay.showWasteTransferNotes = true;
                        this.setControlValue('WasteTransferNoteInd', 'yes');
                        this.uiDisplay.showPreAcceptanceLetters = false;
                        this.setControlValue('PreAcceptanceLetterInd', 'yes');
                        this.uiDisplay.showCustomerQuarterlyReturns = false;
                        this.setControlValue('CustomerQuarterlyReturnInd', 'No');
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
        },
            (error) => {

                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }
}
