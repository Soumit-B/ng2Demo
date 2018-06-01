import { VariableService } from './../../../shared/services/variable.service';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { AppModuleRoutes, InternalMaintenanceModuleRoutes, InternalGridSearchModuleRoutes, InternalGridSearchSalesModuleRoutes, InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { RiExchange } from './../../../shared/services/riExchange';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { MessageConstant } from './../../../shared/constants/message.constant';

@Component({
    templateUrl: 'iCABSSPipelineQuoteGrid.html'
})

export class PipelineQuoteGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('menu') menu;
    @ViewChild('messageModal') messageModal;
    @ViewChild('promptModal') promptModal;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    // prompt Modal variables
    public promptTitle: string = '';
    public promptContent: string = '';
    public promptCallback: any;

    //Page Variables
    public curPage: number = 1;
    public pageSize: number = 10;
    public totalRecords: number = 1;
    private selectedRow: any = -1;

    private displayProspectMessage: boolean = true;

    //private iNumQuotes;
    //private iNumOpenQuotes;
    private lClosingWO;
    private title: any;

    public menuDefaultOption: Object = {
        'value': '',
        'text': 'Options'
    };

    public pageId: string = '';
    public controls = [
        { name: 'ProspectNumber', disabled: true },
        { name: 'ProspectName', disabled: true },
        { name: 'ProspectType', disabled: true },
        { name: 'QuoteNumber', disabled: true },

        //hidden
        { name: 'Misc' },
        { name: 'dlBatchRef' },
        { name: 'dlContractRef' },
        { name: 'ContractTypeCode' },
        { name: 'DisQuoteTypeCode' },
        { name: 'DisContractTypeCode' },
        { name: 'QuoteTypeCode' },
        { name: 'PassQuoteTypeCode' },
        { name: 'EmployeeCode' },
        { name: 'EmployeeSurName' },
        { name: 'QuotePassWONumber' },
        { name: 'QuotePassAction' },
        { name: 'PassWONumber' },
        { name: 'PaymentInfoRequired' },
        { name: 'SubSystem' },
        { name: 'ReportParams' },
        { name: 'ForceEntryLostCodes' }
    ];

    private headerParams: any = {
        method: 'prospect-to-contract/maintenance',
        module: 'advantage',
        operation: 'Sales/iCABSSPipelineQuoteGrid'
    };

    constructor(injector: Injector, public backService: VariableService) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSPIPELINEQUOTEGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Advantage Quotes';
        this.promptTitle = 'Message';

        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.riMaintenance_AfterEvent();
        } else {
            this.pageParams.menuArray = [];
            this.menu.defaultOption = this.menuDefaultOption;
            this.loadSpeedScript();
        }
        this.title = this.getTranslatedValue(this.pageTitle).subscribe(res => {
            this.utils.setTitle(res);
        });
    }

    ngOnDestroy(): void {
        if (this.backService.getBackClick()) {
            this.riExchange.setParentHTMLValue('QuotePassAction', this.getControlValue('QuotePassAction'));
            this.riExchange.setParentHTMLValue('WarnOpenWOrders', this.pageParams.scWarnOpenWOrders);
        }
        super.ngOnDestroy();
        if (this.title) {
            this.title.unsubscribe();
        }
    }

    private loadSpeedScript(): void {
        let sysCharNumbers = [
            this.sysCharConstants.SystemCharWarnWhenOpenWOOnLeaveOfSOQuoteGrid
        ];

        let sysCharIP = {
            operation: 'iCABSSPipelineQuoteGrid',
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharNumbers.toString()
        };

        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            this.pageParams.scWarnOpenWOrders = data['records'][0].Required;
            this.onLoad();
        });
    }

    /**
     * On Window Load
     */
    private onLoad(): void {
        this.setControlValue('ProspectNumber', this.riExchange.getParentHTMLValue('PassProspectNumber'));
        this.setControlValue('ProspectName', this.riExchange.getParentHTMLValue('PassProspectName'));
        this.setControlValue('ProspectType', this.riExchange.getParentHTMLValue('ProspectTypeDesc') + '/' + this.riExchange.getParentHTMLValue('ProspectSourceDesc'));
        this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
        this.setControlValue('EmployeeSurName', this.riExchange.getParentHTMLValue('EmployeeSurName'));
        this.riExchange.getParentHTMLValue('SubSystem');

        this.getDefaults();
        this.setControlValue('QuotePassAction', 'UnSet');
        this.buildGrid();
        this.riGrid_BeforeExecute();
    }

    /**
     * Call Default Value
     */
    private getDefaults(): void {
        let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '6');
        queryParams.set(this.serviceConstants.Function, 'GetDefaults');
        queryParams.set('ProspectNumber', this.getControlValue('ProspectNumber'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                let valArray = data.MenuOptionCodeList.split(String.fromCharCode(10), -1, 1);
                let descArray = data.MenuOptionDescList.split(String.fromCharCode(10), -1, 1);
                this.pageParams.quoteReviewReportName = data.QuoteReviewReportName;
                this.pageParams.customerQuoteReportName = data.CustomerQuoteReportName;
                this.pageParams.photosRequiredInd = data.PhotosRequiredInd;

                for (let i = 0; i < valArray.length; i++) {
                    this.pageParams.menuArray.push({
                        'value': valArray[i],
                        'text': descArray[i]
                    });
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('QuoteNumber', 'SOQuote', 'QuoteNumber', MntConst.eTypeTextFree, 5);
        this.riGrid.AddColumn('QuotMntConst.eTypeCode', 'SOQuote', 'QuotMntConst.eTypeCode', MntConst.eTypeCode, 4);
        this.riGrid.AddColumn('InPipeline', 'SOQuote', 'InPipeline', MntConst.eTypeImage, 0, true);
        this.riGrid.AddColumn('CreatedDate', 'SOQuote', 'CreatedDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('EffectiveDate', 'SOQuote', 'EffectiveDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('StatusDesc', 'SOQuote', 'StatusDesc', MntConst.eTypeTextFree, 10);
        this.riGrid.AddColumn('NumPremises', 'SOQuote', 'NumPremises', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('NumServiceCovers', 'SOQuote', 'NumServiceCovers', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('MasterValue', 'SOQuote', 'MasterValue', MntConst.eTypeCurrency, 8);
        this.riGrid.AddColumn('Value', 'SOQuote', 'Value', MntConst.eTypeCurrency, 8);
        this.riGrid.AddColumn('Submit', 'SOQuote', 'Submit', MntConst.eTypeButton, 4);
        this.riGrid.AddColumn('Print', 'SOQuote', 'Print', MntConst.eTypeImage, 1);
        this.riGrid.AddColumn('Info', 'dlHistory', 'Info', MntConst.eTypeImage, 1);

        this.riGrid.AddColumnAlign('QuoteNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('CreatedDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('NumPremises', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('NumServiceCovers', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('QuoteNumber', true);
        this.riGrid.AddColumnOrderable('QuotMntConst.eTypeCode', true);
        this.riGrid.AddColumnOrderable('CreatedDate', true);
        this.riGrid.AddColumnOrderable('EffectiveDate', true);

        this.riGrid.AddColumnAlign('EffectiveDate', MntConst.eAlignmentCenter);

        this.riGrid.Complete();
    }

    /**
     * Populates Grid
     */
    public riGrid_BeforeExecute(): void {
        let gridQueryParams: URLSearchParams = new URLSearchParams();
        gridQueryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridQueryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        gridQueryParams.set(this.serviceConstants.Action, '2');
        gridQueryParams.set(this.serviceConstants.GridHandle, this.utils.gridHandle);
        gridQueryParams.set(this.serviceConstants.GridMode, '0');
        gridQueryParams.set(this.serviceConstants.GridCacheRefresh, 'True');
        gridQueryParams.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        gridQueryParams.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        gridQueryParams.set(this.serviceConstants.GridPageSize, '10');
        gridQueryParams.set(this.serviceConstants.GridPageCurrent, this.curPage.toString());
        gridQueryParams.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        gridQueryParams.set('ProspectNumber', this.getControlValue('ProspectNumber'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, gridQueryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.curPage = 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                    this.riGrid.RefreshRequired();
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riGrid_AfterExecute(): void {
        this.riGrid.SetDefaultFocus();
        if (!this.riGrid.Update) {
            // RG - Show a message if no records exist within the grid - first time in
            if (this.displayProspectMessage) {
                this.displayProspectMessage = false;
            }

            // The following returns '0' when no records present
            if (this.riGrid.HTMLGridBody.children.length === 0) {
                this.messageModal.content = 'Please ensure that you have verified the prospect details before proceeding';
                this.messageModal.show();
            }

            this.SOQuoteFocus(this.riGrid.HTMLGridBody.children[0].children[0].children[0].children[0]);
        }
    }

    private riMaintenance_AfterEvent(): void {
        this.buildGrid();
        this.riGrid.Update = false;
        this.riGrid_BeforeExecute();
    }

    public riGrid_headerClick(event: any): void {
        this.riGrid_BeforeExecute();
    }

    /**
     * OnQuote Row Focus
     */
    private SOQuoteFocus(rsrcElement: any): void {
        rsrcElement.focus();

        switch (this.riGrid.CurrentColumnName) {
            case 'QuoteNumber':
            case 'EffectiveDate':
            case 'NumPremises':
            case 'StatusDesc':
                rsrcElement.select();
                rsrcElement.focus();
                this.setAttribute('QuoteNumber', this.riGrid.Details.GetValue('QuoteNumber'));
                this.setControlValue('QuoteNumber', this.riGrid.Details.GetValue('QuoteNumber'));
                break;
            case 'InPipeline':
                rsrcElement.focus();
                this.setAttribute('QuoteNumber', this.riGrid.Details.GetValue('QuoteNumber'));
                this.setControlValue('QuoteNumber', this.riGrid.Details.GetValue('QuoteNumber'));
                break;
        }
        this.setAttribute('QuoteNumber', this.riGrid.Details.GetValue('QuoteNumber'));
        this.setControlValue('QuoteNumber', this.riGrid.Details.GetValue('QuoteNumber'));
        this.setAttribute('dlContractRowID', this.riGrid.Details.GetAttribute('QuoteNumber', 'RowID'));
        this.setAttribute('ContractTypeCode', this.riGrid.Details.GetAttribute('StatusDesc', 'additionalproperty'));
        this.setAttribute('ProspectName', this.getControlValue('ProspectName'));

        this.setControlValue('PassQuoteTypeCode', this.riGrid.Details.GetValue('QuotMntConst.eTypeCode'));

        this.setControlValue('dlContractRef', this.riGrid.Details.GetAttribute('QuoteNumber', 'additionalproperty'));
        this.setControlValue('dlBatchRef', this.riGrid.Details.GetAttribute('NumPremises', 'additionalproperty'));
        this.setControlValue('PaymentInfoRequired', this.riGrid.Details.GetAttribute('NumServiceCovers', 'additionalproperty'));
        this.setControlValue('ContractTypeCode', this.riGrid.Details.GetAttribute('StatusDesc', 'additionalproperty'));
        this.setControlValue('DisContractTypeCode', this.riGrid.Details.GetAttribute('CreatedDate', 'additionalproperty'));
        this.setControlValue('ForceEntryLostCodes', this.riGrid.Details.GetAttribute('EffectiveDate', 'additionalproperty'));
    }

    /**
     * On Grid Click
     */
    public riGrid_BodyOnClick(event: any): void {
        this.SOQuoteFocus(event.srcElement);

        switch (this.riGrid.CurrentColumnName) {
            case 'Submit':
                let lCanSubmit = true;
                if (this.pageParams.photosRequiredInd === 'Y') {
                    lCanSubmit = false;
                    this.showDialog('Do you have Photographic Evidence of the problem?', 'PhotographicEvidence', function (): void {
                        //this.showDialogSecond('About To Cancel Quote', function (): void {
                        lCanSubmit = true;
                        this.onCanSubmit(lCanSubmit);
                        //});
                    });
                } else {
                    this.onCanSubmit(lCanSubmit);
                }
                break;
            case 'Print':
                if (this.utils.hasClass(event.srcElement, 'pointer')) {
                    this.cmdCustomerQuote_onclick();
                }
                break;
            case 'Info':
                if (this.utils.hasClass(event.srcElement, 'pointer')) {
                    let info = this.riGrid.Details.GetAttribute('Info', 'AdditionalProperty').replace(/\r/g, '\n');
                    this.modalAdvService.emitMessage(new ICabsModalVO(info, 'Information'));
                }
        }
    }

    /**
     * On double click
     */
    public riGrid_BodyOnDblClick(data: any): void {
        this.riGrid.Update = false;
        let cellIndex: number = data.cellIndex;
        let columnName: string = this.riGrid.CurrentColumnName;
        this.SOQuoteFocus(event.srcElement);
        switch (columnName) {
            case 'QuoteNumber':
                if (this.getControlValue('PassQuoteTypeCode') === 'DEL' ||
                    this.getControlValue('PassQuoteTypeCode') === 'TER') {
                    this.quoteLostBusinessCodes();
                }
                else if (this.getControlValue('PassQuoteTypeCode') === 'RED' ||
                    this.getControlValue('PassQuoteTypeCode') === 'AMD') {
                    this.navigate('SOQuote', InternalMaintenanceSalesModuleRoutes.ICABSSDLCONTRACTMAINTENANCE, {
                        'PipelineAmend': 'PipelineAmend',
                        'dlContractRowID': this.attributes.dlContractRowID
                    });
                } else {
                    this.navigate('SOQuote', InternalMaintenanceSalesModuleRoutes.ICABSSDLCONTRACTMAINTENANCE, {
                        'dlContractRowID': this.attributes.dlContractRowID
                    });
                }
                break;
            case 'InPipeline':
                this.selectQuote();
                break;
            case 'EffectiveDate':
                if (this.getControlValue('PassQuoteTypeCode') === 'NEW' ||
                    this.getControlValue('PassQuoteTypeCode') === 'AMD') {
                    this.navigate('SOQuoteEffectiveDate', InternalMaintenanceSalesModuleRoutes.ICABSSDLCONTRACTMAINTENANCE, {
                        'EffectiveDate': 'EffectiveDate',
                        'ContractTypeCode': this.getControlValue('ContractTypeCode'),
                        'dlContractRowID': this.attributes.dlContractRowID
                    });
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotCovered + ' - iCABSSdlContractLostBusinessMaintenance'));
                    // this.navigate('SOQuote', 'maintenance/dlContractLostBusinessMaintenance'); // iCABSSdlContractLostBusinessMaintenance
                }
                break;
            case 'StatusDesc':
                this.setControlValue('ReportParams', this.attributes.dlContractRowID);
                this.navigate('SOQuote', InternalMaintenanceSalesModuleRoutes.ICABSSSOQUOTESTATUSMAINTENANCE);
                break;
            case 'NumPremises':
                if (this.getControlValue('PassQuoteTypeCode') === 'DEL') {
                    //this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotCovered + ' - iCABSSPipelinePremiseGrid'));
                    this.navigate('QuoteDEL', InternalGridSearchSalesModuleRoutes.ICABSSPIPELINEPREMISEGRID, {
                        'QuoteTypeCode': this.getControlValue('PassQuoteTypeCode')
                    });
                } else {
                    //this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotCovered + ' - iCABSSPipelinePremiseGrid'));
                    this.navigate('Quote', InternalGridSearchSalesModuleRoutes.ICABSSPIPELINEPREMISEGRID, {
                        'QuoteTypeCode': this.getControlValue('PassQuoteTypeCode')
                    });
                }
                break;
            case 'NumServiceCovers':
                this.attributes.dlPremiseRef = 'All';
                this.navigate('SOQuote', InternalGridSearchSalesModuleRoutes.ICABSSSOSERVICECOVERGRID);
                break;
        }
    }

    private onCanSubmit(lCanSubmit: boolean): void {
        // let lCanSubmit = true;
        if (lCanSubmit) {
            if (this.getControlValue('ForceEntryLostCodes') === 'yes') {
                this.quoteLostBusinessCodes();
            } else {
                // Just To Be Sure Ask When Performing A Termination - That They Know What They Are About To Do!
                lCanSubmit = true;
                if (this.getControlValue('PassQuoteTypeCode') === 'TER') {
                    lCanSubmit = false;
                    this.showDialog('You are about to Submit a Contract Termination. Are you sure?', 'PerformingATermination', function (): void {
                        //this.showDialog('You are about to Submit a Contract Termination. Are you sure?', function (): void {
                        lCanSubmit = true;
                    });
                }
                if (lCanSubmit) {
                    this.processSubmitRequest();
                }
            }
        }
    }

    private processSubmitRequest(): void {
        // Used back in the prospect grid to auto run workorder maintenance
        this.setControlValue('QuotePassAction', 'Submit');

        if (this.getControlValue('PaymentInfoRequired') === '0') {
            let queryParams: URLSearchParams = new URLSearchParams();
            queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            queryParams.set(this.serviceConstants.Action, '6');
            queryParams.set(this.serviceConstants.Function, 'Submit');
            queryParams.set('ProspectNumber', this.getControlValue('ProspectNumber'));
            queryParams.set('QuoteNumber', this.getControlValue('QuoteNumber'));

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                    } else {
                        if (data.ReturnMessage) {
                            this.modalAdvService.emitMessage(new ICabsModalVO(data.ReturnMessage));
                        }
                        this.riGrid_BeforeExecute();
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        } else {
            this.navigate('SOQuote', InternalMaintenanceSalesModuleRoutes.ICABSSSOQUOTESUBMITMAINTENANCE);
        }
    }

    /**
     * Get Lost Business Codes
     */
    private quoteLostBusinessCodes(): void {
        // Allow Update Of The Lost Business Codes For RED/DEL/TER Quote Types
        if (this.getControlValue('PassQuoteTypeCode') === 'RED') {
            alert('Page not developed. - iCABSSdlContractLostBusinessMaintenance');
            // this.navigate('SOQuote', 'sales/iCABSSdlContractLostBusinessMaintenance?<LostBusiness>');
        } else {
            alert('Page not developed. - iCABSSdlContractLostBusinessMaintenance');
            //this.navigate('SOQuote', 'sales/iCABSSdlContractLostBusinessMaintenance?<ContactOutcome,LostBusiness>');
        }
    }

    public riGrid_BodyOnKeyDown(event: any): void {
        let totalRowCount = this.riGrid.HTMLGridBody.children.length;
        switch (event.keyCode) {
            case 38: //'Up Arror
                if ((this.riGrid.CurrentRow > 0))
                    this.SOQuoteFocus(this.riGrid.CurrentHTMLRow.previousSibling.children[this.riGrid.CurrentCell].children[0].children[0]);
                break;
            case 40:
            case 9: // 'Down Arror Or Tab
                if ((this.riGrid.CurrentRow >= 0) && (this.riGrid.CurrentRow < totalRowCount - 3))
                    this.SOQuoteFocus(this.riGrid.CurrentHTMLRow.nextSibling.children[this.riGrid.CurrentCell].children[0].children[0]);
                break;
            default:
                break;
        }
    }

    private riExchange_UpDateHTMLDocument(): void {
        this.riGrid.Update = false;
        this.riGrid_BeforeExecute();
    }

    /**
     * On Menu Change
     */
    public onMenuSelect(type: string): void {
        switch (type) {
            case 'NEWC':
            case 'NEWJ':
            case 'ADD':
            case 'AMD':
            case 'DEL':
            case 'RED':
            case 'TER':
                this.addQuote();
                this.setControlValue('QuotePassAction', 'New');
                break;
            case 'WorkOrders':
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotCovered + ' - iCABSCMWorkOrderGrid'));
                break;
            case 'ApprovalGrid':
                this.navigate('PipelineQuoteGrid', InternalGridSearchSalesModuleRoutes.ICABSSDLCONTRACTAPPROVALGRID);
                break;

        }
    }

    /**
     * On Option Menu change
     */
    public menu2_onchange(type: string): void {
        switch (type) {
            case 'CustomerQuote':
                this.cmdCustomerQuote_onclick();
                break;

            case 'History':
                this.navigate('SOQuote', InternalGridSearchSalesModuleRoutes.ICABSSDLHISTORYGRID);
                break;
        }
    }

    private cmdCustomerQuote_onclick(): void {
        let printQueryParams: URLSearchParams = new URLSearchParams();
        printQueryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        printQueryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        printQueryParams.set(this.serviceConstants.Action, '6');
        printQueryParams.set('riCacheControlMaxAge', '0');
        printQueryParams.set('dlContractROWID', this.getAttribute('dlContractRowID'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, printQueryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotCovered + ' - ' + this.pageParams.customerQuoteReportName));
                    //window.open( this.pageParams.customerQuoteReportName + data.url, '_blank');
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    /**
     * On Add Quote
     */
    private addQuote(): void {

        if (this.menu.selectedItem === 'NEWJ') {
            this.attributes.ContractTypeCode = 'J';
        } else {
            this.attributes.ContractTypeCode = 'C';
        }

        let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '6');
        queryParams.set('Function', this.menu.selectedItem);
        queryParams.set('NegBranchNumber', this.utils.getBranchCode());
        queryParams.set('ProspectNumber', this.getControlValue('ProspectNumber'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.attributes.dlContractRowID = data.dlContractRowID;
                    if (this.menu.selectedItem === 'NEWJ' || this.menu.selectedItem === 'NEWC') {
                        this.attributes.dlPremiseRowID = data.dlPremiseRowID;
                        this.attributes.ContractSearchPostCode = data.ContractSearchPostCode;
                        this.navigate('AddQuote', InternalMaintenanceSalesModuleRoutes.ICABSSDLCONTRACTMAINTENANCE, {
                            'dlContractRowID': this.attributes.dlContractRowID
                        });
                    } else {
                        this.riGrid_BeforeExecute();
                    }
                    if (this.getControlValue('ForceEntryLostCodes') === 'yes') {
                        this.quoteLostBusinessCodes();
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /**
     * Select Quote
     */
    private selectQuote(): void {
        let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '6');
        queryParams.set(this.serviceConstants.Function, 'updateSingle');
        queryParams.set('ProspectNumber', this.getControlValue('ProspectNumber'));
        queryParams.set('QuoteNumber', this.getControlValue('QuoteNumber'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.riGrid_BeforeExecute();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /**
     * Prompt for Confirm Record
     */
    public promptSave(e: any): void {
        if (this.promptCallback && typeof this.promptCallback === 'function') {
            this.promptCallback.call();
        }
    }

    /**
     * Jumps to page
     */
    public getCurrentPage(data: any): void {
        this.curPage = data.value;
        this.buildGrid();
    }

    public promptYes(event: Event): void {
        if (this.promptCallback && typeof this.promptCallback === 'function') {
            this.promptCallback.call(this);
        }
    }

    public showDialog(message: string, title: string, fncallback?: any): void {
        this.promptCallback = fncallback;
        switch (title) {
            case 'PerformingATermination':
                this.promptContent = MessageConstant.Message.PerformingATermination;
                break;
            case 'AnopenWorkOrderexists':
                this.promptContent = MessageConstant.Message.AnopenWorkOrderexists;
                break;
            case 'PhotographicEvidence':
                this.promptContent = MessageConstant.Message.PhotographicEvidence;
                break;
            default:
                break;
        }
        this.promptModal.show();
    }
}
