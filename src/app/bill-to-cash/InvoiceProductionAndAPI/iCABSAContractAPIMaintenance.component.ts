import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { HttpService } from './../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ErrorService } from '../../../shared/services/error.service';
import { CBBService } from '../../../shared/services/cbb.service';
import { Utils } from '../../../shared/services/utility';
import { ContractActionTypes } from '../../../app/actions/contract';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { GlobalizeService } from '../../../shared/services/globalize.service';

@Component({
    selector: 'icabs-contract-commence-date-maintenance',
    templateUrl: 'iCABSAContractAPIMaintenance.html',
    providers: [ErrorService]
})

export class ContractAPIMaintenanceComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    public inputParams: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'C', 'businessCode': 'D' };
    public storeSubscription: Subscription;
    public querySubscription: Subscription;
    public translateSubscription: Subscription;
    public errorSubscription: Subscription;
    public routerSubscription: Subscription;
    public contractAPIFormGroup: FormGroup;
    public parentQueryParams: any;
    public commenceDateDisplay: string;
    public annivDateDisplay: string;
    public contractSearchComponent = ContractSearchComponent;
    public fieldVisibility: any = {
        APIExemptText: false
    };
    public fieldRequired: any = {
        contractCommenceDate: true,
        annivDate: true
    };

    public dateObjectsEnabled: Object = {
        contractCommenceDate: false,
        annivDate: false
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
    public queryParamsAPIExempt: any = {
        action: '0',
        operation: 'Application/iCABSAContractAPIMaintenance',
        module: 'api',
        method: 'contract-management/maintenance',
        contentType: 'application/x-www-form-urlencoded'
    };
    public storeData: any = {};
    public autoOpenSearch: boolean = false;
    public showCloseButton: boolean = true;
    public showHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public isContractEllipsisDisabled: boolean = false;
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
        'showAddNew': false,
        'contractNumber': ''
    };
    public promptTitle: string = '';
    public promptContent: string = '';
    public contractData: Object = {};
    constructor(
        private zone: NgZone,
        private fb: FormBuilder,
        private store: Store<any>,
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private authService: AuthService,
        private errorService: ErrorService,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private titleService: Title,
        private router: Router,
        private route: ActivatedRoute,
        private utils: Utils,
        private routeAwayGlobals: RouteAwayGlobals,
        private cbb: CBBService,
        private globalize: GlobalizeService
        ) {
        this.contractAPIFormGroup = this.fb.group({
            ContractNumber: [{ value: '', disabled: false }, Validators.required],
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
            ContractAnnualValue: [{ value: '', disabled: true }],
            APIExemptInd: [{ value: '', disabled: false }],
            APIExemptText: [{ value: '', disabled: false }]
        });
        this.querySubscription = this.route.queryParams.subscribe(params => {
            this.parentQueryParams = params;
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
            if (params['contractNumber']) {
                this.contractSearchParams.contractNumber = params['contractNumber'];
            }
        });

        this.storeSubscription = store.select('contract').subscribe(data => {
            this.storeData = data;
            if (data && data['data'] && data['data'].ContractNumber) {
                this.contractAPIFormGroup.controls['ContractNumber'].setValue(this.storeData['data'].ContractNumber);
                this.contractAPIFormGroup.controls['ContractName'].setValue(this.storeData['data'].ContractName);
                this.contractAPIFormGroup.controls['Status'].setValue(this.storeData['data'].Status);
                this.contractAPIFormGroup.controls['AccountNumber'].setValue(this.storeData['data'].AccountNumber);
                this.contractAPIFormGroup.controls['ContractAddressLine1'].setValue(this.storeData['data'].ContractAddressLine1);
                this.contractAPIFormGroup.controls['ContractAddressLine2'].setValue(this.storeData['data'].ContractAddressLine2);
                this.contractAPIFormGroup.controls['ContractAddressLine3'].setValue(this.storeData['data'].ContractAddressLine3);
                this.contractAPIFormGroup.controls['ContractAddressLine4'].setValue(this.storeData['data'].ContractAddressLine4);
                this.contractAPIFormGroup.controls['ContractAddressLine5'].setValue(this.storeData['data'].ContractAddressLine5);
                this.contractAPIFormGroup.controls['ContractPostcode'].setValue(this.storeData['data'].ContractPostcode);
                this.contractAPIFormGroup.controls['ContractAnnualValue'].setValue(this.storeData['data'].ContractAnnualValue);
                if (this.storeData['data'].ContractCommenceDate) {
                    this.commenceDateDisplay = this.storeData['data'].ContractCommenceDate;
                    this.contractCommenceDate = this.globalize.parseDateStringToDate(this.storeData['data'].ContractCommenceDate) as Date;
                }
                if (this.storeData['data'].InvoiceAnnivDate) {
                    this.annivDateDisplay = this.storeData['data'].InvoiceAnnivDate;
                    this.annivDate = this.globalize.parseDateStringToDate(this.storeData['data'].InvoiceAnnivDate) as Date;
                }
                if (this.storeData['data'].APIExemptInd) {
                    if (this.storeData['data'].APIExemptInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                        this.contractAPIFormGroup.controls['APIExemptInd'].setValue(true);
                        this.fieldVisibility.APIExemptText = true;
                        this.contractAPIFormGroup.controls['APIExemptText'].setValue(this.storeData['data'].APIExemptText);
                    } else {
                        this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
                        this.fieldVisibility.APIExemptText = false;
                    }
                } else {
                    this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
                    this.fieldVisibility.APIExemptText = false;
                }
                this.fetchContractData('GetStatus', { action: '6', ContractNumber: this.storeData['data'].ContractNumber}).subscribe(
                    (e) => {
                        if (e.status === 'failure') {
                            this.errorService.emitError(e.oResponse);
                        } else {
                            this.contractAPIFormGroup.controls['Status'].setValue(e.Status);
                        }
                    },
                    (error) => {
                        this.errorService.emitError(error);
                    }
                    );
            }
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
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                }
            });
        }
    });
    this.routerSubscription = this.router.events.subscribe(event => {
        switch (event.url) {
            case '/billtocash/contract/apiexempt':
            this.contractSearchParams.currentContractType = this.utils.getCurrentContractType('<contract>');
            break;
            case '/billtocash/job/apiexempt':
            this.contractSearchParams.currentContractType = this.utils.getCurrentContractType('<job>');
            break;
            default:
            break;
        }
    });
    this.promptTitle = MessageConstant.Message.ConfirmRecord;
    this.routeAwayUpdateSaveFlag();
    this.routeAwayGlobals.setEllipseOpenFlag(false);
}
ngAfterViewInit(): void {
    this.autoOpenSearch = true;
}
ngOnDestroy(): void {
    this.routeAwayGlobals.resetRouteAwayFlags();
    this.storeSubscription.unsubscribe();
    if (this.querySubscription)
        this.querySubscription.unsubscribe();
    if (this.translateSubscription)
        this.translateSubscription.unsubscribe();
    if (this.routerSubscription)
        this.routerSubscription.unsubscribe();
}
public fetchTranslationContent(): void {
    this.getTranslatedValue('Contract API Maintenance', null).subscribe((res: string) => {
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
    this.storeData['code'] = {
        country: this.utils.getCountryCode(),
        business: this.utils.getBusinessCode()
    };
    this.cbb.disableComponent(true);
    if (data) {
        this.fetchContractData('', { ContractNumber: data.ContractNumber, ContractTypeCode: data.ContractTypePrefix, action: 0 }).subscribe((e) => {
            if (e['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(e['oResponse']);
            } else {
                this.applyFormData(e);
                this.contractData = e;
                this.storeData = e;
            }
        });
    }
}

public applyFormData(e: any): void {
    this.contractAPIFormGroup.controls['ContractNumber'].setValue(e.ContractNumber);
    this.contractAPIFormGroup.controls['ContractName'].setValue(e.ContractName);
    this.contractAPIFormGroup.controls['Status'].setValue(e.Status);
    this.contractAPIFormGroup.controls['AccountNumber'].setValue(e.AccountNumber);
    this.contractAPIFormGroup.controls['ContractAddressLine1'].setValue(e.ContractAddressLine1);
    this.contractAPIFormGroup.controls['ContractAddressLine2'].setValue(e.ContractAddressLine2);
    this.contractAPIFormGroup.controls['ContractAddressLine3'].setValue(e.ContractAddressLine3);
    this.contractAPIFormGroup.controls['ContractAddressLine4'].setValue(e.ContractAddressLine4);
    this.contractAPIFormGroup.controls['ContractAddressLine5'].setValue(e.ContractAddressLine5);
    this.contractAPIFormGroup.controls['ContractPostcode'].setValue(e.ContractPostcode);
    this.contractAPIFormGroup.controls['ContractAnnualValue'].setValue(e.ContractAnnualValue);
    if (e.ContractCommenceDate) {
        this.commenceDateDisplay = e.ContractCommenceDate;
        this.contractCommenceDate = this.globalize.parseDateStringToDate(e.ContractCommenceDate) as Date;
    }
    if (e.InvoiceAnnivDate) {
        this.annivDateDisplay = e.InvoiceAnnivDate;
        this.annivDate = this.globalize.parseDateStringToDate(e.InvoiceAnnivDate) as Date;
    }
    if (e.APIExemptInd) {
        if (e.APIExemptInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.contractAPIFormGroup.controls['APIExemptInd'].setValue(true);
            this.fieldVisibility.APIExemptText = true;
            this.contractAPIFormGroup.controls['APIExemptText'].setValue(e.APIExemptText);
        } else {
            this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
            this.fieldVisibility.APIExemptText = false;
        }
    } else {
        this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
        this.fieldVisibility.APIExemptText = false;
    }
    this.fetchOtherData();
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
        'query': { 'BusinessCode': this.storeData['code'] && this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'AccountNumber': this.contractAPIFormGroup.controls['AccountNumber'].value},
        'fields': ['AccountNumber','AccountName']
    }];
    this.lookUpRecord(data, 5).subscribe(
        (e) => {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    this.contractAPIFormGroup.controls['AccountName'].setValue(e['results'][0][0].AccountName);
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

public postAPIExemptData(functionName: string, params: Object): any {
    let formdata = {};
    this.queryContract = new URLSearchParams();
    this.queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
    this.queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    if (functionName !== '') {
        this.queryContract.set('Function', functionName);
    }
    for (let key in params) {
        if (key) {
            this.queryContract.set(key, params[key]);
        }
    }
    formdata['ContractROWID'] = this.storeData['Contract'];
    formdata['ContractNumber'] = this.contractAPIFormGroup.controls['ContractNumber'].value;
    formdata['ContractName'] = this.contractAPIFormGroup.controls['ContractName'].value;
    formdata['ContractCommenceDate'] = this.commenceDateDisplay;
    formdata['InvoiceAnnivDate'] = this.annivDateDisplay;
    formdata['AccountNumber'] = this.contractAPIFormGroup.controls['AccountNumber'].value;
    formdata['ContractAnnualValue'] = this.globalize.parseCurrencyToFixedFormat(this.contractAPIFormGroup.controls['ContractAnnualValue'].value);
    if (this.contractAPIFormGroup.controls['APIExemptInd'].value) {
        formdata['APIExemptInd'] = GlobalConstant.Configuration.Yes;
    } else {
        formdata['APIExemptInd'] = GlobalConstant.Configuration.No;
    }
    formdata['APIExemptText'] = this.contractAPIFormGroup.controls['APIExemptText'].value;
    return this.httpService.makePostRequest(this.queryParamsAPIExempt.method, this.queryParamsAPIExempt.module, this.queryParamsAPIExempt.operation, this.queryContract, formdata);
}

public commenceDateSelectedValue(value: any): void {
    if (value && value.value) {
        this.commenceDateDisplay = value.value;
    }
}
public annivDateSelectedValue(value: any): void {
    if (value && value.value) {
        this.annivDateDisplay = value.value;
    }
}
public onSubmit(data: FormGroup, valid: boolean, event: any): void {
    this.routeAwayGlobals.setSaveEnabledFlag(false);
    event.preventDefault();
    this.promptModal.show();
}
public promptSave(event: any): void {
    this.postAPIExemptData('GetStatus', { action: '2'}).subscribe(
        (e) => {
            if (e.status === 'failure') {
                this.errorService.emitError(e.oResponse);
            } else {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                }
            }
        },
        (error) => {
            this.errorService.emitError(error);
        }
        );
}
public onCancelClick(event: any): void {
    if (this.contractData['APIExemptInd']) {
        if (this.contractData['APIExemptInd'].toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.contractAPIFormGroup.controls['APIExemptInd'].setValue(true);
            this.fieldVisibility.APIExemptText = true;
            this.contractAPIFormGroup.controls['APIExemptText'].setValue(this.contractData['APIExemptText']);
        } else {
            this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
            this.contractAPIFormGroup.controls['APIExemptText'].setValue('');
            this.fieldVisibility.APIExemptText = false;
        }
    } else {
        this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
        this.contractAPIFormGroup.controls['APIExemptText'].setValue('');
        this.fieldVisibility.APIExemptText = false;
    }
}
public onContractNumberBlur(event: any): void {
    if (this.contractAPIFormGroup.controls['ContractNumber'].value !== '') {
        let paddedValue = this.numberPadding(event.target.value, 8);
        this.contractAPIFormGroup.controls['ContractNumber'].setValue(paddedValue);

        this.fetchContractData('', { ContractNumber: this.contractAPIFormGroup.controls['ContractNumber'].value, ContractTypeCode: this.contractSearchParams.currentContractType, action: 0 }).subscribe((e) => {
            if (e['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(e['oResponse']);
            } else {
                if (e['errorMessage']) {
                    this.errorService.emitError(e);
                    this.contractAPIFormGroup.reset();
                    this.commenceDateDisplay = null;
                    this.contractCommenceDate = new Date(this.commenceDateDisplay);
                    this.annivDateDisplay = null;
                    this.annivDate = new Date(this.annivDateDisplay);
                    this.cbb.disableComponent(false);
                    return;
                }
                this.cbb.disableComponent(true);
                this.storeData = e;
                this.contractAPIFormGroup.controls['ContractNumber'].setValue(e.ContractNumber);
                this.contractAPIFormGroup.controls['ContractName'].setValue(e.ContractName);
                this.contractAPIFormGroup.controls['Status'].setValue(e.Status);
                this.contractAPIFormGroup.controls['AccountNumber'].setValue(e.AccountNumber);
                this.contractAPIFormGroup.controls['ContractAddressLine1'].setValue(e.ContractAddressLine1);
                this.contractAPIFormGroup.controls['ContractAddressLine2'].setValue(e.ContractAddressLine2);
                this.contractAPIFormGroup.controls['ContractAddressLine3'].setValue(e.ContractAddressLine3);
                this.contractAPIFormGroup.controls['ContractAddressLine4'].setValue(e.ContractAddressLine4);
                this.contractAPIFormGroup.controls['ContractAddressLine5'].setValue(e.ContractAddressLine5);
                this.contractAPIFormGroup.controls['ContractPostcode'].setValue(e.ContractPostcode);
                this.contractAPIFormGroup.controls['ContractAnnualValue'].setValue(e.ContractAnnualValue);
                if (e.ContractCommenceDate) {
                    this.commenceDateDisplay = e.ContractCommenceDate;
                    this.contractCommenceDate = this.globalize.parseDateStringToDate(e.ContractCommenceDate) as Date;
                }
                if (e.InvoiceAnnivDate) {
                    this.annivDateDisplay = e.InvoiceAnnivDate;
                    this.annivDate = this.globalize.parseDateStringToDate(e.InvoiceAnnivDate) as Date;
                }
                if (e.APIExemptInd) {
                    if (e.APIExemptInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                        this.contractAPIFormGroup.controls['APIExemptInd'].setValue(true);
                        this.fieldVisibility.APIExemptText = true;
                        this.contractAPIFormGroup.controls['APIExemptText'].setValue(e.APIExemptText);
                    } else {
                        this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
                        this.fieldVisibility.APIExemptText = false;
                    }
                } else {
                    this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
                    this.fieldVisibility.APIExemptText = false;
                }
                this.fetchOtherData();
            }
        });
    }

}
public onAPIExemptChange(event: any): void {
    if (event.target.checked) {
        this.fieldVisibility.APIExemptText = true;
    } else {
        this.fieldVisibility.APIExemptText = false;
    }
}
public numberPadding(num: any, size: any): string {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
}
//Cr implementation
@ViewChild('routeAwayComponent') public routeAwayComponent;
public canDeactivate(): Observable<boolean> {
    return this.routeAwayComponent.canDeactivate();
}
public routeAwayUpdateSaveFlag(): void {
        this.contractAPIFormGroup.statusChanges.subscribe((value: any) => {
            if (this.contractAPIFormGroup.valid === true) {
                this.routeAwayGlobals.setEllipseOpenFlag(false); // Note: only use if ellipse is used in the page.
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            } else {
                this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    }


}
