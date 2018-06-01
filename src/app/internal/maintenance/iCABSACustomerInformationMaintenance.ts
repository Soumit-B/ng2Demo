import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { ScreenNotReadyComponent } from '../../../shared/components/screenNotReady';

@Component({
    templateUrl: 'iCABSACustomerInformationMaintenance.html',
    styles: [`

      textarea {
        min-height: 200px;
      }

  `]
})

export class CustomerInformationMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public pageId: string = '';
    public promptTitle: string = '';
    public promptContent: string = '';
    public showMessageHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public showHeader: boolean = true;
    public requestParams: any = {
        operation: 'Application/iCABSACustomerInformationMaintenance',
        module: 'customer',
        method: 'contract-management/maintenance'
    };
    public queryParams: any;
    public search: URLSearchParams = new URLSearchParams();
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public querySysChar: URLSearchParams = new URLSearchParams();
    public controls = [{
            name: 'GroupAccountNumber',
            readonly: false,
            disabled: true,
            required: false
        }, {
            name: 'GroupName',
            readonly: false,
            disabled: true,
            required: false
        }, {
            name: 'AccountNumber',
            readonly: false,
            disabled: true,
            required: false
        }, {
            name: 'AccountName',
            readonly: false,
            disabled: true,
            required: false
        }, {
            name: 'ContractNumber',
            readonly: false,
            disabled: true,
            required: false
        }, {
            name: 'ContractName',
            readonly: false,
            disabled: true,
            required: false
        }, {
            name: 'CustomerInfoNumber',
            readonly: false,
            disabled: true,
            required: false
        }, {
            name: 'BranchNumber',
            readonly: false,
            disabled: true,
            required: false
        }, {
            name: 'CustomerInfoName',
            readonly: false,
            disabled: true,
            required: false
        }, {
            name: 'ContractInfo',
            readonly: false,
            disabled: false,
            required: false
        }, {
            name: 'ContractPrices',
            readonly: false,
            disabled: false,
            required: false
        }, {
            name: 'JobInfo',
            readonly: false,
            disabled: false,
            required: false
        }, {
            name: 'JobPrices',
            readonly: false,
            disabled: false,
            required: false
        }, {
            name: 'ProductSalesInfo',
            readonly: false,
            disabled: false,
            required: false
        }, {
            name: 'ProductSalesPrices',
            readonly: false,
            disabled: false,
            required: false
        }, {
            name: 'EntitlementInfo',
            readonly: false,
            disabled: false,
            required: false
        }, {
            name: 'EntitlementPrice',
            readonly: false,
            disabled: false,
            required: false
        }, {
            name: 'ServiceInfo',
            readonly: false,
            disabled: false,
            required: false
        }, {
            name: 'OtherInfo',
            readonly: false,
            disabled: false,
            required: false
        }, {
            name: 'ConfidentialInfo',
            readonly: false,
            disabled: false,
            required: false
        }, {
            name: 'Save',
            readonly: false,
            disabled: false,
            required: false
        }, {
            name: 'Cancel',
            readonly: false,
            disabled: false,
            required: false
        }

    ];
    public fieldVisibility: any = {

    };
    public dropdownList: any = {

    };
    public fieldRequired: any = {
        CustomerInfoNumber: false

    };
    public syschars: any = {

    };
    public otherVariables: any = {
        Mode: '',
        CallingProg: '',
        InfoLevel: '',
        FunctionUpdate: true,
        CustomerInformationDetailROWID: ''

    };

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public uiDisplay: any = {
        tab: {
            tab1: {
                visible: true,
                active: true,
                error: false,
                highlight: false
            },
            tab2: {
                visible: true,
                active: false,
                error: false,
                highlight: false
            },
            tab3: {
                visible: true,
                active: false,
                error: false,
                highlight: false
            },
            tab4: {
                visible: true,
                active: false,
                error: false,
                highlight: false
            },
            tab5: {
                visible: true,
                active: false,
                error: false,
                highlight: false
            },
            tab6: {
                visible: true,
                active: false,
                error: false,
                highlight: false
            },
            tab7: {
                visible: true,
                active: false,
                error: false,
                highlight: false
            }
        }
    };
    public showCloseButton: boolean = true;
    public formRawClone: any = {};

    constructor(injector: Injector, private titleService: Title) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACUSTOMERINFORMATIONMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Customer Information Maintenance';
        this.utils.setTitle('Customer Information Maintenance');
        this.queryParams = this.riExchange.getRouterParams();
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
        this.setControlValue('AccountName', this.riExchange.getParentHTMLValue('AccountName'));
        this.setControlValue('GroupAccountNumber', this.riExchange.getParentHTMLValue('GroupAccountNumber'));
        this.setControlValue('GroupName', this.riExchange.getParentHTMLValue('GroupName'));
        this.setControlValue('CustomerInfoNumber', this.riExchange.getParentHTMLValue('CustomerInfoNumber'));
        //this.setControlValue('CustomerInfoName', this.riExchange.getParentHTMLValue('CustomerInfoName'));
        this.otherVariables['Mode'] = this.riExchange.getParentHTMLValue('Mode');
        this.otherVariables['CallingProg'] = this.riExchange.getParentHTMLValue('CallingProg');
        this.otherVariables['InfoLevel'] = this.riExchange.getParentHTMLValue('InfoLevel');
        if (this.otherVariables['CallingProg'] === 'ServiceCover' || (this.otherVariables['CallingProg'] === 'GroupAccount' && this.otherVariables['InfoLevel'] !== 'GroupAccount') || (this.otherVariables['CallingProg'] === 'Account' && this.otherVariables['InfoLevel'] !== 'Account') || (this.otherVariables['CallingProg'] === 'Contract' && this.otherVariables['InfoLevel'] !== 'Contract')) {
            this.otherVariables['FunctionUpdate'] = false;
        }
        if (this.parentMode.toUpperCase() === 'NEW' || this.parentMode.toUpperCase() === 'UPDATE') {
            this.otherVariables['FunctionUpdate'] = true;
        }
        if (this.otherVariables['CallingProg'] === 'CustomerInfoMaint') {
            this.otherVariables['FunctionUpdate'] = true;
        }
        /*if (this.getControlValue('BranchNumber') === this.utils.getBranchCode() || this.getControlValue('BranchNumber') === '0') {
            this.otherVariables['FunctionUpdate'] = true;
        } else {
            this.otherVariables['FunctionUpdate'] = false;
            this.uiForm.disable();
        }*/
        if (this.otherVariables['CallingProg'] === 'GroupAccount') {
            this.setControlValue('CustomerInfoName', this.riExchange.getParentHTMLValue('GroupName'));
        }
        if (this.getControlValue('CustomerInfoName') === '' || this.getControlValue('CustomerInfoName') === null) {
            this.setControlValue('CustomerInfoName', this.riExchange.getParentHTMLValue('AccountName'));
        }
        if (this.parentMode.toUpperCase() === 'NEW' && (this.getControlValue('BranchNumber') === '0' || this.getControlValue('BranchNumber') === '')) {
            this.setControlValue('BranchNumber', this.utils.getBranchCode());
        }
        setTimeout(() => {
            let elem = document.querySelector('#ContractInfo');
            if (elem) {
                elem['focus']();
            }
        }, 0);
        this.fetchTranslationContent();
        this.setMessageCallback(this);
        this.setErrorCallback(this);
        this.postInit();
        this.formPristine();
        //this.routeAwayGlobals.setDirtyFlag(true);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public showMessageModal(data: any): void {
        this.errorModal.show(data, false);
    }

    public renderTab(tabindex: number): void {
        switch (tabindex) {
            case 1:
                this.uiDisplay.tab.tab1.active = true;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 2:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = true;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 3:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = true;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 4:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = true;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 5:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = true;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 6:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = true;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 7:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = true;
                break;

        }

    }

    public onCancel(event: any): void {
        this.uiForm.setValue(this.formRawClone);
        this.fetchTranslationContent();
        if (this.parentMode.toUpperCase() === 'NEW') {
            this.uiForm.disable();
            this.setControlValue('CustomerInfoNumber', '');
            this.setControlValue('CustomerInfoName', '');
            this.setControlValue('BranchNumber', '');
            this.otherVariables['FunctionUpdate'] = false;
        }
        this.formPristine();
    }

    public onSaveKey(e: any): void {
        let code = (e.keyCode ? e.keyCode : e.which);
        let elemList = document.querySelectorAll('#tabCont .nav-tabs li:not(.hidden) a');
        let currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('#tabCont .nav-tabs li:not(.hidden) a.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            elemList[currentSelectedIndex + 1]['click']();
            setTimeout(() => {
                let elem = document.querySelector('#tabCont .tab-content .tab-pane.active .ui-select-toggle, #tabCont .tab-content .tab-pane.active input:not([disabled]), #tabCont .tab-content .tab-pane.active select:not([disabled]), #tabCont .tab-content .tab-pane.active textarea:not([disabled])');
                if (elem) {
                    elem['focus']();
                }
            }, 0);
        }
        return;
    }

    public onSave(event: any): void {
        let obj = {};
        let action = 0;
        if (this.parentMode.toUpperCase() === 'NEW') {
            obj = {
                ContractNumber: this.getControlValue('ContractNumber'),
                AccountNumber: this.getControlValue('AccountNumber'),
                GroupAccountNumber: this.getControlValue('GroupAccountNumber'),
                CallingProg: this.otherVariables['CallingProg'],
                Mode: this.otherVariables['Mode']
            };
            action = 1;
        } else {
            obj = {
                CustomerInformationDetailROWID: this.otherVariables['CustomerInformationDetailROWID']
            };
            action = 2;
        }
        this.fetchCustomerInformationPost('', {
            action: action
        }, Object.assign({}, obj, {
            CustomerInfoNumber: this.getControlValue('CustomerInfoNumber'),
            BranchNumber: this.getControlValue('BranchNumber'),
            CustomerInfoName: this.getControlValue('CustomerInfoName'),
            ContractInfo: this.getControlValue('ContractInfo'),
            ContractPrices: this.getControlValue('ContractPrices'),
            JobInfo: this.getControlValue('JobInfo'),
            JobPrices: this.getControlValue('JobPrices'),
            ProductSalesInfo: this.getControlValue('ProductSalesInfo'),
            ProductSalesPrices: this.getControlValue('ProductSalesPrices'),
            EntitlementInfo: this.getControlValue('EntitlementInfo'),
            EntitlementPrice: this.getControlValue('EntitlementPrice'),
            ServiceInfo: this.getControlValue('ServiceInfo'),
            OtherInfo: this.getControlValue('OtherInfo'),
            ConfidentialInfo: this.getControlValue('ConfidentialInfo')
        })).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (data['errorMessage']) {
                    this.errorService.emitError(data);
                } else {
                    if (this.parentMode.toUpperCase() === 'NEW') {
                        this.setControlValue('CustomerInfoNumber', data['CustomerInfoNumber']);
                        this.otherVariables['FunctionUpdate'] = false;
                        this.uiForm.disable();
                    }
                    this.showMessageModal({
                        msg: MessageConstant.Message.RecordSavedSuccessfully,
                        title: 'Message'
                    });
                    this.cloneForm();
                    this.afterSave();
                    this.formPristine();
                }
            }
        });
    }

    public afterSave(): void {
        this.highlightTabs();
        /*this.fetchCustomerInformationPost('', {
            action: 2
        }, {
            ContractNumber: this.getControlValue('ContractNumber'),
            AccountNumber: this.getControlValue('AccountNumber'),
            GroupAccountNumber: this.getControlValue('GroupAccountNumber'),
            CallingProg: this.otherVariables['CallingProg'],
            Mode: this.otherVariables['Mode']
        }).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (data['errorMessage']) {
                    this.errorService.emitError(data);
                } else {
                    // statement
                }
            }
        });*/
    }

    public promptSave(event: any): void {
        // statement
    }

    public toTitleCase(control: any): void {
        this.setControlValue(control, this.utils.toTitleCase(this.getControlValue(control)));
    }

    public fetchCustomerLookUp(): void {
        let data = [{
            'table': 'CustomerInformationDetail',
            'query': {
                'CustomerInfoNumber': this.getControlValue('CustomerInfoNumber'),
                'BusinessCode': this.utils.getBusinessCode()
            },
            'fields': ['BranchNumber', 'CustomerInfoName', 'ContractInfo', 'ContractPrices', 'JobInfo', 'JobPrices', 'ProductSalesInfo', 'ProductSalesPrices', 'EntitlementInfo', 'EntitlementPrice', 'ServiceInfo', 'OtherInfo', 'ConfidentialInfo']
        },
        {
            'table': 'Account',
            'query': {
                'AccountNumber': this.getControlValue('AccountNumber'),
                'BusinessCode': this.utils.getBusinessCode()
            },
            'fields': ['AccountName']
        }];

        this.lookUpRecord(data, 100).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0 && this.getControlValue('CustomerInfoNumber') !== '') {
                        this.setControlValue('BranchNumber', e['results'][0][0].BranchNumber);
                        this.setControlValue('CustomerInfoName', e['results'][0][0].CustomerInfoName);
                        this.setControlValue('ContractInfo', e['results'][0][0].ContractInfo);
                        this.setControlValue('ContractPrices', e['results'][0][0].ContractPrices);
                        this.setControlValue('JobInfo', e['results'][0][0].JobInfo);
                        this.setControlValue('JobPrices', e['results'][0][0].JobPrices);
                        this.setControlValue('ProductSalesInfo', e['results'][0][0].ProductSalesInfo);
                        this.setControlValue('ProductSalesPrices', e['results'][0][0].ProductSalesPrices);
                        this.setControlValue('EntitlementInfo', e['results'][0][0].EntitlementInfo);
                        this.setControlValue('EntitlementPrice', e['results'][0][0].EntitlementPrice);
                        this.setControlValue('ServiceInfo', e['results'][0][0].ServiceInfo);
                        this.setControlValue('OtherInfo', e['results'][0][0].OtherInfo);
                        this.setControlValue('ConfidentialInfo', e['results'][0][0].ConfidentialInfo);
                        this.otherVariables['CustomerInformationDetailROWID'] = e['results'][0][0].ttCustomerInformationDetail;
                        this.highlightTabs();
                        if (String(this.getControlValue('BranchNumber')) === String(this.utils.getBranchCode()) || this.getControlValue('BranchNumber') === '0') {
                            this.otherVariables['FunctionUpdate'] = true;
                        } else {
                            this.otherVariables['FunctionUpdate'] = false;
                            this.uiForm.disable();
                            this.formPristine();
                        }
                    }
                    if (e['results'][1].length > 0) {
                        this.setControlValue('AccountName', e['results'][1][0].AccountName);
                        if (this.parentMode.toUpperCase() === 'NEW' && (this.getControlValue('CustomerInfoName') === '' || this.getControlValue('CustomerInfoName') === null)) {
                            this.setControlValue('CustomerInfoName', e['results'][1][0].AccountName);
                        }
                    }
                    this.cloneForm();
                } else {
                    // statement
                }
            }, (error) => {
                // error statement
            });
    }

    private postInit(): void {
        this.buildTabs();
        this.highlightTabs();
        this.cloneForm();
        if (this.parentMode.toUpperCase() === 'NEW') {
            this.fieldRequired['CustomerInfoNumber'] = false;
        } else {
            this.fieldRequired['CustomerInfoNumber'] = true;
        }
        this.fetchCustomerLookUp();

    }

    private cloneForm(): void {
        this.formRawClone = this.uiForm.getRawValue();
        for (let i in this.uiForm.controls) {
            if (this.uiForm.controls.hasOwnProperty(i) && (this.uiForm.controls[i].value === undefined || this.uiForm.controls[i].value === null)) {
                this.uiForm.controls[i].setValue('');
                this.formRawClone[i] = '';
            }
        }
    }

    private buildTabs(): void {
        if (String(this.getControlValue('BranchNumber')) === String(this.utils.getBranchCode()) || this.getControlValue('BranchNumber') === '0' || this.getControlValue('BranchNumber') === '') {
            this.uiDisplay.tab.tab7.visible = true;
        } else {
            this.uiDisplay.tab.tab7.visible = false;
        }
    }

    private highlightTabs(): void {
        this.clearHighlights();
        if (this.getControlValue('ContractInfo') !== '' || this.getControlValue('ContractPrices') !== '') {
            this.uiDisplay.tab.tab1.highlight = true;
        }
        if (this.getControlValue('JobInfo') !== '' || this.getControlValue('JobPrices') !== '') {
            this.uiDisplay.tab.tab2.highlight = true;
        }
        if (this.getControlValue('ProductSalesInfo') !== '' || this.getControlValue('ProductSalesPrices') !== '') {
            this.uiDisplay.tab.tab3.highlight = true;
        }
        if (this.getControlValue('EntitlementInfo') !== '' || this.getControlValue('EntitlementPrice') !== '') {
            this.uiDisplay.tab.tab4.highlight = true;
        }
        if (this.getControlValue('ServiceInfo') !== '') {
            this.uiDisplay.tab.tab5.highlight = true;
        }
        if (this.getControlValue('OtherInfo') !== '') {
            this.uiDisplay.tab.tab6.highlight = true;
        }
        if (String(this.getControlValue('BranchNumber')) === String(this.utils.getBranchCode()) || this.getControlValue('BranchNumber') === '0' || this.getControlValue('BranchNumber') === '') {
            if (this.getControlValue('ConfidentialInfo') !== '') {
                this.uiDisplay.tab.tab7.highlight = true;
            }
        }
    }

    private clearHighlights(): void {
        this.uiDisplay.tab.tab1.highlight = false;
        this.uiDisplay.tab.tab2.highlight = false;
        this.uiDisplay.tab.tab3.highlight = false;
        this.uiDisplay.tab.tab4.highlight = false;
        this.uiDisplay.tab.tab5.highlight = false;
        this.uiDisplay.tab.tab6.highlight = false;
        this.uiDisplay.tab.tab7.highlight = false;
    }

    private fetchCustomerInformationGet(functionName: string, params: Object): any {
        let queryCustomer = new URLSearchParams();
        queryCustomer.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryCustomer.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            queryCustomer.set(this.serviceConstants.Action, '6');
            queryCustomer.set('Function', functionName);
        }
        for (let key in params) {
            if (key) {
                queryCustomer.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.requestParams.method, this.requestParams.module, this.requestParams.operation, queryCustomer);
    }

    private fetchCustomerInformationPost(functionName: string, params: Object, formData: Object): any {
        let queryCustomer = new URLSearchParams();
        queryCustomer.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryCustomer.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            queryCustomer.set(this.serviceConstants.Action, '6');
            formData['Function'] = functionName;
        }
        for (let key in params) {
            if (key) {
                queryCustomer.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.requestParams.method, this.requestParams.module, this.requestParams.operation, queryCustomer, formData);
    }

    private lookUpRecord(data: Object, maxresults: number): any {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }

    private fetchTranslationContent(): void {
        this.getTranslatedValue('Save', null).subscribe((res: string) => {
            if (res) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'Save', res);
            }
        });
        this.getTranslatedValue('Cancel', null).subscribe((res: string) => {
            if (res) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'Cancel', res);
            }
        });
    }
}

// http://localhost:3000/#/maintenance/customerinformation?parentMode=New&AccountNumber=000236735&AccountName=TheBaxter&ContractNumber=00054175&ContractName=J&SPenkin=&CustomerInfoName=TheBaxter&CallingProg=Contract&Mode=New&InfoLevel=Contract
// http://localhost:3000/#/maintenance/customerinformation?parentMode=Update&CustomerInfoNumber=1&AccountNumber=005008488&AccountName=J Du Preez&ContractNumber=00142388&ContractName=J Du Preez
// Branch 21/ZA D http://localhost:3000/#/maintenance/customerinformation?parentMode=New&AccountNumber=005008488&AccountName=J Du Preez&ContractNumber=00142388&ContractName=J Du Preez&CustomerInfoName=J Du Preez&CallingProg=Contract&Mode=New&InfoLevel=Contract
// 69529
