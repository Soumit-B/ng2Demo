import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { Utils } from './../../../shared/services/utility';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { AfterViewInit, Component, Input, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { TableComponent } from './../../../shared/components/table/table';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { GridComponent } from './../../../shared/components/grid/grid';
import { InternalMaintenanceServiceModuleRoutesConstant, AppModuleRoutes } from '../../../app/base/PageRoutes';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { Logger } from '@nsalaun/ng2-logger';
import { ErrorService } from './../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { HttpService } from './../../../shared/services/http-service';
import { ActionTypes } from '../../../app/actions/account';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from './../../../shared/constants/error.constant';
import { Subscription } from 'rxjs/Subscription';


@Component({
    templateUrl: 'iCABSAServiceValueGrid.html',
    providers: [ErrorService, MessageService]
})

export class ServiceValueGridComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('serviceValueGrid') serviceValueGrid: GridComponent;
    @ViewChild('serviceValuePagination') serviceValuePagination: PaginationComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;

    subscription: Subscription;

    private routeParams: any;

    public selectedrowdata: any;
    public method: string = 'contract-management/grid';
    public module: string = 'service-cover';
    public operation: string = 'Application/iCABSAServiceValueGrid';
    public search: URLSearchParams = new URLSearchParams();
    public fromParentMode: string = 'PremiseHistory-All';
    public page: number = 1;
    public totalItem: number = 11;
    public title: string;
    public Mode: string;
    public RowID: string;
    public Business: string;
    public showMessageHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public Contract: string;
    public Premise: string;
    public Product: string;
    public mViewType: string;
    public ContractNumber: string = '';
    public ContractName: string;
    public PremiseName: string;
    public PremiseNumber: string = '';
    public ProductCode: string;
    public ProductDesc: string;
    public totalItems: number;
    public PageparentMode: string;
    public totalRecords: number;
    public itemsPerPage: string;
    public maxColumn: number;
    public ServiceCover: string;
    public gridCurPage: number;
    public ServiceCoverRowID: string;
    public pageSize: number;
    public currentPage: string;
    public ContractHistoryFilterValue: string;
    public ContractHistoryFilterDesc: string;
    public gridSortHeaders: Array<any>;
    public action: string;
    private CurrentColumnName: string = '';
    public showHeader: boolean = true;
    public servicevaluegridFormGroup: FormGroup;
    public inputParams: any;
    public messageSubscription;
    public errorSubscription;
    public lookupParams: URLSearchParams = new URLSearchParams();
    public validateProperties: Array<any> = [];

    constructor(
        private serviceConstants: ServiceConstants,
        private fb: FormBuilder,
        private searchService: HttpService,
        private _router: Router,
        private localeTranslateService: LocaleTranslationService,
        private _logger: Logger,
        private messageService: MessageService,
        private zone: NgZone,
        private ajaxconstant: AjaxObservableConstant,
        private httpService: HttpService,
        private activatedRoute: ActivatedRoute,
        private util: Utils,
        private errorService: ErrorService
    ) {
        this.subscription = activatedRoute.queryParams.subscribe(
            (param: any) => {
                this.routeParams = param;
                this.ContractNumber = param.ContractNumber;
                this.ContractName = param.ContractName;
                this.PremiseNumber = param.PremiseNumber;
                this.PremiseName = param.PremiseName;
                this.ServiceCoverRowID = param.ServiceCoverRowID;
                this.fromParentMode = param.ParentMode || param.parentMode;
                this.ProductCode = param.ProductCode;
                this.ProductDesc = param.ProductDesc;
            });


    }
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    ngAfterViewInit(): void {

        this.messageService.emitMessage(this.fromParentMode);

    }
    ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        if (this.fromParentMode !== 'Contract' &&
            this.fromParentMode !== 'Job' &&
            this.fromParentMode !== 'Product Sales' &&
            this.fromParentMode !== 'ServiceCover' &&
            this.fromParentMode !== 'ServiceCoverAll' &&
            this.fromParentMode !== 'ServiceCoverDisplay' &&
            this.fromParentMode !== 'Contract-ServiceSummary' &&
            this.fromParentMode !== 'Premise-ServiceSummary' &&
            this.fromParentMode !== 'ContractHistory-All' &&
            this.fromParentMode !== 'PremiseHistory-All' &&
            this.fromParentMode !== 'ServiceCoverHistory-All' &&
            this.fromParentMode !== 'PremiseAll' &&
            this.fromParentMode !== 'Premise' &&
            this.fromParentMode !== 'ProductAll' &&
            this.fromParentMode !== 'ContractAll' &&
            this.fromParentMode !== 'Premise-ServiceSummary') {
            this.messageService.emitMessage(0);
            this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
                this._logger.log('messageSubscription ---', data);
                if (data !== 0) {
                    this.zone.run(() => {
                        this.messageModal.show({ msg: 'Unknown mode: ' + data, title: 'Error' }, false);
                    });
                }
            });
        }



        this.itemsPerPage = '10';
        this.maxColumn = 7;
        this.gridCurPage = 1;
        this.pageSize = 10;
        this.action = '2';
        this.inputParams = {
            parentMode: this.fromParentMode,
            businessCode: this.util.getBusinessCode(),
            countryCode: this.util.getCountryCode(),
            ShowAdjustments: 'False'
        };
        this.localeTranslateService.setUpTranslation();
        this.servicevaluegridFormGroup = this.fb.group({
            ContractNumber: [{ value: '', disabled: true }, Validators.required],
            ContractName: [{ value: '', disabled: true }, Validators.required],
            PremiseNumber: [{ value: '', disabled: true }, Validators.required],
            PremiseName: [{ value: '', disabled: true }, Validators.required],
            ProductCode: [{ value: '', disabled: true }, Validators.required],
            ProductDesc: [{ value: '', disabled: true }, Validators.required]
        });
        this.servicevaluegridFormGroup.controls['ContractNumber'].setValue(this.ContractNumber);
        this.servicevaluegridFormGroup.controls['PremiseNumber'].setValue(this.PremiseNumber);
        this.PageparentMode = this.inputParams.parentMode;
        this.search.set(this.serviceConstants.Action, '0');
        this.getfromParent(this.inputParams.parentMode);
        this.createPage(this.inputParams.parentMode);
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.buildGrid();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public buildGridStructure(): void {
        let index = 0;
        this.validateProperties = [];

        this.validateProperties[index] = new Object();
        this.validateProperties[index].type = MntConst.eTypeDate;
        this.validateProperties[index].index = index;
        index++;

        if (this.mViewType === 'Contract') {
            this.validateProperties[index] = new Object();
            this.validateProperties[index].type = MntConst.eTypeInteger;
            this.validateProperties[index].index = index;
            index++;
        }
        if (this.mViewType === 'Contract' || this.mViewType === 'Premise') {
            this.validateProperties[index] = new Object();
            this.validateProperties[index].type = MntConst.eTypeText;
            this.validateProperties[index].index = index;
            index++;
        }

        this.validateProperties[index] = new Object();
        this.validateProperties[index].type = MntConst.eTypeText;
        this.validateProperties[index].index = index;
        index++;

        this.validateProperties[index] = new Object();
        this.validateProperties[index].type = MntConst.eTypeText;
        this.validateProperties[index].index = index;
        index++;

        this.validateProperties[index] = new Object();
        this.validateProperties[index].type = MntConst.eTypeText;
        this.validateProperties[index].index = index;
        index++;

        this.validateProperties[index] = new Object();
        this.validateProperties[index].type = MntConst.eTypeCurrency;
        this.validateProperties[index].index = index;
        index++;

        this.validateProperties[index] = new Object();
        this.validateProperties[index].type = MntConst.eTypeCurrency;
        this.validateProperties[index].index = index;
        index++;

        if (this.mViewType === 'ServiceCover') {
            this.validateProperties[index] = new Object();
            this.validateProperties[index].type = MntConst.eTypeInteger;
            this.validateProperties[index].index = index;
            index++;

            this.validateProperties[index] = new Object();
            this.validateProperties[index].type = MntConst.eTypeInteger;
            this.validateProperties[index].index = index;
            index++;

            this.validateProperties[index] = new Object();
            this.validateProperties[index].type = MntConst.eTypeInteger;
            this.validateProperties[index].index = index;
            index++;

            this.validateProperties[index] = new Object();
            this.validateProperties[index].type = MntConst.eTypeInteger;
            this.validateProperties[index].index = index;
            index++;

            this.validateProperties[index] = new Object();
            this.validateProperties[index].type = MntConst.eTypeText;
            this.validateProperties[index].index = index;
            index++;

            this.validateProperties[index] = new Object();
            this.validateProperties[index].type = MntConst.eTypeTime;
            this.validateProperties[index].index = index;
            index++;
        }

        this.validateProperties[index] = new Object();
        this.validateProperties[index].type = MntConst.eTypeTime;
        this.validateProperties[index].index = index;
    }

    public getfromParent(parentMode: string): void {
        switch (parentMode) {
            case 'Contract':
                this.title = 'Contract My Service Cover Details';
                this.Business = this.inputParams.BusinessCode;
                this.ContractNumber = this.ContractNumber;
                this.Mode = 'Contract';
                break;
            case 'Job':
                this.title = 'Job My Service Cover Details';
                break;
            case 'Product Sales':
                this.title = 'Product Sales My Service Cover Details';
                break;
            case 'ServiceCover':
                this.Mode = 'ServiceCover';
                this.RowID = this.ServiceCover;
                break;
            case 'ServiceCoverAll':
            case 'ServiceCoverDisplay':
                this.Mode = 'ServiceCoverAll';
                this.RowID = this.ServiceCoverRowID;
                break;
            case 'Contract-ServiceSummary':
            case 'Premise-ServiceSummary':
                this.Mode = 'ServiceCoverAll';
                this.RowID = this.ServiceCoverRowID;
                this.ContractNumber = this.ContractNumber;
                break;
            case 'ContractHistory-All':
                this.Mode = 'ContractAll';
                this.Business = this.inputParams.BusinessCode;
                this.ContractNumber = this.ContractNumber;
                break;
            case 'PremiseHistory-All':
                this.Mode = 'PremiseAll';
                this.Business = this.inputParams.BusinessCode;
                this.ContractNumber = this.ContractNumber;
                this.PremiseNumber = this.PremiseNumber;
                this.servicevaluegridFormGroup.controls['ContractName'].setValue(this.ContractName);
                this.servicevaluegridFormGroup.controls['PremiseName'].setValue(this.PremiseName);
                break;
            case 'ServiceCoverHistory-All':
                this.Mode = 'ServiceCoverAll';
                this.RowID = this.ServiceCoverRowID;
                this.ContractNumber = this.ContractNumber;
                break;
            case 'PremiseAll':
                this.Mode = 'PremiseAll';
                this.RowID = this.Premise;
                break;
            case 'Premise':
                this.Mode = 'Premise';
                this.RowID = this.Premise;
                break;
            case 'ProductAll':
                this.Mode = 'ProductAll';
                this.Business = this.inputParams.BusinessCode;
                this.ContractNumber = this.ContractNumber;
                this.ProductCode = this.ContractHistoryFilterValue;
                break;
            default:


        }
    }



    public createPage(parentMode: string): void {
        switch (parentMode) {
            case 'Contract':
            case 'ContractAll':
            case 'ContractHistory-All':
                this.mViewType = 'Contract';
                this.setmaxcolumn(this.mViewType);
                this.ContractNumber = this.ContractNumber;
                this.ContractName = this.ContractName;
                this.servicevaluegridFormGroup = this.fb.group({
                    ContractNumber: [this.ContractNumber],
                    ContractName: [this.ContractName]
                });
                break;
            case 'ProductAll':
                this.mViewType = 'Contract';
                this.setmaxcolumn(this.mViewType);
                this.ContractNumber = this.ContractNumber;
                this.ContractName = this.ContractName;
                this.servicevaluegridFormGroup = this.fb.group({
                    ProductCode: [this.ContractHistoryFilterValue],
                    ProductDesc: [this.ContractHistoryFilterDesc]
                });
                break;
            case 'Premise':
            case 'Premise-ServiceSummary':
            case 'PremiseAll':
            case 'PremiseHistory-All':
            case 'Contract-ServiceSummary':
                this.mViewType = 'Premise';
                this.setmaxcolumn(this.mViewType);
                this.title = 'Premise Details';
                this.ContractNumber = this.ContractNumber;
                this.ContractName = this.ContractName;

                if (parentMode === 'PremiseAll') {
                    this.servicevaluegridFormGroup = this.fb.group({
                        PremiseNumber: [this.ContractHistoryFilterValue],
                        PremiseName: [this.ContractHistoryFilterDesc]
                    });
                }
                else if (parentMode === 'Contract-ServiceSummary' || parentMode === 'Premise-ServiceSummary') {
                    this.mViewType = 'ServiceCover';
                    this.maxColumn = 13;

                    this.servicevaluegridFormGroup = this.fb.group({
                        PremiseNumber: this.PremiseNumber,
                        PremiseName: [this.ContractHistoryFilterDesc],
                        ContractNumber: this.ContractNumber,
                        ContractName: this.ContractName,
                        ProductCode: this.ProductCode,
                        ProductDesc: [this.ContractHistoryFilterDesc]
                    });

                    this.GetPremiseAndProductNames();
                }
                else {
                    this.PremiseNumber = this.PremiseNumber;
                    this.PremiseName = this.PremiseName;
                }
                break;

            case 'ServiceCover':
            case 'ServiceCoverAll':
            case 'ServiceCoverHistory-All':
            case 'ServiceCoverDisplay':
                this.mViewType = 'ServiceCover';
                this.setmaxcolumn(this.mViewType);
                this.title = 'Service Cover Details';
                this.PremiseNumber = this.PremiseNumber;
                this.PremiseName = this.PremiseName;
                this.ContractNumber = this.ContractNumber;
                this.ContractName = this.ContractName;
                this.ProductCode = this.ProductCode;
                this.ProductDesc = this.ProductDesc;
                this.servicevaluegridFormGroup.controls['PremiseName'].setValue(this.PremiseName);
                this.servicevaluegridFormGroup.controls['ContractName'].setValue(this.ContractName);
                this.servicevaluegridFormGroup.controls['ProductCode'].setValue(this.ProductCode);
                this.servicevaluegridFormGroup.controls['ProductDesc'].setValue(this.ProductDesc);
                break;
            default:


        }
    }

    public setmaxcolumn(mViewType: string): void {
        if (mViewType === 'Contract') {
            this.maxColumn++;
        }

        if (mViewType === 'Contract' || mViewType === 'Premise') {
            this.maxColumn++;
        }

        if (mViewType === 'ServiceCover') {
            this.maxColumn = this.maxColumn + 6;
        }
    }
    public updateCheckedOptions(event: any): void {
        if (event.target.checked) {
            this.inputParams.ShowAdjustments = 'True';
        } else {
            this.inputParams.ShowAdjustments = 'False';
        }
    }
    public getGridInfo(info: any): void {
        this.totalRecords = info.totalRows;
    }
    public getCurrentPage(data: any): void {
        this.gridCurPage = data.value;
        this.buildGrid();
    }
    public sortGrid(data: any): void {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.buildGrid();
    }
    public buildGrid(): void {
        this.buildGridStructure();
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        if (this.inputParams.businessCode !== undefined && this.inputParams.businessCode !== null) {
            this.search.set(this.serviceConstants.BusinessCode, this.util.getBusinessCode());
        } else {
            this.search.set(this.serviceConstants.BusinessCode, this.util.getBusinessCode());
        }
        if (this.inputParams.countryCode !== undefined && this.inputParams.countryCode !== null) {
            this.search.set(this.serviceConstants.CountryCode, this.util.getCountryCode());
        } else {
            this.search.set(this.serviceConstants.CountryCode, this.util.getCountryCode());
        }
        this.search.set(this.serviceConstants.BusinessCode, this.util.getBusinessCode());

        this.search.set('ShowAdjustments', this.inputParams.ShowAdjustments);
        this.search.set('Mode', this.Mode);
        this.search.set('Contract', this.ContractNumber);
        this.search.set('Premise', this.PremiseNumber);
        if (this.RowID) {
            this.search.set('RowID', this.RowID);
        }
        this.search.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        this.search.set(this.serviceConstants.GridPageCurrent, this.gridCurPage.toString());
        this.search.set(this.serviceConstants.Action, this.action);
        this.inputParams.search = this.search;
        this.serviceValueGrid.loadGridData(this.inputParams);
    }

    public refresh(): void {
        this.buildGrid();
        this.serviceValueGrid.loadGridData(this.inputParams);
    }

    public lookUpRecord(data: any, maxresults: any): any {
        this.lookupParams.set(this.serviceConstants.Action, '0');
        this.lookupParams.set(this.serviceConstants.BusinessCode, this.util.getBusinessCode());
        this.lookupParams.set(this.serviceConstants.CountryCode, this.util.getCountryCode());
        if (maxresults) {
            this.lookupParams.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        if (data)
            return this.httpService.lookUpRequest(this.lookupParams, data);
    }

    public onDataReceived(data: any, route?: any): void {
        this.servicevaluegridFormGroup.controls['ContractName'].setValue(data.ContractName);
        this.servicevaluegridFormGroup.controls['PremiseName'].setValue(data.PremiseName);
    }

    public onGridRowClick(event: any): any {
        // if (event.cellIndex === 0) {
        //     alert('Page (Service/iCABSSeServiceValueMaintenance.htm) is not developed.');
        // }
    }
    public onGridRowDblClick(event: any): any {
        this._logger.log(event);
        if (event.cellIndex === 0) {
            this._router.navigate([AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEVALUEMAINTENANCE],
                {
                    queryParams: {
                        ContractNumber: this.ContractNumber,
                        PremiseNumber: this.PremiseNumber,
                        ProductCode: this.ProductCode,
                        ContractName: this.ContractName,
                        PremiseName: this.PremiseName,
                        ProductDesc: this.ProductDesc,
                        ServiceValueROWID: event.cellData.rowID
                    }
                });
        }
    }

    public GetPremiseAndProductNames(): any {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.util.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.util.getCountryCode());
        search.set(this.serviceConstants.Action, '0');
        search.set('Function', 'GetPremiseAndProductNames');
        search.set('ContractNumber', this.ContractNumber);
        search.set('PremiseNumber', this.PremiseNumber);
        search.set('ProductCode', this.ProductCode);
        this.httpService.xhrGet(this.method, this.module, this.operation, search).then((data) => {
            if (!data.hasError) {
                this.PremiseName = data.PremiseName;
                this.servicevaluegridFormGroup.controls['PremiseNumber'].disable();
                this.servicevaluegridFormGroup.controls['PremiseName'].setValue(this.PremiseName);
                this.ProductDesc = data.ProductDesc;
                this.servicevaluegridFormGroup.controls['ProductCode'].disable();
                this.servicevaluegridFormGroup.controls['ProductDesc'].setValue(this.ProductDesc);
            }
        });
    }

}
