import { MessageConstant } from '../../../shared/constants/message.constant';
import { Component, OnInit, AfterViewInit, OnDestroy, Injector, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { TableComponent } from './../../../shared/components/table/table';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { InternalMaintenanceApplicationModuleRoutes } from '../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSALostBusinessRequestSearch.html'
})

export class LostBusinessRequestSearchComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('riTable') riTable: TableComponent;

    public controls = [
        { name: 'ContractNumber', disabled: true },
        { name: 'ContractName', disabled: true },
        { name: 'PremiseNumber', disabled: true },
        { name: 'PremiseName', disabled: true },
        { name: 'ProductCode', disabled: true },
        { name: 'ProductDesc', disabled: true },
        { name: 'StatusSearch', value: 'L' },
        { name: 'CCCallLogID' },
        { name: 'CCContactTypeCode' },
        { name: 'CCContactTypeDetailCode' },
        { name: 'CCClientContact' },
        { name: 'CCClientContactTelephoneNumber' },
        { name: 'CCClientContactPosition' },
        { name: 'CCRequestOriginCode' },
        { name: 'CCRequestOriginDesc' },
        { name: 'CCLostBusinessRequestNarrative' },
        { name: 'ServiceCoverROWID' }
    ];

    public queryParams: any = {
        method: 'ccm/search',
        module: 'retention',
        operation: 'Application/iCABSALostBusinessRequestSearch'
    };

    public pageId: string = '';
    public search = new URLSearchParams();
    public columns: Array<any>;
    public itemsPerPage: string = '10';
    public page: string = '1';
    public totalItem: string = '11';
    public pageSize: string = '10';

    constructor(injector: Injector, private ref: ChangeDetectorRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSALOSTBUSINESSREQUESTSEARCH;
        this.browserTitle = 'Client Retention Request Search';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageParams.parentMode = this.riExchange.getParentMode();
    }

    ngAfterViewInit(): void {
        if (this.isReturning())
            this.populateUIFromFormData();
        else
            this.windowOnload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public windowOnload(): void {

        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));

        if (this.pageParams.parentMode === 'Premise' || this.pageParams.parentMode === 'ServiceCover') {

            this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber') ? this.riExchange.getParentHTMLValue('PremiseNumber') : '');
            this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));

            if (this.pageParams.parentMode === 'ServiceCover') {

                this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode') ? this.riExchange.getParentHTMLValue('ProductCode') : '');
                this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));

                if (this.riExchange.URLParameterContains('ContractHistory')) {
                    this.setControlValue('ServiceCoverROWID', this.riExchange.getParentHTMLValue('ServiceCoverROWID'));
                } else {
                    this.setControlValue('ServiceCoverROWID', this.riExchange.getParentHTMLValue('ServiceCover'));
                }
                this.setControlValue('ServiceCoverROWID', this.riExchange.getParentHTMLValue('ServiceCoverROWID'));
            }
        }

        if (this.riExchange.URLParameterContains('ContractHistory')) {
            this.pageParams.trAddButton = false;
        } else {
            this.pageParams.trAddButton = true;
        }

        if (this.riExchange.URLParameterContains('CurrentOnly')) {
            this.pageParams.trStatus = false;
        } else {
            this.pageParams.trStatus = true;
        }

        if (this.getControlValue('PremiseNumber') === '') {
            this.pageParams.trPremise = false;
            this.pageParams.trProduct = false;
        } else if (this.getControlValue('ProductCode') === '') {
            this.pageParams.trPremise = true;
            this.pageParams.trProduct = false;
        } else {
            this.pageParams.trPremise = true;
            this.pageParams.trProduct = true;
        }

        if (this.riExchange.URLParameterContains('ContractHistory')) {
            this.setControlValue('CCContactTypeCode', this.riExchange.getParentHTMLValue('CCContactTypeCode'));
            this.setControlValue('CCContactTypeDetailCode', this.riExchange.getParentHTMLValue('CCContactTypeDetailCode'));
            this.setControlValue('CCCallLogID', this.riExchange.getParentHTMLValue('CCCallLogID'));
            this.setControlValue('CCClientContact', this.riExchange.getParentHTMLValue('CCClientContact'));
            this.setControlValue('CCClientContactTelephoneNumber', this.riExchange.getParentHTMLValue('CCClientContactTelephoneNumber'));
            this.setControlValue('CCClientContactPosition', this.riExchange.getParentHTMLValue('CCClientContactPosition'));
            this.setControlValue('CCRequestOriginCode', this.riExchange.getParentHTMLValue('CCRequestOriginCode'));
            this.setControlValue('CCRequestOriginDesc', this.riExchange.getParentHTMLValue('CCRequestOriginDesc'));
            this.setControlValue('CCLostBusinessRequestNarrative', this.riExchange.getParentAttributeValue('CallNotepad'));
        }
        this.buildTableColumns();
        this.allowAddRequestClick();
    }

    public onSearch(): void {
        this.buildTableColumns();
    }

    public buildTableColumns(): void {
        this.riTable.clearTable();
        this.riTable.AddTableField('LostBusinessRequestNumber', MntConst.eTypeInteger, 'Key', 'Request Number', 6, MntConst.eAlignmentRight);
        this.riTable.AddTableField('RequestDate', MntConst.eTypeDate, 'Required', 'Request Date', 10, MntConst.eAlignmentLeft);
        if (this.getControlValue('PremiseNumber') === '') {
            this.riTable.AddTableField('PremiseNumber', MntConst.eTypeInteger, 'Key', 'Premises', 5);
        }
        if (this.getControlValue('ProductCode') === '') {
            this.riTable.AddTableField('ProductCode', MntConst.eTypeCode, 'Key', 'Product', 5);
        }
        this.riTable.AddTableField('RequestOriginCode', MntConst.eTypeCode, 'Required', 'Origin Code', 5, MntConst.eAlignmentLeft);
        this.riTable.AddTableField('LBRequestOriginDesc', MntConst.eTypeText, 'Virtual', 'Origin Description', 10, MntConst.eAlignmentLeft);
        this.riTable.AddTableField('LBRequestStatusDesc', MntConst.eTypeText, 'Virtual', 'Request Status', 10, MntConst.eAlignmentLeft);
        this.buildTable();
    }

    public buildTable(): void {
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        if (this.getControlValue('PremiseNumber') !== '') {
            this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        }
        if (this.getControlValue('ProductCode') !== '') {
            this.search.set('ProductCode', this.getControlValue('ProductCode'));
        };
        this.search.set('StatusSearch', this.getControlValue('StatusSearch'));
        this.queryParams.search = this.search;
        this.riTable.loadTableData(this.queryParams);
        this.ref.detectChanges();
    }

    public tableRowClick(event: any): void {

        let lostBusinessRequestNumber = event.row.LostBusinessRequestNumber;
        let returnObj = {
            'LostBusinessRequestNumber': lostBusinessRequestNumber,
            'row': event.row
        };

        switch (this.pageParams.parentMode) {
            case 'CallCentreSearchNew':
            case 'Contract':
            case 'Premise':
            case 'ServiceCover':
                let queryParams: any = {};

                queryParams[this.pageParams.parentMode] = '';
                queryParams['LostBusinessRequestNumber'] = returnObj.LostBusinessRequestNumber;

                if (this.riExchange.URLParameterContains('ContractHistory')) {
                    queryParams['ContractHistory'] = '';
                }
                if (this.riExchange.URLParameterContains('callcentre')) {
                    queryParams['callcentre'] = '';
                }
                this.navigate('Search', InternalMaintenanceApplicationModuleRoutes.ICABSALOSTBUSINESSREQUESTMAINTENANCE, queryParams);
                break;
            case 'LookUp':
                this.riExchange.setParentHTMLValue('LostBusinessRequestNumber', returnObj.LostBusinessRequestNumber);
                break;
            default:
                this.riExchange.setParentHTMLValue('LostBusinessRequestNumber', returnObj.LostBusinessRequestNumber);
                break;
        }
    }

    public addRequest(): void {
        let queryParams: any = {};
        switch (this.pageParams.parentMode) {
            case 'Premise':
                queryParams['Premise'] = '';
                break;
            case 'ServiceCover':
                queryParams['ServiceCover'] = '';
                break;
        }
        if (this.riExchange.URLParameterContains('ContractHistory')) {
            queryParams['ContractHistory'] = '';
        }
        if (this.riExchange.URLParameterContains('callcentre')) {
            queryParams['callcentre'] = '';
        }

        this.navigate('SearchAdd', InternalMaintenanceApplicationModuleRoutes.ICABSALOSTBUSINESSREQUESTMAINTENANCE, queryParams);
    }

    public allowAddRequestClick(): void {

        this.ajaxSource.next(this.ajaxconstant.START);

        let postSearchParams: URLSearchParams = new URLSearchParams();
        postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        postSearchParams.set(this.serviceConstants.Action, '6');
        postSearchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        postSearchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        postSearchParams.set('ProductCode', this.getControlValue('ProductCode'));

        let postParams: Object = {};
        postParams['Function'] = 'GetAllowAddRequest';

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    this.pageParams.isAddRecord = true;
                    this.isInvoiceSuspended();
                } else {
                    if (data.AllowAddRequest === 'yes')
                        this.pageParams.isAddRecord = false;
                    else
                        this.pageParams.isAddRecord = true;
                }
                this.isInvoiceSuspended();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
            });
    }

    public isInvoiceSuspended(): void {
        //servicecover
        if (this.getControlValue('ProductCode') !== '') {

            this.ajaxSource.next(this.ajaxconstant.START);

            let postSearchParams: URLSearchParams = new URLSearchParams();
            postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            postSearchParams.set(this.serviceConstants.Action, '6');

            let postParams: Object = {};
            postParams['Function'] = 'ISINVOICESUSPENDED';
            postParams['ContractNumber'] = this.getControlValue('ContractNumber');
            postParams['PremiseNumber'] = this.getControlValue('PremiseNumber');
            postParams['ProductCode'] = this.getControlValue('ProductCode');
            postParams['ServiceCoverROWID'] = this.getControlValue('ServiceCoverROWID');
            postParams['Mode'] = 'ServiceCover';

            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        this.pageParams.isAddRecord = true;
                    }
                    else {
                        if (data.InvoiceSuspended === 'no')
                            this.pageParams.isAddRecord = false;
                        else
                            this.pageParams.isAddRecord = true;
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                });
        }

        //premise
        if (this.getControlValue('ProductCode') === '' && this.getControlValue('PremiseNumber') !== '' && this.getControlValue('ContractNumber') !== '') {

            this.ajaxSource.next(this.ajaxconstant.START);

            let postSearchParams: URLSearchParams = new URLSearchParams();
            postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            postSearchParams.set(this.serviceConstants.Action, '6');

            let postParams: Object = {};
            postParams['Function'] = 'ISINVOICESUSPENDED';
            postParams['ContractNumber'] = this.getControlValue('ContractNumber');
            postParams['PremiseNumber'] = this.getControlValue('PremiseNumber');
            postParams['ProductCode'] = this.getControlValue('ProductCode');
            postParams['Mode'] = 'Premises';

            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        this.pageParams.isAddRecord = true;
                    }
                   else {
                        if (data.InvoiceSuspended === 'no')
                            this.pageParams.isAddRecord = false;
                        else
                            this.pageParams.isAddRecord = true;
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                });
        }

        //contract
        if (this.getControlValue('ProductCode') === '' && this.getControlValue('PremiseNumber') === '' && this.getControlValue('ContractNumber') !== '') {

            this.ajaxSource.next(this.ajaxconstant.START);

            let postSearchParams: URLSearchParams = new URLSearchParams();
            postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            postSearchParams.set(this.serviceConstants.Action, '6');

            let postParams: Object = {};
            postParams['Function'] = 'ISINVOICESUSPENDED';
            postParams['ContractNumber'] = this.getControlValue('ContractNumber');
            postParams['PremiseNumber'] = this.getControlValue('PremiseNumber');
            postParams['ProductCode'] = this.getControlValue('ProductCode');
            postParams['Mode'] = 'Contract';

            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        this.pageParams.isAddRecord = true;
                    }
                     else {
                        if (data.InvoiceSuspended === 'no')
                            this.pageParams.isAddRecord = false;
                        else
                            this.pageParams.isAddRecord = true;
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                });
        }
    }

}
