import { Component, NgZone, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { HttpService } from './../../../../shared/services/http-service';
import { ContractActionTypes } from '../../../../app/actions/contract';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { EmployeeSearchComponent } from '../../../../app/internal/search/iCABSBEmployeeSearch';
import { GlobalConstant } from './../../../../shared/constants/global.constant';
import { Utils } from '../../../../shared/services/utility';
import { ActionTypes } from './../../../actions/prospect';
import { RiExchange } from './../../../../shared/services/riExchange';
import { ErrorService } from '../../../../shared/services/error.service';
import { LocaleTranslationService } from '../../../../shared/services/translation.service';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';
import { EllipsisComponent } from '../../../../shared/components/ellipsis/ellipsis';

@Component({
    selector: 'icabs-maintenance-type-c',
    templateUrl: 'maintenanceTabAccount.html'
})

export class MaintenanceTypeAccountComponent implements OnInit, OnDestroy {

    @ViewChild('messageModal') public messageModal;
    @ViewChild('postcodeAccountSearchEllipsis') public postcodeAccountSearchEllipsis: EllipsisComponent;

    private allFormControls: Array<any> = [];
    private parentControls: any;

    public showMessageHeader: boolean = true;
    public inputParams: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
    public inputParamsEmployeeSearch: any = { 'parentMode': 'LookUp', 'countryCode': '', 'businessCode': '' };
    public postcodeSearchComponent = PostCodeSearchComponent;
    public inputAccountParamsPostcode: any = { parentMode: 'Prospect', PostCode: '', AddressLine5: '', AddressLine4: '' };
    public storeSubscription: Subscription;
    public querySubscription: Subscription;
    public translateSubscription: Subscription;
    public maintenanceAccountFormGroup: FormGroup;
    public queryParam: URLSearchParams = new URLSearchParams();
    public poscodeSearchDisable: boolean = false;
    public poscodeSearchHide: boolean = false;
    public queryParamsProspect: any = {
        action: '0',
        operation: 'ContactManagement/iCABSCMPipelineProspectMaintenance',
        module: 'prospect',
        method: 'prospect-to-contract/maintenance',
        contentType: 'application/x-www-form-urlencoded',
        branchNumber: '',
        branchName: ''
    };
    public fieldVisibility: any = {
        'isHiddenProspectName': false,
        'isHiddenAddressLine1': false,
        'isHiddenAddressLine2': false,
        'isHiddenAddressLine3': false,
        'isHiddenAddressLine4': false,
        'isHiddenAddressLine5': false,
        'isHiddenPostcode': false,
        'isHiddenContactName': false,
        'isHiddenContactPosition': false,
        'isHiddenContactMobile': false,
        'isHiddenContactTelephone': false,
        'isHiddenContactFax': false,
        'isHiddenContactEmail': false,
        'isHiddencmdGetAddress': false,
        'isHiddenCopyPremise': false
    };
    public fieldRequired: any = {
        'ProspectName': false,
        'AddressLine1': false,
        'AddressLine2': false,
        'AddressLine3': false,
        'AddressLine4': false,
        'AddressLine5': false,
        'Postcode': false,
        'ContactName': false,
        'ContactPosition': false,
        'ContactMobile': false,
        'ContactFax': false,
        'ContactEmail': false,
        'ContactTelephone': false
    };

    public fieldDisable: any = {
        'ProspectName': false,
        'AddressLine1': false,
        'AddressLine2': false,
        'AddressLine3': true,
        'AddressLine4': false,
        'AddressLine5': false,
        'Postcode': false,
        'ContactName': false,
        'ContactPosition': false,
        'ContactMobile': false,
        'ContactFax': false,
        'ContactEmail': false,
        'ContactTelephone': false
    };
    public companyList: Array<any> = [];

    public dateObjectsEnabled: Object = {
        contractResignDate: false
    };
    public buttonDisable: any = {
        cp: false,
        getaddress: false
    };
    public autoOpen: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    public searchModalRoute: string = '';
    public showHeader: boolean = true;
    public showButton: boolean = true;

    public parentQueryParams: any;
    public storeData: any;
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public systemParametersFromParent: any = { ttBusiness: [{}], systemChars: {} };

    constructor(
        private zone: NgZone,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private store: Store<any>,
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private riExchange: RiExchange,
        private el: ElementRef,
        private errorService: ErrorService,
        private translateService: LocaleTranslationService,
        private router: Router,
        private utils: Utils
    ) {
        this.maintenanceAccountFormGroup = this.fb.group({
            ProspectName: [{ value: '', disabled: false }],
            AddressLine1: [{ value: '', disabled: false }],
            AddressLine2: [{ value: '', disabled: false }],
            AddressLine3: [{ value: '', disabled: false }],
            AddressLine4: [{ value: '', disabled: false }],
            AddressLine5: [{ value: '', disabled: false }],
            Postcode: [{ value: '', disabled: false }],
            ContactName: [{ value: '', disabled: false }],
            ContactPosition: [{ value: '', disabled: false }],
            ContactMobile: [{ value: '', disabled: false }],
            ContactTelephone: [{ value: '', disabled: false }],
            ContactFax: [{ value: '', disabled: false }],
            ContactEmail: [{ value: '', disabled: false }]
        });


        this.storeSubscription = store.select('prospect').subscribe(data => {
            if (data['action']) {
                if (data['action'].toString() === ActionTypes.SAVE_SYSTEM_PARAMETER) {
                    this.systemParametersFromParent['systemChars'] = data['data']['systemChars'];
                    this.parentControls = data['data']['formParentControl'];
                    this.setUI();
                } else if (data['action'].toString() === ActionTypes.EXCHANGE_METHOD) {
                    for (let m of data['data']) {
                        if (this[m]) {
                            this[m]();
                        }
                    }

                } else if (data['action'].toString() === ActionTypes.FORM_CONTROLS) {
                    this.allFormControls.push(data['data']);
                }
            }

        });
    }

    ngOnInit(): void {
        this.updateStoreControl(ActionTypes.FORM_CONTROLS);
        this.translateService.setUpTranslation();
        this.disableAllAccount();
    }

    ngOnDestroy(): void {
        this.storeSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    }

    private updateStoreControl(action: string): void {
        this.store.dispatch({
            type: ActionTypes[action],
            payload: { formAccount: this.maintenanceAccountFormGroup }
        });
    }

    /**
     * Populate account information
     */
    private setAccountRelatedInfo(): void {
        if (this.systemParametersFromParent.systemChars.customBusinessObject.Enable === true) {
            if (this.parentControls.controls['AccountNumber'].value) {
                this.fieldVisibility.isHiddenCopyPremise = true;
                this.fieldVisibility.isHiddencmdGetAddress = true;
                /* Set required validation for all fields*/
                this.fieldRequired.ProspectName = false;
                this.fieldRequired.AddressLine1 = false;
                this.fieldRequired.AddressLine2 = false;
                this.fieldRequired.AddressLine3 = false;
                this.fieldRequired.AddressLine4 = false;
                this.fieldRequired.AddressLine5 = false;
                this.fieldRequired.Postcode = false;
                this.fieldRequired.ContactName = false;
                this.fieldRequired.ContactPosition = false;
                this.fieldRequired.ContactTelephone = false;
                this.fieldRequired.ContactFax = false;
                this.fieldRequired.ContactEmail = false;
                this.fieldRequired.ContactMobile = false;
                /** Set disable all fields when account number exists */
                this.fieldDisable.ProspectName = true;
                this.fieldDisable.AddressLine1 = true;
                this.fieldDisable.AddressLine2 = true;
                this.fieldDisable.AddressLine3 = true;
                this.fieldDisable.AddressLine4 = true;
                this.fieldDisable.AddressLine5 = true;
                this.fieldDisable.Postcode = true;
                this.fieldDisable.ContactName = true;
                this.fieldDisable.ContactPosition = true;
                this.fieldDisable.ContactTelephone = true;
                this.fieldDisable.ContactFax = true;
                this.fieldDisable.ContactEmail = true;
                this.fieldDisable.ContactMobile = true;
            } else {
                this.fieldVisibility.isHiddenCopyPremise = false;
                this.fieldVisibility.isHiddencmdGetAddress = false;
                /* Set required validation true*/
                this.fieldRequired.ProspectName = true;
                this.fieldRequired.AddressLine1 = true;
                this.fieldRequired.AddressLine4 = true;
                this.fieldRequired.Postcode = true;
                this.fieldRequired.ContactName = true;
                this.fieldRequired.ContactPosition = true;
                this.fieldRequired.ContactTelephone = true;
                if (this.systemParametersFromParent.systemChars.vSCEnableAddressLine3Required) {
                    this.fieldRequired.AddressLine3 = true;
                }
                if (this.systemParametersFromParent.systemChars.vSCAddressLine5Logical) {
                    this.fieldRequired.AddressLine5 = true;
                } else {
                    this.fieldRequired.AddressLine5 = false;
                }
                /** Set enable all fields when accountnumber does exist */

                this.fieldDisable.ProspectName = false;
                this.fieldDisable.AddressLine1 = false;
                this.fieldDisable.AddressLine2 = false;
                this.fieldDisable.AddressLine3 = false;
                this.fieldDisable.AddressLine4 = false;
                this.fieldDisable.AddressLine5 = false;
                this.fieldDisable.Postcode = false;
                this.fieldDisable.ContactName = false;
                this.fieldDisable.ContactPosition = false;
                this.fieldDisable.ContactTelephone = false;
                this.fieldDisable.ContactFax = false;
                this.fieldDisable.ContactEmail = false;
                this.fieldDisable.ContactMobile = false;
            }

            this.updateValidators();
            this.updateDisable();
        }
    }

    private populateAccountService(): void {
        //Service is not available and it's not required as of now
    }

    /*** Set fields properties at the time of page load
       */
    public setUI(): void {
        if (!this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF && !this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF) {
            this.fieldVisibility.isHiddencmdGetAddress = true;
        }
        this.poscodeSearchHide = !((this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF || this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF));
        this.fieldRequired['ProspectName'] = true;
        this.fieldRequired['AddressLine1'] = true;
        this.fieldRequired['AddressLine2'] = false;
        this.fieldRequired['AddressLine4'] = true;
        this.fieldRequired['Postcode'] = true;
        this.fieldRequired['ContactName'] = true;
        this.fieldRequired['ContactPosition'] = true;
        this.fieldRequired['ContactTelephone'] = true;
        this.fieldRequired['Postcode'] = true;
        this.fieldRequired['ContactName'] = true;
        let parentMode = this.riExchange.ParentMode(this.systemParametersFromParent.systemChars.routeParams);
        if (this.systemParametersFromParent.systemChars.vSCEnableAddressLine3) {
            this.fieldVisibility.isHiddenAddressLine3 = false;
            this.fieldRequired['AddressLine3'] = false;
            if (this.systemParametersFromParent.systemChars.vSCEnableAddressLine3Required) {
                this.fieldRequired['AddressLine3'] = true;
            }
        } else {
            this.fieldRequired['AddressLine3'] = false;
            this.fieldVisibility.isHiddenAddressLine3 = true;
        }
        if (this.systemParametersFromParent.systemChars.vSCAddressLine5Required) {
            this.fieldRequired['AddressLine5'] = true;
        } else {
            this.fieldRequired['AddressLine5'] = false;
        }
        if (parentMode === 'CallCentreSearchNewExisting') {
            this.maintenanceAccountFormGroup.controls['ProspectName'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'AccountName'));
            this.maintenanceAccountFormGroup.controls['AddressLine1'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'AccountAddressLine1'));
            this.maintenanceAccountFormGroup.controls['AddressLine2'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'AccountAddressLine2'));
            this.maintenanceAccountFormGroup.controls['AddressLine3'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'AccountAddressLine3'));
            this.maintenanceAccountFormGroup.controls['AddressLine4'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'AccountAddressLine4'));
            this.maintenanceAccountFormGroup.controls['AddressLine5'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'AccountAddressLine5'));
            this.maintenanceAccountFormGroup.controls['Postcode'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'AccountPostcode'));

        }
        if (parentMode === 'LostBusinessRequest') {
            this.populateAccountService();

        }
        if (this.systemParametersFromParent.systemChars.currentURL.match(new RegExp('Prospect', 'i'))) {
            this.setAccountRelatedInfo();
        }

        this.updateValidators();
    }

    /*** Update validation rules
    */

    public updateValidators(): void {
        for (let f in this.fieldRequired) {
            if (this.fieldRequired.hasOwnProperty(f)) {
                if (this.maintenanceAccountFormGroup.controls[f]) {
                    if (this.fieldRequired[f] && this.fieldRequired[f] === true) {
                        this.maintenanceAccountFormGroup.controls[f].setValidators([Validators.required, this.utils.commonValidate]);
                    }
                    else {
                        this.maintenanceAccountFormGroup.controls[f].clearValidators();
                        this.maintenanceAccountFormGroup.controls[f].setValidators([this.utils.commonValidate]);
                    }
                    this.maintenanceAccountFormGroup.controls[f].updateValueAndValidity();
                }
            }
        }

    }

    /*** Update validation rules*/

    public updateDisable(): void {
        for (let f in this.fieldDisable) {
            if (this.fieldDisable.hasOwnProperty(f)) {
                if (this.fieldDisable[f] && this.maintenanceAccountFormGroup.controls[f]) {
                    this.maintenanceAccountFormGroup.controls[f].disable();
                }
                else {
                    this.maintenanceAccountFormGroup.controls[f].enable();
                }
                this.maintenanceAccountFormGroup.controls[f].updateValueAndValidity();
            }
        }
    }

    /**
     * Get address click functionality
     */

    public onGetAddressClick(): void {
        //this.riExchange.setStore(ActionTypes.RI_EXCHANGE, { 'Mode': 'Prospect' });
        if (this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF) {
            /*this.router.navigate(['riMPAFSearch.htm'], {
               queryParams: {

               }
           });*/
            this.messageModal.show({ msg: 'Screen is yet not developed', title: 'Message' }, false);
        } else if (this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF) {
            this.inputAccountParamsPostcode = {
                parentMode: 'Prospect',
                PostCode: this.maintenanceAccountFormGroup.controls['Postcode'].value,
                AddressLine5: this.maintenanceAccountFormGroup.controls['AddressLine5'].value,
                AddressLine4: this.maintenanceAccountFormGroup.controls['AddressLine4'].value
            };
            this.postcodeAccountSearchEllipsis.childConfigParams = this.inputAccountParamsPostcode;
            this.postcodeAccountSearchEllipsis.openModal();
        }
    }

    public addressLine4Onfocusout(): void {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenanceAccountFormGroup.controls['AddressLine4'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['AddressLine4'].value));
        }
        if (this.systemParametersFromParent.systemChars.vSCAddressLine4Required && this.maintenanceAccountFormGroup.controls['AddressLine4'].value === '' && this.systemParametersFromParent.systemChars.SystemCharEnableValidatePostcodeSuburb)
            this.el.nativeElement.querySelector('#cmdGetAddress').click();
    }

    public addressLine5onfocusout(): void {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenanceAccountFormGroup.controls['AddressLine5'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['AddressLine5'].value));
        }
        if (this.systemParametersFromParent.systemChars.vSCAddressLine5Required && this.maintenanceAccountFormGroup.controls['AddressLine5'].value === '' && this.systemParametersFromParent.systemChars.SystemCharEnableValidatePostcodeSuburb)
            this.el.nativeElement.querySelector('#cmdGetAddress').click();
    }

    public postcodeOnfocusout(): void {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenanceAccountFormGroup.controls['Postcode'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['Postcode'].value));
        }
        if (this.systemParametersFromParent.systemChars.vSCPostCodeRequired && this.maintenanceAccountFormGroup.controls['Postcode'].value === '')
            this.el.nativeElement.querySelector('#cmdGetAddress').click();
    }
    public accountContactPositiononfocusout(): void {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenanceAccountFormGroup.controls['ProspectName'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['ProspectName'].value));
            this.maintenanceAccountFormGroup.controls['AddressLine1'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['AddressLine1'].value));
            this.maintenanceAccountFormGroup.controls['AddressLine2'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['AddressLine2'].value));
            this.maintenanceAccountFormGroup.controls['AddressLine3'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['AddressLine3'].value));
            this.maintenanceAccountFormGroup.controls['ContactName'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['ContactName'].value));
            this.maintenanceAccountFormGroup.controls['ContactPosition'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['ContactPosition'].value));
            this.maintenanceAccountFormGroup.controls['ContactTelephone'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['ContactTelephone'].value));
            this.maintenanceAccountFormGroup.controls['ContactFax'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['ContactFax'].value));
            this.maintenanceAccountFormGroup.controls['ContactMobile'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['ContactMobile'].value));
        }

        if (this.systemParametersFromParent.systemChars.customBusinessObject.Update === false) {
            if (this.systemParametersFromParent.systemChars.vSCRunPAFSearchOn1stAddressLine && (this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF || this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF)) {
                this.onGetAddressClick();
            }
        }

    }

    /**
     * Copy fields values from premise
     */

    public cmdCopyFromPremiseOnClick(): void {
        this.maintenanceAccountFormGroup.controls['ProspectName'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseName'].value);
        this.maintenanceAccountFormGroup.controls['AddressLine1'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseAddressLine1'].value);
        this.maintenanceAccountFormGroup.controls['AddressLine2'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseAddressLine2'].value);
        this.maintenanceAccountFormGroup.controls['AddressLine3'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseAddressLine3'].value);
        this.maintenanceAccountFormGroup.controls['AddressLine4'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseAddressLine4'].value);
        this.maintenanceAccountFormGroup.controls['AddressLine5'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseAddressLine5'].value);
        this.maintenanceAccountFormGroup.controls['Postcode'].setValue(this.allFormControls[0]['formPremise'].controls['PremisePostcode'].value);
        this.maintenanceAccountFormGroup.controls['ContactName'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseContactName'].value);
        this.maintenanceAccountFormGroup.controls['ContactPosition'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseContactPosition'].value);
        this.maintenanceAccountFormGroup.controls['ContactTelephone'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseContactTelephone'].value);
        this.maintenanceAccountFormGroup.controls['ContactFax'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseContactFax'].value);
        this.maintenanceAccountFormGroup.controls['ContactEmail'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseContactEmail'].value);
        this.maintenanceAccountFormGroup.controls['ContactMobile'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseContactMobile'].value);
    }

    /*** Premise postcode change service call
  */
    public postcodeOnchange(postCode: string): void {
        this.inputAccountParamsPostcode = {
            parentMode: 'Prospect',
            PostCode: this.maintenanceAccountFormGroup.controls['Postcode'].value,
            AddressLine5: this.maintenanceAccountFormGroup.controls['AddressLine5'].value,
            AddressLine4: this.maintenanceAccountFormGroup.controls['AddressLine4'].value
        };
        this.postcodeAccountSearchEllipsis.childConfigParams = this.inputAccountParamsPostcode;
        this.postcodeAccountSearchEllipsis.updateComponent();
        if (postCode && this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF && this.systemParametersFromParent.systemChars.vSCEnablePostcodeDefaulting) {
            this.queryParam.set(this.serviceConstants.Action, '0');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('Postcode', postCode);
            this.queryParam.set('Town', this.maintenanceAccountFormGroup.controls['AddressLine4'].value);
            this.queryParam.set('State', this.maintenanceAccountFormGroup.controls['AddressLine5'].value);
            this.queryParam.set('Function', 'GetPostCodeTownAndState');

            this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(
                (data) => {
                    try {
                        if (data.UniqueRecordFound !== 'yes') {
                            this.postcodeAccountSearchEllipsis.openModal();
                        } else {
                            this.maintenanceAccountFormGroup.controls['Postcode'].setValue(data.Postcode);
                            this.maintenanceAccountFormGroup.controls['AddressLine4'].setValue(data.Town);
                            this.maintenanceAccountFormGroup.controls['AddressLine5'].setValue(data.State);
                        }

                    } catch (error) {
                        this.errorService.emitError(error);
                    }

                },
                (error) => {
                     this.errorService.emitError(error);
                }
            );
        }
    }

    public onAccountPostcodeDataReturn(data: any): void {
        this.maintenanceAccountFormGroup.controls['Postcode'].setValue(data.Postcode);
        this.maintenanceAccountFormGroup.controls['AddressLine4'].setValue(data.AddressLine4);
        this.maintenanceAccountFormGroup.controls['AddressLine5'].setValue(data.AddressLine5);
    }

    public disableAllAccount(): void {
        for (let d in this.fieldDisable) {
            if (this.fieldDisable.hasOwnProperty(d)) {
                this.fieldDisable[d] = true;
            }
        }
        for (let d in this.buttonDisable) {
            if (this.buttonDisable.hasOwnProperty(d)) {
                this.buttonDisable[d] = true;
            }
        }
        this.updateDisable();
        this.poscodeSearchDisable = true;
    }

    public enableAllAccount(): void {
        for (let d in this.fieldDisable) {
            if (this.fieldDisable.hasOwnProperty(d)) {
                this.fieldDisable[d] = false;
            }
        }
        for (let d in this.buttonDisable) {
            if (this.buttonDisable.hasOwnProperty(d)) {
                this.buttonDisable[d] = false;
            }
        }
        this.updateDisable();
        this.poscodeSearchDisable = false;
        this.setUI();
    }

}
