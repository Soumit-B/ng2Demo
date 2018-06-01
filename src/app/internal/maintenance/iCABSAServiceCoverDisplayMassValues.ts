import { Component, Injector, ViewChild, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridComponent } from '../../../shared/components/grid/grid';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { Observable } from 'rxjs/Observable';
import { Title } from '@angular/platform-browser';
import { GlobalizeService } from '../../../shared/services/globalize.service';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { LostBusinessDetailLanguageSearchComponent } from '../../internal/search/iCABSBLostBusinessDetailLanguageSearch.component';
import { LostBusinessLanguageSearchComponent } from '../../internal/search/iCABSBLostBusinessLanguageSearch.component';

@Component({
    templateUrl: 'iCABSAServiceCoverDisplayMassValues.html',
    styles: [`
   .ngInvalid {
        border: 1px solid #ff0000;
    }
    `]
})

export class ServiceCoverDisplayMassValuesComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('riGridComponent') riGridComponent: GridComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('icabsLostBusinessLang') icabsLostBusinessLang: LostBusinessDetailLanguageSearchComponent;
    @ViewChild('icabsLostBusinesLangSearch') icabsLostBusinesLangSearch: LostBusinessLanguageSearchComponent;

    // Grid Component Variables
    public searchGet: any;
    public pageSize: number = 12;
    public pageId: string;
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = this.itemsPerPage;
    public maxColumn: number = 15;
    public search: URLSearchParams;
    private sub: Subscription;
    public queryParams: any = {
        operation: 'Application/iCABSAServiceCoverDisplayMassValues',
        module: 'contract-admin',
        method: 'contract-management/maintenance',
        ActionSearch: '0',
        Actionupdate: '6',
        ActionEdit: '2',
        ActionDelete: '3'
    };
    public effectiveDate: String = '';// new Date();
    public nextInvoiceStartDate: String = '';// Date;// = new Date();
    public validateProperties: Array<any> = [{
        'type': MntConst.eTypeText,
        'index': 0
    }, {
        'type': MntConst.eTypeText,
        'index': 1
    }, {
        'type': MntConst.eTypeText,
        'index': 2
    }, {
        'type': MntConst.eTypeText,
        'index': 3
    }, {
        'type': MntConst.eTypeInteger,
        'index': 4
    }, {
        'type': MntConst.eTypeText,
        'index': 5
    }, {
        'type': MntConst.eTypeDecimal2,
        'index': 6
    }, {
        'type': MntConst.eTypeDecimal2,
        'index': 7
    }, {
        'type': MntConst.eTypeDecimal2,
        'index': 8
    }, {
        'type': MntConst.eTypeDecimal2,
        'index': 9
    }, {
        'type': MntConst.eTypeDecimal2,
        'index': 10
    },
    {
        'type': MntConst.eTypeDecimal2,
        'index': 11
    }, {
        'type': MntConst.eTypeDecimal2,
        'index': 12
    }, {
        'type': MntConst.eTypeDecimal2,
        'index': 13
    }];

    public lostBusinessInputParams: any = { LanguageCode: this.riExchange.LanguageCode() };
    public lostBusinessLangSearchInputParams: any = { LanguageCode: this.riExchange.LanguageCode() };
    private uiElements: any;
    private routeParams: any;
    private directLinkURLMode: boolean = false; // set it to true if this will open from direct URL Link
    private subLookupServiceCover: Subscription;
    public isUpdateButtonVisible: boolean = false;
    public isDropDownsVisible: boolean = false;
    private serviceCoverDisplayObject: any = {};
    public reasonCodes: Array<Object> = [{ LostBusinessCode: '', LostBusinessDesc: '' }];
    public detailCodes: Array<Object> = [{ LostBusinessDetailCode: '', LostBusinessDetailDesc: '' }];
    private isReasonCodeFetched: boolean = false;
    private isDetailCodeFetched: boolean = false;
    private lostBusinessCode: string;
    private lostBusinessDetailCode: string;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public serviceCoverNumber: string;
    public isNextInvoiceDateDisabled: boolean = true;
    public isEffectiveDateDisabled: boolean = false;
    private lastselectedInvalidField: string = '';
    private formElement: any;
    private isUpdate: boolean = false;
    public isUpdateButtonDisabled: boolean = false;
    private currentFilterField: any;
    private columnValues: any = [[], [], [], []];
    private totalRecords: number = 0;
    private colDataMinValues: any = [0, 0, 0, 0]; // stores maximum value of each 4 columns
    public isReasonAndDetailCodeRequired: boolean = false;
    public isRecentlyUpdated: boolean = false;


    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: true, disabled: true, required: true, type: MntConst.eTypeText },
        { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'PremiseNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'PremiseName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'NextInvoiceStartDate', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate },
        { name: 'ProductCode', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'EffectiveDate', readonly: true, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'MaterialsFilter', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'LabourFilter', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'ReplacementFilter', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'TotalFilter', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'NewMaterialsValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'NewLabourValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'NewReplacementValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'NewTotalValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'LabourPercentInc', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'ReplacementPercentInc', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'IncreasePercent', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'MaterialsPercentInc', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'MaterialsPercentDec', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'LabourPercentDec', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'ReplacementPercentDec', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'DecreasePercent', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'NewMaterialsTotalValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'NewLabourTotalValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'NewReplacementTotalValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'NewServiceCoverTotalValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'ServiceCoverDisplays', readonly: false, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'DisplaysAffected', readonly: false, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'ReasonCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'DetailCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode }

    ];

    private detailCodeMappedFields: any = {
        'NewMaterialsValue': 0,
        'NewLabourValue': 1,
        'NewReplacementValue': 2,
        'NewTotalValue': 3,
        'MaterialsPercentDec': -1,
        'LabourPercentDec': -1,
        'ReplacementPercentDec': -1,
        'DecreasePercent': -1
    };

    private currentFilterValue: any;

    constructor(injector: Injector,
        private route: ActivatedRoute, private elem: ElementRef, private titleService: Title,
        public globalize: GlobalizeService) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERDISPLAYMASSVALUES;
        this.pageTitle = 'Service Cover Displays';
        this.titleService.setTitle(this.pageTitle);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.routeAwayGlobals.setEllipseOpenFlag(false); //CR implementation
        this.sub = this.route.queryParams.subscribe(
            (params: any) => {
                this.routeParams = params;
            }
        );

        // this.window_onload();

    }

    ngAfterViewInit(): void {
        this.window_onload();
    }

    private window_onload(): void {
        this.uiElements = this.riExchange.riInputElement;
        if (this.directLinkURLMode) {
            this.serviceCoverDisplayObject.ContractNumber = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ContractNumber');
            this.serviceCoverDisplayObject.PremiseNumber = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'PremiseNumber');
            this.serviceCoverDisplayObject.ProductCode = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ProductCode');
            this.serviceCoverDisplayObject.EffectiveDate = decodeURI(this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'EffectiveDate'));
            this.effectiveDate = this.utils.convertDate(this.serviceCoverDisplayObject.EffectiveDate);

            this.uiElements.SetValue(this.uiForm, 'ContractNumber', this.serviceCoverDisplayObject.ContractNumber);
            this.uiElements.SetValue(this.uiForm, 'PremiseNumber', this.serviceCoverDisplayObject.PremiseNumber);
            this.uiElements.SetValue(this.uiForm, 'ProductCode', this.serviceCoverDisplayObject.ProductCode);
            this.uiElements.SetValue(this.uiForm, 'EffectiveDate', this.serviceCoverDisplayObject.EffectiveDate);
            this.getLookupData(this.serviceCoverDisplayObject);
        } else {
            this.serviceCoverDisplayObject.ContractNumber = this.riExchange.getParentHTMLValue('ContractNumber');
            this.serviceCoverDisplayObject.ContractName = this.riExchange.getParentHTMLValue('ContractName');
            this.serviceCoverDisplayObject.PremiseNumber = this.riExchange.getParentHTMLValue('PremiseNumber');
            this.serviceCoverDisplayObject.PremiseName = this.riExchange.getParentHTMLValue('PremiseName');
            this.serviceCoverDisplayObject.ProductCode = this.riExchange.getParentHTMLValue('ProductCode');
            this.serviceCoverDisplayObject.ProductDesc = this.riExchange.getParentHTMLValue('ProductDesc');
            let d = new Date();
            let day = (d.getDate() < 10) ? ('0' + d.getDate()) : d.getDate();
            let month0 = d.getMonth() + 1;
            let month = (month0 < 10) ? ('0' + month0) : month0;
            let year = d.getFullYear();
            let effectiveDate = day + '/' + month + '/' + year;
            this.serviceCoverDisplayObject.EffectiveDate = this.globalize.parseDateToFixedFormat(effectiveDate).toString();
            this.effectiveDate = this.serviceCoverDisplayObject.EffectiveDate;
            this.uiElements.SetValue(this.uiForm, 'ContractNumber', this.serviceCoverDisplayObject.ContractNumber);
            this.uiElements.SetValue(this.uiForm, 'ContractName', this.serviceCoverDisplayObject.ContractName);
            this.uiElements.SetValue(this.uiForm, 'PremiseNumber', this.serviceCoverDisplayObject.PremiseNumber);
            this.uiElements.SetValue(this.uiForm, 'PremiseName', this.serviceCoverDisplayObject.PremiseName);
            this.uiElements.SetValue(this.uiForm, 'ProductCode', this.serviceCoverDisplayObject.ProductCode);
            this.uiElements.SetValue(this.uiForm, 'ProductDesc', this.serviceCoverDisplayObject.ProductDesc);
            this.uiElements.SetValue(this.uiForm, 'EffectiveDate', this.serviceCoverDisplayObject.EffectiveDate);
            this.getLookupData(this.serviceCoverDisplayObject);
        }
        this.formElement = this.elem.nativeElement.querySelector('form');
        this.routeAwayGlobals.setDirtyFlag(this.formElement.classList.contains('ng-dirty')); //CR implementation
        this.elem.nativeElement.querySelector('icabs-datepicker#EffectiveDate input').onblur = function (): void {
            if (this.value === '') {
                this.classList.add('ngInvalid');
            } else {
                this.classList.remove('ngInvalid');
            }
        };

    }
    private createSearchParams(): URLSearchParams {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        let effectiveDate: string = this.uiElements.GetValue(this.uiForm, 'EffectiveDate');

        //////
        search.set('ContractNumber', this.uiElements.GetValue(this.uiForm, 'ContractNumber'));
        search.set('PremiseNumber', this.uiElements.GetValue(this.uiForm, 'PremiseNumber'));
        search.set('ProductCode', this.uiElements.GetValue(this.uiForm, 'ProductCode'));
        search.set('ServiceCoverNumber', this.serviceCoverNumber);
        search.set('EffectiveDate', this.globalize.parseDateToFixedFormat(this.uiElements.GetValue(this.uiForm, 'EffectiveDate')).toString());
        search.set('MaterialsFilter', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'MaterialsFilter'), 2).toString());
        search.set('ReplacementFilter', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'ReplacementFilter'), 2).toString());
        search.set('LabourFilter', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'LabourFilter'), 2).toString());
        search.set('TotalFilter', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'TotalFilter'), 2).toString());
        search.set('IncreasePercent', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'IncreasePercent'), 2).toString());
        search.set('MaterialsPercentInc', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'MaterialsPercentInc'), 2).toString());
        search.set('LabourPercentInc', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'LabourPercentInc'), 2).toString());
        search.set('ReplacementPercentInc', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'ReplacementPercentInc'), 2).toString());
        search.set('DecreasePercent', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'DecreasePercent'), 2).toString());
        search.set('MaterialsPercentDec', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'MaterialsPercentDec'), 2).toString());
        search.set('LabourPercentDec', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'LabourPercentDec'), 2).toString());
        search.set('ReplacementPercentDec', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'ReplacementPercentDec'), 2).toString());
        search.set('NewMaterialsValue', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'NewMaterialsValue'), 2).toString());
        search.set('NewReplacementValue', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'NewReplacementValue'), 2).toString());
        search.set('NewLabourValue', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'NewLabourValue'), 2).toString());
        search.set('NewTotalValue', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'NewTotalValue'), 2).toString());
        search.set('NewMaterialsTotalValue', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'NewMaterialsTotalValue'), 2).toString());
        search.set('NewLabourTotalValue', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'NewLabourTotalValue'), 2).toString());
        search.set('NewReplacementTotalValue', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'NewReplacementTotalValue'), 2).toString());
        search.set('NewServiceCoverTotalValue', this.globalize.parseDecimalToFixedFormat(this.uiElements.GetValue(this.uiForm, 'NewServiceCoverTotalValue'), 2).toString());
        search.set('UpdateServiceCoverValues', '');
        search.set('LostBusinessCode', this.lostBusinessCode);
        search.set('LostBusinessDetailCode', this.lostBusinessDetailCode);

        search.set('countryCode', this.countryCode());
        search.set('businessCode', this.businessCode());

        return search;

    }


    private buildGrid(isUpdate: boolean): void {
        this.isUpdate = isUpdate;
        // set grid building parameters
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '66066');
        this.search.set(this.serviceConstants.GridCacheRefresh, 'true');
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, '');
        this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.queryParams.search = this.search;
        this.riGridComponent.setRowHighlight(false);
        this.riGridComponent.loadGridData(this.queryParams);

    } // end of buildGrid

    public getGridInfo(info: any): void {
        try {
            setTimeout(() => {
                if (this.elem.nativeElement.querySelector('.gridtable')) {
                    if (this.elem.nativeElement.querySelector('.gridtable').querySelectorAll('tbody tr')[0]) {
                        this.elem.nativeElement.querySelector('.gridtable').querySelectorAll('tbody tr')[0].querySelectorAll('td')[13].width = '70px';
                    }
                }
            }, 0);
            if (info.curPage === 1) {
                let totalDisplayValues: string = '';
                let totalDisplaysAffectedValues: string = '';
                totalDisplayValues = this.riExchange.getParentHTMLValue('TotalQty'); //parseInt(info.totalRows, 10) - 4;
                totalDisplaysAffectedValues = info.gridData.footer.rows[0].text.split('|')[1];
                this.totalRecords = parseInt(info.gridData.body.cells.length.toString(), 10) / this.maxColumn;
                this.uiElements.SetValue(this.uiForm, 'ServiceCoverDisplays', totalDisplayValues);
                this.uiElements.SetValue(this.uiForm, 'DisplaysAffected', totalDisplaysAffectedValues);

                this.columnValues = [[], [], [], []];
                let colData = '';
                for (let i = 0; i < this.totalRecords - 1; i++) { // col 6 to 9 is the value to be read
                    colData = info.gridData.body.cells[6 + (this.maxColumn * i)].text;
                    colData = colData.replace(',', '.');
                    this.columnValues[0].push(Number(colData));

                    colData = info.gridData.body.cells[7 + (this.maxColumn * i)].text;
                    colData = colData.replace(',', '.');
                    this.columnValues[1].push(Number(colData));

                    colData = info.gridData.body.cells[8 + (this.maxColumn * i)].text;
                    colData = colData.replace(',', '.');
                    this.columnValues[2].push(Number(colData));

                    colData = info.gridData.body.cells[9 + (this.maxColumn * i)].text;
                    colData = colData.replace(',', '.');
                    this.columnValues[3].push(Number(colData));
                }
                this.colDataMinValues[0] = Math.min.apply(null, this.columnValues[0]);
                this.colDataMinValues[1] = Math.min.apply(null, this.columnValues[1]);
                this.colDataMinValues[2] = Math.min.apply(null, this.columnValues[2]);
                this.colDataMinValues[3] = Math.min.apply(null, this.columnValues[3]);
            }
            if (info && info.totalPages) { // && this.checkIfAnyFilters()) {
                this.totalItems = parseInt(info.totalPages, 10) * this.itemsPerPage;
            } else {
                this.totalItems = 0;
            }
            if (this.isUpdate === true && this.totalItems > 0 && info.hasOwnProperty('gridData') === true) { // show message for updated records
                this.messageModal.show({ msg: MessageConstant.PageSpecificMessage.UpdateComplete, title: 'Message' }, false);
            }
            if (this.checkIfAnyFilters()) {
                if (this.totalItems > 0) {
                    this.isUpdateButtonVisible = true;
                    this.isDropDownsVisible = true;
                    this.lostBusinessCode = '';
                    this.lostBusinessDetailCode = '';
                    this.uiElements.SetValue(this.uiForm, 'ReasonCode', '');
                    this.uiElements.SetValue(this.uiForm, 'DetailCode', '');
                }
            } else {
                this.isUpdateButtonVisible = false;
                if (this.checkIfAnyFilters()) {
                    this.isDropDownsVisible = true;
                    this.lostBusinessCode = '';
                    this.lostBusinessDetailCode = '';
                    this.uiElements.SetValue(this.uiForm, 'ReasonCode', '');
                    this.uiElements.SetValue(this.uiForm, 'DetailCode', '');
                } else {
                    this.isDropDownsVisible = false;
                    this.isReasonCodeFetched = false;
                    this.isDetailCodeFetched = false;
                    this.reasonCodes = [{ LostBusinessCode: '', LostBusinessDesc: '' }];
                    this.detailCodes = [{ LostBusinessDetailCode: '', LostBusinessDetailDesc: '' }];
                    this.lostBusinessCode = '';
                    this.lostBusinessDetailCode = '';
                }
            }
        } catch (e) {
            //
        }
    }

    public onUpdateClicked(): void {
        let isValid: boolean = true;
        if (this.elem.nativeElement.querySelector('form').classList.contains('ng-invalid')) {
            isValid = false;
            return;
        }
        if (this.elem.nativeElement.querySelector('icabs-datepicker#EffectiveDate input').value === '') {
            isValid = false;
            return;
        }
        if (this.lostBusinessCode === '' && this.isReasonAndDetailCodeRequired) {
            this.elem.nativeElement.querySelector('#reasonCode').classList.add('ngInvalid');
            isValid = false;
        } else {
            this.elem.nativeElement.querySelector('#reasonCode').classList.remove('ngInvalid');
        }

        if (this.lostBusinessDetailCode === '' && this.isReasonAndDetailCodeRequired) {
            this.elem.nativeElement.querySelector('#detailCode').classList.add('ngInvalid');
            isValid = false;
        } else {
            this.elem.nativeElement.querySelector('#detailCode').classList.remove('ngInvalid');
        }

        if (isValid) {
            this.search = this.createSearchParams();
            this.search.set('UpdateServiceCoverValues', 'UpdateServiceCoverValues');
            this.buildGrid(true);
            this.getLookupData(this.serviceCoverDisplayObject);
            this.isUpdateButtonDisabled = true;
            let reasonCodeField = this.elem.nativeElement.querySelector('#reasonCode');
            let detailCodeField = this.elem.nativeElement.querySelector('#detailCode');
            reasonCodeField.classList.remove('ngInvalid');
            detailCodeField.classList.remove('ngInvalid');
            this.lostBusinessCode = '';
            this.lostBusinessDetailCode = '';
            reasonCodeField.value = this.lostBusinessCode;
            detailCodeField.value = this.lostBusinessDetailCode;
            this.isRecentlyUpdated = true;
        } else {
            window.scrollBy(0, this.elem.nativeElement.querySelector('form').scrollHeight);
        }
    }

    public refresh(): void {
        if (this.lastselectedInvalidField === '') {
            this.search = this.createSearchParams();
            this.buildGrid(false);
            this.getLookupData(this.serviceCoverDisplayObject);
            this.isUpdateButtonDisabled = false;
            let reasonCodeField = this.elem.nativeElement.querySelector('#reasonCode');
            let detailCodeField = this.elem.nativeElement.querySelector('#detailCode');
            if (reasonCodeField !== null && detailCodeField !== null) {
                this.lostBusinessCode = '';
                this.lostBusinessDetailCode = '';
                this.icabsLostBusinesLangSearch.ngOnInit();
                this.lostBusinessInputParams.LostBusinessCode = this.lostBusinessCode;
                this.icabsLostBusinessLang.fetchDropDownData();
                reasonCodeField.classList.remove('ngInvalid');
                detailCodeField.classList.remove('ngInvalid');
            }
        }

    }

    public selectCurrentFilterOnly(event: any, filterOrTotalField?: string): void {
        let target = event.target.getAttribute('formControlName');
        let elementValue = event.target.value;
        let isValid = true;
        // let reg = /^\d+$/;
        let reg = /^[0-9]\d*(\.\d+)?$/;
        // isValid = reg.test(elementValue);
        if (elementValue !== '') {
            if (this.currentFilterField !== elementValue) {
                this.isUpdateButtonVisible = false;
            }
            if (filterOrTotalField !== 'FILTERROWFIELD') {
                this.resetAllFilters();
            }
            this.uiElements.SetValue(this.uiForm, target, elementValue);
            if (this.lastselectedInvalidField !== '') {
                this.elem.nativeElement.querySelector(this.lastselectedInvalidField).classList.add('ng-valid');
                this.elem.nativeElement.querySelector(this.lastselectedInvalidField).classList.remove('ngInvalid');
            }
            let elem = this.elem.nativeElement.querySelector('#' + target);
            if (parseInt(elementValue, 0) < 0 || !isValid) {
                elem.classList.add('ngInvalid');
                elem.classList.remove('ng-valid');
                this.lastselectedInvalidField = '#' + target;
            } else {
                let formattedValueTodecimal = elementValue;// (Math.round(elementValue * 100) / 100).toFixed(2);
                elem.value = formattedValueTodecimal;
                elem.classList.add('ng-valid');
                elem.classList.remove('ngInvalid');
                this.lastselectedInvalidField = '';
                this.currentFilterValue = { 'val': formattedValueTodecimal, 'targetIndex': this.detailCodeMappedFields[target] };
                this.checkifReasonCodeValidationRequired(target, Number(formattedValueTodecimal));
            }

        }


        if (!this.checkIfAnyFilters()) {
            this.isUpdateButtonVisible = false;
            return;
        }

    }

    private checkifReasonCodeValidationRequired(targetField: string, value: number): void {
        this.colDataMinValues[0] = Math.min.apply(null, this.columnValues[0]);
        this.colDataMinValues[1] = Math.min.apply(null, this.columnValues[1]);
        this.colDataMinValues[2] = Math.min.apply(null, this.columnValues[2]);
        this.colDataMinValues[3] = Math.min.apply(null, this.columnValues[3]);
        if ((value < this.colDataMinValues[this.detailCodeMappedFields[targetField]]) || (this.detailCodeMappedFields[targetField] < 0)) {
            this.isReasonAndDetailCodeRequired = true;
        } else {
            this.isReasonAndDetailCodeRequired = false;
        }
    }
    public onCurrentFilterFocus(event: any, filterOrTotalField?: string): void {
        let val = event.target.value;
        if (filterOrTotalField !== null) {
            this.enableDisableFields(event.target, filterOrTotalField);
        }

    }

    private enableDisableFields(field: any, fieldType: string): void {
        switch (fieldType) {
            case 'FILTERROWFIELD':
                if (this.uiElements.GetValue(this.uiForm, 'MaterialsFilter') === '' &&
                    this.uiElements.GetValue(this.uiForm, 'LabourFilter') === '' &&
                    this.uiElements.GetValue(this.uiForm, 'ReplacementFilter') === '' &&
                    this.uiElements.GetValue(this.uiForm, 'TotalFilter') === ''
                ) {
                    this.enableAllFields();
                } else {
                    this.uiElements.Enable(this.uiForm, 'MaterialsFilter');
                    this.uiElements.Enable(this.uiForm, 'LabourFilter');
                    this.uiElements.Enable(this.uiForm, 'ReplacementFilter');
                    this.uiElements.Enable(this.uiForm, 'TotalFilter');
                    this.uiElements.Disable(this.uiForm, 'NewMaterialsTotalValue');
                    this.uiElements.Disable(this.uiForm, 'NewLabourTotalValue');
                    this.uiElements.Disable(this.uiForm, 'NewReplacementTotalValue');
                    this.uiElements.Disable(this.uiForm, 'NewServiceCoverTotalValue');
                }
                break;
            case 'TOTALROWFIELD':
                if (this.uiElements.GetValue(this.uiForm, 'NewMaterialsTotalValue') === '' &&
                    this.uiElements.GetValue(this.uiForm, 'NewLabourTotalValue') === '' &&
                    this.uiElements.GetValue(this.uiForm, 'NewReplacementTotalValue') === '' &&
                    this.uiElements.GetValue(this.uiForm, 'NewServiceCoverTotalValue') === ''
                ) {
                    this.enableAllFields();
                } else {
                    this.uiElements.Disable(this.uiForm, 'MaterialsFilter');
                    this.uiElements.Disable(this.uiForm, 'LabourFilter');
                    this.uiElements.Disable(this.uiForm, 'ReplacementFilter');
                    this.uiElements.Disable(this.uiForm, 'TotalFilter');
                    this.uiElements.Enable(this.uiForm, 'NewMaterialsTotalValue');
                    this.uiElements.Enable(this.uiForm, 'NewLabourTotalValue');
                    this.uiElements.Enable(this.uiForm, 'NewReplacementTotalValue');
                    this.uiElements.Enable(this.uiForm, 'NewServiceCoverTotalValue');
                }
                break;
        }
    }

    private enableAllFields(): void {
        this.uiElements.Enable(this.uiForm, 'MaterialsFilter');
        this.uiElements.Enable(this.uiForm, 'LabourFilter');
        this.uiElements.Enable(this.uiForm, 'ReplacementFilter');
        this.uiElements.Enable(this.uiForm, 'TotalFilter');
        this.uiElements.Enable(this.uiForm, 'NewMaterialsTotalValue');
        this.uiElements.Enable(this.uiForm, 'NewLabourTotalValue');
        this.uiElements.Enable(this.uiForm, 'NewReplacementTotalValue');
        this.uiElements.Enable(this.uiForm, 'NewServiceCoverTotalValue');
    }


    private resetAllFilters(): void {
        this.uiElements.SetValue(this.uiForm, 'IncreasePercent', '');
        this.uiElements.SetValue(this.uiForm, 'MaterialsPercentInc', '');
        this.uiElements.SetValue(this.uiForm, 'LabourPercentInc', '');
        this.uiElements.SetValue(this.uiForm, 'ReplacementPercentInc', '');
        this.uiElements.SetValue(this.uiForm, 'DecreasePercent', '');
        this.uiElements.SetValue(this.uiForm, 'MaterialsPercentDec', '');
        this.uiElements.SetValue(this.uiForm, 'LabourPercentDec', '');
        this.uiElements.SetValue(this.uiForm, 'ReplacementPercentDec', '');
        this.uiElements.SetValue(this.uiForm, 'NewMaterialsValue', '');
        this.uiElements.SetValue(this.uiForm, 'NewReplacementValue', '');
        this.uiElements.SetValue(this.uiForm, 'NewLabourValue', '');
        this.uiElements.SetValue(this.uiForm, 'NewTotalValue', '');
        this.uiElements.SetValue(this.uiForm, 'NewMaterialsTotalValue', '');
        this.uiElements.SetValue(this.uiForm, 'NewLabourTotalValue', '');
        this.uiElements.SetValue(this.uiForm, 'NewReplacementTotalValue', '');
        this.uiElements.SetValue(this.uiForm, 'NewServiceCoverTotalValue', '');
    }

    private checkIfAnyFilters(): boolean {
        let isFilter: boolean = false;
        if (this.uiElements.GetValue(this.uiForm, 'IncreasePercent') === '' &&
            this.uiElements.GetValue(this.uiForm, 'MaterialsPercentInc') === '' &&
            this.uiElements.GetValue(this.uiForm, 'LabourPercentInc') === '' &&
            this.uiElements.GetValue(this.uiForm, 'ReplacementPercentInc') === '' &&
            this.uiElements.GetValue(this.uiForm, 'DecreasePercent') === '' &&
            this.uiElements.GetValue(this.uiForm, 'MaterialsPercentDec') === '' &&
            this.uiElements.GetValue(this.uiForm, 'LabourPercentDec') === '' &&
            this.uiElements.GetValue(this.uiForm, 'ReplacementPercentDec') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewMaterialsValue') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewReplacementValue') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewLabourValue') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewTotalValue') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewMaterialsTotalValue') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewLabourTotalValue') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewReplacementTotalValue') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewServiceCoverTotalValue') === '') {
            isFilter = false;
        } else {
            isFilter = true;
        }

        return isFilter;
    }



    public nextInvoiceDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.uiElements.SetValue(this.uiForm, 'NextInvoiceStartDate', value.value);
        }
    }

    public effectiveDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.uiElements.SetValue(this.uiForm, 'EffectiveDate', value.value);
            this.elem.nativeElement.querySelector('icabs-datepicker#EffectiveDate input').classList.remove('ngInvalid');
            this.isUpdateButtonVisible = false;
        }
    }


    /// Lookup
    private getLookupData(serviceCoverDisplayObject: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP_details = [
            {
                'table': 'ServiceCover',
                'query': {
                    'ContractNumber': serviceCoverDisplayObject.ContractNumber, 'BusinessCode': this.businessCode(),
                    'PremiseNumber': serviceCoverDisplayObject.PremiseNumber, 'ProductCode': serviceCoverDisplayObject.ProductCode,
                    'ROWID': this.riExchange.getParentHTMLValue('ServiceCoverROWID')
                },
                'fields': ['ContractNumber', 'PremiseNumber', 'ProductCode', 'ServiceCoverNumber', 'ServiceVisitFrequency', 'NextInvoiceStartDate']
            },

            {
                'table': 'LostBusinessLang',
                'query': { 'BusinessCode': this.businessCode(), 'LanguageCode': this.riExchange.LanguageCode() },
                'fields': ['LostBusinessCode', 'LostBusinessDesc']
            }


        ];


        this.subLookupServiceCover = this.LookUp.lookUpRecord(lookupIP_details).subscribe((e) => {

            if (e && e.length > 0 && e[0].length > 0) {
                this.uiElements.SetValue(this.uiForm, 'ServiceVisitFrequency', e[0][0].ServiceVisitFrequency);
                this.uiElements.SetValue(this.uiForm, 'NextInvoiceStartDate', decodeURI(e[0][0].NextInvoiceStartDate));
                if (e[0][0].NextInvoiceStartDate !== null) {
                    this.nextInvoiceStartDate = this.globalize.parseDateToFixedFormat(decodeURI(e[0][0].NextInvoiceStartDate)).toString();
                } else {
                    this.nextInvoiceStartDate = null;
                }
                this.serviceCoverNumber = e[0][0].ServiceCoverNumber;

            }
            if (e && e.length > 0 && e[1].length > 0 && this.isReasonCodeFetched === false) {
                for (let i = 0; i < e[1].length; i++) {
                    if (e[1][i]['LostBusinessCode'] !== '0' && e[1][i]['LostBusinessDesc'] !== 'Created for Conversion') {
                        this.getTranslatedValue(e[1][i]['LostBusinessDesc'], null).subscribe((res: string) => {
                            if (res) {
                                e[1][i]['LostBusinessDesc'] = res;
                            }
                        });
                        e[1][i]['LostBusinessDesc'] = e[1][i]['LostBusinessCode'] + ' - ' + e[1][i]['LostBusinessDesc'];
                        this.reasonCodes.push(e[1][i]);
                    }
                }
                this.isReasonCodeFetched = true;
            }

            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                this.errorService.emitError(error);

            });
    }


    /// lookup for detail code
    private getLookupDataDetailCode(lostBusinessCode: string): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP_details = [
            {
                'table': 'LostBusinessDetail',
                'query': {
                    'BusinessCode': this.businessCode(), 'LanguageCode': this.riExchange.LanguageCode(),
                    'LostBusinessCode': lostBusinessCode, 'InvalidForNew': false
                },
                'fields': ['LostBusinessDetailCode', 'LostBusinessDetailDesc', 'LostBusinessCode', 'BusinessCode']
            }
        ];

        this.subLookupServiceCover = this.LookUp.lookUpRecord(lookupIP_details).subscribe((e) => {
            this.detailCodes = [{ LostBusinessDetailCode: '', LostBusinessDetailDesc: '' }];
            if (e && e.length > 0 && e[0].length > 0) {
                for (let i = 0; i < e[0].length; i++) {
                    this.getTranslatedValue(e[0][i]['LostBusinessDetailDesc'], null).subscribe((res: string) => {
                        if (res) {
                            e[0][i]['LostBusinessDetailDesc'] = res;
                        }
                    });
                    e[0][i]['LostBusinessDetailDesc'] = e[0][i]['LostBusinessDetailCode'] + ' - ' + e[0][i]['LostBusinessDetailDesc'];
                    this.detailCodes.push(e[0][i]);
                }

            }

            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                this.errorService.emitError(error);

            });
    }



    public reasonCodeChange(event: any): void {
        let target = event.target.getAttribute('formControlName');
        this.lostBusinessCode = event.target.value;
        if (this.lostBusinessCode !== '') {
            this.elem.nativeElement.querySelector('#reasonCode').classList.remove('ngInvalid');
        } else {
            if (this.isReasonAndDetailCodeRequired) {
                this.elem.nativeElement.querySelector('#reasonCode').classList.add('ngInvalid');
            }
        }

        this.lostBusinessInputParams.LostBusinessCode = this.lostBusinessCode;
        this.icabsLostBusinessLang.fetchDropDownData();
    }

    /** Reason Code Dropdown */
    public onLostBusinesslLangSearchDataReceived(event: any): void {
        this.lostBusinessCode = event['LostBusinessLang.LostBusinessCode'];
        this.setControlValue('ReasonCode', this.lostBusinessCode);
        this.lostBusinessInputParams.LostBusinessCode = this.lostBusinessCode;
        if (this.lostBusinessCode !== '') {
            this.elem.nativeElement.querySelector('#reasonCode').classList.remove('ngInvalid');
            this.icabsLostBusinessLang.fetchDropDownData();
            //   this.getLookupDataDetailCode(this.lostBusinessCode);
        } else {
            if (this.isReasonAndDetailCodeRequired) {
                this.elem.nativeElement.querySelector('#reasonCode').classList.add('ngInvalid');
            }

        }
    }

    /** Detail Code Dropdown */
    public onLostBusinessDetailLangDataReceived(event: any): void {
        this.lostBusinessDetailCode = event['LostBusinessDetailLang.LostBusinessDetailCode'];
        this.setControlValue('DetailCode', this.lostBusinessDetailCode);
        if (this.lostBusinessDetailCode !== '') {
            this.elem.nativeElement.querySelector('#detailCode').classList.remove('ngInvalid');
        } else {
            if (this.isReasonAndDetailCodeRequired) {
                this.elem.nativeElement.querySelector('#detailCode').classList.add('ngInvalid');
            }
        }
    }


    public detailCodeChange(event: any): void {
        let target = event.target.getAttribute('formControlName');
        this.lostBusinessDetailCode = event.target.value;
        if (this.lostBusinessDetailCode !== '') {
            this.elem.nativeElement.querySelector('#detailCode').classList.remove('ngInvalid');
        } else {
            if (this.isReasonAndDetailCodeRequired) {
                this.elem.nativeElement.querySelector('#detailCode').classList.add('ngInvalid');
            }
        }
    }

    public getCurrentPage(currentPageNum: any): void {
        this.currentPage = currentPageNum.value;
        this.search = this.createSearchParams();
        this.buildGrid(false);
    }

    private isInvalidValue(): boolean {
        let invalid: boolean = true;

        return invalid;
    }

    //CR implementation
    public canDeactivate(): Observable<boolean> {
        if (this.isRecentlyUpdated === false) {
            this.routeAwayGlobals.setDirtyFlag(this.formElement.classList.contains('ng-dirty')); //CR implementation
        } else {
            this.routeAwayGlobals.setDirtyFlag(false);
        }
        return this.routeAwayComponent.canDeactivate();
    }

}
