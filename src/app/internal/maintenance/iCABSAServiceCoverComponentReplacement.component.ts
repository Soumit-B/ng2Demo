import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from './../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { InternalSearchModuleRoutes } from './../../base/PageRoutes';
import { InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from './../../../shared/constants/message.constant';

import { BranchServiceAreaSearchComponent } from './../../internal/search/iCABSBBranchServiceAreaSearch';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { PlanVisitSearchComponent } from './../../internal/search/iCABSSePlanVisitSearch.component';
import { ProductSearchGridComponent } from './../../internal/search/iCABSBProductSearch';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';

@Component({
    templateUrl: 'iCABSAServiceCoverComponentReplacement.html'

})
export class ServiceCoverComponentReplacementComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('branchServiceAreaEllipsis') public branchServiceAreaEllipsis: BranchServiceAreaSearchComponent;
    @ViewChild('employeeSearchEllipsis') public employeeSearchEllipsis: EmployeeSearchComponent;
    @ViewChild('planVisitSearchEllipsis') public planVisitSearchEllipsis: PlanVisitSearchComponent;
    @ViewChild('productSearchEllipsis') public productSearchEllipsis: ProductSearchGridComponent;

    public ellipsis: any = {
        productSearch: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'ComponentReplacement',
                SelComponentTypeCode: ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ProductSearchGridComponent,
            showHeader: true,
            searchModalRoute: '',
            isDisabled: true
        },
        alternateProductSearch: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'AlternateComponentReplacement',
                SelComponentTypeCode: '',
                ProductCode: ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ProductSearchGridComponent,
            showHeader: true,
            searchModalRoute: '',
            isDisabled: true
        },
        branch: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp-SC',
                ServiceBranchNumber: '',
                BranchName: ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: BranchServiceAreaSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            isDisabled: true
        },
        employee: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp-Service-All',
                serviceBranchNumber: ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            isDisabled: true
        },
        planVisit: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'ComponentReplacement',
                ServiceCoverRowID: ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: PlanVisitSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            isDisabled: true
        }
    };

    public dropdown: any = {
        reasoncode: {
            inputParams: {
                parentMode: 'LookUpReplace'
            },
            isDisabled: true,
            isRequired: true
        }
    };

    public queryParams: any = {
        operation: 'Application/iCABSAServiceCoverComponentReplacement',
        module: 'components',
        method: 'contract-management/maintenance',
        ActionSearch: '0',
        Actionupdate: '6',
        ActionEdit: '2',
        ActionDelete: '3',
        ActionInsert: '1'
    };

    public controls: Array<any> = [
        { name: 'ContractNumber', disabled: true, type: MntConst.eTypeCode, required: true },
        { name: 'ContractName', disabled: true, type: MntConst.eTypeCode },
        { name: 'ItemDescription', disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseNumber', disabled: true, type: MntConst.eTypeInteger, required: true },
        { name: 'PremiseName', disabled: true, type: MntConst.eTypeCode },
        { name: 'PremiseLocationNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'PremiseLocationDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductCode', disabled: true, type: MntConst.eTypeCode },
        { name: 'ProductDesc', disabled: true, type: MntConst.eTypeCode },
        { name: 'ReplacementReasonCode', disabled: true, type: MntConst.eTypeCode, required: true, commonValidator: true },
        { name: 'ReplacementReasonDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'ComponentTypeCode', disabled: true, type: MntConst.eTypeCode, required: true },
        { name: 'ComponentTypeDesc', disabled: true, type: MntConst.eTypeCode, required: true },
        { name: 'ComponentQuantity', disabled: true, type: MntConst.eTypeInteger, required: true, commonValidator: true },
        { name: 'ProductComponentCode', disabled: true, type: MntConst.eTypeCode, required: true },
        { name: 'ProductComponentDesc', disabled: true, type: MntConst.eTypeCode, required: true },
        { name: 'RemovalQty', disabled: true, type: MntConst.eTypeInteger, required: true, commonValidator: true },
        { name: 'ProductComponentCodeRep', disabled: true, type: MntConst.eTypeCode, commonValidator: true },
        { name: 'AlternateProductCode', disabled: true, type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ReplacementValue', disabled: true, type: MntConst.eTypeCurrency, required: true, commonValidator: true },
        { name: 'ProductComponentDescReplace', disabled: true, type: MntConst.eTypeCode },
        { name: 'ReplacementQty', disabled: true, type: MntConst.eTypeInteger, required: true, commonValidator: true },
        { name: 'VisitDone', disabled: true, type: MntConst.eTypeCode },
        { name: 'VisitDate', disabled: true, required: true, type: MntConst.eTypeDate },
        { name: 'BranchServiceAreaCode', disabled: true, type: MntConst.eTypeCode, required: true, commonValidator: true },
        { name: 'BranchServiceAreaDesc', disabled: true, type: MntConst.eTypeCode },
        { name: 'ServiceEmployeeCode', disabled: true, type: MntConst.eTypeCode, required: true, commonValidator: true },
        { name: 'ServiceEmployeeSurname', disabled: true, type: MntConst.eTypeText },
        { name: 'EmployeeCode', disabled: true, type: MntConst.eTypeCode, required: true, commonValidator: true },
        { name: 'EmployeeSurname', disabled: true, type: MntConst.eTypeText },
        { name: 'ReplacementCost', disabled: true, type: MntConst.eTypeCurrency, commonValidator: true },
        { name: 'VisitRequired', disabled: true },
        { name: 'AdditionalChargeReq', disabled: true },
        /* ===== hidden Text Fields ==== */
        { name: 'ServiceCoverNumber', type: MntConst.eTypeInteger },
        { name: 'ServiceCoverItemNumber', type: MntConst.eTypeInteger },
        { name: 'ServiceCoverComponentNumber', type: MntConst.eTypeInteger },
        { name: 'SelProductCode', type: MntConst.eTypeCode },
        { name: 'SelProductAlternateCode', type: MntConst.eTypeCode },
        { name: 'SelProductDesc', type: MntConst.eTypeCode },
        { name: 'SelComponentTypeCode', type: MntConst.eTypeCode },
        { name: 'ComponentTypeDescLang', type: MntConst.eTypeCode },
        { name: 'LanguageCode', type: MntConst.eTypeCode },
        { name: 'ComponentReplacementNumber', type: MntConst.eTypeInteger },
        { name: 'PlanVisitNumber', type: MntConst.eTypeInteger },
        { name: 'NextVisitDate', type: MntConst.eTypeDate },
        { name: 'ServiceBranchNumber', disabled: true, type: MntConst.eTypeInteger, required: true },
        { name: 'OrigServiceEmployeeCode', type: MntConst.eTypeCode },
        { name: 'OrigServiceEmployeeSurname', type: MntConst.eTypeText },
        { name: 'OrigBranchServiceAreaCode', type: MntConst.eTypeCode },
        { name: 'OrigBranchServiceAreaDesc', type: MntConst.eTypeCode },
        { name: 'OrigEmployeeCode', type: MntConst.eTypeCode },
        { name: 'OrigEmployeeSurname', type: MntConst.eTypeText },
        { name: 'ServiceCoverRowID', disabled: true, type: MntConst.eTypeText, required: true },
        { name: 'PDAVisitRef', type: MntConst.eTypeText },
        { name: 'PDAEmployeeCode', type: MntConst.eTypeCode }
    ];

    public pageId: string;
    public isEnableSave: boolean = false;
    public setFocusOnReason = new EventEmitter<boolean>();
    public setFocusOnProductCompDesc = new EventEmitter<boolean>();

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERCOMPONENTREPLACEMENT;
        this.setBrowserTitle();
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
        } else {
            this.windowOnload();
        }
        this.routeAwayUpdateSaveFlag();
        this.routeAwayGlobals.setEllipseOpenFlag(false);
    }

    ngAfterViewInit(): void {
        this.setBrowserTitle();
        this.pageParams.isBranchServiceAreaCode = false;
        this.pageParams.isServiceEmployeeCode = false;
        this.pageParams.isEmployeeCode = false;
        this.pageParams.isReplacementValue = false;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.routeAwayGlobals.resetRouteAwayFlags();
    }

    public windowOnload(): void {
        this.setCurrentContractType();
        this.setURLQueryParameters(this);

        this.setFormDefaultData();
    }

    public setBrowserTitle(): void {
        this.browserTitle = 'Display Component Replacement';
        this.pageTitle = 'Component Maintenance';
    }

    public setDateFormat(getDate: any): any {
        let dateToString: string = this.globalize.parseDateToFixedFormat(getDate).toString();
        return this.globalize.parseDateStringToDate(dateToString);
    }

    public setCurrentContractType(): void {
        let routeParams: any = this.riExchange.getRouterParams();
        this.pageParams.currentContractType =
            this.utils.getCurrentContractType(routeParams.CurrentContractTypeURLParameter);
        this.pageParams.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(routeParams.currentContractType);
    }

    public getURLQueryParameters(param: any): void {
        this.pageParams.ParentMode = param['parentMode'] || this.riExchange.getParentMode();
    }

    public setFormDefaultData(): void {
        this.riExchange.getParentHTMLValue('ContractNumber');
        this.riExchange.getParentHTMLValue('ContractName');
        this.riExchange.getParentHTMLValue('PremiseNumber');
        this.riExchange.getParentHTMLValue('PremiseName');
        this.riExchange.getParentHTMLValue('ProductCode');
        this.riExchange.getParentHTMLValue('ProductDesc');

        if (this.pageParams.ParentMode !== 'PDAICABSActivity') {
            this.riExchange.getParentHTMLValue('ProductComponentCode');
            this.riExchange.getParentHTMLValue('ProductComponentDesc');
            this.riExchange.getParentHTMLValue('ComponentQuantity');
        }

        this.riExchange.getParentHTMLValue('ServiceCoverItemNumber');
        this.riExchange.getParentHTMLValue('ComponentTypeCode');
        this.ellipsis.productSearch.childConfigParams.SelComponentTypeCode = this.riExchange.getParentHTMLValue('ComponentTypeCode');
        this.ellipsis.alternateProductSearch.childConfigParams.SelComponentTypeCode = this.riExchange.getParentHTMLValue('ComponentTypeCode');
        this.ellipsis.alternateProductSearch.childConfigParams.ProductCode = this.riExchange.getParentHTMLValue('ProductCode');
        this.riExchange.getParentHTMLValue('ComponentTypeDesc');
        this.riExchange.getParentHTMLValue('ItemDescription');
        this.riExchange.getParentHTMLValue('ServiceCoverNumber');
        this.riExchange.getParentHTMLValue('ServiceCoverComponentNumber');
        this.riExchange.getParentHTMLValue('PremiseLocationNumber');
        this.riExchange.getParentHTMLValue('PremiseLocationDesc');

        this.disableControl('ContractName', true);
        this.disableControl('PremiseName', true);
        this.disableControl('ProductDesc', true);

        this.pageParams.isRequired = true;
        this.pageParams.isReadOnly = true;
        this.pageParams.isDateDisabled = true;

        this.getDummyProductCodes();

        if (this.pageParams.ParentMode !== 'PDAICABSActivity') {
            this.pageParams.ComponentReplacementROWID = this.riExchange.getParentAttributeValue('ServiceCoverComponentRowID') || this.riExchange.getParentHTMLValue('ServiceCoverComponentRowID');
            if (this.pageParams.riMaintenanceCurrentMode !== MntConst.eModeDelete)
                this.riMaintenanceAddTableCommit();
        } else {
            if (this.riExchange.getParentHTMLValue('ComponentReplacementNumber')) {
                if (parseFloat(this.riExchange.getParentHTMLValue('ComponentReplacementNumber')) > 0) {
                    this.pageParams.isBranchServiceAreaCode = false;
                    this.pageParams.isServiceEmployeeCode = false;
                    this.riExchange.getParentHTMLValue('ComponentReplacementNumber');
                    this.riExchange.getParentHTMLValue('ContractNumber');
                    this.riExchange.getParentHTMLValue('PremiseNumber');
                    this.riExchange.getParentHTMLValue('ProductCode');
                    this.riExchange.getParentHTMLValue('ServiceCoverNumber');
                    this.riExchange.getParentHTMLValue('ServiceCoverItemNumber');
                    this.riExchange.getParentHTMLValue('ServiceCoverComponentNumber');
                    this.riMaintenanceFetchRecord();
                }
            } else {
                this.riMaintenanceAddMode();
            }
        }
    }

    public riMaintenanceUpdateMode(): void {
        this.pageParams.riMaintenanceCurrentMode = MntConst.eModeUpdate;
    }

    public riMaintenanceAddMode(): void {
        this.pageParams.riMaintenanceCurrentMode = MntConst.eModeAdd;
    }

    public riMaintenanceDeleteMode(): void {
        this.pageParams.riMaintenanceCurrentMode = MntConst.eModeDelete;
    }

    public riMaintenanceExecMode(mode: string): void {
        switch (mode) {
            case 'eModeUpdate':
                this.riMaintenanceBeforeUpdate();
                break;
            case 'eModeAdd':
                this.riMaintenanceBeforeAdd();
                break;
            case 'eModeSaveUpdate':
                this.confirm();
                break;
            case 'eModeSaveAdd':
                this.riMaintenanceBeforeSaveAdd();
                this.confirm();
                break;
            case 'eModeDelete':
                this.confirmDelete();
                break;
        }
    }


    public riMaintenanceExecContinue(mode: string): void {
        switch (mode) {
            case 'eModeSaveUpdate':
                this.riMaintenanceAfterSave();
                break;
            case 'eModeSaveAdd':
                this.riMaintenanceAfterSave();
                break;
            case 'eModeDelete':
                this.riMaintenanceAfterDelete();
                break;
        }
    }


    public riMaintenanceCancelEvent(mode: string): void {
        switch (mode) {
            case 'eModeUpdate':
            case 'eModeSaveUpdate':
                this.isEnableSave = false;
                break;
            case 'eModeAdd':
            case 'eModeSaveAdd':
                this.isEnableSave = false;
                break;
            case 'eModeDelete':
                this.isEnableSave = false;
                break;
        }
    }

    public riMaintenanceFetchRecord(): void {
        this.riMaintenanceAddVirtualTableCommit();
    }

    public riMaintenanceComplete(): void {
        this.riMaintenanceAddTableCommit();
    }

    public riMaintenanceAddTableCommit(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '0');

        search.set('ComponentReplacementROWID', this.pageParams.ComponentReplacementROWID);
        search.set('ContractNumber', this.getControlValue('ContractNumber') || '');
        search.set('PremiseNumber', this.getControlValue('PremiseNumber') || '');
        search.set('ProductCode', this.getControlValue('ProductCode') || '');
        search.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber') || '');
        search.set('ServiceCoverItemNumber', this.getControlValue('ServiceCoverItemNumber') || '');
        search.set('ServiceCoverComponentNumber', this.getControlValue('ServiceCoverComponentNumber') || '');
        search.set('ComponentReplacementNumber', this.getControlValue('ComponentReplacementNumber') || '');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('ProductComponentCode', data.ProductComponentCode || '');
                    this.setControlValue('ProductComponentDesc', data.ProductComponentDesc || '');

                    this.setControlValue('ProductComponentCodeRep', data.ProductComponentCodeRep || '');
                    this.setControlValue('ProductComponentDescReplace', data.ProductComponentDescReplace || '');
                    this.setControlValue('AlternateProductCode', data.AlternateProductCode || '');

                    this.setControlValue('PlanVisitNumber', data.PlanVisitNumber || '');

                    this.setControlValue('AdditionalChargeReq', data.AdditionalChargeReq === 'yes' ? true : false);
                    this.setControlValue('VisitRequired', data.VisitRequired === 'yes' ? true : false);

                    this.setControlValue('ReplacementValue', data.ReplacementValue || '');
                    this.setControlValue('ReplacementCost', data.ReplacementCost || '');

                    this.setControlValue('VisitDate', data.VisitDate ? this.setDateFormat(data.VisitDate) : '');
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'VisitDate', true);
                    this.setControlValue('NextVisitDate', data.NextVisitDate || '');

                    this.setControlValue('ReplacementReasonCode', data.ReplacementReasonCode || '');
                    this.setControlValue('RemovalQty', data.RemovalQty || '');
                    this.setControlValue('ReplacementQty', data.ReplacementQty || '');
                    this.setControlValue('ComponentTypeCode', data.ComponentTypeCode || '');
                    this.ellipsis.productSearch.childConfigParams.SelComponentTypeCode = this.riExchange.getParentHTMLValue('ComponentTypeCode');
                    this.ellipsis.alternateProductSearch.childConfigParams.SelComponentTypeCode = this.riExchange.getParentHTMLValue('ComponentTypeCode');
                    this.ellipsis.alternateProductSearch.childConfigParams.ProductCode = this.riExchange.getParentHTMLValue('ProductCode');
                    this.setControlValue('ComponentTypeDesc', data.ComponentTypeDesc || '');
                    this.setControlValue('ComponentQuantity', data.ComponentQuantity || '');

                    this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode || '');
                    this.setControlValue('BranchServiceAreaDesc', data.BranchServiceAreaDesc || '');

                    this.setControlValue('ServiceBranchNumber', data.ServiceBranchNumber || '');
                    this.ellipsis.employee.childConfigParams.serviceBranchNumber = this.getControlValue('ServiceBranchNumber') || '';
                    this.ellipsis.branch.childConfigParams.ServiceBranchNumber = this.getControlValue('ServiceBranchNumber') || '';
                    this.setControlValue('ServiceEmployeeCode', data.ServiceEmployeeCode || '');
                    this.setControlValue('ServiceEmployeeSurname', data.ServiceEmployeeSurname || '');
                    this.setControlValue('EmployeeCode', data.EmployeeCode || '');
                    this.setControlValue('EmployeeSurname', data.EmployeeSurname || '');
                    this.setControlValue('ReplacementReasonDesc', data.ReplacementReasonDesc || '');
                    this.setControlValue('ServiceCoverRowID', data.ServiceCoverRowID || '');
                    this.setAttribute('ServiceCoverRowID', data.ServiceCoverRowID || '');
                    this.setControlValue('VisitDone', data.VisitDone === 'yes' ? true : false);
                    this.setControlValue('PDAVisitRef', data.PDAVisitRef || '');
                    this.setControlValue('PDAEmployeeCode', data.PDAEmployeeCode || '');
                    this.pageParams.ComponentReplacementNumber = data.ComponentReplacementNumber || '';
                    this.setControlValue('ComponentReplacementNumber', data.ComponentReplacementNumber || '');
                    this.setControlValue('OrigEmployeeCode', data.ServiceEmployeeCode || '');
                    this.setControlValue('OrigEmployeeSurname', data.ServiceEmployeeSurname || '');
                    this.setControlValue('OrigServiceEmployeeCode', data.ServiceEmployeeCode || '');
                    this.setControlValue('OrigServiceEmployeeSurname', data.ServiceEmployeeSurname || '');
                    this.setControlValue('OrigBranchServiceAreaCode', data.BranchServiceAreaCode || '');
                    this.setControlValue('OrigBranchServiceAreaDesc', data.BranchServiceAreaDesc || '');
                    this.pageParams.isReplacementValue = true;
                    this.setPlanVisitEllipsisData();
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }


    public riMaintenanceAddVirtualTableCommit(): void {
        let lookupIP = [
            {
                'table': 'VisitNarrative',
                'query': {
                    'LanguageCode': this.utils.getDefaultLang(),
                    'BusinessCode': this.businessCode(),
                    'VisitNarrativeCode': this.getControlValue('ReplacementReasonCode')
                },
                'fields': ['VisitNarrativeDesc']
            },
            {
                'table': 'BranchServiceArea',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'BranchNumber': this.utils.getBranchCode(),
                    'BranchServiceAreaCode': this.getControlValue('BranchServiceAreaCode')
                },
                'fields': ['BranchServiceAreaDesc']
            },
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'EmployeeCode': this.getControlValue('ServiceEmployeeCode')
                },
                'fields': ['EmployeeSurname']
            },
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'EmployeeCode': this.getControlValue('EmployeeCode')
                },
                'fields': ['EmployeeSurname']
            }
        ];

        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(lookupIP).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                if (data && data.length > 0) {
                    if (data[0] && data[0].length > 0) {
                        this.setControlValue('ReplacementReasonDesc', data[0][0].VisitNarrativeDesc || '');
                    }
                    if (data[1] && data[1].length > 0) {
                        this.setControlValue('BranchServiceAreaDesc', data[1][0].BranchServiceAreaDesc || '');
                    }
                    if (data[2] && data[2].length > 0) {
                        this.setControlValue('ServiceEmployeeSurname', data[2][0].EmployeeSurname || '');
                    }
                    if (data[3] && data[3].length > 0) {
                        this.setControlValue('EmployeeSurname', data[3][0].EmployeeSurname || '');
                    }
                } else {
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
                }
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
        });
    }


    public riMaintenanceBeforeUpdate(): void {
        this.setFocusOnReason.emit(true);
    }

    public riMaintenanceAfterSave(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, this.pageParams.actionAfterSave);

        let postDataAdd: Object = {};
        postDataAdd['ComponentTypeCode'] = this.getControlValue('ComponentTypeCode');
        postDataAdd['ComponentTypeDesc'] = this.getControlValue('ComponentTypeDesc');
        postDataAdd['ComponentQuantity'] = this.getControlValue('ComponentQuantity');
        postDataAdd['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
        postDataAdd['BranchServiceAreaDesc'] = this.getControlValue('BranchServiceAreaDesc');
        postDataAdd['ServiceBranchNumber'] = this.getControlValue('ServiceBranchNumber');
        postDataAdd['ServiceEmployeeCode'] = this.getControlValue('ServiceEmployeeCode');
        postDataAdd['ServiceEmployeeSurname'] = this.getControlValue('ServiceEmployeeSurname');
        postDataAdd['EmployeeCode'] = this.getControlValue('EmployeeCode');
        postDataAdd['EmployeeSurname'] = this.getControlValue('EmployeeSurname');
        postDataAdd['ReplacementReasonDesc'] = this.getControlValue('ReplacementReasonDesc');
        postDataAdd['ItemDescription'] = this.getControlValue('ItemDescription');
        postDataAdd['PremiseLocationNumber'] = this.getControlValue('PremiseLocationNumber');
        postDataAdd['PremiseLocationDesc'] = this.getControlValue('PremiseLocationDesc');
        postDataAdd['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        postDataAdd['PDAVisitRef'] = this.getControlValue('PDAVisitRef');
        postDataAdd['PDAEmployeeCode'] = this.getControlValue('PDAEmployeeCode');
        postDataAdd['ContractNumber'] = this.getControlValue('ContractNumber');
        postDataAdd['PremiseNumber'] = this.getControlValue('PremiseNumber');
        postDataAdd['ProductCode'] = this.getControlValue('ProductCode');
        postDataAdd['ServiceCoverNumber'] = this.getControlValue('ServiceCoverNumber');
        postDataAdd['ServiceCoverItemNumber'] = this.getControlValue('ServiceCoverItemNumber');
        postDataAdd['ServiceCoverComponentNumber'] = this.getControlValue('ServiceCoverComponentNumber');
        postDataAdd['ComponentReplacementNumber'] = this.getControlValue('ComponentReplacementNumber');
        postDataAdd['ProductComponentCode'] = this.getControlValue('ProductComponentCode');
        postDataAdd['ProductComponentDesc'] = this.getControlValue('ProductComponentDesc');
        postDataAdd['ProductComponentCodeRep'] = this.getControlValue('ProductComponentCodeRep');
        postDataAdd['ProductComponentDescReplace'] = this.getControlValue('ProductComponentDescReplace');
        postDataAdd['AlternateProductCode'] = this.getControlValue('AlternateProductCode');
        postDataAdd['PlanVisitNumber'] = this.getControlValue('PlanVisitNumber');
        postDataAdd['VisitDone'] = this.getControlValue('VisitDone') ? 'yes' : 'no';
        postDataAdd['VisitRequired'] = this.getControlValue('VisitRequired') ? 'yes' : 'no';
        postDataAdd['AdditionalChargeReq'] = this.getControlValue('AdditionalChargeReq') ? 'yes' : 'no';
        postDataAdd['ReplacementValue'] = this.getControlValue('ReplacementValue');
        postDataAdd['ReplacementCost'] = this.getControlValue('ReplacementCost');
        postDataAdd['VisitDate'] = this.getControlValue('VisitDate');
        postDataAdd['NextVisitDate'] = this.getControlValue('NextVisitDate');
        postDataAdd['ReplacementReasonCode'] = this.getControlValue('ReplacementReasonCode');
        postDataAdd['RemovalQty'] = this.getControlValue('RemovalQty');
        postDataAdd['ReplacementQty'] = this.getControlValue('ReplacementQty');
        if (this.pageParams.riMaintenanceCurrentMode === MntConst.eModeSaveUpdate)
            postDataAdd['ROWID'] = this.getControlValue('ROWID');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, postDataAdd)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    this.markAsPrestine();
                    this.setControlValue('ComponentReplacementNumber', e.ComponentReplacementNumber);
                    let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully);
                    modalVO.closeCallback = this.riMaintenanceAfterSaveAdd.bind(this);
                    this.modalAdvService.emitMessage(modalVO);
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riMaintenanceAfterDelete(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, this.pageParams.actionAfterDelete);

        let formdata: Object = {};
        formdata['ComponentReplacementROWID'] = this.pageParams.ComponentReplacementROWID;
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formdata['ProductCode'] = this.getControlValue('ProductCode');
        formdata['ServiceCoverNumber'] = this.getControlValue('ServiceCoverNumber');
        formdata['ServiceCoverItemNumber'] = this.getControlValue('ServiceCoverItemNumber');
        formdata['ServiceCoverComponentNumber'] = this.getControlValue('ServiceCoverComponentNumber');
        formdata['ComponentReplacementNumber'] = this.getControlValue('ComponentReplacementNumber');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formdata)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                    this.riMaintenanceAfterEvent();
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordDeleted));
                    this.resetControl();
                    this.riMaintenanceAfterEvent();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.riMaintenanceAfterEvent();
            });
    }

    public riMaintenanceAfterEvent(): void {
        this.windowOnload();
    }

    public resetControl(): void {
        this.riExchange.resetCtrl(this.controls);
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.markAsPrestine();
    }

    public markAsPrestine(): void {
        this.controls.forEach((i) => {
            this.uiForm.controls[i.name].markAsPristine();
            this.uiForm.controls[i.name].markAsUntouched();
        });
    }

    public enableAddMode(): void {
        this.pageParams.isReadOnly = false;
        this.pageParams.isDateDisabled = false;
        this.setControlValue('ReplacementReasonCode', '');
        this.setControlValue('ReplacementReasonDesc', '');

        this.dropdown.reasoncode.isDisabled = false;
        this.ellipsis.productSearch.isDisabled = false;
        this.ellipsis.alternateProductSearch.isDisabled = false;
        this.ellipsis.planVisit.isDisabled = false;
        this.ellipsis.employee.isDisabled = false;
        this.ellipsis.branch.isDisabled = false;

        this.disableControl('VisitDone', false);
        this.disableControl('VisitRequired', false);
        this.disableControl('AdditionalChargeReq', false);
        this.enableControls(['ContractNumber', 'ContractName', 'ItemDescription', 'PremiseNumber', 'PremiseName', 'PremiseLocationNumber', 'PremiseLocationDesc', 'ProductCode', 'ProductDesc', 'ReplacementReasonDesc', 'ComponentTypeCode', 'ComponentTypeDesc', 'ComponentQuantity', 'ProductComponentCode', 'ProductComponentDesc', 'ProductComponentDescReplace', 'ServiceEmployeeCode', 'ServiceEmployeeSurname', 'BranchServiceAreaDesc', 'EmployeeSurname']);
    }

    public disableAddMode(): void {
        this.pageParams.isReadOnly = true;
        this.pageParams.isDateDisabled = true;
        this.setFocusOnReason.emit(false);

        this.dropdown.reasoncode.isDisabled = true;
        this.ellipsis.productSearch.isDisabled = true;
        this.ellipsis.alternateProductSearch.isDisabled = true;
        this.ellipsis.planVisit.isDisabled = true;
        this.ellipsis.employee.isDisabled = true;
        this.ellipsis.branch.isDisabled = true;

        this.setControlValue('ReplacementReasonCode', this.pageParams.ReplacementReasonCode);
        this.disableControl('VisitDone', true);
        this.disableControl('VisitRequired', true);
        this.disableControl('AdditionalChargeReq', true);
    }

    public getDummyProductCodes(): void {
        let query: URLSearchParams = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        //set parameters
        let postData: Object = {};
        postData['Function'] = 'DummyProductCodeList,SingleQtyComponents';
        postData['ProductCode'] = this.getControlValue('ProductCode');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, postData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.pageParams.vbDummyProductCodes = data.DummyProductCodes ? data.DummyProductCodes.split('|') : '';
                    this.pageParams.vbSingleQtyComponents = data.SingleQtyComponents ? data.SingleQtyComponents.split('|') : '';
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    public btnAddOnClick(): void {
        this.riMaintenanceAddMode();
        this.enableAddMode();
        this.riMaintenanceExecMode(this.pageParams.riMaintenanceCurrentMode);
    }

    public riMaintenanceBeforeAdd(): void {
        this.isEnableSave = true;
        this.setFocusOnReason.emit(true);
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ComponentTypeCode', this.riExchange.getParentHTMLValue('ComponentTypeCode'));
        this.ellipsis.productSearch.childConfigParams.SelComponentTypeCode = this.riExchange.getParentHTMLValue('ComponentTypeCode');
        this.ellipsis.alternateProductSearch.childConfigParams.SelComponentTypeCode = this.riExchange.getParentHTMLValue('ComponentTypeCode');
        this.ellipsis.alternateProductSearch.childConfigParams.ProductCode = this.riExchange.getParentHTMLValue('ProductCode');
        this.setControlValue('ServiceCoverNumber', this.riExchange.getParentHTMLValue('ServiceCoverNumber'));
        this.setControlValue('ServiceCoverItemNumber', this.riExchange.getParentHTMLValue('ServiceCoverItemNumber'));
        this.setControlValue('ServiceCoverComponentNumber', this.riExchange.getParentHTMLValue('ServiceCoverComponentNumber'));
        this.setControlValue('PremiseLocationNumber', this.riExchange.getParentHTMLValue('PremiseLocationNumber'));
        this.setControlValue('AlternateProductCode', this.riExchange.getParentHTMLValue('AlternateProductCode'));
        this.setControlValue('PremiseLocationDesc', this.riExchange.getParentHTMLValue('PremiseLocationDesc'));
        this.setControlValue('ItemDescription', this.riExchange.getParentHTMLValue('ItemDescription'));

        if (this.pageParams.ParentMode === 'PDAICABSActivity') {
            this.setControlValue('PDAVisitRef', this.riExchange.getParentHTMLValue('PDAVisitRef'));
            this.setControlValue('PDAEmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));

            this.getComponentQuantities();

            this.setControlValue('ComponentQuantity', this.riExchange.getParentHTMLValue('ComponentQuantity'));
            this.setControlValue('ProductComponentCode', this.riExchange.getParentHTMLValue('ProductComponentCode'));
            this.setControlValue('ProductComponentDesc', this.riExchange.getParentHTMLValue('ProductComponentDesc'));
            this.setControlValue('ProductComponentCodeRep', this.riExchange.getParentHTMLValue('ProductComponentCode'));
            this.setControlValue('ProductComponentDescReplace', this.riExchange.getParentHTMLValue('ProductComponentDescReplace'));
            this.setControlValue('ReplacementReasonCode', this.riExchange.getParentHTMLValue('ReplacementReasonCode'));
            this.setControlValue('ReplacementReasonDesc', this.riExchange.getParentHTMLValue('ReplacementReasonDesc'));
        } else {
            this.setControlValue('ComponentTypeDesc', this.riExchange.getParentHTMLValue('ComponentTypeDesc'));
            this.setControlValue('ComponentQuantity', this.riExchange.getParentHTMLValue('ComponentQuantity'));
            this.setControlValue('ProductComponentCode', this.riExchange.getParentHTMLValue('ProductComponentCode'));
            this.setControlValue('ProductComponentDesc', this.riExchange.getParentHTMLValue('ProductComponentDesc'));

            this.setControlValue('RemovalQty', this.riExchange.getParentHTMLValue('ComponentQuantity'));
            this.setControlValue('ReplacementQty', this.riExchange.getParentHTMLValue('ComponentQuantity'));
            this.setControlValue('ProductComponentCodeRep', this.riExchange.getParentHTMLValue('ProductComponentCode'));
            this.setControlValue('ProductComponentDescReplace', this.riExchange.getParentHTMLValue('ProductComponentDesc'));
        }

        this.setControlValue('ComponentReplacementNumber', '1');
        this.productComponentInformation();
        this.setFocusOnReason.emit(true);
        this.ellipsis.productSearch.isDisabled = false;
    }

    public riMaintenanceBeforeSaveAdd(): void {
        this.riMaintenanceFetchRecord();
    }

    public save(): void {
        this.riExchange.validateForm(this.uiForm);
        if (this.uiForm.status.toUpperCase() === 'VALID') {
            switch (this.pageParams.riMaintenanceCurrentMode) {
                case 'eModeAdd':
                case 'eModeSaveAdd':
                    this.pageParams.actionAfterSave = 1;
                    this.pageParams.riMaintenanceCurrentMode = MntConst.eModeSaveAdd;
                    this.riMaintenanceExecMode(this.pageParams.riMaintenanceCurrentMode);
                    break;
                case 'eModeUpdate':
                case 'eModeSaveUpdate':
                    this.pageParams.actionAfterSave = 2;
                    this.pageParams.riMaintenanceCurrentMode = MntConst.eModeSaveUpdate;
                    this.riMaintenanceExecMode(this.pageParams.riMaintenanceCurrentMode);
                    break;
            }
        }
    }

    public delete(): void {
        this.riMaintenanceDeleteMode();
        this.riExchange.validateForm(this.uiForm);
        if (this.uiForm.status === 'VALID') {
            this.pageParams.actionAfterDelete = 3;
            this.riMaintenanceExecMode(this.pageParams.riMaintenanceCurrentMode);
        }
    }

    public confirm(): any {
        let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.confirmed.bind(this));
        this.modalAdvService.emitPrompt(modalVO);
    }

    public confirmDelete(): any {
        let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.DeleteRecord, null, this.confirmed.bind(this), this.promptDeleteCancel.bind(this));
        this.modalAdvService.emitPrompt(modalVO);
    }
    public confirmed(obj: any): any {
        this.riMaintenanceExecContinue(this.pageParams.riMaintenanceCurrentMode);
    }
    public promptDeleteCancel(obj: any): any {
        this.riMaintenanceUpdateMode();
    }
    /*
    Method: cancel():
    Params:
    Details: Cancels your current action
    */
    public cancel(): void {
        this.resetControl();
        this.disableAddMode();
        this.setFormDefaultData();
        this.riMaintenanceCancelEvent(this.pageParams.riMaintenanceCurrentMode);
    }

    /*
    Method: promptSave():
    Params:
    Details: Called if prompt gets Yes
    */
    public riMaintenanceAfterSaveAdd(): void { //riMaintenance_AfterSave()
        if (this.pageParams.ParentMode === 'PDAICABSActivity')
            this.pageParams.ComponentReplacementNumber = this.getControlValue('ComponentReplacementNumber');

        this.location.back();
    }

    public getComponentQuantities(): void {
        let query: URLSearchParams = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        //set parameters
        let postData: Object = {};
        postData['Function'] = 'GetComponentQuantities';
        postData['PDAEmployeeCode'] = this.getControlValue('PDAEmployeeCode');
        postData['PDAVisitRef'] = this.getControlValue('PDAVisitRef');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, postData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('ComponentQuantity', data.ComponentQuantity);
                    this.setControlValue('RemovalQty', data.RemovalQty);
                    this.setControlValue('ReplacementQty', data.ReplacementQty);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    public productComponentInformation(): void {
        let isVbInclude: boolean = true;
        let query: URLSearchParams = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        //set parameters
        let postData: Object = {};
        postData['Function'] = 'PopulateFields';
        postData['ContractNumber'] = this.getControlValue('ContractNumber');
        postData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        postData['ProductCode'] = this.getControlValue('ProductCode');
        postData['ServiceCoverNumber'] = this.getControlValue('ServiceCoverNumber');
        postData['ServiceCoverItemNumber'] = this.getControlValue('ServiceCoverItemNumber');
        postData['ComponentTypeCode'] = this.getControlValue('ComponentTypeCode');
        postData['ProductComponentCode'] = this.getControlValue('ProductComponentCode');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, postData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (this.pageParams.vbDummyProductCodes && this.pageParams.vbDummyProductCodes.length > 0) {
                        this.pageParams.vbDummyProductCodes.forEach(vbProductCode => {
                            if ((this.getControlValue('ProductComponentCodeRep').toUpperCase() === vbProductCode.toUpperCase())
                                && (this.getControlValue('ProductComponentDescReplace') !== null))
                                isVbInclude = false;
                        });
                    }

                    if (isVbInclude)
                        this.setControlValue('ProductComponentDescReplace', data.ProductComponentDesc);

                    this.setControlValue('ReplacementValue', data.ReplacementValue);
                    this.setControlValue('ReplacementCost', data.ReplacementCost);
                    this.setControlValue('ServiceBranchNumber', data.ServiceBranchNumber);
                    this.ellipsis.branch.childConfigParams.ServiceBranchNumber = this.getControlValue('ServiceBranchNumber') || '';

                    this.setControlValue('ServiceEmployeeCode', data.ServiceEmployeeCode);
                    this.setControlValue('ServiceEmployeeSurname', data.ServiceEmployeeSurname);
                    this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode);
                    this.setControlValue('BranchServiceAreaDesc', data.BranchServiceAreaDesc);

                    this.setControlValue('AdditionalChargeReq', data.AdditionalChargeReq === 'yes' ? true : false);
                    this.setControlValue('VisitRequired', data.VisitRequired === 'yes' ? true : false);
                    this.setControlValue('OrigEmployeeCode', data.ServiceEmployeeCode);
                    this.setControlValue('OrigEmployeeSurname', data.ServiceEmployeeSurname);
                    this.setControlValue('OrigServiceEmployeeCode', data.ServiceEmployeeCode);
                    this.setControlValue('OrigServiceEmployeeSurname', data.ServiceEmployeeSurname);
                    this.setControlValue('OrigBranchServiceAreaCode', data.BranchServiceAreaCode);
                    this.setControlValue('OrigBranchServiceAreaDesc', data.BranchServiceAreaDesc);
                    this.setControlValue('ServiceCoverRowID', data.ServiceCoverRowID);
                    this.setAttribute('ServiceCoverRowID', data.ServiceCoverRowID);
                    this.setControlValue('ComponentTypeDesc', data.ComponentTypeDesc);

                    this.setPlanVisitEllipsisData();
                    this.additionalChargeReqOnclick();
                    this.visitRequiredOnclick();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    public additionalChargeReqOnclick(): void {
        if (this.getControlValue('AdditionalChargeReq')) {
            this.pageParams.isReplacementValue = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ReplacementValue', true);
        } else {
            this.pageParams.isReplacementValue = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ReplacementValue', false);
        }

    }

    public visitRequiredOnclick(): void {
        if (this.getControlValue('VisitRequired')) {
            this.setControlValue('BranchServiceAreaCode', this.getControlValue('OrigBranchServiceAreaCode'));
            this.setControlValue('BranchServiceAreaDesc', this.getControlValue('OrigBranchServiceAreaDesc'));

            this.pageParams.isBranchServiceAreaCode = true;
            this.pageParams.isServiceEmployeeCode = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BranchServiceAreaCode', true);
            this.disableControl('BranchServiceAreaCode', false);
            this.setControlValue('VisitDone', false);

            this.visitDoneOnclick();

            let query: URLSearchParams = this.getURLSearchParamObject();
            query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
            //set parameters
            let postData: Object = {};
            postData['Function'] = 'GetNextVisitDate';
            postData['ContractNumber'] = this.getControlValue('ContractNumber');
            postData['PremiseNumber'] = this.getControlValue('PremiseNumber');
            postData['ProductCode'] = this.getControlValue('ProductCode');
            postData['ServiceCoverNumber'] = this.getControlValue('ServiceCoverNumber');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, query, postData)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        if (data.VisitDate) {
                            this.setControlValue('VisitDate', this.setDateFormat(data.VisitDate));
                        }
                        this.ellipsis.planVisit.isDisabled = false;
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        } else {
            this.pageParams.isBranchServiceAreaCode = false;
            this.pageParams.isServiceEmployeeCode = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BranchServiceAreaCode', false);
            this.disableControl('BranchServiceAreaCode', true);

            this.setControlValue('BranchServiceAreaCode', '');
            this.setControlValue('BranchServiceAreaDesc', '');
            this.setControlValue('VisitDate', '');
        }
    }

    public visitDoneOnclick(): void {
        if (this.pageParams.riMaintenanceCurrentMode === MntConst.eModeAdd || MntConst.eModeUpdate || MntConst.eModeSaveAdd || MntConst.eModeSaveUpdate) {
            if (this.getControlValue('VisitDone')) {
                this.setControlValue('VisitRequired', false);
                this.visitRequiredOnclick();
                this.setControlValue('EmployeeCode', this.getControlValue('OrigEmployeeCode'));
                this.setControlValue('EmployeeSurname', this.getControlValue('OrigEmployeeSurname'));
                this.setControlValue('VisitDate', '');
                this.ellipsis.planVisit.isDisabled = true;

                this.pageParams.isEmployeeCode = true;
                this.disableControl('EmployeeCode', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
            } else {
                this.pageParams.isEmployeeCode = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', false);
                this.disableControl('EmployeeCode', true);

                this.setControlValue('EmployeeCode', '');
                this.setControlValue('EmployeeSurname', '');
                this.setControlValue('VisitDate', '');
                this.ellipsis.planVisit.isDisabled = true;
            }
        }
    }

    public visitDateOnChange(): void {
        if (this.getControlValue('VisitRequired')) {
            this.riExchange.setParentAttributeValue('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
            this.setAttribute('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
        }
    }

    public dateSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('VisitDate', value.value);
        }
        this.visitDateOnChange();
    }

    public replacementReasonCodeOnChange(data: any): void {
        if (data.ReplacementReasonCode !== null && data.ReplacementReasonCode !== 'undefined') {
            this.setControlValue('ReplacementReasonCode', data.ReplacementReasonCode || '');
            this.setControlValue('ReplacementReasonDesc', data.ReplacementReasonDesc || '');
        }
    }

    public productComponentCodeRepOnSelect(data: any): void {
        this.setControlValue('SelProductCode', data.SelProductCode || '');
        this.setControlValue('SelComponentTypeCode', data.ComponentTypeCode || '');
        this.setControlValue('SelProductAlternateCode', data.SelProductAlternateCode || '');
        this.setControlValue('SelProductDesc', data.SelProductDesc || '');

        if (this.getControlValue('SelProductCode') !== this.getControlValue('ProductComponentCodeRep')) {
            this.setControlValue('ProductComponentCodeRep', this.getControlValue('SelProductCode'));
            this.setControlValue('ProductComponentDescReplace', this.getControlValue('SelProductDesc'));
            this.setControlValue('AlternateProductCode', this.getControlValue('SelProductAlternateCode'));

            if (this.getControlValue('SelProductCode')) {
                this.getProductValues();
                this.disableControl('ProductComponentDescReplace', true);
                if (this.pageParams.vbDummyProductCodes && this.pageParams.vbDummyProductCodes.length > 0) {
                    this.pageParams.vbDummyProductCodes.forEach(vbProductCode => {
                        if (this.getControlValue('ProductComponentCodeRep').toUpperCase() === vbProductCode.toUpperCase()) {
                            this.disableControl('ProductComponentDescReplace', false);
                            this.setFocusOnProductCompDesc.emit(true);
                        }
                    });
                }
            } else {
                this.disableControl('ProductComponentDescReplace', true);
                this.setControlValue('ProductComponentDescReplace', '');
            }
        }
    }

    public alternateProductCodeOnSelect(obj: any): void {
        this.setControlValue('SelProductAlternateCode', this.getControlValue('AlternateProductCode') || '');
        this.setControlValue('SelComponentTypeCode', this.getControlValue('ComponentTypeCode') || '');
        this.setControlValue('SelProductDesc', this.getControlValue('ProductComponentDescReplace') || '');
        this.setControlValue('SelProductCode', this.getControlValue('ProductComponentCodeRep') || '');
        if (obj.SelProductAlternateCode) {
            if (this.getControlValue('SelProductAlternateCode') !== obj.SelProductAlternateCode
                || this.getControlValue('SelProductCode') !== obj.SelProductCode) {

                this.setControlValue('AlternateProductCode', obj.SelProductAlternateCode);
                this.setControlValue('ProductComponentDescReplace', obj.SelProductDesc);
                this.setControlValue('ProductComponentCodeRep', obj.SelProductCode);

                if (this.getControlValue('ProductComponentCodeRep')) {
                    this.disableControl('ProductComponentDescReplace', true);

                    this.getProductValues();
                    if (this.pageParams.vbDummyProductCodes && this.pageParams.vbDummyProductCodes.length > 0) {
                        this.pageParams.vbDummyProductCodes.forEach(vbProductCode => {
                            if (this.getControlValue('ProductComponentCodeRep').toUpperCase() === vbProductCode.toUpperCase()) {
                                this.disableControl('ProductComponentDescReplace', false);
                                this.setFocusOnProductCompDesc.emit(true);
                            }
                        });
                    }
                } else {
                    this.disableControl('ProductComponentDescReplace', true);
                    this.setControlValue('ProductComponentDescReplace', '');
                }
            }
        }
    }

    public getProductValues(): void {
        let query: URLSearchParams = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        //set parameters
        let postData: Object = {};
        postData['Function'] = 'GetProductValues';
        postData['ProductComponentCodeRep'] = this.getControlValue('ProductComponentCodeRep');
        postData['ServiceBranchNumber'] = this.getControlValue('ServiceBranchNumber');
        postData['ProductComponentCodeRep'] = this.getControlValue('ProductComponentCodeRep');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, postData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('AlternateProductCode', data.AlternateProductCode);
                    this.setControlValue('ProductComponentDescReplace', data.ProductComponentDescReplace);
                    this.setControlValue('ReplacementValue', data.ReplacementValue);
                    this.setControlValue('ReplacementCost', data.ReplacementCost);

                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    public productComponentCodeRepOnchange(): void {
        if (this.getControlValue('ProductComponentCodeRep')) {
            this.disableControl('ProductComponentDescReplace', true);
            this.getProductValues();
            if (this.pageParams.vbDummyProductCodes && this.pageParams.vbDummyProductCodes.length > 0) {
                this.pageParams.vbDummyProductCodes.forEach(element => {
                    this.pageParams.vbProductCode = this.pageParams.vbDummyProductCodes[element];
                    if (this.getControlValue('ProductComponentCodeRep').toUpperCase() === this.pageParams.vbProductCode) {
                        this.disableControl('ProductComponentDescReplace', false);
                        this.setFocusOnProductCompDesc.emit(true);
                    }
                });
            }
        } else {
            this.disableControl('ProductComponentDescReplace', false);

            this.setControlValue('ProductComponentDescReplace', '');
            this.setControlValue('AlternateProductCode', '');
            this.setControlValue('ReplacementValue', 0);
            this.setControlValue('ReplacementCost', 0);
            this.setControlValue('ReplacementQty', 0);
        }
    }

    public alternateProductCodeOnchange(): void {
        this.getAlternateProductValues();
    }

    public branchServiceAreaCodeOnSelect(obj: any): void {
        if (obj.BranchServiceAreaCode !== 'undefined' && obj.BranchServiceAreaCode !== null) {
            this.setControlValue('BranchServiceAreaCode', obj.BranchServiceAreaCode || '');
            this.setControlValue('BranchServiceAreaDesc', obj.BranchServiceAreaDesc || '');
            this.getServiceAreaDefaults();
        }
    }

    public employeeCodeOnSelect(obj: any): void {
        if (obj.EmployeeCode !== 'undefined' && obj.EmployeeCode !== null) {
            this.setControlValue('EmployeeCode', obj.EmployeeCode || '');
            this.setControlValue('EmployeeSurname', obj.EmployeeSurname || '');
        }
    }

    public getServiceAreaDefaults(): void {
        let query: URLSearchParams = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        //set parameters
        let postData: Object = {};
        postData['Function'] = 'GetServiceAreaDefaults';
        postData['ServiceBranchNumber'] = this.getControlValue('ServiceBranchNumber');
        postData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, postData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode);
                    this.setControlValue('BranchServiceAreaDesc', data.BranchServiceAreaDesc);
                    this.setControlValue('ServiceEmployeeCode', data.ServiceEmployeeCode);
                    this.setControlValue('ServiceEmployeeSurname', data.ServiceEmployeeSurname);

                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    public getAlternateProductValues(): void {
        let query: URLSearchParams = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        //set parameters
        let postData: Object = {};
        postData['Function'] = 'GetAlternateProductValues';
        postData['AlternateProductCode'] = this.getControlValue('AlternateProductCode');
        postData['ServiceBranchNumber'] = this.getControlValue('ServiceBranchNumber');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, postData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('ProductComponentCodeRep', data.ProductComponentCodeRep);
                    this.setControlValue('ProductComponentDescReplace', data.ProductComponentDescReplace);
                    this.setControlValue('ReplacementValue', data.ReplacementValue);
                    this.setControlValue('ReplacementCost', data.ReplacementCost);

                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProductComponentCodeRep', false);
                    this.disableControl('ProductComponentDescReplace', true);

                    if (this.pageParams.vbDummyProductCodes && this.pageParams.vbDummyProductCodes.length > 0) {
                        this.pageParams.vbDummyProductCodes.forEach(vbProductCode => {
                            if (this.getControlValue('ProductComponentCodeRep').toUpperCase() === vbProductCode.toUpperCase()) {
                                this.disableControl('ProductComponentDescReplace', false);
                                this.setFocusOnProductCompDesc.emit(true);
                            }
                        });
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    public riExchangeCBORequest(): void {
        if (this.pageParams.riMaintenanceCurrentMode === MntConst.eModeAdd || this.pageParams.riMaintenanceCurrentMode === MntConst.eModeUpdate) {
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'BranchServiceAreaCode')) {
                this.getServiceAreaDefaults();
            }

            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'EmployeeCode')) {
                this.getServiceAreaDefaults();
            }

            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ProductComponentCodeRep')) {
                this.getProductValues();
            }

            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'AlternateProductCode')) {
                this.getAlternateProductValues();
            }
        }
    }

    public setPlanVisitEllipsisData(): void {
        this.ellipsis.planVisit.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.planVisit.childConfigParams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.planVisit.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.ellipsis.planVisit.childConfigParams.PremiseName = this.getControlValue('PremiseName');
        this.ellipsis.planVisit.childConfigParams.ProductCode = this.getControlValue('ProductCode');
        this.ellipsis.planVisit.childConfigParams.ProductDesc = this.getControlValue('ProductDesc');
        this.ellipsis.planVisit.childConfigParams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
    }

    public planVisitSearchOnSelect(data: any): void {
        this.setControlValue('VisitDate', data.VisitDate ? this.setDateFormat(data.VisitDate) : '');
    }

    /*
    *  Alerts user when user is moving away without saving the changes. //CR implementation
    */
    public routeAwayUpdateSaveFlag(): void {
        this.uiForm.statusChanges.subscribe((value: any) => {
            if (this.uiForm.dirty === true) {
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            } else {
                this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    }
}
