import { ContactActionTypes } from './../../../../actions/contact';
import { HttpService } from './../../../../../shared/services/http-service';
import { Utils } from './../../../../../shared/services/utility';
import { Store } from '@ngrx/store';
import { ServiceConstants } from './../../../../../shared/constants/service.constants';
import { Subscription } from 'rxjs';
import { PaginationComponent } from './../../../../../shared/components/pagination/pagination';
import { GridComponent } from '../../../../../shared/components/grid/grid';

import { URLSearchParams } from '@angular/http';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MntConst } from '../../../../../shared/services/riMaintenancehelper';
@Component({
    selector: 'icabs-contact-person-type-a',
    templateUrl: 'contactPerson-type-a.html'
})

export class ContactPersonTypeAComponent implements OnInit, OnDestroy {

    @ViewChild('riGridContact') riGridContact: GridComponent;
    @ViewChild('riGridContactGlobalRole') riGridContactGlobalRole: GridComponent;
    @ViewChild('riGridContactPagination') riGridContactPagination: PaginationComponent;
    @ViewChild('riGridContactGlobalRolePagination') riGridContactGlobalRolePagination: PaginationComponent;

    public inputParams: any = {};
    public storeSubscription: Subscription;
    public search: URLSearchParams = new URLSearchParams();
    public headerParams: any = {
        method: 'ccm/maintenance',
        module: 'customer',
        operation: 'ContactManagement/iCABSCMContactPersonMaintenance'
    };
    public action: any = '2';
    public pageSize: number;
    public maxColumnsContact: number;
    public currentPageContact: number;
    public gridTotalItemsContact: number;
    public gridTotalItemsGlobalRole: number;
    public gridSortHeaders: Array<any>;
    private businessCode: string;
    private countryCode: string;
    private headerClicked: string = '';
    private sortType: string = 'ASC';

    public maxColumnsContactGlobalRole: number;
    public currentPageContactGlobalRole: number;
    public btnMode: string;

    private pageParams: any = {};
    private storeFieldValues: any = {};
    public cUpdateMode: boolean = false;
    private selectedRow: any = -1;
    public validateProperties: Array<any> = [
        {
            'type': MntConst.eTypeTextFree,
            'index': 0
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 1
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 2
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 3
        },
        {
            'type': MntConst.eTypeDate,
            'index': 4
        },
        {
            'type': MntConst.eTypeDate,
            'index': 5
        }];

    constructor(
        private utils: Utils,
        private store: Store<any>,
        private serviceConstants: ServiceConstants,
        private httpService: HttpService
    ) {
        this.countryCode = this.utils.getCountryCode();
        this.businessCode = this.utils.getBusinessCode();
    }

    ngOnInit(): void {

        this.pageSize = 4;
        this.currentPageContact = 1;
        this.maxColumnsContact = 10;

        this.currentPageContactGlobalRole = 1;

        this.storeSubscription = this.store.select('contact').subscribe(data => {
            switch (data['action']) {
                case ContactActionTypes.SAVE_PARAMS:
                    if (data !== null && data['params'] && !(Object.keys(data['params']).length === 0 && data['params'].constructor === Object)) {
                        this.pageParams = data['params'];
                        this.cUpdateMode = data['params'].cUpdateMode;
                        if (this.pageParams.riContact_Execute) {
                            this.btnMode = data['params'].btnMode;
                            this.buildGridContact();
                        }
                    }
                    break;
                case ContactActionTypes.SAVE_FIELD:
                    if (data !== null && data['fieldValue'] && !(Object.keys(data['fieldValue']).length === 0 && data['fieldValue'].constructor === Object)) {
                        this.storeFieldValues = data['fieldValue'];
                    }
                    break;
            }
        });

        this.gridSortHeaders = [{
            'fieldName': 'SrchContactPersonName',
            'index': 0,
            'sortType': 'ASC'
        }, {
            'fieldName': 'SrchContactPosition',
            'index': 1,
            'sortType': 'ASC'
        }, {
            'fieldName': 'SrchContactTelephone',
            'index': 2,
            'sortType': 'ASC'
        }, {
            'fieldName': 'SrchContactMobile',
            'index': 3,
            'sortType': 'ASC'
        }, {
            'fieldName': 'SrchGroupAcct',
            'index': 4,
            'sortType': 'ASC'
        }, {
            'fieldName': 'SrchAccount',
            'index': 5,
            'sortType': 'ASC'
        }, {
            'fieldName': 'SrchInvGroup',
            'index': 6,
            'sortType': 'ASC'
        }, {
            'fieldName': 'SrchContract',
            'index': 7,
            'sortType': 'ASC'
        }, {
            'fieldName': 'SrchPremise',
            'index': 8,
            'sortType': 'ASC'
        }];

        for (let k = 0; k < this.gridSortHeaders.length; k++) {
            if (this.gridSortHeaders[k].fieldName === this.headerClicked) {
                this.gridSortHeaders[k].sortType = this.sortType === 'Descending' ? 'DESC' : 'ASC';
            }
        }
    }

