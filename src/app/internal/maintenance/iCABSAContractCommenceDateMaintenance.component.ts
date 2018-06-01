import { Component, NgZone, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import * as moment from 'moment';
import { HttpService } from './../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ErrorService } from '../../../shared/services/error.service';
import { Utils } from '../../../shared/services/utility';
import { ContractActionTypes } from '../../../app/actions/contract';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { GlobalizeService } from '../../../shared/services/globalize.service';
@Component({
    selector: 'icabs-contract-commence-date-maintenance',
    templateUrl: 'iCABSAContractCommenceDateMaintenance.html',
    providers: [ErrorService]
})

export class ContractCommenceDateMaintenanceComponent implements OnInit, OnDestroy {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    public inputParams: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'C', 'businessCode': 'D' };
    public storeSubscription: Subscription;
    public querySubscription: Subscription;
    public translateSubscription: Subscription;
    public errorSubscription: Subscription;
    public commenceDateFormGroup: FormGroup;
    public parentQueryParams: any;
    public commenceDateDisplay: string;
    public annivDateDisplay: string;
    public contractSearchComponent = ContractSearchComponent;
    public fieldVisibility: any = {

    };
    public fieldRequired: any = {
        contractCommenceDate: true,
        annivDate: true
    };
    public defaultCode: any = {
        country: '',
        business: ''
    };
    public dateObjectsEnabled: Object = {
        contractCommenceDate: true,
        annivDate: true
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public queryParamsContract: any = {
        action: '0',
        operation: 'Application/iCABSAContractMaintenance',
        module: 'contract',
        method: 'contract-management/maintenance',
        contentType: 'application/x-www-form-urlencoded',
        branchNumber: '',
        branchName: ''
    };
    public queryParamsContractCommenceDate: any = {
        action: '0',
        operation: 'Application/iCABSAContractCommenceDateMaintenance',
        module: 'contract',
        method: 'contract-management/maintenance',
        contentType: 'application/x-www-form-urlencoded'
    };
    public storeData: any = {};
    public autoOpenSearch: boolean = false;
    public showCloseButton: boolean = true;
    public showHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public isContractEllipsisDisabled: boolean = true;
    public serviceVisitRowID: any = '';
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public queryContract: URLSearchParams = new URLSearchParams();
    public contractCommenceDate: Date = new Date();
    public annivDate: Date = new Date();
    public parentRoute: string = '';
    public contractSearchParams: any = {
        'parentMode': 'ContractSearch',
        'currentContractType': 'C',
        'currentContractTypeURLParameter': '<contract>',
        'showAddNew': true,
        'contractNumber': ''
    };
    public promptTitle: string = 'Confirm Record?';
    public promptContent: string = '';
    public isRequesting: boolean = false;

    constructor(
        private zone: NgZone,
        private fb: FormBuilder,
        private store: Store<any>,
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private errorService: ErrorService,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private titleService: Title,
        private router: Router,
        private route: ActivatedRoute,
        private utils: Utils,
        private location: Location,
        private routeAwayGlobals: RouteAwayGlobals,
        private globalize: GlobalizeService
        ) {
        this.defaultCode = {
            country: this.utils.getCountryCode(),
            business: this.utils.getBusinessCode()
        };
        this.commenceDateFormGroup = this.fb.group({
            ContractNumber: [{ value: '', disabled: true }, Validators.required],
            ContractName: [{ value: '', disabled: true }],
            Status: [{ value: '', disabled: true }],
            AccountNumber: [{ value: '', disabled: true }],
            AccountName: [{ value: '', disabled: true }],
            ContractAddressLine1: [{ value: '', disabled: true }],
            ContractAddressLine2: [{ value: '', disabled: true }],
            ContractAddressLine3: [{ value: '', disabled: true }],
            ContractAddressLine4: [{ value: '', disabled: true }],
            ContractAddressLine5: [{ value: '', disabled: true }],
            ContractPostcode: [{ value: '', disabled: true }],
            ContractAnnualValue: [{ value: '', disabled: true }]

        });
        this.querySubscription = this.route.queryParams.subscribe(params => {
            this.parentQueryParams = params;
            switch (params['parent']) {
                case 'AddContractFromAccount':
                case 'AddJobFromAccount':
                case 'AddProductFromAccount':
                break;

                case 'ServiceCover':
                case 'Premise':
                case 'ServiceVisitWorkIndex':

                break;

                case 'Release':
                this.serviceVisitRowID = params['ServiceVisitRowID'];
                break;

                default:
                break;
            }
            switch (params['contractType']) {
                case 'C':
                this.contractSearchParams.currentContractType = 'C';
                this.isContractEllipsisDisabled = true;
                break;
                case 'J':
                this.contractSearchParams.currentContractType = 'J';
                this.isContractEllipsisDisabled = true;
                break;
                case 'P':
                this.contractSearchParams.currentContractType = 'P';
                this.isContractEllipsisDisabled = true;
                break;
                default:
                break;
            }
            this.parentRoute = params['parentRoute'];
            if (params['contractNumber'] || params['ContractNumber']) {
                this.contractSearchParams.contractNumber = params['contractNumber'];
            }
        });

        this.storeSubscription = store.select('contract').subscribe(data => {
            if (data && data['data'] && data['data'].ContractNumber) {
                this.storeData = data;
                this.commenceDateFormGroup.controls['ContractNumber'].setValue(this.storeData['data'].ContractNumber);
                this.commenceDateFormGroup.controls['ContractName'].setValue(this.storeData['data'].ContractName);
                this.commenceDateFormGroup.controls['Status'].setValue(this.storeData['data'].Status);
                this.commenceDateFormGroup.controls['AccountNumber'].setValue(this.storeData['data'].AccountNumber);
                this.commenceDateFormGroup.controls['ContractAddressLine1'].setValue(this.storeData['data'].ContractAddressLine1);
                this.commenceDateFormGroup.controls['ContractAddressLine2'].setValue(this.storeData['data'].ContractAddressLine2);
                this.commenceDateFormGroup.controls['ContractAddressLine3'].setValue(this.storeData['data'].ContractAddressLine3);
                this.commenceDateFormGroup.controls['ContractAddressLine4'].setValue(this.storeData['data'].ContractAddressLine4);
                this.commenceDateFormGroup.controls['ContractAddressLine5'].setValue(this.storeData['data'].ContractAddressLine5);
                this.commenceDateFormGroup.controls['ContractPostcode'].setValue(this.storeData['data'].ContractPostcode);
                this.commenceDateFormGroup.controls['ContractAnnualValue'].setValue(this.storeData['data'].ContractAnnualValue);
                if (this.storeData['data'].ContractCommenceDate) {
                    this.commenceDateDisplay = this.storeData['data'].ContractCommenceDate;
                    this.contractCommenceDate = this.globalize.parseDateStringToDate(this.storeData['data'].ContractCommenceDate) as Date;
                }
                if (this.storeData['data'].InvoiceAnnivDate) {
                    this.annivDateDisplay = this.storeData['data'].InvoiceAnnivDate;
                    this.annivDate = this.globalize.parseDateStringToDate(this.storeData['data'].InvoiceAnnivDate) as Date;
                }
                this.fetchAccountData();
                this.getStatus(this.storeData['data'].ContractNumber);
            } else {
                this.getContractData();
                this.getStatus(this.parentQueryParams['contractNumber'] || this.parentQueryParams['ContractNumber']);
            }
            for (let i in this.commenceDateFormGroup.controls) {
                if (this.commenceDateFormGroup.controls.hasOwnProperty(i))
                this.commenceDateFormGroup.controls[i].markAsTouched();
            }
            this.commenceDateFormGroup.updateValueAndValidity();
        });
}

ngOnInit(): void {
    this.localeTranslateService.setUpTranslation();
    this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
        if (event !== 0) {
            this.fetchTranslationContent();
        }
    });

    this.errorService.emitError(0);
    this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
        if (data !== 0) {
            this.zone.run(() => {
                if (data.errorMessage || data.ErrorMessage) {
                    data.errorMessage = data.errorMessage || data.ErrorMessage;
                    this.errorModal.show(data, true);
                }
            });
        }
    });

    this.promptTitle = MessageConstant.Message.ConfirmRecord;

}

ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
    if (this.querySubscription)
        this.querySubscription.unsubscribe();
    if (this.translateSubscription)
        this.translateSubscription.unsubscribe();
}

