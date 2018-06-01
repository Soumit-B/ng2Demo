import { Component, OnInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { PlanVisitSearchComponent } from '../../internal/search/iCABSSePlanVisitSearch.component';
import { ServiceCoverDetailsComponent } from '../../internal/search/iCABSAServiceCoverDetailSearch.component';

@Component({
    templateUrl: 'iCABSSeCreditServiceVisitGroupMaintenance.html'
})

export class CreditServiceVisitGroupMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    private queryParams: any = {
        operation: 'Service/iCABSSeCreditServiceVisitGroupMaintenance',
        module: 'service',
        method: 'service-delivery/maintenance'
    };

    public pageId: string = '';
    public controls: Array<any> = [
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc', type: MntConst.eTypeText },
        { name: 'CreditNumberOfVisits', type: MntConst.eTypeInteger },
        { name: 'ProRataChargeValue', type: MntConst.eTypeCurrency },
        { name: 'PlanVisitNumber1', type: MntConst.eTypeInteger },
        { name: 'ServiceDateStart1', type: MntConst.eTypeDate },
        { name: 'StandardRateCharge1', type: MntConst.eTypeCurrency },
        { name: 'PlanVisitNumber2', type: MntConst.eTypeInteger },
        { name: 'ServiceDateStart2', type: MntConst.eTypeDate },
        { name: 'StandardRateCharge2', type: MntConst.eTypeCurrency },
        { name: 'PlanVisitNumber3', type: MntConst.eTypeInteger },
        { name: 'ServiceDateStart3', type: MntConst.eTypeDate },
        { name: 'StandardRateCharge3', type: MntConst.eTypeCurrency },
        { name: 'PlanVisitNumber4', type: MntConst.eTypeInteger },
        { name: 'ServiceDateStart4', type: MntConst.eTypeDate },
        { name: 'StandardRateCharge4', type: MntConst.eTypeCurrency },
        { name: 'PlanVisitNumber5', type: MntConst.eTypeInteger },
        { name: 'ServiceDateStart5', type: MntConst.eTypeDate },
        { name: 'StandardRateCharge5', type: MntConst.eTypeCurrency },
        { name: 'PlanVisitNumber6', type: MntConst.eTypeInteger },
        { name: 'ServiceDateStart6', type: MntConst.eTypeDate },
        { name: 'StandardRateCharge6', type: MntConst.eTypeCurrency },
        { name: 'PlanVisitNumber7', type: MntConst.eTypeInteger },
        { name: 'ServiceDateStart7', type: MntConst.eTypeDate },
        { name: 'StandardRateCharge7', type: MntConst.eTypeCurrency },
        { name: 'PlanVisitNumber8', type: MntConst.eTypeInteger },
        { name: 'ServiceDateStart8', type: MntConst.eTypeDate },
        { name: 'StandardRateCharge8', type: MntConst.eTypeCurrency },
        { name: 'PlanVisitNumber9', type: MntConst.eTypeInteger },
        { name: 'ServiceDateStart9', type: MntConst.eTypeDate },
        { name: 'StandardRateCharge9', type: MntConst.eTypeCurrency },
        { name: 'PlanVisitNumber10', type: MntConst.eTypeInteger },
        { name: 'ServiceDateStart10', type: MntConst.eTypeDate },
        { name: 'StandardRateCharge10', type: MntConst.eTypeCurrency }
    ];
    public ellipsisParams: any = {
        planVisitNumber: {
            showCloseButton: true,
            showHeader: true,
            disabled: false,
            childConfigParams: {
                Number1: {
                    parentMode: 'Credit-LookUp1',
                    ContractNumber: '',
                    ContractName: '',
                    PremiseNumber: '',
                    PremiseName: '',
                    ProductCode: '',
                    ProductDesc: '',
                    ServiceCoverRowID: ''
                },
                Number2: {
                    parentMode: 'Credit-LookUp2',
                    ContractNumber: '',
                    ContractName: '',
                    PremiseNumber: '',
                    PremiseName: '',
                    ProductCode: '',
                    ProductDesc: '',
                    ServiceCoverRowID: ''
                },
                Number3: {
                    parentMode: 'Credit-LookUp3',
                    ContractNumber: '',
                    ContractName: '',
                    PremiseNumber: '',
                    PremiseName: '',
                    ProductCode: '',
                    ProductDesc: '',
                    ServiceCoverRowID: ''
                },
                Number4: {
                    parentMode: 'Credit-LookUp4',
                    ContractNumber: '',
                    ContractName: '',
                    PremiseNumber: '',
                    PremiseName: '',
                    ProductCode: '',
                    ProductDesc: '',
                    ServiceCoverRowID: ''
                },
                Number5: {
                    parentMode: 'Credit-LookUp5',
                    ContractNumber: '',
                    ContractName: '',
                    PremiseNumber: '',
                    PremiseName: '',
                    ProductCode: '',
                    ProductDesc: '',
                    ServiceCoverRowID: ''
                },
                Number6: {
                    parentMode: 'Credit-LookUp6',
                    ContractNumber: '',
                    ContractName: '',
                    PremiseNumber: '',
                    PremiseName: '',
                    ProductCode: '',
                    ProductDesc: '',
                    ServiceCoverRowID: ''
                },
                Number7: {
                    parentMode: 'Credit-LookUp7',
                    ContractNumber: '',
                    ContractName: '',
                    PremiseNumber: '',
                    PremiseName: '',
                    ProductCode: '',
                    ProductDesc: '',
                    ServiceCoverRowID: ''
                },
                Number8: {
                    parentMode: 'Credit-LookUp8',
                    ContractNumber: '',
                    ContractName: '',
                    PremiseNumber: '',
                    PremiseName: '',
                    ProductCode: '',
                    ProductDesc: '',
                    ServiceCoverRowID: ''
                },
                Number9: {
                    parentMode: 'Credit-LookUp9',
                    ContractNumber: '',
                    ContractName: '',
                    PremiseNumber: '',
                    PremiseName: '',
                    ProductCode: '',
                    ProductDesc: '',
                    ServiceCoverRowID: ''
                },
                Number10: {
                    parentMode: 'Credit-LookUp10',
                    ContractNumber: '',
                    ContractName: '',
                    PremiseNumber: '',
                    PremiseName: '',
                    ProductCode: '',
                    ProductDesc: '',
                    ServiceCoverRowID: ''
                }
            },
            contentComponent: PlanVisitSearchComponent
        },
        contractNumber: {
            showCloseButton: true,
            showHeader: true,
            disabled: false,
            childConfigParams: {
                parentMode: 'LookUp',
                CurrentContractTypeURLParameter: ''
            },
            contentComponent: ContractSearchComponent,
            showEllipsis: false
        },
        premiseNumber: {
            showCloseButton: true,
            showHeader: true,
            disabled: false,
            childConfigParams: {
                parentMode: 'LookUp',
                CurrentContractTypeURLParameter: '',
                ContractNumber: '',
                ContractName: ''
            },
            contentComponent: PremiseSearchComponent,
            showEllipsis: false
        },
        productCode: {
            showCloseButton: true,
            showHeader: true,
            disabled: false,
            childConfigParams: {
                parentMode: 'LookUp',
                CurrentContractTypeURLParameter: '',
                ContractNumber: '',
                ContractName: '',
                PremiseNumber: '',
                PremiseName: ''
            },
            contentComponent: ServiceCoverDetailsComponent,
            showEllipsis: false
        },
        common: {
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            }
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSECREDITSERVICEVISITGROUPMAINTENANCE;
        this.pageParams.isDisableSave = false;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.onWindowLoad();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private onWindowLoad(): void {
        this.setCurrentContractType();
        this.utils.setTitle('^1^ Credit Visit Group Maintenance', '^1^', this.pageParams.currentContractTypeLabel);

        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.setControlValue('ProRataChargeValue', this.riExchange.getParentHTMLValue('ProRataChargeValue'));
        this.setControlValue('CreditNumberOfVisits', this.riExchange.getParentHTMLValue('CreditNumberOfVisits'));

        this.setAttribute('ServiceCoverRowID', this.riExchange.getParentAttributeValue('ServiceCoverRowID'));
        this.setAttribute('ProRataChargeRowID', this.riExchange.getParentAttributeValue('ProRataChargeROWID'));
        this.disableControl('ContractName', true);
        this.disableControl('PremiseName', true);
        this.disableControl('ProductDesc', true);
        this.disableControl('CreditNumberOfVisits', true);
        this.disableControl('ProRataChargeValue', true);

        if (this.parentMode === 'CreditMissedService') {
            this.disableControl('ContractNumber', true);
            this.disableControl('PremiseNumber', true);
            this.disableControl('ProductCode', true);

            this.ellipsisParams.contractNumber.showEllipsis = false;
            this.ellipsisParams.premiseNumber.showEllipsis = false;
            this.ellipsisParams.productCode.showEllipsis = false;

            this.getPlanVisits();
        } else {
            this.setControlRequiredStatus('ContractNumber', true);
            this.setControlRequiredStatus('PremiseNumber', true);
            this.setControlRequiredStatus('ProductCode', true);

            this.ellipsisParams.contractNumber.showEllipsis = true;
            this.ellipsisParams.premiseNumber.showEllipsis = true;
            this.ellipsisParams.productCode.showEllipsis = true;

            this.getLookupData('A');

            this.ellipsisParams.contractNumber.childConfigParams.CurrentContractTypeURLParameter = this.pageParams.currentContractTypeURLParameter;
            this.ellipsisParams.premiseNumber.childConfigParams.CurrentContractTypeURLParameter = this.pageParams.currentContractTypeURLParameter;
            this.ellipsisParams.productCode.childConfigParams.CurrentContractTypeURLParameter = this.pageParams.currentContractTypeURLParameter;
        }
        this.setDataToLookupParams();
    }

    private setControlRequiredStatus(ctrlName: string, status: boolean): void {
        this.riExchange.updateCtrl(this.controls, ctrlName, 'required', status);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, ctrlName, status);
    }

    private setCurrentContractType(): void {
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
        this.pageParams.currentContractTypeURLParameter = this.riExchange.getCurrentContractTypeUrlParam();
    }

    private getPlanVisits(): void {
        let formData: any = {};
        let search: URLSearchParams = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'GetPlanVisits';
        formData['CreditNumberOfVisits'] = this.getControlValue('CreditNumberOfVisits');
        formData['ProRataChargeValue'] = this.getControlValue('ProRataChargeValue');
        formData['ServiceCoverRowID'] = this.getAttribute('ServiceCoverRowID');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    this.pageParams.isDisableSave = true;
                } else {
                    this.pageParams.isDisableSave = false;
                    for (let i = 1; i <= 10; i++) {
                        if (data.hasOwnProperty('PlanVisitNumber' + i)) {
                            this.setControlValue('PlanVisitNumber' + i, data['PlanVisitNumber' + i]);
                        }

                        if (data.hasOwnProperty('ServiceDateStart' + i)) {
                            this.setControlValue('ServiceDateStart' + i, this.utils.convertAnyToUKString(data['ServiceDateStart' + i]));
                        }

                        if (data.hasOwnProperty('StandardRateCharge' + i)) {
                            this.setControlValue('StandardRateCharge' + i, this.utils.numToDecimal(data['StandardRateCharge' + i], 2));
                        }
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.pageParams.isDisableSave = true;
            });
    }

    private saveRecord(): void {
        let formData: any = {};
        let search: URLSearchParams = this.getURLSearchParamObject();

        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formData['ProductCode'] = this.getControlValue('ProductCode');
        formData['CreditNumberOfVisits'] = this.getControlValue('CreditNumberOfVisits');
        formData['ProRataChargeValue'] = this.getControlValue('ProRataChargeValue');
        formData['ServiceCoverRowID'] = this.getAttribute('ServiceCoverRowID');
        formData['ProRataChargeRowID'] = this.getAttribute('ProRataChargeRowID');

        for (let i = 1; i <= 10; i++) {
            formData['PlanVisitNumber' + i] = this.getControlValue('PlanVisitNumber' + i);
            formData['ServiceDateStart' + i] = this.getControlValue('ServiceDateStart' + i);
            formData['StandardRateCharge' + i] = this.getControlValue('StandardRateCharge' + i);
        }

        search.set(this.serviceConstants.Action, '1');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                    this.onCancelClick(null);
                    this.formPristine();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private getLookupData(callType: string): void {
        let lookupIPDetails: Array<any> = [];
        let contractIndex: number = -1;
        let premiseIndex: number = -1;
        let productIndex: number = -1;

        if ((callType === 'A' || callType === 'C') && this.getControlValue('ContractNumber')) {
            lookupIPDetails.push({
                'table': 'Contract',
                'query': {
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ContractNumber', 'ContractName']
            });
            contractIndex = lookupIPDetails.length - 1;
        }

        if ((callType === 'A' || callType === 'P') && this.getControlValue('ContractNumber') && this.getControlValue('PremiseNumber')) {
            lookupIPDetails.push({
                'table': 'Premise',
                'query': {
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'BusinessCode': this.businessCode()
                },
                'fields': ['PremiseNumber', 'PremiseName']
            });
            premiseIndex = lookupIPDetails.length - 1;
        }

        if ((callType === 'A' || callType === 'S') && this.getControlValue('ProductCode')) {
            lookupIPDetails.push({
                'table': 'Product',
                'query': {
                    'ProductCode': this.getControlValue('ProductCode'),
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ProductCode', 'ProductDesc']
            });
            productIndex = lookupIPDetails.length - 1;
        }

        if (lookupIPDetails.length > 0) {
            this.LookUp.lookUpPromise(lookupIPDetails).then((data) => {
                let contractDetail: any = null;
                let premiseDetail: any = null;
                let productDetail: any = null;

                if ((callType === 'A' || callType === 'C') && contractIndex > -1) { contractDetail = data[contractIndex][0]; }
                if ((callType === 'A' || callType === 'P') && premiseIndex > -1) { premiseDetail = data[premiseIndex][0]; }
                if ((callType === 'A' || callType === 'S') && productIndex > -1) { productDetail = data[productIndex][0]; }

                if (contractDetail && contractDetail.ContractName) {
                    this.setControlValue('ContractName', contractDetail.ContractName);

                    this.ellipsisParams.premiseNumber.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
                    this.ellipsisParams.premiseNumber.childConfigParams.ContractName = this.getControlValue('ContractName');

                    this.ellipsisParams.productCode.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
                    this.ellipsisParams.productCode.childConfigParams.ContractName = this.getControlValue('ContractName');
                }

                if (premiseDetail && premiseDetail.PremiseName) {
                    this.setControlValue('PremiseName', premiseDetail.PremiseName);

                    this.ellipsisParams.productCode.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
                    this.ellipsisParams.productCode.childConfigParams.PremiseName = this.getControlValue('PremiseName');
                }

                if (productDetail && productDetail.ProductDesc) {
                    this.setControlValue('ProductDesc', productDetail.ProductDesc);
                }

                this.setDataToLookupParams();
            });
        }
    }

    private setDataToLookupParams(): void {
        let contractNumber: string = this.getControlValue('ContractNumber');
        let contractName: string = this.getControlValue('ContractName');
        let premiseNumber: string = this.getControlValue('PremiseNumber');
        let premiseName: string = this.getControlValue('PremiseName');
        let productCode: string = this.getControlValue('ProductCode');
        let productDesc: string = this.getControlValue('ProductDesc');
        let serviceCoverRowID: string = this.getAttribute('ServiceCoverRowID');

        for (let index: number = 1; index <= 10; index++) {
            this.ellipsisParams.planVisitNumber.childConfigParams['Number' + index].ContractNumber = contractNumber;
            this.ellipsisParams.planVisitNumber.childConfigParams['Number' + index].ContractName = contractName;
            this.ellipsisParams.planVisitNumber.childConfigParams['Number' + index].PremiseNumber = premiseNumber;
            this.ellipsisParams.planVisitNumber.childConfigParams['Number' + index].PremiseName = premiseName;
            this.ellipsisParams.planVisitNumber.childConfigParams['Number' + index].ProductCode = productCode;
            this.ellipsisParams.planVisitNumber.childConfigParams['Number' + index].ProductDesc = productDesc;
            this.ellipsisParams.planVisitNumber.childConfigParams['Number' + index].ServiceCoverRowID = serviceCoverRowID;
        }
    }

    public onEllipsisDataReceived(type: string, data: any): void {
        if (type.includes('PlanVisitNumber')) {
            let planNumber = type.replace('PlanVisitNumber', '');
            this.setControlValue('PlanVisitNumber' + planNumber, data['PlanVisitNumber' + planNumber]);
            this.setControlValue('ServiceDateStart' + planNumber, data['ServiceDateStart' + planNumber]);
        } else {
            switch (type) {
                case 'ContractNumber':
                    this.setControlValue('ContractNumber', data.ContractNumber || '');
                    this.setControlValue('ContractName', data.ContractName || '');
                    this.ellipsisParams.premiseNumber.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
                    this.ellipsisParams.premiseNumber.childConfigParams.ContractName = this.getControlValue('ContractName');
                    this.ellipsisParams.productCode.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
                    this.ellipsisParams.productCode.childConfigParams.ContractName = this.getControlValue('ContractName');
                    break;
                case 'PremiseNumber':
                    this.setControlValue('PremiseNumber', data.PremiseNumber || '');
                    this.setControlValue('PremiseName', data.PremiseName || '');
                    this.ellipsisParams.productCode.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
                    this.ellipsisParams.productCode.childConfigParams.PremiseName = this.getControlValue('PremiseName');
                    break;
                case 'ProductCode':
                    this.setControlValue('ProductCode', data.ProductCode || '');
                    this.setControlValue('ProductDesc', data.ProductDesc || '');
                    break;
                default:
            }
            this.setDataToLookupParams();
        }
    }

    public onSubmit(event: any): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.saveRecord.bind(this)));
        }
    }

    public onCancelClick(event: any): void {
        for (let i = 1; i <= 10; i++) {
            this.setControlValue('PlanVisitNumber' + i, '');
            this.setControlValue('ServiceDateStart' + i, '');
            this.setControlValue('StandardRateCharge' + i, '');
        }
        this.getPlanVisits();
    }

    public onContractNumberChange(event: Event): void {
        this.setControlValue('ContractName', '');
        this.setControlValue('PremiseNumber', '');
        this.setControlValue('PremiseName', '');
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');

        this.ellipsisParams.premiseNumber.childConfigParams.ContractNumber = this.ellipsisParams.productCode.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsisParams.premiseNumber.childConfigParams.ContractName = this.ellipsisParams.productCode.childConfigParams.ContractName = '';
        this.ellipsisParams.productCode.childConfigParams.PremiseNumber = '';
        this.ellipsisParams.productCode.childConfigParams.PremiseName = '';

        if (this.getControlValue('ContractNumber')) {
            this.getLookupData('C');
        } else {
            this.setDataToLookupParams();
        }
    }

    public onPremiseNumberChange(event: Event): void {
        this.setControlValue('PremiseName', '');
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');

        this.ellipsisParams.productCode.childConfigParams.PremiseNumber = '';
        this.ellipsisParams.productCode.childConfigParams.PremiseName = '';

        if (this.getControlValue('ContractNumber') && this.getControlValue('PremiseNumber')) {
            this.getLookupData('P');
        } else {
            this.setDataToLookupParams();
        }
    }

    public onProductCodeChange(event: Event): void {
        this.setControlValue('ProductDesc', '');

        if (this.getControlValue('ProductCode')) {
            this.getLookupData('S');
        } else {
            this.setDataToLookupParams();
        }
    }
}
