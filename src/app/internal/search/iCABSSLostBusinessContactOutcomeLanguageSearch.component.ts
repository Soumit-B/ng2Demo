import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { TableComponent } from './../../../shared/components/table/table';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSSLostBusinessContactOutcomeLanguageSearch.html'
})

export class LostBusinessContactOutcomeLanguageSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riTable') riTable: TableComponent;
    private lookUpSubscription: Subscription;
    private lostBusinessContactOutcomeLanguageParams: any = {};
    public pageId: string = '';
    public controls: Array<any> = [
        { name: 'LanguageCode', type: MntConst.eTypeCode },
        { name: 'LanguageDescription' }
    ];
    public tableheading: string = 'Client Retention Contact Outcome Search';
    public page: string = '1';
    public itemsPerPage: string = '10';
    public isLanguage: boolean = false;
    public queryParams: any = {
        operation: 'System/iCABSSLostBusinessContactOutcomeLanguageSearch',
        module: 'retention',
        method: 'ccm/search'
    };
    public systemChars: Object = {
        vSCEnableServiceCoverDetail: '' //240 SystemCharEnableServiceCoverDetail
    };
    public columns: Array<any> = [];

    constructor(injector: Injector, private ellipsis: EllipsisComponent) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSLOSTBUSINESSCONTACTOUTCOMELANGUAGESEARCH;
        this.pageTitle = 'Client Retention Contact Outcome Search';
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public updateView(params: any): void {
        let languageCode: any = (this.riExchange.getParentHTMLValue('LanguageCode')) ? this.riExchange.getParentHTMLValue

            ('LanguageCode') : params['LanguageCode'];
        if (!languageCode) {
            let languageDescription: any = (this.riExchange.getParentHTMLValue('LanguageDescription')) ? this.riExchange.getParentHTMLValue('LanguageDescription') : params['LanguageDescription'];
            this.setControlValue('LanguageCode', languageCode);
            this.setControlValue('LanguageDescription', languageDescription);
            this.isLanguage = true;
            this.columns = [
                { title: 'Type Code', name: 'ContactOutcomeCode', className: 'col2' },
                { title: 'Display Description', name: 'LBContactOutcomeDesc', className: 'col21' }
            ];
        } else {
            this.pageTitle = 'Language Details';
            this.columns = [
                { title: 'Type Code', name: 'ContactOutcomeCode', className: 'col2' },
                { title: 'Description', name: 'ContactOutcomeSystemDesc', className: 'col21' },
                { title: 'Display Description', name: 'LBContactOutcomeDesc', className: 'col1' }
            ];
        }
        this.lostBusinessContactOutcomeLanguageParams['parentMode'] = params.parentMode;
        this.lostBusinessContactOutcomeLanguageParams['companyCode'] = params.companyCode;
        this.loadSystemChars();
    }

    public loadSystemChars(): void {
        let sysNumbers = [
            this.sysCharConstants.SystemCharEnableServiceCoverDetail
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.fetchSysChar(sysNumbers)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    if (e.records.length > 0) {
                        this.systemChars['vSCEnableServiceCoverDetail'] = e.records[0].Required;
                        this.buildTable();
                    }
                };
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }
    /*** Method to get system characters
    * @params field- systemchars variables looking for  and type- L,R,I
    */
    public fetchSysChar(sysCharNumbers: any): any {
        let querySysChar: URLSearchParams = new URLSearchParams();
        querySysChar.set(this.serviceConstants.Action, '0');

        if (this.utils.getBusinessCode()) {
            querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        } else {
            querySysChar.set(this.serviceConstants.BusinessCode, this.businessCode());
        }
        if (this.utils.getCountryCode()) {
            querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        } else {
            querySysChar.set(this.serviceConstants.BusinessCode, this.countryCode());
        }
        querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(querySysChar);
    }




    public onSelect(data: any): void {
        let returnObj: any = {
            'ContactOutcomeCode': data.row['ContactOutcomeCode'],
            'ContactOutcomeSystemDesc': data.row['ContactOutcomeSystemDesc']
        };
        if (this.isLanguage) {
            returnObj.LBContactOutcomeDesc = data.row['LBContactOutcomeDesc'];
        }
        this.ellipsis.sendDataToParent(returnObj);
    }
    public onRefresh(): void {
        this.buildTable();
    }
    public buildTable(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        this.localeTranslateService.setUpTranslation();
        if (this.lostBusinessContactOutcomeLanguageParams.parentMode === 'LookUp-Active') {
            search.set('InactiveForNew', 'false');
        }
        if (!this.systemChars['vSCEnableServiceCoverDetail']) {
            search.set('ContactOutcomeCode', '12');
            search.set('search.op.ContactOutcomeCode', 'NE');
        }
        search.set('LanguageCode', this.getControlValue('LanguageCode'));
        this.queryParams.search = search;
        this.riTable.loadTableData(this.queryParams);
    }
}