public getContractData(): void {
    this.fetchContractData('', { action: '0', ContractNumber: this.parentQueryParams['contractNumber'] || this.parentQueryParams['ContractNumber'], ContractTypeCode: this.parentQueryParams['contractType'] || this.parentQueryParams['ContractType'] || this.parentQueryParams['CurrentContractType']}).subscribe(
    (e) => {
        if (e.status === 'failure') {
            this.errorService.emitError(e.oResponse);
        } else {
            this.commenceDateFormGroup.controls['ContractNumber'].setValue(e.ContractNumber);
            this.commenceDateFormGroup.controls['ContractName'].setValue(e.ContractName);
            this.commenceDateFormGroup.controls['Status'].setValue(e.Status);
            this.commenceDateFormGroup.controls['AccountNumber'].setValue(e.AccountNumber);
            this.commenceDateFormGroup.controls['ContractAddressLine1'].setValue(e.ContractAddressLine1);
            this.commenceDateFormGroup.controls['ContractAddressLine2'].setValue(e.ContractAddressLine2);
            this.commenceDateFormGroup.controls['ContractAddressLine3'].setValue(e.ContractAddressLine3);
            this.commenceDateFormGroup.controls['ContractAddressLine4'].setValue(e.ContractAddressLine4);
            this.commenceDateFormGroup.controls['ContractAddressLine5'].setValue(e.ContractAddressLine5);
            this.commenceDateFormGroup.controls['ContractPostcode'].setValue(e.ContractPostcode);
            this.commenceDateFormGroup.controls['ContractAnnualValue'].setValue(e.ContractAnnualValue);
            this.storeData = {
                data: e
            };
            if (this.storeData['data'].ContractCommenceDate) {
                this.commenceDateDisplay = this.storeData['data'].ContractCommenceDate;
                this.contractCommenceDate = this.globalize.parseDateStringToDate(this.storeData['data'].ContractCommenceDate) as Date;
            }
            if (this.storeData['data'].InvoiceAnnivDate) {
                this.annivDateDisplay = this.storeData['data'].InvoiceAnnivDate;
                this.annivDate = this.globalize.parseDateStringToDate(this.storeData['data'].InvoiceAnnivDate) as Date;
            }
            this.fetchAccountData();
        }
    },
    (error) => {
        this.errorService.emitError(error);
    }
    );
}