    //Page Destroy
    public ngOnDestroy(): void {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }

    private buildGridContact(): void {
        //this.gridTotalItemsContact = 0;
        this.pageParams.riContact_Execute = false;
        this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });

        let gridHandle = (Math.floor(Math.random() * 900000) + 100000).toString();

        let contactGridParams: any = {};
        contactGridParams.method = this.headerParams.method;
        contactGridParams.module = this.headerParams.module;
        contactGridParams.operation = this.headerParams.operation;

        let contactSearchParams: URLSearchParams = new URLSearchParams();

        contactSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        contactSearchParams.set(this.serviceConstants.CountryCode, this.countryCode);
        contactSearchParams.set(this.serviceConstants.GridName, 'ContactPersonPortfolio');
        contactSearchParams.set('ContactPersonRoleID', this.storeFieldValues.ContactPersonRoleID);
        contactSearchParams.set('ViewLevel', this.storeFieldValues.ViewLevel);

        if (this.storeFieldValues.GroupAccountNumber) {
            contactSearchParams.set('GroupAccountNumber', this.storeFieldValues.GroupAccountNumber);
        } else {
            contactSearchParams.delete('GroupAccountNumber');
        }
        if (this.storeFieldValues.AccountNumber) {
            contactSearchParams.set('AccountNumber', this.storeFieldValues.AccountNumber);
        } else {
            contactSearchParams.delete('AccountNumber');
        }
        if (this.storeFieldValues.ContractNumber) {
            contactSearchParams.set('ContractNumber', this.storeFieldValues.ContractNumber);
        } else {
            contactSearchParams.delete('ContractNumber');
        }

        if (this.storeFieldValues.PremiseNumber) {
            contactSearchParams.set('PremiseNumber', this.storeFieldValues.PremiseNumber);
        } else {
            contactSearchParams.delete('PremiseNumber');
        }
        if (this.storeFieldValues.InvoiceGroupNumber) {
            contactSearchParams.set('InvoiceGroupNumber', this.storeFieldValues.InvoiceGroupNumber);
        } else {
            contactSearchParams.delete('InvoiceGroupNumber');
        }

        contactSearchParams.set(this.serviceConstants.GridHandle, gridHandle);
        contactSearchParams.set(this.serviceConstants.GridMode, '0');
        contactSearchParams.set(this.serviceConstants.GridCacheRefresh, 'True');
        contactSearchParams.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
        contactSearchParams.set(this.serviceConstants.GridSortOrder, this.sortType);
        contactSearchParams.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        contactSearchParams.set(this.serviceConstants.GridPageCurrent, this.currentPageContact.toString());
        contactSearchParams.set(this.serviceConstants.Action, this.action);

        contactGridParams.search = contactSearchParams;
        this.riGridContact.loadGridData(contactGridParams);
    }

    public sortGridContact(data: any): void {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGridContact();

    }

    public selectedRowFocusContact(data: any): void {
        let rowIndex;
        if (data.rowData) {
            rowIndex = data.rowIndex;
        } else {
            rowIndex = 0;
        }
        let cellData: any = this.riGridContact.getCellInfoForSelectedRow(rowIndex, 0);
        let cAdditionalInfo = cellData.additionalData.split('^');

        this.storeFieldValues.ContactPersonID = cAdditionalInfo[0];
        this.storeFieldValues.LastUpdateDate = cAdditionalInfo[1];
        this.storeFieldValues.LastUpdateTime = cAdditionalInfo[2];
        this.storeFieldValues.LastUpdateUserName = cAdditionalInfo[3];
        this.storeFieldValues.EffectiveFromDate = cAdditionalInfo[4];
        this.storeFieldValues.ContactPersonName = cAdditionalInfo[5];
        this.storeFieldValues.ContactPersonPosition = cAdditionalInfo[6];
        this.storeFieldValues.ContactPersonDepartment = cAdditionalInfo[7];
        this.storeFieldValues.ContactPersonNotes = cAdditionalInfo[8];
        this.storeFieldValues.ContactPersonTelephone = cAdditionalInfo[9];
        this.storeFieldValues.ContactPersonMobile = cAdditionalInfo[10];
        this.storeFieldValues.ContactPersonEmail = cAdditionalInfo[11];
        this.storeFieldValues.ContactPersonFax = cAdditionalInfo[12];
        this.storeFieldValues.ContactPersonHighPortfolioLevel = cAdditionalInfo[13];

        this.storeFieldValues.RolesContactPersonID = this.storeFieldValues.ContactPersonID;
        this.storeFieldValues.RolesContactPersonName = this.storeFieldValues.ContactPersonName;
        this.storeFieldValues.PortfolioRoleLevelSelect = this.storeFieldValues.ContactPersonHighPortfolioLevel;
        this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: this.storeFieldValues });

        this.selectedRow = rowIndex;
        this.pageParams.lRefreshContactRole = true;
        this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });

        this.buildGridContactGlobalRole(this.storeFieldValues.PortfolioRoleLevelSelect);
    }


    public buildGridContactGlobalRole(portfolioRoleLevelSelect: string): void {
        let gridHandle = (Math.floor(Math.random() * 900000) + 100000).toString();

        if (portfolioRoleLevelSelect === 'ThisContact') {
            this.maxColumnsContactGlobalRole = 9;
        }
        else {
            this.maxColumnsContactGlobalRole = 6;
        }

        let riGridContactGlobalRoleParams: any = {};
        riGridContactGlobalRoleParams.method = this.headerParams.method;
        riGridContactGlobalRoleParams.module = this.headerParams.module;
        riGridContactGlobalRoleParams.operation = this.headerParams.operation;

        let contactGlobalRoleSearchParams: URLSearchParams = new URLSearchParams();

        contactGlobalRoleSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        contactGlobalRoleSearchParams.set(this.serviceConstants.CountryCode, this.countryCode);
        contactGlobalRoleSearchParams.set(this.serviceConstants.GridName, 'ContactPersonGlobalRole');
        contactGlobalRoleSearchParams.set('ContactPersonID', this.storeFieldValues.ContactPersonID);
        contactGlobalRoleSearchParams.set('ContactPersonRoleID', this.storeFieldValues.ContactPersonRoleID);
        contactGlobalRoleSearchParams.set('GroupAccountNumber', this.storeFieldValues.GroupAccountNumber);
        contactGlobalRoleSearchParams.set('AccountNumber', this.storeFieldValues.AccountNumber);
        contactGlobalRoleSearchParams.set('ContractNumber', this.storeFieldValues.ContractNumber);
        contactGlobalRoleSearchParams.set('PremiseNumber', this.storeFieldValues.PremiseNumber);
        contactGlobalRoleSearchParams.set('InvoiceGroupNumber', this.storeFieldValues.InvoiceGroupNumber);
        contactGlobalRoleSearchParams.set('ViewLevel', this.storeFieldValues.ViewLevel);
        contactGlobalRoleSearchParams.set(this.serviceConstants.GridHandle, gridHandle);
        contactGlobalRoleSearchParams.set(this.serviceConstants.GridCacheRefresh, 'True');
        contactGlobalRoleSearchParams.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        contactGlobalRoleSearchParams.set(this.serviceConstants.GridPageCurrent, this.currentPageContactGlobalRole.toString());
        contactGlobalRoleSearchParams.set(this.serviceConstants.GridMode, '0');
        contactGlobalRoleSearchParams.set(this.serviceConstants.Action, this.action);

        riGridContactGlobalRoleParams.search = contactGlobalRoleSearchParams;
        this.riGridContactGlobalRole.loadGridData(riGridContactGlobalRoleParams);
    }

    public gridInfoContact(data: any): void {
        if (data.totalPages > 0) {
            if (data.totalRows === 0) {
                this.gridTotalItemsContact = 0;
                this.noContactsFound();
            } else {
                this.gridTotalItemsContact = data.totalRows;
                if (this.selectedRow === -1) {
                    this.riGridContact.onCellClick(0, 0);
                } else {
                    this.riGridContact.onCellClick(this.selectedRow, 0);
                }
            }
        }

    }

    public getCurrentContactPage(event: any): void {
        this.selectedRow = -1;
        this.currentPageContact = event.value;
        this.buildGridContact();
    }

    public getCurrentPageContactRole(event: any): void {
        this.currentPageContactGlobalRole = event.value;
        this.buildGridContactGlobalRole(this.storeFieldValues.PortfolioRoleLevelSelect);
    }

    private noContactsFound(): void {
        //When no contacts were found within the main contact search - clear down details etc...
        let fieldParams: Object = {};

        //tab2
        fieldParams['ContactPersonID'] = '';
        fieldParams['LastUpdateDate'] = '';
        fieldParams['LastUpdateTime'] = '';
        fieldParams['LastUpdateUserName'] = '';
        fieldParams['EffectiveFromDate'] = '';
        fieldParams['ContactPersonName'] = '';
        fieldParams['ContactPersonPosition'] = '';
        fieldParams['ContactPersonDepartment'] = '';
        fieldParams['ContactPersonNotes'] = '';
        fieldParams['ContactPersonTelephone'] = '';
        fieldParams['ContactPersonMobile'] = '';
        fieldParams['ContactPersonEmail'] = '';
        fieldParams['ContactPersonFax'] = '';

        //tab3
        fieldParams['RolesContactPersonID'] = '';
        fieldParams['RolesContactPersonName'] = '';
        fieldParams['RolesPrimaryContactPersonID'] = '';
        fieldParams['RolesPrimaryContactPersonName'] = '';

        // Clear Any Data Within The Existing Grid
        this.riGridContactGlobalRole.clearGridData();

        //if the user goes to Contact Roles tab - then force a refresh which will hide it because ContactPersonID is now blank
        this.pageParams.lRefreshContactRole = true;
        this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
    }

    public gridInfoContactGlobalRole(data: any): void {
        if (data.totalPages) {
            if (data.totalRows === 0) {
                this.gridTotalItemsGlobalRole = 0;
            } else {
                this.gridTotalItemsGlobalRole = data.totalRows;
            }
        }
    }

    public riGridContact_onRefresh(): void {
        this.currentPageContact = 1;
        this.riGridContact.clearGridData();
        this.riGridContactGlobalRole.clearGridData();
        this.buildGridContact();
    }

}
