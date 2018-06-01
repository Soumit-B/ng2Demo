import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { CustomerTypeSearchComponent } from './../../internal/search/iCABSSCustomerTypeSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { CommonDropdownComponent } from './../../../shared/components/common-dropdown/common-dropdown.component';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { SICSearchComponent } from './../../internal/search/iCABSSSICSearch.component';

@Component({
    templateUrl: 'iCABSSCustomerTypeMaintenance.html'
})

export class CustomerTypeMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('marketSegmentSearchDropDown') marketSegmentSearchDropDown: CommonDropdownComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('formCustomerTypeCode') public formCustomerTypeCode;
    @ViewChild('formSICCode') public formSICCode;
    @ViewChild('customerTypeSearchEllipsis') public customerTypeSearchEllipsis: EllipsisComponent;
    private xhrParams: any = {
        operation: 'System/iCABSSCustomerTypeMaintenance',
        module: 'segmentation',
        method: 'ccm/admin'
    };
    private saveClicked: boolean = false;
    //iCABSSMarketSegmentSearch.htm dropdown implementation details
    public marketSegmentSearchColumns: Array<string> = ['MarketSegment.MarketSegmentCode', 'MarketSegment.MarketSegmentDesc'];
    public inputParamsMarketSegmentSearchDropdown: any = {
        operation: 'System/iCABSSMarketSegmentSearch',
        module: 'segmentation',
        method: 'ccm/search'
    };
    public pageId: string = '';
    public isInAddMode: boolean = false;
    public isTriggerValidateProp: boolean = false;
    public isRequiredProp: boolean = false;
    public isDisabledProp: boolean = false;
    public isValidStatusCode: boolean = false;
    public isValidStatusSD: boolean = false;
    public promptTitle: string;
    public isAllowInvoiceLevyInd: boolean = false;
    public isSICDescription: boolean = false;
    public dropdownConfig: any = {
        marketSegmentDropdown: {
            selected: { id: '', text: '' }
        }
    };
    public isReqdSICProperty: boolean = false;
    public isSICDescriptionErr: boolean = false;
    public isMarketSegmentDescErr: boolean = false;
    public isBtnAdd: boolean = true;
    public isBtnSave: boolean = false;
    public isBtnTranslate: boolean = false;
    public isBtnDelete: boolean = false;
    public isBtnCancel: boolean = false;
    public isShowPromptHeader: boolean = true;
    public promptContent: string = MessageConstant.Message.ConfirmRecord;
    public controls = [
        { name: 'CustomerTypeCode', type: MntConst.eTypeCode, required: true, commonValidator: true },
        { name: 'CustomerTypeDesc', type: MntConst.eTypeText, required: true, commonValidator: true },
        { name: 'SicCode', type: MntConst.eTypeCode, commonValidator: true },
        { name: 'SICDescription', type: MntConst.eTypeText },
        { name: 'MarketSegmentCode', type: MntConst.eTypeCode, required: true },
        { name: 'MarketSegmentDesc', type: MntConst.eTypeText },
        { name: 'AllowInvoiceLevyInd', type: MntConst.eTypeCheckBox, required: true },
        { name: 'ActiveInd', type: MntConst.eTypeCheckBox },
        { name: 'InvoiceNarrative', type: MntConst.eTypeTextFree },
        { name: 'ROWID' }
    ];
    public ellipsis: any = {
        customerTypeCodeEllipsis: {
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp-Maint'
            },
            component: CustomerTypeSearchComponent
        },
        sSICSearchEllipsis: {
            showCloseButton: true,
            showHeader: true,
            isDisabled: true,
            childparams: {
                'parentMode': 'LookUp-CustomerType'
            },
            component: SICSearchComponent
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSCUSTOMERTYPEMAINTENANCE;
        this.pageTitle = this.browserTitle = 'Customer Type Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getSysCharDtetails();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.ajaxSubscription) {
            this.ajaxSubscription.unsubscribe();
        }
    }

    // Function getSysCharDtetails: updates variables on page load to true/false depending
    //  upon some static syschar constants, which confirms the behavior of the page
    private getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableZAServiceRecordLevyInvoiceFee,
            this.sysCharConstants.SystemCharShowSICCodeOnPremise
        ];

        let sysCharIP: Object = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };

        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vSCEnableSRL = record[0]['Required'];
            this.pageParams.vSICCodeEnable = record[1]['Required'];
            this.windowOnLoad();
        });
    }

    private windowOnLoad(): void {
        if (this.pageParams.vSCEnableSRL) {
            this.isAllowInvoiceLevyInd = true;
        }
        if (this.pageParams.vSICCodeEnable) {
            this.isSICDescription = true;
            this.isReqdSICProperty = true;
        }
        this.formMode = this.c_s_MODE_UPDATE;
        this.isBtnAdd = true;
        this.isBtnSave = this.isBtnDelete = this.isBtnCancel = this.isBtnTranslate = false;
        if (!this.getControlValue('CustomerTypeCode')) {
            this['uiForm'].disable();
            this.isDisabledProp = true;
        }
        this.disableControl('CustomerTypeCode', false);
        this.formCustomerTypeCode.nativeElement.focus();
    }

    private dolookUCallForDesc(): void {
        let lookupIP: Array<any> = [
            {
                'table': 'MarketSegmentLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'BusinessCode': this.utils.getBusinessCode(),
                    'MarketSegmentCode': this.getControlValue('MarketSegmentCode')
                },
                'fields': ['MarketSegmentDesc']
            }
        ];
        if (this.pageParams.vSICCodeEnable) {
            lookupIP.push({
                'table': 'SICCodeLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'BusinessCode': this.utils.getBusinessCode(),
                    'SICCode': this.getControlValue('SicCode')
                },
                'fields': ['SICDescription']
            });
        }
        this.lookupDetails(lookupIP);
    }

    //LookUp call to populate Desc-SIC and Desc-Market - Start
    private lookupDetails(query: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.setControlValue('SICDescription', data[1] && data[1].length ? data[1][0].SICDescription : '');
            this.setControlValue('MarketSegmentDesc', data[0] && data[0].length ? data[0][0].MarketSegmentDesc : '');
            if (this.formMode !== this.c_s_MODE_ADD && this.getControlValue('MarketSegmentCode')) {
                this.dropdownConfig.marketSegmentDropdown.selected = { id: this.getControlValue('MarketSegmentCode'), text: this.getControlValue('MarketSegmentCode') + ' - ' + this.getControlValue('MarketSegmentDesc') };
            }
            this.isSICDescriptionErr = (this.getControlValue('SicCode') && !this.getControlValue('SICDescription') && this.isSICDescription) ? true : false;
            this.isMarketSegmentDescErr = this.getControlValue('MarketSegmentDesc') ? false : true;
            if (data && this.saveClicked && this.formMode !== 'DELETE' &&
                !this.riExchange.riInputElement.isError(this.uiForm, 'CustomerTypeDesc') && !this.isSICDescriptionErr
                && !this.isMarketSegmentDescErr && this.getControlValue('CustomerTypeCode') &&
                this.getControlValue('CustomerTypeDesc') && this.getControlValue('MarketSegmentCode')) {
                this.isValidStatusSD = false;
                this.isValidStatusCode = false;
                this.promptContent = MessageConstant.Message.ConfirmRecord;
                this.promptModal.show();

            }

        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.isSICDescriptionErr = (this.getControlValue('SicCode') && !this.getControlValue('SICDescription') && this.isSICDescription) ? true : false;
            this.isMarketSegmentDescErr = this.getControlValue('MarketSegmentDesc') ? false : true;
        });
    }
    // LookUp call to populate Desc-SIC and Desc-Market - Ends

    private proceedSave(): void {
        this.dolookUCallForDesc();
    }

    private riMaintenanceAfterDelete(): void {
        let search: any = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '3');
        let postParams: any = {};
        postParams['ROWID'] = this.getControlValue('ROWID');
        postParams['TABLE'] = 'CustomerType';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, postParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data['errorMessage']) {
                    this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
                    this.formMode = this.c_s_MODE_UPDATE;
                    this.isBtnAdd = true;
                    this.isBtnSave = true;
                    this.isBtnDelete = true;
                    this.isBtnCancel = true;
                    this.isBtnTranslate = true;
                    return;
                }
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordDeletedSuccessfully));
                this.formMode = this.c_s_MODE_UPDATE;
                this.isBtnAdd = true;
                this.isBtnSave = false;
                this.isBtnDelete = false;
                this.isBtnCancel = false;
                this.isBtnTranslate = false;
                this.uiForm.reset();
                this.dropdownConfig.marketSegmentDropdown.selected = { id: '', text: '' };
                if (!this.getControlValue('CustomerTypeCode')) {
                    this['uiForm'].disable();
                    this.isDisabledProp = true;
                }
                this.isMarketSegmentDescErr = false;
                this.isRequiredProp = false;
                this.isTriggerValidateProp = false;
                this.isSICDescriptionErr = false;
                this.disableControl('CustomerTypeCode', false);
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage']));
            });
    }

    private saveData(): void {
        let postSearchParams: any = this.getURLSearchParamObject();
        let postParams: any = {};
        if (this.formMode === this.c_s_MODE_ADD) {
            postSearchParams.set(this.serviceConstants.Action, '1');
        }
        else {
            postSearchParams.set(this.serviceConstants.Action, '2');
            postParams['ROWID'] = this.getControlValue('ROWID');

        }
        postParams['TABLE'] = 'CustomerType';
        postParams['CustomerTypeCode'] = this.getControlValue('CustomerTypeCode');
        postParams['CustomerTypeDesc'] = this.getControlValue('CustomerTypeDesc');
        postParams['SicCode'] = this.getControlValue('SicCode');
        postParams['AllowInvoiceLevyInd'] = this.getControlValue('AllowInvoiceLevyInd');
        postParams['ActiveInd'] = this.getControlValue('ActiveInd');
        postParams['InvoiceNarrative'] = this.getControlValue('InvoiceNarrative');
        postParams['MarketSegmentCode'] = this.getControlValue('MarketSegmentCode');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data['fullError']) {
                    this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
                    return;
                }
                else {
                    if (this.getControlValue('CustomerTypeDesc') || (this.getControlValue('SICDescription') && this.isSICDescription)) {
                        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                        this.formMode = this.c_s_MODE_UPDATE;
                        this.isInAddMode = false;
                        this.setControlValue('ROWID', data.ttCustomerType);
                        this.isBtnAdd = true;
                        this.isBtnSave = true;
                        this.isBtnDelete = true;
                        this.isBtnCancel = true;
                        this.isBtnTranslate = true;
                        this.dropdownConfig.marketSegmentDropdown.selected = { id: this.getControlValue('MarketSegmentCode'), text: this.getControlValue('MarketSegmentCode') + ' - ' + this.getControlValue('MarketSegmentDesc') };
                        this.customerTypeSearchEllipsis.updateComponent();
                        this.disableControl('CustomerTypeCode', true);
                        this.saveClicked = false;
                    }
                }
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage']));
            });
    }

    public onCustomerTypeDataReceived(data: any): void {
        if (data) {
            this.setControlValue('CustomerTypeCode', data.CustomerTypeCode);
            this.setControlValue('CustomerTypeDesc', data.CustomerTypeDesc);
            this.formCustomerTypeCode.nativeElement.focus();
            this.isValidStatusCode = !this.getControlValue('ContactTypeCode') ? true : false;
            this.ellipsis.sSICSearchEllipsis.isDisabled = false;
            this.onChangeFetchData();
        }

    }

    public onSicCodeDataReceived(data: any): void {
        if (data) {
            this.setControlValue('SicCode', data.SICCode);
            this.setControlValue('SICDescription', data.SICDescription);
            this.formSICCode.nativeElement.focus();
            this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'SicCode');
        }
    }

    public onClickTranslation(data: any): void {
        alert('iCABSSCustomerTypeLanguage -- page not ready yet');
        // this.navigate('', 'iCABSSCustomerTypeLanguage', {
        //     CustomerTypeCode: this.getControlValue('CustomerTypeCode'),
        //     CustomerTypeDesc: this.getControlValue('CustomerTypeDesc')
        // });
    }

    //Function onChangeFetchData : fetches data when primary key field defocused , puts form in update mode
    public onChangeFetchData(): void {
        this.isValidStatusCode = !this.getControlValue('CustomerTypeCode') ? true : false;
        if (this.getControlValue('CustomerTypeCode') && this.formMode === this.c_s_MODE_UPDATE) {
            let postSearchParams: any = this.getURLSearchParamObject();
            let postParams: any = {};
            postSearchParams.set(this.serviceConstants.Action, '0');
            postSearchParams.set('CustomerTypeCode', this.getControlValue('CustomerTypeCode'));

            this.ajaxSource.next(this.ajaxconstant.START);
            this.ajaxSubscription = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams)
                .subscribe((data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data['errorMessage']) {
                        this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
                        this.uiForm.reset();
                        this['uiForm'].disable();
                        this.disableControl('CustomerTypeCode', false);
                        setTimeout(() => {
                            this.formCustomerTypeCode.nativeElement.focus();
                        }, 0);
                        return;
                    }
                    this.setControlValue('CustomerTypeDesc', data.CustomerTypeDesc);
                    this.setControlValue('SicCode', data.SicCode);
                    this.setControlValue('AllowInvoiceLevyInd', data.AllowInvoiceLevyInd);
                    this.setControlValue('InvoiceNarrative', data.InvoiceNarrative);
                    this.setControlValue('MarketSegmentCode', data.MarketSegmentCode);
                    this.setControlValue('ActiveInd', data.ActiveInd);
                    this.setControlValue('ROWID', data.ttCustomerType);
                    this.isSICDescriptionErr = (this.getControlValue('SicCode') && !this.getControlValue('SICDescription') && this.isSICDescription) ? true : false;
                    this['uiForm'].enable();
                    this.isDisabledProp = false;
                    this.disableControl('SICDescription', true);
                    this.isBtnAdd = true;
                    this.isBtnSave = true;
                    this.isBtnDelete = true;
                    this.isBtnCancel = true;
                    this.isBtnTranslate = true;
                    this.formMode = this.c_s_MODE_UPDATE;
                    this.ellipsis.sSICSearchEllipsis.isDisabled = false;
                    this.dolookUCallForDesc();
                    this.disableControl('CustomerTypeCode', true);
                }, (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage']));
                });
        }
    }

    //Function addMode : when button 'Add' clicked , puts form in add mode
    public addMode(): void {
        this.saveClicked = false;
        this.isInAddMode = true;
        this['uiForm'].enable();
        this.isDisabledProp = false;
        this.uiForm.reset();
        this.dropdownConfig.marketSegmentDropdown.selected = { id: '', text: '' };
        this.formMode = this.c_s_MODE_ADD;
        this.isBtnAdd = false;
        this.isBtnSave = true;
        this.isBtnDelete = false;
        this.isBtnCancel = true;
        this.isBtnTranslate = false;
        this.isSICDescriptionErr = false;
        this.isMarketSegmentDescErr = false;
        this.disableControl('SICDescription', true);
        setTimeout(() => {
            this.formCustomerTypeCode.nativeElement.focus();
        }, 0);
        this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'CustomerTypeCode');
    }

    //Function onSave : when button 'Save' clicked , saves data in add/update mode
    public onSave(): void {
        this.saveClicked = true;
        this.isValidStatusCode = !this.getControlValue('CustomerTypeCode') ? true : false;
        this.isValidStatusSD = !this.getControlValue('CustomerTypeDesc') ? true : false;
        this.isSICDescriptionErr = (!this.getControlValue('SicCode') && this.isReqdSICProperty) ? true : false;
        this.isMarketSegmentDescErr = !this.getControlValue('MarketSegmentCode') ? true : false;
        this.isRequiredProp = !this.getControlValue('MarketSegmentCode') ? true : false;
        this.isTriggerValidateProp = !this.getControlValue('MarketSegmentCode') ? true : false;
        if (!this.isValidStatusCode && !this.isSICDescriptionErr && !this.isMarketSegmentDescErr
            && !this.isTriggerValidateProp && !this.riExchange.riInputElement.isError(this.uiForm, 'CustomerTypeDesc')) {
            this.proceedSave();
        }
    }

    public onBlurSIC(): void {
        this.isSICDescriptionErr = (!this.getControlValue('SicCode') && this.isSICDescription && this.isReqdSICProperty) ? true : false;
    }

    public onBlurMSC(): void {
        this.isMarketSegmentDescErr = (!this.getControlValue('MarketSegmentCode')) ? true : false;
        this.isTriggerValidateProp = this.isRequiredProp = this.isMarketSegmentDescErr ? true : false;
    }

    public onDelete(): void {
        this.saveClicked = false;
        this.promptContent = MessageConstant.Message.DeleteRecord;
        this.promptModal.show();
        this.formMode = 'DELETE';
    }

    public confirmed(): void {
        if (this.formMode === 'DELETE') {
            this.riMaintenanceAfterDelete();
        }
        else {
            if (!this.isSICDescriptionErr && !this.isMarketSegmentDescErr &&
                this.getControlValue('CustomerTypeCode') && this.getControlValue('CustomerTypeDesc')
                && this.getControlValue('MarketSegmentCode')) {
                this.saveData();
            }
        }
    }


    // Function onCancel : on clicking 'Cancel' buttons , fetches previous records, discards changes that has not been saved
    public onCancel(): void {
        this.saveClicked = false;
        if (this.formMode === this.c_s_MODE_ADD) {
            this.uiForm.reset();
            this.isInAddMode = true;
            this.dropdownConfig.marketSegmentDropdown.selected = { id: '', text: '' };
            this.isBtnAdd = true;
            this.isBtnSave = false;
            this.isBtnDelete = false;
            this.isBtnCancel = false;
            this.isBtnTranslate = false;
            this.formMode = this.c_s_MODE_UPDATE;
            this.isValidStatusSD = false;
            if (!this.getControlValue('CustomerTypeCode')) {
                this['uiForm'].disable();
                this.isDisabledProp = true;
            }
            this.isRequiredProp = false;
            this.isTriggerValidateProp = false;
            this.isSICDescriptionErr = false;
            this.disableControl('CustomerTypeCode', false);
            this.formCustomerTypeCode.nativeElement.focus();
            this.onChangeFetchData();

        }
        if (this.formMode === this.c_s_MODE_UPDATE) {
            this.isInAddMode = false;
            this.onChangeFetchData();
        }
    }

    public onDropdownDataRecieved(event: any): void {
        this.setControlValue('MarketSegmentCode', event['MarketSegment.MarketSegmentCode']);
        this.setControlValue('MarketSegmentDesc', event['MarketSegment.MarketSegmentDesc']);
        if (this.getControlValue('MarketSegmentCode')) {
            this.isRequiredProp = false;
            this.isTriggerValidateProp = false;
            this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'MarketSegmentCode');
        }
    }



}
