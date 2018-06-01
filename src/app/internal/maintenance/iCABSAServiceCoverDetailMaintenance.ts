import { InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { LookUp } from './../../../shared/services/lookup';
import { ErrorCallback, MessageCallback } from '../../base/Callback';
import { RiExchange } from './../../../shared/services/riExchange';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Router, ActivatedRoute } from '@angular/router';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { ProductSearchGridComponent } from './../../internal/search/iCABSBProductSearch';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ServiceCoverDetailsComponent } from './../search/iCABSAServiceCoverDetailSearch.component';
import { ProductCoverSearchComponent } from './../search/iCABSBProductCoverSearch.component';
import { ScreenNotReadyComponent } from '../../../shared/components/screenNotReady';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { LostBusinessDetailLanguageSearchComponent } from './../../internal/search/iCABSBLostBusinessDetailLanguageSearch.component';
import { LostBusinessLanguageSearchComponent } from './../../internal/search/iCABSBLostBusinessLanguageSearch.component';
@Component({
    templateUrl: 'iCABSAServiceCoverDetailMaintenance.html'
})


export class ServiceCoverDetailMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, ErrorCallback, MessageCallback {

    @ViewChild('promptModal') public promptModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('contractNumberEllipsis') public contractNumberEllipsis: EllipsisComponent;
    @ViewChild('premiseSearch') public premiseSearch: EllipsisComponent;
    @ViewChild('ProductCodeEllipsis') public ProductCodeEllipsis: EllipsisComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('icabsLostBusinessLang') icabsLostBusinessLang: LostBusinessDetailLanguageSearchComponent;
    @ViewChild('lostbusinesslanguagesearchDropDown') lostbusinesslanguagesearchDropDown: LostBusinessLanguageSearchComponent;

    public strDocTitle: string;
    public strDocTitleNew: string;
    public strInpTitle: string;
    public strInpTitleNew: string;
    public pageId: string = '';
    public lookUpSubscription: Subscription;
    public xhr: any;
    public ReinstateInd: any = true;
    public setFocusReinstateInd = new EventEmitter<boolean>();
    public setFocusDetailDeleteDate = new EventEmitter<boolean>();
    public setFocusLostBusinessCode = new EventEmitter<boolean>();
    public setFocusServiceDetailQty = new EventEmitter<boolean>();
    public setFocusDetailCommenceDate = new EventEmitter<boolean>();
    public Pending: boolean;
    public productDetailCodeValue: string;
    public vbRunDetailLocations: boolean;
    public SavedServiceAnnualValue: any;
    public dtDetailCommenceDate: Date;
    public detailCommenceDate: Date;
    public dtDetailDeleteDate: Date;
    public dtDetailReinstateDate: Date;
    public DeleteDateDisplay: string;
    public DeleteReinstateDateDisplay: string;
    public dataPostModeAction: number;
    public serviceAnnualValueFixed: any;
    public serviceAnnualValueFixedLookUp: any;
    public errorTitle: string = MessageConstant.Message.ErrorTitle;
    public promptContent: string = MessageConstant.Message.ConfirmRecord;
    public messageContentSaved: string = MessageConstant.Message.RecordSavedSuccessfully;

    //SysChar Varibles
    public SCEnableProductDetailQty: string = 'False';
    public SCEnableDetailLocations: string = 'False';
    public LookUpServiceCoverEllipsisDeleteDateFlag: boolean = false;