public getStatus(contractNumber: any): void {
    this.fetchContractCommenceData('GetStatus', { action: '6', ContractNumber: contractNumber}).subscribe(
        (e) => {
            if (e.status === 'failure') {
                this.errorService.emitError(e.oResponse);
            } else {
                this.commenceDateFormGroup.controls['Status'].setValue(e.Status);
                this.commenceDateFormGroup.markAsPristine();
            }
        },
        (error) => {
            this.errorService.emitError(error);
        }
        );
}

public fetchTranslationContent(): void {
    this.getTranslatedValue('Contract Commence Date Maintenance', null).subscribe((res: string) => {
        this.zone.run(() => {
            if (res) {
                this.titleService.setTitle(res);
            }
        });
    });
}

public getTranslatedValue(key: any, params: any): any {
    if (params) {
        return this.translate.get(key, { value: params });
    } else {
        return this.translate.get(key);
    }
}

public modalHidden(): void {
    this.fetchTranslationContent();
}

public onContractDataReceived(data: any): void {
    // to be added
}

public lookUpRecord(data: any, maxresults: number): any {
    this.queryLookUp.set(this.serviceConstants.Action, '0');
    this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
    this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    if (maxresults) {
        this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
    }
    return this.httpService.lookUpRequest(this.queryLookUp, data);
}

