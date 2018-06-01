import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable, ReplaySubject } from 'rxjs';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { AccountSearchComponent } from './../../internal/search/iCABSASAccountSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';

@Component({
    templateUrl: 'iCABSSdlContractApprovalGrid.html'
})

export class ContractApprovalGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riPagination') riPagination: PaginationComponent;
    @ViewChild('userInformationSearch') userInformationSearch: EllipsisComponent;
    @ViewChild('accountSearchEllipsis') accountSearchEllipsis: EllipsisComponent;

    private muleConfig: any = {
        method: 'prospect-to-contract/maintenance',
        module: 'advantage',
        operation: 'Sales/iCABSSdlContractApprovalGrid',
        contentType: 'application/x-www-form-urlencoded'
    };

    public pageId: string = '';
    public ttQuoteType: any[] = [];
    public translatedList: any[] = [];
    public statusSelectData: any[] = [];
    public headerClicked: string;
    public sortType: string;
    public totalRecords: number = 1;
    public pageSize: number = 10;
    public actualPageSize: number = 11;
    public gridCurPage: number = 1;
    public quoteReviewReportName: string = '';
    public reportParams: string = '';
    public vbEnableRouteOptimisation: string = '';
    public lSearchRouting: boolean = false;
    public showErrorHeader: boolean = true;
    public dateFrom: Date = new Date();
    public isDateFromRequired: boolean = false;
    public isPaginationEnabled: boolean = true;

    public ellipsisConfig: any =
    {
        riMUserInformationSearch: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: '',
                currentContractType: '',
                currentContractTypeURLParameter: '',
                showAddNew: true
            },
            modalConfig: '',
            contentComponent: '',
            showHeader: true,
            searchModalRoute: '',
            disabled: false,
            component: ScreenNotReadyComponent
        },
        accountSearch: {
            disabled: false,
            showHeader: true,
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'ContractSearch',
                currentContractType: '',
                showAddNew: false,
                showCountry: false,
                showBusiness: false,
                countryCode: this.utils.getCountryCode(),
                businessCode: this.utils.getBusinessCode(),
                accountNumber: '',
                accountName: '',
                contractName: ''
            },
            component: AccountSearchComponent
        }
    };

    public controls: Array<any> = [
        { name: 'QuoteFilter', readonly: false, disabled: false, required: false, value: ' ' },
        { name: 'EmployeeCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'FilterUserCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'DateFrom', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'UserName', readonly: false, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'ProspectNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'StatusSelect', readonly: false, disabled: false, required: false, value: 'all' },
        { name: 'ContractTypeFilter', readonly: false, disabled: false, required: false, value: 'A' },
        { name: 'MaxValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'dlContractRef', readonly: false, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'PassContractNumber', readonly: false, disabled: false, required: false },
        { name: 'PassContractCommenceDate', readonly: false, disabled: false, required: false },
        { name: 'PassJobCommenceDate', readonly: false, disabled: false, required: false },
        { name: 'Misc' },
        { name: 'dlBatchRef' },
        { name: 'ContractTypeCode' },
        { name: 'SubSystem', value: 'SalesOrder' },
        { name: 'ContractName' },
        { name: 'CustomerLetterRowID' },
        { name: 'BranchNumber' },
        { name: 'PassQuoteTypeCode' },
        { name: 'PremiseAddressLine1' },
        { name: 'PremiseAddressLine2' },
        { name: 'PremiseAddressLine3' },
        { name: 'PremiseAddressLine4' },
        { name: 'PremiseAddressLine5' },
        { name: 'PremisePostcode' },
        { name: 'GPSCoordinateX' },
        { name: 'GPSCoordinateY' },
        { name: 'RoutingGeonode' },
        { name: 'RoutingScore' },
        { name: 'RoutingSource' },
        { name: 'RoutingNode' },
        { name: 'dlPremiseRowID' },
        { name: 'SOPQuoteType' },
        { name: 'SelRoutingSource' },
        { name: 'menu', value: '' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSDLCONTRACTAPPROVALGRID;
        this.browserTitle = this.pageTitle = 'Contract Approval';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.localeTranslateService.setUpTranslation();
        this.fetchTranslationContent();
        this.windowOnLoad();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private windowOnLoad(): void {
        this.pageParams.vEnableRouteOptimisation = false;
        this.getSysCharValue();
    }

    /**
     * Get syschar value from service and assign it into page params
     */
    private getSysCharValue(): void {
        this.fetchSysChar().subscribe(
            (e) => {
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                    return false;
                }
                if (e.records && e.records.length > 0) {
                    this.pageParams.vEnableRouteOptimisation = e.records[0].Required ? e.records[0].Required : false;
                }

                this.loadSpeedScriptData();
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    /**
     * Fetch Speed script specific dependent values from service
     */
    private loadSpeedScriptData(): void {
        this.ttQuoteType = [];
        this.ttQuoteType.push({
            SortSequence: -1,
            QuoteTypeCode: ' ',
            QuoteTypeDesc: this.translatedList['All_Account_Types'] || 'All Account Types'
        });

        let gLanguageCode = this.riExchange.LanguageCode();
        let data = [
            {
                table: 'AccountType',
                query: { 'BusinessCode': this.utils.getBusinessCode() },
                fields: ['BusinessCode', 'AccountTypeCode', 'AccountTypeDesc']
            },
            {
                table: 'AccountTypeLang',
                query: { 'BusinessCode': this.utils.getBusinessCode(), 'LanguageCode': gLanguageCode },
                fields: ['BusinessCode', 'AccountTypeCode', 'LanguageCode']
            }
        ];

        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpRecord(data, 500).subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e['results'] && e['results'].length > 0) {

                    if (e['results'] && e['results'][0].length > 0) {
                        let AccountType: any[] = e['results'][0];
                        let AccountTypeLang: any[] = [];
                        if (e['results'].length > 1 && e['results'][1].length > 0) {
                            AccountTypeLang = e['results'][1];
                        }
                        AccountType.forEach(item => {
                            let filterData = AccountTypeLang.find(langObj => ((langObj.BusinessCode === item.BusinessCode)
                                && (langObj.AccountTypeCode === item.AccountTypeCode)));
                            this.ttQuoteType.push({
                                SortSequence: 0,
                                QuoteTypeCode: item.AccountTypeCode,
                                QuoteTypeDesc: (filterData) ? filterData.AccountTypeDesc : item.AccountTypeDesc
                            });
                        });
                    }

                    this.loadUIFields();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
        );
    }

    private loadUIFields(): any {
        this.disableControl('dlContractRef', true);
        this.disableControl('ContractName', true);
        this.disableControl('UserName', true);
        this.disableControl('EmployeeCode', true);
        this.disableControl('PassContractCommenceDate', true);
        this.disableControl('PassJobCommenceDate', true);
        this.disableControl('PassContractNumber', true);

        if (this.parentMode === 'Approval') {
            this.setControlValue('BranchNumber', this.riExchange.getParentHTMLValue('GroupCode'));
        }
        else {
            this.setControlValue('BranchNumber', this.utils.getBranchCode());
        }
        if (this.parentMode === 'Approval') {
            this.setControlValue('QuoteFilter', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'SOPQuoteType') || '');
        }
        this.getDefaults();
        this.lSearchRouting = true;
    }

    private getDefaults(): any {
        this.statusSelectData = [];
        this.statusSelectData.push({ value: 'all', text: 'All Status' });
        let postData = {
            Function: 'GetStatusTypes',
            BusinessCode: this.utils.getBusinessCode(),
            LanguageCode: this.riExchange.LanguageCode(),
            BranchNumber: this.utils.getBranchCode()
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('GetStatusTypes', {}, postData).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                }
                else {
                    let dt = data['DateFrom'] ? this.parseDateToFixedFormat(data['DateFrom']) : '';
                    this.setControlValue('DateFrom', dt);
                    this.quoteReviewReportName = data.QuoteReviewReportName;
                    this.setControlValue('EmployeeCode', data.EmployeeCode ? data.EmployeeCode : '');
                    this.setControlValue('FilterUserCode', data.FilterUserCode ? data.FilterUserCode : '');
                    this.setControlValue('UserName', data.UserName ? data.UserName : '');
                    if (data.FilterUserCode) {
                        this.disableControl('FilterUserCode', true);
                        this.disableControl('EmployeeCode', true);
                    }
                    if (data.StatusTypes && data.StatusDescs) {
                        let char = String.fromCharCode(10);
                        let statusTypes = data.StatusTypes;
                        let statusDescs = data.StatusDescs;
                        let valArray = statusTypes.split(char);
                        let descArray = statusDescs.split(char);

                        for (let i = 0; i < valArray.length; i++) {
                            if (valArray[i] && descArray[i]) {
                                this.statusSelectData.push({ value: valArray[i], text: descArray[i] });
                                if (valArray[i] === 'SVW') {
                                    this.setControlValue('StatusSelect', valArray[i]);
                                }
                            }
                        }
                    }
                    this.uiForm.updateValueAndValidity();

                    if (this.isReturning()) {
                        this.populateUIFromFormData();
                    }

                    this.buildGrid();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // common function to fetch records
    private fetchRecordData(functionName: any, params: any, postData?: any): any {
        let search: URLSearchParams = this.getURLSearchParamObject();

        if (functionName) {
            search.set(this.serviceConstants.Action, '6');
        }

        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                search.set(key, params[key]);
            }
        }
        if (postData) {
            return this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, search, postData);
        }
        else {
            return this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, search);
        }
    }

    private lookUpRecord(data: any, maxresults: any): any {
        let queryLookUp: URLSearchParams = this.getURLSearchParamObject();
        queryLookUp.set(this.serviceConstants.Action, '0');
        if (maxresults) {
            queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(queryLookUp, data);
    }

    // fetch all the Translation Conten here
    private fetchTranslationContent(): void {
        this.getTranslatedValue('All Account Types', null).subscribe((res: string) => {
            if (res) {
                this.translatedList['All_Account_Types'] = res;
            }
            else {
                this.translatedList['All_Account_Types'] = 'All Account Types';
            }
        });

        this.getTranslatedValue('Information', null).subscribe((res: string) => {
            if (res) {
                this.translatedList['Information'] = res;
            }
            else {
                this.translatedList['Information'] = 'Information';
            }
        });

        this.getTranslatedText();
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }
    }

    // fetch page specific Translated Text using lookup service call
    private getTranslatedText(): any {
        let langCode: string = this.riExchange.LanguageCode();
        let postData1 = {
            translation: 'Review',
            languagecode: langCode,
            methodtype: 'maintenance'
        };
        let postData2 = {
            translation: 'Process DDI',
            languagecode: langCode,
            methodtype: 'maintenance'
        };
        let postData3 = {
            translation: 'Process',
            languagecode: langCode,
            methodtype: 'maintenance'
        };
        let postData4 = {
            translation: 'Completed',
            languagecode: langCode,
            methodtype: 'maintenance'
        };
        let postData5 = {
            translation: 'Signature',
            languagecode: langCode,
            methodtype: 'maintenance'
        };

        let searchParams: Object = {};
        searchParams[this.serviceConstants.Action] = 0;

        Observable.forkJoin(
            this.fetchRecordData('', searchParams, postData1),
            this.fetchRecordData('', searchParams, postData2),
            this.fetchRecordData('', searchParams, postData3),
            this.fetchRecordData('', searchParams, postData4),
            this.fetchRecordData('', searchParams, postData5)).subscribe(
            (e) => {
                if (e && e.length > 0) {
                    if (e[0])
                        this.translatedList['Review'] = e[0]['translation'];
                    if (e[1])
                        this.translatedList['Process_DDI'] = e[1]['translation'];
                    if (e[2])
                        this.translatedList['Process'] = e[2]['translation'];
                    if (e[3])
                        this.translatedList['Completed'] = e[3]['translation'];
                    if (e[4])
                        this.translatedList['Signature'] = e[4]['translation'];
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    //  Validate whether the selected record is the last record of the grid or not.
    private isGridLastRecord(): boolean {
        let rowIndex: number = this.riGrid.CurrentRow;
        let itemCount = this.riGrid.bodyArray.length;
        if ((rowIndex + 1) === itemCount) {
            return true;
        }
        return false;
    }

    private parseDateToFixedFormat(data: any): any {
        let date: string = this.globalize.parseDateToFixedFormat(data).toString();
        return this.globalize.parseDateStringToDate(date);
    }

    private getProcessData(): any {
        let postData2 = {
            Function: 'Process',
            BusinessCode: this.utils.getBusinessCode(),
            LanguageCode: this.riExchange.LanguageCode(),
            dlContractRowID: this.attributes.dlContractRowID || ''
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('Process', '', postData2).subscribe(
            (data2) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data2.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data2.errorMessage, data2.fullError));
                }
                else {
                    if (data2.ReturnMessage) {
                        //this.messageModal.show({ msg: data2['ReturnMessage'] }, false);
                        this.modalAdvService.emitMessage(new ICabsModalVO(data2['ReturnMessage']));
                    }
                    if (data2.ProcurementDetails) {
                        /*
                        TODO:: Page not yet ready. integration is pending for this screen
                                ReportParams = '&riCacheControlMaxAge=0' & _
                                '&dlContractROWID='       & Misc.getAttribute('dlContractRowID')
                                window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Sales/iCABSSOProcurementReport.htm' & ReportParams
                        */
                        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped + ' - iCABSSOProcurementReport.htm'));
                    }

                    this.buildGrid();
                    this.lSearchRouting = true;
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

    private checkGPSReference(): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);

        if (this.riGrid.Details.GetAttribute('NumPremises', 'AdditionalProperty') === '1') {

            let postData = {
                Function: 'GetdlPremiseAddress',
                BusinessCode: this.utils.getBusinessCode(),
                dlContractRowID: this.attributes.dlContractRowID || ''
            };
            this.ajaxSource.next(this.ajaxconstant.START);
            this.fetchRecordData('GetdlPremiseAddress', {}, postData).subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                }
                else {
                    if (this.lSearchRouting) {
                        this.setControlValue('PremiseAddressLine1', data.PremiseAddressLine1);
                        this.setControlValue('PremiseAddressLine2', data.PremiseAddressLine2);
                        this.setControlValue('PremiseAddressLine3', data.PremiseAddressLine3);
                        this.setControlValue('PremiseAddressLine4', data.PremiseAddressLine4);
                        this.setControlValue('PremiseAddressLine5', data.PremiseAddressLine5);
                        this.setControlValue('PremisePostcode', data.PremisePostcode);
                        this.setControlValue('GPSCoordinateX', data.GPSCoordinateX);
                        this.setControlValue('GPSCoordinateY', data.GPSCoordinateY);
                        this.setControlValue('RoutingNode', data.RoutingNode);
                        this.setControlValue('RoutingScore', data.RoutingScore);
                        this.setControlValue('RoutingSource', data.RoutingSource);
                        this.setControlValue('dlPremiseRowID', data.dlPremiseRowID);
                    }
                    else {
                        this.setControlValue('dlPremiseRowID', 'dlPremiseRowID');
                    }

                    if (!data.RoutingSource) {
                        let postData2 = {
                            Function: 'GetGeocodeAddress',
                            AddressLine1: this.getControlValue('PremiseAddressLine1'),
                            AddressLine2: this.getControlValue('PremiseAddressLine2'),
                            AddressLine3: this.getControlValue('PremiseAddressLine3'),
                            AddressLine4: this.getControlValue('PremiseAddressLine4'),
                            AddressLine5: this.getControlValue('PremiseAddressLine5'),
                            Postcode: this.getControlValue('PremisePostcode'),
                            GPSX: this.getControlValue('GPSCoordinateX'),
                            GPSY: this.getControlValue('GPSCoordinateY')
                        };

                        let searchParams: Object = {};
                        searchParams[this.serviceConstants.Action] = 0;

                        this.fetchRecordData('', searchParams, postData2).subscribe(
                            (e) => {
                                if (e.hasError) {
                                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                                }
                                else {
                                    if (e.AddressError && e.AddressError !== 'Error') {
                                        this.setControlValue('GPSCoordinateX', e['GPSX']);
                                        this.setControlValue('GPSCoordinateY', e['GPSY']);
                                        this.setControlValue('RoutingScore', e['Score']);
                                        this.setControlValue('RoutingNode', e['Node']);
                                        if (this.getControlValue('GPSCoordinateX') === '0' ||
                                            this.getControlValue('GPSCoordinateX') === '' ||
                                            this.getControlValue('GPSCoordinateY') === '0' ||
                                            this.getControlValue('GPSCoordinateY') === '') {
                                            retObj.next(false);
                                            return retObj;
                                        }
                                    }
                                    else {
                                        retObj.next(false);
                                        return retObj;
                                    }
                                }
                            });
                    }
                    else {
                        retObj.next(true);
                        return retObj;
                    }

                    let postData3 = {
                        Function: 'SavedlPremiseAddress',
                        dlPremiseRowID: this.getControlValue('dlPremiseRowID'),
                        PremiseAddressLine1: this.getControlValue('PremiseAddressLine1'),
                        PremiseAddressLine2: this.getControlValue('PremiseAddressLine2'),
                        PremiseAddressLine3: this.getControlValue('PremiseAddressLine3'),
                        PremiseAddressLine4: this.getControlValue('PremiseAddressLine4'),
                        PremiseAddressLine5: this.getControlValue('PremiseAddressLine5'),
                        PremisePostcode: this.getControlValue('PremisePostcode'),
                        GPSCoordinateX: this.getControlValue('GPSCoordinateX'),
                        GPSCoordinateY: this.getControlValue('GPSCoordinateY'),
                        RoutingScore: this.getControlValue('RoutingScore'),
                        RoutingNode: this.getControlValue('RoutingNode'),
                        RoutingSource: 'T'
                    };
                    this.ajaxSource.next(this.ajaxconstant.START);
                    this.fetchRecordData('SavedlPremiseAddress', {}, postData3).subscribe(
                        (data3) => {
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                            if (data3.hasError) {
                                this.modalAdvService.emitError(new ICabsModalVO(data3.errorMessage, data3.fullError));
                                retObj.next(false);
                                return retObj;
                            } else {
                                retObj.next(true);
                                return retObj;
                            }
                        },
                        (error) => {
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                            this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                            retObj.next(false);
                            return retObj;
                        });

                }
            },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
        else {
            retObj.next(true);
        }

        return retObj;
    }

    private cmdAccountCheckOnclick(): void {
        this.ellipsisConfig.accountSearch.childConfigParams['contractName'] = this.getControlValue('ContractName');
        this.ellipsisConfig.accountSearch.childConfigParams['searchValue'] = this.getControlValue('ContractName');
        this.ellipsisConfig.accountSearch.childConfigParams['isSearchValueDisabled'] = true;
        if (this.accountSearchEllipsis) {
            this.accountSearchEllipsis.updateComponent();
            setTimeout(() => {
                this.accountSearchEllipsis.openModal();
            }, 10);
        }
    }

    private cmdCalculatedValueOnclick(): void {
        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped + ' - Sales/iCABSSdlContractValueGrid.htm'));
        //TODO: target page is not yet ready. this.navigate('Approval', 'Sales/iCABSSdlContractValueGrid.htm');
    }

    private cmdConfirmationLetter(updatePrintFlag: any): void {
        if ((this.getControlValue('ContractName') !== '') && this.riGrid.Details.GetValue('QuoteTypeCode') === 'NEW') {

            let postData = {
                Function: 'ConfirmationLetter',
                dlContractRowID: this.attributes.dlContractRowID || '',
                LanguageCode: this.riExchange.LanguageCode()
            };
            this.ajaxSource.next(this.ajaxconstant.START);
            this.fetchRecordData('ConfirmationLetter', {}, postData).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    }
                    else {
                        let url = data.DocumentURL;
                        let postData2 = {
                            Function: 'Single',
                            BusinessCode: data['BusinessCode'] ? data['BusinessCode'] : '',
                            BranchNumber: this.getControlValue('BranchNumber'),
                            LetterTypeCode: data['LetterTypeCode'] ? data['LetterTypeCode'] : '',
                            DateFrom: data['ChangeProcessDate'] ? this.globalize.parseDateToFixedFormat(data['ChangeProcessDate']) : '',
                            DateTo: data['ChangeProcessDate'] ? this.globalize.parseDateToFixedFormat(data['ChangeProcessDate']) : '',
                            ChangeEffectDate: data['ChangeEffectDate'] ? this.globalize.parseDateToFixedFormat(data['ChangeEffectDate']) : '',
                            LetterUniqueNumber: data['CustomerLetterUniqueNumber'] ? data['CustomerLetterUniqueNumber'] : '',
                            LanguageCode: this.riExchange.LanguageCode(),
                            Mode: 'Quote'
                        };

                        this.fetchRecordData('Single', {}, postData2).subscribe(
                            (data2) => {
                                if (data2.hasError) {
                                    this.modalAdvService.emitError(new ICabsModalVO(data2.errorMessage, data2.fullError));
                                }
                                else {
                                    let strURL = data2['url'];
                                    window.open(strURL, '_blank');
                                }
                            },
                            (error) => {
                                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                            }
                        );
                        if (updatePrintFlag === true) {
                            let postData3 = {
                                Function: 'ConfirmationLetterUpdate',
                                CustomerLetterRowID: this.getControlValue('CustomerLetterRowID')
                            };

                            this.fetchRecordData('ConfirmationLetterUpdate', {}, postData3).subscribe(
                                (data3) => {
                                    if (data3.status === 'failure') {
                                        this.modalAdvService.emitError(new ICabsModalVO(data3.errorMessage, data3.fullError));
                                    }
                                },
                                (error) => {
                                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                                }
                            );
                        }

                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                }
            );
        }
    }
    private cmdHistoryOnClick(): void {
        this.navigate('Approval', '/grid/sales/DLHistoryGridComponent');
    }

    private cmdPremisesOnClick(): void {
        this.navigate('Approval', '/grid/sales/PipelinePremiseGridComponent');
    }

    private cmdEmail(): void {
        let query: URLSearchParams = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '6');
        let postData = {
            Function: 'EMail',
            dlContractRowID: this.attributes.dlContractRowID || '',
            LanguageCode: this.riExchange.LanguageCode()
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, query, postData)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private printReport(): void {
        let reportParams = '&riCacheControlMaxAge=0&dlContractROWID=&' + this.attributes.dlContractRowID + '&parentMode=Approval';

        if (this.quoteReviewReportName) {
            switch (this.quoteReviewReportName) {
                case 'Sales/iCABSSOQuoteReviewReport.htm':
                    //TODO: page not yet ready 'Sales/iCABSSOQuoteReviewReport.htm'
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped + ' - Sales/iCABSSOQuoteReviewReport.htm'));
                    break;
                default:
                    break;
            }
        }

        let query: URLSearchParams = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '6');
        let postData = {
            Function: 'SetReviewedStatus',
            dlContractRowID: this.attributes.dlContractRowID || ''
        };

        if ((this.riGrid.Details.GetAttribute('StatusDesc', 'AdditionalProperty') === 'S') || this.riGrid.Details.GetAttribute('StatusDesc', 'AdditionalProperty') === 'M') {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, query, postData)
                .subscribe((data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    }
                    else {
                        this.refresh();
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }
    }

    private populateDescriptions(): void {
        let query: URLSearchParams = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '0');
        let postData = {
            Function: 'SetDisplayFields',
            FilterUserCode: this.getControlValue('FilterUserCode')
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, query, postData)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.setControlValue('UserName', '');
                    this.setControlValue('EmployeeCode', '');
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('UserName', data.UserName || '');
                    this.setControlValue('EmployeeCode', data.EmployeeCode || '');
                    this.refresh();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private sysCharParameters(): string {
        let sysCharList = [
            this.sysCharConstants.SystemCharEnableRouteOptimisationSoftwareIntegration
        ];
        return sysCharList.join(',');
    }

    private fetchSysChar(): any {
        let querySysChar: URLSearchParams = this.getURLSearchParamObject();
        let sysCharNumbers = this.sysCharParameters();
        querySysChar.set(this.serviceConstants.Action, '0');
        querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(querySysChar);
    }

    //Retrieve grid row and cell specific values
    private approvalFocus(): void {
        this.attributes.dlContractRowID = this.riGrid.Details.GetAttribute('SubmittedByCode', 'AdditionalProperty');
        this.attributes.ContractTypeCode = this.riGrid.Details.GetValue('ContractTypeCode');
        this.attributes.ContractName = this.riGrid.Details.GetValue('GridContractName');
        this.setControlValue('ContractName', this.riGrid.Details.GetValue('GridContractName'));
        this.setControlValue('dlContractRef', this.riGrid.Details.GetValue('dlContractRef'));
        this.setControlValue('dlBatchRef', this.riGrid.Details.GetAttribute('ContractTypeCode', 'AdditionalProperty'));
        this.setControlValue('ContractTypeCode', this.riGrid.Details.GetValue('ContractTypeCode'));
        this.setControlValue('PassQuoteTypeCode', this.riGrid.Details.GetValue('QuoteTypeCode'));
        this.setControlValue('PassContractCommenceDate', this.riGrid.Details.GetAttribute('QuoteTypeCode', 'AdditionalProperty'));
        this.setControlValue('PassJobCommenceDate', this.riGrid.Details.GetAttribute('MixedQuoteInd', 'AdditionalProperty'));
        this.setControlValue('PassContractNumber', this.riGrid.Details.GetAttribute('DDIInd', 'AdditionalProperty'));
    }

    // Clear selected values
    private clearSelectedRowData(): void {
        this.attributes.dlContractRowID = '';
        this.attributes.ContractTypeCode = '';
        this.attributes.ContractName = '';
        this.setControlValue('ContractName', '');
        this.setControlValue('dlContractRef', '');
        this.setControlValue('dlBatchRef', '');
        this.setControlValue('ContractTypeCode', '');
        this.setControlValue('PassQuoteTypeCode', '');
        this.setControlValue('PassContractCommenceDate', '');
        this.setControlValue('PassJobCommenceDate', '');
        this.setControlValue('PassContractNumber', '');
    }

    // Build initial structure of the Grid
    private buildGrid(): any {
        this.riGrid.Clear();
        this.riGrid.AddColumn('dlContractRef', 'Approval', 'dlContractRef', MntConst.eTypeTextFree, 12);
        this.riGrid.AddColumn('ContractTypeCode', 'Approval', 'ContractTypeCode', MntConst.eTypeCode, 1);
        this.riGrid.AddColumn('QuoteTypeCode', 'SOQuote', 'QuoteTypeCode', MntConst.eTypeCode, 4);
        this.riGrid.AddColumn('MixedQuoteInd', 'Prospect', 'MixedQuoteInd', MntConst.eTypeImage, 0, true);
        this.riGrid.AddColumn('KeyAccountInd', 'Prospect', 'KeyAccountInd', MntConst.eTypeImage, 0, true);
        this.riGrid.AddColumn('DDIInd', 'Approval', 'DDIInd', MntConst.eTypeImage, 0, true);
        this.riGrid.AddColumn('GridContractName', 'Approval', 'GridContractName', MntConst.eTypeTextFree, 20);
        this.riGrid.AddColumn('SubmittedByCode', 'Approval', 'SubmittedByCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumn('StatusDesc', 'Approval', 'StatusDesc', MntConst.eTypeTextFree, 10);
        this.riGrid.AddColumn('NumPremises', 'Approval', 'NumPremises', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('NumServiceCovers', 'Approval', 'NumServiceCovers', MntConst.eTypeTextFree, 4);
        this.riGrid.AddColumn('TotalValue', 'Approval', 'TotalValue', MntConst.eTypeCurrency, 12);
        this.riGrid.AddColumn('Process', 'Approval', 'Process', MntConst.eTypeButton, 4);
        this.riGrid.AddColumn('Print', 'Approval', 'Print', MntConst.eTypeImage, 1);
        this.riGrid.AddColumn('Info', 'dlHistory', 'Info', MntConst.eTypeImage, 1);

        this.riGrid.AddColumnAlign('ContractTypeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('NumPremises', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('NumServiceCovers', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('dlContractRef', true, true);
        this.riGrid.Complete();

        this.riGridBeforeExecute();
    }

    //populate data into the grid and update the pagination control accordingly
    private riGridBeforeExecute(): any {
        let gridQueryParams: URLSearchParams = this.getURLSearchParamObject();
        let sortOrder: any = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }

        gridQueryParams.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        gridQueryParams.set(this.serviceConstants.Action, '2');
        gridQueryParams.set('riGridMode', '0');
        gridQueryParams.set('riCacheRefresh', 'True');
        gridQueryParams.set('riGridHandle', this.utils.gridHandle);
        gridQueryParams.set('BranchNumber', this.utils.getBranchCode());
        gridQueryParams.set('riSortOrder', sortOrder);
        gridQueryParams.set('Status', this.getControlValue('StatusSelect'));
        gridQueryParams.set('QuoteFilter', this.getControlValue('QuoteFilter'));
        gridQueryParams.set('FilterUserCode', this.getControlValue('FilterUserCode'));
        gridQueryParams.set('DateFrom', this.getControlValue('DateFrom') ? this.globalize.parseDateToFixedFormat(this.getControlValue('DateFrom')).toString() : '');
        gridQueryParams.set('ContractTypeFilter', this.getControlValue('ContractTypeFilter'));
        gridQueryParams.set('MaxValue', this.getControlValue('MaxValue'));
        gridQueryParams.set('ProspectNumber', this.getControlValue('ProspectNumber'));
        gridQueryParams.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        gridQueryParams.set(this.serviceConstants.PageCurrent, this.gridCurPage.toString());

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, gridQueryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data) {
                    if (data.hasError || data['error_description']) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        this.totalRecords = 0;
                        this.isPaginationEnabled = false;
                        this.riGrid.ResetGrid();
                    } else {
                        this.gridCurPage = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.actualPageSize : 1;
                        this.isPaginationEnabled = (this.totalRecords > 0) ? true : false;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.Execute(data);
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public statusSelectOnChange(): void {
        this.refresh();
    }

    public quoteFilterOnChange(): void {
        this.refresh();
    }

    public contractTypeFilterOnChange(): void {
        this.refresh();
    }

    public filterUserCodeOnKeyDown(): void {
        if (this.userInformationSearch) {
            this.userInformationSearch.openModal();
        }
    }

    public filterUserCodeOnChange(): void {
        if (this.getControlValue('FilterUserCode')) {
            this.populateDescriptions();
        }
        else {
            this.setControlValue('EmployeeCode', '');
            this.setControlValue('UserName', '');
            this.refresh();
        }
    }

    public onRiMUserInformationSearchDataReceived(data: any, route: any): void {
        //TODO: Child component section has not yet integrated, will do later
    }

    // handles manu change event
    public menuOnChange(value: any): any {
        switch (value) {
            case 'EnterPORef':
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped + ' - Sales/iCABSSPipelinePremisePORefGrid.htm'));
                //TODO: Target page is not yet ready. this.navigate('ApprovalEnterPORef', 'Sales/iCABSSPipelinePremisePORefGrid.htm');
                break;
            case 'Email':
                this.cmdEmail();
                break;
            case 'AccountCheck':
                this.cmdAccountCheckOnclick();
                break;
            case 'CalculatedValue':
                this.cmdCalculatedValueOnclick();
                break;
            case 'ConfirmationLetter':
                this.cmdConfirmationLetter(false);
                break;
            case 'ConfirmationLetterCustCopy':
                this.cmdConfirmationLetter(true);
                break;
            case 'History':
                this.cmdHistoryOnClick();
                break;
        }

    }

    public getGridInfo(info: any): void {
        this.totalRecords = info.totalRows;
        if (info && info.totalPages) {
            this.totalRecords = parseInt(info.totalPages, 0) * (this.actualPageSize);
        } else {
            this.totalRecords = 0;
        }
        this.riGridAfterExecute();
    }

    // Get page specific grid data from service end
    public getCurrentPage(data: any): void {
        this.gridCurPage = data.value;
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    // refresh the grid content
    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    /**
     * Grid body on Double click event
     */
    public riGridBodyOnDblClick(event: any): void {
        if (!this.isGridLastRecord()) {
            this.approvalFocus();

            switch (this.riGrid.CurrentColumnName) {
                case 'dlContractRef':
                    let params = {
                        dlContractRowID: this.attributes.dlContractRowID,
                        ContractTypeCode: this.attributes.ContractTypeCode,
                        ContractName: this.attributes.ContractName,
                        parentMode: 'Approval'
                    };
                    this.navigate('Approval', 'sales/sSdlContractMaintenance', params);
                    break;
                case 'NumPremises':
                    this.cmdPremisesOnClick();
                    break;
                case 'NumServiceCovers':
                    this.attributes.dlPremiseRef = 'All';
                    let parameterData = {
                        dlContractRowID: this.attributes.dlContractRowID,
                        ContractTypeCode: this.attributes.ContractTypeCode,
                        ContractName: this.attributes.ContractName,
                        parentMode: 'Approval'
                    };
                    this.navigate('Approval', '/grid/sales/PipelineServiceCoverGridComponent', parameterData);
                    break;
                case 'StatusDesc':
                    let parameterData1 = {
                        dlContractRowID: this.attributes.dlContractRowID,
                        ContractTypeCode: this.attributes.ContractTypeCode,
                        ContractName: this.attributes.ContractName,
                        parentMode: 'Approval'
                    };
                    this.navigate('Approval', 'sales/quotestatusmaintenance', parameterData1);
                    break;
                case 'Print':
                    if (event.srcElement.className === 'pointer') {
                        this.printReport();
                    }
                    break;
                case 'Info':
                    if (event.srcElement.className === 'pointer') {
                        let info: string = this.riGrid.Details.GetAttribute('Info', 'AdditionalProperty').replace(/\r/g, '\n');
                        let modalVo: ICabsModalVO = new ICabsModalVO(info);
                        modalVo.title = 'Information';
                        this.modalAdvService.emitMessage(modalVo);
                    }
                    break;
            }
        }
    }

    /**
     * Grid body on click event
     */
    public riGridBodyOnClick(event: any): void {
        if (!this.isGridLastRecord()) {
            let lGPSProcess: boolean;
            this.approvalFocus();

            switch (this.riGrid.CurrentColumnName) {
                case 'Process':
                    let target = event.target || event.srcElement || event.currentTarget;
                    let colVal = target.innerText;
                    switch (colVal) {

                        case this.translatedList['Review']:
                            this.printReport();
                            break;
                        case this.translatedList['Process_DDI']:

                            let postData1 = {
                                Function: 'ProcessDDI',
                                BusinessCode: this.utils.getBusinessCode(),
                                LanguageCode: this.riExchange.LanguageCode(),
                                dlContractRowID: this.attributes.dlContractRowID
                            };

                            this.fetchRecordData('ProcessDDI', {}, postData1).subscribe(
                                (data1) => {
                                    if (data1.hasError) {
                                        this.modalAdvService.emitError(new ICabsModalVO(data1.errorMessage, data1.fullError));
                                    }
                                    else {
                                        if (data1.ReturnMessage) {
                                            this.messageService.emitMessage(data1['ReturnMessage']);
                                        }
                                        this.buildGrid();
                                    }
                                },
                                (error) => {
                                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                                }
                            );

                            break;
                        case this.translatedList['Process']:
                            lGPSProcess = true;

                            if (this.pageParams.vEnableRouteOptimisation === true) {
                                lGPSProcess = false;
                                let counter = 0;
                                this.checkGPSReference().subscribe((e) => {
                                    if (e && e === true) {
                                        this.getProcessData();
                                    } else {
                                        /*TODO:: page integration is pending for this section
                                        riGrid.CancelEvent  = True
                                        riExchange.Mode     = 'Premise'
                                        window.location     = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSARoutingSearch.htm'
                                        */
                                        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped + ' - iCABSARoutingSearch.htm'));
                                        this.setControlValue('RoutingSource', this.getControlValue('SelRoutingSource'));
                                        if (this.getControlValue('RoutingSource')) {
                                            this.lSearchRouting = false;
                                        }
                                    }
                                });
                            }

                            if (lGPSProcess) {
                                this.getProcessData();
                            }
                            break;
                        case this.translatedList['Completed']:

                            let postData4 = {
                                Function: 'Completed',
                                BusinessCode: this.utils.getBusinessCode(),
                                LanguageCode: this.riExchange.LanguageCode(),
                                dlContractRowID: this.attributes.dlContractRowID
                            };

                            this.ajaxSource.next(this.ajaxconstant.START);
                            this.fetchRecordData('Completed', {}, postData4).subscribe(
                                (data4) => {
                                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                                    if (data4.hasError) {
                                        this.modalAdvService.emitError(new ICabsModalVO(data4.errorMessage, data4.fullError));
                                    }
                                    else {
                                        this.buildGrid();
                                    }
                                },
                                (error) => {
                                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                                }
                            );
                            break;
                        case this.translatedList['Signature']:
                            this.navigate('Signature', 'contractmanagement/sales/sSdlContractMaintenance');
                            break;
                    }
                    break;
                case 'Print':
                    if (event.srcElement.className === 'pointer') {
                        this.printReport();
                    }
                    break;
                case 'Info':
                    if (event.srcElement.className === 'pointer') {
                        let info: string = this.riGrid.Details.GetAttribute('Info', 'AdditionalProperty').replace(/\r/g, '\n');
                        let modalVo: ICabsModalVO = new ICabsModalVO(info);
                        modalVo.title = 'Information';
                        this.modalAdvService.emitMessage(modalVo);
                    }
                    break;
            }
        }
    }

    /**
     * Handle AfterExecute event of Grid
     */
    public riGridAfterExecute(): void {
        this.isPaginationEnabled = (this.riGrid.bodyArray && this.riGrid.bodyArray.length > 0) ? true : false;
        this.totalRecords = (this.riGrid.bodyArray.length > 0 && this.totalRecords === 0) ? 1 : this.totalRecords;

        setTimeout(() => {
            if (this.riGrid.HTMLGridBody && this.riGrid.HTMLGridBody.children[0] && this.riGrid.bodyArray.length > 1) {
                if (this.riGrid.HTMLGridBody.children[0].children[0]) {
                    this.riGrid.SetDefaultFocus();
                    this.approvalFocus();
                }
                else {
                    this.clearSelectedRowData();
                }
            }
            else {
                this.clearSelectedRowData();
            }
        }, 100);

    }

    public selectedRowFocus(rsrcElement: any): void {
        if (rsrcElement) {
            rsrcElement.focus();
            this.approvalFocus();
        }
    }

    // Handle Grid Body On KeyDown event
    public riGridBodyOnKeyDown(event: any): void {
        switch (event.keyCode) {
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.selectedRowFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }
                }
                break;
            case 40:
            case 9:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.nextSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.selectedRowFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }
                }
                break;
        }
    }

    // handles grid sort functionality
    public gridSort(): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public onAccountSearchDataReceived(data: any): void {
        //TODO: function added for future integration
    }

}
