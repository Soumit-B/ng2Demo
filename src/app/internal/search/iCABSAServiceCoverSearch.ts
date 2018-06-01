import { Validators } from '@angular/forms';
import { PremiseSearchComponent } from './iCABSAPremiseSearch';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ContractSearchComponent } from './iCABSAContractSearch';
import { Subscription } from 'rxjs';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, Input, forwardRef, Inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { TableComponent } from './../../../shared/components/table/table';
import { MntConst } from './../../../shared/services/riMaintenancehelper';


@Component({
    templateUrl: 'iCABSAServiceCoverSearch.html'
})

export class ServiceCoverSearchComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('searchCovertable') searchCovertable: TableComponent;
    @ViewChild('contractNumberEllipsis') contractNumberEllipsis: EllipsisComponent;
    @Input() showAddNew: boolean = false;
    public pageId: string = '';
    public selectedrowdata: any;
    public muleConfig: any = {
        'method': 'contract-management/search',
        'module': 'service-cover',
        'operation': 'Application/iCABSAServiceCoverSearch',
        'action': '0'
    };
    public search: URLSearchParams = new URLSearchParams();
    public itemsPerPage: string = '10';
    public page: string = '1';
    public totalItem: string = '11';
    public inputParams: any = {};
    public columns: Array<any> = new Array();
    public rowmetadata: Array<any> = new Array();
    private routeParams: any;
    private currentContractType: string;
    private currentContractTypeLabel: string;
    private optionsList: Array<any> = [];
    private lineOfService: Array<any> = [];
    private lookUpSubscription: Subscription;
    private salesCoverModel: any = {
        'CopyContractNumber': '',
        'CopyPremiseNumber': '',
        'ContractNumber': '',
        'ContractName': '',
        'PremiseNumber': '',
        'PremiseName': '',
        'ProductCodeSCProductCode': '',
        'ParentProductCodeProductCode': '',
        'ParentProductDescProductDesc': '',
        'DispenserInd': '',
        'ConsumableInd': ''
    };

    public ellipsisConfig = {
        premise: {
            disabled: false,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'ServiceCoverCopy',
                'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                'ContractNumber': '',
                'ContractName': '',
                'showAddNew': false,
                'CopyContractNumber': ''
            },
            component: PremiseSearchComponent
        }
    };

    public fieldVisibility: any = {
        'tdStatusSearch': true,
        'trContract': true,
        'trPremise': true,
        'trCopyContract': false,
        'trCopyPremise': false,
        'trProduct': true
    };
    public contractSearchComponent = ContractSearchComponent;
    public contractSearchParams: any = {
        'parentMode': 'LookUp-CopyContractNumber',
        'currentContractType': '',
        'currentContractTypeURLParameter': '',
        'showAddNew': false
    };
    public showHeader: boolean = true;
    public showCloseButton: boolean = true;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public isContractEllipsisDisabled: boolean = false;
    public docTitle: string = '';

    public labelContractNumber: string = '';
    public tableTitle: string = '';
    public displayMenu: boolean = false;

    public controls = [
        { name: 'ContractNumber', readonly: false, disabled: false, required: false },
        { name: 'ContractName', readonly: true, disabled: false, required: false },
        { name: 'StatusSearchType', readonly: true, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
        { name: 'PremiseName', readonly: true, disabled: false, required: false },
        { name: 'LOSCode', readonly: false, disabled: false, required: false },
        { name: 'CopyContractNumber', readonly: true, disabled: false, required: false },
        { name: 'CopyPremiseNumber', readonly: true, disabled: false, required: false },
        { name: 'ProductCode', readonly: false, disabled: false, required: false },
        { name: 'ProductDesc', readonly: true, disabled: false, required: false },
        { name: 'menu', readonly: true, disabled: false, required: false, value: 'Options' },
        { name: 'DispenserInd', readonly: true, disabled: false, required: false },
        { name: 'ConsumableInd', readonly: true, disabled: false, required: false },
        { name: 'SCProductCode', readonly: true, disabled: false, required: false }
    ];
    constructor(injector: Injector,
        private ellipsis: EllipsisComponent
        //@Inject(forwardRef(() => EllipsisComponent)) private ellipsis: EllipsisComponent
    ) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERSEARCH;
    }

    ngOnInit(): void {
        this.logger.warn('Service cover ngOnInit');
        super.ngOnInit();
        this.populateUIFromFormData();
        try {
            this.localeTranslateService.setUpTranslation();
        }
        catch (e) {
            this.logger.warn('Service cover ngOnInit');
        }

        this.riExchange.riInputElement.SetValue(this.uiForm, 'StatusSearchType', '');
        this.labelContractNumber = this.translatedText('Contract Number');
        this.tableTitle = this.translatedText('Service Cover Search');

        this.setCurrentContractType();
        this.getSysCharDtetails();
        this.buildStatusOptions();
        this.lineOfServiceLookupData();
    }

    ngOnDestroy(): void {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        //this.utils.setTitle(this.docTitle);
    }

    private pageInit(): void {
        this.parentMode = this.inputParams.parentMode;

        this.setDefaultValues();
        // if (this.parentMode === 'LookUp-ContractHistory') {
        //     this.uiForm.controls['PremiseNumber'].setValidators(Validators.required);
        //     this.uiForm.updateValueAndValidity();
        // }
        // else {
        //     this.uiForm.controls['PremiseNumber'].clearValidators();
        //     this.uiForm.updateValueAndValidity();
        // }

        if (this.currentContractType === 'C') {
            this.fieldVisibility.tdStatusSearch = true;
        }
        else {
            this.fieldVisibility.tdStatusSearch = false;
        }

        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')) {
            this.fieldVisibility.trProduct = true;
        }
        else {
            this.fieldVisibility.trProduct = false;
        }

        let strInpTitle;
        let strDocTitle;
        let strTabTitle;


        this.getTranslatedValue('^1^ Number', null).subscribe((res: string) => {
            if (res) {
                strInpTitle = res;
                strInpTitle = (this.inputParams.parentMode === 'PortfolioGeneralMaintenance')
                    ? strInpTitle.replace('^1^', '')
                    : strInpTitle.replace('^1^', this.currentContractTypeLabel);
            } else {
                strInpTitle = '^1^ Number';
                strInpTitle = (this.inputParams.parentMode === 'PortfolioGeneralMaintenance')
                    ? strInpTitle.replace('^1^', '')
                    : strInpTitle.replace('^1^', this.currentContractTypeLabel);
            }
        });
        this.docTitle = strDocTitle;
        this.getTranslatedValue('^1^ Service Cover Search', null).subscribe((res: string) => {
            if (res) {
                strDocTitle = res;
                strDocTitle = (this.inputParams.parentMode === 'PortfolioGeneralMaintenance')
                    ? strDocTitle.replace('^1^', '')
                    : strDocTitle.replace('^1^', this.currentContractTypeLabel);
            } else {
                strDocTitle = '^1^ Service Cover Search';
                strDocTitle = (this.inputParams.parentMode === 'PortfolioGeneralMaintenance')
                    ? strDocTitle.replace('^1^', '')
                    : strDocTitle.replace('^1^', this.currentContractTypeLabel);
            }
        });

        this.getTranslatedValue('^1^ Service Cover Details', null).subscribe((res: string) => {
            if (res) {
                strTabTitle = res;
                strTabTitle = (this.inputParams.parentMode === 'PortfolioGeneralMaintenance')
                    ? strTabTitle.replace('^1^', '')
                    : strTabTitle.replace('^1^', this.currentContractTypeLabel);
            } else {
                strTabTitle = '^1^ Service Cover Details';
                strTabTitle = (this.inputParams.parentMode === 'PortfolioGeneralMaintenance')
                    ? strTabTitle.replace('^1^', '')
                    : strTabTitle.replace('^1^', this.currentContractTypeLabel);
            }
        });

        this.labelContractNumber = strInpTitle;
        this.tableTitle = strTabTitle;

        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        //this.utils.setTitle(this.docTitle);
    }


    private right(str: string, length: number): any {
        let lastvalue = str;
        if (str && str.length >= length) {
            lastvalue = str.substr(str.length - length);
        }
        return lastvalue;
    }


    public buildTableColumns(): void {
        this.columns = [];
        let prdCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        if (prdCode !== undefined && prdCode !== null && prdCode.trim() !== '' ) {
            switch (this.inputParams.parentMode) {
                case 'LinkedSearch':
                case 'ParentLinkedSearch':
                case 'ChildLinkedSearch':
                    break;

                case 'Search':
                    this.getTranslatedValue('Product Code', null).subscribe((res: string) => {
                        if (res) {
                            this.columns.push({ title: res, name: 'ProductCode', type: MntConst.eTypeCode });
                        } else {
                            this.columns.push({ title: 'Product Code', name: 'ProductCode', type: MntConst.eTypeCode });
                        }
                    });
                    this.getTranslatedValue('Description', null).subscribe((res: string) => {
                        if (res) {
                            this.columns.push({ title: res, name: 'ProductDesc' , type: MntConst.eTypeText });
                        } else {
                            this.columns.push({ title: 'Description', name: 'ProductDesc' , type: MntConst.eTypeText  });
                        }
                    });
                    break;
            }
        }
        else {

            this.getTranslatedValue('Product Code', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'ProductCode' , type: MntConst.eTypeCode });
                } else {
                    this.columns.push({ title: 'Product Code', name: 'ProductCode' , type: MntConst.eTypeCode });
                }
            });
            this.getTranslatedValue('Description', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'ProductDesc' , type: MntConst.eTypeText });
                } else {
                    this.columns.push({ title: 'Description', name: 'ProductDesc' , type: MntConst.eTypeText });
                }
            });
        }

        if ((this.inputParams.parentMode === 'CallCentreSearch') ||
            (this.inputParams.parentMode === 'ParentLinkedSearch') ||
            (this.inputParams.parentMode === 'ChildLinkedSearch') ||
            (this.inputParams.parentMode === 'LinkedSearch') ||
            (this.inputParams.parentMode === 'LookUpBasic-Ext')) {
            this.getTranslatedValue('Number', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'ServiceCoverNumber' , type: MntConst.eTypeInteger });
                } else {
                    this.columns.push({ title: 'Number', name: 'ServiceCoverNumber' , type: MntConst.eTypeInteger });
                }
            });
        }

        if (this.inputParams.parentMode === 'LookUp-ContractHistory') {
            this.getTranslatedValue('Premise Number', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'PremiseNumber' , type: MntConst.eTypeInteger  });
                } else {
                    this.columns.push({ title: 'Premise Number', name: 'PremiseNumber' , type: MntConst.eTypeInteger  });
                }
            });
        }

        this.getTranslatedValue('Visit Frequency', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'ServiceVisitFrequency' , type: MntConst.eTypeInteger });
            } else {
                this.columns.push({ title: 'Visit Frequency', name: 'ServiceVisitFrequency' , type: MntConst.eTypeInteger });
            }
        });

        this.getTranslatedValue('Status', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'PortfolioStatusDesc' , type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Status', name: 'PortfolioStatusDesc' , type: MntConst.eTypeText });
            }
        });

        this.getTranslatedValue('Line of Service', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'LOSName' , type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Line of Service', name: 'LOSName' , type: MntConst.eTypeText });
            }
        });

    }

    public loadData(): void {
        this.buildTableColumns();
        if (this.fieldVisibility.trPremise) {
            if (this.uiForm.controls['PremiseNumber'].value) {
                this.loadTableData();
            }
        }
        else if (this.fieldVisibility.trCopyPremise) {
            if (this.uiForm.controls['CopyPremiseNumber'].value) {
                this.loadTableData();
            }
        }
        else {
            this.loadTableData();
        }
    }

    public translatedText(key: any): any {
        this.getTranslatedValue(key, null).subscribe((res: string) => {
            if (res) {
                return res;
            } else {
                return key;
            }
        });
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }
    }

    public setCurrentContractType(): void {
        this.currentContractType =
            this.utils.getCurrentContractType(this.inputParams['CurrentContractTypeURLParameter']);
        this.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.currentContractType);
    }

    private getSysCharDtetails(): any {

        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel];
        let sysCharIP = {
            module: this.muleConfig.module,
            operation: this.muleConfig.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            if (record && record.length > 0) {
                this.pageParams.vEnableServiceCoverDispLev = (record[0]['Required']) ? record[0]['Required'] : false;
            }
        });
    }

    public buildStatusOptions(): void {
        this.optionsList = [
            { value: '', text: 'All' },
            { value: 'L', text: 'Current' },
            { value: 'FL', text: 'Forward Current' },
            { value: 'D', text: 'Deleted' },
            { value: 'FD', text: 'Forward Deleted' },
            { value: 'PT', text: 'Pending Deletion' },
            { value: 'T', text: 'Terminated' },
            { value: 'FT', text: 'Forward Terminated' },
            { value: 'PT', text: 'Pending Termination' },
            { value: 'C', text: 'Cancelled' }
        ];
    }

    public selectedData(event: any): void {
        let returnObj: any;
        returnObj = {
            row: event.row,
            ProductCode: event.row.ProductCode,
            ProductDesc: event.row.ProductDesc
        };
        switch (this.inputParams.parentMode) {
            case 'Premise':
                //this.ContractNumberServiceCoverRowID = ''
                if (this.currentContractType === 'C' || this.currentContractType === 'J') {
                    this.navigate('Search', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE);
                } else {
                    //this.navigate('Search', '');
                    alert('Open iCABSAProductSalesServiceCoverMaintenance');
                    //"/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAProductSalesServiceCoverMaintenance.htm" + this.currentContractTypeURLParameter
                }
                break;
            case 'ServiceCoverCopy':
                this.getServiceCoverCopyData(event.row);
                break;
            default:
                this.ellipsis.sendDataToParent(returnObj);
                break;
        }

    }
    public getCurrentPage(currentPage: string): void {
        this.page = currentPage;
    }
    public updateView(params: any): void {
        this.inputParams = params || this.inputParams;
        this.setCurrentContractType();
        if (this.inputParams && this.inputParams.showAddNew !== undefined) {
            this.showAddNew = params.showAddNew ? params.showAddNew : false;
        }
        else {
            this.showAddNew = false;
        }

        if (params) {
            this.pageInit();
        }
        this.refresh();
    }

    public loadTableData(): void {
        this.inputParams.module = this.muleConfig.module;
        this.inputParams.method = this.muleConfig.method;
        this.inputParams.operation = this.muleConfig.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (this.parentMode === 'ParentLinkedSearch' || this.parentMode === 'ChildLinkedSearch' || this.parentMode === 'LinkedSearch') {
            this.search.set('SCProductCode', this.uiForm.controls['SCProductCode'].value);
            //this.search.set('SCProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'SCProductCode'));
        }


        //if (this.riExchange.riInputElement.GetValue(this.uiForm, 'LOSCode')) {
        this.search.set('LOSCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'LOSCode'));
        //}


        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));

        if (this.inputParams.parentMode === 'ServiceCoverCopy') {
            this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'CopyContractNumber'));
            this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'CopyPremiseNumber'));
        }
        else {
            this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
            if (this.parentMode === 'LookUp-ContractHistory') {
                this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
            }
        }

        if (this.parentMode === 'LookUp-ContractHistory') {
            this.search.set('ContractHistory', this.riExchange.riInputElement.GetValue(this.uiForm, 'ConsumableInd') ? 'True' : 'False');
        }
        else {
            this.search.set('ContractHistory', 'False');
        }


        //if (this.riExchange.riInputElement.GetValue(this.uiForm, 'StatusSearchType') !== 'All') {
        this.search.set('PortfolioStatusCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'StatusSearchType'));
        // }
        if (this.parentMode === 'LinkedSearch' || this.parentMode === 'ParentLinkedSearch' || this.parentMode === 'ChildLinkedSearch') {
            this.search.set('LinkedValidProduct', 'True');
        }
        else {
            this.search.set('LinkedValidProduct', 'False');
        }

        if (this.parentMode === 'ParentLinkedSearch') {
            this.search.set('ProductCode', this.inputParams['ParentProductCode'] ? this.inputParams['ParentProductCode'] : '');
        }
        else if (this.parentMode === 'ChildLinkedSearch') {
            this.search.set('ProductCode', this.inputParams['ChildLinkedSearch'] ? this.inputParams['ChildLinkedSearch'] : '');
        }
        else if (this.parentMode === 'LinkedSearch') {
            this.search.set('ProductCode', this.inputParams['LinkedProductCode'] ? this.inputParams['LinkedProductCode'] : '');
        }
        else {
            this.search.set('ProductCode', this.inputParams['LinkedProductCode'] ? this.inputParams['LinkedProductCode'] : '');
            if (this.inputParams.hasOwnProperty('ProductCode')) {
                this.search.set('ProductCode', this.inputParams['ProductCode'] ? this.inputParams['ProductCode'] : '');
            }
        }

        if (this.parentMode === 'LookUp-Freq-Loc') {
            this.search.set('DisplayLevel', 'True');
        }
        else {
            this.search.set('DisplayLevel', 'False');
        }

        this.search.set('CurrentContractType', this.currentContractType);

        this.search.set(this.serviceConstants.PageCurrent, this.page);
        this.inputParams.search = this.search;
        this.searchCovertable.loadTableData(this.inputParams);
    }

    public setDefaultValues(): void {
        switch (this.inputParams.parentMode) {

            case 'ProductCode01':
            case 'ProductCode02':
            case 'ProductCode03':
            case 'ProductCode04':
            case 'ProductCode05':
            case 'ProductCode06':
            case 'ProductCode07':
            case 'ProductCode08':
            case 'ProductCode09':
            case 'ProductCode10':
            case 'ProductCode11':
            case 'ProductCode12':
            case 'ProductCode13':
            case 'ProductCode14':

                this.salesCoverModel.ContractNumber = this.getFieldValue(this.inputParams['ContractNumber' + this.right(this.inputParams.parentMode, 2)]);
                this.salesCoverModel.PremiseNumber = this.getFieldValue(this.inputParams['PremiseNumber' + this.right(this.inputParams.parentMode, 2)]);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.salesCoverModel.ContractNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.salesCoverModel.PremiseNumber);

                setTimeout(() => {
                    this.loadData();
                }, 0);
                break;
            case 'ServiceCoverCopy':

                this.fieldVisibility.trContract = false;
                this.fieldVisibility.trPremise = false;
                this.fieldVisibility.trCopyContract = true;
                this.fieldVisibility.trCopyPremise = true;

                let obj = document.getElementById('CopyContractNumber');
                if (obj) {
                    obj.focus();
                }
                this.salesCoverModel.CopyContractNumber = this.getFieldValue(this.inputParams.CopyContractNumber);
                this.salesCoverModel.CopyPremiseNumber = this.getFieldValue(this.inputParams.CopyPremiseNumber);

                this.riExchange.riInputElement.SetValue(this.uiForm, 'CopyContractNumber', this.salesCoverModel.CopyContractNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CopyPremiseNumber', this.salesCoverModel.CopyPremiseNumber);

                setTimeout(() => {
                    this.loadData();
                }, 0);
                break;
            case 'ParentLinkedSearch':
                this.salesCoverModel.ContractNumber = this.getFieldValue(this.inputParams.ContractNumber);
                this.salesCoverModel.ContractName = this.getFieldValue(this.inputParams.ContractName);
                this.salesCoverModel.PremiseNumber = this.getFieldValue(this.inputParams.PremiseNumber);
                this.salesCoverModel.PremiseName = this.getFieldValue(this.inputParams.PremiseName);
                this.salesCoverModel.SCProductCode = this.getFieldValue(this.inputParams.ProductCode);
                this.salesCoverModel.ProductCode = this.getFieldValue(this.inputParams.ParentProductCode);
                this.salesCoverModel.ProductDesc = this.getFieldValue(this.inputParams.ParentProductDesc);
                this.salesCoverModel.DispenserInd = this.getFieldValue(this.inputParams.DispenserInd);
                this.salesCoverModel.ConsumableInd = this.getFieldValue(this.inputParams.ConsumableInd);

                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.salesCoverModel.ContractNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.salesCoverModel.ContractName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.salesCoverModel.PremiseNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.salesCoverModel.PremiseName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.salesCoverModel.ProductCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SCProductCode', this.salesCoverModel.SCProductCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DispenserInd', this.salesCoverModel.DispenserInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ConsumableInd', this.salesCoverModel.ConsumableInd);

                setTimeout(() => {
                    this.loadData();
                }, 0);
                break;
            case 'ChildLinkedSearch':
                this.salesCoverModel.ContractNumber = this.getFieldValue(this.inputParams.ContractNumber);
                this.salesCoverModel.ContractName = this.getFieldValue(this.inputParams.ContractName);
                this.salesCoverModel.PremiseNumber = this.getFieldValue(this.inputParams.PremiseNumber);
                this.salesCoverModel.PremiseName = this.getFieldValue(this.inputParams.PremiseName);
                this.salesCoverModel.SCProductCode = this.getFieldValue(this.inputParams.ProductCode);
                this.salesCoverModel.ProductCode = this.getFieldValue(this.inputParams.ChildProductCode);
                this.salesCoverModel.ProductDesc = this.getFieldValue(this.inputParams.ChildProductDesc);
                this.salesCoverModel.DispenserInd = this.getFieldValue(this.inputParams.DispenserInd);
                this.salesCoverModel.ConsumableInd = this.getFieldValue(this.inputParams.ConsumableInd);

                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.salesCoverModel.ContractNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.salesCoverModel.ContractName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.salesCoverModel.PremiseNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.salesCoverModel.PremiseName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.salesCoverModel.ProductCode);

                this.riExchange.riInputElement.SetValue(this.uiForm, 'SCProductCode', this.salesCoverModel.SCProductCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.salesCoverModel.ProductDesc);

                this.riExchange.riInputElement.SetValue(this.uiForm, 'DispenserInd', this.salesCoverModel.DispenserInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ConsumableInd', this.salesCoverModel.ConsumableInd);

                setTimeout(() => {
                    this.loadData();
                }, 0);
                break;
            case 'LinkedSearch':
                this.salesCoverModel.ContractNumber = this.getFieldValue(this.inputParams.ContractNumber);
                this.salesCoverModel.ContractName = this.getFieldValue(this.inputParams.ContractName);
                this.salesCoverModel.PremiseNumber = this.getFieldValue(this.inputParams.PremiseNumber);
                this.salesCoverModel.PremiseName = this.getFieldValue(this.inputParams.PremiseName);
                this.salesCoverModel.SCProductCode = this.getFieldValue(this.inputParams.ProductCode);
                this.salesCoverModel.ProductCode = this.getFieldValue(this.inputParams.LinkedProductCode);
                this.salesCoverModel.ProductDesc = this.getFieldValue(this.inputParams.LinkedProductDesc);
                this.salesCoverModel.DispenserInd = this.getFieldValue(this.inputParams.DispenserInd);
                this.salesCoverModel.ConsumableInd = this.getFieldValue(this.inputParams.ConsumableInd);

                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.salesCoverModel.ContractNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.salesCoverModel.ContractName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.salesCoverModel.PremiseNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.salesCoverModel.PremiseName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.salesCoverModel.ProductCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SCProductCode', this.salesCoverModel.SCProductCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.salesCoverModel.ProductDesc);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DispenserInd', this.salesCoverModel.DispenserInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ConsumableInd', this.salesCoverModel.ConsumableInd);
                setTimeout(() => {
                    this.loadData();
                }, 0);
                break;
            default:

                this.salesCoverModel.ContractNumber = this.getFieldValue(this.inputParams.ContractNumber);
                this.salesCoverModel.ContractName = this.getFieldValue(this.inputParams.ContractName);

                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.salesCoverModel.ContractNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.salesCoverModel.ContractName);

                if (this.inputParams.parentMode === 'LookUp-ContractHistory') {
                    this.fieldVisibility.trPremise = false;
                }
                else {
                    this.salesCoverModel.PremiseNumber = this.getFieldValue(this.inputParams.PremiseNumber);
                    this.salesCoverModel.PremiseName = this.getFieldValue(this.inputParams.PremiseName);

                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.salesCoverModel.PremiseNumber);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.salesCoverModel.PremiseName);

                    if ((this.inputParams.parentMode !== 'CallCentreSearch') && (this.inputParams.parentMode !== 'LookUp-PremiseHistory')
                        && (this.inputParams.parentMode !== 'LookUp-ServiceCoverProd') && (this.inputParams.parentMode !== 'ParentLinkedSearch')
                        && (this.inputParams.parentMode !== 'ChildLinkedSearch')) {

                        this.salesCoverModel.ProductCode = this.getFieldValue(this.inputParams.ProductCode);
                        this.salesCoverModel.ProductDesc = this.getFieldValue(this.inputParams.ProductDesc);

                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.salesCoverModel.ProductCode);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.salesCoverModel.ProductDesc);
                    }
                }
                setTimeout(() => {
                    this.loadData();
                }, 0);
        }


    }

    public lineOfServiceLookupData(): void {
        this.lineOfService = [];
        let lookupIP = [
            {
                'table': 'LineOfService',
                'query': { 'ValidForBusiness': this.utils.getBusinessCode() },
                'fields': ['LOSCode', 'LOSName']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data && data[0]) {
                for (let i = 0; i < data[0].length; i++) {
                    if (data[0][i].LOSName && data[0][i].LOSName) {
                        this.zone.run(() => {
                            this.lineOfService.push({ 'LOSCode': data[0][i].LOSCode, 'LOSName': data[0][i].LOSName });
                        });
                    }
                }
            }
        });
    }

    public refresh(): void {
        this.searchCovertable.clearTable();
        this.search.set(this.serviceConstants.Action, '0');
        this.loadData();
    }

    private getFieldValue(value: string): any {
        return (value) ? value : '';
    }

    public onChangeOption(value: string): void {
        if (value === 'AddRecord') {
            if (this.currentContractType === 'C' || this.currentContractType === 'J') {
                this.navigate('SearchAdd', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE);
            } else {
                //this.navigate('SearchAdd', '');
                alert('Open iCABSAProductSalesServiceCoverMaintenance');
                //"/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAProductSalesServiceCoverMaintenance.htm" + this.currentContractTypeURLParameter
            }
        }
    }

    public add(): void {
        this.ellipsis.sendDataToParent({
            parentMode: 'SearchAdd'
        });
    }

    public onContractDataReceived(data: any, route: boolean, mode?: any): void {
        if (data && data.ContractNumber) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CopyContractNumber', data.ContractNumber);
            this.ellipsisConfig.premise.childConfigParams['CopyContractNumber'] = data.ContractNumber;
        }
        if (!data.ContractNumber) {
            this.ellipsisConfig.premise.childConfigParams['CopyContractNumber'] = '';
        }
    }

    public modalHidden(): void {
        //modalhidden
    }


    public onPremiseDataReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CopyPremiseNumber', data.PremiseNumber);
            //this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
        }
    }

    public getServiceCoverCopyData(event: any): any {
        let returnObj: any;
        let postdata: Object = {};
        let query = new URLSearchParams();
        query.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode ? this.inputParams.businessCode : this.utils.getBusinessCode());
        query.set(this.serviceConstants.CountryCode, this.inputParams.countryCode ? this.inputParams.countryCode : this.utils.getCountryCode());
        query.set(this.serviceConstants.Action, '0');
        query.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'CopyContractNumber'));
        query.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'CopyPremiseNumber'));
        query.set('ServiceCoverRowID', event.ttServiceCover);
        query.set('FunctionName', 'ServiceCoverCopy');
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, query).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e.errorMessage) {
                        this.errorService.emitError(e.errorMessage);
                    }
                    else {
                        returnObj = {
                            row: event.row,
                            ServiceCoverCopy: e
                        };
                        this.ellipsis.sendDataToParent(returnObj);
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    public contractNumberFormatOnChange(num: any, size: any): string {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }

    public onBlurCopyFromContract(event: any): void {
        let elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 8) {
            let paddedValue = this.contractNumberFormatOnChange(elementValue, 8);
            if (event.target.id === 'CopyContractNumber') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CopyContractNumber', paddedValue);
                this.ellipsisConfig.premise.childConfigParams['CopyContractNumber'] = paddedValue;
            }
        }
        if (elementValue.length === 0) {
            this.ellipsisConfig.premise.childConfigParams['CopyContractNumber'] = '';
        }
    }

    public onKeyDown(event: any): void {
        if (event.keyCode === 13) {
            this.contractNumberEllipsis.openModal();
        }
    }

}
