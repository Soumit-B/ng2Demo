import { InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { Subscription } from 'rxjs/Subscription';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { Observable } from 'rxjs';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { InternalGridSearchModuleRoutes, AppModuleRoutes, InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSAPremiseLocationAllocationGrid.html'
})

export class PremiseLocationAllocationGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('gridOptionSelectDropdown') gridOptionSelectDropdown: DropdownStaticComponent;
    @ViewChild('menuOptionSelectDropdown') menuOptionSelectDropdown: DropdownStaticComponent;
    @ViewChild('premiseAllocationGrid') premiseAllocationGrid: GridComponent;
    @ViewChild('premiseAllocationGridPagination') premiseAllocationGridPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('productCodeSearchEllipsis') productCodeSearchEllipsis: EllipsisComponent;
    @ViewChild('errorModal') public errorModal;
    public observer: any;
    public updateMode: boolean = false;
    public stopExit: boolean = false;
    public gridOptions: Array<any> = [{}];
    public gridSortHeaders: Array<any> = [];
    private isSortedClick: boolean = false;
    public headerClickedColumn: string = '';
    public canDeactivateObservable: Observable<boolean>;
    public isDisplayErrorRequired: boolean = true;
    public riSortOrder: string = '';
    public tableTitle: string = '';
    public gridOptionsDisabled: boolean = false;
    public menuOptions: Array<any> = [{}];
    public menuOptionsDisabled: boolean = false;
    public productEllipsisDisable: boolean = false;
    private querySysChar: URLSearchParams = new URLSearchParams();
    public pageId: string = '';
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 0;
    public search = new URLSearchParams();
    public autoOpen: any = '';
    public autoOpenSearch: boolean = false;
    private riGrid: any = {};
    public showHeader: boolean = true;
    public currDate: Date = new Date();
    public currentContractType: string = '';
    public validateProperties: Array<any> = [];
    private rowData: any = {};
    public hiddenMode: any = {
        'labelIncludeInactive': true,
        'productDetails': false,
        'grdContractInformation1': false,
        'menu': false,
        'gridOption': false,
        'atDate': false
    };
    public serviceCoverSearchComponent = ServiceCoverSearchComponent;
    public inputParamsServiceCover: any = {
        'parentMode': 'LookUp-ServiceCoverProd',
        'currentContractTypeURLParameter': 'Contract',
        'ContractNumber': '',
        'ContractName': '',
        'PremiseNumber': '',
        'PremiseName': ''
    };
    public showCloseButton: boolean = true;
    private isDisplayLevelInd: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public columnIndex: any = {
        EffectiveDate: 0,
        ProductCodeGrid: 0,
        ProcessedDateTime: 0,
        PremiseLocationNumber: 0,
        PremiseLocationSequence: 1,
        PremiseLocationDesc: 0,
        ProductDescGrid: 0,
        ServiceVisitFrequency: 0,
        UnallocatedQuantity: 0,
        QuantityAtLocation: 0,
        Allocated: 0,
        FutureChange: 0,
        UserCode: 0,
        ActivePortfolio: 0
    };
    public isExistColumn: any = {
        EffectiveDate: false,
        ProductCodeGrid: false,
        ProcessedDateTime: false,
        PremiseLocationNumber: false,
        PremiseLocationSequence: false,
        PremiseLocationDesc: false,
        ProductDescGrid: false,
        ServiceVisitFrequency: false,
        UnallocatedQuantity: false,
        QuantityAtLocation: false,
        Allocated: false,
        FutureChange: false,
        UserCode: false,
        ActivePortfolio: false
    };
    // Legend
    public legend = [
        { label: 'Empty Locations', color: '#CCFFCC' },
        { label: 'UNALLOCATED', color: '#FFCCCC' },
        { label: 'In Hold', color: '#FFFFCC' },
        { label: 'Located', color: '#E8F4F6' }
    ];
    public riExchangeMode: string = '';
    private lookUpSubscription: Subscription;
    public queryParams: any = {
        operation: 'Application/iCABSAPremiseLocationAllocationGrid',
        module: 'locations',
        method: 'service-delivery/maintenance'
    };
    public controls = [
        { name: 'ContractNumber', readonly: false, disabled: false, required: false, value: '' },
        { name: 'ContractName', readonly: false, disabled: false, required: false, value: '' },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: true, value: '' },
        { name: 'PremiseName', readonly: false, disabled: false, required: false, value: '' },
        { name: 'ProductCode', readonly: false, disabled: false, required: false, value: '' },
        { name: 'ProductDesc', readonly: false, disabled: false, required: false, value: '' },
        { name: 'AtDate', readonly: false, disabled: false, required: false, value: '' },
        { name: 'GridOption', readonly: false, disabled: false, required: false, value: '' },
        { name: 'IncludeInactive', readonly: false, disabled: false, required: false, value: '' },
        { name: 'menu', readonly: false, disabled: false, required: false, value: '' },
        { name: 'PremiseLocationNumber', readonly: false, disabled: false, required: false, value: '' },
        { name: 'PremiseLocationDesc', readonly: false, disabled: false, required: false, value: '' },
        { name: 'TransferQuantity', readonly: false, disabled: false, required: false, value: '' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPREMISELOCATIONALLOCATIONGRID;
    }


    /**
     *  Load system characters
     */
    private loadSystemCharacters(): void {
        let sysNumbers = this.sysCharConstants.SystemCharEnableLocations;
        this.lookUpSubscription = this.fetchSysChar(sysNumbers).subscribe((data) => {
            try {
                if (data.records[0]) {
                    this.pageParams.vSCEnableDetailLocations = data.records[0].Logical;
                    this.pageParams.vBlank = data.records[0].Logical;
                }
                this.setUI();
            } catch (e) {
                this.logger.warn('System variable response error' + e);
            }
        });
    }

    /*** Method to get system characters for ProspectMaintenance
    * @params field- systemchars variables looking for  and type- L,R,I
    */
    public fetchSysChar(sysCharNumbers: any): any {
        this.querySysChar.set(this.serviceConstants.Action, '0');

        if (this.utils.getBusinessCode()) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        } else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.businessCode());
        }
        if (this.utils.getCountryCode()) {
            this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        } else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.countryCode());
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    }

    /**
     * Datepicker select method
     */
    public atDateSelectedValue(event: any): void {
        this.uiForm.controls['AtDate'].setValue(event.value);
        this.currentPage = 1;
        this.isSortedClick = false;
        this.buildGrid();
    }

    /**
     * Initilialize page state
     */
    private initData(): void {
        this.pageParams.parentMode = this.riExchange.getParentMode();
        this.pageParams.labelatDate = 'As At Date';
        this.pageParams.titles = {
            'Title1': 'Premises Allocation',
            'Title2': 'Location Search',
            'Title3': 'System Allocation',
            'TableTitle1': 'Premises Details'
        };
        this.createGridOptions();
        this.createMenuOptions();
        this.loadSystemCharacters();
        this.setErrorCallback(this);

    }

    public setUI(): void {
        this.pageParams.CurrentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.CurrentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
        if (this.pageParams.parentMode === 'Verification' || this.pageParams.parentMode === 'NewLocationGrid' || this.pageParams.parentMode === 'Premise-Allocate') {
            this.pageParams.tempSource = 'Premise-Allocate';
        } else {
            this.pageParams.tempSource = this.pageParams.parentMode;
        }
        switch (this.pageParams.parentMode) {
            case 'Verification':
                this.attributes.ServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID');
                break;
            case 'Move-From':
            case 'Move-To':
                this.attributes.ServiceCoverRowID = this.riExchange.getParentAttributeValue('ContractNumberServiceCoverRowID');
                break;
            case 'ServiceCover-Increase':
                this.attributes.ServiceCoverRowID = this.riExchange.getParentAttributeValue('ContractNumberServiceCoverRowID');
                this.attributes.ServiceCoverQuantityChange = this.riExchange.getParentAttributeValue('ContractNumberQuantityChange');
                this.attributes['ContractNumberAmendedServiceCoverRowID'] = this.attributes.ServiceCoverRowID;
                this.attributes['ContractNumberServiceCoverQuantityChange'] = this.attributes.ServiceCoverQuantityChange;
                break;
            case 'NewLocationGrid':
                this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentAttributeValue('ContractNumber'));
                this.uiForm.controls['ContractName'].setValue(this.riExchange.getParentAttributeValue('ContractName'));
                this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentAttributeValue('PremiseNumber'));
                this.uiForm.controls['PremiseName'].setValue(this.riExchange.getParentAttributeValue('PremiseName'));
                break;
            default:
                break;
        }
        if (this.pageParams.tempSource === 'Premise-Allocate' || this.pageParams.tempSource === 'ServiceCover-Increase') {
            this.hiddenMode.labelIncludeInactive = false;
        }
        switch (this.pageParams.parentMode) {
            case 'Verification':
                this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentHTMLValue('ContractNumber'));
                this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.pageParams.titleSuffix = this.pageParams.CurrentContractTypeLabel;
                this.pageTitle = this.pageParams.titles['TableTitle1'];
                this.hiddenMode.productDetails = true;
                this.setNamesFromId(this.uiForm.controls['ContractNumber'].value, this.uiForm.controls['PremiseNumber'].value);
                break;
            case 'Premise-Allocate':
            case 'ServiceCover-Increase':
            case 'Premise-Add':
                this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentHTMLValue('ContractNumber'));
                this.uiForm.controls['ContractName'].setValue(this.riExchange.getParentHTMLValue('ContractName'));
                this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.uiForm.controls['PremiseName'].setValue(this.riExchange.getParentHTMLValue('PremiseName'));
                this.tableTitle = this.pageParams.CurrentContractTypeLabel + ' ' + this.pageParams.titles['TableTitle1'];
                this.pageTitle = this.pageParams.CurrentContractTypeLabel + ' ' + this.pageParams.titles['Title1'];
                if (this.pageParams.parentMode === 'ServiceCover-Increase') {
                    this.hiddenMode.productDetails = true;
                } else {
                    this.hiddenMode.productDetails = false;
                    this.uiForm.controls['ProductDesc'].disable();
                }
                this.hiddenMode.labelIncludeInactive = false;
                break;
            case 'Product-Allocate':
            case 'Move-From':
            case 'Move-To':
                if (this.uiForm.controls['ContractNumber'].value === '')
                    this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentHTMLValue('ContractNumber'));
                if (this.uiForm.controls['ContractName'].value === '')
                    this.uiForm.controls['ContractName'].setValue(this.riExchange.getParentHTMLValue('ContractName'));
                if (this.uiForm.controls['PremiseNumber'].value === '')
                    this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
                if (this.uiForm.controls['PremiseName'].value === '')
                    this.uiForm.controls['PremiseName'].setValue(this.riExchange.getParentHTMLValue('PremiseName'));
                if (this.uiForm.controls['ProductCode'].value === '')
                    this.uiForm.controls['ProductCode'].setValue(this.riExchange.getParentHTMLValue('ProductCode'));
                if (this.uiForm.controls['ProductDesc'].value === '')
                    this.uiForm.controls['ProductDesc'].setValue(this.riExchange.getParentHTMLValue('ProductDesc'));
                this.pageTitle = this.pageParams.CurrentContractTypeLabel + ' ' + this.pageParams.titles['Title2'];
                this.tableTitle = this.pageParams.CurrentContractTypeLabel + ' ' + this.pageParams.titles['TableTitle1'];
                this.uiForm.controls['ProductCode'].disable();
                this.uiForm.controls['ProductDesc'].disable();
                this.productEllipsisDisable = true;
                this.hiddenMode.productDetails = false;

                break;
            case 'ServiceCoverDetailsAllocate':
                this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentHTMLValue('ContractNumber'));
                this.uiForm.controls['ContractName'].setValue(this.riExchange.getParentHTMLValue('ContractName'));
                this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.uiForm.controls['PremiseName'].setValue(this.riExchange.getParentHTMLValue('PremiseName'));
                this.uiForm.controls['ProductCode'].setValue(this.riExchange.getParentHTMLValue('ProductCode'));
                this.uiForm.controls['ProductDesc'].setValue(this.riExchange.getParentHTMLValue('ProductDesc'));
                this.uiForm.controls['ProductCode'].disable();
                this.uiForm.controls['ProductDesc'].disable();
                this.productEllipsisDisable = true;
                this.tableTitle = this.pageParams.CurrentContractTypeLabel + ' ' + this.pageParams.titles['TableTitle1'];
                break;
            default:
                //Value for the below controls are already populated in above for parent mode 'NewLocationGrid'
                if (this.pageParams.parentMode !== 'NewLocationGrid') {
                    this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentHTMLValue('ContractNumber'));
                    this.uiForm.controls['ContractName'].setValue(this.riExchange.getParentHTMLValue('ContractName'));
                    this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
                    this.uiForm.controls['PremiseName'].setValue(this.riExchange.getParentHTMLValue('PremiseName'));
                }
                this.uiForm.controls['ProductCode'].setValue(this.riExchange.getParentHTMLValue('ProductCode'));
                this.uiForm.controls['ProductDesc'].setValue(this.riExchange.getParentHTMLValue('ProductDesc'));
                this.setNamesFromId(this.uiForm.controls['ContractNumber'].value, this.uiForm.controls['PremiseNumber'].value);
                this.productCodeOnChange(this.uiForm.controls['ProductCode'].value);
                this.tableTitle = this.pageParams.CurrentContractTypeLabel + ' ' + this.pageParams.titles['TableTitle1'];
                break;
        }

        if (this.pageParams.parentMode === 'Move-From' || this.pageParams.parentMode === 'Move-To' || this.pageParams.parentMode === 'LookUp') {
            this.hiddenMode.atDate = true;
            this.hiddenMode.gridOption = true;
            this.hiddenMode.menu = true;
        }
        this.uiForm.controls['ContractNumber'].disable();
        this.uiForm.controls['ContractName'].disable();
        this.uiForm.controls['PremiseNumber'].disable();
        this.uiForm.controls['PremiseName'].disable();
        if (this.riExchange.getParentAttributeValue('ContractNumberDefaultEffectiveDate')) {
            this.attributes['ContractNumberDefaultEffectiveDate'] = this.riExchange.getParentAttributeValue('ContractNumberDefaultEffectiveDate');
            this.attributes['ContractNumberDefaultEffectiveDateProduct'] = this.riExchange.getParentAttributeValue('ContractNumberDefaultEffectiveDate');
        }
        if (this.pageParams.vSCEnableDetailLocations) {
            this.hiddenMode.gridOption = true;
            this.hiddenMode.atDate = true;
        }
        this.inputParamsServiceCover.currentContractTypeURLParameter = this.pageParams.CurrentContractType;
        this.inputParamsServiceCover.ContractNumber = this.uiForm.controls['ContractNumber'].value;
        this.inputParamsServiceCover.ContractName = this.uiForm.controls['ContractName'].value;
        this.inputParamsServiceCover.PremiseNumber = this.uiForm.controls['PremiseNumber'].value;
        this.inputParamsServiceCover.PremiseName = this.uiForm.controls['PremiseName'].value;
        this.utils.setTitle(this.pageTitle);
        this.isSortedClick = false;
        this.buildGrid();
    }

    /**
     *  Service call method to get contract/Premise name from numbers
     */
    private setNamesFromId(contractNumber: string, premiseNumber: string): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('ContractNumber', contractNumber);
        this.search.set('PremiseNumber', premiseNumber);
        this.search.set('Function', 'GetNames');
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(
            (data) => {
                try {
                    this.uiForm.controls['ContractName'].setValue(data.ContractName);
                    this.uiForm.controls['PremiseName'].setValue(data.PremiseName);
                } catch (error) {
                    this.logger.warn(error);
                }

            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    /**
     * Create options vallues for GridOptions dropdown
     */
    private createGridOptions(): void {
        this.gridOptions = [
            { text: 'Summary', value: 'Summary' },
            { text: 'Detail', value: 'Detail' }
        ];
    }
    /**
     * Gridoption onchange method
     */
    public menuOptionsChange(event: any): void {
        this.uiForm.controls['menu'].setValue(event);
        switch (event) {
            case 'AddLocation':
                this.isDisplayErrorRequired = false;
                this.addLocationClick();
                break;
            case 'Move':
                this.isDisplayErrorRequired = false;
                this.moveLocationClick();
                break;
            case 'Empty':
                this.isDisplayErrorRequired = false;
                this.emptyLocationClick();
                break;
            default:
                break;
        }
    }

    /**
     * Method click add location
     */
    private addLocationClick(): void {
        if (this.pageParams.parentMode === 'Premise-Allocate' || this.pageParams.parentMode === 'Verification'
            || this.pageParams.parentMode === 'ServiceCover-Increase') {
            this.riExchangeMode = 'PremiseAllocateAdd';
        } else {
            this.riExchangeMode = 'ProductAllocateAdd';
        }
        // Navigate to  WindowPath="/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAPremiseLocationMaintenance.htm<bottom>" + CurrentContractTypeURLParameter
        this.navigate(this.riExchangeMode, InternalMaintenanceApplicationModuleRoutes.ICABSAPREMISELOCATIONMAINTENANCE, {
            'ContractNumber': this.uiForm.controls['ContractNumber'].value,
            'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
            'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeUrlParam()
        });
        if (this.pageParams.parentMode === 'Product-Allocate') {
            this.onGridRowDblClick(null);
        }
    }
    /**
     * Method click move location
     */
    private moveLocationClick(): void {
        if (this.pageParams.parentMode !== 'Product-Allocate' || this.pageParams.parentMode !== 'Move-From'
            || this.pageParams.parentMode !== 'Move-To') {
            this.riExchangeMode = this.pageParams.parentMode;
            this.navigate(this.riExchangeMode, InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERLOCATIONMOVEMAINTENANCE, {
                ContractNumber: this.riExchange.getParentAttributeValue('ContractNumber'),
                ContractName: this.riExchange.getParentAttributeValue('ContractName'),
                PremiseNumber: this.riExchange.getParentAttributeValue('PremiseNumber'),
                PremiseName: this.riExchange.getParentAttributeValue('PremiseName'),
                ProductCode: this.riExchange.getParentAttributeValue('ProductCode'),
                ProductDesc: this.riExchange.getParentAttributeValue('ProductDesc'),
                currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeUrlParam()
                //ServiceCoverRowID: this.riExchange.getParentAttributeValue('ServiceCoverRowID')
            });
            //navigate to WindowPath="/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceCoverLocationMoveMaintenance.htm<tall>" + CurrentContractTypeURLParameter
        }
    }
    /**
     * Method click empty location
     */
    private emptyLocationClick(): void {
        this.riExchangeMode = this.pageParams.parentMode;
        this.navigate(this.riExchangeMode, InternalGridSearchSalesModuleRoutes.ICABSAEMPTYPREMISELOCATIONSEARCHGRID);
        //navigate to  WindowPath="/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAEmptyPremiseLocationSearchGrid.htm<bottom>" + CurrentContractTypeURLParameter
    }
    /**
     * Create options vallues for GridOptions dropdown
     */
    private createMenuOptions(): void {
        this.menuOptions = [
            { text: 'Options', value: 'Options' },
            { text: 'Add Location', value: 'AddLocation' },
            { text: 'Transfer', value: 'Move' },
            { text: 'Maintain Locations', value: 'Empty' }
        ];
    }
    /**
     * Gridoption onchange method
     */
    public gridOptionsChange(event: any): void {
        this.uiForm.controls['GridOption'].setValue(event);
        switch (event) {
            case 'Summary':
                this.pageParams.labelatDate = 'As At Date';
                break;
            case 'Detail':
                this.pageParams.labelatDate = 'Include From Date';
                break;
            default:
                break;

        }
        this.currentPage = 1;
        this.isSortedClick = false;
        this.buildGrid();
    }
    /**
     * IncludeInactive checkbox click
     */
    public setIncludeInactive(checkedVal: any): void {
        this.uiForm.controls['IncludeInactive'].setValue(checkedVal);
        this.currentPage = 1;
        this.isSortedClick = false;
        this.buildGrid();
    }

    /**
     * Product code change method
     */
    public productCodeOnChange(pcode: any): void {
        if (this.uiForm.controls['ContractNumber'].value && this.uiForm.controls['PremiseNumber'].value && this.uiForm.controls['ProductCode'].value) {
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '0');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
            this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
            this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
            this.search.set('Function', 'GetPremiseDetails');
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());

            this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(
                (data) => {
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                        this.uiForm.controls['ProductDesc'].setValue('');
                    } else {
                        try {
                            this.uiForm.controls['ProductDesc'].setValue(data.ProductDesc);
                        } catch (error) {
                            this.logger.warn(error);
                        }
                    }

                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );
        } else {
            this.uiForm.controls['ProductDesc'].setValue('');
        }
    }

    /**
     * Build grid structure
     */
    private buildGrid(): void {
        this.premiseAllocationGrid.update = true;
        if (this.isSortedClick === false)
            this.setMaxColumn();
        let includeInactive = 'False';
        if (this.uiForm.controls['IncludeInactive'].value === true) {
            includeInactive = 'True';
        }
        if (this.uiForm.controls['ContractNumber'].value !== '' && this.uiForm.controls['PremiseNumber'].value !== '') {
            this.search = new URLSearchParams();
            if (this.updateMode === true) {
                for (let p in this.columnIndex) {
                    if (this.columnIndex.hasOwnProperty(p)) {
                        //UserCode should be passed later
                        if (this.rowData[this.columnIndex[p]] && this.isExistColumn[p] === true && p !== 'Allocated' && p !== 'UserCode') {
                            this.search.set(p, this.rowData[this.columnIndex[p]].text);
                        }
                    }
                }
                this.search.set('PremiseLocationSequence', this.attributes.PremiseLocationSequence);
                this.search.set('PremiseLocationNumberRowID', this.attributes.PremiseLocationNumberRowID);
                this.search.set('PremiseLocationSequenceRowID', this.attributes.PremiseLocationSequenceRowID);
                this.search.set('PremiseLocationRowID', this.attributes.PremiseLocationRowID);
                this.rowData = {};
            } else {
                this.search.set('PremiseLocationRowID', this.pageParams.PremiseLocationRowID || '');
            }
            this.search.set(this.serviceConstants.Action, '2');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
            this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
            this.search.set('ContractTypeCode', this.pageParams.CurrentContractType);
            this.search.set('AtDate', this.uiForm.controls['AtDate'].value);
            this.search.set('GridOption', this.uiForm.controls['GridOption'].value);
            this.search.set('Source', this.pageParams.tempSource);
            this.search.set('IncludeInactive', includeInactive);
            this.search.set('ServiceCoverRowID', this.pageParams.ServiceCoverRowID || '');
            this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
            if (this.updateMode === true) {
                this.search.set(this.serviceConstants.GridMode, '3');
            }
            else {
                this.search.set(this.serviceConstants.GridMode, '0');
            }
            // set grid building parameters
            this.search.set(this.serviceConstants.GridHandle, '0');
            this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
            this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
            this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClickedColumn);
            this.search.set(this.serviceConstants.GridSortOrder, this.riSortOrder);
            this.queryParams.search = this.search;
            this.premiseAllocationGrid.loadGridData(this.queryParams);
        }
    }

    public refresh(): void {
        this.currentPage = this.currentPage ? this.currentPage : 1;
        this.isSortedClick = false;
        this.buildGrid();
    }

    public getGridInfo(info: any): void {
        this.premiseAllocationGridPagination.totalItems = info.totalRows;
        setTimeout(() => {
            let obj = document.querySelectorAll('.gridtable tbody > tr > td:nth-child(' + this.columnIndex.PremiseLocationSequence + ') >div>input[type=text]');
            for (let index = 0; index < obj.length; index++)
                obj[index].setAttribute('readonly', 'true');
        }, 500);

        if (this.updateMode === true) {
            this.updateMode = false;
            this.buildGrid();
        }
    }

    public sortGrid(data: any): void {
        this.headerClickedColumn = data.fieldname;
        this.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.isSortedClick = true;
        this.buildGrid();
    }

    /**
     * Set maxColumn before build grid
     */
    private setMaxColumn(): void {
        this.maxColumn = 0;
        this.columnIndex.ProductCodeGrid = 3;
        this.columnIndex.ProcessedDateTime = 3;
        this.columnIndex.PremiseLocationNumber = 0;
        this.columnIndex.PremiseLocationSequence = 1;
        this.columnIndex.PremiseLocationDesc = 2;
        this.columnIndex.ProductDescGrid = 0;
        this.columnIndex.ServiceVisitFrequency = 0;
        this.columnIndex.UnallocatedQuantity = 0;
        this.columnIndex.QuantityAtLocation = 0;
        this.columnIndex.Allocated = 0;
        this.columnIndex.FutureChange = 0;
        this.columnIndex.UserCode = 0;
        this.columnIndex.ActivePortfolio = 0;
        this.gridSortHeaders = [];
        this.validateProperties = [];
        this.isExistColumn.ProductCodeGrid = false;
        this.isExistColumn.ProcessedDateTime = false;
        this.isExistColumn.PremiseLocationNumber = false;
        this.isExistColumn.PremiseLocationSequence = false;
        this.isExistColumn.PremiseLocationDesc = false;
        this.isExistColumn.ProductDescGrid = false;
        this.isExistColumn.ServiceVisitFrequency = false;
        this.isExistColumn.UnallocatedQuantity = false;
        this.isExistColumn.QuantityAtLocation = false;
        this.isExistColumn.Allocated = false;
        this.isExistColumn.FutureChange = false;
        this.isExistColumn.UserCode = false;
        this.isExistColumn.ActivePortfolio = false;
        if (this.uiForm.controls['GridOption'].value === 'Detail') {
            this.maxColumn += 3;
            this.columnIndex.ProductCodeGrid++;
            this.columnIndex.ProcessedDateTime += 2;
            this.columnIndex.PremiseLocationNumber++;
            this.columnIndex.PremiseLocationSequence++;
            this.columnIndex.PremiseLocationDesc++;
            this.columnIndex.ProductDescGrid++;
            this.columnIndex.ServiceVisitFrequency++;
            this.columnIndex.UnallocatedQuantity++;
            this.columnIndex.QuantityAtLocation++;
            this.columnIndex.Allocated++;
            this.columnIndex.FutureChange++;
            this.columnIndex.UserCode += 2;
            this.columnIndex.ActivePortfolio++;
            this.isExistColumn.EffectiveDate = true;
            this.isExistColumn.UserCode = true;
            this.isExistColumn.ProcessedDateTime = true;
        }
        this.isExistColumn.PremiseLocationNumber = true;
        this.isExistColumn.PremiseLocationSequence = true;
        this.isExistColumn.PremiseLocationDesc = true;
        this.columnIndex.ProductDescGrid += 3;
        this.columnIndex.ServiceVisitFrequency += 3;
        this.columnIndex.UnallocatedQuantity += 3;
        this.columnIndex.QuantityAtLocation += 3;
        this.columnIndex.Allocated += 3;
        this.columnIndex.FutureChange += 3;
        this.columnIndex.UserCode += 3;
        this.columnIndex.ActivePortfolio += 3;
        let PremiseLocationNumberRow: any = {
            'fieldName': 'PremiseLocationNumber',
            'index': this.columnIndex.PremiseLocationNumber,
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(PremiseLocationNumberRow);
        this.maxColumn += 4;
        this.validateProperties.push(
            {
                'type': MntConst.eTypeInteger,
                'index': this.columnIndex.PremiseLocationNumber,
                'align': 'center'
            });
        this.validateProperties.push(
            {
                'type': MntConst.eTypeInteger,
                'index': this.columnIndex.PremiseLocationNumber + 1,
                'align': 'center'
            });
        this.validateProperties.push(
            {
                'type': MntConst.eTypeText,
                'index': this.columnIndex.PremiseLocationNumber + 2,
                'align': 'center'
            });
        if (this.pageParams.vSCEnableDetailLocations === false) {
            this.columnIndex.ProductDescGrid++;
            this.columnIndex.ServiceVisitFrequency += 2;
            this.columnIndex.UnallocatedQuantity += 2;
            this.columnIndex.QuantityAtLocation += 2;
            this.columnIndex.Allocated += 2;
            this.columnIndex.FutureChange += 2;
            this.columnIndex.UserCode += 2;
            this.columnIndex.ActivePortfolio += 2;
            this.isExistColumn.ProductCodeGrid = true;
            this.isExistColumn.ProductDescGrid = true;
            let ProductCodeGridRow: any = {
                'fieldName': 'ProductCodeGrid',
                'index': this.columnIndex.ProductCodeGrid,
                'sortType': 'ASC'
            };
            this.validateProperties.push(
                {
                    'type': MntConst.eTypeCode,
                    'index': this.columnIndex.ProductCodeGrid,
                    'align': 'center'
                });
            this.validateProperties.push(
                {
                    'type': MntConst.eTypeText,
                    'index': this.columnIndex.ProductCodeGrid + 1,
                    'align': 'center'
                });
            this.gridSortHeaders.push(ProductCodeGridRow);
            this.maxColumn += 2;
            this.columnIndex.ProcessedDateTime += 2;
            if (this.pageParams.CurrentContractType !== 'p') {
                this.maxColumn++;
                this.columnIndex.ProcessedDateTime++;
                this.columnIndex.UnallocatedQuantity++;
                this.columnIndex.QuantityAtLocation++;
                this.columnIndex.Allocated++;
                this.columnIndex.FutureChange++;
                this.columnIndex.UserCode++;
                this.columnIndex.ActivePortfolio++;
                this.isExistColumn.ServiceVisitFrequency = true;
                this.validateProperties.push(
                    {
                        'type': MntConst.eTypeInteger,
                        'index': this.columnIndex.ServiceVisitFrequency,
                        'align': 'center'
                    });
            }
            if (this.pageParams.parentMode !== 'Product-Allocate' && this.pageParams.parentMode !== 'Move-From'
                && this.pageParams.parentMode !== 'Move-To') {
                this.maxColumn++;
                this.columnIndex.ProcessedDateTime++;
                this.columnIndex.QuantityAtLocation++;
                this.columnIndex.Allocated++;
                this.columnIndex.FutureChange++;
                this.columnIndex.UserCode++;
                this.columnIndex.ActivePortfolio++;
                this.isExistColumn.UnallocatedQuantity = true;
                this.validateProperties.push(
                    {
                        'type': MntConst.eTypeInteger,
                        'index': this.columnIndex.UnallocatedQuantity,
                        'align': 'center'
                    });
            }
        }
        this.columnIndex.Allocated++;
        this.isExistColumn.QuantityAtLocation = true;
        this.columnIndex.FutureChange++;
        this.validateProperties.push(
            {
                'type': MntConst.eTypeInteger,
                'index': this.columnIndex.QuantityAtLocation,
                'align': 'center'
            });
        if (this.pageParams.parentMode !== 'Product-Allocate' && this.pageParams.parentMode !== 'Move-From'
            && this.pageParams.parentMode !== 'Move-To') {
            this.maxColumn++;
            this.columnIndex.ProcessedDateTime++;
            this.columnIndex.UserCode++;
            this.columnIndex.ActivePortfolio++;
            this.isExistColumn.Allocated = true;
            this.validateProperties.push(
                {
                    'type': MntConst.eTypeImage,
                    'index': this.columnIndex.Allocated,
                    'align': 'center'
                });
            if (this.uiForm.controls['GridOption'].value === 'Summary' && this.pageParams.vSCEnableDetailLocations === false) {
                this.maxColumn++;
                this.columnIndex.ProcessedDateTime++;
                this.columnIndex.UserCode++;
                this.columnIndex.ActivePortfolio++;
                this.columnIndex.FutureChange++;
                this.isExistColumn.FutureChange = true;
                this.validateProperties.push(
                    {
                        'type': MntConst.eTypeImage,
                        'index': this.columnIndex.FutureChange,
                        'align': 'center'
                    });
            }
        }
        if (this.uiForm.controls['GridOption'].value === 'Detail') {
            this.validateProperties.push(
                {
                    'type': MntConst.eTypeDate,
                    'index': 0,
                    'align': 'center'
                });
            let ProcessedDateTimeRow: any = {
                'fieldName': 'ProcessedDateTime',
                'index': this.columnIndex.ProcessedDateTime,
                'sortType': 'ASC'
            };
            this.gridSortHeaders.push(ProcessedDateTimeRow);
            this.columnIndex.UserCode++;
            this.columnIndex.ActivePortfolio += 2;
            this.validateProperties.push(
                {
                    'type': MntConst.eTypeText,
                    'index': this.columnIndex.ProcessedDateTime,
                    'align': 'center'
                });
            this.validateProperties.push(
                {
                    'type': MntConst.eTypeText,
                    'index': this.columnIndex.UserCode,
                    'align': 'center'
                });
        }
        if (this.pageParams.parentMode !== 'Product-Allocate' && this.pageParams.parentMode !== 'Move-From'
            && this.pageParams.parentMode !== 'Move-To' && this.uiForm.controls['IncludeInactive'].value === true) {
            this.maxColumn++;
            this.isExistColumn.ActivePortfolio = true;
            this.validateProperties.push(
                    {
                        'type': MntConst.eTypeImage,
                        'index': this.columnIndex.ActivePortfolio,
                        'align': 'center'
                    });
        }

    }

    /**
     * Grid focus/click method
     */
    public onGridRowClick(event: any): void {
        if (this.pageParams.vSCEnableDetailLocations === false) {
            this.attributes['ContractNumberServiceVisitFrequency'] = event.rowData['Service Visit Frequency'];
            this.attributes['ContractNumberProductCode'] = event.rowData['Product Code'];
            this.attributes['ContractNumberProductDesc'] = event.rowData['Product Description'];
        } else {
            this.attributes['ContractNumberRecordType'] = event.cellData['additionalData'];
            this.attributes['ContractNumberPremiseLocationNumber'] = event.rowData['Premises Location'];
            this.attributes['ContractNumberPremiseLocationDesc'] = event.rowData['Description'];
        }
        let tempProductCode = '', tempPremiseLocation = '', tempPremiseLocationDesc = '', tempServiceVisitFrequency = '',
            vRowIDServiceCover = '', vROWIDPremiseLocation = '', AdditionalInfo, tempProductDesc = '';
        AdditionalInfo = event.trRowData[2].additionalData.split('|');
        vRowIDServiceCover = AdditionalInfo[0];
        vROWIDPremiseLocation = AdditionalInfo[1];
        this.pageParams.PremiseLocationRowID = vROWIDPremiseLocation;
        if (this.uiForm.controls['GridOption'].value === 'Summary') {
            this.attributes['ContractNumberServiceCoverRowID'] = event.trRowData[0].additionalData;
            this.attributes['ContractNumberServiceCoverLocationRowID'] = event.trRowData[0].additionalData;
        }
        switch (this.riExchange.getParentAttributeValue('ContractNumberRecordType')) {
            case 'PremiseLocation':
                if (this.uiForm.controls['Gridoption'].value === 'Summary') {
                    this.attributes['ContractNumberPremiseLocationRowID'] = event.trRowData[0]['rowID'];
                    tempPremiseLocation = event.rowData['Premises Location'];
                    tempPremiseLocationDesc = event.rowData['Description'];
                } else {
                    this.attributes['ContractNumberPremiseLocationRowID'] = event.trRowData[1]['rowID'];
                    tempPremiseLocation = event.rowData['Premises Location'];
                    tempPremiseLocationDesc = event.rowData['Description'];
                }
                break;
            case 'ServiceCover':
                if (this.uiForm.controls['Gridoption'].value === 'Summary') {
                    this.attributes['ContractNumberPremiseLocationRowID'] = event.trRowData[0]['rowID'];
                    tempProductCode = event.rowData['Product Code'];
                    tempPremiseLocationDesc = event.rowData['Product Description'];
                    tempPremiseLocation = event.rowData['Premises Location'];
                    tempPremiseLocationDesc = event.rowData['Description'];
                    tempServiceVisitFrequency = event.rowData['Service Visit Frequency'];
                } else {
                    this.attributes['ContractNumberPremiseLocationRowID'] = event.trRowData[0]['rowID'];
                    tempProductCode = event.rowData['Product Code'];
                    tempPremiseLocationDesc = event.rowData['Product Description'];
                    tempPremiseLocation = event.rowData['Premises Location'];
                    tempPremiseLocationDesc = event.rowData['Description'];
                    tempServiceVisitFrequency = event.rowData['Service Visit Frequency'];
                }
                break;
            case 'ServiceCoverLocation':
                if (this.uiForm.controls['Gridoption'].value === 'Summary') {
                    this.attributes['ContractNumberPremiseLocationRowID'] = event.trRowData[0]['rowID'];
                    tempProductCode = event.rowData['Product Code'];
                    tempPremiseLocationDesc = event.rowData['Product Description'];
                    tempPremiseLocation = event.rowData['Premises Location'];
                    tempPremiseLocationDesc = event.rowData['Description'];
                    tempServiceVisitFrequency = event.rowData['Service Visit Frequency'];
                } else {
                    this.attributes['ContractNumberPremiseLocationRowID'] = event.trRowData[0]['rowID'];
                    tempProductCode = event.rowData['Product Code'];
                    tempPremiseLocationDesc = event.rowData['Product Description'];
                    tempPremiseLocation = event.rowData['Premises Location'];
                    tempPremiseLocationDesc = event.rowData['Description'];
                    tempServiceVisitFrequency = event.rowData['Service Visit Frequency'];
                }
                break;
            default:
                break;
        }
        if (tempServiceVisitFrequency !== '') {
            this.attributes('ContractNumberServiceVisitFrequency', tempServiceVisitFrequency);
        }
        if (tempProductCode !== '') {
            this.attributes['ContractNumberProductCode'] = tempProductCode;
            this.attributes['ContractNumberProductDesc'] = tempProductDesc;
        } else if (this.pageParams.parentMode === 'Product-Allocate' || this.pageParams.parentMode !== 'Move-From' || this.pageParams.parentMode !== 'Move-To') {
            this.attributes['ContractNumberPremiseLocationNumber'] = tempPremiseLocation;
            this.attributes['ContractNumberPremiseLocationDesc'] = tempPremiseLocationDesc;
        }
    }

    /**
     * Grid double click method
     */
    public onGridRowDblClick(event: any): void {
        this.onGridRowClick(event);

        let vbRowIDString, returnObj = {};
        switch (this.pageParams.parentMode) {
            case 'Product-Allocate':
            case 'Move-From':
                this.riExchange.setParentHTMLValue('PremiseLocationNumber', this.riExchange.getParentAttributeValue('ContractNumberPremiseLocationNumber'));
                this.riExchange.setParentHTMLValue('PremiseLocationDesc', this.riExchange.getParentAttributeValue('ContractNumberPremiseLocationDesc'));
                this.riExchange.setParentHTMLValue('TransferQuantity', this.riExchange.getParentAttributeValue('ContractNumberQuantityAtLocation'));
                returnObj['PremiseLocationNumber'] = event.trRowData[0].text;
                returnObj['PremiseLocationDesc'] = event.trRowData[2].text;
                returnObj['TransferQuantity'] = event.trRowData[1].text;
                this.emitSelectedData(returnObj);
                break;
            case 'Move-To':
                this.riExchange.setParentHTMLValue('PremiseLocationNumberTo', this.riExchange.getParentAttributeValue('ContractNumberPremiseLocationNumber'));
                this.riExchange.setParentHTMLValue('PremiseLocationDescTo', this.riExchange.getParentAttributeValue('ContractNumberPremiseLocationDesc'));
                returnObj['PremiseLocationNumber'] = event.trRowData[0].text;
                returnObj['PremiseLocationDesc'] = event.trRowData[2].text;
                this.emitSelectedData(returnObj);
                break;
            default:
                if (event.cellIndex === 0) {
                    this.riExchangeMode = this.pageParams.tempSource;
                    if (this.pageParams.vSCEnableDetailLocations) {
                        //Navigate to page window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceCoverLocationDetailGrid.htm" + CurrentContractTypeURLParameter
                        this.messageModal.show({ msg: 'iCABSAServiceCoverLocationDetailGrid is not yet developed', title: this.pageTitle }, false);
                    } else {
                        this.isDisplayErrorRequired = false;
                        if ((!this.attributes.ServiceCoverRowID || this.attributes.ServiceCoverRowID === '') && event.trRowData[2].additionalData !== '') {
                            vbRowIDString = event.trRowData[2].additionalData.split('|');
                            this.attributes.ServiceCoverRowID = vbRowIDString[0];
                        }
                        this.attributes['ServiceCoverRowID'] = this.attributes.ServiceCoverRowID;
                        this.attributes['ServiceCoverLocationRowID'] = event.trRowData[4].additionalData;
                        this.navigate(this.riExchangeMode, InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERLOCATIONMAINTENANCE, {
                            RecordType: event.trRowData[0].additionalData,
                            ServiceCoverRowID: this.attributes.ServiceCoverRowID,
                            ServiceCoverLocationRowID: this.attributes['ServiceCoverLocationRowID'],
                            PremiseLocationNumber: event.trRowData[0].text,
                            ProductCode: event.trRowData[3].text,
                            ServiceVisitFrequency: event.trRowData[5].text
                        });
                    }
                }
                break;
        }
    }

    /**
     * Back link click method
     */
    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.riExchange.getBackRoute();
        this.getUnallocated();

    }

    public serviceCoverSearchDataReceived(data: any): void {
        this.uiForm.controls['ProductCode'].setValue(data.ProductCode);
        this.uiForm.controls['ProductDesc'].setValue(data.ProductDesc);
        this.attributes.ServiceCoverRowID = data.row.ttServiceCover;
    }

    /**
     * Method to unallocate location
     */
    private getUnallocated(observer?: any): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('CheckType', 'Premise');
        this.search.set('DefaultEffectiveDate', this.riExchange.getParentAttributeValue('ContractNumberDefaultEffectiveDate'));
        this.search.set('DefaultEffectiveDateProduct', this.riExchange.getParentAttributeValue('ContractNumberDefaultEffectiveDateProduct'));
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(
            (data) => {
                try {
                    if (data.ErrorMessage && data.StopExit === 'no') {
                        document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                        this.errorModal.show({ msg: data.ErrorMessage, title: MessageConstant.Message.ErrorTitle }, false);
                        this.observer = observer;
                    } else if (data.StopExit === 'yes') {
                        this.errorModal.show({ msg: data.ErrorMessage, title: MessageConstant.Message.ErrorTitle }, false);
                        observer.next(false);
                        this.stopExit = true;
                    } else {
                        observer.next(true);
                    }
                } catch (error) {
                    this.logger.warn(error);
                }

            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    public onMessageClose(): void {
        if (this.observer)
            this.observer.next(true);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageParams.titleSuffix = 'Contract';
        this.pageTitle = 'Premises Details';
        this.initData();
    }

    ngOnDestroy(): void {
        this.lookUpSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        super.ngOnDestroy();
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
            this.pageParams.ServiceCoverRowID = params.ServiceCoverRowID;
        }
        this.setUI();
    }

    public canDeactivate(): Observable<boolean> {
        this.canDeactivateObservable = new Observable((observer) => {
            if (this.stopExit === true) {
                observer.next(false);
                return;
            }
            if (this.isDisplayErrorRequired === true)
                this.getUnallocated(observer);
            else
                observer.next(true);
        });
        return this.canDeactivateObservable;
    }
    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.isSortedClick = false;
        this.buildGrid();
    }

    public onCellKeyDown(event: any): void {
        if ((event.cellIndex === this.columnIndex.PremiseLocationSequence) && event.updateValue && (event.cellData.text !== event.updateValue)) {
            this.updateMode = true;
            this.rowData = event.completeRowData;
            this.attributes.PremiseLocationSequence = event.keyCode.target.value;
            if (this.rowData[this.columnIndex.PremiseLocationNumber])
                this.attributes.PremiseLocationNumberRowID = this.rowData[this.columnIndex.PremiseLocationNumber].rowID;
            if (this.rowData[this.columnIndex.PremiseLocationSequence])
                this.attributes.PremiseLocationSequenceRowID = this.rowData[this.columnIndex.PremiseLocationSequence].rowID;
            if (this.rowData[this.columnIndex.PremiseLocationDesc]) {
                if (this.rowData[this.columnIndex.PremiseLocationDesc].additionalData) {
                    let premiseLocationData: Array<string> = this.rowData[this.columnIndex.PremiseLocationDesc].additionalData.split('|');
                    this.attributes.PremiseLocationRowID = premiseLocationData[1];
                }
            }

            this.buildGrid();
        }
    }
    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }
}
