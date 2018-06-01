import { Component, OnInit, OnDestroy, Injector, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from '../../internal/search/iCABSAServiceCoverSearch';
import { EmployeeSearchComponent } from '../../internal/search/iCABSBEmployeeSearch';
import { HttpService } from '../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { AjaxConstant } from '../../../shared/constants/AjaxConstants';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { ReplaySubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { LostBusinessDetailLanguageSearchComponent } from '../../internal/search/iCABSBLostBusinessDetailLanguageSearch.component';
import { LostBusinessLanguageSearchComponent } from '../../internal/search/iCABSBLostBusinessLanguageSearch.component';
@Component({
    templateUrl: 'iCABSAServiceCoverPriceChangeMaintenance.html'
})

export class ServiceCoverPriceChangeMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('Premise') Premise;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('lostbusinesslanguagesearchDropDown') lostbusinesslanguagesearchDropDown: LostBusinessLanguageSearchComponent;
    @ViewChild('icabsLostBusinessLangDetail') icabsLostBusinessLangDetail: LostBusinessDetailLanguageSearchComponent;
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'PremiseNumber', required: 'true', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'ProductCode', required: 'true', type: MntConst.eTypeCode },
        { name: 'ProductDesc', type: MntConst.eTypeText },
        { name: 'Status', type: MntConst.eTypeText },
        { name: 'ServiceCommenceDate', type: MntConst.eTypeDate },
        { name: 'ServiceVisitFrequency', type: MntConst.eTypeInteger },
        { name: 'ServiceQuantity', type: MntConst.eTypeInteger },
        { name: 'ServiceSalesEmployee', type: MntConst.eTypeCode },
        { name: 'ServiceBranchNumber', type: MntConst.eTypeInteger },
        { name: 'CommissionEmployeeSurname', type: MntConst.eTypeText },
        { name: 'ServiceAnnualValue', type: MntConst.eTypeCurrency },
        { name: 'EmployeeCode', required: 'true', type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', type: MntConst.eTypeText },
        { name: 'NewAnnualValue', required: 'true', type: MntConst.eTypeCurrency },
        { name: 'LastChangeEffectDate', required: 'true', type: MntConst.eTypeDate },
        { name: 'SalesEmployeeText', type: MntConst.eTypeText },
        { name: 'ServiceCoverRowID' },
        { name: 'LostBusinessRequestNumber' },
        { name: 'ActionType' },
        { name: 'ReasonCode', required: 'true' },
        { name: 'DetailCode', required: 'true' }
    ];
    public ellipsisConfig = {
        premise: {
            disabled: false,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'showAddNew': false
            },
            component: PremiseSearchComponent
        },
        product: {
            disabled: false,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Search',
                'ContractNumber': '',
                'PremiseNumber': '',
                'ContractName': '',
                'PremiseName': '',
                'ProductCode': '',
                'ProductDesc': ''
            },
            component: ServiceCoverSearchComponent
        },
        employee: {
            showCloseButton: true,
            showHeader: true,
            childConfigParams: {
                'parentMode': 'LookUp-Sales'
            },
            component: EmployeeSearchComponent
        }
    };
    public dropdown: any = {
        languageSearch: {
            isRequired: true,
            isDisabled: true,
            inputParams: {
                'parentMode': 'Search',
                'languageCode': this.riExchange.LanguageCode()
            },
            active: {
                id: '',
                text: ''
            }
        }
    };

    public lostBusinessInputParams: any = { LanguageCode: this.riExchange.LanguageCode(), isDisabled: true, isRequired: true };
    public pageTitle;
    public ServiceCoverRowID: any;
    public controlDisable = { updateDisabled: true, cancelDisabled: true };
    public enableMandatoryFields: boolean = false;
    //public updateDisabled: boolean = true;
    //public cancelDisabled: boolean = true;
    public newAnnualVal: any;
    public oldAnnualVal: any;
    public isRequesting;
    public queryParams: URLSearchParams = new URLSearchParams();
    public xhrParams = {
        module: 'api',
        method: 'contract-management/maintenance',
        operation: 'Application/iCABSAServiceCoverPriceChangeMaintenance'
    };

    constructor(injector: Injector, private xhr: HttpService, private el: ElementRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERPRICECHANGEMAINTENANCE;
        this.browserTitle = 'Service Cover Value Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public window_onload(): void {
        // this.Premise.nativeElement.focus();
        this.disableSecondaryFields();
        if (this.parentMode === 'Contact') {
            this.riExchange.getParentHTMLValue('ContractNumber');
            this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = this.getControlValue('ContractNumber');
            this.ellipsisConfig.product.childConfigParams['ContractNumber'] = this.getControlValue('ContractNumber');
            this.riExchange.getParentHTMLValue('ContractName');
            this.ellipsisConfig.premise.childConfigParams['ContractName'] = this.getControlValue('ContractName');
            this.ellipsisConfig.product.childConfigParams['ContractName'] = this.getControlValue('ContractName');
            this.riExchange.getParentHTMLValue('PremiseNumber');
            this.riExchange.getParentHTMLValue('PremiseName');
            this.riExchange.getParentHTMLValue('ProductCode');
            this.riExchange.getParentHTMLValue('ProductDesc');
            this.riExchange.getParentHTMLValue('LostBusinessRequestNumber');
        }
        if (this.riExchange.URLParameterContains('Increase')) {
            this.pageTitle = 'Service Cover Price Increase';
            this.setControlValue('ActionType', 'Increase');
        }
        else {
            this.pageTitle = 'Service Cover Price Decrease';
            this.setControlValue('ActionType', 'Decrease');
        }
    }

    public populateFields(): void {
        this.getLookUpData().subscribe((data) => {
            this.setControlValue('SalesEmployeeText', this.utils.capitalizeFirstLetter(data.SalesEmployeeText));
            this.setControlValue('ServiceCommenceDate', this.utils.formatDate(data.ServiceCommenceDate));
            this.oldAnnualVal = data.ServiceAnnualValue;
            // this.setControlValue('ServiceAnnualValue', parseFloat(data.ServiceAnnualValue).toFixed(2));
            this.setControlValue('ServiceAnnualValue', this.oldAnnualVal);
            this.setControlValue('ServiceQuantity', data.ServiceQuantity);
            this.setControlValue('ServiceVisitFrequency', data.ServiceVisitFrequency);
            this.setControlValue('ServiceSalesEmployee', data.ServiceSalesEmployee);
            this.setControlValue('EmployeeCode', data.ServiceSalesEmployee);
            this.setControlValue('ServiceBranchNumber', data.ServiceBranchNumber);
            this.getServiceCoverStatus(data.ttServiceCover);
            this.populateNewEmployeeDesc();
            this.populateCommissionEmployeeDesc();
        });
        this.riMaintenance.AddTable('ServiceCover');
        this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableKey('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableKeyAlignment('ProductCode', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('ServiceCommenceDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServiceAnnualValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServiceQuantity', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServiceVisitFrequency', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServiceSalesEmployee', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('SalesEmployeeText', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('ServiceBranchNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableCommit(this);

        if (this.parentMode === 'Contact' && this.getControlValue('ProductCode') !== '') {
            this.setControlValue('ServiceCoverRowID', this.riExchange.getParentAttributeValue('ServiceCoverRowID'));
        }

        this.riMaintenance.setIndependentVTableLookup(true);
        this.riMaintenance.AddTable('*');
        this.riMaintenance.AddTableField('Status', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('Status', false);
        this.riMaintenance.AddTableField('ActionType', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateFixed, 'Optional');
        this.riMaintenance.AddTableField('EmployeeCode', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('NewAnnualValue', MntConst.eTypeCurrency, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('LostBusinessRequestNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateFixed, 'Optional');
        this.riMaintenance.AddTableField('LastChangeEffectDate', MntConst.eTypeDate, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('LostBusinessCode', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('LostBusinessDetailCode', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableCommit(this);
        this.riMaintenance.Complete();
    }

    public getServiceCoverStatus(row: string): void {
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetStatus' + '&ServiceCoverRowID=' + row;
        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            }
            else {
                this.setControlValue('Status', data.Status);
            }
        });
        this.ServiceCoverRowID = row;
    }

    public onLostBusinessLanguageSearch(event: any): void {
        this.setControlValue('ReasonCode', event['LostBusinessLang.LostBusinessCode']);
        this.lostBusinessInputParams.LostBusinessCode = event['LostBusinessLang.LostBusinessCode'];
        this.icabsLostBusinessLangDetail.fetchDropDownData();
    }

    public onLostBusinessDetailLangDataReceived(event: any): void {
        this.setControlValue('DetailCode', event['LostBusinessDetailLang.LostBusinessDetailCode']);
    }
    //Method invoked on change of NewAnnualValue and EffectiveDate
    public riExchange_CBORequest(request: string): void {
        if (request === 'annualValue') {
            let parsedValue = this.globalize.parseCurrencyToFixedFormat(this.getControlValue('NewAnnualValue'));
            if (!parsedValue || this.getControlValue('NewAnnualValue') === '') {
                this.riExchange.riInputElement.markAsError(this.uiForm, 'NewAnnualValue');
            } else {
                this.newAnnualVal = this.getControlValue('NewAnnualValue');
                if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'NewAnnualValue') && this.getControlValue('NewAnnualValue') !== '') {
                    this.riMaintenance.CBORequestClear();
                    this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=WarnValueRange';
                    this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
                    this.riMaintenance.CBORequestAdd('NewAnnualValue');
                    this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                        if (data.hasError) {
                            this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
                        }
                    });
                }
            }
        } else
            if (request === 'effectiveDate') {
                if (this.getControlValue('LastChangeEffectDate') !== '') {
                    this.riMaintenance.CBORequestClear();
                    this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=WarnAnniversaryDate';
                    this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
                    this.riMaintenance.CBORequestAdd('ContractNumber');
                    this.riMaintenance.CBORequestAdd('LastChangeEffectDate');
                    this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                        if (data.hasError) {
                            this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
                        }
                    });
                }
            }
    }

    //Method invoked on Premise and Product ellipsis fetch
    public riMaintenance_Search(data: any, type: string): void {
        switch (type) {
            case 'premise':
                this.setControlValue('PremiseNumber', data.PremiseNumber);
                this.setControlValue('PremiseName', data.PremiseName);
                if (this.getControlValue('PremiseNumber') !== '') {
                    this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = data.PremiseNumber;
                    this.ellipsisConfig.product.childConfigParams['PremiseName'] = data.PremiseName;
                }
                break;
            case 'product':
                this.setControlValue('ProductCode', data.row.ProductCode);
                this.setControlValue('ProductDesc', data.row.ProductDesc);
                this.enableSecondaryFields();
                this.populateFields();
                break;
        }
    }

    //Method to lookUp Secondary fields
    public getLookUpData(): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        let lookupIP = [
            {
                'table': 'ServiceCover',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ServiceCommenceDate', 'ServiceAnnualValue', 'ServiceQuantity', 'ServiceVisitFrequency', 'ServiceSalesEmployee', 'SalesEmployeeText', 'ServiceBranchNumber', 'ServiceCoverRowID']
            }
        ];

        let queryLookUp = new URLSearchParams();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryLookUp.set(this.serviceConstants.MaxResults, '100');
        this.xhr.lookUpRequest(queryLookUp, lookupIP).subscribe(res => retObj.next(res.results[0][0]));
        return retObj;
    }

    //Method to fetch Premise Description
    public getLookUpPremiseDescription(): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        let lookupIP = [
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseName']
            }
        ];
        let queryLookUp = new URLSearchParams();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryLookUp.set(this.serviceConstants.MaxResults, '100');
        this.xhr.lookUpRequest(queryLookUp, lookupIP).subscribe(res => retObj.next(res.results[0][0]));
        return retObj;
    }

    //Method to fetch Premise Description
    public getLookUpProductDescription(data: any): Observable<any> {
        if (data === 'servicecover') {
            let retObj: ReplaySubject<any> = new ReplaySubject(1);
            let lookupIP = [
                {
                    'table': 'ServiceCover',
                    'query': {
                        'BusinessCode': this.utils.getBusinessCode(),
                        'ContractNumber': this.getControlValue('ContractNumber'),
                        'PremiseNumber': this.getControlValue('PremiseNumber'),
                        'ProductCode': this.getControlValue('ProductCode')
                    },
                    'fields': ['ServiceCoverNumber']
                }
            ];
            let queryLookUp = new URLSearchParams();
            queryLookUp.set(this.serviceConstants.Action, '0');
            queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            queryLookUp.set(this.serviceConstants.MaxResults, '100');
            this.xhr.lookUpRequest(queryLookUp, lookupIP).subscribe(res => retObj.next(res.results[0][0]));
            return retObj;
        }
        else {
            let retObj: ReplaySubject<any> = new ReplaySubject(1);
            let lookupIP = [
                {
                    'table': 'Product',
                    'query': {
                        'BusinessCode': this.utils.getBusinessCode(),
                        'ProductCode': this.getControlValue('ProductCode')
                    },
                    'fields': ['ProductDesc']
                }
            ];
            let queryLookUp = new URLSearchParams();
            queryLookUp.set(this.serviceConstants.Action, '0');
            queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            queryLookUp.set(this.serviceConstants.MaxResults, '100');
            this.xhr.lookUpRequest(queryLookUp, lookupIP).subscribe(res => retObj.next(res.results[0][0]));
            return retObj;
        }
    }

    public enableSecondaryFields(): void {
        this.enableControls(['ContractNumber', 'ContractName', 'PremiseName', 'ProductDesc']);
        this.disableControl('ContractNumber', true);
        this.disableControl('ContractName', true);
        //  this.disableControl('PremiseNumber', true);
        this.disableControl('PremiseName', true);
        //   this.disableControl('ProductCode', true);
        this.disableControl('ProductDesc', true);
        this.disableControl('CommissionEmployeeSurname', true);
        this.disableControl('EmployeeSurname', true);
        this.dropdown.languageSearch.isDisabled = false;
        this.lostBusinessInputParams.isDisabled = false;
        this.controlDisable.updateDisabled = false;
        this.controlDisable.cancelDisabled = false;
        this.enableMandatoryFields = true;
    }

    public disableSecondaryFields(): void {
        this.disableControls(['ContractNumber', 'ContractName', 'PremiseNumber', 'PremiseName', 'ProductCode', 'ProductDesc']);
        this.dropdown.languageSearch.isDisabled = true;
        this.lostBusinessInputParams.isDisabled = true;
        this.controlDisable.updateDisabled = true;
        this.controlDisable.cancelDisabled = true;
    }

    public populatePremiseDescription(event: any): void {
        if (event.srcElement.value === '') {
            this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = '';
            this.ellipsisConfig.product.childConfigParams['PremiseName'] = '';
            this.setControlValue('PremiseName', '');
            this.clearControls(['ContractNumber', 'ContractName', 'PremiseNumber', 'PremiseName']);
            this.onCancel();
            this.disableSecondaryFields();
        }
        else {
            if (isNaN(this.getControlValue('PremiseNumber'))) {
                this.riExchange.riInputElement.markAsError(this.uiForm, 'PremiseNumber');
            } else {
                this.isRequesting = true;
                this.getLookUpPremiseDescription().subscribe((data) => {
                    this.isRequesting = false;
                    if (data) {
                        this.setControlValue('PremiseName', data.PremiseName);
                        this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = this.getControlValue('PremiseNumber');
                        this.ellipsisConfig.product.childConfigParams['PremiseName'] = this.getControlValue('PremiseName');
                        document.querySelector('#ProductCode')['focus']();
                    } else {
                        this.setControlValue('PremiseName', '');
                        this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = '';
                        this.ellipsisConfig.product.childConfigParams['PremiseName'] = '';
                    }
                });
            }
        }
    }

    public populateProductDescription(event: any): void {
        if (event.srcElement.value === '') {
            this.setControlValue('ProductDesc', '');
            this.clearControls(['ContractNumber', 'ContractName', 'PremiseNumber', 'PremiseName', 'ProductCode', 'ProductDesc']);
            this.onCancel();
            this.disableSecondaryFields();
        } else {
            this.isRequesting = true;
            this.getLookUpProductDescription('servicecover').subscribe((data) => {
                this.isRequesting = false;
                if (data) {
                    this.getLookUpProductDescription('product').subscribe((data) => {
                        this.setControlValue('ProductDesc', data.ProductDesc);
                        this.enableSecondaryFields();
                        this.populateFields();
                        document.querySelector('#EmployeeCode')['focus']();
                    });
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
                    this.setControlValue('ProductDesc', '');
                    this.clearControls(['ContractNumber', 'ContractName', 'PremiseNumber', 'PremiseName', 'ProductCode', 'ProductDesc']);
                    this.onCancel();
                    this.disableSecondaryFields();
                }
            });
        }
    }

    public populateNewEmployeeDesc(): void {
        this.riMaintenance.setIndependentVTableLookup(true);
        this.riMaintenance.AddVirtualTable('Employee', 'NewEmployee');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCodeNumeric, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);
    }

    public populateCommissionEmployeeDesc(): void {
        this.riMaintenance.setIndependentVTableLookup(true);
        this.riMaintenance.AddVirtualTable('Employee', 'CommissionEmployee');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCodeNumeric, MntConst.eVirtualKeyStateNormal, '', '', 'ServiceSalesEmployee', 'Virtual');
        this.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'CommissionEmployeeSurname');
        this.riMaintenance.AddVirtualTableCommit(this);
    }

    public save(): void {
        if (this.getControlValue('EmployeeSurname') === '') {
            this.riExchange.riInputElement.markAsError(this.uiForm, 'EmployeeCode');
        }
        let isValidReasonCode = !this.getControlValue('ReasonCode') ? false : true;
        let isValidDetailCode = !this.getControlValue('DetailCode') ? false : true;

        if (!isValidReasonCode)
            this.el.nativeElement.querySelector('#lostbusinesslanguagesearchDropDown span.btn.btn-default.btn-secondary.form-control.ui-select-toggle').style.borderColor = 'red';
        if (!isValidDetailCode)
            this.el.nativeElement.querySelector('#icabsLostBusinessLangDetail span.btn.btn-default.btn-secondary.form-control.ui-select-toggle').style.borderColor = 'red';


        if (this.riExchange.validateForm(this.uiForm) && isValidReasonCode && isValidReasonCode) {
            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.promptConfirmSave.bind(this)));
        }
    }

    public promptConfirmSave(data: any): void {
        this.queryParams = this.getURLSearchParamObject();
        this.queryParams.set(this.serviceConstants.Action, '2');
        let formData: any = {};
        formData['ActionType'] = this.getControlValue('ActionType');
        formData['EmployeeCode'] = this.getControlValue('EmployeeCode');
        formData['NewAnnualValue'] = this.globalize.parseCurrencyToFixedFormat(this.newAnnualVal);
        formData['LostBusinessRequestNumber'] = this.getControlValue('LostBusinessRequestNumber');
        formData['LastChangeEffectDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('LastChangeEffectDate'));
        formData['LostBusinessCode'] = this.getControlValue('ReasonCode');
        formData['LostBusinessDetailCode'] = this.getControlValue('DetailCode');
        formData['ServiceCoverROWID'] = this.ServiceCoverRowID;
        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formData['ProductCode'] = this.getControlValue('ProductCode');
        formData['ServiceCommenceDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('ServiceCommenceDate'));
        formData['ServiceAnnualValue'] = this.globalize.parseCurrencyToFixedFormat(this.oldAnnualVal);
        formData['ServiceQuantity'] = this.getControlValue('ServiceQuantity');
        formData['ServiceVisitFrequency'] = this.getControlValue('ServiceVisitFrequency');
        formData['ServiceSalesEmployee'] = this.getControlValue('ServiceSalesEmployee');
        formData['SalesEmployeeText'] = this.getControlValue('SalesEmployeeText');
        formData['ServiceBranchNumber'] = this.getControlValue('ServiceBranchNumber');
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, this.queryParams, formData).subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));

                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                    this.setControlValue('Status', e.Status);
                    this.formPristine();
                }
            },
            (error) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
            });
        document.querySelector('#EmployeeCode')['focus']();

    }

    public onEmployeeDataReceived(data: any): void {
        if (data) {
            this.setControlValue('EmployeeCode', data.EmployeeCode);
            this.setControlValue('EmployeeSurname', data.EmployeeSurname);
        }
    }

    public onCommentsReceived(): void {
        this.setControlValue('SalesEmployeeText', this.utils.capitalizeFirstLetter(this.getControlValue('SalesEmployeeText')));
    }

    public onCancel(): void {
        this.setControlValue('EmployeeCode', this.getControlValue('ServiceSalesEmployee'));
        this.uiForm.controls['EmployeeCode'].markAsUntouched();
        this.setControlValue('EmployeeSurname', this.getControlValue('CommissionEmployeeSurname'));
        this.setControlValue('NewAnnualValue', '');
        this.uiForm.controls['NewAnnualValue'].markAsUntouched();
        this.setControlValue('LastChangeEffectDate', '');
        this.uiForm.controls['LastChangeEffectDate'].markAsUntouched();
        this.setControlValue('SalesEmployeeText', '');
        this.setControlValue('ReasonCode', '');
        this.uiForm.controls['ReasonCode'].markAsUntouched();
        this.setControlValue('DetailCode', '');
        this.uiForm.controls['DetailCode'].markAsUntouched();
        this.dropdown.languageSearch.active = {
            id: '',
            text: ''
        };
        this.formPristine();
    }
}

