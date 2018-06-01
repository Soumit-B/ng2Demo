/**
 * This component use to send address based on country and other parameters
 * It's created as ellipsis component and coun try specific(Netherland)
 * @author icabs development team
 * @version 1.0
 * @since 23/11/2017
 */
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { PageIdentifier } from './../../base/PageIdentifier';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ErrorService } from './../../../shared/services/error.service';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSMarktSelectSearch.html',
    providers: [ErrorService]
})

/**
 * Class definition  starts here
 */
export class MarktSelectSearchComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('marktSearchGridPagination') marktSearchGridPagination: PaginationComponent;

    /**
     * Private properties declaration starts here
     */
    private queryParams: any = {
        operation: 'Application/iCABSMarktSelectSearch',
        module: 'validation',
        method: 'contract-management/search'
    };
    private msgArray: Array<string> = MessageConstant.PageSpecificMessage.marktSelectSearchMessage;
    /**
     * Private properties declaration ends here
     */

    /**
     * Public properties starts
     */
    public pageId: string = '';
    public modalConfig: any = {
        keyboard: true
    };
    public showCloseButton: true;
    public showHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public search = new URLSearchParams();
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 1;
    public maxColumn: number = 8;
    public controls = [
        { name: 'cbCompanyName', readonly: false, disabled: false, required: false, value: '' },
        { name: 'CompanyName', readonly: false, disabled: false, required: false, value: '' },
        { name: 'cbPOBoxAddress', readonly: false, disabled: false, required: true, value: '' },
        { name: 'POBoxNumber', readonly: false, disabled: false, required: false, value: '', commonValidator: true },
        { name: 'POBoxTown', readonly: false, disabled: false, required: false, value: '', commonValidator: true },
        { name: 'POBoxPostcode', readonly: false, disabled: false, required: false, value: '', commonValidator: true },
        { name: 'cbStreetAddress', readonly: false, disabled: false, required: false, value: '' },
        { name: 'StreetName', readonly: false, disabled: false, required: false, value: '', commonValidator: true },
        { name: 'HouseNumber', readonly: false, disabled: false, required: false, value: '', commonValidator: true },
        { name: 'HouseNumberExt', readonly: false, disabled: false, required: false, value: '', commonValidator: true },
        { name: 'Town', readonly: false, disabled: false, required: false, value: '', commonValidator: true },
        { name: 'Postcode', readonly: false, disabled: false, required: false, value: '', commonValidator: true },
        { name: 'cbCountryCode', readonly: false, disabled: false, required: false, value: '' },
        { name: 'CountryCode', readonly: false, disabled: false, required: false, value: '', commonValidator: true },
        { name: 'cbTelephone', readonly: false, disabled: false, required: false, value: '' },
        { name: 'Telephone', readonly: false, disabled: false, required: false, value: '', commonValidator: true },
        { name: 'cbFax', readonly: false, disabled: false, required: false, value: '' },
        { name: 'Fax', readonly: false, disabled: false, required: false, value: '', commonValidator: true },
        { name: 'cbMarktSelectKey', readonly: false, disabled: false, required: false, value: '' },
        { name: 'MarktSelectKey', readonly: false, disabled: false, required: false, value: '', commonValidator: true },
        { name: 'cbCoCNumber', readonly: false, disabled: false, required: false, value: '' },
        { name: 'CoCNumber', readonly: false, disabled: false, required: false, value: '', commonValidator: true },
        { name: 'cbBICNumber', readonly: false, disabled: false, required: false, value: '' },
        { name: 'BICNumber', readonly: false, disabled: false, required: false, value: '', commonValidator: true },
        { name: 'NewBICNumber', readonly: false, disabled: false, required: false, value: '' }
    ];
    /**
     * Public properties ends
     */
    /**
     * constructor definition
     */
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSMARKTSELECTSEARCH;
    }

    /**
     * All angular lifecycles methods starts
     */
    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'MarktSelect Search';
        this.setMessageCallback(this);
        this.setErrorCallback(this);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
    }
    /**
     * Lifecycle methods ends
     */

    /**
     * This method used to initialize grid column configuration
     * @param void
     * @return void
     */
    private beforeExecute(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('CompanyName', 'MarktSelect', 'CompanyName', MntConst.eTypeCode, 20);
        this.riGrid.AddColumn('Town', 'MarktSelect', 'Town', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('StreetName', 'MarktSelect', 'StreetName', MntConst.eTypeText, 15);
        this.riGrid.AddColumn('HouseNumber', 'MarktSelect', 'HouseNumber', MntConst.eTypeText, 10);
        this.riGrid.AddColumn('MarktSelectKey', 'MarktSelect', 'MarktSelectKey', MntConst.eTypeText, 15);
        this.riGrid.AddColumn('GetCompanyInfo', 'MarktSelect', 'GetCompanyInfo', MntConst.eTypeButton, 15);
        this.riGrid.AddColumn('BestMatchField', 'MarktSelect', 'BestMatchField', MntConst.eTypeText, 15);
        this.riGrid.AddColumn('BestMatchValue', 'MarktSelect', 'BestMatchValue', MntConst.eTypeEllipsis, 30);

        this.riGrid.AddColumnAlign('CompanyName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('Town', MntConst.eAlignmentRight);
        this.riGrid.AddColumnAlign('StreetName', MntConst.eAlignmentRight);
        this.riGrid.AddColumnAlign('HouseNumber', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('MarktSelectKey', MntConst.eAlignmentRight);
        this.riGrid.AddColumnAlign('GetCompanyInfo', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('BestMatchField', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('BestMatchValue', MntConst.eAlignmentRight);
        this.riGrid.Complete();

    }

    /**
     * Inilialize all screen load data
     * @param params
     * @returns void
     */
    private initData(params: any): void {
        this.uiForm.reset();
        this.pageParams.strAddressLine1 = '';
        this.pageParams.strAddressLine2 = '';
        this.pageParams.strTown = '';
        this.pageParams.strPostcode = '';
        switch (this.parentMode) {
            case 'Premise':
                this.pageParams.strAddressLine1 = this.pageParams.strAddressLine1 || params['PremiseAddressLine1'];
                this.pageParams.strAddressLine2 = this.pageParams.strAddressLine2 || params['PremiseAddressLine2'];
                this.pageParams.strTown = this.pageParams.strTown || params['PremiseAddressLine4'];
                this.pageParams.strPostcode = this.pageParams.strPostcode || params['PremisePostcode'];
                if (params['PremiseName'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyName', params['PremiseName']);
                if (params['PremiseContactTelephone'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'Telephone', params['PremiseContactTelephone']);
                if (params['PremiseContactFax'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'Fax', params['PremiseContactFax']);
                if (params['PremiseReference'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CoCNumber', params['PremiseReference']);
                if (params['PremiseRegNumber'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'MarktSelectKey', params['PremiseRegNumber']);
                if (params['CustomerTypeCode'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BICNumber', params['CustomerTypeCode']);
                break;
            case 'Contract':
                this.pageParams.strAddressLine1 = this.pageParams.strAddressLine1 || params['ContractAddressLine1'];
                this.pageParams.strAddressLine2 = this.pageParams.strAddressLine2 || params['ContractAddressLine2'];
                this.pageParams.strTown = this.pageParams.strTown || params['ContractAddressLine4'];
                this.pageParams.strPostcode = this.pageParams.strPostcode || params['ContractPostcode'];
                if (params['ContractName'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyName', params['ContractName']);
                if (params['ContractContactTelephone'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'Telephone', params['ContractContactTelephone']);
                if (params['ContractContactFax'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'Fax', params['ContractContactFax']);
                if (params['CompanyRegistrationNumber'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CoCNumber', params['CompanyRegistrationNumber']);
                if (params['ExternalReference'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'MarktSelectKey', params['ExternalReference']);
                if (params['ContractReference'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BICNumber', params['ContractReference']);
                break;
            default:
                break;
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CountryCode', this.utils.getCountryCode());
        if (params['countryCode'] !== '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CountryCode', params['countryCode']);
        }
        this.addressSplit();
        this.beforeExecute();
        this.totalItems = 1;
    }

    /**
     * Service call to get address details
     * @param void
     * @returns void
     */
    private addressSplit(): void {
        if (this.pageParams.strAddressLine1 || this.pageParams.strAddressLine2) {
            let postData: Object = {};
            postData['AddressLine1'] = this.pageParams.strAddressLine1;
            postData['AddressLine2'] = this.pageParams.strAddressLine2;
            postData['tmpTown'] = this.pageParams.strTown;
            postData['tmpPostcode'] = this.pageParams.strPostcode;
            postData[this.serviceConstants.Function] = 'AddressSplit';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                (data) => {
                    try {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'StreetName', data.StreetName);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'HouseNumber', data.HouseNumber);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'HouseNumberExt', data.HouseNumberExt);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'Town', data.Town);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'Postcode', data.Postcode);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'POBoxNumber', data.POBoxNumber);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'POBoxTown', data.POBoxTown);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'POBoxPostcode', data.POBoxPostcode);
                    } catch (error) {
                        this.logger.warn(error);
                    }
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'], error['fullError']));
                }
            );
        }
    }

    /**
     * Method to create grid view
     * @param void
     * @returns void
     */
    private buildGrid(): void {
        if (this.validSearchData()) {
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '2');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            //set parameters
            this.search.set('CompanyName', this.uiForm.controls['CompanyName'].value);
            this.search.set(this.serviceConstants.Function, 'Searchcompany');
            this.search.set('Town', this.uiForm.controls['Town'].value);
            this.search.set('Postcode', this.uiForm.controls['Postcode'].value);
            this.search.set('connector.CountryCode', this.uiForm.controls['CountryCode'].value);
            this.search.set('Telephone', this.uiForm.controls['Telephone'].value);
            this.search.set('CoCNumber', this.uiForm.controls['CoCNumber'].value);
            this.search.set('StreetName', this.uiForm.controls['StreetName'].value);
            this.search.set('HouseNumber', this.uiForm.controls['HouseNumber'].value);
            this.search.set('MarktSelectKey', this.uiForm.controls['MarktSelectKey'].value);
            this.search.set('LiveMarktSelect', 'True');
            this.search.set(this.serviceConstants.GridHandle, '0');
            this.search.set(this.serviceConstants.GridMode, '0');
            this.search.set(this.serviceConstants.GridCacheRefresh, 'True');
            this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
            this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
            this.queryParams.search = this.search;
            this.isRequesting = true;
            this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
                .subscribe(
                (data) => {
                    this.isRequesting = false;
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        try {
                            this.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                            this.totalItems = data.pageData ? data.pageData.lastPageNumber * this.itemsPerPage : 1;
                            this.riGrid.UpdateHeader = true;
                            this.riGrid.UpdateBody = true;
                            this.riGrid.UpdateFooter = false;
                            this.riGrid.Execute(data);
                        } catch (e) {
                            this.logger.warn(e);
                        }
                    }
                    this.isRequesting = false;
                },
                (error) => {
                    this.isRequesting = false;
                    this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'], error['fullError']));
                }
                );
        }
    }

    /**
     * Method to validate grid service parameters
     * @param void
     * @returns blnReturnValue boolean
     */
    private validSearchData(): boolean {
        let blnReturnValue: boolean = false, mssg: string = '', msgArr: Array<string> = [];
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'CountryCode') === 'NL') {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'MarktSelectKey') ||
                this.riExchange.riInputElement.GetValue(this.uiForm, 'CoCNumber') ||
                this.riExchange.riInputElement.GetValue(this.uiForm, 'Telephone') ||
                this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode') || (
                    this.riExchange.riInputElement.GetValue(this.uiForm, 'Town') && (this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyName') || (this.riExchange.riInputElement.GetValue(this.uiForm, 'StreetName') && this.riExchange.riInputElement.GetValue(this.uiForm, 'HouseNumber'))))) {
                blnReturnValue = true;
            } else {
                for (let m of this.msgArray) {
                    this.getTranslatedValue(m, null).subscribe((res: string) => {
                        this.zone.run(() => {
                            if (res) {
                                msgArr.push(res);
                            } else {
                                msgArr.push(m);
                            }
                        });
                    });
                }
                this.modalAdvService.emitMessage(new ICabsModalVO(msgArr));
            }
        } else {
            this.getTranslatedValue(MessageConstant.Message.CountryNLNotMatch, null).subscribe((res: string) => {
                this.zone.run(() => {
                    if (res) {
                        mssg = res;
                    } else {
                        mssg = MessageConstant.Message.CountryNLNotMatch;
                    }
                });
            });
            this.modalAdvService.emitMessage(new ICabsModalVO(mssg));
        }

        return blnReturnValue;
    }

    /**
     * Method to call grid to display current page data
     * @param currentPage pagenumber of current page
     * @returns void
     */
    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    }

    /**
     * Method refresh the grid data
     * @param void
     * @returns void
     */
    public refresh(): void {
        this.buildGrid();
    }

    /**
     * Method to call after clicking GetCompanyInfo button
     * @param void
     * @returns void
     */
    public onGridRowClick(): void {
        if (this.riGrid.CurrentColumnName === 'GetCompanyInfo') {
            let postData: Object = {};
            postData['MarktSelectKey'] = this.riGrid.Details.GetAttribute('GetCompanyInfo', 'rowid');;
            postData[this.serviceConstants.Function] = 'GetCompanyInfo';
            postData['LiveMarktSelect'] = 'true';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.isRequesting = true;
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                (data) => {
                    this.isRequesting = false;
                    try {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyName', data.CompanyName);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'StreetName', data.StreetName);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'HouseNumber', data.HouseNumber);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'HouseNumberExt', data.HouseNumberExt);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'Town', data.Town);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'Postcode', data.Postcode);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'POBoxNumber', data.POBoxNumber);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'POBoxTown', data.POBoxTown);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'POBoxPostcode', data.POBoxPostcode);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'Telephone', data.Telephone);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'Fax', data.Fax);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'MarktSelectKey', data.MarktSelectKey);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CoCNumber', data.CoCNumber);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BICNumber', data.BICNumber);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'NewBICNumber', data.NewBICNumber);
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'NewBICNumber') === 'yes' && this.parentMode === 'Premise') {
                            this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.BICNotRegistered));
                        }
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyName')) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'cbCompanyName', true);
                        }
                        if (!this.riExchange.riInputElement.GetValue(this.uiForm, 'StreetName') && !this.riExchange.riInputElement.GetValue(this.uiForm, 'Town') &&
                            !this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode') && this.riExchange.riInputElement.GetValue(this.uiForm, 'POBoxNumber')) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'cbPOBoxAddress', true);
                        }
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'StreetName') || this.riExchange.riInputElement.GetValue(this.uiForm, 'Town') ||
                            this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode')) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'cbStreetAddress', true);
                        }
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'CountryCode')) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'cbCountryCode', true);
                        }
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'Telephone')) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'cbTelephone', true);
                        }
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'Fax')) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'cbFax', true);
                        }
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'MarktSelectKey')) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'cbMarktSelectKey', true);
                        }
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'CoCNumber')) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'cbCoCNumber', true);
                        }
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'BICNumber')) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'cbBICNumber', true);
                        }
                    } catch (error) {
                        this.logger.warn(error);
                        this.isRequesting = false;
                    }
                },
                (error) => {
                    this.isRequesting = false;
                    this.modalAdvService.emitMessage(new ICabsModalVO(error['errorMessage'], error['fullError']));
                }
            );
        }
    }


    /**
     * Method to call after clicking apply button
     * @param void
     * @returns void
     */
    public cmdApplyOnclick(): void {
        let postData: Object = {};
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbPOBoxAddress')) {
            postData['POBoxNumber'] = (this.uiForm.controls['POBoxNumber'].value) ? this.uiForm.controls['POBoxNumber'].value : '';
            postData['POBoxTown'] = (this.uiForm.controls['POBoxTown'].value) ? this.uiForm.controls['POBoxTown'].value : '';
            postData['POBoxPostcode'] = (this.uiForm.controls['POBoxPostcode'].value) ? this.uiForm.controls['POBoxPostcode'].value : '';
        } else if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbStreetAddress')) {
            postData['StreetName'] = (this.uiForm.controls['StreetName'].value) ? this.uiForm.controls['StreetName'].value : '';
            postData['HouseNumber'] = (this.uiForm.controls['HouseNumber'].value) ? this.uiForm.controls['HouseNumber'].value : '';
            postData['HouseNumberExt'] = (this.uiForm.controls['HouseNumberExt'].value) ? this.uiForm.controls['HouseNumberExt'].value : '';
        }
        postData[this.serviceConstants.Function] = 'AddressMerge';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.isRequesting = true;
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                this.isRequesting = false;
                try {
                    this.pageParams.strAddressLine1 = (data.AddressLine1) ? data.AddressLine1 : '';
                    this.pageParams.strAddressLine2 = (data.AddressLine2) ? data.AddressLine2 : '';
                    let returnObj: Object = {};
                    switch (this.parentMode) {

                        case 'Premise':
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbCompanyName')) {
                                this.riExchange.setParentHTMLValue('PremiseName', this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyName'));
                                returnObj['PremiseName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyName');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbPOBoxAddress')) {
                                this.riExchange.setParentHTMLValue('PremiseAddressLine1', this.pageParams.strAddressLine1);
                                this.riExchange.setParentHTMLValue('PremiseAddressLine2', this.pageParams.strAddressLine2);
                                this.riExchange.setParentHTMLValue('PremiseAddressLine4', this.riExchange.riInputElement.GetValue(this.uiForm, 'POBoxTown'));
                                this.riExchange.setParentHTMLValue('PremisePostcode', this.riExchange.riInputElement.GetValue(this.uiForm, 'POBoxPostcode'));
                                returnObj['PremiseAddressLine1'] = this.pageParams.strAddressLine1;
                                returnObj['PremiseAddressLine2'] = this.pageParams.strAddressLine2;
                                returnObj['PremiseAddressLine4'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'POBoxTown');
                                returnObj['PremisePostcode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'POBoxPostcode');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbStreetAddress')) {
                                this.riExchange.setParentHTMLValue('PremiseAddressLine1', this.pageParams.strAddressLine1);
                                this.riExchange.setParentHTMLValue('PremiseAddressLine2', this.pageParams.strAddressLine2);
                                this.riExchange.setParentHTMLValue('PremiseAddressLine4', this.riExchange.riInputElement.GetValue(this.uiForm, 'Town'));
                                this.riExchange.setParentHTMLValue('PremisePostcode', this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode'));
                                returnObj['PremiseAddressLine1'] = this.pageParams.strAddressLine1;
                                returnObj['PremiseAddressLine2'] = this.pageParams.strAddressLine2;
                                returnObj['PremiseAddressLine4'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'Town');
                                returnObj['PremisePostcode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbTelephone')) {
                                this.riExchange.setParentHTMLValue('PremiseContactTelephone', this.riExchange.riInputElement.GetValue(this.uiForm, 'Telephone'));
                                returnObj['PremiseContactTelephone'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'Telephone');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbFax')) {
                                this.riExchange.setParentHTMLValue('PremiseContactFax', this.riExchange.riInputElement.GetValue(this.uiForm, 'Fax'));
                                returnObj['PremiseContactFax'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'Fax');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbCoCNumber')) {
                                this.riExchange.setParentHTMLValue('PremiseReference', this.riExchange.riInputElement.GetValue(this.uiForm, 'CoCNumber'));
                                returnObj['PremiseReference'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'CoCNumber');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbMarktSelectKey')) {
                                this.riExchange.setParentHTMLValue('PremiseRegNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'MarktSelectKey'));
                                returnObj['PremiseRegNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'MarktSelectKey');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbBICNumber')) {
                                this.riExchange.setParentHTMLValue('CustomerTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'BICNumber'));
                                returnObj['CustomerTypeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BICNumber');
                            }
                            break;

                        case 'Contract':
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbCompanyName')) {
                                this.riExchange.setParentHTMLValue('ContractName', this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyName'));
                                returnObj['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyName');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbPOBoxAddress')) {
                                this.riExchange.setParentHTMLValue('ContractAddressLine1', this.pageParams.strAddressLine1);
                                this.riExchange.setParentHTMLValue('ContractAddressLine2', this.pageParams.strAddressLine2);
                                this.riExchange.setParentHTMLValue('ContractAddressLine4', this.riExchange.riInputElement.GetValue(this.uiForm, 'POBoxTown'));
                                this.riExchange.setParentHTMLValue('ContractPostcode', this.riExchange.riInputElement.GetValue(this.uiForm, 'POBoxPostcode'));
                                returnObj['ContractAddressLine1'] = this.pageParams.strAddressLine1;
                                returnObj['ContractAddressLine2'] = this.pageParams.strAddressLine2;
                                returnObj['ContractAddressLine4'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'POBoxTown');
                                returnObj['ContractPostcode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'POBoxPostcode');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbStreetAddress')) {
                                this.riExchange.setParentHTMLValue('ContractAddressLine1', this.pageParams.strAddressLine1);
                                this.riExchange.setParentHTMLValue('ContractAddressLine2', this.pageParams.strAddressLine2);
                                this.riExchange.setParentHTMLValue('ContractAddressLine4', this.riExchange.riInputElement.GetValue(this.uiForm, 'Town'));
                                this.riExchange.setParentHTMLValue('ContractPostcode', this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode'));
                                returnObj['ContractAddressLine1'] = this.pageParams.strAddressLine1;
                                returnObj['ContractAddressLine2'] = this.pageParams.strAddressLine2;
                                returnObj['ContractAddressLine4'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'Town');
                                returnObj['ContractPostcode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbTelephone')) {
                                this.riExchange.setParentHTMLValue('ContractContactTelephone', this.riExchange.riInputElement.GetValue(this.uiForm, 'Telephone'));
                                returnObj['ContractContactTelephone'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'Telephone');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbFax')) {
                                this.riExchange.setParentHTMLValue('ContractContactFax', this.riExchange.riInputElement.GetValue(this.uiForm, 'Fax'));
                                returnObj['ContractContactFax'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'Fax');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbCoCNumber')) {
                                this.riExchange.setParentHTMLValue('CompanyRegistrationNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'CoCNumber'));
                                returnObj['CompanyRegistrationNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'CoCNumber');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbMarktSelectKey')) {
                                this.riExchange.setParentHTMLValue('ExternalReference', this.riExchange.riInputElement.GetValue(this.uiForm, 'MarktSelectKey'));
                                returnObj['ExternalReference'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'MarktSelectKey');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbBICNumber')) {
                                this.riExchange.setParentHTMLValue('ContractReference', this.riExchange.riInputElement.GetValue(this.uiForm, 'BICNumber'));
                                returnObj['ContractReference'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BICNumber');
                            }
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbCountryCode')) {
                                this.riExchange.setParentHTMLValue('CountryCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'CountryCode'));
                                returnObj['CountryCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'CountryCode');
                            }
                            break;

                        default:
                            break;
                    }
                    this.emitSelectedData(returnObj);

                } catch (error) {
                    this.logger.warn(error);
                }
            },
            (error) => {
                this.isRequesting = false;
                this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'], error['fullError']));
            }
        );

    }

    /**
     * Method to call after clickingcbStreetAddress
     * @param void
     * @returns void
     */
    public cbPOBoxAddressOnclick(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'cbStreetAddress', !data);
    }

    /**
     * Method to call after cbPOBoxAddress
     * @param void
     * @returns void
     */
    public cbStreetAddressOnclick(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'cbPOBoxAddress', !data);
    }

    /**
     * Method to call after row click
     * @param void
     * @returns void
     */
    public onGridRowDblClick(): void {
        this.onGridRowClick();
    }

    public showErrorModal(data: any): void {
        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
    }

    public showMessageModal(data: any): void {
        this.modalAdvService.emitMessage(new ICabsModalVO(data.Message));
    }

    /**
     * Method to call clicking ellipsis from parent page
     * @param params inputparams from parent screen
     * @returns void
     */
    public updateView(params: any): void {
        if (params['parentMode'])
            this.parentMode = params['parentMode'];
        this.initData(params);
    }
}
/**
 * Class definition ends
 */
