import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { GridComponent } from './../../../shared/components/grid/grid';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ErrorCallback } from './../../base/Callback';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSAServiceCoverSeasonGrid.html'
})

export class ServiceCoverSeasonGridComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy, ErrorCallback {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('serviceCoverSeasonGrid') serviceCoverSeasonGrid: GridComponent;
    @ViewChild('typesDropdown') typesDropdown: DropdownStaticComponent;
    public pageId: string = '';
    public controls: Array<any> = [
        { name: 'ContractNumber', disabled: true },
        { name: 'ContractName', disabled: true },
        { name: 'PremiseNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', disabled: true },
        { name: 'ProductCode', disabled: true },
        { name: 'ProductDesc', disabled: true },
        { name: 'UpdateBranchInd', disabled: true },
        { name: 'ServiceCoverRowID' },
        { name: 'ServiceCoverNumber' },
        { name: 'ShowType' }
    ];
    private readonly muleConfig: any = {
        method: 'service-planning/maintenance',
        module: 'template',
        operation: 'Application/iCABSAServiceCoverSeasonGrid'
    };
    private pageData: any = {};
    public gridParams: any = {
        totalRecords: 0,
        maxColumn: 6,
        itemsPerPage: 10,
        currentPage: 1,
        riGridMode: 0,
        riGridHandle: 14287856,
        riSortOrder: 'Descending',
        HeaderClickedColumn: ''
    };
    public gridSortHeaders: Array<any> = [];
    public types: Array<any> = [
        { text: 'All', value: 'All' },
        { text: 'Past Seasons', value: 'Past' },
        { text: 'From Current', value: 'Current' },
        { text: 'Future', value: 'Future' }
    ];
    public options: Array<any> = [
        { text: 'Options', value: '' },
        { text: 'Add Season', value: 'AddSeason' },
        { text: 'Duplicate Seasons', value: 'Duplicate' }
    ];
    public optionsDefault: Array<any> = [{ text: 'Options', value: '' }];
    private mode: string;
    public validateProperties: Array<any> = [{
        'type': MntConst.eTypeInteger,
        'index': 0
    }, {
        'type': MntConst.eTypeDate,
        'index': 1
    }, {
        'type': MntConst.eTypeInteger,
        'index': 2
    }, {
        'type': MntConst.eTypeDate,
        'index': 3
    }, {
        'type': MntConst.eTypeInteger,
        'index': 4
    }, {
        'type': MntConst.eTypeInteger,
        'index': 5
    }];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERSEASONGRID;
        this.pageTitle = this.browserTitle = 'Service Cover Seasons';
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public ngAfterViewInit(): void {
        this.typesDropdown.selectedItem = 'Current';
        this.onTypeChange('Current');
        this.parentMode = this.riExchange.getParentMode();

        this.setErrorCallback(this);

        this.disableControl('ContractName', true);
        this.disableControl('PremiseName', true);
        this.disableControl('ProductDesc', true);

        if (this.parentMode === 'ServiceCover') {
            this.riExchange.getParentHTMLValue('ContractNumber');
            this.riExchange.getParentHTMLValue('PremiseNumber');
            this.riExchange.getParentHTMLValue('ProductCode');
            this.riExchange.getParentHTMLValue('ServiceCoverRowID');
            this.disableControl('ContractNumber', true);
            this.disableControl('PremiseNumber', true);
            this.disableControl('ProductCode', true);
        }
        this.fetchData();
        let sortAnnualSeasonCode: any = {
            'fieldName': 'AnnualSeasonCode',
            'colName': 'Annual Season Code',
            'sortType': 'ASC'
        };
        let fromDate: any = {
            'fieldName': 'FromDate',
            'colName': 'From Date',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(sortAnnualSeasonCode);
        this.gridSortHeaders.push(fromDate);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data.msg || data.errorMessage, title: 'Error' }, false);
    }

    public fetchData(): void {
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        let formData: any = {};

        searchParams.set(this.serviceConstants.Action, '0');
        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formData['ProductCode'] = this.getControlValue('ProductCode');
        formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        formData[this.serviceConstants.Function] = 'SetDisplayFields';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method,
            this.muleConfig.module,
            this.muleConfig.operation,
            searchParams,
            formData).subscribe(data => {
                this.pageData = data;
                this.populateForm();
                this.buildMenuOptions();
                this.loadGrid();
            }, error => {
                this.logger.log(error);
                this.errorService.emitError({
                    msg: MessageConstant.Message.GeneralError
                });
            });
    }

    public populateForm(): void {
        for (let key in this.pageData) {
            if (!key) {
                continue;
            }
            let value: any = this.pageData[key] ? this.pageData[key].trim() : this.pageData[key];
            this.setControlValue(key, value);
        }
    }

    private buildMenuOptions(): void {
        if (this.getControlValue('UpdateBranchInd') && this.getControlValue('ProductCode')) {
            this.options = this.optionsDefault;
        }
    }

    public loadGrid(): void {
        let gridQuery: URLSearchParams = this.getURLSearchParamObject();
        let gridInputParams: any;
        let bodyParams: any = {};

        gridInputParams = this.muleConfig;

        gridQuery.set(this.serviceConstants.Action, '2');
        gridQuery.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        gridQuery.set(this.serviceConstants.GridHandle, this.gridParams.riGridHandle);
        gridQuery.set(this.serviceConstants.GridSortOrder, this.gridParams.riSortOrder);
        gridQuery.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
        gridQuery.set(this.serviceConstants.PageCurrent, this.gridParams.currentPage);
        gridQuery.set(this.serviceConstants.GridHeaderClickedColumn, this.gridParams.HeaderClickedColumn);
        gridQuery.set(this.serviceConstants.GridSortOrder, this.gridParams.riSortOrder);
        gridQuery.set(this.serviceConstants.ContractNumber, this.getControlValue('ContractNumber'));
        gridQuery.set(this.serviceConstants.PremiseNumber, this.getControlValue('PremiseNumber'));
        gridQuery.set('ProductCode', this.getControlValue('ProductCode'));
        gridQuery.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber'));
        gridQuery.set('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
        gridQuery.set('ShowType', this.getControlValue('ShowType'));

        gridInputParams.search = gridQuery;

        this.serviceCoverSeasonGrid.loadGridData(gridInputParams);
    }

    public onTypeChange(data: any): void {
        this.setControlValue('ShowType', data);
    }

    public onMenuChange(data: any): void {
        if (!data) {
            return;
        }
        switch (data) {
            case 'AddSeason':
                this.addSeason();
                break;
            case 'Duplicate':
                this.duplicateSeason();
                break;
        }
    }

    public addSeason(): void {
        this.navigate('GridSeasonAdd', InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERSEASONMAINTENANCE);
    }

    public duplicateSeason(): void {
        let duplicateSeasonParams: URLSearchParams = this.getURLSearchParamObject();
        let bodyParams: any = {};

        duplicateSeasonParams.set(this.serviceConstants.Action, '0');

        bodyParams[this.serviceConstants.Function] = 'DuplicateSeasons';
        bodyParams['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method,
            this.muleConfig.module,
            this.muleConfig.operation,
            duplicateSeasonParams,
            bodyParams).subscribe(data => {
                if (data.errorMessage) {
                    this.errorService.emitError({
                        msg: data.errorMessage
                    });
                    return;
                }
                this.loadGrid();
            }, error => {
                this.logger.log(error);
                this.errorService.emitError({
                    msg: MessageConstant.Message.GeneralError
                });
            });
    }

    public refresh(): void {
        this.gridParams.currentPage = 1;
        this.loadGrid();
    }

    public getCurrentPage(curPage: any): void {
        this.gridParams.currentPage = curPage ? curPage.value : this.gridParams.currentPage;
        this.loadGrid();
    }

    public getGridInfo(info: any): void {
        let gridTotalItems = this.gridParams.itemsPerPage;
        if (info) {
            this.gridParams.totalRecords = info.totalRows;
        }
    }

    public onRowSelect(data: any): void {
        let cellData: any = data.cellData;
        this.setAttribute('ServiceCoverSeasonROWID', cellData.rowID);
        switch (cellData.additionalData) {
            case 'TRUE':
                this.mode = 'GridSeasonUpdate';
                break;
            case 'FALSE':
                this.mode = 'GridSeasonView';
                if (this.getControlValue('UpdateBranchInd')) {
                    this.mode = 'GridSeasonViewFollowsTemplate';
                }
                break;
        }

        this.navigate(this.mode, InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERSEASONMAINTENANCE, {
            'ServiceCoverSeasonROWID': cellData.rowID
        });
    }

    public sortGrid(data: any): void {
        this.gridParams.HeaderClickedColumn = data.fieldname;
        this.gridParams.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGrid();
    }
}