public fetchOtherData(): any {
    let data = [{
        'table': 'Account',
        'query': { 'BusinessCode': this.utils.getBusinessCode(), 'AccountNumber': this.storeData['data'].AccountNumber},
        'fields': ['AccountNumber','AccountName']
    },
    {
        'table': 'Product',
        'query': {'BusinessCode': this.utils.getBusinessCode(), 'ProductCode': this.commenceDateFormGroup.controls['ProductCode'].value},
        'fields': ['BusinessCode', 'ProductDesc']
    },
    {
         'table': 'Premise',
         'query': {'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.commenceDateFormGroup.controls['ContractNumber'].value, 'PremiseNumber': this.commenceDateFormGroup.controls['PremiseNumber'].value},
         'fields': ['BusinessCode', 'PremiseName']
     }];
    this.lookUpRecord(data, 5).subscribe(
        (e) => {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    if (e['results'][0][0].length > 0) {
                        this.commenceDateFormGroup.controls['AccountName'].setValue(e['results'][0][0].AccountName);
                    }
                    if (e['results'][0][1].length > 0) {
                        this.commenceDateFormGroup.controls['ProductDesc'].setValue(e['results'][0][0].ProductDesc);
                    }
                    if (e['results'][0][2].length > 0) {
                        this.commenceDateFormGroup.controls['PremiseName'].setValue(e['results'][0][0].PremiseName);
                    }

                }
            }
        },
        (error) => {
            // error statement
        }
        );
}

public fetchContractData(functionName: string, params: Object): any {
    this.queryContract = new URLSearchParams();
    this.queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
    this.queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

    if (functionName !== '') {
        this.queryContract.set(this.serviceConstants.Action, '6');
        this.queryContract.set('Function', functionName);
    }
    for (let key in params) {
        if (key) {
            this.queryContract.set(key, params[key]);
        }
    }
    return this.httpService.makeGetRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, this.queryContract);
}

public fetchContractCommenceData(functionName: string, params: Object): any {
    this.queryContract = new URLSearchParams();
    this.queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
    this.queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

    if (functionName !== '') {
        this.queryContract.set(this.serviceConstants.Action, '6');
        this.queryContract.set('Function', functionName);
    }
    for (let key in params) {
        if (key) {
            this.queryContract.set(key, params[key]);
        }
    }
    return this.httpService.makeGetRequest(this.queryParamsContractCommenceDate.method, this.queryParamsContractCommenceDate.module, this.queryParamsContractCommenceDate.operation, this.queryContract);
}

public fetchAccountData(): void {
    if (this.commenceDateFormGroup.controls['AccountNumber'].value && this.commenceDateFormGroup.controls['AccountNumber'].value !== '') {
        let data = [{
            'table': 'Account',
            'query': { 'AccountNumber': this.commenceDateFormGroup.controls['AccountNumber'].value },
            'fields': ['AccountNumber', 'AccountName']
        }];
        this.lookUpRecord(data, 5).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        this.commenceDateFormGroup.controls['AccountName'].setValue(e['results'][0][0]['AccountName']);
                    } else {
                        this.commenceDateFormGroup.controls['AccountName'].setValue('');
                    }
                }
            },
            (error) => {
                // error statement
            }
            );
    } else {
        this.commenceDateFormGroup.controls['AccountName'].setValue('');
    }
}

public postContractCommenceData(functionName: string, params: Object): any {
    let formdata = {};
    this.queryContract = new URLSearchParams();
    this.queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
    this.queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

    for (let key in params) {
        if (key) {
            this.queryContract.set(key, params[key]);
        }
    }
    formdata['ContractNumber'] = this.commenceDateFormGroup.controls['ContractNumber'].value;
    formdata['ContractName'] = this.commenceDateFormGroup.controls['ContractName'].value;
    formdata['AccountNumber'] = this.commenceDateFormGroup.controls['AccountNumber'].value;
    formdata['ContractAnnualValue'] = this.globalize.parseCurrencyToFixedFormat(this.commenceDateFormGroup.controls['ContractAnnualValue'].value);
    formdata['ContractCommenceDate'] = this.commenceDateDisplay;
    formdata['InvoiceAnnivDate'] = this.annivDateDisplay;
    formdata['ServiceVisitRowID'] = this.serviceVisitRowID;
    formdata['ContractROWID'] = this.storeData['data'] && this.storeData['data'].Contract ? this.storeData['data'].Contract : '';
    return this.httpService.makePostRequest(this.queryParamsContractCommenceDate.method, this.queryParamsContractCommenceDate.module, this.queryParamsContractCommenceDate.operation, this.queryContract, formdata);
}

