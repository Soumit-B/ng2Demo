import { MessageConstant } from './../../../shared/constants/message.constant';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit, Renderer } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { LocalStorageService } from 'ng2-webstorage';
import { Subscription } from 'rxjs/Subscription';
import { InternalGridSearchModuleRoutes, AppModuleRoutes, InternalGridSearchSalesModuleRoutes, InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { TableComponent } from './../../../shared/components/table/table';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';

@Component({
    templateUrl: 'iCABSSSOQuoteGrid.html'
})

export class QuoteGridComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('quotePagination') quotePagination: PaginationComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;

    public itemsPerPage: number;
    public pageSize: number;
    public gridCurPage: number;
    public totalRecords: number = 0;
    public totalPageCount: number = 0;
    public displayProspectMessage = true;
    public translatedMessageList = {};

    public showMessageHeader: boolean = true;
    public promptTitle: string = '';
    public promptContent: string = '';
    public showErrorHeader: boolean = true;

    public muleConfig: any = {
        operation: 'Sales/iCABSSSOQuoteGrid',
        module: 'advantage',
        method: 'prospect-to-contract/maintenance'
    };

    public pageId: string = '';
    public lookUpSubscription: Subscription;
    public misc: any = {};

    public controls = [
        { name: 'ProspectNumber', readonly: true, disabled: false, required: false },
        { name: 'ProspectName', readonly: true, disabled: false, required: false },
        { name: 'menu', value: '', readonly: false, disabled: false, required: false },
        { name: 'dlBatchRef' },
        { name: 'dlContractRef' },
        { name: 'ContractTypeCode' },
        { name: 'PaymentInfoRequired' },
        { name: 'SubSystem' },
        { name: 'QuoteNumber' }
    ];

    constructor(
        private renderer: Renderer,
        injector: Injector
    ) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSSOQUOTEGRID;
    }


    ngOnInit(): void {
        super.ngOnInit();
        this.itemsPerPage = 10;
        this.gridCurPage = 1;
        this.pageSize = 10;
        this.totalPageCount = 0;
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProspectNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProspectName');

        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectName', this.riExchange.getParentHTMLValue('ProspectName'));
        let subSystem = this.riExchange.getParentHTMLValue('SubSystem');
        this.setControlValue('menu', '');
        this.buildGrid();
    }

    public ngAfterViewInit(): void {
        //console.log('--this.riGrid--', this.riGrid);
        this.setErrorCallback(this);
        this.setMessageCallback(this);
    }

    public setLocalizationText(): void {
        this.translatedMessageList['Please_ensure_that_you_have_verified_the_prospect_details_before_proceeding'] =
            MessageConstant.PageSpecificMessage.Please_ensure_that_you_have_verified_the_prospect_details_before_proceeding;
        this.translatedMessageList['Information'] = MessageConstant.Message.Information;
    }


    public menu_onchange(val: string): void {
        if (this.riGrid && !this.riGrid.CurrentRow) {
            if (this.riGrid.bodyArray.length > 0) {
                this.SetDefaultFocus();
                this.riGrid.Details.Focus('QuoteNumber');
                this.SOQuoteFocus();
            }
        }

        switch (val) {
            case 'AddContract':
            case 'AddJob':
                this.AddQuote();
                break;
            case 'CopyToContract':
            case 'CopyToJob':
                this.CopyQuote();
                break;
            case 'CustomerQuote':
                this.cmdCustomerQuote_onclick();
                break;
            case 'History':
                this.cmdHistory_onclick();
                break;
        }
    }


    public buildGrid(): any {

        this.riGrid.Clear();
        this.riGrid.AddColumn('QuoteNumber', 'SOQuote', 'QuoteNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('ContractTypeCode', 'SOQuote', 'ContractTypeCode', MntConst.eTypeCode, 1);
        this.riGrid.AddColumn('CreatedDate', 'SOQuote', 'CreatedDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('StatusDesc', 'SOQuote', 'StatusDesc', MntConst.eTypeTextFree, 10);
        this.riGrid.AddColumn('NumPremises', 'SOQuote', 'NumPremises', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('NumServiceCovers', 'SOQuote', 'NumServiceCovers', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('Submit', 'SOQuote', 'Submit', MntConst.eTypeButton, 4);
        this.riGrid.AddColumn('Print', 'SOQuote', 'Print', MntConst.eTypeImage, 1);
        this.riGrid.AddColumn('Info', 'dlHistory', 'Info', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('QuoteNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ContractTypeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('CreatedDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('NumPremises', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('NumServiceCovers', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('QuoteNumber', true);
        this.riGrid.AddColumnOrderable('CreatedDate', true);

        this.riGrid.Complete();
        this.riGrid_beforeExecute();
    }


    public riGrid_beforeExecute(): void {
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;

        let gridHandle = (Math.floor(Math.random() * 900000) + 100000).toString();
        let gridQueryParams: URLSearchParams = new URLSearchParams();

        let strGridData = true;
        gridQueryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridQueryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        gridQueryParams.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        gridQueryParams.set(this.serviceConstants.Action, '2');

        gridQueryParams.set('ProspectNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProspectNumber'));
        gridQueryParams.set('LanguageCode', this.riExchange.LanguageCode());
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridQueryParams.set('riSortOrder', sortOrder);
        gridQueryParams.set('riCacheRefresh', 'true');
        gridQueryParams.set('riGridMode', '0');
        gridQueryParams.set('riGridHandle', gridHandle);
        gridQueryParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        gridQueryParams.set(this.serviceConstants.PageCurrent, this.gridCurPage.toString());

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, gridQueryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data) {
                    if (data && data.errorMessage) {
                        this.messageModal.show(data, true);
                    } else {
                        this.gridCurPage = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.Execute(data);
                        // this.riGrid_AfterExecute();
                    }
                }

            },
            (error) => {
                this.logger.log('Error', error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public SetDefaultFocus(): void {
        let focus = new CustomEvent('focus', {});
        let obj = document.querySelector('td[name=QuoteNumber]').querySelectorAll('input[type=text]');
        if (obj && obj.length > 0) {
            this.renderer.invokeElementMethod(obj[0], 'focus', [focus]);
        }
    }


    public SOQuoteFocus(): any {
        this.attributes.dlContractRowID = this.riGrid.Details.GetAttribute('QuoteNumber', 'RowID');
        this.attributes.ContractTypeCode = this.riGrid.Details.GetValue('ContractTypeCode');
        this.attributes.ProspectName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProspectName');
        this.attributes.QuoteNumber = this.riGrid.Details.GetValue('QuoteNumber');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlContractRef', this.riGrid.Details.GetAttribute('QuoteNumber', 'AdditionalProperty'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlBatchRef', this.riGrid.Details.GetAttribute('ContractTypeCode', 'AdditionalProperty'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PaymentInfoRequired', this.riGrid.Details.GetAttribute('CreatedDate', 'AdditionalProperty'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.riGrid.Details.GetValue('ContractTypeCode'));
        //this.riGrid.Details.Focus('QuoteNumber');
    }

    public riGrid_AfterExecute(): any {
        //' RG - Show a message if no records exist within the grid - first time in
        if (this.displayProspectMessage === true) {
            this.displayProspectMessage = false;

            //' The following returns '0' when no records present
            if (this.riGrid.bodyArray.length === 0) {
                this.messageModal.show({ msg: MessageConstant.PageSpecificMessage.Please_ensure_that_you_have_verified_the_prospect_details_before_proceeding, title: MessageConstant.Message.Information }, false);
            }
        }
    }

    public riGrid_Sort(event: any): void {
        this.riGrid_beforeExecute();
    }

    public updateColumnData(ev: Event): void {
        // TODO:
    }

    public getCurrentPage(currentPage: any): void {
        this.gridCurPage = currentPage.value;
        this.riGrid_beforeExecute();
    }

    public refresh(): void {
        this.gridCurPage = 1;
        this.riGrid_beforeExecute();
    }

    public cmdPremises_onclick(): any {
        //riExchange.Mode = "Quote": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Sales/iCABSSSOPremiseGrid.htm"
        this.navigate('Quote', InternalGridSearchSalesModuleRoutes.ICABSSSOPREMISEGRID);
    }

    public cmdCustomerQuote_onclick(): any {
        let strURL;

        let urlPostData = {
            'Function': 'Single',
            'dlContractRowID': this.attributes['dlContractRowID'] ? this.attributes['dlContractRowID'] : '',
            'LanguageCode': this.riExchange.LanguageCode(),
            'Mode': 'Quote'
        };


        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('', urlPostData).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.status === 'failure') {
                    this.errorService.emitError(data.oResponse);
                } else {
                    if (data.errorMessage) {
                        this.errorService.emitError(data['errorMessage']);
                    }
                    else {
                        if (data.url) {
                            window.open(data.url, '_blank');
                        }
                    }
                }

            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public cmdHistory_onclick(): any {
        //riExchange.Mode = "SOQuote": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Sales/iCABSSdlHistoryGrid.htm"
        this.navigate('SOQuote', InternalGridSearchSalesModuleRoutes.ICABSSDLHISTORYGRID);
    }

    public AddQuote(): any {
        let option = this.riExchange.riInputElement.GetValue(this.uiForm, 'menu');
        if (option === 'AddContract') {
            this.attributes.ContractTypeCode = 'C';
        } else {
            this.attributes.ContractTypeCode = 'J';
        }

        let functionName = option;

        let postDataAdd = {
            'Function': functionName,
            'NegBranchNumber': this.utils.getBranchCode(),
            'ProspectNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProspectNumber')
        };


        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData(functionName, {}, postDataAdd).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.status === 'failure') {
                    this.errorService.emitError(data.oResponse);
                } else {
                    if (data.errorMessage) {
                        this.errorService.emitError(data['errorMessage']);
                    }
                    else {
                        if (data) {
                            this.attributes.dlContractRowID = data['dlContractRowID'];
                            this.attributes.dlPremiseRowID = data['dlPremiseRowID'];
                            this.attributes.ContractSearchPostCode = data['ContractSearchPostCode'];
                            //riExchange.Mode = 'AddQuote'
                            //window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Sales/iCABSSdlContractMaintenance.htm'
                            this.navigate('AddQuote', InternalMaintenanceSalesModuleRoutes.ICABSSDLCONTRACTMAINTENANCE, { dlContractRowID: this.attributes.dlContractRowID });
                        }
                    }
                }

            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public CopyQuote(): any {
        let functionName = this.riExchange.riInputElement.GetValue(this.uiForm, 'menu');

        if (functionName === 'AddContract') {
            this.attributes.ContractTypeCode = 'C';
        } else {
            this.attributes.ContractTypeCode = 'J';
        }

        let postDataAdd = {
            'Function': functionName,
            'NegBranchNumber': this.utils.getBranchCode(),
            'ProspectNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProspectNumber'),
            'QuoteNumber': this.riGrid.Details.GetValue('QuoteNumber')
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData(functionName, {}, postDataAdd).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.status === 'failure') {
                    this.errorService.emitError(data.oResponse);
                } else {
                    if (data.errorMessage) {
                        this.errorService.emitError(data['errorMessage']);
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

        this.refresh();
    }

    public riGrid_BodyOnClick(ev: any): any {
        switch (this.riGrid.CurrentColumnName) {
            case 'Submit':
                this.SOQuoteFocus();
                //' RG 30/04/2008 - If no payment information is required then submit the quote now
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PaymentInfoRequired') === '0') {
                    let postDataAdd = {
                        'Function': 'Submit',
                        'ProspectNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProspectNumber'),
                        'QuoteNumber': this.riGrid.Details.GetValue('QuoteNumber')
                    };

                    this.ajaxSource.next(this.ajaxconstant.START);
                    this.fetchRecordData('Submit', {}, postDataAdd).subscribe(
                        (data) => {
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                            if (data && data.status === 'failure') {
                                this.errorService.emitError(data.oResponse);
                            } else {
                                if (data && data.errorMessage) {
                                    this.errorService.emitError(data['errorMessage']);
                                }
                                else {
                                    if (data) {
                                        let msg = data['fullError'];
                                        let error = msg.split('\n');
                                        let errormsg = error[1].replace('', '');
                                        this.messageService.emitMessage(errormsg);
                                    }
                                    this.refresh();
                                }
                            }

                        },
                        (error) => {
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        });

                }
                else {
                    //' richy
                    //' RG 30/04/2008 - Payment details are required
                    //  WindowPath='/wsscripts/riHTMLWrapper.p?riFileName=Sales/iCABSSSOQuoteSubmitMaintenance.htm<bottom>'
                    //  riExchange.Mode = 'SOQuote' : window.location = WindowPath
                    alert('TODO: Sales/iCABSSSOQuoteSubmitMaintenance.htm');
                }
                break;
            case 'Print':
                let strURL;
                this.SOQuoteFocus();
                //' Do not allow print if local offline system
                if ((ev.srcElement && ev.srcElement.tagName === 'IMG') && ev.srcElement.getAttribute('src')) {
                    let ReportParams;
                    ReportParams = { riCacheControlMaxAge: 0, dlContractROWID: this.attributes['dlContractRowID'] };
                    //' Run The Localised Version Of the Quote Review HTML Report
                    //window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Sales/iCABSSOQuoteReviewReport.htm' & ReportParams
                    alert('TODO: Sales/iCABSSOQuoteReviewReport.htm');
                }
                break;
            case 'Info':
                if ((ev.srcElement && ev.srcElement.tagName === 'IMG') && ev.srcElement.getAttribute('src')) {  //' hand
                    if (this.riGrid.Details.GetAttribute('Info', 'AdditionalProperty')) {
                        this.SOQuoteFocus();
                        //call msgbox(riGrid.Functions.Details.getAttribute('Info', 'AdditionalProperty'), vbOKOnly, '<%=riT('Information')%>')
                        this.messageModal.show({ msg: this.riGrid.Details.GetAttribute('Info', 'AdditionalProperty'), title: MessageConstant.Message.Information }, false);
                    }

                }

        }

    }

    public riGrid_BodyOnDblClick(ev: any): any {
        this.SOQuoteFocus();
        switch (this.riGrid.CurrentColumnName) {
            case 'QuoteNumber':
                //WindowPath='/wsscripts/riHTMLWrapper.p?riFileName=Sales/iCABSSdlContractMaintenance.htm'
                // riExchange.Mode = 'SOQuote' : window.location = WindowPath
                this.navigate('SOQuote', InternalMaintenanceSalesModuleRoutes.ICABSSDLCONTRACTMAINTENANCE, {
                    dlContractRowID: this.attributes.dlContractRowID
                });
                break;
            case 'NumPremises':
                this.cmdPremises_onclick();
                break;
            case 'NumServiceCovers':
                this.attributes['dlPremiseRef'] = 'All';
                //WindowPath='/wsscripts/riHTMLWrapper.p?riFileName=Sales/iCABSSSOServiceCoverGrid.htm'
                //riExchange.Mode = 'SOQuote' : window.location = WindowPath
                this.navigate('SOQuote', InternalGridSearchSalesModuleRoutes.ICABSSSOSERVICECOVERGRID);
                break;
            case 'StatusDesc':
                // WindowPath='/wsscripts/riHTMLWrapper.p?riFileName=Sales/iCABSSSOQuoteStatusMaintenance.htm'
                // riExchange.Mode = 'SOQuote': window.location = WindowPath
                this.navigate('SOQuote', InternalMaintenanceSalesModuleRoutes.ICABSSSOQUOTESTATUSMAINTENANCE,
                    { ReportParams: this.attributes.dlContractRowID });
                break;
        }

    }

    public riGrid_BodyOnKeyDown(ev: any): any {
        switch (ev.KeyCode) {
            case 38: //'Up Arror
                if (ev.srcElement.parentElement.parentElement.previousSibling) {
                    this.SOQuoteFocus();
                }
                break;
            case 40:
            case 9: //'Down Arror Or Tab
                if (ev.srcElement.parentElement.parentElement.NextSibling) {
                    this.SOQuoteFocus();
                }
                break;
        }
    }

    public fetchTranslationContent(): void {
        if (this.translatedMessageList) {
            for (let key in this.translatedMessageList) {
                if (key && this.translatedMessageList[key]) {
                    this.getTranslatedValue(this.translatedMessageList[key], null).subscribe((res: string) => {
                        if (res) {
                            this.translatedMessageList[key] = res;
                        }
                        // else {
                        //     this.translatedMessageList[key] = key;
                        // }
                    });
                }
            }
        }
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }
    }

    public fetchRecordData(functionName: any, params: any, postdata?: any): any {

        let queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '0');

        if (functionName !== '') {
            queryParams.set(this.serviceConstants.Action, '6');
        }
        for (let key in params) {
            if (key) {
                queryParams.set(key, params[key]);
            }
        }

        if (postdata) {
            return this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryParams, postdata);
        }
        else {
            return this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryParams);
        }
    }

    public showErrorModal(msg: any): void {
        this.errorModal.show({ msg: msg, title: 'Error' }, false);
    }

    public showMessageModal(msg: any): void {
        this.messageModal.show({ msg: msg, title: 'Message' }, false);
    }

}
