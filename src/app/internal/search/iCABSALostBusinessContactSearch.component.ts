import { Component, OnInit, OnDestroy, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { TableComponent } from './../../../shared/components/table/table';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { URLSearchParams } from '@angular/http';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSALostBusinessContactSearch.html'
})

export class LostBusinessContactSearchComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('riTable') riTable: TableComponent;

    public queryParams: any = {
        operation: 'Application/iCABSALostBusinessContactSearch',
        module: 'retention',
        method: 'ccm/search'
    };

    public controls = [
        { name: 'ContractNumber', disabled: true },
        { name: 'ContractName', disabled: true },
        { name: 'PremiseNumber', disabled: true },
        { name: 'PremiseName', disabled: true },
        { name: 'ProductCode', disabled: true },
        { name: 'ProductDesc', disabled: true },
        { name: 'LostBusinessRequestNumber', disabled: true },
        { name: 'ServiceCoverRowID' }
    ];

    //local variables
    public pageId: string = '';

    //table component variables
    public search = new URLSearchParams();
    public columns: Array<any>;
    public itemsPerPage: string = '10';
    public page: string = '1';
    public pageSize: string = '10';
    public inputParams: any = {};
    public rowmetadata: Array<any> = new Array();

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSALOSTBUSINESSCONTACTSEARCH;
        this.browserTitle = 'Client Retention Contact Search';
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.window_onload();
        }
    }

    ngAfterViewInit(): void {
        this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public window_onload(): void {

        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber') ? this.riExchange.getParentHTMLValue('PremiseNumber') : '');
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode') ? this.riExchange.getParentHTMLValue('ProductCode') : '');
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.setControlValue('LostBusinessRequestNumber', this.riExchange.getParentHTMLValue('LostBusinessRequestNumber'));
        this.setControlValue('ServiceCoverRowID', this.riExchange.getParentAttributeValue('ServiceCoverRowID'));

        if (this.riExchange.URLParameterContains('ContractHistory')) {
            this.pageParams.trAddButton = false;
        }
        else {
            this.pageParams.trAddButton = true;
        }
        if (!(this.getControlValue('ProductCode') === '')) {
            this.pageParams.trPremise = true;
            this.pageParams.trProduct = true;
        }
        else if (!(this.getControlValue('PremiseNumber') === '')) {
            this.pageParams.trPremise = true;
            this.pageParams.trProduct = false;
        }
        else {
            this.pageParams.trPremise = false;
            this.pageParams.trProduct = false;
        }

        this.buildTableColumns();

    }

    public buildTableColumns(): void {

        this.riTable.clearTable();
        this.riTable.AddTableField('LostBusinessContactNumber', MntConst.eTypeInteger, 'Key', 'Contact Number', 6, MntConst.eAlignmentRight);
        this.riTable.AddTableField('ContactDate', MntConst.eTypeDate, 'Required', 'Contact Date', 10, MntConst.eAlignmentLeft);
        this.riTable.AddTableField('LBContactTypeDesc', MntConst.eTypeText, 'Virtual', 'Contact Type', 20, MntConst.eAlignmentLeft);
        this.riTable.AddTableField('LBContactOutcomeDesc', MntConst.eTypeText, 'Virtual', 'Contact Type', 20, MntConst.eAlignmentLeft);
        this.buildTable();

    }

    public buildTable(): void {

        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.search.set('LostBusinessRequestNumber', this.getControlValue('LostBusinessRequestNumber'));
        this.queryParams.search = this.search;
        this.riTable.loadTableData(this.queryParams);

    }

    public tableRowClick(event: any): void {

        this.pageParams.parentMode = this.parentMode;
        let lostBusinessRequestNumber = event.row.LostBusinessContactNumber;
        let returnObj = {
            'LostBusinessRequestNumber': lostBusinessRequestNumber,
            'row': event.row
        };

        switch (this.pageParams.parentMode) {
            case 'Request':
                if (this.riExchange.URLParameterContains('ContractHistory')) {
                    this.navigate('Search', InternalMaintenanceApplicationModuleRoutes.ICABSALOSTBUSINESSCONTACTMAINTENANCE, {
                        'ContractHistory': '',
                        'LostBusinessContactNumber': event.row.LostBusinessContactNumber
                    });
                    break;
                }
                this.navigate('Search', InternalMaintenanceApplicationModuleRoutes.ICABSALOSTBUSINESSCONTACTMAINTENANCE, {
                    'LostBusinessContactNumber': event.row.LostBusinessContactNumber
                });
                break;
            case 'LookUp':
                this.riExchange.setParentHTMLValue('LostBusinessContactNumber', returnObj.LostBusinessRequestNumber);
                break;
            default:
                this.riExchange.setParentHTMLValue('LostBusinessContactNumber', returnObj.LostBusinessRequestNumber);
                break;
        }
    }

    public addContact(): void {
        this.navigate('SearchAdd', InternalMaintenanceApplicationModuleRoutes.ICABSALOSTBUSINESSCONTACTMAINTENANCE);
    }

}
