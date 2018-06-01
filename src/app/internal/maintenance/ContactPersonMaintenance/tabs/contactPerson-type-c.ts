import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { ContactActionTypes } from './../../../../actions/contact';
import { LocaleTranslationService } from './../../../../../shared/services/translation.service';
import { SpeedScriptConstants } from './../../../../../shared/constants/speed-script.constant';
import { ServiceConstants } from './../../../../../shared/constants/service.constants';
import { AjaxObservableConstant } from './../../../../../shared/constants/ajax-observable.constant';
import { HttpService } from './../../../../../shared/services/http-service';
import { RiExchange } from './../../../../../shared/services/riExchange';
import { Utils } from './../../../../../shared/services/utility';
import { Subscription, BehaviorSubject } from 'rxjs/Rx';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DropdownStaticComponent } from './../../../../../shared/components/dropdown-static/dropdownstatic';
import { PaginationComponent } from './../../../../../shared/components/pagination/pagination';
import { GridComponent } from '../../../../../shared/components/grid/grid';

import { Component, OnInit, ViewChild, NgZone, OnDestroy } from '@angular/core';

@Component({
    selector: 'icabs-contact-person-type-c',
    templateUrl: 'contactPerson-type-c.html'
})

export class ContactPersonTypeCComponent implements OnInit, OnDestroy {

    @ViewChild('riGridContactRole') riGridContactRole: GridComponent;
    @ViewChild('riGridContactRolePagination') riGridContactRolePagination: PaginationComponent;
    @ViewChild('PortfolioRoleLevelSelect') portfolioRoleLevelDropdown: DropdownStaticComponent;

    public contactRolesFormGroup: FormGroup = new FormGroup({});

    public inputParams: any = {};
    public storeSubscription: Subscription;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;

    private rowId: string;
    public headerParams: any = {
        method: 'ccm/maintenance',
        module: 'customer',
        operation: 'ContactManagement/iCABSCMContactPersonMaintenance'
    };

    public pageSizeContactRole: number;
    public maxColumnsContactRole: number;
    public currentPageContactRole: number;
    public gridTotalItemsContactRole: number;

    private pageParams: any = {};
    private storeFieldValues: any = {};
    public showContactRoleGrid: boolean = false;

    //Store Variables
    public lRefreshContactRole: boolean;
    private cUpdateMode: string;

    public savePortfolioLevelKey: string;
    public portfolioLevelValue: string = '';
    public portfolioRoles: Array<Object> = [];

    private dropdownFlag: Boolean = false;
    private selectedRow = -1;
    private businessCode: string;
    private countryCode: string;

    constructor(
        private utils: Utils,
        private fb: FormBuilder,
        private store: Store<any>,
        private zone: NgZone,
        private riExchange: RiExchange,
        private httpService: HttpService,
        private ajaxconstant: AjaxObservableConstant,
        private serviceConstants: ServiceConstants,
        private speedScriptConstants: SpeedScriptConstants,
        private localeTranslateService: LocaleTranslationService
    ) {
        this.countryCode = this.utils.getCountryCode();
        this.businessCode = this.utils.getBusinessCode();
    }

    ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.pageSizeContactRole = 6;
        this.currentPageContactRole = 1;

        this.storeSubscription = this.store.select('contact').subscribe(data => {

            switch (data['action']) {
                case ContactActionTypes.SAVE_PARAMS:
                    if (data !== null && data['params'] && !(Object.keys(data['params']).length === 0 && data['params'].constructor === Object)) {
                        this.pageParams = data['params'];
                        this.cUpdateMode = data['params'].cUpdateMode;
                        if (this.pageParams.riContactRole_Execute) {
                            this.buildGridContactRole();
                        }
                        else {
                            this.riExchange.riInputElement.SetValue(this.contactRolesFormGroup, 'RolesContactPersonID', this.storeFieldValues.RolesContactPersonID);
                            this.riExchange.riInputElement.SetValue(this.contactRolesFormGroup, 'RolesContactPersonName', this.storeFieldValues.RolesContactPersonName);
                        }
                    }
                    break;
                case ContactActionTypes.SAVE_FIELD:
                    if (data !== null && data['fieldValue'] && !(Object.keys(data['fieldValue']).length === 0 && data['fieldValue'].constructor === Object)) {
                        this.storeFieldValues = data['fieldValue'];
                        this.updateFieldValues(data['fieldValue']);
                    }
                    break;
            }
        });