public commenceDateSelectedValue(value: any): void {
    if (value && value.value && typeof value.value === 'string') {
        if (value.trigger === true) {
            this.commenceDateFormGroup.markAsDirty();
        }
        this.commenceDateDisplay = value.value;
        if (this.storeData['data'] && this.storeData['data'].ContractCommenceDate && this.storeData['data'].ContractCommenceDate !== this.commenceDateDisplay) {
            this.fetchContractCommenceData('GetAnniversaryDate,WarnCommenceDate', {
                action: '6',
                ContractNumber: this.commenceDateFormGroup.controls['ContractNumber'].value,
                ContractCommenceDate: this.commenceDateDisplay,
                ServiceVisitRowID:  this.serviceVisitRowID ? this.serviceVisitRowID : ''
            }).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    if (e['errorNumber'] !== 2072) {
                       this.annivDateDisplay = e.InvoiceAnnivDate || this.commenceDateDisplay;
                       this.setAnnivDate(this.annivDateDisplay);
                   }
                   //this.commencedate.dtDisplay = this.commenceDateDisplay;
                   this.errorService.emitError(e.oResponse);
                   return;
                } else {
                   if (e.errorMessage || e.ErrorMessage !== '') {
                       if (e['errorNumber'] !== 2072) {
                            this.annivDateDisplay = e.InvoiceAnnivDate || this.commenceDateDisplay;
                            this.setAnnivDate(this.annivDateDisplay);
                        }
                    //this.commencedate.dtDisplay = this.commenceDateDisplay;
                    this.errorService.emitError(e);
                    return;
                   }
                   this.setAnnivDate(this.commenceDateDisplay);

                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
            );
        }
    }
}

public setAnnivDate(commenceDateDisplay: any): void {
    if (commenceDateDisplay) {
        this.annivDateDisplay = commenceDateDisplay;
        this.annivDate = this.globalize.parseDateStringToDate(commenceDateDisplay) as Date;
    }
}

public annivDateSelectedValue(value: any): void {
    if (value && value.value) {
        this.annivDateDisplay = value.value;
        if (value.trigger === true) {
            this.commenceDateFormGroup.markAsDirty();
        }
    }
}

public onSubmit(data: FormGroup, valid: boolean, event: any): void {
    event.preventDefault();
    this.promptModal.show();
}

public promptSave(event: any): void {
    this.postContractCommenceData('GetStatus', { action: '2'}).subscribe(
        (e) => {
            if (e.status === 'failure') {
                this.errorService.emitError(e.oResponse);
            } else {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                } else {
                    this.storeData['data'].ContractCommenceDate = this.commenceDateDisplay;
                    this.storeData['data'].InvoiceAnnivDate = this.annivDateDisplay;
                    this.location.back();
                }

            }
        },
        (error) => {
            this.errorService.emitError(error);
        }
        );
}

public onCancelClick(event: any): void {
    if (this.parentQueryParams && this.parentQueryParams['parentRoute'] !== '') {
        this.location.back();
    }
}

public onContractNumberBlur(event: any): void {
    if (this.commenceDateFormGroup.controls['ContractNumber'].value !== '') {
        let paddedValue = this.utils.numberPadding(event.target.value, 8);
        this.commenceDateFormGroup.controls['ContractNumber'].setValue(paddedValue);
    }
}

@ViewChild('routeAwayComponent') public routeAwayComponent;
public canDeactivate(): any {
    this.routeAwayGlobals.setSaveEnabledFlag(this.commenceDateFormGroup.dirty);
    return this.routeAwayComponent.canDeactivate();
}

}
