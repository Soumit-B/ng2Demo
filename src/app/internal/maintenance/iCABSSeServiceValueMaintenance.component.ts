import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { ReplaySubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { BusinessOriginLangSearchComponent } from './../search/iCABSBBusinessOriginLanguageSearch.component';

@Component({
    templateUrl: 'iCABSSeServiceValueMaintenance.html'
})

export class SeServiceValueMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('businessOriginDropdown') public businessOriginDropdown: BusinessOriginLangSearchComponent;
    public pageId: string = '';
    public isRequesting: boolean = false;
    public businessOriginCode: string = '';
    public businessOriginDescription: string = '';
    public leadEmployee: string = '';
    public businessOriginDetailCode: string = '';
    public isCancelDisabled: boolean = true;
    public controls = [
        { name: 'ContractNumber', type: MntConst.eTypeCode, disabled: true },
        { name: 'ContractName', type: MntConst.eTypeText, disabled: true },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger, disabled: true },
        { name: 'PremiseName', type: MntConst.eTypeText, disabled: true },
        { name: 'ProductCode', type: MntConst.eTypeCode, disabled: true },
        { name: 'ProductDesc', type: MntConst.eTypeText, disabled: true },
        { name: 'ServiceValueEffectDate', type: MntConst.eTypeDate, disabled: true },
        { name: 'EmployeeCode', type: MntConst.eTypeText, disabled: true },
        { name: 'EmployeeSurname', type: MntConst.eTypeText, disabled: true },
        { name: 'ValueChangeDesc', type: MntConst.eTypeText, disabled: true },
        { name: 'AnnualValueChange', type: MntConst.eTypeDecimal2, disabled: true },
        { name: 'CurrentAnnualValue', type: MntConst.eTypeDecimal2, disabled: true },
        { name: 'VisitFrequencyChange', type: MntConst.eTypeInteger, disabled: true },
        { name: 'CurrentVisitFrequency', type: MntConst.eTypeInteger, disabled: true },
        { name: 'ServiceQuantityChange', type: MntConst.eTypeInteger, disabled: true },
        { name: 'CurrentServiceQuantity', type: MntConst.eTypeInteger, disabled: true },
        { name: 'AnnualTimeChange', type: MntConst.eTypeText, disabled: true },
        { name: 'CurrentAnnualTime', type: MntConst.eTypeText, disabled: true },
        { name: 'tUserCode', type: MntConst.eTypeText, disabled: true },
        { name: 'LeadEmployee', type: MntConst.eTypeText },
        { name: 'ServiceValueROWID' },
        { name: 'BusinessOriginDetail' },
        { name: 'BusinessOrigin' },
        { name: 'BusinessOriginDesc' }
    ];

    public queryParams: any = {
        operation: 'Service/iCABSSeServiceValueMaintenance',
        module: 'service-cover',
        method: 'contract-management/maintenance'
    };

    public dropdown: any = {
        businessOriginLang: {
            inputParams: {
                businessCode: '',
                countryCode: ''
            },
            isRequired: false,
            isDisabled: false,
            isTriggerValidate: false,
            active: {
                'id': '',
                'text': ''
            }
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEVALUEMAINTENANCE;
        this.browserTitle = 'Service Value Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnLoad();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
    }

    public windowOnLoad(): void {
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.setControlValue('ServiceValueROWID', this.riExchange.getParentAttributeValue('ServiceValueROWID'));
        this.fetchServiceValueDetails();
    }

    /* Method to fetch ServiceValue Details from connector */
    public fetchServiceValueDetails(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set('ContractNumber', this.getControlValue('ContractNumber'));
        search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        search.set('ProductCode', this.getControlValue('ProductCode'));
        search.set('ServiceValueROWID', this.getControlValue('ServiceValueROWID'));
        search.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    this.setControlValue('ServiceValueEffectDate', e.ServiceValueEffectDate);
                    if (e.EmployeeCode !== '') {
                        this.setControlValue('EmployeeCode', e.EmployeeCode);
                        this.getEmployeeSurname(e.EmployeeCode).subscribe((data) => {
                            this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                        });
                    }
                    this.setControlValue('ValueChangeDesc', e.ValueChangeDesc);
                    this.setControlValue('AnnualValueChange', e.AnnualValueChange);
                    this.setControlValue('CurrentAnnualValue', e.CurrentAnnualValue);
                    this.setControlValue('VisitFrequencyChange', e.VisitFrequencyChange);
                    this.setControlValue('CurrentVisitFrequency', e.CurrentVisitFrequency);
                    this.setControlValue('ServiceQuantityChange', e.ServiceQuantityChange);
                    this.setControlValue('CurrentServiceQuantity', e.CurrentServiceQuantity);
                    this.setControlValue('AnnualTimeChange', e.AnnualTimeChange);
                    this.setControlValue('CurrentAnnualTime', e.CurrentAnnualTime);
                    this.setControlValue('tUserCode', e.tUserCode);
                    this.setControlValue('ValueChangeDesc', e.ValueChangeDesc);
                    this.setControlValue('BusinessOriginDetail', e.BusinessOriginDetailCode);
                    this.setControlValue('LeadEmployee', e.LeadEmployee);
                    if (e.BusinessOriginCode !== '') {
                        this.setControlValue('BusinessOrigin', e.BusinessOriginCode);
                        this.setControlValue('BusinessOriginDesc', e.BusinessOriginDesc);
                        this.dropdown.businessOriginLang.active = {
                            id: e.BusinessOriginCode,
                            text: e.BusinessOriginCode + ' - ' + e.BusinessOriginDesc
                        };
                        this.checkFields(e.BusinessOriginCode);
                    }
                    this.businessOriginCode = e.BusinessOriginCode;
                    this.businessOriginDescription = e.BusinessOriginDesc;
                    this.leadEmployee = e.LeadEmployee;
                    this.businessOriginDetailCode = e.BusinessOriginDetailCode;
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    /* LookUp Method to fetch Employee Surname */
    public getEmployeeSurname(employeeCode: any): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        let lookupIP: any = [
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'EmployeeCode': employeeCode
                },
                'fields': ['EmployeeSurname']
            }
        ];
        let queryLookUp = new URLSearchParams();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryLookUp.set(this.serviceConstants.MaxResults, '100');
        this.httpService.lookUpRequest(queryLookUp, lookupIP).subscribe(res => retObj.next(res.results[0][0]));
        return retObj;
    }

    /*Method to check if LeadEmployee and BusinessOriginDetailCode fields should be enabled */
    public checkFields(businessOriginCode: any): void {
        let querySearch = this.getURLSearchParamObject();
        querySearch.set(this.serviceConstants.Action, '6');
        let postData: any = {};
        postData['BusinessOriginCode'] = businessOriginCode;
        postData['Function'] = 'CheckFields';
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, querySearch, postData)
            .subscribe(
            (response) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (response.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(response.errorMessage, response.fullError));
                }
                else {
                    if (response.DetailRequiredInd === 'no') {
                        this.disableControl('BusinessOriginDetail', true);
                    } else {
                        this.disableControl('BusinessOriginDetail', false);
                    }
                    if (response.LeadInd === 'no') {
                        this.disableControl('LeadEmployee', true);
                    } else {
                        this.disableControl('LeadEmployee', false);
                    }
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            });
    }

    /*Method invoked on clicking save button */
    public saveData(): void {
        let promptObj: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.promptConfirm.bind(this));
        this.modalAdvService.emitPrompt(promptObj);
    }

    public promptConfirm(data: any): void {
        let formData: any = {};
        formData['BusinessOriginCode'] = this.getControlValue('BusinessOrigin');
        formData['BusinessOriginDetailCode'] = this.getControlValue('BusinessOriginDetail');
        //formData['BusinessOriginDetailSystemDesc'] need to be added when dropdown is implemented
        formData['BusinessOriginDesc'] = this.getControlValue('BusinessOriginDesc');
        formData['LeadEmployee'] = this.getControlValue('LeadEmployee');
        formData['ServiceValueROWID'] = this.getControlValue('ServiceValueROWID');
        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formData['ProductCode'] = this.getControlValue('ProductCode');
        formData['ServiceValueEffectDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('ServiceValueEffectDate'));
        formData['EmployeeCode'] = this.getControlValue('EmployeeCode');
        formData['ValueChangeDesc'] = this.getControlValue('ValueChangeDesc');
        formData['AnnualValueChange'] = this.globalize.parseDecimal2ToFixedFormat(this.getControlValue('AnnualValueChange'));
        formData['CurrentAnnualValue'] = this.globalize.parseDecimal2ToFixedFormat(this.getControlValue('CurrentAnnualValue'));
        formData['VisitFrequencyChange'] = this.globalize.parseIntegerToFixedFormat(this.getControlValue('VisitFrequencyChange'));
        formData['CurrentVisitFrequency'] = this.globalize.parseIntegerToFixedFormat(this.getControlValue('CurrentVisitFrequency'));
        formData['ServiceQuantityChange'] = this.globalize.parseIntegerToFixedFormat(this.getControlValue('ServiceQuantityChange'));
        formData['CurrentServiceQuantity'] = this.globalize.parseIntegerToFixedFormat(this.getControlValue('CurrentServiceQuantity'));
        formData['AnnualTimeChange'] = this.getControlValue('AnnualTimeChange');
        formData['CurrentAnnualTime'] = this.getControlValue('CurrentAnnualTime');
        formData['tUserCode'] = this.getControlValue('tUserCode');
        formData['Function'] = 'CheckFields';

        let search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                }
                else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                    this.isCancelDisabled = false;
                    this.formPristine();
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            });
    }

    /*Method invoked on clicking Cancel Button */
    public resetForm(): void {
        this.setControlValue('BusinessOrigin', this.businessOriginCode);
        this.setControlValue('BusinessOriginDesc', this.businessOriginDescription);
        this.setControlValue('LeadEmployee', this.leadEmployee);
        this.setControlValue('BusinessOriginDetail', this.businessOriginDetailCode);
        this.dropdown.businessOriginLang.active = {
            id: this.businessOriginCode,
            text: this.businessOriginCode + ' - ' + this.businessOriginDescription
        };
        this.isCancelDisabled = true;
        this.formPristine();
    }

    public onBusinessOriginCodeChange(event: any): void {
        if (event['BusinessOriginLang.BusinessOriginCode']) {
            this.setControlValue('BusinessOrigin', event['BusinessOriginLang.BusinessOriginCode']);
            this.setControlValue('BusinessOriginDesc', event['BusinessOriginLang.BusinessOriginDesc']);
            this.dropdown.businessOriginLang.isTriggerValidate = false;
            this.isCancelDisabled = false;
            this.setControlValue('LeadEmployee', '');
            this.checkFields(event['BusinessOriginLang.BusinessOriginCode']);
            this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'BusinessOrigin');
        }
    }
}