        this.initForm();
    }

    //Page Destroy
    public ngOnDestroy(): void {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }

    private initForm(): void {
        this.contactRolesFormGroup = this.fb.group({});
        this.riExchange.riInputElement.Add(this.contactRolesFormGroup, 'RolesContactPersonID');
        this.riExchange.riInputElement.Add(this.contactRolesFormGroup, 'RolesContactPersonName');
        this.riExchange.riInputElement.Add(this.contactRolesFormGroup, 'RolesPrimaryContactPersonID');
        this.riExchange.riInputElement.Add(this.contactRolesFormGroup, 'RolesPrimaryContactPersonName');

        this.riExchange.riInputElement.Disable(this.contactRolesFormGroup, 'RolesContactPersonID');
        this.riExchange.riInputElement.Disable(this.contactRolesFormGroup, 'RolesContactPersonName');
        this.riExchange.riInputElement.Disable(this.contactRolesFormGroup, 'RolesPrimaryContactPersonID');
        this.riExchange.riInputElement.Disable(this.contactRolesFormGroup, 'RolesPrimaryContactPersonName');
        this.loadDropDown();
    }

    private loadDropDown(): void {
        this.portfolioRoles = [
            {
                value: this.speedScriptConstants.CNFPortfolioLevelGroupAccount,
                text: 'The Entered Group Account'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelAccount,
                text: 'The Entered Account'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelIGInvoice,
                text: 'The Entered Invoice Group (Invoice)'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelIGStatement,
                text: 'The Entered Invoice Group (Statement)'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelContract,
                text: 'The Entered Contract'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelPremise,
                text: 'The Entered Premise'
            }, {
                value: 'ThisContact',
                text: 'This Contact ( Across The System )'
            }];

    }

    private updateFieldValues(storeData: any): void {
        if (storeData.PortfolioRoleLevelSelect) {
            this.portfolioRoleLevelDropdown.selectedItem = storeData.PortfolioRoleLevelSelect;
            this.riExchange.riInputElement.SetValue(this.contactRolesFormGroup, 'RolesContactPersonID', storeData.RolesContactPersonID);
            this.riExchange.riInputElement.SetValue(this.contactRolesFormGroup, 'RolesContactPersonName', storeData.RolesContactPersonName);
            this.riExchange.riInputElement.SetValue(this.contactRolesFormGroup, 'RolesPrimaryContactPersonID', storeData.RolesPrimaryContactPersonID);
            this.riExchange.riInputElement.SetValue(this.contactRolesFormGroup, 'RolesPrimaryContactPersonName', storeData.RolesPrimaryContactPersonName);
        }
    }

    public buildGridContactRole(): void {
        this.pageParams.riContactRole_Execute = false;
        this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });

        this.gridTotalItemsContactRole = 0;
        if (this.portfolioRoleLevelDropdown.selectedItem === 'ThisContact') {
            this.maxColumnsContactRole = 9;
        } else {
            this.maxColumnsContactRole = 6;
        }

        this.riGridContactRole.clearGridData();
        let rolesContactPersonID = this.riExchange.riInputElement.GetValue(this.contactRolesFormGroup, 'RolesContactPersonID');

        this.inputParams.method = this.headerParams.method;
        this.inputParams.module = this.headerParams.module;
        this.inputParams.operation = this.headerParams.operation;

        let searchContactRole: URLSearchParams = new URLSearchParams();
        searchContactRole.set(this.serviceConstants.BusinessCode, this.businessCode);
        searchContactRole.set(this.serviceConstants.CountryCode, this.countryCode);
        searchContactRole.set(this.serviceConstants.Action, '2');

        this.inputParams.search = searchContactRole;
        let bodyParams = {};
        bodyParams[this.serviceConstants.GridName] = 'ContactPersonPortfolioRole';
        bodyParams['PortfolioLevelKey'] = this.portfolioRoleLevelDropdown.selectedItem;
        bodyParams['PortfolioLevelValue'] = this.portfolioLevelValue;
        bodyParams['UpdateMode'] = 'UPDATE';
        bodyParams['CacheKey'] = '';
        bodyParams['ContactPersonID'] = rolesContactPersonID;

        if (this.storeFieldValues.GroupAccountNumber) {
            bodyParams['GroupAccountNumber'] = this.storeFieldValues.GroupAccountNumber;
        }
        if (this.storeFieldValues.AccountNumber) {
            bodyParams['AccountNumber'] = this.storeFieldValues.AccountNumber;
        }
        if (this.storeFieldValues.ContractNumber) {
            bodyParams['ContractNumber'] = this.storeFieldValues.ContractNumber;
        }
        if (this.storeFieldValues.PremiseNumber) {
            bodyParams['PremiseNumber'] = this.storeFieldValues.PremiseNumber;
        }
        if (this.storeFieldValues.InvoiceGroupNumber) {
            bodyParams['InvoiceGroupNumber'] = this.storeFieldValues.InvoiceGroupNumber;
        }
        if (this.storeFieldValues.CurrentCallLogID) {
            bodyParams['CurrentCallLogID'] = this.storeFieldValues.CurrentCallLogID;
        }
        bodyParams[this.serviceConstants.GridHandle] = '1050668';
        bodyParams[this.serviceConstants.GridMode] = '0';
        bodyParams[this.serviceConstants.GridCacheRefresh] = 'True';
        bodyParams[this.serviceConstants.GridPageSize] = this.pageSizeContactRole.toString();
        bodyParams[this.serviceConstants.GridPageCurrent] = this.currentPageContactRole.toString();
        bodyParams[this.serviceConstants.GridSortOrder] = 'Descending';

        this.inputParams.body = bodyParams;
        this.riGridContactRole.updateGridData(this.inputParams, this.rowId);
    }

    public portfolioRoleLevelSelect_OnChange(selectedItem: any): void {
        if (this.dropdownFlag) {
            this.store.dispatch({
                type: ContactActionTypes.SAVE_FIELD_PARAMS, payload: {
                    'cSelectValue': selectedItem
                }
            });
            this.buildGridContactRole();
        }
        this.dropdownFlag = true;
    }

    public onRefresh(): void {
        this.buildGridContactRole();
    }

    public selectedRowFocusContactRole(data: any): void {

        let cellData: any = {};
        let cAdditionalInfo = new Array();

        cellData = this.riGridContactRole.getCellInfoForSelectedRow(data.rowIndex, 5);
        cAdditionalInfo = cellData.additionalData.split('^');
        this.riExchange.riInputElement.SetValue(this.contactRolesFormGroup, 'RolesPrimaryContactPersonID', cAdditionalInfo[0]);
        this.riExchange.riInputElement.SetValue(this.contactRolesFormGroup, 'RolesPrimaryContactPersonName', cAdditionalInfo[1]);

        if (this.portfolioRoleLevelDropdown.selectedItem === 'ThisContact') {
            cellData = this.riGridContactRole.getCellInfoForSelectedRow(data.rowIndex, 0);
            cAdditionalInfo = cellData.additionalData.split('|');
            this.savePortfolioLevelKey = cAdditionalInfo[0];
            this.portfolioLevelValue = cAdditionalInfo[1];
        }
    }

    public contactRoleGrid_onDblclick(data: any): void {
        // Only allow update of roles when in neutral mode i.e. not updating or adding
        // This simplifies the rules here when adding. i.e. we need to add a contact first in order to get a contactpersonid value
        // and without a contactpersonid we cannot associate roles
        if (this.cUpdateMode === 'NEUTRAL') {
            if (data.cellIndex === 0 || data.cellIndex === 1) {
                this.selectedRow = data.rowIndex;
                let cellData: any = this.riGridContactRole.getCellInfoForSelectedRow(data.rowIndex, 0);
                let contactPersonRoleID = cellData.additionalData;
                this.rowId = cellData.additionalData;
                this.onContactRoleToggle(contactPersonRoleID);
            }
        } else {
            this.pageParams.hasError = true;
            this.pageParams.errorMessage = 'SaveBeforeSelectMessage';
            this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
        }

    }

    public gridInfoContactRole(data: any): void {
        // View/Hide the 'further records exist' message
        if (data.totalPages > 0) {
            if (data.totalRows === 0) {
                this.gridTotalItemsContactRole = 0;
            } else {
                this.gridTotalItemsContactRole = data.totalPages * this.pageSizeContactRole;
                if (this.selectedRow === -1) {
                    this.riGridContactRole.onCellClick(0, 0);
                } else {
                    this.riGridContactRole.onCellClick(this.selectedRow, 0);
                }
            }
        }
    }

    public getCurrentPageContactRole(event: any): void {
        this.currentPageContactRole = event.value;
        this.buildGridContactRole();
    }

    private onContactRoleToggle(contactPersonRoleID: any): void {
        let currentDate = encodeURI(this.utils.formatDate(new Date()).toString());
        let contactRoleToggleParams: URLSearchParams = new URLSearchParams();

        contactRoleToggleParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        contactRoleToggleParams.set(this.serviceConstants.CountryCode, this.countryCode);
        contactRoleToggleParams.set(this.serviceConstants.Action, '0');

        let bodyParams = {};
        bodyParams['Function'] = 'ContactPersonRoleToggle';
        bodyParams['ContactPersonID'] = this.storeFieldValues.ContactPersonID;
        bodyParams['ContactPersonRoleID'] = contactPersonRoleID;
        bodyParams['CacheKey'] = '';
        if (this.portfolioRoleLevelDropdown.selectedItem === 'ThisContact') {
            bodyParams['ViewingAllRolesForContact'] = 'Y';
            bodyParams['PortfolioLevelKey'] = this.savePortfolioLevelKey;
        } else {
            bodyParams['ViewingAllRolesForContact'] = 'N';
            bodyParams['PortfolioLevelKey'] = this.portfolioRoleLevelDropdown.selectedItem;
        }
        bodyParams['PortfolioLevelValue'] = this.portfolioLevelValue;
        bodyParams['GroupAccountNumber'] = this.storeFieldValues.GroupAccountNumber;
        bodyParams['AccountNumber'] = this.storeFieldValues.AccountNumber;
        bodyParams['ContractNumber'] = this.storeFieldValues.ContractNumber;
        bodyParams['PremiseNumber'] = this.storeFieldValues.PremiseNumber;
        bodyParams['InvoiceGroupNumber'] = this.storeFieldValues.InvoiceGroupNumber;
        bodyParams['EffectiveFromDate'] = this.storeFieldValues.EffectiveFromDate;
        bodyParams['CurrentCallLogID'] = this.storeFieldValues.CurrentCallLogID ? this.storeFieldValues.CurrentCallLogID : '';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, contactRoleToggleParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.ErrorMessage) {
                    this.pageParams.hasError = true;
                    this.pageParams.errorMessage = data.ErrorMessage;
                    this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
                    return;
                }
                this.buildGridContactRole();
                this.pageParams.closedWithChanges = 'Y';
                this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

}
