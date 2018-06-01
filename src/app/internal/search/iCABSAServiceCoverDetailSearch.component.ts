import { InternalMaintenanceModuleRoutes, InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { TableComponent } from './../../../shared/components/table/table';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAServiceCoverDetailSearch.html'
})

export class ServiceCoverDetailsComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('ServiceCoverDetailTable') ServiceCoverDetailTable: TableComponent;

    public queryParams: any = {
        operation: 'Application/iCABSAServiceCoverDetailSearch',
        module: 'contract-admin',
        method: 'contract-management/search'
    };

    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: true, required: false },
        { name: 'ContractName', readonly: true, disabled: true, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: true, required: false },
        { name: 'PremiseName', readonly: true, disabled: true, required: false },
        { name: 'ProductCode', readonly: true, disabled: true, required: false },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false },
        { name: 'ServiceCoverRowID', readonly: true, disabled: true, required: false },
        { name: 'tdMenu', readonly: false, disabled: false, required: false, value: 'Options' }
    ];

    //local variables
    public pageId: string = '';
    public scEnableProductDetailQty: boolean = false;
    public tdMenuDisplay: boolean = true;
    public selectedValue: string = '';
    public showMessageHeader: boolean = true;

    //table variables
    public tableheading: string = 'Contract Service Detail Search';
    public contractLabel: string = 'Contract Number';
    public search = new URLSearchParams();
    public itemsPerPage: string = '10';
    public page: string = '1';
    public totalItem: string = '11';
    public columns: Array<any>;
    public rowmetadata: Array<any> = new Array();

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERDETAILSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getSysCharDtetails();
        this.window_onload();
        this.pageParams.parentMode = this.riExchange.getParentMode();
        this.pageParams.currentContractTypeURLParameter = this.riExchange.getCurrentContractTypeLabel();
        this.pageTitle = this.pageParams.currentContractTypeURLParameter + ' Service Detail';
        if (this.pageParams.parentMode === 'ServiceCover') {
            this.utils.setTitle(this.pageTitle + ' Search');
        }
    }

    ngAfterViewInit(): void {
        this.selectedValue = 'Options';
        this.setControlValue('tdMenu', this.selectedValue);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public getSysCharDtetails(): any {
        let sysCharNumbers = [this.sysCharConstants.SystemCharEnableProductDetailQty];
        let sysCharIp = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharNumbers.toString()
        };
        this.speedScript.sysChar(sysCharIp).subscribe((data) => {
            this.scEnableProductDetailQty = data.records[0].Required;
            this.buildTableColumns();
        });
        if (this.pageParams.parentMode === 'CallOut') {
            this.tdMenuDisplay = false;
        }
    }

    public buildTableColumns(): void {
        this.columns = [];
        this.getTranslatedValue('Product Detail Code', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'ProductDetailCode', type: MntConst.eTypeCode });
            } else {
                this.columns.push({ title: 'Product Detail Code', name: 'ProductDetailCode', type: MntConst.eTypeCode });
            }
        });
        this.getTranslatedValue('Description', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'ProductDetailDesc', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Description', name: 'ProductDetailDesc', type: MntConst.eTypeText });
            }
        });
        if (this.scEnableProductDetailQty) {
            this.getTranslatedValue('Qty', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'ServiceDetailQty', type: MntConst.eTypeInteger });
                } else {
                    this.columns.push({ title: 'Qty', name: 'ServiceDetailQty', type: MntConst.eTypeInteger });
                }
            });
        }
        this.getTranslatedValue('Commence Date', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'DetailCommenceDate', type: MntConst.eTypeDate });
            } else {
                this.columns.push({ title: 'Commence Date', name: 'DetailCommenceDate', type: MntConst.eTypeDate });
            }
        });
        this.getTranslatedValue('Delete Date', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'DetailDeleteDate', type: MntConst.eTypeDate });
            } else {
                this.columns.push({ title: 'Delete Date', name: 'DetailDeleteDate', type: MntConst.eTypeDate });
            }
        });
        this.buildTable();
    }

    public buildTable(): void {
        this.search = new URLSearchParams();
        this.search.set('action', '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
        this.queryParams.search = this.search;
        this.ServiceCoverDetailTable.loadTableData(this.queryParams);
    }

    public window_onload(): void {

        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));

        switch (this.pageParams.parentMode) {
            case 'Search':
            case 'SearchExt':
                this.attributes.ServiceCoverRowID = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
                break;
            case 'CallOut':
                this.attributes.ServiceCoverRowID = this.attributes.ProductCodeServiceCoverRowID;
                break;
            default:
                this.attributes.ServiceCoverRowID = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
                break;
        }

    }

    public tableRowClick(event: any): void {

        this.pageParams.parentMode = this.riExchange.getParentMode();

        let returnObj = {
            'ProductDetailCode': event.row.ProductDetailCode,
            'ProductDetailDesc': event.row.ProductDetailDesc,
            'row': event.row
        };

        switch (this.pageParams.parentMode) {
            case 'ServiceCover':
                this.navigate('Search', InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERDETAILMAINTENANCE,
                    {
                        'CurrentContractTypeURLParameter': this.pageParams.currentContractTypeURLParameter,
                        'ContractNumber': this.getControlValue('ContractNumber'),
                        'ContractName': this.getControlValue('ContractName'),
                        'PremiseNumber': this.getControlValue('PremiseNumber'),
                        'PremiseName': this.getControlValue('PremiseName'),
                        'ProductCode': this.getControlValue('ProductCode'),
                        'ProductDesc': this.getControlValue('ProductDesc'),
                        'ServiceCoverRowID': this.getControlValue('ServiceCoverRowID')
                    }
                );
                this.riExchange.setParentHTMLValue('ProductDetailCode', returnObj.ProductDetailCode);
                this.riExchange.setParentHTMLValue('ProductDetailDesc', returnObj.ProductDetailDesc);
                this.emitSelectedData(returnObj);
                break;
            case 'LookUp':
                this.riExchange.setParentHTMLValue('ProductDetailCode', returnObj.ProductDetailCode);
                this.emitSelectedData(returnObj);
                break;
            case 'SearchExt':
                this.riExchange.setParentHTMLValue('ProductDetailCode', returnObj.ProductDetailCode);
                this.riExchange.setParentHTMLValue('ProductDetailDesc', returnObj.ProductDetailDesc);
                this.emitSelectedData(returnObj);
                break;
            default:
                this.riExchange.setParentHTMLValue('ProductDetailCode', returnObj.ProductDetailCode);
                this.emitSelectedData(returnObj);
                break;
        }
    }

    public menuOnchange(event: any): void {
        this.selectedValue = this.getControlValue('tdMenu');
        if (this.selectedValue === 'AddDetail') {
            this.navigate('SearchAdd', InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERDETAILMAINTENANCE,
                {
                    'CurrentContractTypeURLParameter': this.pageParams.currentContractTypeURLParameter,
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'ContractName': this.getControlValue('ContractName'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'PremiseName': this.getControlValue('PremiseName'),
                    'ProductCode': this.getControlValue('ProductCode'),
                    'ProductDesc': this.getControlValue('ProductDesc'),
                    'ServiceCoverRowID': this.getControlValue('ServiceCoverRowID')
                }
            );
        }
    }

    public getCurrentPage(currentPage: string): void {
        this.page = currentPage;
    }

    public refresh(): void {
        this.buildTableColumns();
        this.ServiceCoverDetailTable.clearTable();
    }

    public updateView(params: any): void {
        this.pageParams.parentMode = params.parentMode;
        if (params.ContractNumber)
            this.setControlValue('ContractNumber', params.ContractNumber);
        if (params.ContractName)
            this.setControlValue('ContractName', params.ContractName);
        if (params.PremiseNumber)
            this.setControlValue('PremiseNumber', params.PremiseNumber);
        if (params.PremiseName)
            this.setControlValue('PremiseName', params.PremiseName);
        if (params.ProductCode)
            this.setControlValue('ProductCode', params.ProductCode);
        if (params.ProductDesc)
            this.setControlValue('ProductDesc', params.ProductDesc);
        if (params.ServiceCoverRowID) {
            this.attributes.ServiceCoverRowID = params.ServiceCoverRowID;
            this.setControlValue('ServiceCoverRowID', params.ServiceCoverRowID);
        }
        if (this.pageParams.parentMode === 'CallOut') {
            this.tdMenuDisplay = false;
        }
        if (params.ContractTypeCode === 'C') {
            this.contractLabel = 'Contract Number';
        } else if (params.ContractTypeCode === 'J') {
            this.contractLabel = 'Job Number';
        } else if (params.ContractTypeCode === 'P') {
            this.contractLabel = 'Product Sale Number';
        }
        this.pageTitle = params.currentContractTypeURLParameter ? params.currentContractTypeURLParameter + ' Service Detail' : this.pageParams.currentContractTypeURLParameter;
        this.buildTableColumns();
    }

}
