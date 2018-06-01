import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';

import { PageIdentifier } from './../../base/PageIdentifier';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { EmployeeSearchComponent } from '../../internal/search/iCABSBEmployeeSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';


@Component({
    templateUrl: 'iCABSCMCallCentreReviewGridMulti.html'
})

export class CallCentreReviewGridMultiComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChildren('contactTypeDropDown') contactTypeDropDown: QueryList<DropdownStaticComponent>;
    @ViewChildren('contactTypeDetailDropDown') contactTypeDetailDropDown: QueryList<DropdownStaticComponent>;
    @ViewChildren('contactStatusDropDown') contactStatusDropDown: QueryList<DropdownStaticComponent>;
    @ViewChild('childModal') public childModal;

    private contactTypeDetailValArray: any;
    private contactTypeDetailDescArray: any;
    private saveContactTypeDetailValArray: any;
    private saveContactTypeDetailDescArray: any;
    private contactStatusValArray: any;
    private contactStatusDescArray: any;
    private saveContactStatusValArray: any;
    private saveContactStatusDescArray: any;
    private lResetting: boolean = false;
    private lCancelling: boolean = false;
    private lAccepting: boolean = false;
    private lookUpSubscription: Subscription;
    private isInitiate: boolean = false;

    public pageId: string = '';
    public controls = [
        { name: 'ComplexTicketTypeList', readonly: true, disabled: false, required: false, value: '' },
        { name: 'InitialComplexTicketTypeList', readonly: true, disabled: false, required: false, value: '' }
    ];
    public contactTypeCodeOptions: Array<any> = [];
    public contactType: Array<any> = [];
    public selectRows: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    public queryParams: any = {
        operation: 'ContactManagement/iCABSCMCallCentreReviewGridMulti',
        module: 'call-centre',
        method: 'ccm/grid'
    };
    public contactTypeDetailCodeSelectOptions: Array<any> = [];
    public contactStatusCodeSelectOptions: Array<any> = [];
    public fieldDisable: any = {
        'ContactTypeCodeSelect1': false,
        'ContactTypeCodeSelect2': false,
        'ContactTypeCodeSelect3': false,
        'ContactTypeCodeSelect4': false,
        'ContactTypeCodeSelect5': false,
        'ContactTypeCodeSelect6': false,
        'ContactTypeCodeSelect7': false,
        'ContactTypeCodeSelect8': false,
        'ContactTypeCodeSelect9': false,
        'ContactTypeCodeSelect10': false,
        'ContactTypeDetailCodeSelect1': false,
        'ContactTypeDetailCodeSelect2': false,
        'ContactTypeDetailCodeSelect3': false,
        'ContactTypeDetailCodeSelect4': false,
        'ContactTypeDetailCodeSelect5': false,
        'ContactTypeDetailCodeSelect6': false,
        'ContactTypeDetailCodeSelect7': false,
        'ContactTypeDetailCodeSelect8': false,
        'ContactTypeDetailCodeSelect9': false,
        'ContactTypeDetailCodeSelect10': false,
        'ContactStatusCodeSelect1': false,
        'ContactStatusCodeSelect2': false,
        'ContactStatusCodeSelect3': false,
        'ContactStatusCodeSelect4': false,
        'ContactStatusCodeSelect5': false,
        'ContactStatusCodeSelect6': false,
        'ContactStatusCodeSelect7': false,
        'ContactStatusCodeSelect8': false,
        'ContactStatusCodeSelect9': false,
        'ContactStatusCodeSelect10': false
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCALLCENTREREVIEWGRIDMULTI;
        this.browserTitle = 'Contact Centre Review - Multiple Ticket Type Selection';
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.buildOptions();
    }
    ngOnDestroy(): void {
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.lookUpSubscription)
            this.lookUpSubscription.unsubscribe();
        super.ngOnDestroy();
    }
    public ngAfterViewInit(): void {
        this.pageTitle = 'Contact Centre Review - Multiple Ticket Type Search';
    }

    /**
     * Method to call on pageload
     * @params: params: void
     * @returns: void
     */
    private init(params: any): void {
        this.getContactTypeList();
        this.createFormElement();
        this.getPreviouslyEnteredValues(params);
        this.sensitiseDropDowns(1);
    }
    /**
     * Method set default options
     * @params: params:  void
     * @return: void
     */
    private buildOptions(): void {
        for (let i of this.selectRows) {
            this.contactTypeDetailCodeSelectOptions[i] = [];
            this.contactTypeCodeOptions[i] = [];
            this.getTranslatedValue('None', null).subscribe((res: string) => {
                this.zone.run(() => {
                    if (res) {
                        this.contactTypeDetailCodeSelectOptions[i].push({ value: '$', text: res });
                        this.contactTypeCodeOptions[i].push({ value: '$', text: res });
                    } else {
                        this.contactTypeDetailCodeSelectOptions[i].push({ value: '$', text: 'None' });
                        this.contactTypeCodeOptions[i].push({ value: '$', text: 'None' });
                    }
                });
            });
            this.contactStatusCodeSelectOptions[i] = [];
            this.contactStatusCodeSelectOptions[i].push({ value: 'allopen', text: 'All Open' });
        }
    }

    /**
     * Method to populate ContactType dropdown
     * @params: params:  void
     * @return: void
     */
    private getContactTypeList(): void {

        this.isRequesting = true;
        let cProspectStatusCode: string;
        let requestParam = [{
            'table': 'ContactType',
            'query': {
            },
            'fields': ['ContactTypeCode', 'ContactSequence', 'ContactTypeSystemDesc']
        }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(requestParam).subscribe((data) => {
            this.contactType = [];
            let observableBatch: Array<any> = [];
            data[0].sort(function (first: string, second: string): any {
                let firstl: string = first['ContactTypeSystemDesc'].toLowerCase(), secondl: string = second['ContactTypeSystemDesc'].toLowerCase();
                return firstl < secondl ? -1 : firstl > secondl ? 1 : 0;
            });
            for (let contact of data[0]) {
                this.contactType.push(contact);
            }
            for (let c of this.contactType) {
                observableBatch.push(this.getContactTypeDetail(c));

            }
            Observable.forkJoin(
                observableBatch).subscribe((e) => {
                    let clngth: number = 0, observableBatchType: Array<any> = [];;
                    clngth = e.length;
                    for (let i = 0; i < clngth; i++) {
                        if (e[i]['results'][0][0]) {
                            observableBatchType.push(this.getContactTypeLanguage(this.contactType[i]));
                        }
                    }
                    Observable.forkJoin(
                        observableBatchType).subscribe((e) => {
                            let newContactTypeOption: any = {}, lngth: number = 0;
                            lngth = e.length;
                            for (let i = 0; i < lngth; i++) {
                                if (e[i]['results'][0][0]) {
                                    newContactTypeOption['value'] = e[i]['results'][0][0].ContactTypeCode;
                                    newContactTypeOption['text'] = e[i]['results'][0][0].ContactTypeDesc;
                                } else {
                                    newContactTypeOption['value'] = this.contactType[i].ContactTypeCode;
                                    newContactTypeOption['text'] = this.contactType[i].ContactTypeSystemDesc;
                                }
                                for (let index of this.selectRows) {
                                    this.contactTypeCodeOptions[index].push(JSON.parse(JSON.stringify(newContactTypeOption)));
                                }
                            }
                            this.isRequesting = false;
                        });
                });

        });
    }
    /**
     * Method get ContactTypeLang from service call
     * @params: params:  void
     * @return: void
     */
    private getContactTypeLanguage(contact: any): any {
        let requestParam = [{
            'table': 'ContactTypeLang',
            'query': {
                'ContactTypeCode': contact.ContactTypeCode,
                'LanguageCode': this.riExchange.LanguageCode()
            },
            'fields': ['ContactTypeCode', 'ContactTypeDesc']
        }
        ];

        return this.lookUpRecord(requestParam, 0);
    }
    /**
     * Method get ContactTypeDetail from service call
     * @params: params:  void
     * @return: void
     */
    private getContactTypeDetail(contact: any): any {
        let requestParam = [{
            'table': 'ContactTypeDetail',
            'query': {
                'ContactTypeCode': contact.ContactTypeCode
            },
            'fields': ['ContactTypeCode']
        }
        ];

        return this.lookUpRecord(requestParam, 0);
    }
    /**
     * Method to generate controls at the begining of pageload
     * @params: void
     * @return: void
     */
    private createFormElement(): void {
        for (let i of this.selectRows) {
            this.controls.push({ name: 'ContactTypeCodeSelect' + i, readonly: false, disabled: false, required: false, value: '$' });
            this.controls.push({ name: 'ContactTypeCodeSelectValue' + i, readonly: false, disabled: false, required: false, value: '' });
            this.controls.push({ name: 'ContactTypeDetailCodeSelect' + i, readonly: false, disabled: false, required: false, value: '' });
            this.controls.push({ name: 'ContactTypeDetailCodeSelectValue' + i, readonly: false, disabled: false, required: false, value: '' });
            this.controls.push({ name: 'ContactStatusCodeSelect' + i, readonly: false, disabled: false, required: false, value: '' });
            this.controls.push({ name: 'ContactStatusCodeSelectValue' + i, readonly: false, disabled: false, required: false, value: '' });
            this.controls.push({ name: 'ContactTypeDetailCodes' + i, readonly: false, disabled: false, required: false, value: '' });
            this.controls.push({ name: 'ContactTypeDetailDescs' + i, readonly: false, disabled: false, required: false, value: '' });
            this.controls.push({ name: 'ContactStatusCodes' + i, readonly: false, disabled: false, required: false, value: '' });
            this.controls.push({ name: 'ContactStatusDescs' + i, readonly: false, disabled: false, required: false, value: '' });
        }
        this.riExchange.renderForm(this.uiForm, this.controls);
    }

    private getPreviouslyEnteredValues(param: any): void {
        for (let i of this.selectRows) {
            if (!param['ContactTypeCodeSelectValue' + i]) {
                this.resetCmdClick(i);
            }

            this.contactTypeDetailDropDown.toArray()[i - 1].selectedItem = '$';
            this.contactStatusDropDown.toArray()[i - 1].selectedItem = 'allopen';
            this.contactTypeDropDown.toArray()[i - 1].selectedItem = '$';
        }
        if (param.ComplexTicketTypeList) {
            this.setControlValue('ComplexTicketTypeList', param.ComplexTicketTypeList);
        }
        if (this.getControlValue('ComplexTicketTypeList')) {
            for (let index of this.selectRows) {
                if (param['ContactTypeCodeSelectValue' + index]) {
                    this.setControlValue('ContactTypeCodeSelectValue' + index, param['ContactTypeCodeSelectValue' + index]);
                    this.contactTypeDropDown.toArray()[index - 1].selectedItem = param['ContactTypeCodeSelectValue' + index];
                    this.buildContactTypeDetailAndStatusList(param['ContactTypeCodeSelectValue' + index], index);
                }
                if (param['ContactTypeDetailCodeSelectValue' + index]) {
                    this.setControlValue('ContactTypeDetailCodeSelectValue' + index, param['ContactTypeDetailCodeSelectValue' + index]);
                }
                if (param['ContactTypeDetailCodes' + index]) {
                    this.setControlValue('ContactTypeDetailCodes' + index, param['ContactTypeDetailCodes' + index]);
                }
                if (param['ContactTypeDetailDescs' + index]) {
                    this.setControlValue('ContactTypeDetailDescs' + index, param['ContactTypeDetailDescs' + index]);
                }
                if (param['ContactStatusCodeSelectValue' + index]) {
                    this.setControlValue('ContactStatusCodeSelectValue' + index, param['ContactStatusCodeSelectValue' + index]);
                }
                if (param['ContactStatusCodes' + index]) {
                    this.setControlValue('ContactStatusCodes' + index, param['ContactStatusCodes' + index]);
                }
                if (param['ContactStatusDescs' + index]) {
                    this.setControlValue('ContactStatusDescs' + index, param['ContactStatusDescs' + index]);
                }
            }
        }
        this.buildComplexTicketTypeList();
        this.setControlValue('InitialComplexTicketTypeList', this.getControlValue('ComplexTicketTypeList'));
        for (let index of this.selectRows) {
            if (this.getControlValue('ContactTypeCodeSelectValue' + index) && this.getControlValue('ContactTypeCodeSelectValue' + index) !== '$') {
                this.setControlValue('ContactTypeCodeSelect' + index, this.getControlValue('ContactTypeCodeSelect' + index));
                this.saveContactTypeDetailValArray = this.getControlValue('ContactTypeDetailCodes' + index);
                this.saveContactTypeDetailDescArray = this.getControlValue('ContactTypeDetailDescs' + index);
                this.setControlValue('ContactStatusCodeSelect' + index, this.getControlValue('ContactStatusCodeSelectValue' + index));
                this.saveContactStatusValArray = this.getControlValue('ContactStatusCodes' + index);
                this.saveContactStatusDescArray = this.getControlValue('ContactStatusDescs' + index);
                this.populateContactTypeDetailAndStatusList(index);
                this.setControlValue('ContactStatusCodeSelect' + index, this.getControlValue('ContactStatusCodeSelectValue' + index));
            } else {
                this.setControlValue('ContactTypeCodeSelectValue' + index, '$');
                this.setControlValue('ContactTypeDetailCodeSelectValue' + index, '$');
                this.setControlValue('ContactStatusCodeSelectValue' + index, 'allopen');
            }
            this.setControlValue('ContactTypeCodeSelect' + index, this.getControlValue('ContactTypeCodeSelectValue' + index));
            this.setControlValue('ContactTypeDetailCodeSelect' + index, this.getControlValue('ContactTypeDetailCodeSelectValue' + index));
        }
    }

    private sensitiseDropDowns(ipiRow: any): void {
        for (let index of this.selectRows) {
            if (ipiRow === 1 || ipiRow === index) {
                if (this.getControlValue('ContactTypeCodeSelect' + index) === '$') {
                    this.fieldDisable['ContactTypeDetailCodeSelect' + index] = true;
                    this.fieldDisable['ContactStatusCodeSelect' + index] = true;
                } else {
                    this.fieldDisable['ContactTypeDetailCodeSelect' + index] = false;
                    this.fieldDisable['ContactStatusCodeSelect' + index] = false;
                }
            }
        }
    }

    private populateContactTypeDetailAndStatusList(ipiRow: any): void {
        for (let index of this.selectRows) {
            if (ipiRow === index) {
                this.setControlValue('ContactTypeDetailCodes' + index, this.saveContactTypeDetailValArray);
                this.setControlValue('ContactTypeDetailDescs' + index, this.saveContactTypeDetailDescArray);
                this.contactTypeDetailCodeSelectOptions[ipiRow] = [];
                this.setControlValue('ContactStatusCodes' + index, this.saveContactStatusValArray);
                this.setControlValue('ContactStatusDescs' + index, this.saveContactStatusDescArray);
                this.contactStatusCodeSelectOptions[ipiRow] = [];
            }
        }
        this.contactTypeDetailValArray = this.saveContactTypeDetailValArray.split('^');
        this.contactTypeDetailDescArray = this.saveContactTypeDetailDescArray.split('^');
        let len: number = this.contactTypeDetailValArray.length;
        for (let i = 0; i < len; i++) {
            for (let index of this.selectRows) {
                if (ipiRow === index) {
                    this.contactTypeDetailCodeSelectOptions[ipiRow].push({ value: this.contactTypeDetailValArray[i], text: this.contactTypeDetailDescArray[i] });
                }
            }
        }
        this.contactStatusValArray = this.saveContactStatusValArray.split('^');
        this.contactStatusDescArray = this.saveContactStatusDescArray.split('^');
        len = this.contactStatusValArray.length;
        for (let i = 0; i < len; i++) {
            for (let index of this.selectRows) {
                if (ipiRow === index) {
                    this.contactStatusCodeSelectOptions[ipiRow].push({ value: this.contactStatusValArray[i], text: this.contactStatusDescArray[i] });
                }
            }
        }
        if (this.isInitiate === true) {
            setTimeout(() => {
                if (this.getControlValue('ContactTypeDetailCodeSelectValue' + ipiRow) && this.getControlValue('ContactTypeDetailCodeSelectValue' + ipiRow) !== '$') {
                    setTimeout(() => {
                        this.contactTypeDetailDropDown.toArray()[ipiRow - 1].selectedItem = this.getControlValue('ContactTypeDetailCodeSelectValue' + ipiRow);
                    }, 5);
                    this.fieldDisable['ContactTypeDetailCodeSelect' + ipiRow] = false;
                }
                if (this.getControlValue('ContactStatusCodeSelectValue' + ipiRow) && this.getControlValue('ContactStatusCodeSelectValue' + ipiRow) !== 'allopen') {
                    setTimeout(() => {
                        this.contactStatusDropDown.toArray()[ipiRow - 1].selectedItem = this.getControlValue('ContactStatusCodeSelectValue' + ipiRow);
                    }, 10);
                    this.fieldDisable['ContactStatusCodeSelect' + ipiRow] = false;
                }
            }, 10);
        }
    }

    private buildContactTypeDetailAndStatusList(ipcContactTypeCode: any, ipiRow: any): void {
        let lNeedServerCall: boolean = true;
        // Try not to force repeated calls to the server for the contact type detail lists...
        // If a previously entered ContactTypeDetailCode matches the one required then simply use the contacttypedetaillists previously fetched
        this.saveContactTypeDetailValArray = '';
        this.saveContactTypeDetailDescArray = '';
        //Always Reset The Status On Change Of A ContactType
        for (let index of this.selectRows) {
            if (ipiRow === index) {
                this.setControlValue('ContactStatusCodeSelec' + index, 'allopen');
            }
        }

        if (ipcContactTypeCode === '$') {
            this.saveContactTypeDetailValArray = '$';
            this.getTranslatedValue('None', null).subscribe((res: string) => {
                this.zone.run(() => {
                    if (res) {
                        this.saveContactTypeDetailDescArray = res;
                    } else {
                        this.saveContactTypeDetailDescArray = 'None';
                    }
                });
            });
            lNeedServerCall = false;
        }

        for (let index of this.selectRows) {
            if (lNeedServerCall && ipiRow !== index && ipcContactTypeCode === this.getControlValue('ContactTypeCodeSelect' + index)) {
                this.saveContactTypeDetailValArray = this.getControlValue('ContactTypeDetailCodes' + index);
                this.saveContactTypeDetailDescArray = this.getControlValue('ContactTypeDetailDescs' + index);
                this.saveContactStatusValArray = this.getControlValue('ContactStatusCodes' + index);
                this.saveContactStatusDescArray = this.getControlValue('ContactStatusDescs' + index);
                lNeedServerCall = false;
            }

        }
        if (lNeedServerCall) {
            let search: any = new URLSearchParams();
            search.set(this.serviceConstants.Action, '6');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            search.set('ContactTypeCode', ipcContactTypeCode);
            search.set('Function', 'GetContactTypeDetailCodes,GetContactStatusCodes');
            this.isRequesting = true;
            this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], search).subscribe(
                (data) => {
                    try {
                        this.saveContactTypeDetailValArray = data.ContactTypeDetailCodes;
                        this.saveContactTypeDetailDescArray = data.ContactTypeDetailDescs;
                        this.saveContactStatusValArray = data.ContactStatusCodes;
                        this.saveContactStatusDescArray = data.ContactStatusDescs;
                    } catch (error) {
                        this.logger.warn(error);
                    }
                    this.isRequesting = false;
                    this.populateContactTypeDetailAndStatusList(ipiRow);

                },
                (error) => {
                    this.errorService.emitError(error);
                    this.isRequesting = false;
                }
            );
        } else {
            this.populateContactTypeDetailAndStatusList(ipiRow);
        }
        this.sensitiseDropDowns(ipiRow);

    }

    private buildComplexTicketTypeList(): void {
        let ticktList: string = '';
        for (let index of this.selectRows) {
            ticktList += '^' + this.getControlValue('ContactTypeCodeSelectValue' + index) + '^' + this.getControlValue('ContactTypeDetailCodeSelectValue' + index) + '^' + this.getControlValue('ContactStatusCodeSelectValue' + index) + '^,';
        }
        this.setControlValue('ComplexTicketTypeList', ticktList);
    }

    public updateView(params: any): void {
        this.isInitiate = true;
        this.init(params);
    }

    /**
     * Method to call look up service
     * @params: params:  data: any, MaxResults: any
     * @return: void
     */
    public lookUpRecord(data: any, maxresults: any): any {
        let queryLookUp: any = new URLSearchParams();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(queryLookUp, data);
    }
    /**
     * Method to get ContactTypeCodeSelect onchange dropdown
     * @params: params:  val: any,index: any
     * @return: void
     */
    public contactTypeOptionsChange(val: any, index: any): void {
        this.setControlValue('ContactTypeCodeSelect' + index, val);
        if (val && val !== '$') {
            this.contactTypeCodeSelectOnChange(index);
        } else if (val === '$') {
            this.resetCmdClick(index);
        }
    }
    /**
     * Method to get ContactTypeDetailCodeSelect onchange dropdown
     * @params: params:  val: any,index: any
     * @return: void
     */
    public contactTypeDetailCodeSelectChange(val: any, index: any): void {
        this.setControlValue('ContactTypeDetailCodeSelect' + index, val);
    }
    /**
     * Method to get ContactStatusCodeSelect onchange dropdown
     * @params: params:  val: any,index: any
     * @return: void
     */
    public contactStatusCodeSelectChange(val: any, index: any): void {
        this.setControlValue('ContactStatusCodeSelect' + index, val);
    }

    /**
     * Method to call onchange of ContactTypeCodeSelect value
     * @params: void
     * @return: void
     */
    public contactTypeCodeSelectOnChange(rowNumber: any): void {
        if (!this.lResetting) {
            this.buildContactTypeDetailAndStatusList(this.getControlValue('ContactTypeCodeSelect' + rowNumber), rowNumber);
        }
    }

    /**
     * Method to reset all controls
     * @params: params:  rowNumber: any
     * @return: void
     */
    public resetCmdClick(rowNumber: any): void {
        this.contactTypeDetailCodeSelectOptions[rowNumber] = [];
        this.contactStatusCodeSelectOptions[rowNumber] = [];
        this.getTranslatedValue('None', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.contactTypeDetailCodeSelectOptions[rowNumber].push({ value: '$', text: res });
                } else {
                    this.contactTypeDetailCodeSelectOptions[rowNumber].push({ value: '$', text: 'None' });
                }
            });
        });
        this.getTranslatedValue('All Open', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.contactStatusCodeSelectOptions[rowNumber].push({ value: 'allopen', text: res });
                } else {
                    this.contactStatusCodeSelectOptions[rowNumber].push({ value: 'allopen', text: 'All Open' });
                }
            });
        });
        this.fieldDisable['ContactTypeDetailCodeSelect' + rowNumber] = true;
        this.fieldDisable['ContactStatusCodeSelect' + rowNumber] = true;
        if (this.contactTypeDropDown)
            this.contactTypeDropDown.toArray()[rowNumber - 1].selectedItem = '$';
        for (let i of this.selectRows) {
            this.setControlValue('ContactTypeCodeSelect' + i, '$');
            this.setControlValue('ContactTypeCodeSelectValue' + i, '$');
            this.setControlValue('ContactTypeDetailCodeSelect' + i, '');
            this.setControlValue('ContactTypeDetailCodeSelectValue' + i, '');
            this.setControlValue('ContactStatusCodeSelect' + i, '');
            this.setControlValue('ContactStatusCodeSelectValue' + i, '');
            this.setControlValue('ContactTypeDetailCodes' + i, '');
            this.setControlValue('ContactTypeDetailDescs' + i, '');
            this.setControlValue('ContactStatusCodes' + i, '');
            this.setControlValue('ContactStatusDescs' + i, '');
        }
    }
    /**
     * Method to reset specific row controls
     * @params: params:  rowNumber: any
     * @return: void
     */
    public resetAllCmdClick(rowNumber: any): void {
        this.lResetting = true;
        for (let index of this.selectRows) {
            this.resetCmdClick(index);
            this.lResetting = false;
        }
    }
    /**
     * Method to cancel changes
     * @params: params:  void
     * @return: void
     */
    public cancelCmdClick(): void {
        let returnObj: any = { isCancel: false };
        this.emitSelectedData(returnObj);
    }
    /**
     * Method to send all values to parent page
     * @params: params:  void
     * @return: void
     */
    public postCurrentValuesToParent(): void {
        //Posts the current values of all selections to the parent procedure so that they can be easily retrieved on re-entry
        //to this window - Also saving multiple calls to the server on re-entry to this window (build option lists etc...)
        let returnObj: any = {}, windowClosingName: string = 'complexsearchchanged';
        for (let index of this.selectRows) {
            this.setControlValue('ContactTypeCodeSelectValue' + index, this.getControlValue('ContactTypeCodeSelect' + index));
            this.setControlValue('ContactTypeDetailCodeSelectValue' + index, this.getControlValue('ContactTypeDetailCodeSelect' + index));
            this.setControlValue('ContactStatusCodeSelectValue' + index, this.getControlValue('ContactStatusCodeSelect' + index));
        }
        for (let index of this.selectRows) {
            returnObj['ContactTypeCodeSelectValue' + index] = this.getControlValue('ContactTypeCodeSelectValue' + index);
            returnObj['ContactTypeDetailCodeSelectValue' + index] = this.getControlValue('ContactTypeDetailCodeSelectValue' + index);
            returnObj['ContactTypeDetailCodes' + index] = this.getControlValue('ContactTypeDetailCodes' + index);
            returnObj['ContactTypeDetailDescs' + index] = this.getControlValue('ContactTypeDetailDescs' + index);
            returnObj['ContactStatusCodeSelectValue' + index] = this.getControlValue('ContactStatusCodeSelectValue' + index);
            returnObj['ContactStatusCodes' + index] = this.getControlValue('ContactStatusCodes' + index);
            returnObj['ContactStatusDescs' + index] = this.getControlValue('ContactStatusDescs' + index);
        }
        if (this.getControlValue('ContactTypeCodeSelectValue1') === '$' && this.getControlValue('ContactTypeCodeSelectValue2') === '$' &&
            this.getControlValue('ContactTypeCodeSelectValue3') === '$' && this.getControlValue('ContactTypeCodeSelectValue4') === '$' &&
            this.getControlValue('ContactTypeCodeSelectValue5') === '$' && this.getControlValue('ContactTypeCodeSelectValue6') === '$' &&
            this.getControlValue('ContactTypeCodeSelectValue7') === '$' && this.getControlValue('ContactTypeCodeSelectValue8') === '$' &&
            this.getControlValue('ContactTypeCodeSelectValue9') === '$' && this.getControlValue('ContactTypeCodeSelectValue10') === '$') {
            this.setControlValue('ComplexTicketTypeList', '');
        } else {
            this.buildComplexTicketTypeList();
            if (this.getControlValue('InitialComplexTicketTypeList') !== this.getControlValue('ComplexTicketTypeList')) {
                windowClosingName = 'complexsearchchanged';
            }
        }
        returnObj['ComplexTicketTypeList'] = this.getControlValue('ComplexTicketTypeList');
        returnObj['windowClosingName'] = windowClosingName;
        this.emitSelectedData(returnObj);
    }
}
