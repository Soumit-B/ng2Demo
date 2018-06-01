import { InternalGridSearchServiceModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';
import { HttpService } from '../../../shared/services/http-service';
import { Component, OnInit, NgZone, OnDestroy, AfterViewInit, ViewChild, Input, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { Http, URLSearchParams } from '@angular/http';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { Utils } from './../../../shared/services/utility';
import { ErrorService } from '../../../shared/services/error.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { TranslateService } from 'ng2-translate';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSAServiceVisitSummary.html'
})

export class ServiceVisitSummaryComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('historyGrid') historyGrid: GridComponent;
    @ViewChild('historyGridPagination') historyGridPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('productCodeSearchEllipsis') productCodeSearchEllipsis: EllipsisComponent;

    public showHeader: boolean = true;
    private sortUpdate: boolean = true;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public additionalProperty: boolean = true;
    public headerClickedColumn: string = '';
    public riSortOrder: string = '';
    public searchModalRoute: string = '';
    public serviceCoverSearchComponent = ServiceCoverSearchComponent;
    public inputParamsServiceCover: any = {
        'parentMode': 'LookUp-Freq',
        currentContractTypeURLParameter: 'Contract',
        'ContractNumber': '',
        'ContractName': '',
        'PremiseNumber': '',
        'PremiseName': ''
    };
    public formatData: any = { pageName: 'visitSummary', timeFormatIndex: {} };
    public headerProperties: Array<any> = [];
    public gridSortHeaders: Array<any> = [];
    public premiseSearchComponent: Component = PremiseSearchComponent;
    public inputParamsPremise: any = {
        'parentMode': 'Search',
        'showAddNew': false
    };
    public showCloseButton: boolean = true;
    private isDisplayLevelInd: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    private columnIndex: any = {
        ServiceDateStart: 0,
        VisitTypeCode: 0,
        ProductCode: 0,
        PremiseNumber: 0,
        PrintTreatment: 0,
        Information: 0,
        VisitDetail: 0,
        Recommendation: 0,
        ServiceVisitFrequency: 0,
        VisitReference: 0,
        StandardDuration: 0,
        OvertimeDuration: 0,
        Employee: 0,
        EmployeeSurname: 0,
        ItemDescription: 0,
        BarcodeScanInd: 0,
        PremiseContactSignature: 0,
        NoPremiseVisitReasonCode: 0,
        ProductList: 0,
        Infestations: 0,
        DeliveryNoteNo: 0,
        ReplacementValue: 0,
        PrepCodes: 0,
        PrepCost: 0,
        ServiceVisitCost: 0,
        TotalCost: 0,
        DrivingChargeValue: 0,
        WorkLoadIndexTotal: 0,
        VisitsDue: 0,
        UserCode: 0
    };
    public isExistColumns: any = {
        ServiceDateStart: false,
        VisitTypeCode: false,
        PremiseNumber: false,
        ProductCode: false,
        ServiceVisitFrequency: false,
        PrintTreatment: false,
        VisitDetail: false,
        Recommendation: false
    };
    //Module parameters
    public inputParams: any = {};
    public subscription: Subscription;
    public storeSubscription: Subscription;
    public ajaxSubscription: Subscription;
    public contractStoreData: any;
    public storeData: any;
    public validateProperties: Array<any> = [];

    private strPremiseTitle: string = ' Premises Visit Summary';
    private strServiceTitle: string = ' Service Visit Summary';
    public pageTitle: string;

    public vbDisplayLevelInd: boolean = false;
    public vbPremiseError: boolean = false;
    public vbProductError: boolean = false;
    public vbContractError: boolean = false;
    public vbPremiseVisitOption: boolean = false;
    public blnInstantReport: boolean = true;
    public btnTxt: string = 'Submit Report Generation';
    //Visit summary history grid
    private enablePreps: string = 'False';
    private enableInfestations: string = 'False';
    private enableVisitDurations: string = 'True';
    private enableVisitCostings: string = 'True';
    private enableDrivingCharges: string = 'False';
    private enableWorkLoadIndex: string = 'False';
    private enableVisitRef: string = 'False';
    private enableUserCode: string = 'False';
    private enableVisitDetail: string = 'False';
    private enableWED: string = 'False';
    private enableServCoverDispLevel: string = 'False';
    private enableServDocketNoVisitEntry: string = 'False';
    private enableBarcodes: string = 'False';
    private enableNoServiceReasons: string = 'False';
    private enableServiceEntryUserCodeLog: string = 'False';
    public businessCode: string = this.utils.getBusinessCode();
    public countryCode: string = this.utils.getCountryCode();
    public dt: Date = new Date();
    public currDate = new Date();
    public currDate2 = new Date();
    public dateFrom: string;
    public dateTo: string;
    public pagination: boolean = true;
    public pageSize: number = 10;
    public pageCurrent: string = '1';
    public itemsPerPage: number = 10;
    public page: number = 1;
    public maxColumn: number = 0;
    public infoDataColumnReference: any = null;
    public isRequesting: boolean = false;
    public method: string = 'service-delivery/maintenance';
    public module: string = 'service';
    public operation: string = 'Application/iCABSAServiceVisitSummary';
    public search: URLSearchParams;
    public contractNumber: any;
    public contractName: string;
    public premiseNumber: any;
    public premiseName: string;
    public productCode: any;
    public productDesc: string;
    public serviceVisitAnnivDate: any;
    public serviceVisitFrequency: any;
    public effectiveDate: string;
    public effectiveDateTo: string;
    public cmdSubmitEnabled: boolean = true;
    public premiseOption: any;
    public repDest: any;
    public menuOptions: Array<any>;
    public menuType: string;
    public searchTypeOptions: Array<any>;
    public searchType: string = '';
    public contractNumberEnabled: boolean = true;
    public contractNameEnabled: boolean = true;
    public premiseNumberEnabled: boolean = true;
    public premiseNumberHide: boolean = false;
    public productCodeHide: boolean = false;
    public premiseNameEnabled: boolean = true;
    public productCodeEnabled: boolean = true;
    public productDescEnabled: boolean = true;
    public serviceVisitAnnivDateEnabled: boolean = true;
    public serviceVisitFrequencyEnabled: boolean = true;
    public productDisplay: boolean = false;
    public submitBlockDisplay: boolean = false;
    public informationDisplay: boolean = false;
    public repDestHeaderDisplay: boolean = false;
    public repDestSelectDisplay: boolean = false;
    public informationDetails: string;
    public repDestOptions: Array<any>;
    public wasteConsignmentNoteNumber: any;
    public serviceCoverRowID: any;
    public menuDisplay: boolean = true;
    public isNationalAccount: boolean = false;
    public showFreqIndDisplay: boolean = false;
    public showFreqIndChecked: boolean = true;
    public backLinkText: string = '';
    private querySysChar: URLSearchParams = new URLSearchParams();
    public premiseRequired: boolean = false;
    public totalItems: number;
    public currentPage: number;
    public showTotalRow: boolean = true;
    private premiseRowID: string;
    private premiseVisitRowID: string;
    private serviceVisitRowID: string;
    public contractLabel: string = 'Contract';

    constructor(
        private router: Router,
        private componentInteractionService: ComponentInteractionService,
        private translateService: LocaleTranslationService,
        private translate: TranslateService,
        private store: Store<any>,
        private titleService: Title,
        private zone: NgZone,
        private serviceConstants: ServiceConstants,
        private utils: Utils,
        private _httpService: HttpService,
        private el: ElementRef,
        private errorService: ErrorService,
        private activatedRoute: ActivatedRoute,
        private systemCharacterConstant: SysCharConstants,
        private location: Location) {
        this.storeSubscription = store.select('contract').subscribe(data => {
            if (data !== null && data['data'] &&
                !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                this.contractStoreData = data['data'];
                this.inputParams.ContractType = this.contractStoreData['ContractType'];
                this.inputParams.contractNumber = this.contractStoreData['ContractNumber'];
                this.inputParamsPremise.ContractNumber = this.contractStoreData['ContractNumber'];
                this.inputParams.productCode = (this.contractStoreData['ProductCode']) ? this.contractStoreData['ProductCode'] : '';
                this.inputParams.productDesc = this.contractStoreData['ProductDesc'];
                this.inputParams.premiseNumber = (this.contractStoreData['PremiseNumber']) ? this.contractStoreData['PremiseNumber'] : '';
                this.inputParams.premiseName = this.contractStoreData['PremiseName'];
                this.inputParams.serviceVisitAnnivDate = this.contractStoreData['ServiceVisitAnnivDate'];;
                this.inputParams.entitlementMonth = this.contractStoreData['EntitlementMonth'];
                this.inputParams.serviceVisitFrequency = this.contractStoreData['ServiceVisitFrequency'];
                this.inputParams.dateTo = this.contractStoreData['dateTo'];
                this.inputParams.dateFrom = this.contractStoreData['dateFrom'];
                this.inputParams.serviceCoverRowID = this.contractStoreData['ServiceCoverRowID'];
                this.additionalProperty = true;
                this.storeData = data;
                if (this.contractStoreData['currentContractType']) {
                    this.inputParams.currentContractTypeCode = this.contractStoreData['currentContractType'];
                    this.contractLabel = this.utils.getCurrentContractLabel(this.inputParams.currentContractTypeCode);
                }
            }
        });

        this.subscription = activatedRoute.queryParams.subscribe(
            (param: any) => {
                this.inputParams.parentMode = param['parentMode'];
                if (param['currentContractTypeURLParameter']) {
                    this.inputParams.currentContractType = param['currentContractTypeURLParameter'];
                    this.inputParams.currentContractTypeCode = this.utils.getCurrentContractType(param['currentContractTypeURLParameter']);
                    this.contractLabel = this.utils.getCurrentContractLabel(this.inputParams.currentContractTypeCode);
                }
                this.inputParams.isNationalAccount = param['isNationalAccount'];
            });

    }

    public searchTypeChange(OptionsValue: string): void {
        this.searchType = OptionsValue;
        if (this.searchType === 'PremiseVisitInd') {
            this.pageTitle = this.strPremiseTitle;
            this.productDisplay = false;
            this.submitBlockDisplay = true;
            if (!this.blnInstantReport) {
                this.informationDisplay = true;
                this.informationDetails = '';
                this.repDestHeaderDisplay = true;
                this.repDestSelectDisplay = true;
            }
        } else {
            this.pageTitle = this.strServiceTitle;
            this.productDisplay = true;
            this.submitBlockDisplay = false;
            this.informationDisplay = false;
            this.repDestHeaderDisplay = false;
            this.repDestSelectDisplay = true;
        }
        let titleDoc: string = '';
        this.getTranslatedValue(this.contractLabel, null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    titleDoc += res;
                }
            });
        });
        this.getTranslatedValue(this.pageTitle, null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    titleDoc += res;
                }
            });
        });
        this.utils.setTitle(titleDoc);
        this.sortUpdate = true;
        this.setMaxColumn();
        this.historyGrid.clearGridData();
        this.historyGridPagination.setPage(1);
        this.pageCurrent = '1';
        this.historyGridPagination.setPage(1);
        this.updateView(this.inputParams);

    }

    public onPremiseDataReceived(data: any, route: any): void {
        this.premiseNumber = data.PremiseNumber;
        this.premiseName = data.PremiseName;
        this.inputParamsServiceCover.PremiseNumber = this.premiseNumber;
        this.inputParamsServiceCover.PremiseName = data.PremiseName;
        this.cmdSubmitEnabled = true;
        this.populateDescriptions(this.productCode);
    }

    public serviceCoverSearchDataReceived(data: any): void {
        this.productCode = data.ProductCode;
        this.productDesc = data.ProductDesc;
        this.serviceCoverRowID = data.row.ttServiceCover;
        this.populateDescriptions(this.productCode);
    }

    public contractNumberChange(contractNumber: string): void {
        this.contractNumber = contractNumber;
        this.inputParamsServiceCover.ContractNumber = this.contractNumber;
        if (contractNumber !== '') {
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '0');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set('ContractNumber', this.contractNumber);
            this.search.set('PostDesc', 'Contract');
            this.search.set(this.serviceConstants.CountryCode, this.countryCode);

            this.ajaxSubscription = this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(
                (data) => {
                    try {

                        this.inputParamsPremise.ContractName = data.ContractName;
                        this.inputParamsServiceCover.ContractName = data.ContractName;
                        this.contractName = data.ContractName;
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

    public premiseNumberChange(premiseNumber: string): void {
        this.premiseNumber = premiseNumber;
        if (this.premiseNumber !== '') {
            this.cmdSubmitEnabled = true;
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '0');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set('ContractNumber', this.contractNumber);
            this.search.set('countryCode', this.countryCode);
            this.search.set('PostDesc', 'Premise');
            this.search.set('PremiseNumber', this.premiseNumber);
            this.ajaxSubscription = this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(
                (data) => {
                    try {
                        if (data.PremiseName) {
                            this.inputParamsServiceCover.PremiseNumber = this.premiseNumber;
                            this.inputParamsServiceCover.PremiseName = data.PremiseName;
                            this.el.nativeElement.querySelector('#premiseNumber').classList.remove('ng-invalid');
                            this.el.nativeElement.querySelector('#premiseNumber').classList.add('ng-valid');
                        } else {
                            this.showAlert(MessageConstant.Message.RecordNotFound);
                            this.el.nativeElement.querySelector('#premiseNumber').classList.remove('ng-valid');
                            this.el.nativeElement.querySelector('#premiseNumber').classList.remove('ng-touched');
                            this.el.nativeElement.querySelector('#premiseNumber').classList.add('ng-touched');
                            this.el.nativeElement.querySelector('#premiseNumber').classList.add('ng-invalid');
                        }
                        this.premiseName = data.PremiseName;
                    } catch (error) {
                        this.errorService.emitError(error);
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );
        } else if (!this.premiseRequired) {
            this.cmdSubmitEnabled = false;
            this.premiseName = '';
            this.el.nativeElement.querySelector('#premiseNumber').classList.remove('ng-invalid');
            this.el.nativeElement.querySelector('#premiseNumber').classList.add('ng-valid');
        } else {
            this.el.nativeElement.querySelector('#premiseNumber').classList.remove('ng-valid');
            this.el.nativeElement.querySelector('#premiseNumber').classList.remove('ng-touched');
            this.el.nativeElement.querySelector('#premiseNumber').classList.add('ng-touched');
            this.el.nativeElement.querySelector('#premiseNumber').classList.add('ng-invalid');
        }
    }


    public selectedOptions(optionsValue: string): void {
        this.repDest = optionsValue;
    }

    private setButtonText(): void {
        this.btnTxt = (this.blnInstantReport) ? 'Proof Of Service Instant Report' : 'Submit Report Generation';
    }
    public getCurrentPage(event: any): void {
        this.pageCurrent = event.value;
        this.updateView(this.inputParams);
    }

    public onGridRowClick(data: any): void {
        switch (data.cellData.text) {
            case 'SP':
                this.treatmentPrint(data.cellData.rowID);
                break;
            default:
                break;
        }
        let idxPremiseRowID = -1, blnPremiseRowID = false, idxPremiseVisitRowID = -1, blnPremiseVisitRowID = false, idxServiceVisitRowID = -1, blnServiceVisitRowID = false,
            idxServiceCoverRowID = -1, blnServiceCoverRowID = false;
        if (this.searchType === 'PremiseVisitInd') {
            blnPremiseRowID = true;
            blnPremiseVisitRowID = true;
            if (this.premiseNumber) {
                idxPremiseVisitRowID = 0;
            } else {
                idxPremiseRowID = 0;
                idxPremiseVisitRowID = 1;
            }
        } else {
            if (!this.premiseNumber && !this.productCode) {
                blnServiceVisitRowID = true;
                blnServiceCoverRowID = true;
                blnPremiseRowID = true;
                idxServiceCoverRowID = 1;
                idxPremiseRowID = 0;
                if (this.searchType === 'DetailInd') {
                    idxServiceVisitRowID = 6;
                    if (this.enableVisitRef === 'True') {
                        idxServiceVisitRowID++;
                    }
                    if (this.enableVisitDetail === 'True') {
                        idxServiceVisitRowID++;
                    }
                }
            } else if (this.premiseNumber && !this.productCode) {
                blnServiceVisitRowID = true;
                blnServiceCoverRowID = true;
                idxServiceCoverRowID = 0;
                if (this.searchType === 'DetailInd') {
                    idxServiceVisitRowID = 5;
                    if (this.enableVisitRef === 'True') {
                        idxServiceVisitRowID++;
                    }
                    if (this.enableVisitDetail === 'True') {
                        idxServiceVisitRowID++;
                    }
                }
            } else {
                if (this.showFreqIndChecked) {
                    blnServiceVisitRowID = true;
                    blnServiceCoverRowID = true;
                    idxServiceCoverRowID = 0;
                    if (this.searchType === 'DetailInd') {
                        idxServiceVisitRowID = 3;
                        if (this.enableVisitRef === 'True') {
                            idxServiceVisitRowID++;
                        }
                        if (this.enableVisitDetail === 'True') {
                            idxServiceVisitRowID++;
                        }
                    }
                } else {
                    if (this.searchType === 'DetailInd') {
                        blnServiceVisitRowID = true;
                        idxServiceVisitRowID = 2;
                        if (this.enableVisitRef === 'True') {
                            idxServiceVisitRowID++;
                        }
                        if (this.enableVisitDetail === 'True') {
                            idxServiceVisitRowID++;
                        }
                        idxServiceCoverRowID = idxServiceVisitRowID;
                    }
                }
            }

        }
        if (idxPremiseRowID !== -1) {
            if (blnPremiseRowID) {
                if (data.trRowData[idxPremiseRowID].rowID) {
                    this.premiseRowID = data.trRowData[idxPremiseRowID].rowID;
                }
            } else {
                if (data.trRowData[idxPremiseRowID].AdditionalProperty) {
                    this.premiseRowID = data.trRowData[idxPremiseRowID].additionalData;
                }
            }
        }

        if (idxPremiseVisitRowID !== -1) {
            if (blnPremiseVisitRowID) {
                if (data.trRowData[idxPremiseVisitRowID].rowID) {
                    this.premiseVisitRowID = data.trRowData[idxPremiseVisitRowID].rowID;
                }
            } else {
                if (data.trRowData[idxPremiseVisitRowID].additionalData) {
                    this.premiseVisitRowID = data.trRowData[idxPremiseVisitRowID].additionalData;
                }
            }
        }
        if (idxServiceVisitRowID !== -1) {
            if (blnServiceVisitRowID) {
                if (data.trRowData[idxServiceVisitRowID].rowID) {
                    this.serviceVisitRowID = data.trRowData[idxServiceVisitRowID].rowID;
                }
            } else {
                if (data.trRowData[idxServiceVisitRowID].additionalData) {
                    this.serviceVisitRowID = data.trRowData[idxServiceVisitRowID].additionalData;
                }
            }
        }
        if (idxServiceCoverRowID !== -1) {
            if (blnServiceCoverRowID) {
                if (data.trRowData[idxServiceCoverRowID].rowID) {
                    this.serviceCoverRowID = data.trRowData[idxServiceCoverRowID].rowID;
                }
            } else {
                if (data.trRowData[idxServiceCoverRowID].additionalData) {
                    this.serviceCoverRowID = data.trRowData[idxServiceCoverRowID].additionalData;
                }
            }
        }
    }

    public onGridRowDblClick(data: any): void {
        this.onGridRowClick(data);
        switch (data.cellIndex) {
            case this.columnIndex.ServiceDateStart - 1:
                if (this.isExistColumns.ServiceDateStart)
                    this.showAlert('iCABSSePremiseVisitMaintenance.htm is yet developed');
                break;
            case this.columnIndex.VisitTypeCode - 1:
                if (this.isExistColumns.VisitTypeCode) {
                    this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSSESERVICEVISITMAINTENANCE], {
                        queryParams: {
                            parentMode: 'Summary',
                            currentContractTypeURLParameter: this.inputParams.currentContractType,
                            ServiceVisitRowID: this.serviceVisitRowID,
                            ContractNumber: this.contractNumber,
                            PremiseNumber: this.premiseNumber,
                            ProductCode: this.productCode
                        }
                    });
                }
                break;
            case this.columnIndex.PremiseNumber - 1:
                if (this.isExistColumns.PremiseNumber)
                    this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE],
                        {
                            queryParams: {
                                'parentMode': 'Summary',
                                'PremiseRowID': this.premiseRowID,
                                'ContractTypeCode': this.inputParams.currentContractTypeCode,
                                'CurrentContractType': this.inputParams.currentContractType
                            }
                        });
                break;
            case this.columnIndex.ProductCode - 1:
            case this.columnIndex.ServiceVisitFrequency - 1:
                if (this.isExistColumns.ProductCode)
                    this.router.navigate([ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE],
                        {
                            queryParams: {
                                'parentMode': 'Summary',
                                'ServiceCoverRowID': this.serviceCoverRowID
                            }
                        });
                break;
            case this.columnIndex.PrintTreatment - 1:
                if (this.isExistColumns.PrintTreatment)
                    this.treatmentPrint(data.cellData.rowID);
                break;
            case this.columnIndex.VisitDetail - 1:
                if (this.isExistColumns.VisitDetail) {
                    let premiseNumber: any, productCode: any;
                    if (this.premiseNumber === '' && this.productCode === '') {
                        premiseNumber = (data.trRowData[this.columnIndex.PremiseNumber - 1].text) ? data.trRowData[this.columnIndex.PremiseNumber - 1].text : this.premiseNumber;
                        productCode = (data.trRowData[this.columnIndex.ProductCode - 1].text) ? data.trRowData[this.columnIndex.ProductCode - 1].text : this.productCode;
                    } else if (this.premiseNumber !== '' && this.productCode === '') {
                        premiseNumber = this.premiseNumber;
                        productCode = (data.trRowData[this.columnIndex.ProductCode - 1].text) ? data.trRowData[this.columnIndex.ProductCode - 1].text : this.productCode;
                    } else if (this.premiseNumber === '' && this.productCode !== '') {
                        premiseNumber = (data.trRowData[this.columnIndex.PremiseNumber - 1]) ? data.trRowData[this.columnIndex.PremiseNumber - 1].text : this.premiseNumber;
                        productCode = this.productCode;
                    } else {
                        premiseNumber = this.premiseNumber;
                        productCode = this.productCode;
                    }
                    this.router.navigate([ContractManagementModuleRoutes.ICABSASERVICEVISITDETAILSUMMARY],
                        {
                            queryParams: {
                                'parentMode': 'Summary',
                                'ContractNumber': this.contractNumber,
                                'PremiseNumber': premiseNumber,
                                'ProductCode': productCode,
                                'ContractNumberServiceVisitRowID': this.serviceVisitRowID
                            }
                        });
                }
                break;
            case this.columnIndex.Recommendation - 1:
                if (this.isExistColumns.Recommendation) {
                    if (data.trRowData[data.cellIndex].text !== '' && data.trRowData[data.cellIndex].text !== undefined) {
                        this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSARECOMMENDATIONGRID.URL_1], {
                            queryParams: {
                                parentMode: 'Summary',
                                'ContractNumber': this.contractNumber,
                                'ContractName': this.contractName,
                                'PremiseNumber': this.premiseNumber,
                                'ProductCode': this.productCode,
                                'PremiseName': this.premiseName,
                                'ProductDesc': this.productDesc,
                                'currentContractType': this.inputParams.currentContractType,
                                'ServiceDateStart': data.trRowData[this.columnIndex.ServiceDateStart - 1].text
                            }
                        });
                    }
                }
                break;
            default:
                break;

        }
    }

    private treatmentPrint(rowId: string): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('Function', 'Single');
        this.search.set('countryCode', this.countryCode);
        this.search.set('PremiseVisitRowID', rowId);

        this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(
            (data) => {
                try {
                    window.open(data.url, '_blank');
                } catch (error) {
                    this.errorService.emitError(error);
                }

            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }


    public informationBox(data: any): void {
        let msg: string = '';
        if (data.data.additionalData) {
            msg = data.data.additionalData;
        } else {
            msg = MessageConstant.Message.noSpecialInstructions;
        }
        this.getTranslatedValue(msg, null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.showAlert(res);
                } else {
                    this.showAlert(msg);
                }
            });
        });
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }

    public refresh(event: any): void {
        this.sortUpdate = true;
        this.pageCurrent = '1';
        this.historyGridPagination.setPage(1);
        this.historyGrid.clearGridData();
        this.updateView(this.inputParams);
    }


    public updateView(params: any): void {
        this.inputParams = params;
        this.loadData(this.inputParams);
    }

    private AddSearchTypeOption(value: string, textVal: string): void {
        let optionObj = { 'text': textVal, value: value };
        this.searchTypeOptions.push(optionObj);
    }

    private buildSearchOption(): void {
        this.searchTypeOptions = [];
        if (!this.productCode) {
            this.searchType = 'PremiseVisitInd';
            this.pageTitle = this.strPremiseTitle;
            this.AddSearchTypeOption('PremiseVisitInd', 'Premises Visit');
        } else {
            this.searchType = 'DetailInd';
            this.pageTitle = this.strServiceTitle;
        }
        let titleDoc: string = '';
        this.getTranslatedValue(this.contractLabel, null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    titleDoc += res;
                }
            });
        });
        this.getTranslatedValue(this.pageTitle, null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    titleDoc += res;
                }
            });
        });
        this.utils.setTitle(titleDoc);
        this.AddSearchTypeOption('DetailInd', 'Service Covers Detail');
        this.AddSearchTypeOption('SummaryInd', 'Service Covers Summary');
        this.searchTypeChange(this.searchType);

    }

    public loadData(params: any): void {
        this.setFilterValues(params);
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.inputParams.search = this.search;
        this.historyGrid.loadGridData(this.inputParams);
    }

    public getGridInfo(info: any): void {
        this.historyGridPagination.totalItems = info.totalRows;
    }

    public getCurrentDate(): string {
        let today = new Date();

        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        let _date = dd + '/' + mm + '/' + yyyy;
        return _date;
    }

    public setUI(params: any): void {
        this.productCode = '';
        this.menuOptions = [{
            'text': 'Options',
            'value': ' '
        }, {
            'text': 'Add Service Visit',
            'value': 'AddVisit'
        }
        ];

        if (params.parentMode === 'DespatchGrid') {
            this.contractNumber = params.contractNumber;
            this.contractNumberChange(this.contractNumber);
            this.premiseNumber = params.premiseNumber;
            this.premiseNumberChange(this.premiseNumber);
        } else {
            this.contractNumber = params.contractNumber;
            this.contractNumberChange(this.contractNumber);
            this.premiseNumber = params.premiseNumber;
            this.premiseNumberChange(this.premiseNumber);
            this.wasteConsignmentNoteNumber = params.WasteConsignmentNoteNumber;
        }

        if (params.parentMode === 'ShowPremiseLevel') {
            this.serviceCoverRowID = params.ServiceCoverRowID;
            this.currDate = params.dateFrom;
            this.currDate2 = params.dateTo;
            this.contractNumber = params.contractNumber;
            this.contractNumberChange(this.contractNumber);
            this.premiseNumber = params.premiseNumber;
            this.premiseNumberChange(this.premiseNumber);
            this.searchType = 'PremiseVisitInd';
            this.searchTypeChange(this.searchType);
            this.menuDisplay = false;
        } else {
            this.contractNumber = params.contractNumber;
            this.contractNumberChange(this.contractNumber);
            this.premiseNumber = params.premiseNumber;
            this.premiseNumberChange(this.premiseNumber);
            this.wasteConsignmentNoteNumber = params.WasteConsignmentNoteNumber;
        }

        if (params.parentMode === 'Contract') {
            this.currDate2 = new Date();
            this.currDate = new Date(this.dt.getFullYear(), this.dt.getMonth() - 6, this.dt.getDate());
            this.menuDisplay = false;
        } else {
            this.currDate2 = new Date();
            this.currDate = new Date(this.dt.getFullYear() - 1, this.dt.getMonth(), this.dt.getDate());
        }

        if (this.inputParams.isNationalAccount === 'true') {
            this.currDate2 = new Date();
            this.currDate = new Date(this.dt.getFullYear(), this.dt.getMonth() - 3, this.dt.getDate());
        }

        if (params.parentMode === 'ServiceCover' || params.parentMode === 'ServiceVisitEntryGrid' || params.parentMode === 'UnreturnedConsignmentGrid') {
            this.productCode = params.productCode;
            this.productDesc = params.productDesc;
            this.serviceVisitFrequency = params.serviceVisitFrequency;
            this.serviceVisitAnnivDate = params.serviceVisitAnnivDate;
            if (params.parentMode === 'ServiceCover') {
                this.serviceCoverRowID = params.serviceCoverRowID;
            } else {
                //Need get service row id from BranchServiceAreaCode
                this.serviceCoverRowID = params.serviceCoverRowID;
                this.populateDescriptions(this.productCode);
            }
            this.searchType = 'DetailInd';
            this.showFreqIndChecked = false;
            this.menuDisplay = true;

        } else if (params.parentMode === 'DespatchGrid') {
            //Need get service row id from ServiceAreaListcode
            this.serviceCoverRowID = params.serviceCoverRowID;
            this.productCode = params.productCode;
            this.populateDescriptions(this.productCode);
            this.searchType = 'DetailInd';
            this.showFreqIndChecked = false;
            this.menuDisplay = true;
        }
        if (params.parentMode === 'Entitlement') {
            this.currDate2 = this.utils.convertDate(params.dateTo);
            this.currDate = this.utils.convertDate(params.dateFrom);
            this.productCode = params.productCode;
            this.populateDescriptions(this.productCode);
            this.searchType = 'DetailInd';
            this.showFreqIndChecked = false;
            this.menuDisplay = true;
        }
        if (params.parentMode === 'EntitlementVariance') {
            if (params.EntitlementMonth === 0) {
                this.currDate2 = new Date();
                this.currDate = new Date(this.dt.getFullYear(), 1, 1);
            } else {
                this.currDate2 = new Date();
                this.currDate = new Date(this.dt.getFullYear() - 1, params.EntitlementMonth + 1, 1);
            }
            this.serviceCoverRowID = params.ServiceCoverRowID;
            this.populateDescriptions(this.productCode);
            this.searchType = 'DetailInd';
            this.showFreqIndChecked = false;
            this.menuDisplay = true;
        }

        this.contractNumberEnabled = false;
        this.contractNameEnabled = false;
        this.premiseNameEnabled = false;
        this.productDescEnabled = false;
        this.serviceVisitAnnivDateEnabled = false;
        this.serviceVisitFrequencyEnabled = false;

        if (this.premiseNumber) {
            this.premiseNumberEnabled = false;
            this.premiseNumberHide = true;
        }
        if (this.productCode) {
            this.productCodeEnabled = false;
            this.productCodeHide = true;
        }

        if (this.premiseNumber) {
            this.cmdSubmitEnabled = true;
        } else {
            this.cmdSubmitEnabled = false;
        }
        if (this.inputParams.isNationalAccount === 'true') {
            this.el.nativeElement.querySelector('#premiseNumber').focus();
            this.premiseRequired = true;
        }

        this.dateFrom = this.currDate.getDate() + '/' + (this.currDate.getMonth() + 1) + '/' + this.currDate.getFullYear();
        this.dateTo = this.currDate2.getDate() + '/' + (this.currDate2.getMonth() + 1) + '/' + this.currDate2.getFullYear();
        this.buildSearchOption();
        this.setDisplayMax();

    }

    public populateDescriptions(productCode: string): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('countryCode', this.countryCode);
        if (this.contractNumber !== '')
            this.search.set('ContractNumber', this.contractNumber);
        if (this.premiseNumber !== '')
            this.search.set('PremiseNumber', this.premiseNumber);
        if (this.productCode !== '')
            this.search.set('ProductCode', this.productCode);
        if (this.serviceCoverRowID !== '')
            this.search.set('ServiceCoverRowID', this.serviceCoverRowID);
        this.search.set('Function', 'SetDisplayFields');

        this.ajaxSubscription = this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(
            (data) => {
                try {
                    this.contractNumber = data.ContractNumber;
                    this.contractName = data.ContractName;
                    this.premiseNumber = data.PremiseNumber;
                    this.premiseName = data.PremiseName;
                    this.productCode = data.ProductCode;
                    this.productDesc = data.ProductDesc;
                    if (data.PremiseNumber !== '' && data.PremiseName === '') {
                        this.premiseNumberChange(data.PremiseNumber);
                    }
                    if (data.ServiceVisitAnnivDate)
                        this.serviceVisitAnnivDate = data.ServiceVisitAnnivDate;
                    if (data.ServiceVisitFrequency)
                        this.serviceVisitFrequency = data.ServiceVisitFrequency;
                    if (this.serviceVisitFrequency === '0') {
                        this.serviceVisitFrequency = '';
                    }
                    if (data.ProductDesc) {
                        this.el.nativeElement.querySelector('#productCode').classList.remove('ng-invalid');
                        this.el.nativeElement.querySelector('#productCode').classList.add('ng-valid');
                    } else if (this.productCode !== '') {
                        this.el.nativeElement.querySelector('#productCode').classList.remove('ng-valid');
                        this.el.nativeElement.querySelector('#productCode').classList.remove('ng-touched');
                        this.el.nativeElement.querySelector('#productCode').classList.add('ng-touched');
                        this.el.nativeElement.querySelector('#productCode').classList.add('ng-invalid');
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

    private setMaxColumn(): void {
        this.maxColumn = 0;
        this.columnIndex.ServiceDateStart = 0;
        this.columnIndex.VisitTypeCode = 0;
        this.columnIndex.ProductCode = 0;
        this.columnIndex.PrintTreatment = 0;
        this.columnIndex.Information = 0;
        this.columnIndex.VisitDetail = 0;
        this.columnIndex.Recommendation = 0;
        this.columnIndex.PremiseNumber = 0;
        this.columnIndex.ServiceVisitFrequency = 0;
        this.columnIndex.StandardDuration = 0;
        this.columnIndex.OvertimeDuration = 0;
        this.columnIndex.VisitReference = 0;
        this.columnIndex.Employee = 0;
        this.columnIndex.EmployeeSurname = 0;
        this.columnIndex.ItemDescription = 0;
        this.columnIndex.BarcodeScanInd = 0;
        this.columnIndex.PremiseContactSignature = 0;
        this.columnIndex.NoPremiseVisitReasonCode = 0;
        this.columnIndex.ProductList = 0;
        this.columnIndex.Infestations = 0;
        this.columnIndex.DeliveryNoteNo = 0;
        this.columnIndex.ReplacementValue = 0;
        this.columnIndex.PrepCodes = 0;
        this.columnIndex.PrepCost = 0;
        this.columnIndex.ServiceVisitCost = 0;
        this.columnIndex.TotalCost = 0;
        this.columnIndex.DrivingChargeValue = 0;
        this.columnIndex.WorkLoadIndexTotal = 0;
        this.columnIndex.VisitsDue = 0;
        this.columnIndex.UserCode = 0;
        let premiseAdjustObj = {}, productAdjustObj = {}, visitTypeAdjustObj = {}, employeeAdjustObj = {}, employeeSurnameAdjustObj = {};
        this.headerProperties = [];
        this.validateProperties = [];
        this.isExistColumns.ServiceDateStart = false;
        this.isExistColumns.VisitTypeCode = false;
        this.isExistColumns.PremiseNumber = false;
        this.isExistColumns.ProductCode = false;
        this.isExistColumns.ServiceVisitFrequency = false;
        this.isExistColumns.PrintTreatment = false;
        this.isExistColumns.VisitDetail = false;
        this.isExistColumns.Recommendation = false;
        if (this.premiseNumber === '') {
            this.maxColumn++;
            this.columnIndex.PremiseNumber++;
            this.columnIndex.ServiceDateStart++;
            this.columnIndex.VisitTypeCode++;
            this.columnIndex.ProductCode++;
            this.columnIndex.PrintTreatment++;
            this.columnIndex.Information++;
            this.columnIndex.VisitDetail++;
            this.columnIndex.Recommendation++;
            this.columnIndex.ServiceVisitFrequency++;
            this.columnIndex.VisitReference++;
            this.columnIndex.StandardDuration++;
            this.columnIndex.OvertimeDuration++;
            this.columnIndex.Employee++;
            this.columnIndex.EmployeeSurname++;
            this.columnIndex.ItemDescription++;
            this.columnIndex.BarcodeScanInd++;
            this.columnIndex.PremiseContactSignature++;
            this.columnIndex.NoPremiseVisitReasonCode++;
            this.columnIndex.ProductList++;
            this.columnIndex.Infestations++;
            this.columnIndex.DeliveryNoteNo++;
            this.columnIndex.ReplacementValue++;
            this.columnIndex.PrepCodes++;
            this.columnIndex.PrepCost++;
            this.columnIndex.ServiceVisitCost++;
            this.columnIndex.TotalCost++;
            this.columnIndex.DrivingChargeValue++;
            this.columnIndex.WorkLoadIndexTotal++;
            this.columnIndex.VisitsDue++;
            this.columnIndex.UserCode++;

            premiseAdjustObj = {
                'align': 'center',
                'width': '100px',
                'index': this.columnIndex.PremiseNumber - 1
            };
            this.isExistColumns.PremiseNumber = true;
            this.validateProperties.push({
                'type': MntConst.eTypeText,
                'index': this.columnIndex.PremiseNumber - 1,
                'align': 'center'
            });
        }
        if (this.searchType !== 'PremiseVisitInd') {
            if (this.productCode === '') {
                this.maxColumn += 3;
                this.columnIndex.ProductCode++;
                this.columnIndex.ServiceVisitFrequency += 3;
                this.columnIndex.ServiceDateStart += 3;
                this.columnIndex.VisitTypeCode += 3;
                this.columnIndex.PrintTreatment += 3;
                this.columnIndex.Information += 3;
                this.columnIndex.VisitDetail += 3;
                this.columnIndex.Recommendation += 3;
                this.columnIndex.VisitReference += 3;
                this.columnIndex.StandardDuration += 3;
                this.columnIndex.OvertimeDuration += 3;
                this.columnIndex.Employee += 3;
                this.columnIndex.EmployeeSurname += 3;
                this.columnIndex.ItemDescription += 3;
                this.columnIndex.PremiseContactSignature += 3;
                this.columnIndex.NoPremiseVisitReasonCode += 3;
                this.columnIndex.ProductList += 3;
                this.columnIndex.Infestations += 3;
                this.columnIndex.DeliveryNoteNo += 3;
                this.columnIndex.ReplacementValue += 3;
                this.columnIndex.PrepCodes += 3;
                this.columnIndex.PrepCost += 3;
                this.columnIndex.ServiceVisitCost += 3;
                this.columnIndex.TotalCost += 3;
                this.columnIndex.DrivingChargeValue += 3;
                this.columnIndex.WorkLoadIndexTotal += 3;
                this.columnIndex.VisitsDue += 3;
                this.columnIndex.UserCode += 3;
                this.isExistColumns.ProductCode = true;
                productAdjustObj = {
                    'align': 'center',
                    'width': '100px',
                    'index': this.columnIndex.ProductCode - 1
                };
                this.validateProperties.push({
                    'type': MntConst.eTypeCode,
                    'index': this.columnIndex.ProductCode - 1,
                    'align': 'center'
                });
                this.validateProperties.push({
                    'type': MntConst.eTypeText,
                    'index': this.columnIndex.ProductCode,
                    'align': 'center'
                });
                this.isExistColumns.ServiceVisitFrequency = true;
                this.validateProperties.push({
                    'type': MntConst.eTypeInteger,
                    'index': this.columnIndex.ServiceVisitFrequency - 1,
                    'align': 'center'
                });
            } else if (this.showFreqIndChecked) {
                this.maxColumn++;
                this.columnIndex.ServiceVisitFrequency++;
                this.columnIndex.ServiceDateStart++;
                this.columnIndex.VisitTypeCode++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.VisitDetail++;
                this.columnIndex.Recommendation++;
                this.columnIndex.VisitReference++;
                this.columnIndex.StandardDuration++;
                this.columnIndex.OvertimeDuration++;
                this.columnIndex.Employee++;
                this.columnIndex.EmployeeSurname++;
                this.columnIndex.ItemDescription++;
                this.columnIndex.BarcodeScanInd++;
                this.columnIndex.PremiseContactSignature++;
                this.columnIndex.NoPremiseVisitReasonCode++;
                this.columnIndex.ProductList++;
                this.columnIndex.Infestations++;
                this.columnIndex.DeliveryNoteNo++;
                this.columnIndex.ReplacementValue++;
                this.columnIndex.PrepCodes++;
                this.columnIndex.PrepCost++;
                this.columnIndex.ServiceVisitCost++;
                this.columnIndex.TotalCost++;
                this.columnIndex.DrivingChargeValue++;
                this.columnIndex.WorkLoadIndexTotal++;
                this.columnIndex.VisitsDue++;
                this.columnIndex.UserCode++;
                this.validateProperties.push({
                    'type': MntConst.eTypeInteger,
                    'index': this.columnIndex.ServiceVisitFrequency - 1,
                    'align': 'center'
                });
            }
        }
        if (this.searchType === 'PremiseVisitInd' || this.searchType === 'DetailInd') {
            this.maxColumn++;
            this.columnIndex.VisitTypeCode++;
            this.columnIndex.PrintTreatment++;
            this.columnIndex.Information++;
            this.columnIndex.VisitDetail++;
            this.columnIndex.Recommendation++;
            this.columnIndex.ServiceDateStart++;
            this.columnIndex.VisitReference++;
            this.columnIndex.StandardDuration++;
            this.columnIndex.OvertimeDuration++;
            this.columnIndex.Employee++;
            this.columnIndex.EmployeeSurname++;
            this.columnIndex.ItemDescription++;
            this.columnIndex.BarcodeScanInd++;
            this.columnIndex.PremiseContactSignature++;
            this.columnIndex.NoPremiseVisitReasonCode++;
            this.columnIndex.ProductList++;
            this.columnIndex.Infestations++;
            this.columnIndex.DeliveryNoteNo++;
            this.columnIndex.ReplacementValue++;
            this.columnIndex.PrepCodes++;
            this.columnIndex.PrepCost++;
            this.columnIndex.ServiceVisitCost++;
            this.columnIndex.TotalCost++;
            this.columnIndex.DrivingChargeValue++;
            this.columnIndex.WorkLoadIndexTotal++;
            this.columnIndex.VisitsDue++;
            this.columnIndex.UserCode++;
            this.isExistColumns.ServiceDateStart = true;
            this.validateProperties.push({
                'type': MntConst.eTypeDate,
                'index': this.columnIndex.ServiceDateStart - 1,
                'align': 'center'
            });
            if (this.searchType === 'DetailInd') {
                if (this.enableVisitDetail === 'True') {
                    this.maxColumn += 2;
                    this.columnIndex.VisitTypeCode++;
                    this.columnIndex.PrintTreatment += 2;
                    this.columnIndex.Information += 2;
                    this.columnIndex.VisitDetail += 1;
                    this.columnIndex.Recommendation += 2;
                    this.columnIndex.VisitReference++;
                    this.columnIndex.StandardDuration += 2;
                    this.columnIndex.OvertimeDuration += 2;
                    this.columnIndex.Employee += 2;
                    this.columnIndex.EmployeeSurname += 1;
                    this.columnIndex.ItemDescription += 2;
                    this.columnIndex.BarcodeScanInd += 2;
                    this.columnIndex.PremiseContactSignature += 2;
                    this.columnIndex.NoPremiseVisitReasonCode += 2;
                    this.columnIndex.ProductList += 2;
                    this.columnIndex.Infestations += 2;
                    this.columnIndex.DeliveryNoteNo += 2;
                    this.columnIndex.ReplacementValue += 2;
                    this.columnIndex.PrepCodes += 2;
                    this.columnIndex.PrepCost += 2;
                    this.columnIndex.ServiceVisitCost += 2;
                    this.columnIndex.TotalCost += 2;
                    this.columnIndex.DrivingChargeValue += 2;
                    this.columnIndex.WorkLoadIndexTotal += 2;
                    this.columnIndex.VisitsDue += 2;
                    this.columnIndex.UserCode += 2;
                    this.validateProperties.push({
                        'type': MntConst.eTypeDate,
                        'index': this.columnIndex.ServiceDateStart,
                        'align': 'center'
                    });
                }
                if (this.enableVisitRef === 'True') {
                    this.maxColumn++;
                    this.columnIndex.VisitTypeCode++;
                    this.columnIndex.PrintTreatment++;
                    this.columnIndex.Information++;
                    this.columnIndex.VisitDetail++;
                    this.columnIndex.VisitReference++;
                    this.columnIndex.StandardDuration++;
                    this.columnIndex.OvertimeDuration++;
                    this.columnIndex.Employee++;
                    this.columnIndex.EmployeeSurname++;
                    this.columnIndex.Recommendation++;
                    this.columnIndex.ItemDescription++;
                    this.columnIndex.BarcodeScanInd++;
                    this.columnIndex.PremiseContactSignature++;
                    this.columnIndex.NoPremiseVisitReasonCode++;
                    this.columnIndex.ProductList++;
                    this.columnIndex.Infestations++;
                    this.columnIndex.DeliveryNoteNo++;
                    this.columnIndex.ReplacementValue++;
                    this.columnIndex.PrepCodes++;
                    this.columnIndex.PrepCost++;
                    this.columnIndex.ServiceVisitCost++;
                    this.columnIndex.TotalCost++;
                    this.columnIndex.DrivingChargeValue++;
                    this.columnIndex.WorkLoadIndexTotal++;
                    this.columnIndex.VisitsDue++;
                    this.columnIndex.UserCode++;
                    this.validateProperties.push({
                        'type': MntConst.eTypeText,
                        'index': this.columnIndex.VisitReference - 1,
                        'align': 'center'
                    });
                }
                this.maxColumn += 6;
                this.columnIndex.VisitTypeCode += 2;
                this.columnIndex.PrintTreatment += 6;
                this.columnIndex.Information += 6;
                this.columnIndex.VisitDetail += 6;
                this.columnIndex.StandardDuration += 5;
                this.columnIndex.OvertimeDuration += 5;
                this.columnIndex.EmployeeSurname += 4;
                this.columnIndex.Employee += 5;
                this.columnIndex.Recommendation += 6;
                this.columnIndex.ItemDescription += 5;
                this.columnIndex.BarcodeScanInd += 5;
                this.columnIndex.PremiseContactSignature += 5;
                this.columnIndex.NoPremiseVisitReasonCode += 5;
                this.columnIndex.ProductList += 5;
                this.columnIndex.Infestations += 5;
                this.columnIndex.DeliveryNoteNo += 5;
                this.columnIndex.ReplacementValue += 5;
                this.columnIndex.PrepCodes += 5;
                this.columnIndex.PrepCost += 5;
                this.columnIndex.ServiceVisitCost += 5;
                this.columnIndex.TotalCost += 5;
                this.columnIndex.DrivingChargeValue += 5;
                this.columnIndex.WorkLoadIndexTotal += 5;
                this.columnIndex.VisitsDue += 6;
                this.columnIndex.UserCode += 6;
                this.isExistColumns.VisitTypeCode = true;
                visitTypeAdjustObj = {
                    'align': 'center',
                    'width': '100px',
                    'index': this.columnIndex.VisitTypeCode - 1
                };
                this.validateProperties.push({
                    'type': MntConst.eTypeImage,
                    'index': this.columnIndex.VisitTypeCode - 3,
                    'align': 'center'
                });
                this.validateProperties.push({
                    'type': MntConst.eTypeDate,
                    'index': this.columnIndex.VisitTypeCode - 2,
                    'align': 'center'
                });
                this.validateProperties.push({
                    'type': MntConst.eTypeCode,
                    'index': this.columnIndex.VisitTypeCode - 1,
                    'align': 'center'
                });
                this.validateProperties.push({
                    'type': MntConst.eTypeInteger,
                    'index': this.columnIndex.VisitTypeCode,
                    'align': 'center'
                });
                if (this.enableWED === 'True') {
                    this.maxColumn++;
                    this.columnIndex.PrintTreatment++;
                    this.columnIndex.Information++;
                    this.columnIndex.VisitDetail++;
                    this.columnIndex.StandardDuration++;
                    this.columnIndex.OvertimeDuration++;
                    this.columnIndex.Employee++;
                    this.columnIndex.EmployeeSurname++;
                    this.columnIndex.Recommendation++;
                    this.columnIndex.ItemDescription++;
                    this.columnIndex.BarcodeScanInd++;
                    this.columnIndex.PremiseContactSignature++;
                    this.columnIndex.NoPremiseVisitReasonCode++;
                    this.columnIndex.ProductList++;
                    this.columnIndex.Infestations++;
                    this.columnIndex.DeliveryNoteNo++;
                    this.columnIndex.ReplacementValue++;
                    this.columnIndex.PrepCodes++;
                    this.columnIndex.PrepCost++;
                    this.columnIndex.ServiceVisitCost++;
                    this.columnIndex.TotalCost++;
                    this.columnIndex.DrivingChargeValue++;
                    this.columnIndex.WorkLoadIndexTotal++;
                    this.columnIndex.VisitsDue++;
                    this.columnIndex.UserCode++;
                    this.validateProperties.push({
                        'type': MntConst.eTypeInteger,
                        'index': this.columnIndex.VisitTypeCode + 1,
                        'align': 'center'
                    });
                }
                employeeSurnameAdjustObj = {
                    'align': 'center',
                    'width': '200px',
                    'index': this.columnIndex.EmployeeSurname - 1
                };
                this.validateProperties.push({
                    'type': MntConst.eTypeText,
                    'index': this.columnIndex.EmployeeSurname - 1,
                    'align': 'center'
                });
                this.validateProperties.push({
                    'type': MntConst.eTypeImage,
                    'index': this.columnIndex.EmployeeSurname,
                    'align': 'center'
                });
            }
            if (this.enableServCoverDispLevel === 'True') {
                if (this.searchType === 'DetailInd' && this.productCode !== '' && this.isDisplayLevelInd === true) {
                    this.maxColumn += 6;
                    this.columnIndex.ItemDescription++;
                    this.columnIndex.PrintTreatment += 6;
                    this.columnIndex.Information += 6;
                    this.columnIndex.Recommendation += 6;
                    this.columnIndex.StandardDuration += 6;
                    this.columnIndex.OvertimeDuration += 6;
                    this.columnIndex.Employee += 6;
                    this.columnIndex.BarcodeScanInd += 6;
                    this.columnIndex.PremiseContactSignature += 6;
                    this.columnIndex.NoPremiseVisitReasonCode += 6;
                    this.columnIndex.ProductList += 6;
                    this.columnIndex.Infestations += 6;
                    this.columnIndex.DeliveryNoteNo += 6;
                    this.columnIndex.ReplacementValue += 6;
                    this.columnIndex.PrepCodes += 6;
                    this.columnIndex.PrepCost += 6;
                    this.columnIndex.ServiceVisitCost += 6;
                    this.columnIndex.TotalCost += 6;
                    this.columnIndex.DrivingChargeValue += 6;
                    this.columnIndex.WorkLoadIndexTotal += 6;
                    this.columnIndex.VisitsDue += 6;
                    this.columnIndex.UserCode += 6;
                    this.validateProperties.push({
                        'type': MntConst.eTypeText,
                        'index': this.columnIndex.ItemDescription - 1,
                        'align': 'center'
                    });
                    this.validateProperties.push({
                        'type': MntConst.eTypeText,
                        'index': this.columnIndex.ItemDescription,
                        'align': 'center'
                    });
                    this.validateProperties.push({
                        'type': MntConst.eTypeText,
                        'index': this.columnIndex.ItemDescription + 1,
                        'align': 'center'
                    });
                    this.validateProperties.push({
                        'type': MntConst.eTypeText,
                        'index': this.columnIndex.ItemDescription + 2,
                        'align': 'center'
                    });
                    this.validateProperties.push({
                        'type': MntConst.eTypeCurrency,
                        'index': this.columnIndex.ItemDescription + 3,
                        'align': 'center'
                    });
                    this.validateProperties.push({
                        'type': MntConst.eTypeCurrency,
                        'index': this.columnIndex.ItemDescription + 4,
                        'align': 'center'
                    });
                }
            }
            if (this.searchType === 'PremiseVisitInd') {
                this.maxColumn += 2;
                this.columnIndex.PrintTreatment += 2;
                this.columnIndex.Information += 2;
                this.columnIndex.Recommendation += 2;
                this.columnIndex.VisitReference += 2;
                this.columnIndex.StandardDuration += 2;
                this.columnIndex.OvertimeDuration += 2;
                this.columnIndex.Employee++;
                this.columnIndex.BarcodeScanInd += 2;
                this.columnIndex.PremiseContactSignature += 2;
                this.columnIndex.NoPremiseVisitReasonCode += 2;
                this.columnIndex.ProductList += 2;
                this.columnIndex.Infestations += 2;
                this.columnIndex.DeliveryNoteNo += 2;
                this.columnIndex.ReplacementValue += 2;
                this.columnIndex.PrepCodes += 2;
                this.columnIndex.PrepCost += 2;
                this.columnIndex.ServiceVisitCost += 2;
                this.columnIndex.TotalCost += 2;
                this.columnIndex.DrivingChargeValue += 2;
                this.columnIndex.WorkLoadIndexTotal += 2;
                this.columnIndex.VisitsDue += 2;
                this.columnIndex.UserCode += 2;
                employeeAdjustObj = {
                    'align': 'center',
                    'width': '200px',
                    'index': this.columnIndex.Employee - 1
                };
                this.validateProperties.push({
                    'type': MntConst.eTypeText,
                    'index': this.columnIndex.Employee - 1,
                    'align': 'center'
                });
                this.validateProperties.push({
                    'type': MntConst.eTypeText,
                    'index': this.columnIndex.Employee,
                    'align': 'center'
                });
                if (this.enableVisitRef === 'True') {
                    this.maxColumn++;
                    this.columnIndex.PrintTreatment++;
                    this.columnIndex.Information++;
                    this.columnIndex.Recommendation++;
                    this.columnIndex.VisitReference++;
                    this.columnIndex.StandardDuration++;
                    this.columnIndex.OvertimeDuration++;
                    this.columnIndex.BarcodeScanInd++;
                    this.columnIndex.PremiseContactSignature++;
                    this.columnIndex.NoPremiseVisitReasonCode++;
                    this.columnIndex.ProductList++;
                    this.columnIndex.Infestations++;
                    this.columnIndex.DeliveryNoteNo++;
                    this.columnIndex.ReplacementValue++;
                    this.columnIndex.PrepCodes++;
                    this.columnIndex.PrepCost++;
                    this.columnIndex.ServiceVisitCost++;
                    this.columnIndex.TotalCost++;
                    this.columnIndex.DrivingChargeValue++;
                    this.columnIndex.WorkLoadIndexTotal++;
                    this.columnIndex.VisitsDue++;
                    this.columnIndex.UserCode++;
                    this.validateProperties.push({
                        'type': MntConst.eTypeText,
                        'index': this.columnIndex.VisitReference - 1,
                        'align': 'center'
                    });
                }
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
                this.columnIndex.StandardDuration++;
                this.columnIndex.OvertimeDuration++;
                this.columnIndex.BarcodeScanInd++;
                this.columnIndex.PremiseContactSignature++;
                this.columnIndex.NoPremiseVisitReasonCode++;
                this.columnIndex.ProductList++;
                this.columnIndex.Infestations++;
                this.columnIndex.DeliveryNoteNo++;
                this.columnIndex.ReplacementValue++;
                this.columnIndex.PrepCodes++;
                this.columnIndex.PrepCost++;
                this.columnIndex.ServiceVisitCost++;
                this.columnIndex.TotalCost++;
                this.columnIndex.DrivingChargeValue++;
                this.columnIndex.WorkLoadIndexTotal++;
                this.columnIndex.VisitsDue++;
                this.columnIndex.UserCode++;
                this.validateProperties.push({
                    'type': MntConst.eTypeImage,
                    'index': this.columnIndex.PremiseContactSignature - 1,
                    'align': 'center'
                });
                if (this.enableBarcodes === 'True') {
                    this.maxColumn++;
                    this.columnIndex.PrintTreatment++;
                    this.columnIndex.Information++;
                    this.columnIndex.Recommendation++;
                    this.columnIndex.StandardDuration++;
                    this.columnIndex.OvertimeDuration++;
                    this.columnIndex.BarcodeScanInd++;
                    this.columnIndex.NoPremiseVisitReasonCode++;
                    this.columnIndex.ProductList++;
                    this.columnIndex.Infestations++;
                    this.columnIndex.DeliveryNoteNo++;
                    this.columnIndex.ReplacementValue++;
                    this.columnIndex.PrepCodes++;
                    this.columnIndex.PrepCost++;
                    this.columnIndex.ServiceVisitCost++;
                    this.columnIndex.TotalCost++;
                    this.columnIndex.DrivingChargeValue++;
                    this.columnIndex.WorkLoadIndexTotal++;
                    this.columnIndex.VisitsDue++;
                    this.columnIndex.UserCode++;
                    this.validateProperties.push({
                        'type': MntConst.eTypeImage,
                        'index': this.columnIndex.BarcodeScanInd - 1,
                        'align': 'center'
                    });
                }
                if (this.enableNoServiceReasons === 'True') {
                    this.maxColumn++;
                    this.columnIndex.PrintTreatment++;
                    this.columnIndex.Information++;
                    this.columnIndex.Recommendation++;
                    this.columnIndex.StandardDuration++;
                    this.columnIndex.OvertimeDuration++;
                    this.columnIndex.NoPremiseVisitReasonCode++;
                    this.columnIndex.ProductList++;
                    this.columnIndex.Infestations++;
                    this.columnIndex.DeliveryNoteNo++;
                    this.columnIndex.ReplacementValue++;
                    this.columnIndex.PrepCodes++;
                    this.columnIndex.PrepCost++;
                    this.columnIndex.ServiceVisitCost++;
                    this.columnIndex.TotalCost++;
                    this.columnIndex.DrivingChargeValue++;
                    this.columnIndex.WorkLoadIndexTotal++;
                    this.columnIndex.VisitsDue++;
                    this.columnIndex.UserCode++;
                    this.validateProperties.push({
                        'type': MntConst.eTypeCode,
                        'index': this.columnIndex.NoPremiseVisitReasonCode - 1,
                        'align': 'center'
                    });
                }
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
                this.columnIndex.StandardDuration++;
                this.columnIndex.OvertimeDuration++;
                this.columnIndex.ProductList++;
                this.validateProperties.push({
                    'type': MntConst.eTypeText,
                    'index': this.columnIndex.ProductList - 1,
                    'align': 'center'
                });
                this.columnIndex.Infestations++;
                this.columnIndex.DeliveryNoteNo++;
                this.columnIndex.ReplacementValue++;
                this.columnIndex.PrepCodes++;
                this.columnIndex.PrepCost++;
                this.columnIndex.ServiceVisitCost++;
                this.columnIndex.TotalCost++;
                this.columnIndex.DrivingChargeValue++;
                this.columnIndex.WorkLoadIndexTotal++;
                this.columnIndex.VisitsDue++;
                this.columnIndex.UserCode++;
            }
            if (this.enableInfestations === 'True') {
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
                this.columnIndex.StandardDuration++;
                this.columnIndex.OvertimeDuration++;
                this.columnIndex.Infestations++;
                this.columnIndex.DeliveryNoteNo++;
                this.columnIndex.ReplacementValue++;
                this.columnIndex.PrepCodes++;
                this.columnIndex.PrepCost++;
                this.columnIndex.ServiceVisitCost++;
                this.columnIndex.TotalCost++;
                this.columnIndex.DrivingChargeValue++;
                this.columnIndex.WorkLoadIndexTotal++;
                this.columnIndex.VisitsDue++;
                this.validateProperties.push({
                    'type': MntConst.eTypeText,
                    'index': this.columnIndex.Infestations - 1,
                    'align': 'center'
                });
            }
            if (this.searchType === 'DetailInd' && this.enableServDocketNoVisitEntry === 'True') {
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
                this.columnIndex.StandardDuration++;
                this.columnIndex.OvertimeDuration++;
                this.columnIndex.DeliveryNoteNo++;
                this.columnIndex.ReplacementValue++;
                this.columnIndex.PrepCodes++;
                this.columnIndex.PrepCost++;
                this.columnIndex.ServiceVisitCost++;
                this.columnIndex.TotalCost++;
                this.columnIndex.DrivingChargeValue++;
                this.columnIndex.WorkLoadIndexTotal++;
                this.columnIndex.VisitsDue++;
                this.columnIndex.UserCode++;
                this.validateProperties.push({
                    'type': MntConst.eTypeText,
                    'index': this.columnIndex.DeliveryNoteNo - 1,
                    'align': 'center'
                });
            }
            if (this.searchType !== 'DetailInd' && this.enableServCoverDispLevel === 'True') {
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
                this.columnIndex.StandardDuration++;
                this.columnIndex.OvertimeDuration++;
                this.columnIndex.ReplacementValue++;
                this.columnIndex.PrepCodes++;
                this.columnIndex.PrepCost++;
                this.columnIndex.ServiceVisitCost++;
                this.columnIndex.TotalCost++;
                this.columnIndex.DrivingChargeValue++;
                this.columnIndex.WorkLoadIndexTotal++;
                this.columnIndex.VisitsDue++;
                this.columnIndex.UserCode++;
                this.validateProperties.push({
                    'type': MntConst.eTypeCurrency,
                    'index': this.columnIndex.ReplacementValue - 1,
                    'align': 'center'
                });
            }
            if (this.enablePreps === 'True') {
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
                this.columnIndex.StandardDuration++;
                this.columnIndex.OvertimeDuration++;
                this.columnIndex.PrepCodes++;
                this.columnIndex.PrepCost++;
                this.columnIndex.ServiceVisitCost++;
                this.columnIndex.TotalCost++;
                this.columnIndex.DrivingChargeValue++;
                this.columnIndex.WorkLoadIndexTotal++;
                this.columnIndex.VisitsDue++;
                this.columnIndex.UserCode++;
                this.validateProperties.push({
                    'type': MntConst.eTypeText,
                    'index': this.columnIndex.PrepCodes - 1,
                    'align': 'center'
                });
            }
            if (this.enablePreps === 'True' && this.enableVisitCostings === 'True') {
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
                this.columnIndex.StandardDuration++;
                this.columnIndex.OvertimeDuration++;
                this.columnIndex.PrepCost++;
                this.columnIndex.ServiceVisitCost++;
                this.columnIndex.TotalCost++;
                this.columnIndex.DrivingChargeValue++;
                this.columnIndex.WorkLoadIndexTotal++;
                this.columnIndex.VisitsDue++;
                this.columnIndex.UserCode++;
                this.validateProperties.push({
                    'type': MntConst.eTypeCurrency,
                    'index': this.columnIndex.PrepCost - 1,
                    'align': 'center'
                });
            }
            if (this.enableVisitDurations === 'True') {
                this.maxColumn += 2;
                this.columnIndex.PrintTreatment += 2;
                this.columnIndex.Information += 2;
                this.columnIndex.Recommendation += 2;
                this.columnIndex.StandardDuration += 1;
                this.columnIndex.OvertimeDuration += 2;
                this.columnIndex.ServiceVisitCost += 2;
                this.columnIndex.TotalCost += 2;
                this.columnIndex.DrivingChargeValue += 2;
                this.columnIndex.WorkLoadIndexTotal += 2;
                this.columnIndex.VisitsDue += 2;
                this.columnIndex.UserCode += 2;
                this.validateProperties.push({
                    'type': MntConst.eTypeTime,
                    'index': this.columnIndex.StandardDuration - 1,
                    'align': 'center'
                });
                this.validateProperties.push({
                    'type': MntConst.eTypeTime,
                    'index': this.columnIndex.OvertimeDuration - 1,
                    'align': 'center'
                });
            }
            if (this.enableVisitCostings === 'True') {
                this.maxColumn += 2;
                this.columnIndex.PrintTreatment += 2;
                this.columnIndex.Information += 2;
                this.columnIndex.Recommendation += 2;
                this.columnIndex.ServiceVisitCost += 1;
                this.columnIndex.TotalCost += 2;
                this.columnIndex.DrivingChargeValue += 2;
                this.columnIndex.WorkLoadIndexTotal += 2;
                this.columnIndex.VisitsDue += 2;
                this.columnIndex.UserCode += 2;
                this.validateProperties.push({
                    'type': MntConst.eTypeCurrency,
                    'index': this.columnIndex.ServiceVisitCost - 1,
                    'align': 'center'
                });
                this.validateProperties.push({
                    'type': MntConst.eTypeCurrency,
                    'index': this.columnIndex.TotalCost - 1,
                    'align': 'center'
                });
            }
            if (this.enableDrivingCharges === 'True' && this.searchType === 'PremiseVisitInd') {
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
                this.columnIndex.DrivingChargeValue++;
                this.columnIndex.WorkLoadIndexTotal++;
                this.columnIndex.VisitsDue++;
                this.columnIndex.UserCode++;
                this.validateProperties.push({
                    'type': MntConst.eTypeCurrency,
                    'index': this.columnIndex.DrivingChargeValue - 1,
                    'align': 'center'
                });
            }
            if (this.enableWorkLoadIndex === 'True') {
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
                this.columnIndex.WorkLoadIndexTotal++;
                this.columnIndex.VisitsDue++;
                this.columnIndex.UserCode++;
                this.validateProperties.push({
                    'type': MntConst.eTypeDecimal2,
                    'index': this.columnIndex.WorkLoadIndexTotal - 1,
                    'align': 'center'
                });
            }
            if (this.searchType === 'PremiseVisitInd') {
                this.maxColumn++;
                this.columnIndex.Information++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.VisitsDue++;
                this.columnIndex.UserCode++;
                this.isExistColumns.PrintTreatment = true;
                this.validateProperties.push({
                    'type': MntConst.eTypeImage,
                    'index': this.columnIndex.PrintTreatment - 1,
                    'align': 'center'
                });

            }
        } else {
            this.maxColumn += 4;
            this.columnIndex.Information += 4;
            this.columnIndex.VisitsDue++;
            this.columnIndex.UserCode++;
            this.validateProperties.push({
                'type': MntConst.eTypeInteger,
                'index': this.columnIndex.VisitsDue - 1,
                'align': 'center'
            });
            this.validateProperties.push({
                'type': MntConst.eTypeInteger,
                'index': this.columnIndex.VisitsDue,
                'align': 'center'
            });
            this.validateProperties.push({
                'type': MntConst.eTypeInteger,
                'index': this.columnIndex.VisitsDue + 1,
                'align': 'center'
            });
            this.validateProperties.push({
                'type': MntConst.eTypeInteger,
                'index': this.columnIndex.VisitsDue + 2,
                'align': 'center'
            });
        }
        if (this.searchType !== 'PremiseVisitInd') {
            this.maxColumn += 2;
            this.columnIndex.UserCode += 2;
            this.columnIndex.Information++;
            this.columnIndex.PrintTreatment = 0;
            this.validateProperties.push({
                'type': MntConst.eTypeImage,
                'index': this.columnIndex.Information - 1,
                'align': 'center'
            });
            this.validateProperties.push({
                'type': MntConst.eTypeImage,
                'index': this.columnIndex.Information,
                'align': 'center'
            });
        }
        if (this.searchType === 'DetailInd' && this.enableServiceEntryUserCodeLog === 'True') {
            this.maxColumn += 2;
            this.columnIndex.UserCode += 2;
            this.validateProperties.push({
                'type': MntConst.eTypeText,
                'index': this.columnIndex.UserCode - 2,
                'align': 'center'
            });
            this.validateProperties.push({
                'type': MntConst.eTypeCode,
                'index': this.columnIndex.UserCode - 1,
                'align': 'center'
            });
        }
        /***
         * Make column orderable
         */
        if (this.sortUpdate) {
            this.gridSortHeaders = [];
            if (this.premiseNumber === '') {
                let premiseNumberRow: any = {
                    'fieldName': 'PremiseNumber',
                    'index': this.columnIndex.PremiseNumber - 1,
                    'sortType': 'ASC'
                };
                this.gridSortHeaders.push(premiseNumberRow);
            }
            if (this.productCode === '' && this.searchType !== 'PremiseVisitInd') {
                let productCodeRow: any = {
                    'fieldName': 'ProductCode',
                    'index': this.columnIndex.ProductCode - 1,
                    'sortType': 'ASC'
                };
                this.gridSortHeaders.push(productCodeRow);
            }
            if (this.showFreqIndChecked && this.searchType !== 'PremiseVisitInd') {
                let ServiceVisitFrequencyRow: any = {
                    'fieldName': 'ServiceVisitFrequency',
                    'index': this.columnIndex.ServiceVisitFrequency - 1,
                    'sortType': 'ASC'
                };
                this.gridSortHeaders.push(ServiceVisitFrequencyRow);
            }
            if (this.searchType === 'DetailInd') {
                let ServiceDateStartRow: any = {
                    'fieldName': 'ServiceDateStart',
                    'index': this.columnIndex.ServiceDateStart - 1,
                    'sortType': 'ASC'
                };
                let VisitTypeCodeRow: any = {
                    'fieldName': 'VisitTypeCode',
                    'index': this.columnIndex.VisitTypeCode - 1,
                    'sortType': 'ASC'
                };
                this.gridSortHeaders.push(ServiceDateStartRow);
                this.gridSortHeaders.push(VisitTypeCodeRow);
                if (this.enableVisitRef === 'True') {
                    let VisitReferenceRow: any = {
                        'fieldName': 'VisitReference',
                        'index': this.columnIndex.VisitReference - 1,
                        'sortType': 'ASC'
                    };
                    this.gridSortHeaders.push(VisitReferenceRow);
                }
            }
            this.sortUpdate = false;
        }
        this.headerProperties.push(premiseAdjustObj);
        this.headerProperties.push(productAdjustObj);
        this.headerProperties.push(visitTypeAdjustObj);
        this.headerProperties.push(employeeAdjustObj);
        this.headerProperties.push(employeeSurnameAdjustObj);
        this.formatData.timeFormatIndex = { StandardDuration: this.columnIndex.StandardDuration - 1, OvertimeDuration: this.columnIndex.OvertimeDuration - 1 };

        if (this.searchType === 'DetailInd') {
            this.isExistColumns.Recommendation = true;
            this.validateProperties.push({
                'type': MntConst.eTypeInteger,
                'index': this.columnIndex.Recommendation - 1,
                'align': 'center'
            });
            if (this.enableVisitDetail === 'True') {
                this.isExistColumns.VisitDetail = true;
                this.validateProperties.push({
                    'type': MntConst.eTypeDate,
                    'index': this.columnIndex.EmployeeSurname + 1,
                    'align': 'center'
                });
            }
        }

    }

    public sortGrid(data: any): void {
        this.headerClickedColumn = data.fieldname;
        this.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.updateView(this.inputParams);
    }

    /**
     *  Load system characters
     */
    private loadSystemCharacters(): void {
        let sysCharList = [
            this.systemCharacterConstant.SystemCharEnablePreps,
            this.systemCharacterConstant.SystemCharEnableInfestations,
            this.systemCharacterConstant.SystemCharEnableDrivingCharges,
            this.systemCharacterConstant.SystemCharEnableWorkLoadIndex,
            this.systemCharacterConstant.SystemCharEnableEntryOfVisitRefInVisitEntry,
            this.systemCharacterConstant.SystemCharEnableVisitDetail,
            this.systemCharacterConstant.SystemCharEnableServiceEntryUserCodeLog,
            this.systemCharacterConstant.SystemCharEnableWED,
            this.systemCharacterConstant.SystemCharEnableServiceCoverDisplayLevel,
            this.systemCharacterConstant.SystemCharEnableServiceDocketNumberVisitEnty,
            this.systemCharacterConstant.SystemCharEnableNoServiceReasons,
            this.systemCharacterConstant.SystemCharEnableBarcodes
        ];
        let sysNumbers = sysCharList.join(',');
        this.fetchSysChar(sysNumbers).subscribe((data) => {
            if (data.records[0]) {
                if (data.records[0].Required) {
                    this.enablePreps = 'True';
                }
            }
            if (data.records[1]) {
                if (data.records[1].Required) {
                    this.enableInfestations = 'True';
                }
            }
            if (data.records[2]) {
                if (data.records[2].Required) {
                    this.enableDrivingCharges = 'True';
                }
            }
            if (data.records[3]) {
                if (data.records[3].Required) {
                    this.enableWorkLoadIndex = 'True';
                }
            }
            if (data.records[4]) {
                if (data.records[4].Required) {
                    this.enableVisitRef = 'True';
                }
            }
            if (data.records[5]) {
                if (data.records[5].Required) {
                    this.enableVisitDetail = 'True';
                }
            }
            if (data.records[6]) {
                if (data.records[6].Required) {
                    this.enableServiceEntryUserCodeLog = 'True';
                }
            }
            if (data.records[7]) {
                if (data.records[7].Required) {
                    this.enableWED = 'True';
                }
            }
            if (data.records[8]) {
                if (data.records[8].Required) {
                    this.enableServCoverDispLevel = 'True';
                }
            }
            if (data.records[9]) {
                if (data.records[9].Required) {
                    this.enableServDocketNoVisitEntry = 'True';
                }
            }
            if (data.records[10]) {
                if (data.records[10].Required) {
                    this.enableNoServiceReasons = 'True';
                }
            }
            if (data.records[11]) {
                if (data.records[11].Required) {
                    this.enableBarcodes = 'True';
                }
            }
            this.sortUpdate = true;
            this.searchTypeChange(this.searchType);
            this.setUI(this.inputParams);
            this.setMaxColumn();
            this.historyGrid.clearGridData();
            this.pageCurrent = '1';
            this.historyGridPagination.setPage(1);
            this.updateView(this.inputParams);
        });
    }

    public setDisplayMax(): void {
        let querySearch = new URLSearchParams();
        querySearch.set(this.serviceConstants.Action, '0');
        querySearch.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        querySearch.set('Function', 'DisplayLevelProduct');
        querySearch.set('ProductCode', this.productCode);
        querySearch.set('countryCode', this.countryCode);

        this.ajaxSubscription = this._httpService.makeGetRequest(this.method, this.module, this.operation, querySearch).subscribe(
            (data) => {
                try {
                    let vbDisplayLevelInd = '';
                    vbDisplayLevelInd = data.DisplayLevelInd;
                    if (vbDisplayLevelInd === 'yes' && this.searchType === 'DetailInd') {
                        this.isDisplayLevelInd = true;
                        this.setMaxColumn();
                        this.historyGrid.clearGridData();
                        this.pageCurrent = '1';
                        this.historyGridPagination.setPage(1);
                        this.updateView(this.inputParams);
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

    /*** Method to get system characters for ProspectMaintenance
    * @params field- systemchars variables looking for  and type- L,R,I
    */
    public fetchSysChar(sysCharNumbers: any): any {
        this.querySysChar.set(this.serviceConstants.Action, '0');

        if (this.utils.getBusinessCode()) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        } else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.businessCode);
        }
        if (this.utils.getCountryCode()) {
            this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        } else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.countryCode);
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this._httpService.sysCharRequest(this.querySysChar);
    }
    /**
     * Method loads all systemchars on page load
     */

    private clientValidation(): boolean {
        let isValid = true;
        let dateFromArr: Array<any> = this.dateFrom.split('/');
        let dateToArr: Array<any> = this.dateTo.split('/');
        let dateFromObj = new Date(dateFromArr[2], dateFromArr[1] - 1, dateFromArr[0]);
        let dateToObj = new Date(dateToArr[2], dateToArr[1] - 1, dateToArr[0]);

        if (this.dateFrom === '' || this.dateTo === '') {
            isValid = false;
        } else if (dateFromObj.getTime() > dateToObj.getTime()) {
            isValid = false;
        }
        return isValid;
    }

    public generateReport(): void {
        if (this.clientValidation()) {
            if (this.blnInstantReport)
                this.instantReport();
            else
                this.batchReport();
        } else {
            this.showAlert(MessageConstant.Message.dateSelectionWarning);
        }
    }

    private instantReport(): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('ContractNumber', this.contractNumber);
        this.search.set('PremiseNumber', this.premiseNumber);
        this.search.set('ProductCode', this.productCode);
        this.search.set('ServiceDateFrom', this.dateFrom);
        this.search.set('ServiceDateTo', this.dateTo);
        this.search.set('countryCode', this.countryCode);

        this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(
            (data) => {
                try {
                    window.open(data.url, '_blank');
                } catch (error) {
                    this.errorService.emitError(error);
                }

            },
            (error) => {
                this.errorService.emitError(error);
            }
        );

    }

    private batchReport(): void {
        //Service is not yet ready
    }

    public effectiveDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.dateFrom = value.value;
        } else {
            this.dateFrom = '';
        }
        this.pageCurrent = '1';
        this.historyGridPagination.setPage(1);
        this.historyGrid.clearGridData();
        this.updateView(this.inputParams);
    }

    public toDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.dateTo = value.value;
        } else {
            this.dateTo = '';
        }
        this.pageCurrent = '1';
        this.historyGridPagination.setPage(1);
        this.historyGrid.clearGridData();
        this.updateView(this.inputParams);
    }

    public showFreqIndGet(checkedVal: any): void {
        this.showFreqIndChecked = (checkedVal === true) ? true : false;
    }

    public menuChanges(optionValue: string): void {
        switch (optionValue) {
            case 'AddVisit':
                this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSSESERVICEVISITMAINTENANCE], {
                    queryParams: {
                        parentMode: 'SearchAdd',
                        currentContractTypeURLParameter: this.inputParams.currentContractType,
                        ServiceCoverRowID: this.serviceCoverRowID,
                        ContractNumber: this.contractNumber,
                        PremiseNumber: this.premiseNumber,
                        ProductCode: this.productCode
                    }
                });
                break;
            default:
                break;
        }
        this.menuType = '';
    }

    public setFilterValues(params: any): void {
        this.search = new URLSearchParams();
        let premiseVisitInd: string = 'False';
        let detailInd: string = 'False';
        let showFreqInd: string = 'False';
        if (this.showFreqIndChecked)
            showFreqInd = 'True';
        if (this.searchType === 'PremiseVisitInd') {
            premiseVisitInd = 'True';
        } else if (this.searchType === 'DetailInd') {
            detailInd = 'True';
        }
        this.setMaxColumn();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('countryCode', this.countryCode);
        this.search.set('ContractNumber', this.contractNumber);
        this.search.set('PremiseNumber', this.premiseNumber);
        this.search.set('ProductCode', this.productCode);
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set('PageCurrent', this.pageCurrent);
        this.search.set('ServiceDateFrom', this.dateFrom);
        this.search.set('ServiceDateTo', this.dateTo);
        this.search.set('ShowFreqInd', showFreqInd);
        this.search.set('PremiseVisitInd', premiseVisitInd);
        this.search.set('DetailInd', detailInd);

        this.search.set('EnablePreps', this.enablePreps);
        this.search.set('EnableInfestations', this.enableInfestations);
        this.search.set('EnableVisitDurations', this.enableVisitDurations);
        this.search.set('EnableVisitCostings', this.enableVisitCostings);
        this.search.set('EnableDrivingCharges', this.enableDrivingCharges);
        this.search.set('EnableWorkLoadIndex', this.enableWorkLoadIndex);
        this.search.set('EnableVisitRef', this.enableVisitRef);
        this.search.set('EnableUserCode', this.enableServiceEntryUserCodeLog);
        this.search.set('EnableWED', this.enableWED);
        this.search.set('EnableServCoverDispLevel', this.enableServCoverDispLevel);
        this.search.set('EnableServDocketNoVisitEntry', this.enableServDocketNoVisitEntry);
        this.search.set('EnableBarcodes', this.enableBarcodes);
        this.search.set('EnableNoServiceReasons', this.enableNoServiceReasons);
        if (this.serviceCoverRowID)
            this.search.set('serviceCoverRowID', this.serviceCoverRowID);
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClickedColumn);
        this.search.set(this.serviceConstants.GridSortOrder, this.riSortOrder);

    }

    private createRepDest(): void {
        this.repDestOptions = [
            { text: 'Report Viewer', value: 'direct' },
            { text: 'Email', value: 'Email' }
        ];

    }

    private showAlert(msgTxt: string): void {
        this.messageModal.show({ msg: msgTxt, title: this.pageTitle }, false);
    }

    ngOnInit(): void {
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.store.dispatch({
            type: ''
        });
        this.loadSystemCharacters();
        this.translateService.setUpTranslation();
        this.createRepDest();
        this.componentInteractionService.emitMessage(false);
        this.setButtonText();
    }

    ngAfterViewInit(): void {
        if (this.pageTitle)
            this.utils.setTitle(this.contractLabel + this.pageTitle);
        else
            this.utils.setTitle(this.contractLabel);
    }

    ngOnDestroy(): void {
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.subscription)
            this.subscription.unsubscribe();
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        delete this;
    }
    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }
}
