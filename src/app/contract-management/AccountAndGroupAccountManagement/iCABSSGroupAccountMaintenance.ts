import * as moment from 'moment';
import { InternalGridSearchServiceModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { TableComponent } from './../../../shared/components/table/table';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { URLSearchParams } from '@angular/http';
import { GroupAccountNumberComponent } from './../../../app/internal/search/iCABSSGroupAccountNumberSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { Subscription } from 'rxjs/Subscription';
import { ContactActionTypes } from './../../actions/contact';
import { Observable } from 'rxjs/Rx';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { MntConst } from '../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSSGroupAccountMaintenance.html'
})

export class GroupAccountMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('promptConfirmModalDelete') public promptConfirmModalDelete;
    @ViewChild('GroupName') GroupName;
    @ViewChild('GroupContactName') GroupContactName;
    @ViewChild('GroupContactPosition') GroupContactPosition;
    @ViewChild('GroupContactTelephone') GroupContactTelephone;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('savebutton') public savebutton;

    public pageId: string = '';
    public lookUpSubscription: Subscription;
    public accountEllipsisFlag: Boolean = false;
    public controls = [
        { name: 'GroupAccountNumber', disabled: false, readonly: false },
        { name: 'GroupName', required: true },
        { name: 'GroupAgreementNumber' },
        { name: 'GroupContactName' },
        { name: 'GroupContactPosition' },
        { name: 'GroupContactDepartment' },
        { name: 'GroupContactTelephone' },
        { name: 'GroupContactMobile' },
        { name: 'GroupContactEMail' },
        { name: 'GroupContactFax' },
        { name: 'GroupAccountPhotoRequiredInd' },
        { name: 'PurchaseOrderNoRequiredInd' },
        { name: 'WindowClosingName' },
        { name: 'AgreementDateDisplay', type: MntConst.eTypeDate }
    ];


    private queryParams: any = {
        operation: 'System/iCABSSGroupAccountMaintenance',
        module: 'group-account',
        method: 'contract-management/maintenance'
    };
    public MenuOption: string;
    public showCloseButton: boolean = true;
    public isRequesting: boolean = false;
    public promptConfirmContent: any;
    public showMessageHeader: boolean = true;
    public AgreementDate: Date;
    public FieldDateDisplayed: string;
    public dateReadOnly: boolean = true;
    public columns: Array<any> = new Array();
    public itemsPerPage: string = '10';
    public page: string = '1';
    public showHeader: boolean = true;
    public searchModalRoute: string = '';
    public searchPageRoute: string = '';
    // public tdAmendContact: Boolean;
    public groupAccountNumberSearchParams: any = {
        'parentMode': 'Search',
        'showAddNew': true
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public autoOpenSearch: boolean = false;
    public groupAccountSearchComponent = GroupAccountNumberComponent;
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSGROUPACCOUNTMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.pageParams.mode = 'UPDATE/DELETE';
            this.dateReadOnly = false;
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountNumber');
            this.populateUIFromFormData();
            let dateTemp = this.getControlValue('AgreementDateDisplay').split('/');
            this.AgreementDate = new Date(dateTemp[2], dateTemp[1] - 1, dateTemp[0]);
            // this.AgreementDate = this.getControlValue('AgreementDateDisplay');
        } else {
            this.pageParams.mode = 'ADD NEW';
            this.window_onload();
        }

        this.getSysCharDtetails();
        this.callLookupData();

        /*this.routeAwayComponent.dataEvent.asObservable().subscribe((event) => {
            if (event.value === 'save') {
                this.cancelClicked();
            }
        });*/

    }

    ngAfterViewInit(): void {
        if (this.isReturning()) {
            this.pageParams.mode = 'UPDATE/DELETE';
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountNumber');
            this.populateUIFromFormData();
            this.onGroupAccountNumberChange({});
        } else {
            this.pageParams.mode = 'ADD NEW';
            this.autoOpenSearch = true;
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private window_onload(): void {
        this.accountEllipsisFlag = false;
        //this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountNumber');
        this.sensitiseContactDetails(false);
        // this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.getStoreSubscriptionData();
        if (this.AgreementDate) {
            this.FieldDateDisplayed = this.utils.formatDate(this.AgreementDate);
        }
        this.pageParams.mode = '';
        this.pageParams.tdAmendContact = false;
    }

    /* Store Data Retrieved --@TODO to be tested -- Retrofit effort in child parent ingetration--Pradeep*/
    private getStoreSubscriptionData(): void {
        this.storeSubscription = this.store.select('contact').subscribe(data => {
            switch (data['action']) {
                case ContactActionTypes.SAVE_PARAMS:
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'WindowClosingName', data.data);
                    if (this.uiForm.controls['WindowClosingName'].value === 'AmendmentsMade') {
                        this.refreshGroupAccountOnContactPersonMaintanenceReturn();
                    }
                    break;
            }
        });
    }

    /*Get formData from LookUp API Call*/
    public callLookupData(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP = [
            {
                'table': 'riRegistry',
                'query': {
                    'RegSection': 'Contact Person'
                },
                'fields': ['RegSection']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0][0] && data[0][0].RegSection) {
                this.pageParams.vSCMultiContactInd = true;
            } else {
                this.pageParams.vSCMultiContactInd = false;
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    }

    /*Spped script*/
    private getSysCharDtetails(): void {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharDisableFirstCapitalOnAddressContact,
            this.sysCharConstants.SystemCharUseVisitTolerances,
            this.sysCharConstants.SystemCharUseInfestationTolerances

        ];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vSCCapitalFirstLtr = record[0]['Required'];
            this.pageParams.vSCVisitTolerances = record[1]['Required'];
            this.pageParams.vSCInfestationTolerances = record[2]['Required'];
            /*if (this.pageParams.vSCCapitalFirstLtr) {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactName', false);
            } else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactName', false);
            }*/
        });
    }

    /*Ellipsis data return*/
    public onGroupAccountDataReceived(data: any, route: any): void {

        this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupAccountNumber', data.GroupAccountNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupName', data.GroupName);
        this.pageParams.GroupAccountNumber = data.GroupAccountNumber;
        if (this.uiForm.controls['GroupAccountNumber'].value && this.uiForm.controls['GroupName'].value) {
            this.pageParams.mode = 'UPDATE/DELETE';
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountNumber');
            this.getDataForGroupAccountNumber(this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'));
            this.sensitiseContactDetails(true);
            this.accountEllipsisFlag = false;
            this.setFormMode(this.c_s_MODE_UPDATE);
        } else {
            this.pageParams.mode = 'ADD NEW';
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountNumber');
            this.accountEllipsisFlag = true;
            this.setFormMode(this.c_s_MODE_ADD);
        }
    }

    /*Get group account details for the selected group account number*/
    private getDataForGroupAccountNumber(grpAccNo: any): any {
        let searchParams: URLSearchParams;
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('GroupAccountNumber', grpAccNo);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, searchParams)
            .subscribe(
            (data) => {
                this.afterFetch();
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupName', data.GroupName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupAgreementNumber', data.GroupAgreementNumber);
                if (data.GroupAgreementDate) {
                    this.AgreementDate = new Date(data.GroupAgreementDate);
                    this.setControlValue('AgreementDateDisplay', data.GroupAgreementDate);
                } else {
                    setTimeout(() => {
                        this.AgreementDate = null;
                    }, 100);

                }
                this.pageParams.ttGroupAccount = data.ttGroupAccount;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactName', data.GroupContactName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactPosition', data.GroupContactPosition);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactDepartment', data.GroupContactDepartment);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactTelephone', data.GroupContactTelephone);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactMobile', data.GroupContactMobile);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactTelephone', data.GroupContactTelephone);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactEMail', data.GroupContactEMail);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactFax', data.GroupContactFax);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupAccountPhotoRequiredInd', data.GroupAccountPhotoRequiredInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PurchaseOrderNoRequiredInd', data.PurchaseOrderNoRequiredInd);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.pageParams.mode = 'UPDATE/DELETE';
                this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountNumber');
                this.sensitiseContactDetails(true);
                this.accountEllipsisFlag = false;
                this.setFormMode(this.c_s_MODE_UPDATE);
            },
            error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public toTitleCase(control: string): void {
        if (control === 'GroupContactName' && !this.pageParams.vSCCapitalFirstLtr) {
            this.uiForm.controls[control].setValue(this.utils.toTitleCase(this.uiForm.controls[control].value));
        } else {
            this.uiForm.controls[control].setValue(this.utils.toTitleCase(this.uiForm.controls[control].value));
        }
    }

    /*Date picker string value change*/
    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('AgreementDateDisplay', value.value);
            this.FieldDateDisplayed = value.value;
        } else {
            this.setControlValue('AgreementDateDisplay', '');
            this.FieldDateDisplayed = '';
        }
    }

    /*Save button clicked while upadate & add new*/
    public saveClicked(): void {
        if (this.uiForm.valid && this.uiForm.controls['GroupAccountNumber'].value) {
            this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        } else if (!this.uiForm.controls['GroupAccountNumber'].value) {
            this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected, title: 'Error' }, false);
        }
        if (!this.uiForm.controls['GroupName'].value || this.uiForm.controls['GroupName'].value === '') {
            this.GroupName.nativeElement.focus();
            this.savebutton.nativeElement.focus();
        } if (this.pageParams.mode === 'ADD NEW' && (!this.uiForm.controls['GroupContactName'].value || this.uiForm.controls['GroupContactName'].value === '')) {
            this.GroupContactName.nativeElement.focus();
            this.GroupName.nativeElement.focus();
        } if (this.pageParams.mode === 'ADD NEW' && (!this.uiForm.controls['GroupContactPosition'].value || this.uiForm.controls['GroupContactPosition'].value === '')) {
            this.GroupContactPosition.nativeElement.focus();
            this.GroupName.nativeElement.focus();
        } if (this.pageParams.mode === 'ADD NEW' && (!this.uiForm.controls['GroupContactTelephone'].value || this.uiForm.controls['GroupContactTelephone'].value === '')) {
            this.GroupContactTelephone.nativeElement.focus();
            this.GroupName.nativeElement.focus();
        }
    }

    /*Delete button clcked*/
    public deleteClicked(): void {
        if (this.uiForm.valid && this.uiForm.controls['GroupAccountNumber'].value) {
            this.promptConfirmContent = MessageConstant.Message.DeleteRecord;
            this.promptConfirmModalDelete.show();
        } else {
            this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected, title: 'Error' }, false);
        }
    }

    /*Cancel clicked*/
    public cancelClicked(): void {
        this.formPristine();
        this.setFormMode(this.c_s_MODE_SELECT);
        this.AgreementDate = void 0;
        this.FieldDateDisplayed = '';
        this.accountEllipsisFlag = false;
        if (this.pageParams.mode === 'UPDATE/DELETE') {
            this.getDataForGroupAccountNumber(this.pageParams.GroupAccountNumber);
        } else if (this.pageParams.mode === 'ADD NEW') {
            this.autoOpenSearch = true;
            this.resetForm();
        } else {
            return;
        }
    }

    /*Reseting form values*/
    private resetForm(): void {
        this.setControlValue('AgreementDateDisplay', '');
        this.AgreementDate = null;
        this.FieldDateDisplayed = '';
        if (this.pageParams.mode === 'UPDATE/DELETE') {
            this.AgreementDate = void 0;
        } else {
            this.AgreementDate = null;
        }
        this.sensitiseContactDetails(false);
        //this.FieldDateDisplayed = '';
        this.pageParams.tdAmendContact = false;
        this.uiForm.reset();
    }

    /*API call to save the updated form*/
    public updateGroupAccountDetails(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        let postParams: any = {};
        postParams.GroupAccountNumber = this.uiForm.controls['GroupAccountNumber'].value;
        // postParams.ROWID = this.formData.ttGroupAccount;
        postParams.GroupName = this.uiForm.controls['GroupName'].value;
        postParams.GroupAgreementNumber = this.uiForm.controls['GroupAgreementNumber'].value ? this.uiForm.controls['GroupAgreementNumber'].value : '';
        postParams.GroupAgreementDate = this.FieldDateDisplayed;
        postParams.GroupAccountPhotoRequiredInd = this.uiForm.controls['GroupAccountPhotoRequiredInd'].value;
        postParams.PurchaseOrderNoRequiredInd = this.uiForm.controls['PurchaseOrderNoRequiredInd'].value;
        postParams.GroupContactName = this.uiForm.controls['GroupContactName'].value;
        postParams.GroupContactPosition = this.uiForm.controls['GroupContactPosition'].value;
        postParams.GroupContactDepartment = this.uiForm.controls['GroupContactDepartment'].value ? this.uiForm.controls['GroupContactDepartment'].value : '';
        // postParams.GroupContactPosition = this.uiForm.controls['GroupContactPosition'].value;
        postParams.GroupContactTelephone = this.uiForm.controls['GroupContactTelephone'].value ? this.uiForm.controls['GroupContactTelephone'].value : '';
        postParams.GroupContactMobile = this.uiForm.controls['GroupContactMobile'].value ? this.uiForm.controls['GroupContactMobile'].value : '';
        postParams.GroupContactEMail = this.uiForm.controls['GroupContactEMail'].value ? this.uiForm.controls['GroupContactEMail'].value : '';
        postParams.GroupContactFax = this.uiForm.controls['GroupContactFax'].value ? this.uiForm.controls['GroupContactFax'].value : '';
        //if (!moment(this.FieldDateDisplayed, 'DD/MM/YYYY', true).isValid()) {
        //
        //} else {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(new Error(e['errorMessage']));
                    } else {
                        this.afterSave();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
        //}
    }

    /*API call to save new group account record*/
    public saveGroupAccountNewRecord(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '1');
        let postParams: any = {};
        postParams.GroupAccountNumber = this.uiForm.controls['GroupAccountNumber'].value;
        // postParams.ROWID = this.formData.ttGroupAccount;
        postParams.GroupName = this.uiForm.controls['GroupName'].value;
        postParams.GroupAgreementNumber = this.uiForm.controls['GroupAgreementNumber'].value ? this.uiForm.controls['GroupAgreementNumber'].value : '';
        postParams.GroupAgreementDate = this.FieldDateDisplayed;
        postParams.GroupAccountPhotoRequiredInd = this.uiForm.controls['GroupAccountPhotoRequiredInd'].value;
        postParams.PurchaseOrderNoRequiredInd = this.uiForm.controls['PurchaseOrderNoRequiredInd'].value;
        postParams.GroupContactName = this.uiForm.controls['GroupContactName'].value;
        postParams.GroupContactPosition = this.uiForm.controls['GroupContactPosition'].value;
        postParams.GroupContactDepartment = this.uiForm.controls['GroupContactDepartment'].value ? this.uiForm.controls['GroupContactDepartment'].value : '';
        // postParams.GroupContactPosition = this.uiForm.controls['GroupContactPosition'].value;
        postParams.GroupContactTelephone = this.uiForm.controls['GroupContactTelephone'].value ? this.uiForm.controls['GroupContactTelephone'].value : '';
        postParams.GroupContactMobile = this.uiForm.controls['GroupContactMobile'].value ? this.uiForm.controls['GroupContactMobile'].value : '';
        postParams.GroupContactEMail = this.uiForm.controls['GroupContactEMail'].value ? this.uiForm.controls['GroupContactEMail'].value : '';
        postParams.GroupContactFax = this.uiForm.controls['GroupContactFax'].value ? this.uiForm.controls['GroupContactFax'].value : '';
        //if (!moment(this.FieldDateDisplayed, 'DD/MM/YYYY', true).isValid()) {
        //
        //} else {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(new Error(e['errorMessage']));
                    } else {
                        this.pageParams.GroupAccountNumber = this.uiForm.controls['GroupAccountNumber'].value;
                        this.afterSave();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
        //}
    }

    /*API call to delete group account record*/
    public deleteGroupAccount(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '3');

        let postParams: any = {};
        postParams.GroupAccountNumber = this.uiForm.controls['GroupAccountNumber'].value;
        //postParams.ROWID = this.formData.ttGroupAccount;

        this.ajaxSource.next(this.ajaxconstant.START);

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(new Error(e['errorMessage']));
                    } else {
                        this.pageParams.mode = 'ADD NEW';
                        setTimeout(() => {
                            this.AgreementDate = void 0;
                        }, 100);

                        this.resetForm();
                        this.messageModal.show({ msg: MessageConstant.Message.RecordDeletedSuccessfully, title: 'Message' }, false);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /*API call to fetch next group account number during add*/
    public addNewGroupAccountNumber(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'NextGroupAccount';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(new Error(e['errorMessage']));
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupAccountNumber', e.NextGroupAccountNumber);
                        this.pageParams.mode = 'ADD NEW';
                        this.sensitiseContactDetails(true);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /***After confirmation service call to addnew/update/delete  */
    public promptConfirm(type: any): void {
        this.accountEllipsisFlag = false;
        switch (this.pageParams.mode) {
            case 'UPDATE/DELETE':
                if (type === 'save') {
                    this.beforeUpdate();
                    this.updateGroupAccountDetails();
                } else {
                    this.deleteGroupAccount();
                }
                break;
            case 'ADD NEW':
                this.autoOpenSearch = false;
                this.pageParams.mode = 'UPDATE/DELETE';
                this.saveGroupAccountNewRecord();
                break;
            default:
            //
        }
    }

    /*Callback when add new button of ellipsis is clicked*/
    public btnAddOnClick(add: any): void {
        this.setFormMode(this.c_s_MODE_ADD);
        setTimeout(() => {
            this.accountEllipsisFlag = true;
        }, 200);
        this.beforeAdd();
        this.addNewGroupAccountNumber();
    }

    /*Option value change*/
    public menuOnchange(menu: any): void {
        this.MenuOption = 'values';
        if (this.pageParams.mode === 'UPDATE/DELETE') {
            // this.routeAwayGlobals.setSaveEnabledFlag(true);
        } else {
            // this.routeAwayGlobals.setSaveEnabledFlag(false);
        }
        switch (menu) {
            case 'Group Account Move':
                this.navigate('GroupAccountMove', this.ContractManagementModuleRoutes.ICABSSGROUPACCOUNTMOVE);
                break;
            case 'Group Account Details':
                this.navigate('Lookup', '/application/accountgroupsearch', {
                    parentMode: 'Lookup',
                    GroupAccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'),
                    GroupName: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName')
                });
                break;
            case 'Customer Information':
                this.cmdCustomerInfo_onclick();

                break;
            case 'contacts':
                if (this.uiForm.controls['GroupAccountNumber'].value && this.pageParams.mode !== 'ADD NEW') {
                    this.cmdContactDetails();
                } if (this.pageParams.mode === 'ADD NEW') {
                    this.errorModal.show({ msg: 'Request Restricted, Return To Normal Mode First', title: 'Error' }, false);
                } else if (this.pageParams.mode === '') {
                    this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected, title: 'Error' }, false);
                }
                break;
            case 'VisitTolerances':
                if (this.uiForm.controls['GroupAccountNumber'].value && this.pageParams.mode !== 'ADD NEW') {
                    this.navigate('GroupAccountVisitTolerance', InternalGridSearchServiceModuleRoutes.ICABSSVISITTOLERANCEGRID, {
                        parentMode: 'GroupAccountVisitTolerance',
                        GroupAccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'),
                        GroupName: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName')
                    });
                    // this.router.navigate(['/grid/application/visittolerancegrid'], {
                    //     queryParams: {
                    //         parentMode: 'GroupAccountVisitTolerance',
                    //         GroupAccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'),
                    //         GroupName: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName')
                    //     }
                    // });

                    // this.navigate('GroupAccountVisitTolerance', '/grid/application/visittolerancegrid');
                } if (this.pageParams.mode === 'ADD NEW') {
                    this.errorModal.show({ msg: 'Request Restricted, Return To Normal Mode First', title: 'Error' }, false);
                } else if (this.pageParams.mode === '') {
                    this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected, title: 'Error' }, false);
                }
                break;
            case 'InfestationTolerances':
                if (this.uiForm.controls['GroupAccountNumber'].value && this.pageParams.mode !== 'ADD NEW') {
                    this.navigate('GroupAccountInfestationTolerance', InternalGridSearchServiceModuleRoutes.ICABSSINFESTATIONTOLERANCEGRID, {
                        parentMode: 'GroupAccountInfestationTolerance',
                        GroupAccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'),
                        GroupName: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName')
                    });
                } if (this.pageParams.mode === 'ADD NEW') {
                    this.errorModal.show({ msg: 'Request Restricted, Return To Normal Mode First', title: 'Error' }, false);
                } else if (this.pageParams.mode === '') {
                    this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected, title: 'Error' }, false);
                }
                break;
            case 'GroupAccountPriceGroup':
                if (this.uiForm.controls['GroupAccountNumber'].value && this.pageParams.mode !== 'ADD NEW') {
                    this.errorModal.show({ msg: 'Page under development', title: 'Error' }, false);
                    //    window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBGroupAccountPriceGroupMaint.htm"
                } if (this.pageParams.mode === 'ADD NEW') {
                    this.errorModal.show({ msg: 'Request Restricted, Return To Normal Mode First', title: 'Error' }, false);
                } else if (this.pageParams.mode === '') {
                    this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected, title: 'Error' }, false);
                }
                break;
            case 'GroupAccountProductImport':
                this.errorModal.show({ msg: 'Page under development', title: 'Error' }, false);
                // window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBGroupAccountProductImport.htm"
                break;
            default:
                break;
        }
    }

    public cmdCustomerInfo_onclick(): void {
        if (this.pageParams.mode !== 'ADD NEW') {
            this.navigate('GroupAccount', InternalGridSearchServiceModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY.URL_1, {
                parentMode: 'GroupAccount',
                groupAccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'),
                groupName: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName')
            });
            // this.router.navigate(['/grid/maintenance/contract/customerinformation'], {
            //     queryParams: {
            //         parentMode: 'GroupAccount',
            //         groupAccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'),
            //         groupName: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName')
            //     }
            // });
        } if (this.pageParams.mode === 'ADD NEW') {
            this.errorModal.show({ msg: 'Request Restricted, Return To Normal Mode First', title: 'Error' }, false);
        } else if (this.pageParams.mode === '') {
            this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected, title: 'Error' }, false);
        }
    }

    private cmdContactDetails(): void {
        this.navigate('GroupAccount', InternalMaintenanceServiceModuleRoutes.ICABSCMCONTACTPERSONMAINTENANCE, {
            parentMode: 'GroupAccount',
            groupAccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'),
            groupName: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName')
        });
        // this.router.navigate(['/application/ContactPersonMaintenance'], {
        //     queryParams: {
        //         parentMode: 'GroupAccount',
        //         groupAccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'),
        //         groupName: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName')
        //     }
        // });
    }

    /*Keydown on group account umber field*/
    public onKeyDown(event: any): void {
        /*event.preventDefault();
        if (event.keyCode === 40) {
            this.autoOpenSearch = true;
        }*/
    }

    public onGroupAccountNumberChange(event: any): void {
        if (this.uiForm.controls['GroupAccountNumber'].value) {
            this.getDataForGroupAccountNumber(this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'));

        }
    }

    /*Contact info button clicked*/
    public btnAmendContact_OnClick(): void {
        this.cmdContactDetails();
    }

    private beforeAdd(): void {
        this.resetForm();
        this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountNumber');
        this.GroupName.nativeElement.focus();
        this.pageParams.tdAmendContact = false;
        this.sensitiseContactDetails(true);
        this.GroupName.nativeElement.focus();
        // this.formPristine();

    }

    private beforeUpdate(): void {
        if (this.pageParams.vSCMultiContactInd) {
            this.pageParams.tdAmendContact = true;
        }
    }

    private afterSave(): void {
        if (this.pageParams.vSCMultiContactInd) {
            this.pageParams.tdAmendContact = true;
        }
        this.formPristine();
        this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' }, false);
    }

    private afterFetch(): void {
        if (this.pageParams.vSCMultiContactInd) {
            this.pageParams.tdAmendContact = true;
        }
    }

    private sensitiseContactDetails(lSensitise: any): void {
        if (lSensitise) {
            this.dateReadOnly = false;
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupName');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupAgreementNumber');
            this.riExchange.riInputElement.Enable(this.uiForm, 'AgreementDate');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupContactName');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupContactPosition');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupContactDepartment');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupContactMobile');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupContactEMail');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupContactTelephone');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupContactFax');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupAccountPhotoRequiredInd');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PurchaseOrderNoRequiredInd');
            if (this.pageParams.mode === 'ADD NEW') {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactName', true);
                // this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactEmail', true);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactPosition', true);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactTelephone', true);
            } else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactName', false);
                // this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactEmail', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactPosition', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactTelephone', false);
            }
        } else {
            this.dateReadOnly = true;
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupName');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAgreementNumber');
            this.riExchange.riInputElement.Disable(this.uiForm, 'AgreementDate');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupContactName');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupContactPosition');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupContactDepartment');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupContactMobile');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupContactEMail');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupContactTelephone');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupContactFax');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountPhotoRequiredInd');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PurchaseOrderNoRequiredInd');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactName', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactEmail', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactPosition', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactTelephone', false);
        }
    }

    /*Method to populate data in page after navigating back*/
    public refreshGroupAccountOnContactPersonMaintanenceReturn(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');

        let postParams: any = {};
        postParams.GroupAccountNumber = this.uiForm.controls['GroupAccountNumber'].value;
        postParams.Function = 'GetContactPersonChanges';
        this.ajaxSource.next(this.ajaxconstant.START);

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(new Error(e['errorMessage']));
                    } else {
                        if (e.ContactPersonFound === 'Y') {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactName', e.ContactPersonName);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactPosition', e.ContactPersonPosition);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactDepartment', e.ContactPersonDepartment);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactTelephone', e.ContactPersonTelephone);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactMobile', e.ContactPersonMobile);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactTelephone', e.GroupContactTelephone);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactEMail', e.ContactPersonEmail);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactFax', e.ContactPersonFax);
                        }
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public resetOnRoutCancel(): void {
        this.MenuOption = '';
    }

    /*Alerts user when user is moving away without saving the changes. //CR implementation*/
    // public canDeactivate(): Observable<boolean> {
    //     return this.routeAwayComponent.canDeactivate();
    // }
}
