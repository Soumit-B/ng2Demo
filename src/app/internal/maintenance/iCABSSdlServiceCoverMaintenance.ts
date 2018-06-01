import * as moment from 'moment';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { Utils } from '../../../shared/services/utility';
import { BusinessOriginDetailLanguageSearchComponent } from './../search/iCABSBBusinessOriginDetailLanguageSearch';
import { BranchServiceAreaSearchComponent } from './../search/iCABSBBranchServiceAreaSearch';
import { ProductSearchGridComponent } from './../search/iCABSBProductSearch';
import { TaxCodeSearchComponent } from './../search/iCABSSTaxCodeSearch.component';
import { EmployeeSearchComponent } from '../../internal/search/iCABSBEmployeeSearch';
import { ScreenNotReadyComponent } from '../../../shared/components/screenNotReady';
import { GridComponent } from '../../../shared/components/grid/grid';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSSdlServiceCoverMaintenance.html',
    styles: [`

      .screen-body {
        min-height: 400px;
      }

  `]
})

export class DlServiceCoverMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('promptModal') public promptModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('gridServiceCover') gridServiceCover: GridComponent;
    @ViewChild('gridPrep') gridPrep: GridComponent;
    public pageId: string = '';
    public promptTitle: string = '';
    public promptContent: string = '';
    public showMessageHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public showHeader: boolean = true;
    public requestParams: any = {
        operation: 'Sales/iCABSSdlServiceCoverMaintenance',
        module: 'advantage',
        method: 'prospect-to-contract/maintenance'
    };
    public queryParams: any;
    public search: URLSearchParams = new URLSearchParams();
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public querySysChar: URLSearchParams = new URLSearchParams();
    public callOutData: any;
    public validatePropertiesPrep: Array<any> = [];
    public validatePropertiesServiceCover: Array<any> = [];
    public controls = [
        { name: 'dlPremiseRef', readonly: false, disabled: true, required: false },
        { name: 'ContractTypeCode', readonly: false, disabled: true, required: false },
        { name: 'dlStatusCode', readonly: false, disabled: true, required: false },
        { name: 'dlStatusDesc', readonly: false, disabled: true, required: false },
        { name: 'ProductCode', readonly: false, disabled: true, required: true },
        { name: 'ProductDesc', readonly: false, disabled: true, required: false },
        { name: 'ServiceVisitFrequency', readonly: false, disabled: true, required: false },
        { name: 'ServiceQuantityChange', readonly: false, disabled: true, required: false },
        { name: 'BusinessOriginCode', readonly: false, disabled: false, required: true },
        { name: 'BusinessOriginDesc', readonly: false, disabled: true, required: false },
        { name: 'BusinessOriginDetailCode', readonly: false, disabled: false, required: true },
        { name: 'BusinessOriginDetailDesc', readonly: false, disabled: true, required: false },
        { name: 'ServiceSalesEmployee', readonly: false, disabled: false, required: true },
        { name: 'EmployeeSurname', readonly: false, disabled: true, required: false },
        { name: 'ServiceTypeCode', readonly: false, disabled: false, required: true },
        { name: 'ServiceTypeDesc', readonly: false, disabled: true, required: false },
        { name: 'TaxCode', readonly: false, disabled: false, required: true },
        { name: 'ServiceBranchNumber', readonly: false, disabled: true, required: false },
        { name: 'BranchName', readonly: false, disabled: true, required: false },
        { name: 'BranchServiceAreaCode', readonly: false, disabled: false, required: true },
        { name: 'BranchServiceAreaDesc', readonly: false, disabled: true, required: false },
        { name: 'ServiceEmployeeCode', readonly: false, disabled: true, required: false },
        { name: 'ServiceEmployeeSurname', readonly: false, disabled: true, required: false },
        { name: 'WasteTransferRequired', readonly: false, disabled: true, required: false },
        { name: 'GuaranteeRequired', readonly: false, disabled: false, required: false },
        { name: 'NoGuaranteeCode', readonly: false, disabled: false, required: false },
        { name: 'NoGuaranteeDescription', readonly: false, disabled: true, required: false },
        { name: 'AgeofProperty', readonly: false, disabled: false, required: false },
        { name: 'NumberBedrooms', readonly: false, disabled: false, required: false },
        { name: 'ListedCode', readonly: false, disabled: false, required: false },
        { name: 'ListedDescription', readonly: false, disabled: false, required: false },
        { name: 'StandardTreatmentTime', readonly: false, disabled: true, required: false, type: MntConst.eTypeTime },
        { name: 'ChargeRateCode', readonly: false, disabled: false, required: true },
        { name: 'ChargeRateDesc', readonly: false, disabled: true, required: false },
        { name: 'StandardTimeInd', readonly: false, disabled: false, required: false },
        { name: 'AccessHireValue', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency },
        { name: 'MaterialsValue', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency },
        { name: 'MaterialsDesc', readonly: false, disabled: false, required: false },
        { name: 'InitialValue', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency },
        { name: 'TotalValue', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency },
        { name: 'CalculatedDiscount', readonly: false, disabled: true, required: false },
        { name: 'DiscountReason', readonly: false, disabled: false, required: false },
        { name: 'PrepFilter', readonly: false, disabled: false, required: false },
        { name: 'SDFilter', readonly: false, disabled: false, required: false },
        { name: 'AnnualValueChange', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency },
        { name: 'TaxCodeDesc', readonly: false, disabled: true, required: false },
        { name: 'ServiceSpecialInstructions', readonly: false, disabled: false, required: true },
        { name: 'ViewOriginal', readonly: false, disabled: false, required: false },
        { name: 'WindowStarth01', readonly: false, disabled: false, required: false },
        { name: 'WindowStartm01', readonly: false, disabled: false, required: false },
        { name: 'WindowEndh01', readonly: false, disabled: false, required: false },
        { name: 'WindowEndm01', readonly: false, disabled: false, required: false },
        { name: 'WindowStarth08', readonly: false, disabled: false, required: false },
        { name: 'WindowStartm08', readonly: false, disabled: false, required: false },
        { name: 'WindowEndh08', readonly: false, disabled: false, required: false },
        { name: 'WindowEndm08', readonly: false, disabled: false, required: false },
        { name: 'WindowStarth02', readonly: false, disabled: false, required: false },
        { name: 'WindowStartm02', readonly: false, disabled: false, required: false },
        { name: 'WindowEndh02', readonly: false, disabled: false, required: false },
        { name: 'WindowEndm02', readonly: false, disabled: false, required: false },
        { name: 'WindowStarth09', readonly: false, disabled: false, required: false },
        { name: 'WindowStartm09', readonly: false, disabled: false, required: false },
        { name: 'WindowEndh09', readonly: false, disabled: false, required: false },
        { name: 'WindowEndm09', readonly: false, disabled: false, required: false },
        { name: 'WindowStarth03', readonly: false, disabled: false, required: false },
        { name: 'WindowStartm03', readonly: false, disabled: false, required: false },
        { name: 'WindowEndh03', readonly: false, disabled: false, required: false },
        { name: 'WindowEndm03', readonly: false, disabled: false, required: false },
        { name: 'WindowStarth10', readonly: false, disabled: false, required: false },
        { name: 'WindowStartm10', readonly: false, disabled: false, required: false },
        { name: 'WindowEndh10', readonly: false, disabled: false, required: false },
        { name: 'WindowEndm10', readonly: false, disabled: false, required: false },
        { name: 'WindowStarth04', readonly: false, disabled: false, required: false },
        { name: 'WindowStartm04', readonly: false, disabled: false, required: false },
        { name: 'WindowEndh04', readonly: false, disabled: false, required: false },
        { name: 'WindowEndm04', readonly: false, disabled: false, required: false },
        { name: 'WindowStarth11', readonly: false, disabled: false, required: false },
        { name: 'WindowStartm11', readonly: false, disabled: false, required: false },
        { name: 'WindowEndh11', readonly: false, disabled: false, required: false },
        { name: 'WindowEndm11', readonly: false, disabled: false, required: false },
        { name: 'WindowStarth05', readonly: false, disabled: false, required: false },
        { name: 'WindowStartm05', readonly: false, disabled: false, required: false },
        { name: 'WindowEndh05', readonly: false, disabled: false, required: false },
        { name: 'WindowEndm05', readonly: false, disabled: false, required: false },
        { name: 'WindowStarth12', readonly: false, disabled: false, required: false },
        { name: 'WindowStartm12', readonly: false, disabled: false, required: false },
        { name: 'WindowEndh12', readonly: false, disabled: false, required: false },
        { name: 'WindowEndm12', readonly: false, disabled: false, required: false },
        { name: 'WindowStarth06', readonly: false, disabled: false, required: false },
        { name: 'WindowStartm06', readonly: false, disabled: false, required: false },
        { name: 'WindowEndh06', readonly: false, disabled: false, required: false },
        { name: 'WindowEndm06', readonly: false, disabled: false, required: false },
        { name: 'WindowStarth13', readonly: false, disabled: false, required: false },
        { name: 'WindowStartm13', readonly: false, disabled: false, required: false },
        { name: 'WindowEndh13', readonly: false, disabled: false, required: false },
        { name: 'WindowEndm13', readonly: false, disabled: false, required: false },
        { name: 'WindowStarth07', readonly: false, disabled: false, required: false },
        { name: 'WindowStartm07', readonly: false, disabled: false, required: false },
        { name: 'WindowEndh07', readonly: false, disabled: false, required: false },
        { name: 'WindowEndm07', readonly: false, disabled: false, required: false },
        { name: 'WindowStarth14', readonly: false, disabled: false, required: false },
        { name: 'WindowStartm14', readonly: false, disabled: false, required: false },
        { name: 'WindowEndh14', readonly: false, disabled: false, required: false },
        { name: 'WindowEndm14', readonly: false, disabled: false, required: false },
        { name: 'Save', readonly: false, disabled: false, required: false },
        { name: 'Cancel', readonly: false, disabled: false, required: false }

    ];
    public fieldVisibility: any = {
        dlPremiseRef: true,
        ContractTypeCode: true,
        dlStatusCode: true,
        dlStatusDesc: true,
        ProductCode: true,
        ProductDesc: true,
        ServiceVisitFrequency: true,
        ServiceQuantityChange: true,
        BusinessOriginCode: true,
        BusinessOriginDesc: true,
        BusinessOriginDetailCode: true,
        BusinessOriginDetailDesc: true,
        ServiceSalesEmployee: true,
        EmployeeSurname: true,
        ServiceTypeCode: true,
        ServiceTypeDesc: true,
        TaxCode: true,
        TaxCodeDesc: true,
        ServiceBranchNumber: true,
        BranchName: true,
        BranchServiceAreaCode: true,
        BranchServiceAreaDesc: true,
        ServiceEmployeeCode: true,
        ServiceEmployeeSurname: true,
        WasteTransferRequired: true,
        GuaranteeRequired: true,
        NoGuaranteeCode: false,
        NoGuaranteeDescription: false,
        AgeofProperty: false,
        NumberBedrooms: false,
        ListedCode: false,
        ListedDescription: false,
        StandardTreatmentTime: true,
        ChargeRateCode: true,
        ChargeRateDesc: true,
        StandardTimeInd: true,
        AccessHireValue: true,
        MaterialsValue: true,
        MaterialsDesc: true,
        InitialValue: false,
        TotalValue: true,
        AnnualValueChange: true,
        CalculatedDiscount: true,
        DiscountReason: true,
        PrepFilter: true,
        SDFilter: true,
        ServiceSpecialInstructions: true,
        grdTimeWindow: true,
        WindowStarth01: true,
        WindowStartm01: true,
        WindowEndh01: true,
        WindowEndm01: true,
        WindowStarth08: true,
        WindowStartm08: true,
        WindowEndh08: true,
        WindowEndm08: true,
        WindowStarth02: true,
        WindowStartm02: true,
        WindowEndh02: true,
        WindowEndm02: true,
        WindowStarth09: true,
        WindowStartm09: true,
        WindowEndh09: true,
        WindowEndm09: true,
        WindowStarth03: true,
        WindowStartm03: true,
        WindowEndh03: true,
        WindowEndm03: true,
        WindowStarth10: true,
        WindowStartm10: true,
        WindowEndh10: true,
        WindowEndm10: true,
        WindowStarth04: true,
        WindowStartm04: true,
        WindowEndh04: true,
        WindowEndm04: true,
        WindowStarth11: true,
        WindowStartm11: true,
        WindowEndh11: true,
        WindowEndm11: true,
        WindowStarth05: true,
        WindowStartm05: true,
        WindowEndh05: true,
        WindowEndm05: true,
        WindowStarth12: true,
        WindowStartm12: true,
        WindowEndh12: true,
        WindowEndm12: true,
        WindowStarth06: true,
        WindowStartm06: true,
        WindowEndh06: true,
        WindowEndm06: true,
        WindowStarth13: true,
        WindowStartm13: true,
        WindowEndh13: true,
        WindowEndm13: true,
        WindowStarth07: true,
        WindowStartm07: true,
        WindowEndh07: true,
        WindowEndm07: true,
        WindowStarth14: true,
        WindowStartm14: true,
        WindowEndh14: true,
        WindowEndm14: true,
        Save: true,
        Cancel: true
    };
    public dropdownList: any = {
        WindowStarth01: [],
        WindowStartm01: [],
        WindowEndh01: [],
        WindowEndm01: [],
        WindowStarth08: [],
        WindowStartm08: [],
        WindowEndh08: [],
        WindowEndm08: [],
        WindowStarth02: [],
        WindowStartm02: [],
        WindowEndh02: [],
        WindowEndm02: [],
        WindowStarth09: [],
        WindowStartm09: [],
        WindowEndh09: [],
        WindowEndm09: [],
        WindowStarth03: [],
        WindowStartm03: [],
        WindowEndh03: [],
        WindowEndm03: [],
        WindowStarth10: [],
        WindowStartm10: [],
        WindowEndh10: [],
        WindowEndm10: [],
        WindowStarth04: [],
        WindowStartm04: [],
        WindowEndh04: [],
        WindowEndm04: [],
        WindowStarth11: [],
        WindowStartm11: [],
        WindowEndh11: [],
        WindowEndm11: [],
        WindowStarth05: [],
        WindowStartm05: [],
        WindowEndh05: [],
        WindowEndm05: [],
        WindowStarth12: [],
        WindowStartm12: [],
        WindowEndh12: [],
        WindowEndm12: [],
        WindowStarth06: [],
        WindowStartm06: [],
        WindowEndh06: [],
        WindowEndm06: [],
        WindowStarth13: [],
        WindowStartm13: [],
        WindowEndh13: [],
        WindowEndm13: [],
        WindowStarth07: [],
        WindowStartm07: [],
        WindowEndh07: [],
        WindowEndm07: [],
        WindowStarth14: [],
        WindowStartm14: [],
        WindowEndh14: [],
        WindowEndm14: []

    };
    public fieldRequired: any = {
        ProductCode: true,
        ServiceBranchNumber: true,
        ContractTypeCode: false,
        BranchServiceAreaCode: true,
        BusinessOriginCode: true,
        BusinessOriginDetailCode: true,
        ChargeRateCode: true,
        ServiceSpecialInstructions: true,
        ServiceTypeCode: true,
        ServiceVisitFrequency: true,
        NoGuaranteeCode: true,
        DiscountReason: false,
        MaterialsValue: false,
        ServiceQuantityChange: false,
        AnnualValueChange: false,
        TaxCode: true,
        ServiceSalesEmployee: true

    };
    public syschars: any = {
        vSCEnableInitialCharge: '',
        vSCEnablePreps: ''

    };
    public otherVariables: any = {
        dlBatchRef: '',
        dlRecordType: 'SC',
        dlExtRef: '',
        dlServiceCoverRef: '',
        dlRejectionCode: '',
        dlRejectionDesc: '',
        dlServiceCover: '',
        CompanyCode: '',
        LanguageCode: '',
        SelectedLine: '',
        Misc: '',
        SubSystem: '',
        DetailRequired: '',
        QuantityRequired: '',
        ServiceCommenceDate: '',
        SOServiceCoverNumber: '',
        InfoMessage: '',
        UpdateableInd: '',
        UpdateableIndBoolean: '',
        PremiseIsPNOL: '',
        AutoCloseWindow: '',
        PNOLSetupChargeRequired: '',
        dlMasterExtRef: '',
        InitialdlMasterExtRef: '',
        QuoteTypeCode: '',
        DisQuoteTypeCode: '',
        BusinessOriginDetailReq: '',
        blnCalcDiscountOnly: '',
        CurrentContractType: '',
        AccessHireValueDecimal: '',
        MaterialsValueDecimal: '',
        storeInitialRefs: '',
        boolPropertyCareInd: '',
        boolUserWriteAccess: '',
        AnnualValueChangeLabel: ''

    };
    public dateObjects: any = {
        PassedDate: void 0

    };
    public dateObjectsEnabled: any = {
        PassedDate: true

    };
    public dateObjectsDisplay: any = {
        passedDateDisplay: ''

    };

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public uiDisplay: any = {
        tab: {
            tab1: { visible: true, active: true, error: false },
            tab2: { visible: false, active: false, error: false },
            tab3: { visible: true, active: false, error: false },
            tab4: { visible: false, active: false, error: false },
            tab5: { visible: false, active: false, error: false },
            tab6: { visible: true, active: false, error: false },
            tab7: { visible: true, active: false, error: false }
        }
    };
    public dropdown: any = {
        chargeRateCode: {
            inputParams: {
                module: 'rates',
                method: 'bill-to-cash/search',
                operation: 'Business/iCABSBChargeRateSearch',
                parentMode: 'LookUp'
            },
            active: {
                id: '',
                text: ''
            },
            displayFields: ['ChargeRateCode', 'ChargeRateDesc'],
            isDisabled: false,
            isRequired: true,
            isTriggerValidate: false
        }
    };
    public ellipsis: any = {
        employeeSearch: {
            inputParams: {
                parentMode: 'LookUp-ServiceCoverCommissionEmployee',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: null
        },
        businessOriginCode: {
            inputParams: {
                parentMode: 'LookUp',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: null
        },
        serviceArea: {
            inputParams: {
                parentMode: 'LookUp-SC',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: '',
                ServiceBranchNumber: '',
                BranchName: ''
            },
            isEllipsisDisabled: false,
            contentComponent: null
        },
        businessOriginDetailCode: {
            inputParams: {
                parentMode: 'LookUp',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: null
        },
        chargeRateCode: {
            inputParams: {
                parentMode: 'LookUp',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: null
        },
        noGuaranteeCode: {
            inputParams: {
                parentMode: 'LookUp',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: null
        },
        productCode: {
            inputParams: {
                parentMode: 'ServiceCover-' + this.otherVariables['CurrentContractType'],
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: true,
            contentComponent: null
        },
        serviceType: {
            inputParams: {
                parentMode: 'LookUp',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: null
        },
        taxCode: {
            inputParams: {
                parentMode: 'LookUp',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: TaxCodeSearchComponent
        }
    };
    public grid: any = {
        gridServiceCover: {
            maxColumns: 3,
            itemsPerPage: 10,
            currentPage: 1,
            totalRecords: 0,
            paginationCurrentPage: 1,
            headerClicked: '',
            sortType: 'Descending',
            inputParams: {}
        },
        gridPrep: {
            maxColumns: 5,
            itemsPerPage: 10,
            currentPage: 1,
            totalRecords: 0,
            paginationCurrentPage: 1,
            headerClicked: '',
            sortType: 'Descending',
            inputParams: {}
        }
    };
    public showCloseButton: boolean = true;
    public formRawClone: any = {};

    constructor(injector: Injector, private titleService: Title) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSDLSERVICECOVERMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Advantage Service Cover Maintenance';
        this.queryParams = this.riExchange.getRouterParams();
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
        this.otherVariables['LanguageCode'] = this.riExchange.LanguageCode();
        this.otherVariables['CurrentContractType'] = this.riExchange.getParentHTMLValue('ContractTypeCode');
        this.otherVariables['dlPremiseRef'] = this.riExchange.getParentHTMLValue('dlPremiseRef') || this.riExchange.GetParentHTMLInputElementAttribute('Misc', 'dlPremiseRef');
        this.otherVariables['SubSystem'] = this.riExchange.getParentHTMLValue('SubSystem') || 'SalesOrder';
        this.otherVariables['QuoteTypeCode'] = this.riExchange.getParentHTMLValue('QuoteTypeCode');
        this.otherVariables['DisQuoteTypeCode'] = this.riExchange.getParentHTMLValue('DisQuoteTypeCode');
        this.otherVariables['dlBatchRef'] = this.riExchange.getParentHTMLValue('dlBatchRef');
        this.otherVariables['dlExtRef'] = this.riExchange.getParentHTMLValue('dlExtRef');
        this.otherVariables['dlServiceCoverRef'] = this.riExchange.getParentHTMLValue('dlServiceCoverRef');
        this.otherVariables['dlRejectionCode'] = this.riExchange.getParentHTMLValue('dlRejectionCode');
        this.otherVariables['dlRejectionDesc'] = this.riExchange.getParentHTMLValue('dlRejectionDesc');
        this.otherVariables['CompanyCode'] = this.riExchange.getParentHTMLValue('CompanyCode');
        this.otherVariables['SelectedLine'] = this.riExchange.getParentHTMLValue('SelectedLine');
        this.otherVariables['Misc'] = this.riExchange.getParentHTMLValue('Misc');
        this.otherVariables['DetailRequired'] = this.riExchange.getParentHTMLValue('DetailRequired');
        this.otherVariables['QuantityRequired'] = this.riExchange.getParentHTMLValue('QuantityRequired');
        this.otherVariables['ServiceCommenceDate'] = this.riExchange.getParentHTMLValue('ServiceCommenceDate');
        this.otherVariables['SOServiceCoverNumber'] = this.riExchange.getParentHTMLValue('SOServiceCoverNumber');
        this.otherVariables['InfoMessage'] = this.riExchange.getParentHTMLValue('InfoMessage');
        this.otherVariables['UpdateableInd'] = this.riExchange.getParentHTMLValue('UpdateableInd');
        this.otherVariables['PremiseIsPNOL'] = this.riExchange.getParentHTMLValue('PremiseIsPNOL');
        this.otherVariables['AutoCloseWindow'] = this.riExchange.getParentHTMLValue('AutoCloseWindow');
        this.otherVariables['PNOLSetupChargeRequired'] = this.riExchange.getParentHTMLValue('PNOLSetupChargeRequired');
        this.otherVariables['dlMasterExtRef'] = this.riExchange.getParentHTMLValue('dlMasterExtRef');
        this.otherVariables['InitialdlMasterExtRef'] = this.riExchange.getParentHTMLValue('InitialdlMasterExtRef');
        this.otherVariables['QuoteTypeCode'] = this.riExchange.getParentHTMLValue('QuoteTypeCode');
        this.otherVariables['DisQuoteTypeCode'] = this.riExchange.getParentHTMLValue('DisQuoteTypeCode');
        this.otherVariables['BusinessOriginDetailReq'] = this.riExchange.getParentHTMLValue('BusinessOriginDetailReq');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.otherVariables['CurrentContractType']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlPremiseRef', this.otherVariables['dlPremiseRef']);
        this.ellipsis['businessOriginDetailCode']['contentComponent'] = BusinessOriginDetailLanguageSearchComponent;
        this.ellipsis['serviceArea']['contentComponent'] = BranchServiceAreaSearchComponent;
        this.ellipsis['businessOriginCode']['contentComponent'] = ScreenNotReadyComponent;
        this.ellipsis['noGuaranteeCode']['contentComponent'] = ScreenNotReadyComponent;
        this.ellipsis['serviceType']['contentComponent'] = ScreenNotReadyComponent;
        this.ellipsis['taxCode']['contentComponent'] = TaxCodeSearchComponent;
        this.ellipsis['productCode']['contentComponent'] = ProductSearchGridComponent;
        this.ellipsis['employeeSearch']['contentComponent'] = EmployeeSearchComponent;
        if (this.otherVariables['DisQuoteTypeCode'] === '') {
            this.otherVariables['DisQuoteTypeCode'] = this.otherVariables['QuoteTypeCode'];
        }
        this.buildGrid();
        this.fetchTranslationContent();
        this.setMessageCallback(this);
        this.setErrorCallback(this);
        this.postInit();
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

    public buildGrid(): void {
        this.validatePropertiesPrep = [
            {
                'type': MntConst.eTypeCode,
                'index': 0,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeTextFree,
                'index': 1,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeTextFree,
                'index': 2,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeDecimal2,
                'index': 3,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeCurrency,
                'index': 4,
                'align': 'center'
            }
        ];

        this.validatePropertiesServiceCover = [
            {
                'type': MntConst.eTypeText,
                'index': 0,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeTextFree,
                'index': 1,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeImage,
                'index': 2,
                'align': 'center'
            }
        ];
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
        this.onTabSelect();
    }

    public onTabSelect(): void {
        let tabsElemList = document.querySelectorAll('#tabCont .tab-content .tab-pane');
        for (let i = 0; i < tabsElemList.length; i++) {
            if (tabsElemList[i].querySelectorAll('input.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched').length > 0) {
                let tabText = 'tab' + (i + 1);
                this.uiDisplay.tab[tabText].error = true;
            } else {
                let tabText = 'tab' + (i + 1);
                this.uiDisplay.tab[tabText].error = false;
            }
        }
    }

    public getGridInfoServiceCover(info: any): void {
        this.grid.gridServiceCover.totalRecords = info.totalRows;
        setTimeout(() => {
            this.grid.gridServiceCover.paginationCurrentPage = this.grid.gridServiceCover.currentPage;
        }, 0);
    }

    public getGridInfoPrep(info: any): void {
        this.grid.gridPrep.totalRecords = info.totalRows;
        setTimeout(() => {
            this.grid.gridPrep.paginationCurrentPage = this.grid.gridPrep.currentPage;
        }, 0);
    }

    public onGridRowDblClickA(data: any): void {
        if (data.cellIndex === 2) {
            this.fetchServiceCoverPost('ToggleSelected', {
                dlBatchRef: this.otherVariables['dlBatchRef'],
                dlServiceCoverRef: this.otherVariables['dlServiceCoverRef'],
                ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                ProductDetailCode: data.trRowData[0].text
            }, {}).subscribe((data) => {
                if (data['status'] === GlobalConstant.Configuration.Failure) {
                    this.errorService.emitError(data['oResponse']);
                } else {
                    if (!data['errorMessage']) {
                        this.loadGridViewA();
                    }
                }
            }, (error) => {
                // error statement
            });
        }
    }

    public onGridRowDblClickB(data: any): void {
        // statement
        //console.log(data);
    }

    public onGridCellClickA(data: any): void {
        // statement
    }

    public onGridCellClickB(data: any): void {
        // statement
    }

    public getCurrentPageServiceCover(event: any): void {
        this.grid.gridServiceCover.currentPage = event.value;
        this.refreshGridServiceCover();
    }

    public getCurrentPagePrep(event: any): void {
        this.grid.gridPrep.currentPage = event.value;
        this.refreshGridPrep();
    }

    public loadGridViewA(): void {
        let search: URLSearchParams = new URLSearchParams();
        this.grid.gridServiceCover.inputParams['module'] = this.requestParams.module;
        this.grid.gridServiceCover.inputParams['method'] = this.requestParams.method;
        this.grid.gridServiceCover.inputParams['operation'] = this.requestParams.operation;
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('dlBatchRef', this.otherVariables['dlBatchRef'] ? this.otherVariables['dlBatchRef'] : '');
        search.set('dlPremiseRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlPremiseRef'));
        search.set('dlServiceCoverRef', this.otherVariables['dlServiceCoverRef']);
        search.set('SOServiceCoverNumber', this.otherVariables['SOServiceCoverNumber']);
        search.set('LanguageCode', this.otherVariables['LanguageCode']);
        search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        search.set('SDFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'SDFilter'));
        search.set('riSortOrder', this.grid.gridServiceCover.sortType);
        search.set('riGridMode', '0');
        search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        search.set('HeaderClickedColumn', this.grid.gridServiceCover.headerClicked);
        search.set('PageSize', this.grid.gridServiceCover.itemsPerPage.toString());
        search.set('PageCurrent', this.grid.gridServiceCover.currentPage.toString());
        this.grid.gridServiceCover.inputParams['search'] = search;
        this.gridServiceCover.loadGridData(this.grid.gridServiceCover.inputParams);
    }

    public loadGridViewB(): void {
        let search: URLSearchParams = new URLSearchParams();
        this.grid.gridPrep.inputParams['module'] = this.requestParams.module;
        this.grid.gridPrep.inputParams['method'] = this.requestParams.method;
        this.grid.gridPrep.inputParams['operation'] = this.requestParams.operation;
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('ContractTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode') : '');
        search.set('dlPremiseRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlPremiseRef'));
        search.set('SOServiceCoverNumber', this.otherVariables['SOServiceCoverNumber']);
        search.set('ChargeRateCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ChargeRateCode'));
        search.set('ServiceVisitFrequency', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitFrequency'));
        search.set('PrepFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'PrepFilter'));
        search.set('riSortOrder', this.grid.gridPrep.sortType);
        search.set('riGridMode', '0');
        search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        search.set('HeaderClickedColumn', this.grid.gridPrep.headerClicked);
        search.set('PageSize', this.grid.gridPrep.itemsPerPage.toString());
        search.set('PageCurrent', this.grid.gridPrep.currentPage.toString());
        this.grid.gridPrep.inputParams['search'] = search;
        this.gridPrep.loadGridData(this.grid.gridPrep.inputParams);
    }

    public refreshGridServiceCover(): void {
        this.loadGridViewA();
    }

    public refreshGridPrep(): void {
        this.loadGridViewB();
    }

    public sortGridServiceCover(data: any): void {
        this.grid.gridServiceCover.headerClicked = data.fieldname;
        this.grid.gridServiceCover.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGridViewA();
    }

    public sortGridPrep(data: any): void {
        this.grid.gridPrep.headerClicked = data.fieldname;
        this.grid.gridPrep.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGridViewB();
    }

    public guaranteeToggle(): void {
        if (this.uiForm.controls['GuaranteeRequired'].value) {
            this.fieldVisibility.AgeofProperty = true;
            this.fieldVisibility.NumberBedrooms = true;
            this.fieldVisibility.ListedCode = true;
            this.fieldVisibility.NoGuaranteeCode = false;
            this.fieldRequired.NoGuaranteeCode = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NoGuaranteeCode', false);
        } else {
            this.fieldVisibility.AgeofProperty = false;
            this.fieldVisibility.NumberBedrooms = false;
            this.fieldVisibility.ListedCode = false;
            this.fieldVisibility.NoGuaranteeCode = true;
            this.fieldRequired.NoGuaranteeCode = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NoGuaranteeCode', true);
        }
    }

    public onBusinessOriginCodeFocusOut(event: any): void {
        if (this.otherVariables['BusinessOriginDetailReq']) {
            setTimeout(() => {
                if (document.getElementById('BusinessOriginDetailCode'))
                    document.getElementById('BusinessOriginDetailCode').focus();
            }, 0);
        } else {
            setTimeout(() => {
                if (document.getElementById('ServiceSalesEmployee'))
                    document.getElementById('ServiceSalesEmployee').focus();
            }, 0);
        }
    }

    public onCapitalize(control: any): void {
        if (this.uiForm.controls[control])
            this.uiForm.controls[control].setValue(this.uiForm.controls[control].value.toString().toUpperCase());
    }

    public onBusinessOriginCodeChange(event: any): void {
        this.fetchServiceCoverPost('BusinessOriginHasChanged', { BusinessOriginCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode') }, {}).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (!data['errorMessage']) {
                    if (data && data['DetailRequiredInd'].toUpperCase() === 'Y') {
                        this.setBusinessOriginDetailReq();
                    }
                    let lookupdata = [
                        {
                            'table': 'BusinessOrigin',
                            'query': { 'BusinessOriginCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode'), 'BusinessCode': this.utils.getBusinessCode() },
                            'fields': ['BusinessOriginSystemDesc']
                        }
                    ];
                    this.lookUpRecord(lookupdata, 100).subscribe(
                        (e) => {
                            if (e['results'] && e['results'].length > 0) {
                                if (e['results'][0].length > 0) {
                                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDesc', e['results'][0][0].BusinessOriginSystemDesc);
                                } else {
                                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginCode', '');
                                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDesc', '');
                                }
                            } else {
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginCode', '');
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDesc', '');
                            }
                        }, (error) => {
                            // error statement
                        });
                }
            }
        });
    }

    public onProductCodeChange(event: any): void {
        if (this.otherVariables['boolPropertyCareInd'].toUpperCase() === 'Y' && this.otherVariables['boolUserWriteAccess'].toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.checkGuaranteeRequiredInd();
        }
        let data = [
            {
                'table': 'Product',
                'query': { 'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ProductDesc', 'WasteTransferRequired']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', e['results'][0][0].ProductDesc);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'WasteTransferRequired', e['results'][0][0].WasteTransferRequired);
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'WasteTransferRequired', false);
                    }
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'WasteTransferRequired', false);
                }
            }, (error) => {
                // error statement
            });
    }

    public onChargeRateCodeChange(event: any): void {
        let data = [
            {
                'table': 'ChargeRate',
                'query': { 'ChargeRateCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ChargeRateCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ChargeRateDesc']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ChargeRateDesc', e['results'][0][0].ChargeRateDesc);
                        this.dropdown.chargeRateCode.active = {
                            id: '',
                            text: this.getControlValue('ChargeRateCode') + ' - ' + this.getControlValue('ChargeRateDesc')
                        };
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ChargeRateDesc', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ChargeRateCode', '');
                        this.dropdown.chargeRateCode.active = {
                            id: '',
                            text: ''
                        };
                    }
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ChargeRateDesc', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ChargeRateCode', '');
                    this.dropdown.chargeRateCode.active = {
                        id: '',
                        text: ''
                    };
                }
            }, (error) => {
                // error statement
            });
    }

    public onTaxCodeChange(event: any): void {
        let data = [
            {
                'table': 'TaxCode',
                'query': { 'TaxCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'TaxCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['TaxCodeDesc']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'TaxCodeDesc', e['results'][0][0].TaxCodeDesc);
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'TaxCodeDesc', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'TaxCode', '');
                    }
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'TaxCodeDesc', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'TaxCode', '');
                }
            }, (error) => {
                // error statement
            });
    }

    public onServiceTypeCodeChange(event: any): void {
        let data = [
            {
                'table': 'ServiceType',
                'query': { 'ServiceTypeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceTypeCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ServiceTypeDesc']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', e['results'][0][0].ServiceTypeDesc);
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeCode', '');
                    }
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeCode', '');
                }
            }, (error) => {
                // error statement
            });
    }

    public onSalesEmployeeChange(event: any): void {
        let data = [
            {
                'table': 'Employee',
                'query': { 'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSalesEmployee'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['EmployeeSurname']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', e['results'][0][0].EmployeeSurname);
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', '');
                    }
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', '');
                }
            }, (error) => {
                // error statement
            });
    }

    public onServiceBranchChange(event: any): void {
        let data = [
            {
                'table': 'Branch',
                'query': { 'BranchNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BranchName']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchName', e['results'][0][0].BranchName);
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchNumber', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchName', '');
                    }
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchNumber', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchName', '');
                }
            }, (error) => {
                // error statement
            });
    }

    public onBranchServiceAreaCodeChange(event: any): void {
        let data = [
            {
                'table': 'BranchServiceArea',
                'query': { 'BranchNumber': this.utils.getBranchCode(), 'BranchServiceAreaCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BranchServiceAreaDesc', 'EmployeeCode']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', e['results'][0][0].BranchServiceAreaDesc);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceEmployeeCode', e['results'][0][0].EmployeeCode);
                        this.fetchServiceEmployeeDesc();
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceEmployeeCode', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceEmployeeSurname', '');
                    }
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceEmployeeCode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceEmployeeSurname', '');
                }
            }, (error) => {
                // error statement
            });
    }

    public onViewOriginalChange(event: any): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewOriginal')) {
            this.otherVariables['dlServiceCover'] = this.otherVariables['InitialdlMasterExtRef'];
        } else {
            this.otherVariables['dlServiceCover'] = this.riExchange.getParentHTMLValue('dlServiceCoverRowID') || this.riExchange.GetParentHTMLInputElementAttribute('Misc', 'dlServiceCoverRowID');
        }
    }

    public onGuaranteeRequiredChange(event: any): void {
        this.guaranteeToggle();
    }

    public onMaterialsValueChange(event: any): void {
        this.setMaterialsDescRequired();
    }

    public onAccessHireValueChange(event: any): void {
        if (this.riExchange.riInputElement.isCorrect(this.uiForm, 'AccessHireValue')) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessHireValue') === null || this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessHireValue') === undefined) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessHireValue', '0');
            }
        }
    }

    public onServiceAreaReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', data.BranchServiceAreaCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', data.BranchServiceAreaDesc);
        }
    }

    public onBusinessOriginDetailCodeReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDetailCode', data.BusinessOriginDetailCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDetailDesc', data.BusinessOriginDetailDesc);
        }
    }

    public onBusinessOriginCodeReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginCode', data.BusinessOriginCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDesc', data.BusinessOriginDesc);
        }
    }

    public onNoGuaranteeCodeReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'NoGuaranteeCode', data.NoGuaranteeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'NoGuaranteeDescription', data.NoGuaranteeDescription);
        }
    }

    public onProductCodeReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.ProductCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.ProductDesc);
        }
    }

    public onEmployeeCodeReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceSalesEmployee', data.ServiceSalesEmployee || data.EmployeeCode || data.fullObject.EmployeeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', data.EmployeeSurname);
        }
    }

    public onServiceTypeReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeCode', data.ServiceTypeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', data.ServiceTypeDesc);
        }
    }

    public onTaxCodeReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TaxCode', data.TaxCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TaxCodeDesc', data.TaxCodeDesc);
        }
    }

    public onCancel(event: any): void {
        this.uiForm.setValue(this.formRawClone);
        this.fetchTranslationContent();
        this.fetchServiceCoverPost('Abandon', {}, { dlBatchRef: this.otherVariables['dlBatchRef'], dlServiceCoverRef: this.otherVariables['dlServiceCoverRef'], SubSystem: this.otherVariables['SubSystem'] || 'SalesOrder' }).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (!data['errorMessage']) {
                    // statement
                }
            }
        });
        this.formPristine();
    }

    public onSave(event: any): void {
        let result = this.beforeSave();
        if (result) {
            this.promptModal.show();
        }
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

    public promptSave(event: any): void {
        let obj = {};
        for (let i = 0; i < 14; i++) {
            obj['WindowStarth' + this.leftPad(i + 1)] = this.riExchange.riInputElement.GetValue(this.uiForm, 'WindowStarth' + this.leftPad(i + 1));
            obj['WindowStartm' + this.leftPad(i + 1)] = this.riExchange.riInputElement.GetValue(this.uiForm, 'WindowStartm' + this.leftPad(i + 1));
            obj['WindowEndh' + this.leftPad(i + 1)] = this.riExchange.riInputElement.GetValue(this.uiForm, 'WindowEndh' + this.leftPad(i + 1));
            obj['WindowEndm' + this.leftPad(i + 1)] = this.riExchange.riInputElement.GetValue(this.uiForm, 'WindowEndm' + this.leftPad(i + 1));
        }
        this.fetchServiceCoverPost('', { action: 2 }, Object.assign({}, obj, {
            dlServiceCoverROWID: this.otherVariables['dlServiceCover'],
            dlBatchRef: this.otherVariables['dlBatchRef'],
            dlRecordType: this.otherVariables['dlRecordType'],
            dlExtRef: this.otherVariables['dlExtRef'],
            dlMasterExtRef: this.otherVariables['dlMasterExtRef'],
            dlStatusCode: this.otherVariables['dlStatusCode'],
            dlStatusDesc: this.otherVariables['dlStatusDesc'],
            dlRejectionCode: this.otherVariables['dlRejectionCode'],
            dlRejectionDesc: this.otherVariables['dlRejectionDesc'],
            dlPremiseRef: this.otherVariables['dlPremiseRef'],
            dlServiceCoverRef: this.otherVariables['dlServiceCoverRef'],
            UpdateableInd: this.otherVariables['UpdateableInd'],
            ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
            AccessHireValue: this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessHireValue', MntConst.eTypeCurrency),
            BranchServiceAreaCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode'),
            BusinessOriginCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode'),
            BusinessOriginDetailCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginDetailCode'),
            BusinessOriginDetailReq: this.otherVariables['BusinessOriginDetailReq'],
            ChargeRateCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ChargeRateCode'),
            ContractTypeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode'),
            MaterialsDesc: this.riExchange.riInputElement.GetValue(this.uiForm, 'MaterialsDesc'),
            MaterialsValue: this.riExchange.riInputElement.GetValue(this.uiForm, 'MaterialsValue', MntConst.eTypeCurrency),
            AnnualValueChange: this.riExchange.riInputElement.GetValue(this.uiForm, 'AnnualValueChange', MntConst.eTypeCurrency),
            InitialValue: this.riExchange.riInputElement.GetValue(this.uiForm, 'InitialValue', MntConst.eTypeCurrency),
            ServiceBranchNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'),
            ServiceCommenceDate: this.otherVariables['ServiceCommenceDate'],
            ServiceQuantityChange: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceQuantityChange'),
            ServiceSalesEmployee: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSalesEmployee'),
            ServiceSpecialInstructions: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSpecialInstructions'),
            ServiceTypeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceTypeCode'),
            ServiceVisitFrequency: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitFrequency'),
            SOServiceCoverNumber: this.otherVariables['SOServiceCoverNumber'],
            StandardTimeInd: this.otherVariables['StandardTimeInd'] ? 'yes' : 'no',
            StandardTreatmentTime: this.riExchange.riInputElement.GetValue(this.uiForm, 'StandardTreatmentTime', MntConst.eTypeTime),
            TaxCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'TaxCode'),
            TotalValue: this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalValue', MntConst.eTypeCurrency),
            CalculatedDiscount: this.riExchange.riInputElement.GetValue(this.uiForm, 'CalculatedDiscount'),
            DiscountReason: this.riExchange.riInputElement.GetValue(this.uiForm, 'DiscountReason'),
            GuaranteeRequired: this.riExchange.riInputElement.GetValue(this.uiForm, 'GuaranteeRequired') ? 'yes' : 'no',
            NoGuaranteeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'NoGuaranteeCode'),
            NumberBedrooms: this.riExchange.riInputElement.GetValue(this.uiForm, 'NumberBedrooms'),
            AgeofProperty: this.riExchange.riInputElement.GetValue(this.uiForm, 'AgeofProperty'),
            ListedCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ListedCode'),
            DetailRequired: this.otherVariables['DetailRequired'],
            QuantityRequired: this.otherVariables['QuantityRequired'],
            InfoMessage: this.otherVariables['InfoMessage'],
            SubSystem: this.otherVariables['SubSystem']
        })).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (data['errorMessage']) {
                    this.errorService.emitError(data);
                } else {
                    this.formRawClone = JSON.parse(JSON.stringify(this.uiForm.getRawValue()));
                    this.otherVariables['InfoMessage'] = data['InfoMessage'];
                }
                this.formPristine();
                this.afterSave();
            }
        });
    }

    public onPrepFilterKeyDown(event: any): void {
        event = event || window.event;
        if (event.keyCode === 13) {
            this.loadGridViewB();
        }
    }

    public onSDFilterKeyDown(event: any): void {
        event = event || window.event;
        if (event.keyCode === 13) {
            this.loadGridViewA();
        }
    }

    private fetchDescriptions(): void {
        let data = [
            {
                'table': 'BusinessOrigin',
                'query': { 'BusinessOriginCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BusinessOriginSystemDesc']
            },
            {
                'table': 'ChargeRate',
                'query': { 'ChargeRateCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ChargeRateCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ChargeRateDesc']
            },
            {
                'table': 'TaxCode',
                'query': { 'TaxCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'TaxCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['TaxCodeDesc']
            },
            {
                'table': 'ServiceType',
                'query': { 'ServiceTypeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceTypeCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ServiceTypeDesc']
            },
            {
                'table': 'Employee',
                'query': { 'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSalesEmployee'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['EmployeeSurname']
            },
            {
                'table': 'Product',
                'query': { 'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ProductDesc', 'WasteTransferRequired']
            },
            {
                'table': 'Branch',
                'query': { 'BranchNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BranchName']
            },
            {
                'table': 'BranchServiceArea',
                'query': { 'BranchNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'), 'BranchServiceAreaCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BranchServiceAreaDesc', 'EmployeeCode']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDesc', e['results'][0][0].BusinessOriginSystemDesc);
                    }
                    if (e['results'][1].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ChargeRateDesc', e['results'][1][0].ChargeRateDesc);
                    }
                    if (e['results'][2].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'TaxCodeDesc', e['results'][2][0].TaxCodeDesc);
                    }
                    if (e['results'][3].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', e['results'][3][0].ServiceTypeDesc);
                    }
                    if (e['results'][4].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', e['results'][4][0].EmployeeSurname);
                    }
                    if (e['results'][5].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', e['results'][5][0].ProductDesc);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'WasteTransferRequired', e['results'][5][0].WasteTransferRequired);
                    }
                    if (e['results'][6].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchName', e['results'][6][0].BranchName);
                    }
                    if (e['results'][7].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', e['results'][7][0].BranchServiceAreaDesc);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceEmployeeCode', e['results'][7][0].EmployeeCode);
                        this.fetchServiceEmployeeDesc();
                    }

                    this.ellipsis['serviceArea']['inputParams']['ServiceBranchNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber');
                    this.ellipsis['serviceArea']['inputParams']['BranchName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchName');
                }
                this.afterFetch();
            }, (error) => {
                // error statement
            });
    }

    private fetchServiceEmployeeDesc(): void {
        let data = [
            {
                'table': 'Employee',
                'query': { 'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceEmployeeCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['EmployeeSurname']
            }
        ];
        this.lookUpRecord(data, 5).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceEmployeeSurname', e['results'][0][0].EmployeeSurname);
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceEmployeeSurname', '');
                    }
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceEmployeeSurname', '');
                }
                this.formRawClone = JSON.parse(JSON.stringify(this.uiForm.getRawValue()));
            }, (error) => {
                // error statement
            });
    }

    private checkGuaranteeRequiredInd(): void {
        this.fetchServiceCoverPost('CheckGuaranteeRequiredInd', { ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') }, {}).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (!data['errorMessage']) {
                    if (data['GuaranteeRequiredInd'].toUpperCase() === 'Y') {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'GuaranteeRequired', true);
                        this.guaranteeToggle();
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'GuaranteeRequired', false);
                    }
                }
            }
        });
    }

    private disableTimeWindows(): void {
        for (let i = 0; i < 14; i++) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'WindowStarth' + this.leftPad(i + 1));
            this.riExchange.riInputElement.Disable(this.uiForm, 'WindowStartm' + this.leftPad(i + 1));
            this.riExchange.riInputElement.Disable(this.uiForm, 'WindowEndh' + this.leftPad(i + 1));
            this.riExchange.riInputElement.Disable(this.uiForm, 'WindowEndm' + this.leftPad(i + 1));
        }
    }

    private enableTimeWindows(): void {
        for (let i = 0; i < 14; i++) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'WindowStarth' + this.leftPad(i + 1));
            this.riExchange.riInputElement.Enable(this.uiForm, 'WindowStartm' + this.leftPad(i + 1));
            this.riExchange.riInputElement.Enable(this.uiForm, 'WindowEndh' + this.leftPad(i + 1));
            this.riExchange.riInputElement.Enable(this.uiForm, 'WindowEndm' + this.leftPad(i + 1));
        }
    }

    private setTimeWindows(): void {
        // statement
    }

    private checkWindow(): void {
        // statement
    }

    private addHOptions(): void {
        let arr = [];
        for (let j = 0; j < 24; j++) {
            arr.push({
                text: this.leftPad(j),
                value: this.leftPad(j)
            });
        }
        for (let i = 0; i < 14; i++) {
            this.dropdownList['WindowStarth' + this.leftPad(i + 1)] = arr;
            this.dropdownList['WindowEndh' + this.leftPad(i + 1)] = arr;
        }
    }

    private addMOptions(): void {
        let arr = [];
        let i = 0;
        while (i < 60) {
            arr.push({
                text: this.leftPad(i),
                value: this.leftPad(i)
            });
            i = i + 15;
        }
        for (let j = 0; j < 14; j++) {
            this.dropdownList['WindowStartm' + this.leftPad(j + 1)] = arr;
            this.dropdownList['WindowEndm' + this.leftPad(j + 1)] = arr;
        }
    }

    private leftPad(n: number): string {
        return n > 9 ? '' + n : '0' + n;
    }

    private setDiscountReasonRequired(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DiscountReason', false);
        this.fieldRequired.DiscountReason = false;
        if (parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalValue', MntConst.eTypeCurrency), 10) > parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'AnnualValueChange', MntConst.eTypeCurrency), 10)) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DiscountReason', true);
            this.fieldRequired.DiscountReason = true;
        } else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DiscountReason', false);
            this.fieldRequired.DiscountReason = false;
        }
    }

    public onChargeRateCodeReceived(data: Object): void {
        if (data) {
            this.setControlValue('ChargeRateCode', data['ChargeRateCode']);
            this.setControlValue('ChargeRateDesc', data['ChargeRateDesc']);
            if (data['ChargeRateCode']) {
                this.dropdown['chargeRateCode'].isTriggerValidate = false;
            }
        }
    }

    private setMaterialsDescRequired(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MaterialsDesc', false);
        if (this.riExchange.riInputElement.isCorrect(this.uiForm, 'MaterialsValue')) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'MaterialsValue') === null || this.riExchange.riInputElement.GetValue(this.uiForm, 'MaterialsValue') === undefined) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'MaterialsValue', '0');
            }
            if (parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'MaterialsValue'), 10) > 0) {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MaterialsDesc', true);
            } else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MaterialsDesc', false);
            }
        }
    }

    private afterFetch(): void {
        if (!this.otherVariables['storeInitialRefs']) {
            this.otherVariables['InitialdlMasterExtRef'] = this.otherVariables['dlMasterExtRef'];
            if (this.otherVariables['InitialdlMasterExtRef'] === '') {
                this.fieldVisibility.tdViewOriginal = false;
            } else {
                this.fieldVisibility.tdViewOriginal = true;
            }
            this.otherVariables['storeInitialRefs'] = true;
        }
        this.setBusinessOriginDetailReq();
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AnnualValueChange', true);
        this.fieldRequired.AnnualValueChange = true;
        this.fieldVisibility.AnnualValueChange = true;
        if (this.otherVariables['QuantityRequired'] === true || this.otherVariables['QuantityRequired'].toString().toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.fieldVisibility.ServiceQuantityChange = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceQuantityChange', true);
            this.fieldRequired.ServiceQuantityChange = true;
        } else {
            this.fieldVisibility.ServiceQuantityChange = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceQuantityChange', false);
            this.fieldRequired.ServiceQuantityChange = false;
        }
        if (this.otherVariables['DetailRequired'].toUpperCase() === GlobalConstant.Configuration.Yes || this.otherVariables['DetailRequired'].toUpperCase() === 'Y') {
            this.loadGridViewA();
        }
        if (this.syschars['vSCEnablePreps']) {
            this.loadGridViewB();
        }
        this.onBusinessOriginCodeChange({});
        //this.disableTimeWindows();
        this.setTimeWindows();
        this.otherVariables['blnCalcDiscountOnly'] = true;
        if (this.otherVariables['UpdateableInd'].toString().toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.otherVariables['UpdateableIndBoolean'] = true;
        } else {
            this.otherVariables['UpdateableIndBoolean'] = false;
            this.uiForm.disable();
        }
        //this.guaranteeToggle();
    }

    private beforeUpdate(): void {
        this.setBusinessOriginDetailReq();
        this.riExchange.riInputElement.Disable(this.uiForm, 'ViewOriginal');
        this.otherVariables['blnCalcDiscountOnly'] = false;
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductCode');
        this.setTimeWindows();
        this.enableTimeWindows();
        if (this.otherVariables['QuantityRequired'] === true || this.otherVariables['QuantityRequired'].toString().toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.fieldRequired.ServiceQuantityChange = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceQuantityChange', true);
        } else {
            this.fieldRequired.ServiceQuantityChange = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceQuantityChange', false);
        }
        setTimeout(() => {
            if (document.getElementById('ServiceVisitFrequency'))
                document.getElementById('ServiceVisitFrequency').focus();
        }, 0);
    }

    private beforeSave(): boolean {
        //this.formRawClone = JSON.parse(JSON.stringify(this.uiForm.getRawValue()));
        //this.setBusinessOriginDetailReq();
        for (let i in this.uiForm.controls) {
            if (this.uiForm.controls.hasOwnProperty(i)) {
                this.uiForm.controls[i].markAsTouched();
                if (!this.uiForm.controls[i].enabled) {
                    this.uiForm.controls[i].clearValidators();
                }
                this.uiForm.controls[i].updateValueAndValidity();
            }
        }
        this.dropdown['chargeRateCode'].isTriggerValidate = true;
        this.uiForm.updateValueAndValidity();
        return this.uiForm.valid;
    }

    private afterSave(): void {
        this.riExchange.riInputElement.Enable(this.uiForm, 'ViewOriginal');
        //this.disableTimeWindows();
        if (this.otherVariables['InfoMessage']) {
            this.messageService.emitMessage({
                title: 'Message',
                msg: this.otherVariables['InfoMessage']
            });
        }
    }

    private setBusinessOriginDetailReq(): void {
        if (this.otherVariables['BusinessOriginDetailReq'] && this.otherVariables['BusinessOriginDetailReq'].toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.fieldVisibility.BusinessOriginDetailCode = true;
            this.fieldRequired.BusinessOriginDetailCode = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BusinessOriginDetailCode', true);
        } else {
            this.fieldVisibility.BusinessOriginDetailCode = false;
            this.fieldRequired.BusinessOriginDetailCode = false;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDetailCode', '');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BusinessOriginDetailCode', false);
        }
    }

    private postInit(): void {
        Observable.forkJoin(
            this.fetchServiceCoverPost('Request', { BranchNumber: this.utils.getBranchCode() }, {}),
            this.fetchServiceCoverGet('', { Mode: 'CheckBranchUserRights', action: '0' }),
            this.triggerFetchSysChar(),
            this.fetchServiceCoverPost('', { action: '0', dlServiceCoverROWID: this.riExchange.getParentHTMLValue('dlServiceCoverRowID') || this.riExchange.GetParentHTMLInputElementAttribute('Misc', 'dlServiceCoverRowID') }, { SubSystem: this.otherVariables['SubSystem'] || 'SalesOrder' })
        ).subscribe((data: any) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0]['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (!(data[0]['errorMessage'] || data[0]['fullError'])) {
                    this.otherVariables['boolPropertyCareInd'] = data[0]['PropertyCareInd'];
                    if (data[0]['AllowUpdateInd'].toUpperCase() === 'N') {
                        this.riExchange.riInputElement.Disable(this.uiForm, 'GuaranteeRequired');
                    }
                }
            }

            if (data[1]['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data[1]['oResponse']);
            } else {
                if (!(data[1]['errorMessage'] || data[1]['fullError'])) {
                    this.otherVariables['boolUserWriteAccess'] = data[1]['WriteAccess'];
                    if (this.otherVariables['boolPropertyCareInd'].toUpperCase() === 'Y' && this.otherVariables['boolUserWriteAccess'].toUpperCase() === GlobalConstant.Configuration.Yes) {
                        this.fieldVisibility.GuaranteeRequired = true;
                    } else {
                        this.fieldVisibility.GuaranteeRequired = false;
                    }
                }
            }
            if (data[2].errorMessage || data[2].fullError) {
                this.errorService.emitError({
                    errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                });
                return false;
            }
            if (data[2].records && data[2].records.length > 0) {
                this.syschars['vSCEnableInitialCharge'] = data[2].records[0].Required;
                this.syschars['vSCEnablePreps'] = data[2].records[1].Required;

                if (this.syschars['vSCEnableInitialCharge'] && this.otherVariables['CurrentContractType'] === 'C') {
                    this.fieldVisibility.InitialValue = true;
                }
            }
            if (data[3]['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data[3]['oResponse']);
            } else {
                if (!(data[3]['errorMessage'] || data[3]['fullError'])) {
                    for (let i in data[3]) {
                        if (data[3].hasOwnProperty(i)) {
                            this.otherVariables[i] = data[3][i];
                            if (this.uiForm.controls[i] !== undefined && this.uiForm.controls[i] !== null) {
                                this.riExchange.riInputElement.SetValue(this.uiForm, i, data[3][i].trim());
                                if (data[3][i].toUpperCase() === GlobalConstant.Configuration.Yes) {
                                    this.riExchange.riInputElement.SetValue(this.uiForm, i, true);
                                } else if (data[3][i].toUpperCase() === GlobalConstant.Configuration.No) {
                                    this.riExchange.riInputElement.SetValue(this.uiForm, i, false);
                                }
                            }
                        }
                    }
                    //this.riExchange.riInputElement.SetValue(this.uiForm, 'dlPremiseRef', data[3]['dlExtRef']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'StandardTreatmentTime', data[3]['StandardTreatmentTime']);
                }
            }
            if (this.getControlValue('ChargeRateCode')) {
                this.onChargeRateCodeChange({});
            }
            this.beforeUpdate();
            this.checkGuaranteeRequiredInd();
            this.buildTabs();
            this.fetchDescriptions();
            this.addHOptions();
            this.addMOptions();
            this.formRawClone = JSON.parse(JSON.stringify(this.uiForm.getRawValue()));
            switch (this.parentMode) {
                case 'ServiceCoverUpdate':
                    this.otherVariables['dlServiceCover'] = this.riExchange.getParentHTMLValue('dlServiceCoverRowID') || this.riExchange.GetParentHTMLInputElementAttribute('Misc', 'dlServiceCoverRowID');
                    this.buildTabs();
                    this.setDiscountReasonRequired();
                    this.setMaterialsDescRequired();
                    break;

                default:
                    // code...
                    break;
            }

        }, (error) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.errorService.emitError({
                errorMessage: error['errorMessage'] || ErrorConstant.Message.UnexpectedError,
                fullError: error['fullError']
            });
            return;
        });
    }

    private buildTabs(): void {
        this.uiDisplay.tab.tab1.visible = true;
        this.uiDisplay.tab.tab3.visible = true;
        if (this.otherVariables['DetailRequired'].toUpperCase() === GlobalConstant.Configuration.Yes || this.otherVariables['DetailRequired'].toUpperCase() === 'Y') {
            this.uiDisplay.tab.tab4.visible = true;
        }
        if (this.syschars['vSCEnablePreps']) {
            this.uiDisplay.tab.tab5.visible = true;
        }
        if (this.otherVariables['boolPropertyCareInd'].toUpperCase() === 'Y' && this.otherVariables['boolUserWriteAccess'].toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.uiDisplay.tab.tab2.visible = true;
        } else {
            this.uiDisplay.tab.tab2.visible = false;
        }
        this.uiDisplay.tab.tab6.visible = true;
        this.uiDisplay.tab.tab7.visible = true;
    }

    private fetchServiceCoverGet(functionName: string, params: Object): any {
        let queryServiceCover = new URLSearchParams();
        queryServiceCover.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryServiceCover.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            queryServiceCover.set(this.serviceConstants.Action, '6');
            queryServiceCover.set('Function', functionName);
        }
        for (let key in params) {
            if (key) {
                queryServiceCover.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.requestParams.method, this.requestParams.module, this.requestParams.operation, queryServiceCover);
    }

    private fetchServiceCoverPost(functionName: string, params: Object, formData: Object): any {
        let queryServiceCover = new URLSearchParams();
        queryServiceCover.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryServiceCover.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            queryServiceCover.set(this.serviceConstants.Action, '6');
            formData['Function'] = functionName;
        }
        for (let key in params) {
            if (key) {
                queryServiceCover.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.requestParams.method, this.requestParams.module, this.requestParams.operation, queryServiceCover, formData);
    }

    private sysCharParameters(): string {
        let sysCharList = [
            this.sysCharConstants.SystemCharEnableInitialCharge,
            this.sysCharConstants.SystemCharEnablePreps
        ];
        return sysCharList.join(',');
    }

    private triggerFetchSysChar(): any {
        return this.fetchSysChar(this.sysCharParameters());
    }

    private fetchSysChar(sysCharNumbers: any): any {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
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
        this.getTranslatedValue('Advantage Service Cover Maintenance', null).subscribe((res: string) => {
            if (res) {
                this.titleService.setTitle(res);
            }
        });
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
        if (this.otherVariables['CurrentContractType'] === 'J') {
            this.getTranslatedValue('Agreed Value', null).subscribe((res: string) => {
                if (res) {
                    this.otherVariables['AnnualValueChangeLabel'] = res;
                }
            });
        } else {
            this.getTranslatedValue('Agreed Annual Value', null).subscribe((res: string) => {
                if (res) {
                    this.otherVariables['AnnualValueChangeLabel'] = res;
                }
            });
        }
    }

    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        this.routeAwayGlobals.setSaveEnabledFlag(this.uiForm.dirty);
        return this.routeAwayComponent.canDeactivate();
    }

}

//http://localhost:3000/#/maintenance/dlservicecover?parentMode=ServiceCoverUpdate&dlServiceCoverRowID=0x0000000008967604&ContractTypeCode=C&DetailRequired=Y&dlPremiseRef=00042715-0001-0001&SubSystem=SalesOrder
//http://localhost:3000/#/maintenance/dlservicecover?parentMode=ServiceCoverUpdate&dlServiceCoverRowID=0x0000000000d5cf21&ContractTypeCode=C&DetailRequired=Y&dlPremiseRef=00043552-0001-0001&SubSystem=SalesOrder