    public visibleServiceDetailQty: boolean = true;
    public displayReinstateInd: boolean = false;
    public disableDetailCommenceDate: boolean = false;
    public disableDetailDeleteDate: boolean = false;
    public visibleLostBusiness: boolean = false;
    public visibleLostBusinessDetail: boolean = false;
    public visibleContractNumberSelectionEllipsis: boolean = false;
    public visiblePremiseNumberSelectionEllipsis: boolean = false;
    public visibleProductCodeSelectionEllipsis: boolean = false;
    public visibleProductDetailSelectionEllipsis: boolean = false;
    public visibleOpenProductCodeEllipsis: boolean = false;
    public visibleOpenServiceCoverDetailEllipsis: boolean = false;
    public screenNotReadyComponent = ScreenNotReadyComponent;
    public serviceCoverDetailsComponent = ServiceCoverDetailsComponent;
    public lostBusinessInputParams: any = { LanguageCode: this.riExchange.LanguageCode() };
    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: true, required: true },
        { name: 'ContractName', readonly: false, disabled: true, required: true },
        { name: 'PremiseNumber', readonly: false, disabled: true, required: true },
        { name: 'PremiseName', readonly: false, disabled: true, required: true },
        { name: 'ProductCode', readonly: false, disabled: true, required: true },
        { name: 'ProductDesc', readonly: false, disabled: true, required: true },
        { name: 'ProductDetailCode', readonly: false, disabled: false, required: true },
        { name: 'ProductDetailDesc', readonly: false, disabled: true, required: true },
        { name: 'DetailCommenceDate', readonly: false, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'DetailDeleteDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'ReinstateInd', type: MntConst.eTypeCheckBox, readonly: false, disabled: false, required: false },
        { name: 'DetailReinstateDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'ServiceDetailQty', readonly: false, disabled: false, required: true },
        { name: 'ServiceAnnualValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency },
        { name: 'AnnualValueChange', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency },
        { name: 'LostBusinessCode', readonly: false, disabled: false, required: false },
        { name: 'LostBusinessDesc', readonly: false, disabled: false, required: false },
        { name: 'LostBusinessDetailCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'LostBusinessDetailDesc', readonly: false, disabled: false, required: false },
        { name: 'ServiceSalesEmployee', readonly: false, disabled: false, required: true },
        { name: 'EmployeeSurname', readonly: false, disabled: true, required: false },
        { name: 'LostBusinessRequestNumber', readonly: false, disabled: false, required: false },
        { name: 'ServiceBranchNumber', readonly: false, disabled: false, required: false },
        { name: 'ServiceCoverRowID', readonly: false, disabled: false, required: false },
        { name: 'LocationEnabled', readonly: false, disabled: false, required: false },
        { name: 'ServiceCoverDetailROWID', readonly: false, disabled: false, required: false },
        { name: 'Pending', readonly: false, disabled: false, required: false }
    ];

    public xhrParams = {
        operation: 'Application/iCABSAServiceCoverDetailMaintenance',
        module: 'contract-admin',
        method: 'contract-management/maintenance'
    };

    public parent: ServiceCoverDetailMaintenanceComponent;

    constructor(injector: Injector) {
        super(injector);
        this.parent = this;
        this.pageId = PageIdentifier.ICABSASERVICECOVERDETAILMAINTENANCE;
        this.browserTitle = 'Contract Service Detail Maintenance';
        this.xhr = this.httpService;
        this.riMaintenance = new RiMaintenance(this.logger, this.xhr, this.LookUp, this.utils, this.serviceConstants, this.globalize);
    };
    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Contract Service Detail Maintenance';
        this.window_onload();
        this.setErrorCallback(this);
        this.setMessageCallback(this);
    }

    public isNegative: boolean = false;
    public annualValueChangeUpdated: any;

    public ellipsis: any = {
        contractNumberEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp'
            },
            component: ContractSearchComponent
        },
        premiseNumberEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': ''
            },
            component: PremiseSearchComponent
        },
        ProductCodeEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp'
            },
            component: ServiceCoverSearchComponent
        },
        serviceCoverDetailsEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'Search',
                'ContractNumber': '',
                'PremiseNumber': '',
                'ProductCode': '',
                'ServiceCoverRowID': ''

            },
            component: ServiceCoverDetailsComponent
        },
        productDetailsEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'PremiseNumber': '',
                'productCode': '',
                'productDesc': '',
                'ServiceCoverRowID': ''

            },
            component: ProductCoverSearchComponent
        },
        employeeSearcEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp-ServiceCoverCommissionEmployee'
            },
            component: EmployeeSearchComponent
        }
    };

    public dropdown = {
        languageSearch: {
            isRequired: false,
            isDisabled: false,
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

    public onLostBusinessLanguageSearch(data: any): void {
        this.setControlValue('LostBusinessCode', data['LostBusinessLang.LostBusinessCode']);
        this.lostBusinessInputParams.LostBusinessCode = this.getControlValue('LostBusinessCode');
        this.icabsLostBusinessLang.fetchDropDownData();
    }
    public getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableProductDetailQty,
            this.sysCharConstants.SystemCharEnableLocations
        ];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vSCEnableProductDetailQty = record[0]['Required'];
            if (this.pageParams.vSCEnableProductDetailQty === true)
                this.SCEnableProductDetailQty = 'True';
            if (this.SCEnableProductDetailQty === 'False')
                this.visibleServiceDetailQty = false;
            this.pageParams.vEnableDetailLocations = record[1]['Logical'];
            if (this.pageParams.vSCEnableProductDetailQty)
                this.SCEnableDetailLocations = 'True';
        });
    }

    public postRequestForServiceCoverRow(): void {
        let searchPost: URLSearchParams;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'GetServiceCoverDetails';
        postParams.ContractNumber = this.getControlValue('ContractNumber');
        postParams.PremiseNumber = this.getControlValue('PremiseNumber');
        postParams.ProductCode = this.getControlValue('ProductCode');
        if (this.getControlValue('ServiceCoverRowID'))
            postParams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
        else
            postParams.ServiceCoverRowID = '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, searchPost, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e['oResponse']);
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                    } else {
                        if (e.ServiceCoverRowID) {
                            this.setControlValue('ServiceAnnualValue', e.ServiceAnnualValue);
                            this.setControlValue('ServiceCoverRowID', e.ServiceCoverRowID);
                            this.setControlValue('ServiceSalesEmployee', e.ServiceSalesEmployee);
                            this.setControlValue('EmployeeSurname', e.EmployeeSurname);
                            this.ellipsis.serviceCoverDetailsEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
                            this.ellipsis.serviceCoverDetailsEllipsis.childparams.PremiseNumber = this.getControlValue('PremiseNumber');
                            this.ellipsis.serviceCoverDetailsEllipsis.childparams.ProductCode = this.getControlValue('ProductCode');
                            this.ellipsis.serviceCoverDetailsEllipsis.childparams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
                            this.serviceAnnualValueFixed = this.getControlValue('ServiceAnnualValue');
                        } else {
                            this.ProductCodeEllipsis.openModal();
                        }
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }
    public postRequest(): void {
        let searchPost: URLSearchParams;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '0');
        let postParams: any = {};
        postParams.ContractNumber = this.getControlValue('ContractNumber');
        postParams.PremiseNumber = this.getControlValue('PremiseNumber');
        postParams.ProductCode = this.getControlValue('ProductCode');
        postParams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
        postParams.Function = '';
        postParams.Pending = true;
        postParams.ProductDetailCode = this.getControlValue('ProductDetailCode');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, searchPost, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e['oResponse']);
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                    } else {
                        this.setControlValue('ServiceAnnualValue', e.ServiceAnnualValue);
                        this.setControlValue('ServiceCoverRowID', e.ServiceCoverRowID);
                        this.setControlValue('ServiceCoverDetailROWID', e.ServiceCoverDetail);
                        this.setControlValue('ServiceSalesEmployee', e.ServiceSalesEmployee);
                        this.setControlValue('EmployeeSurname', e.EmployeeSurname);
                        this.setControlValue('LocationEnabled', e.LocationEnabled);
                        this.setControlValue('ServiceDetailQty', e.ServiceDetailQty);
                        if (this.riMaintenance.CurrentMode !== MntConst.eModeAdd && this.parentMode !== 'LookUp')
                            this.dtDetailCommenceDate = this.utils.convertDate(e.DetailCommenceDate);
                        this.serviceAnnualValueFixed = this.getControlValue('ServiceAnnualValue');
                        if (this.parentMode === 'LookUp') {
                            this.LookUpServiceCoverEllipsisDeleteDateFlag = true;
                            this.disableDetailDeleteDate = false;
                            this.displayReinstateInd = false;
                            this.riMaintenance.UpdateMode();
                            this.callriMaintenance();
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public postRequestDetailCommenceDate(): void {
        let searchPost: URLSearchParams;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'GetProductCommence';
        postParams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, searchPost, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e);
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                    } else {
                        this.setControlValue('DetailCommenceDate', e.DetailCommenceDate);
                        this.setDetailCommenceDate();
                        if (this.SCEnableProductDetailQty === 'True')
                            this.setFocusServiceDetailQty.emit(true);
                        else
                            this.setFocusDetailCommenceDate.emit(true);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public postRequestforAnnualValueOnDeleteDate(): void {
        let searchPost: URLSearchParams;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'GetServiceAnnualValue';
        postParams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
        postParams.DetailDeleteDate = this.DeleteDateDisplay;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, searchPost, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e);
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                    } else {
                        this.setControlValue('ServiceAnnualValue', e.ServiceAnnualValue);
                        this.serviceAnnualValueFixed = this.getControlValue('ServiceAnnualValue');
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }
    public riMaintenance_Search(): void {
        if (!this.getControlValue('ContractNumber')) {
            this.visibleContractNumberSelectionEllipsis = true;
            this.parentMode = 'LookUp';
        }
        if (!this.getControlValue('ContractNumber') && !this.getControlValue('PremiseNumber')) {
            this.visiblePremiseNumberSelectionEllipsis = true;
            this.parentMode = 'LookUp';
        }
        if (!this.getControlValue('ContractNumber') && !this.getControlValue('PremiseNumber') && !this.getControlValue('ProductCode')) {
            this.visibleProductCodeSelectionEllipsis = true;
            this.ProductCodeSelection();
        }
        if (this.getControlValue('ContractNumber') !== null && this.getControlValue('PremiseNumber') !== null && this.getControlValue('ProductCode') !== null) {
            this.visibleProductDetailSelectionEllipsis = true;
        }
    }

    public ProductCodeSelection(): void {
        this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
    }

    public lostBusinessCodeOnkeydown(): void {
        this.LostBusinessLookUp();
    }
    public LostBusinessDetailCodeOnkeydown(): void {
        this.LostBusinessDetailLookUp();
    }
    public serviceSalesEmployeeOnkeydown(): void {
        this.navigate('LookUp-ServiceCoverCommissionEmployee', 'Business/iCABSBEmployeeSearch');
    }

    public ProductDetailCodeOnchange(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd)
            this.postRequestDetailCommenceDate();
    }
    public productCodeOnchange(): void {
        if (this.getControlValue('ServiceCoverRowID') === '') {
            this.GetServiceCoverDetails();
            if (this.getControlValue('ServiceCoverRowID') === '')
                this.ProductCodeSelection();
        }
    }
    public GetServiceCoverDetails(): void {
        this.riMaintenance.CBORequestClear();
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetServiceCoverDetails';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestAdd('ContractNumber');
        this.riMaintenance.CBORequestAdd('PremiseNumber');
        this.riMaintenance.CBORequestAdd('ProductCode');
        if (this.getControlValue('ServiceCoverRowID') !== '')
            this.riMaintenance.CBORequestAdd('ServiceCoverRowID');
        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            //
        });
    }
    public callriMaintenance(): void {
        this.riMaintenance.BusinessObject = 'riControl.p';
        this.riMaintenance.CustomBusinessObject = 'iCABSServiceCoverDetailEntry.p';
        this.riMaintenance.CustomBusinessObjectSelect = true;
        this.riMaintenance.CustomBusinessObjectConfirm = false;
        this.riMaintenance.CustomBusinessObjectInsert = true;
        this.riMaintenance.CustomBusinessObjectUpdate = true;
        this.riMaintenance.CustomBusinessObjectDelete = false;
        this.riMaintenance.FunctionSnapShot = false;
        this.riMaintenance.FunctionDelete = false;
        if (this.Pending)
            this.riMaintenance.FunctionAdd = false;
        if (this.parentMode === 'Contact-View') {
            this.riMaintenance.FunctionAdd = false;
            this.riMaintenance.FunctionSearch = false;
            this.riMaintenance.FunctionSelect = false;
            this.riMaintenance.FunctionUpdate = false;
        }
        this.riMaintenance.AddTable('ServiceCoverDetail');
        switch (this.parentMode) {
            case 'Search':
            case 'SearchAdd':
            case 'ServiceCover':
                this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                this.riMaintenance.AddTableKey('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                this.riMaintenance.AddTableKeyAlignment('ProductCode', MntConst.eAlignmentRight);
                break;
            case 'Contact':
            case 'Contact-View':
                this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
                this.riMaintenance.AddTableKey('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
                this.riMaintenance.AddTableKeyAlignment('ProductCode', MntConst.eAlignmentRight);
                this.riMaintenance.AddTableKey('ServiceCoverDetailROWID', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
                break;
            default:
                this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
                this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
                this.riMaintenance.AddTableKey('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
                this.riMaintenance.AddTableKeyAlignment('ProductCode', MntConst.eAlignmentRight);
        }
        this.riMaintenance.AddTableKey('ServiceCoverRowID', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        // this.riMaintenance.AddTableKey('Pending', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableKey('ProductDetailCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableField('ServiceDetailQty', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('DetailCommenceDate', MntConst.eTypeDate, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('DetailDeleteDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableCommit(this, this.getTableData);
        this.riMaintenance.AddTable('*');
        this.riMaintenance.AddTableField('ReinstateInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('DetailReinstateDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AnnualValueChange', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ServiceAnnualValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('LostBusinessRequestNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ServiceSalesEmployee', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('ServiceBranchNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateFixed, 'ReadOnly');
        this.riMaintenance.AddTableField('ServiceCoverRowID', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateFixed, 'Optional');
        this.riMaintenance.AddTableFieldPostData('ServiceCoverRowID', false);;
        this.riMaintenance.AddTableField('LostBusinessCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('LostBusinessDetailCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('LocationEnabled', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableCommit(this);
    }

    public LostBusinessLookUp(): void {
        let lookupIP = [
            {
                'table': 'LostBusinessLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LostBusinessCode': this.getControlValue('LostBusinessCode'),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['LostBusinessDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let LostBusiness = data[0][0];
            if (LostBusiness) {
                this.setControlValue('LostBusinessDesc', LostBusiness.LostBusinessDesc);
                this.postRequestDetailCommenceDate();
            }
        });
    }

    public LostBusinessDetailLookUp(): void {
        let lookupIP = [
            {
                'table': 'LostBusinessDetailLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LostBusinessCode': this.getControlValue('LostBusinessCode'),
                    'LostBusinessDetailCode': this.getControlValue('LostBusinessDetailCode'),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['LostBusinessDetailDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let LostBusinessDetail = data[0][0];
            if (LostBusinessDetail) {
                this.setControlValue('LostBusinessDetailDesc', LostBusinessDetail.LostBusinessDetailDesc);
                this.postRequestDetailCommenceDate();
            }
        });
    }

    public onReasonCodeChange(event: any): void {
        this.setControlValue('LostBusinessCode', event.target.value);
        this.lostBusinessInputParams.LostBusinessCode = this.getControlValue('LostBusinessCode');
        this.icabsLostBusinessLang.fetchDropDownData();
    }

    public onLostBusinessDetailLangDataReceived(event: any): void {
        this.setControlValue('LostBusinessDetailCode', event['LostBusinessDetailLang.LostBusinessDetailCode']);
    }

    public getTableData(data: any): void {
        if (this.parentMode === 'LookUp')
            this.postRequestDetailCommenceDate();
        else
            this.dtDetailCommenceDate = this.utils.convertDate(data.DetailCommenceDate);
        this.productDetailCodeValue = data.ProductDetailCode;
        this.setControlValue('ProductDetailCode', data.ProductDetailCode);
        this.setControlValue('ProductDetailCode', data.ProductDetailCode);
        this.setControlValue('ServiceCoverDetailROWID', data.ServiceCoverDetail);
        this.setControlValue('LocationEnabled', data.LocationEnabled);
        if (data.DetailDeleteDate !== '') {
            this.dtDetailDeleteDate = this.utils.convertDate(data.DetailDeleteDate);
            this.DeleteDateDisplay = this.utils.convertDate(data.DetailDeleteDate);
            this.disableControl('DetailDeleteDate', true);
            this.disableDetailDeleteDate = true;
            this.HideShowFields();
            if (this.getControlValue('ReinstateInd')) {
                this.dtDetailReinstateDate = this.utils.convertDate(data.DetailDeleteDate);
            }
            else {
                this.dtDetailReinstateDate = null;
            }
        }
    }

    public SetCurrentContractType(): void {
        // this.strDocTitle = this.riExchange.getCurrentContractTypeLabel();
        // this.strInpTitle = this.riExchange.getCurrentContractTypeLabel();
        this.strInpTitle = '^1^ Number';
        this.strDocTitle = '^1^ Service Detail Maintenance';
        this.strInpTitleNew = this.strInpTitle.replace('^1^', this.riExchange.getCurrentContractTypeLabel());
        this.strDocTitleNew = this.strDocTitle.replace('^1^', this.riExchange.getCurrentContractTypeLabel());

    }
    public HideShowFields(): void {
        this.setControlValue('DetailReinstateDate', '');
        if (this.dtDetailCommenceDate && (this.DeleteDateDisplay || this.dtDetailDeleteDate)) {
            this.displayReinstateInd = true;
            this.disableDetailDeleteDate = true;
        }
        else {
            this.displayReinstateInd = false;
            this.disableDetailDeleteDate = false;
        }

    }

    public AnnualValueChange_onchange(): void {
        this.isNegative = false;
        let annualValueChange: any = this.globalize.parseCurrencyToFixedFormat(this.getControlValue('AnnualValueChange'));
        let serviceAnnualValue: any = this.globalize.parseCurrencyToFixedFormat(this.getControlValue('ServiceAnnualValue'));
        // if (isNaN(annualValueChange)) {
        //     if (annualValueChange.toString().indexOf('(') === 0 && annualValueChange.toString().indexOf(')') === annualValueChange.length - 1) {
        //         annualValueChange = annualValueChange.replace(/[^0-9\.]+/g, '');
        //         this.isNegative = true;
        //     } else {
        //         annualValueChange = 0.00;
        //         this.riExchange.riInputElement.SetValue(this.uiForm, 'AnnualValueChange', annualValueChange);
        //     }
        // }

        if (!this.getControlValue('AnnualValueChange')) {
            annualValueChange = 0.00;
            this.setControlValue('AnnualValueChange', annualValueChange);
        }

        // if (parseFloat(annualValueChange) < 0) {
        //     this.isNegative = true;
        //     this.setControlValue('AnnualValueChange', annualValueChange);
        //     annualValueChange = annualValueChange * -1;
        // }

        // if (this.isNegative)
        //     this.setControlValue('ServiceAnnualValue', (parseFloat(this.serviceAnnualValueFixed) - parseFloat(annualValueChange)).toFixed(2));
        // else
        //     this.setControlValue('ServiceAnnualValue', (parseFloat(this.serviceAnnualValueFixed) + parseFloat(annualValueChange)).toFixed(2));

        serviceAnnualValue = serviceAnnualValue + annualValueChange;

        this.setControlValue('ServiceAnnualValue', serviceAnnualValue);

        // if (parseFloat(this.getControlValue('AnnualValueChange')) < 0 || this.isNegative) {
        if (annualValueChange < 0) {
            this.visibleLostBusiness = true;
            this.visibleLostBusinessDetail = true;
            this.riMaintenance.SetRequiredStatus('LostBusinessCode', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessDetailCode', true);
            this.setFocusLostBusinessCode.emit(true);
        }
        else {
            this.visibleLostBusiness = false;
            this.visibleLostBusinessDetail = false;
            this.setControlValue('LostBusinessCode', '');
            this.setControlValue('LostBusinessDetailCode', '');
            this.riMaintenance.SetRequiredStatus('LostBusinessCode', false);
            this.riMaintenance.SetRequiredStatus('LostBusinessDetailCode', false);
        }
    }
    public ReinstateInd_onclick(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (this.getControlValue('ReinstateInd')) {
                this.dtDetailReinstateDate = this.dtDetailDeleteDate;
                this.riExchange.riInputElement.Enable(this.uiForm, 'DetailReinstateDate');
                this.riMaintenance.CBORequestClear();
                this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetServiceAnnualValue';
                this.riMaintenance.CBORequestAdd('ServiceCoverRowID');
                this.riMaintenance.CBORequestAdd('DetailReinstateDate');
                this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                    //
                });
                this.SavedServiceAnnualValue = this.getControlValue('ServiceAnnualValue');
            }
            else {
                this.setControlValue('DetailReinstateDate', '');
                this.disableControl('DetailReinstateDate', true);
                this.riMaintenance.SetRequiredStatus('DetailReinstateDate', false);
                this.dtDetailReinstateDate = null;
            }
        }
    }
    public riExchange_CBORequest(): void {
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceDetailQty') && !(this.getControlValue('DetailDeleteDate')))
            this.vbRunDetailLocations = true;
        else if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'DetailDeleteDate') && !(this.getControlValue('DetailDeleteDate')))
            this.vbRunDetailLocations = false;
        else if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ReinstateInd'))
            this.vbRunDetailLocations = true;

        if ((this.riExchange.riInputElement.HasChanged(this.uiForm, 'DetailCommenceDate') && !(this.getControlValue('DetailCommenceDate'))) ||
            (this.riExchange.riInputElement.HasChanged(this.uiForm, 'DetailDeleteDate') && !(this.getControlValue('DetailDeleteDate'))) ||
            (this.riExchange.riInputElement.HasChanged(this.uiForm, 'DetailReinstateDate') && !(this.getControlValue('DetailReinstateDate')))) {
            this.riMaintenance.CBORequestClear();
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetServiceAnnualValue';
            this.riMaintenance.CBORequestAdd('ServiceCoverRowID');
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'DetailCommenceDate'))
                this.riMaintenance.CBORequestAdd('DetailCommenceDate');
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'DetailDeleteDate'))
                this.riMaintenance.CBORequestAdd('DetailDeleteDate');
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'DetailReinstateDate'))
                this.riMaintenance.CBORequestAdd('DetailReinstateDate');
            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                //
            });
            this.SavedServiceAnnualValue = this.getControlValue('ServiceAnnualValue');
        }
    }
    public DisableFields(): void {
        this.disableDetailCommenceDate = true;
        if (this.dtDetailCommenceDate && (this.DeleteDateDisplay || this.dtDetailDeleteDate)) {
            this.disableDetailDeleteDate = true;
            this.setFocusReinstateInd.emit(true);
        }
        else {
            this.disableDetailDeleteDate = false;
            this.setFocusDetailDeleteDate.emit(true);
        }
    }
    public riMaintenance_BeforeSelect(): void {
        if (this.parentMode === 'Contact') {
            this.getControlValue('PremiseNumber');
            this.getControlValue('PremiseName');
            this.getControlValue('ProductCode');
            this.getControlValue('ProductDesc');
            this.getControlValue('ServiceCoverRowID');
            this.getControlValue('LostBusinessRequestNumber');
        }
    }
    public riMaintenance_BeforeFetch(): void {
        if ((this.getControlValue('ServiceCoverRowID') === ''))
            this.GetServiceCoverDetails();
        else
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = this.getControlValue('ServiceCoverRowID') + this.Pending;
    }
    public riMaintenance_AfterFetch(): void {
        this.riMaintenance.FunctionUpdate = true;
        this.HideShowFields();
        this.SavedServiceAnnualValue = this.getControlValue('ServiceAnnualValue');
    }
    public riMaintenance_BeforeAdd(): void {
        this.GetServiceCoverDetails();
        if (this.getControlValue('LocationEnabled') === 'yes')
            this.riMaintenance.SetRequiredStatus('ServiceDetailQty', true);
        this.disableControl('DetailDeleteDate', true);
        this.SavedServiceAnnualValue = this.getControlValue('ServiceAnnualValue');
    }
    public riMaintenance_BeforeUpdate(): void {
        this.DisableFields();
    }
    public riMaintenance_BeforeSave(): void {
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = this.getControlValue('ServiceCoverRowID') + this.Pending;
    }
    public promptSave(event: any): void {
        if (this.getControlValue('DetailCommenceDate') === '') {
            let detailCommenceDate = document.querySelector('#DetailCommenceDate input[type="text"]');
            this.utils.removeClass(detailCommenceDate, 'ng-untouched');
            this.utils.addClass(detailCommenceDate, 'ng-touched');
        }
        if (this.riExchange.validateForm(this.uiForm)) {
            this.promptModal.show();
        }
    }

    public riMaintenance_AfterSave(): void {
        // let annualValueChange = this.getControlValue('AnnualValueChange');
        // if (annualValueChange.toString().indexOf('(') === 0 && annualValueChange.toString().indexOf(')') === annualValueChange.length - 1) {
        //     annualValueChange = annualValueChange.replace(/[^0-9\.]+/g, '');
        //     annualValueChange = annualValueChange * -1;
        //     this.setControlValue('AnnualValueChange', annualValueChange);
        // }
        if (!this.DeleteDateDisplay)
            this.setControlValue('DetailDeleteDate', '');
        else
            this.setControlValue('DetailDeleteDate', this.DeleteDateDisplay);
        this.setControlValue('DetailCommenceDate', this.dtDetailCommenceDate.getDate() + '/' + (this.dtDetailCommenceDate.getMonth() + 1) + '/' + this.dtDetailCommenceDate.getFullYear());
        if (this.displayReinstateInd === true)
            this.setControlValue('DetailReinstateDate', this.DeleteReinstateDateDisplay);
        else {
            this.dtDetailReinstateDate = null;
            this.setControlValue('DetailReinstateDate', '');
        }
        let fields = `ContractNumber, PremiseNumber , ProductCode , ProductDetailCode , ReinstateInd,Pending,
        ProductDetailDesc ,DetailCommenceDate , DetailDeleteDate ,  DetailReinstateDate , ServiceAnnualValue , AnnualValueChange , 
        LostBusinessCode  , LostBusinessDetailCode  , ServiceDetailQty , ServiceSalesEmployee , EmployeeSurname,
        LostBusinessRequestNumber , ServiceBranchNumber , ServiceCoverRowID , ServiceCoverDetailROWID , LocationEnabled`;
        fields = fields.replace(/\\t/g, '').replace(/\r?\n|\r/g, '').replace(/ /g, '');
        let fieldsArr = fields.split(',');
        this.riMaintenance.clear();
        for (let i = 0; i < fieldsArr.length; i++) {
            let id = fieldsArr[i];
            let dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            let value = this.riExchange.riInputElement.GetValue(this.uiForm, id);
            this.riMaintenance.PostDataAdd(id, value, dataType);
        }
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasOwnProperty('errorMessage')) {
                if (data.errorMessage.trim() !== '') {
                    this.messageModal.show({ msg: data.errorMessage, title: this.errorTitle }, false);
                }
            } else {
                if (this.Pending) {
                    this.riMaintenance.FunctionUpdate = false;
                }
                else {
                    if (data.DetailCommenceDate)
                        this.dtDetailCommenceDate = this.utils.convertDate(data.DetailCommenceDate);
                    if (data.DetailDeleteDate === '') {
                        this.DeleteDateDisplay = null;
                        this.dtDetailDeleteDate = null;
                    }
                    else {
                        this.DeleteDateDisplay = data.DetailDeleteDate;
                    }
                    this.HideShowFields();
                    this.DisableFields();
                }
                this.formPristine();

                if (this.getControlValue('LocationEnabled') === 'yes')
                    this.navigate('ProductDetail', InternalGridSearchServiceModuleRoutes.ICABSASERVICECOVERDETAILLOCATIONENTRYGRID);
                else {
                    this.messageModal.show({ msg: this.messageContentSaved, title: '' }, false);
                    this.disableControl('ProductDetailCode', true);
                    this.disableControl('ProductDetailDesc', true);
                }

                if (this.parentMode === 'LookUp')
                    this.displayReinstateInd = false;
            }
        }, 'POST', this.dataPostModeAction);
    }

    public enableForm(): void {
        this.uiForm.enable();
        for (let i = 0; i < this.controls.length; i++) {
            if (this.controls[i].disabled) {
                this.disableControl(this.controls[i].name, true);
            }
        }
    }
    private window_onload(): void {
        this.getSysCharDtetails();
        this.SetCurrentContractType();
        this.setControlValue('Pending', this.riExchange.URLParameterContains('Pending'));
        if (this.parentMode !== 'LookUp') {
            this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.setControlValue('ServiceSalesEmployee', this.riExchange.getParentHTMLValue('ServiceSalesEmployee'));
            this.setControlValue('ProductDetailCode', this.riExchange.getParentHTMLValue('ProductDetailCode'));
            this.setControlValue('ProductDetailDesc', this.riExchange.getParentHTMLValue('ProductDetailDesc'));
            this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
            this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
            this.ellipsis.productDetailsEllipsis.childparams.productCode = this.getControlValue('ProductCode');
            this.setControlValue('LostBusinessCode', this.riExchange.getParentHTMLValue('LostBusinessCode'));
            this.setControlValue('LostBusinessDesc', this.riExchange.getParentHTMLValue('LostBusinessDesc'));
            this.setControlValue('LostBusinessDetailCode', this.riExchange.getParentHTMLValue('LostBusinessDetailCode'));
            this.setControlValue('LostBusinessDetailDesc', this.riExchange.getParentHTMLValue('LostBusinessDetailDesc'));
            this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
            this.ellipsis.productDetailsEllipsis.childparams.productDesc = this.getControlValue('ProductDesc');
            if (!this.getControlValue('AnnualValueChange'))
                this.setControlValue('AnnualValueChange', '');
            if (this.parentMode === 'Search' || this.parentMode === 'SearchAdd') {
                this.setControlValue('ServiceCoverRowID', this.riExchange.getParentAttributeValue('ProductCode'));
            }
            if (this.parentMode === 'ServiceCover')
                this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
            this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
        }
        this.disableControl('ProductDetailDesc', true);
        this.riMaintenance_Search();
        if (!this.getControlValue('ServiceDetailQty'))
            this.setControlValue('ServiceDetailQty', '0');
        this.setControlValue('DetailCommenceDate', '');
        if (this.parentMode) {
            switch (this.parentMode) {
                case 'SearchAdd':
                case 'ServiceCover':
                    this.postRequestForServiceCoverRow();
                    this.riMaintenance.AddMode();
                    this.setControlValue('ProductDetailCode', this.riExchange.getParentHTMLValue('ProductDetailCode'));
                    this.disableDetailDeleteDate = true;
                    this.disableDetailCommenceDate = false;
                    break;
                case 'Contact':
                    this.riMaintenance.SelectMode();
                    this.visibleContractNumberSelectionEllipsis = true;
                    this.visiblePremiseNumberSelectionEllipsis = true;
                    this.visibleProductCodeSelectionEllipsis = true;
                    this.visibleOpenServiceCoverDetailEllipsis = true;
                    this.disableControl('ProductDetailCode',  true);
                    this.sendContractNumber();
                    break;
                case 'Contact-View':
                    this.postRequest();
                    this.riMaintenance.FetchRecord();
                    this.callriMaintenance();
                    this.riMaintenance.FunctionUpdate = false;
                    break;
                case 'LookUp':
                    if (!this.isReturning()) {
                        this.uiForm.disable();
                        setTimeout(() => {
                            this.contractNumberEllipsis.openModal();
                        }, 1000);
                        this.disableControl('ContractNumber', false);
                        this.setControlValue('ServiceAnnualValue', '');
                        this.displayReinstateInd = false;
                        this.disableControl('ProductDetailDesc', true);
                        this.visibleOpenServiceCoverDetailEllipsis = true;
                        this.disableDetailCommenceDate = true;
                        this.disableDetailDeleteDate = true;
                    } else {
                        this.uiForm.enable();
                        this.setControlValue('AnnualValueChange', '0');
                        this.disableControl('ContractNumber', true);
                        this.disableControl('PremiseNumber', true);
                        this.disableControl('ProductCode', true);
                        this.disableControl('ContractName', true);
                        this.disableControl('PremiseName', true);
                        this.disableControl('ProductDesc', true);
                        this.setControlValue('ProductDetailCode', '');
                        this.setControlValue('ProductDetailDesc', '');
                        this.setControlValue('LostBusinessCode', '');
                        this.setControlValue('LostBusinessDetailCode', '');
                        this.disableControl('ProductDetailDesc', true);
                        this.disableDetailCommenceDate = true;
                        this.disableDetailDeleteDate = true;
                        this.visibleOpenServiceCoverDetailEllipsis = true;
                        this.postRequestForServiceCoverRow();

                    }
                    break;
                default:
                    this.postRequestForServiceCoverRow();
                    this.riMaintenance.UpdateMode();
                    if (this.riMaintenance.RecordSelected(false)) {
                        this.riMaintenance.FetchRecord();
                    }
                    this.callriMaintenance();
            }
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.disableControl('ServiceAnnualValue', true);
            this.visibleOpenProductCodeEllipsis = true;
            this.riMaintenance.execMode(MntConst.eModeAdd, [this]);
        }
        else if ((this.riMaintenance.CurrentMode === MntConst.eModeUpdate)) {
            this.disableDetailCommenceDate = true;
            this.callriMaintenance();
            this.disableControl('ProductDetailCode', true);
            this.disableControl('ProductDetailDesc', true);
            this.postRequestDetailCommenceDate();
            this.visibleProductDetailSelectionEllipsis = false;
            this.riMaintenance.execMode(MntConst.eModeUpdate, [this]);
        }
    }

    public saveData(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.riMaintenance.CurrentMode = MntConst.eModeSaveAdd;
            this.dataPostModeAction = 1;
        }
        else {
            this.riMaintenance.CurrentMode = MntConst.eModeSaveUpdate;
            this.dataPostModeAction = 2;
        }
        this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this]);
        this.riMaintenance_AfterSave();
    }
    public LookUpProductDetailDesc(): void {
        // this.doLookupformData();
        this.doLookupProductDetail();
    }

    public doLookupProductDetail(): void {
        let lookupIP = [
            {
                'table': 'ProductDetail',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductDetailCode': this.getControlValue('ProductDetailCode')
                },
                'fields': ['ProductDetailDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let ProductDetail = data[0][0];
            if (ProductDetail) {
                if (this.parentMode === 'LookUp') {
                    this.displayReinstateInd = false;
                    this.postRequest();
                    this.setControlValue('ProductDetailDesc', ProductDetail.ProductDetailDesc);
                    this.postRequestDetailCommenceDate();
                    this.riMaintenance.UpdateMode();
                    this.DeleteDateDisplay = null;
                    this.disableDetailDeleteDate = false;
                } else {
                    this.setControlValue('ProductDetailDesc', ProductDetail.ProductDetailDesc);
                    this.disableControl('ContractName', true);
                    this.disableControl('PremiseName', true);
                    this.disableControl('ProductDesc', true);
                    this.disableControl('ServiceAnnualValue', true);
                    this.disableControl('ContractNumber', true);
                    this.disableControl('PremiseNumber', true);
                    this.disableControl('ProductCode', true);
                }
            }
        });
    }
    public sendContractNumber(): void {
        this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.getControlValue('ContractName');
        this.disableControl('PremiseNumber', false);
        this.setControlValue('ServiceCoverRowID', '');
    }
    public sendContractPremiseNumber(): void {
        this.ellipsis.ProductCodeEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.ProductCodeEllipsis.childparams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.disableControl('ProductCode', false);
    }
    public doLookupEmployee(): void {
        let lookupIP = [
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'EmployeeCode': this.getControlValue('ServiceSalesEmployee')
                },
                'fields': ['EmployeeSurname']
            }

        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Employee = data[0][0];
            if (Employee) {
                this.setControlValue('EmployeeSurname', Employee.EmployeeSurname);
            }
        });
    }
    public doLookupformData(): void {
        let lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ProductDesc']
            },
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'EmployeeCode': this.getControlValue('ServiceSalesEmployee')
                },
                'fields': ['EmployeeSurname']
            }

        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Contract = data[0][0];
            if (Contract) {
                this.setControlValue('ContractName', Contract.ContractName);
                this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
                this.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.getControlValue('ContractName');
            }
            let Premise = data[1][0];
            if (Premise) {
                this.setControlValue('PremiseName', Premise.PremiseName);
                this.ellipsis.ProductCodeEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
                this.ellipsis.ProductCodeEllipsis.childparams.ContractName = this.getControlValue('ContractName');
                this.ellipsis.ProductCodeEllipsis.childparams.PremiseNumber = this.getControlValue('PremiseNumber');
                this.ellipsis.ProductCodeEllipsis.childparams.PremiseName = this.getControlValue('PremiseName');
            }
            let Product = data[2][0];
            if (Product) {
                this.ellipsis.ProductCodeEllipsis.childparams['ProductCode'] = this.getControlValue('ProductCode');
                this.setControlValue('ProductDesc', Product.ProductDesc);
                this.uiForm.enable();
                this.disableControl('ContractNumber', true);
                this.disableControl('PremiseNumber', true);
                this.disableControl('ProductCode', true);
                this.disableControl('ContractName', true);
                this.disableControl('PremiseName', true);
                this.disableControl('ProductDesc', true);
                this.disableControl('ServiceAnnualValue', true);
                this.ellipsis.serviceCoverDetailsEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
                this.ellipsis.serviceCoverDetailsEllipsis.childparams.PremiseNumber = this.getControlValue('PremiseNumber');
                this.ellipsis.serviceCoverDetailsEllipsis.childparams.ProductCode = this.getControlValue('ProductCode');
                this.ellipsis.serviceCoverDetailsEllipsis.childparams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
                // if (!this.getControlValue('ServiceCoverRowID'))
                this.postRequestForServiceCoverRow();
            }
            let Employee = data[3][0];
            if (Employee) {
                this.setControlValue('EmployeeSurname', Employee.EmployeeSurname);
            }
        });
    }

    public setDetailCommenceDate(): void {
        this.dtDetailCommenceDate = this.utils.convertDate(this.getControlValue('DetailCommenceDate'));
    }
    public DetailDeleteDateValue(value: any): void {
        if (value && value.value) {
            this.DeleteDateDisplay = value.value;
            this.postRequestforAnnualValueOnDeleteDate();
        }
    }
    DetailReinstateDateValue(value: any): void {
        if (value && value.value) {
            this.DeleteReinstateDateDisplay = value.value;
        }
    }
    public displayError(error: any, apiError?: any): void {
        this.errorService.emitError(error);
        if (apiError) {
            //
        }
    }
    public ngOnDestroy(): void {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }

    public showErrorModal(data: any, param?: boolean): void {
        this.errorModal.show(data, true);
    };

    public showMessageModal(data: any, param?: boolean): void {
        this.messageModal.show({ msg: data, title: 'Message' }, false);
    };

    public onProductDetailCodeDataReceived(data: any): void {
        this.messageModal.show({ msg: 'Record Saved Successfully' }, true);
    }

    public onContractSearchDataReceived(data: any): void {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);
        this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.getControlValue('ContractName');
        this.uiForm.controls['ContractNumber'].markAsDirty();
        this.uiForm.disable();
        this.disableControl('ContractNumber', false);
        this.disableControl('PremiseNumber', false);
        this.setControlValue('ServiceCoverRowID', '');

    }
    public onPremiseSearchhDataReceived(data: any): void {
        this.setControlValue('PremiseNumber', data.PremiseNumber);
        this.setControlValue('PremiseName', data.PremiseName);
        this.ellipsis.ProductCodeEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.ProductCodeEllipsis.childparams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.ProductCodeEllipsis.childparams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.ellipsis.ProductCodeEllipsis.childparams.PremiseName = this.getControlValue('PremiseName');
        this.uiForm.controls['PremiseNumber'].markAsDirty();
        this.uiForm.disable();
        this.disableControl('ContractNumber', false);
        this.disableControl('PremiseNumber', false);
        this.disableControl('ProductCode', false);
    }
    public onProductCodeDataReceived(data: any): void {
        this.setControlValue('ServiceCoverRowID', data.row.ttServiceCover);
        this.setControlValue('ProductCode', data.ProductCode);
        this.setControlValue('ProductDesc', data.ProductDesc);
        this.setControlValue('PremiseName', data.PremiseName);
        this.doLookupformData();
        this.uiForm.controls['ProductCode'].markAsDirty();
        this.uiForm.enable();
        this.disableControl('ContractNumber', true);
        this.disableControl('PremiseNumber', true);
        this.disableControl('ProductCode', true);
        this.disableControl('ContractName', true);
        this.disableControl('PremiseName', true);
        this.disableControl('ProductDesc', true);
        this.disableControl('ServiceAnnualValue', true);
        this.ellipsis.serviceCoverDetailsEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.serviceCoverDetailsEllipsis.childparams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.ellipsis.serviceCoverDetailsEllipsis.childparams.ProductCode = this.getControlValue('ProductCode');
        this.ellipsis.serviceCoverDetailsEllipsis.childparams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
        this.postRequestForServiceCoverRow();
    }
    public onServiceCoverDetailDataReceived(data: any): void {
        this.setControlValue('DetailDeleteDate', '');
        this.DeleteDateDisplay = null;
        this.dtDetailDeleteDate = null;
        this.setControlValue('ProductDetailCode', data.row.ProductDetailCode);
        this.setControlValue('ProductDetailDesc', data.row.ProductDetailDesc);
        this.setControlValue('ServiceDetailQty', data.row.ServiceDetailQty);
        this.postRequest();
        if (this.LookUpServiceCoverEllipsisDeleteDateFlag) {
            if (data.row.DetailDeleteDate) {
                this.setControlValue('DetailDeleteDate', this.utils.convertDate(data.row.DetailDeleteDate));
                this.dtDetailDeleteDate = this.utils.convertDate(data.row.DetailDeleteDate);
            }
        }
    }

    public onProductDetailDataReceived(data: any): void {
        this.setControlValue('ProductDetailCode', data.ProductDetailCode);
        this.setControlValue('ProductDetailDesc', data.ProductDetailDesc);
        this.ProductDetailCodeOnchange();
    }

    public onemployeeSearchDataReceived(data: any): void {
        this.setControlValue('ServiceSalesEmployee', data.ServiceSalesEmployee);
        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
    }
    public clearForm(): void {
        this.setControlValue('AnnualValueChange', '');
        this.setControlValue('LostBusinessCode', '');
        this.setControlValue('LostBusinessDesc', '');
        this.setControlValue('LostBusinessDetailCode', '');
        this.setControlValue('LostBusinessDetailDesc', '');
        this.dtDetailReinstateDate = null;
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.setControlValue('DetailDeleteDate', '');
            this.dtDetailCommenceDate = null;
            this.DeleteDateDisplay = '';
            this.dtDetailDeleteDate = null;
            this.setControlValue('ProductDetailCode', '');
            this.setControlValue('ProductDetailDesc', '');
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (!this.displayReinstateInd) {
                this.dtDetailDeleteDate = null;
                this.DeleteDateDisplay = null;
            }
            else {
                this.setControlValue('ReinstateInd', false);
                this.dtDetailReinstateDate = null;
            }
        }
        if (this.parentMode === 'LookUp') {
            this.dtDetailDeleteDate = null;
            if (this.dtDetailDeleteDate === null)
                this.dtDetailDeleteDate = void 0;
            else
                this.dtDetailDeleteDate = null;

            this.postRequest();
            this.postRequestDetailCommenceDate();
        }
    }
}
