import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';

import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { OrderBy } from './../../../shared/pipes/orderBy';

@Component({
    templateUrl: 'iCABSCMCustomerContactMaintenanceCopy.html'
})
export class CustomerContactMaintenanceCopyComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('ticketTypeDropDown') ticketTypeDropDown: DropdownStaticComponent;
    @ViewChild('ticketDetailDropDown') ticketDetailDropDown: DropdownStaticComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    private orderBy: OrderBy;
    public controls: any[] = [
        { name: 'CopyDisputed' },
        { name: 'CopyRootCause' },
        { name: 'CopyContactTypeCode' },
        { name: 'CopyContactTypeDetailCode' },
        { name: 'CopyMode' }
    ];
    public queryParams: any = {
        operation: 'ContactManagement/iCABSCMCustomerContactMaintenanceCopy',
        module: 'tickets',
        method: 'ccm/maintenance'
    };
    public pageId: string = '';
    public ticketType: any = [];
    public ticketDetail: any = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCUSTOMERCONTACTMAINTENANCECOPY;
        this.orderBy = injector.get(OrderBy);
        this.browserTitle = this.pageTitle = 'Ticket Maintenance - Copy Ticket';
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning())
            this.populateUIFromFormData();
        else {
            this.setControlValue('CopyDisputed', true);
            this.setControlValue('CopyRootCause', true);
            this.doLookup();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public doLookup(): any {
        let buildOriginCodes: URLSearchParams,
            contactCreateSecurityLevel: any,
            prospect: any,
            contactTypeDetail: any,
            firstDataLen: any,
            secondDataLen: any,
            contactTypeDetailLen: any,
            lookupUserAuthority: any[],
            lookupContactType: any[],
            lookupContactTypeLang: any[],
            lookupContactTypeLangArray: any = [],
            contactTypeCode: any = [],
            contactTypeDesc: any = [],
            i: any;

        buildOriginCodes = this.getURLSearchParamObject();
        buildOriginCodes.set(this.serviceConstants.Action, '0');
        buildOriginCodes.set(this.serviceConstants.MaxResults, '100');
        lookupUserAuthority = [{
            'table': 'UserAuthority',
            'query': { 'UserCode': this.utils.getUserCode(), 'BusinessCode': this.businessCode() },
            'fields': ['UserCode', 'BusinessCode', 'ContactCreateSecurityLevel']
        }];
        this.LookUp.lookUpRecord(lookupUserAuthority).flatMap(data => {
            if (data.hasError)
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            else {
                if (data[0] && data[0].length > 0 && data[0][0]) {
                    contactCreateSecurityLevel = data[0][0].ContactCreateSecurityLevel;
                    lookupContactType = [{
                        'table': 'ContactType',
                        'query': {},
                        'fields': ['ContactTypeCode', 'ContactTypeSystemDesc', 'Prospect']
                    }];
                    return this.LookUp.lookUpRecord(lookupContactType);
                } else
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
            }
        }).flatMap(data => {
            if (data.hasError)
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            else {
                if (data[0] && data[0].length > 0) {
                    firstDataLen = data[0].length;
                    for (i = 0; i < firstDataLen; i++) {
                        prospect = data[0][i].Prospect;
                        if (!prospect) {
                            contactTypeCode.push(data[0][i].ContactTypeCode);
                            contactTypeDesc.push(data[0][i].ContactTypeSystemDesc);
                            lookupContactTypeLang = [{
                                'table': 'ContactTypeLang',
                                'query': { 'ContactTypeCode': data[0][i].ContactTypeCode, 'LanguageCode': this.riExchange.LanguageCode() },
                                'fields': ['ContactTypeCode', 'ContactTypeDesc', 'LanguageCode']
                            },
                            {
                                'table': 'ContactTypeDetail',
                                'query': { 'ContactTypeCode': data[0][i].ContactTypeCode, 'ContactCreateSecurityLevel': contactCreateSecurityLevel, 'CallCentreInd': 'TRUE' },
                                'fields': ['ValidForNewInd', 'URL']
                            }];
                            lookupContactTypeLangArray.push(this.httpService.lookUpRequest(buildOriginCodes, lookupContactTypeLang));
                        }
                    }
                    return Observable.forkJoin(lookupContactTypeLangArray);
                } else
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
            }
        }).subscribe(
            (data) => {
                if (data && data.length > 0) {
                    let i: any, j: any, obj: any;
                    secondDataLen = data.length;
                    for (i = 0; i < secondDataLen; i++) {
                        if (data[i]['results'][1]) {
                            contactTypeDetail = data[i]['results'][1];
                            contactTypeDetailLen = contactTypeDetail.length;
                            for (j = 0; j < contactTypeDetailLen; j++) {
                                if (((contactTypeDetail[j].URL === '') || (contactTypeDetail[j].URL === '?')) && (contactTypeDetail[j].ValidForNewInd)) {
                                    if (data[i]['results'][0].length) {
                                        obj = {
                                            text: data[i]['results'][0][0].ContactTypeDesc,
                                            value: contactTypeCode[i]
                                        };
                                        this.ticketType.push(obj);
                                    } else {
                                        obj = {
                                            text: contactTypeDesc[i],
                                            value: contactTypeCode[i]
                                        };
                                        this.ticketType.push(obj);
                                    }
                                    break;
                                }
                            }
                        } else
                            this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                    }
                    this.ticketType = this.orderBy.transform(this.ticketType, 'text');
                    this.ticketTypeDropDown.selectedItem = this.ticketType[0].value;
                    this.onCopyContactTypeCodeSelect();
                } else
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
            });
    }

    public onCopyContactTypeCodeSelect(): void {
        let contactTypeDetailDesc: any,
            contactTypeDetailCode: any,
            contactTypeDetailDescLen: any,
            searchParams: URLSearchParams,
            i: any,
            obj: any;

        this.ticketDetail = [];
        this.setControlValue('CopyContactTypeCode', this.ticketTypeDropDown.selectedItem);
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '6');
        searchParams.set('Function', 'GetCopyContactTypeDetail');
        searchParams.set('ContactTypeCode', this.getControlValue('CopyContactTypeCode'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
            .subscribe(
            (res) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (res.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(res.errorMessage, res.fullError));
                else {
                    if (res) {
                        contactTypeDetailDesc = res.ContactTypeDetailDescList.split('^');
                        contactTypeDetailCode = res.ContactTypeDetailCodeList.split('^');
                        contactTypeDetailDescLen = contactTypeDetailDesc.length;
                        for (i = 0; i < contactTypeDetailDescLen; i++) {
                            obj = {
                                text: contactTypeDetailDesc[i],
                                value: contactTypeDetailCode[i]
                            };
                            this.ticketDetail.push(obj);
                        }
                        this.ticketDetailDropDown.selectedItem = this.ticketDetail[0].value;
                    } else
                        this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public confirmCopy(): void {
        this.riExchange.setParentHTMLValue('CopyMode', 'Y');
        this.riExchange.setParentHTMLValue('CopyContactTypeCode', this.ticketTypeDropDown.selectedItem);
        this.riExchange.setParentHTMLValue('CopyContactTypeDetailCode', this.ticketDetailDropDown.selectedItem);
        if (this.getControlValue('CopyDisputed') === true)
            this.riExchange.setParentHTMLValue('CopyDisputed', 'Y');
        else
            this.riExchange.setParentHTMLValue('CopyDisputed', 'N');
        if (this.getControlValue('CopyRootCause') === true)
            this.riExchange.setParentHTMLValue('CopyRootCause', 'Y');
        else
            this.riExchange.setParentHTMLValue('CopyRootCause', 'N');
        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
    }

    public confirmCancel(): void {
        this.riExchange.setParentHTMLValue('CopyMode', 'N');
        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
    }

    public onTicketTypeSelect(data: any): void {
        this.ticketTypeDropDown.selectedItem = data;
        this.onCopyContactTypeCodeSelect();
    }

    public onTicketDetailSelect(data: any): void {
        this.ticketDetailDropDown.selectedItem = data;
    }
}
