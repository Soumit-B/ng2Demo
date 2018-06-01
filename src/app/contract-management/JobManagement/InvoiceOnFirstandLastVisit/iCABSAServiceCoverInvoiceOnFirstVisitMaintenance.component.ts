import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import * as moment from 'moment';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { Subscription } from 'rxjs/Subscription';
import { ActionTypes } from '../../../actions/account';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { ContractSearchComponent } from '../../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from '../../../internal/search/iCABSAServiceCoverSearch';
import { MessageConstant } from './../../../../shared/constants/message.constant';

@Component({
    templateUrl: 'iCABSAServiceCoverInvoiceOnFirstVisitMaintenance.html'
})

export class ServiceCoverFirstVisitComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('contractNumber') contractNumber;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('ContractSearchComponent') ContractSearchComponent;
    @ViewChild('premisesNumberEllipsis') premisesNumberEllipsis: EllipsisComponent;
    @ViewChild('productcodeEllipsis') productcodeEllipsis: EllipsisComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', type: MntConst.eTypeCode},
        { name: 'ContractName', type: MntConst.eTypeText},
        { name: 'status', type: MntConst.eTypeText },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc', type: MntConst.eTypeText },
        { name: 'ServiceVisitFrequency', type: MntConst.eTypeInteger },
        { name: 'ServiceAnnualValue', type: MntConst.eTypeCurrency },
        { name: 'ServiceQuantity', type: MntConst.eTypeInteger },
        { name: 'InvoiceOnFirstVisitInd', type: MntConst.eTypeCheckBox }
    ];
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public isRequesting: boolean = false;
    public invoiceOnFirstVisitIndStatus: boolean;
    public lookUpSubscription: Subscription;
    public isSaveEnabled: boolean = false;
    public promptTitle: String = MessageConstant.Message.ConfirmRecord;
    public showMessageHeader: boolean = true;
    public dateObjectsEnabled: Object = {
        contractCommenceDate: false,
        annivDate: false
    };
    public fieldRequired: any = {
        contractCommenceDate: true,
        annivDate: true
    };
    public contractCommenceDate: Date;
    public contractSearchComponent = ContractSearchComponent;
    // inputParams for SearchComponent Ellipsis
    public ellipsis = {
        contractSearch: {
            disabled: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'Search',
                currentContractType: 'J',
                currentContractTypeURLParameter: 'Job',
                showAddNew: false,
                contractNumber: ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            showHeader: true,
            showAddNew: false,
            autoOpenSearch: false,
            setFocus: false,
            component: ContractSearchComponent
        },
        premiseSearch: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Search',
                'ContractNumber': '',
                'ContractName': '',
                'currentContractType': 'J',
                'currentContractTypeURLParameter': 'Job',
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: PremiseSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        serviceCoverSearch: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Search',
                'ContractNumber': '',
                'ContractName': '',
                'PremiseNumber': '',
                'PremiseName': '',
                'currentContractType': 'J',
                'currentContractTypeURLParameter': 'Job',
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ServiceCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };
    public promptContent = '';
    public isSaveDisabled: boolean = true;
    public isCancelDisabled: boolean = true;
    public commenceDate: string = '';

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERINVOICEONFIRSTVISITMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        let title = 'Service Cover Invoice On First/Last Visit Maintenance';
        this.pageParams.currentContractType = 'J';
        this.pageParams.currentContractTypeURLParameter = 'Job';
        this.getTranslatedValue(title, null).subscribe((res: string) => {
            if (res) {
                title = /*this.pageParams.currentContractTypeURLParameter + ' ' +*/ res;
            }
            this.pageTitle = title;
        });
        this.getTranslatedValue(this.pageParams.currentContractTypeURLParameter, null).subscribe((res: string) => {
            if (res) {
                console.log(res);
                this.pageParams.currentContractTypeURLParameter = res;
            }
        });
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.window_onload();
    }
    ngAfterViewInit(): void {
        this.ellipsis.contractSearch.autoOpenSearch = true;
    }
    public window_onload(): void {
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceVisitFrequency');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceAnnualValue');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceQuantity');
        this.riExchange.riInputElement.Disable(this.uiForm, 'status');
        this.riExchange.riInputElement.Disable(this.uiForm, 'invoiceOnFirstVisitIndStatus');
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public contractNumberOnChange(obj: any): void {
        this.setFormMode(this.c_s_MODE_SELECT);
        if (obj.value !== '') {
            this.setControlValue('ContractNumber', this.utils.numberPadding(obj.value, 8));
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = '';
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = '';
        this.ellipsis.premiseSearch.childConfigParams.ContractNumber = '';
        this.ellipsis.premiseSearch.childConfigParams.ContractName = '';
        this.clearData();
        this.callLookupData('Contract');
    }

    public premiseNumberOnChange(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = '';
        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = '';
        this.clearData();
        if (/^[0-9]+$/.test(this.getControlValue('PremiseNumber'))) {
            this.callLookupData('Premise');
        }
    }

    public productCodeOnChange(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.uiForm.controls['ProductCode'].value.toUpperCase());
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
        this.clearData();
        this.callLookupData('Product');
    }

    public contractNumberOnKeyDown(event: any): void {
        if (event.keyCode === 34) {
            this.ellipsis.contractSearch.autoOpenSearch = true;
        }
    }

    public premiseNumberOnKeyDown(event: any): void {
        if (event.keyCode === 34) {
            this.ellipsis.premiseSearch.autoOpenSearch = true;
        }
    }

    public productCodeOnKeyDown(event: any): void {
        if (event.keyCode === 34) {
            this.ellipsis.serviceCoverSearch.autoOpenSearch = true;
        }
    }
    // Get formData from LookUp API Call
    public callLookupData(type: string): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.riExchange.riInputElement.Disable(this.uiForm, 'invoiceOnFirstVisitIndStatus');
        this.isSaveEnabled = false;
        let lookupIP = [];
        if (type === 'Contract') {
            lookupIP = [
                {
                    'table': 'Contract',
                    'query': {
                        'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        'BusinessCode': this.businessCode
                    },
                    'fields': ['ContractNumber', 'ContractName']
                }
            ];
        } else if (type === 'Premise') {
            lookupIP = [
                {
                    'table': 'Premise',
                    'query': {
                        'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        'BusinessCode': this.businessCode,
                        'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                    },
                    'fields': ['PremiseNumber', 'PremiseName']
                }
            ];
        } else if (type === 'Product') {
            lookupIP = [
                {
                    'table': 'Product',
                    'query': {
                        'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                        'BusinessCode': this.businessCode
                    },
                    'fields': ['ProductCode', 'ProductDesc']
                }
            ];
        }

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            /*if (data[0][0] && data[0][0].ContractName) {
                this.formData.ContractName = data[0][0].ContractName;
                this.formData.ContractNumber = data[0][0].ContractNumber;
            }
            if (data[1][0] && data[1][0].PremiseName) {
                this.formData.PremiseNumber = data[1][0].PremiseNumber;
                this.formData.PremiseName = data[1][0].PremiseName;
            }
            if (data[2][0] && data[2][0].ProductDesc) {
                this.formData.ProductCode = data[2][0].ProductCode;
                this.formData.ProductDesc = data[2][0].ProductDesc;
            }*/
            if (data[0].length > 0) {
                if (type === 'Contract') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data[0][0].ContractName);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
                    this.clearData();
                    this.ellipsis.premiseSearch.childConfigParams.ContractNumber = data[0][0].ContractNumber;
                    this.ellipsis.premiseSearch.childConfigParams.ContractName = data[0][0].ContractName;
                    this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = data[0][0].ContractNumber;
                    this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = data[0][0].ContractName;
                } else if (type === 'Premise') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data[0][0].PremiseName);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
                    this.clearData();
                    this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
                    this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = data[0][0].PremiseNumber;
                    this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = this.getControlValue('ContractName');
                    this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = data[0][0].PremiseName;
                } else if (type === 'Product') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data[0][0].ProductDesc);
                    this.clearData();
                    this.fetchAllDetails();
                }
            } else {
                if (type === 'Contract') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
                    this.clearData();
                    this.ellipsis.premiseSearch.childConfigParams.ContractNumber = '';
                    this.ellipsis.premiseSearch.childConfigParams.ContractName = '';
                    this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = '';
                    this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = '';
                } else if (type === 'Premise') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
                    this.clearData();
                    this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = '';
                    this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = '';
                    this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = '';
                    this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = '';
                } else if (type === 'Product') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                    this.clearData();
                    this.fetchAllDetails();
                }
            }
            //this.setActiveParams();
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    }

    public setActiveParams(): void {
        this.clearData();
        if (this.formData.ContractName && this.formData.ContractNumber) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.formData.ContractNumber);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.formData.ContractName);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
            this.ellipsis.premiseSearch.childConfigParams.ContractNumber = this.formData.ContractNumber;
            this.ellipsis.premiseSearch.childConfigParams.ContractName = this.formData.ContractName;
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = this.formData.ContractNumber;
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = this.formData.ContractName;
            this.fetchAllDetails();
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = '';
            this.ellipsis.premiseSearch.childConfigParams.ContractNumber = '';
            this.ellipsis.premiseSearch.childConfigParams.ContractName = '';
        }
        if (this.formData.PremiseName && this.formData.PremiseNumber) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.formData.PremiseName);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.formData.PremiseNumber);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = this.formData.PremiseNumber;
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = this.getControlValue('ContractName');
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = this.formData.PremiseName;
            this.fetchAllDetails();
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = '';
        }
        if (this.formData.ProductDesc && this.formData.ProductCode) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.formData.ProductDesc);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.formData.ProductCode);
            this.fetchAllDetails();
        }
    }

    // On contract number ellipsis data return
    public onContractDataReceived(data: any): void {
        this.setFormMode(this.c_s_MODE_UPDATE);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
        //Setting other fields to null
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
        this.clearData();
        //Diable/Enable fields
        this.ellipsis.premiseSearch.childConfigParams.ContractNumber = data.ContractNumber;
        this.ellipsis.premiseSearch.childConfigParams.ContractName = data.ContractName;
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = data.ContractNumber;
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = data.ContractName;
        //this.fetchAllDetails();
    }
    // On premise number ellipsis data return
    public onPremiseDataReceived(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
        //Setting other fields to null
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
        this.clearData();
        //Diable/Enable fields
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = data.PremiseNumber;
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = data.PremiseName;
        //this.fetchAllDetails();
    }

    // On product number ellipsis data return
    public onProductDataReceived(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.row.ProductCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.row.ProductDesc);
        this.clearData();
        //Diable/Enable fields
        this.fetchAllDetails();
    }

    public disableButtons(disable: boolean): void {
        this.isSaveDisabled = disable;
        this.isCancelDisabled = disable;
    }

    //Fetch All Details
    public fetchAllDetails(): void {
        let queryParams: any = {
            operation: 'Application/iCABSAServiceCoverInvoiceOnFirstVisitMaintenance',
            module: 'invoicing',
            method: 'bill-to-cash/maintenance'
        };
        let searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        searchParams.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        searchParams.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        searchParams.set('ContractTypeCode', this.pageParams.currentContractType);
        if (this.getControlValue('ContractNumber') && this.getControlValue('PremiseNumber') && this.getControlValue('ProductCode')) {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(queryParams.method, queryParams.module,
                queryParams.operation, searchParams)
                .subscribe(
                (data) => {
                    if (data.errorMessage || data.errorNumber === 0) {
                        if (data.errorMessage) {
                            this.errorModal.show(data, true);
                        } else {
                            //
                        }
                    } else {
                        let invoiceOnFirstVisitInd = data.InvoiceOnFirstVisitInd === 'no' ? false : true;
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceOnFirstVisitInd', invoiceOnFirstVisitInd);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PortfolioStatusCode', data.PortfolioStatusCode); //Field not found
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceQuantity', data.ServiceQuantity);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', data.ServiceVisitFrequency);
                        // this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceAnnualValue', this.utils.cCur(data.ServiceAnnualValue));
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceAnnualValue', data.ServiceAnnualValue);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'status', data.Status);
                        //Enable the fields
                        this.isSaveEnabled = true;
                        this.riExchange.riInputElement.Enable(this.uiForm, 'InvoiceOnFirstVisitInd');
                        this.formData.serviceCover = data.ServiceCover;
                        let getDate = data.ServiceCommenceDate;
                        // if (moment(getDate, 'DD/MM/YYYY', true).isValid()) {
                        //     getDate = this.utils.convertDate(getDate);
                        // } else {
                        //     getDate = this.utils.formatDate(getDate);
                        // }
                        // this.pageParams.contractCommenceDate = new Date(getDate);
                        getDate = this.globalize.parseDateToFixedFormat(getDate);
                        this.pageParams.contractCommenceDate = this.globalize.parseDateStringToDate(getDate);

                        this.disableButtons(false);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                error => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    public commenceDateSelectedValue(value: any): void {
        this.commenceDate = value.value;
    }
    //Save or Update Details
    public updateAllDetails(): void {
        this.promptModal.show();
    }

    public promptSave(event: any): void {
        let queryParams: any = {
            operation: 'Application/iCABSAServiceCoverInvoiceOnFirstVisitMaintenance',
            module: 'invoicing',
            method: 'bill-to-cash/maintenance'
        };

        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');

        let postParams: any = {};
        postParams.ServiceCoverROWID = this.formData.serviceCover;
        postParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        postParams.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        postParams.ProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        postParams.ServiceVisitFrequency = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitFrequency');
        postParams.ServiceQuantity = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceQuantity');
        postParams.ServiceAnnualValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceAnnualValue');
        postParams.ServiceCommenceDate = this.commenceDate;//this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCommenceDate');
        postParams.InvoiceOnFirstVisitInd = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceOnFirstVisitInd') ? 'yes' : 'no';
        postParams.ContractTypeCode = this.pageParams.currentContractType;
        this.ajaxSource.next(this.ajaxconstant.START);

        this.httpService.makePostRequest(queryParams.method, queryParams.module, queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(new Error(e['errorMessage']));
                        //  this.messageModal.show({ msg: e.errorMessage, title: 'Message' }, false);
                        this.messageModal.show(e, true);
                    } else {
                        this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: '' }, false);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public modalHidden(e: any): void {
        this.ellipsis.contractSearch.autoOpenSearch = false;
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceOnFirstVisitInd');
    }

    public onCancel(): void {
        this.fetchAllDetails();
    }

    private clearData(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'status', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceAnnualValue', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceQuantity', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceOnFirstVisitInd', null);
        this.isSaveEnabled = false;
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceOnFirstVisitInd');
        this.pageParams.contractCommenceDate = null;
        this.disableButtons(true);
    }

}
