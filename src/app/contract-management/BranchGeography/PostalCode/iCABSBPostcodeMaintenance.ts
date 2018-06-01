import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { Component, OnInit, AfterViewInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { RiExchange } from './../../../../shared/services/riExchange';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';

import { PostCodeSearchComponent } from './../../../internal/search/iCABSBPostcodeSearch.component';
import { SalesAreaSearchComponent } from './../../../internal/search/iCABSBSalesAreaSearch.component';

@Component({
    templateUrl: 'iCABSBPostcodeMaintenance.html'
})

export class PostcodeMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('PostCodeSearchEllipsis') PostCodeSearchEllipsis: EllipsisComponent;
    @ViewChild('premisesNumberEllipsis') premisesNumberEllipsis: EllipsisComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public queryParams: any = {
        operation: 'Business/iCABSBPostcodeMaintenance',
        module: 'contract-admin',
        method: 'contract-management/admin',
        ActionSearch: '0',
        Actionupdate: '6',
        ActionEdit: '2',
        ActionDelete: '3',
        ActionInsert: '1'
    };

    // message Modal popup
    public errorTitle: string;
    public errorContent: string;
    public showErrorHeader: boolean = true;
    // message Modal popup
    public messageTitle: string;
    public messageContent: string;
    public showMessageHeader: boolean = true;
    // Prompt Modal popup
    public promptTitle: string;
    public promptContent: string;
    public showPromptHeader: boolean = true;

    // set routeParams array
    public routePageParams: any = {
        'parentMode': '',
        'currentContractType': '',
        'CurrentContractTypeURLParameter': ''
    };
    public routeParams: any = {};
    public postData: any = {};

    // Load Page Data Variables
    public pageTitle: string;
    public pageId: string;
    public trInformation: boolean = false;
    public trRegulatoryAuthorityNumber: boolean;

    public mode: string;
    public setModeEnable: string;
    public URLReturn: string;
    public IsDeleteEnable: boolean = false;

    // Subscription veriable
    public search = new URLSearchParams();
    public lookUpSubscription: Subscription;

    public controls = [
        { name: 'Postcode', readonly: true, disabled: false, required: true, type: MntConst.eTypeCode },
        { name: 'Town', readonly: true, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'State', readonly: true, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'SalesAreaCode', readonly: true, disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'SalesAreaDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ServiceBranchNumber', type: MntConst.eTypeInteger },
        { name: 'SalesBranchNumber', type: MntConst.eTypeInteger },
        { name: 'RegulatoryAuthorityNumber', type: MntConst.eTypeInteger },
        { name: 'RegulatoryAuthorityName', type: MntConst.eTypeText },
        { name: 'BranchNumber', type: MntConst.eTypeCode },
        { name: 'BranchName', type: MntConst.eTypeText }
    ];


    // inputParams for PostCodeSearchComponent Ellipsis
    public ellipsis = {
        postCodeSearch: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            showAddNew: true,
            autoOpenSearch: false,
            setFocus: false,
            parentMode: 'LookUp-Service',
            PostCode: this.formData.Postcode,
            State: this.formData.State,
            Town: this.formData.Town,
            BranchNumber: this.utils.getBranchCode(),
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            component: PostCodeSearchComponent
        },
        salesAreaCode: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-Postcode',
                'currentContractType': 'C',
                'currentContractTypeURLParameter': '<contract>',
                'showAddNew': true,
                'SalesAreaCode': '',
                'ServiceBranchNumber': ''
            },
            contentComponent: SalesAreaSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: true
        }
    };

    // input for DropDown lookup
    public dropdown = {
        servicebranch: {
            params: {
                'parentMode': 'LookUp-PostcodeServBranch'
            },
            active: {
                id: '',
                text: ''
            },
            disabled: true,
            required: true,
            isError: true
        }, // Call Business/iCABSBBranchSearch.htm as Dropdown
        salesbranch: {
            params: {
                'parentMode': 'LookUp-PostcodeSalesBranch'
            },
            active: {
                id: '',
                text: ''
            },
            disabled: true,
            required: true,
            isError: true
        }, // Call Business/iCABSBBranchSearch.htm as Dropdown
        RegulatoryAuthorityNumber: {
            params: {
                'parentMode': 'LookUp'
            },
            active: {
                id: '',
                text: ''
            },
            disabled: true,
            required: false,
            isError: true
        } // TODO: call Business/iCABSBRegulatoryAuthoritySearch.htm
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBPOSTCODEMAINTENANCE;
        this.setCurrentContractType();
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);

    }

    public getURLQueryParameters(param: any): void {
        this.pageParams.ParentMode = param['parentMode'];
    }

    public setCurrentContractType(): void {
        this.routePageParams.currentContractType =
            this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
        this.routePageParams.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.routePageParams.currentContractType);
    }

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public setTimeToMinutes(): string {
        let today = new Date(),
            h = today.getHours(),
            m = today.getMinutes(),
            s = today.getSeconds();
        let setTime = (Number(h) * 60) + Number(m);
        return setTime.toString();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getSysCharDtetails();
        this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    ngAfterViewInit(): void {
        // this.ellipsis.postCodeSearch.autoOpenSearch = true;
        this.pageParams.isSaveCancelEnable = false;
        this.PostCodeSearchEllipsis.openModal();
    }

    // Get value of vEnableRegulatoryAuthority variable form Syschar Lookup
    public getSysCharDtetails(): any {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableRegulatoryAuthority
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
            this.pageParams.vEnableRegulatoryAuthority = record[0]['Required'];
            this.pageParams.vBusinessCode = record[0]['BusinessCode'];
            this.pageParams.vSystemCharNumber = record[0]['SystemCharNumber'];
            if (this.pageParams.vEnableRegulatoryAuthority) {
                this.trRegulatoryAuthorityNumber = true;
            } else {
                this.trRegulatoryAuthorityNumber = false;
            }
        }, (error) => {
            this.errorService.emitError(error);
        }, () => {
            this.logger.log('Syschar onComplete');
        });
    }

    public window_onload(): void {

        // this.mode = 'ADD';
        // this.setModeEnable = 'ADD';
        this.routeParams = this.riExchange.getRouterParams();
        this.pageTitle = 'Postcode Maintenance';

        // Set formData readOnly
        this.riExchange.riInputElement.ReadOnly(this.uiForm, 'Town', true);
        this.riExchange.riInputElement.ReadOnly(this.uiForm, 'State', true);

        if (this.getControlValue('Postcode')) {
            // this.ellipsis.postCodeSearch.autoOpenSearch = true;
            this.PostCodeSearchEllipsis.openModal();
        }
    }


    // get Value of PostCode field from Ellipsis: Business/iCABSBPostcodeSearch.htm
    public setEllipsisReturnData(data: any): void {
        if (data.Postcode) {
            this.mode = 'UPDATE';
            this.formData.Postcode = data.Postcode;
            this.formData.State = data.State;
            this.formData.Town = data.Town;
            this.ellipsis.postCodeSearch.PostCode = this.formData.Postcode;
            this.ellipsis.postCodeSearch.State = this.formData.State;
            this.ellipsis.postCodeSearch.Town = this.formData.Town;
            this.setControlValue('Postcode', this.formData.Postcode);
            this.setControlValue('Town', this.formData.Town);
            this.setControlValue('State', this.formData.State);

            this.riExchange.riInputElement.Disable(this.uiForm, 'Town');
            this.riExchange.riInputElement.Disable(this.uiForm, 'State');

            // TODO: Inplement PostCodeSearch_onchange
            this.PostCodeSearchOnchange('');
        } else {
            this.setControlValue('Postcode', '');
        }
    }

    public getModalinfo(e: any): void {
        this.ellipsis.postCodeSearch.autoOpenSearch = false;
        this.ellipsis.postCodeSearch.parentMode = 'LookUp-Service';

        this.ellipsis.salesAreaCode.childConfigParams.SalesAreaCode = this.formData.SalesAreaCode;
        this.ellipsis.salesAreaCode.childConfigParams.ServiceBranchNumber = this.formData.ServiceBranchNumber;
    }

    public PostCodeSearchOnchange(f: string): void {
        let query = this.getURLSearchParamObject();
        if (f === 'FindUniqueRecord') {
            query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
            query.set('Function', 'FindUniqueRecord');
            query.set('Postcode', this.getControlValue('Postcode'));
            query.set('State', this.getControlValue('State'));
            query.set('Town', this.getControlValue('Town'));

            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, query)
                .subscribe(
                (data) => {
                    if (data.status === 'failure') {
                        this.errorService.emitError(data.info);
                    } else {
                        if (data.UniqueRecordFound) {
                            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'Postcode') && (this.setModeEnable !== 'ADD')) {
                                // this.ellipsis.postCodeSearch.autoOpenSearch = true;
                                this.PostCodeSearchEllipsis.openModal();
                                this.ellipsis.postCodeSearch.PostCode = this.getControlValue('Postcode');
                                this.ellipsis.postCodeSearch.BranchNumber = this.utils.getBranchCode();
                                this.ellipsis.postCodeSearch.parentMode = 'LookUp-Service';
                            } else {
                                this.ellipsis.postCodeSearch.autoOpenSearch = false;
                            }
                        } else if (data.ErrorMessageDesc) {
                            this.messageTitle = data.ErrorMessageDesc;
                            this.messageModal.show();
                        }
                    }
                },
                (error) => {
                    this.errorService.emitError('Record not found');
                }
                );
        } else {
            query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);

            query.set('Postcode', this.getControlValue('Postcode'));
            query.set('State', this.getControlValue('State'));
            query.set('Town', this.getControlValue('Town'));

            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, query)
                .subscribe(
                (data) => {
                    if (data.status === 'failure') {
                        this.errorService.emitError(data.status);
                    } else {
                        if (data.Postcode) {
                            if (data.ServiceBranchNumber) {
                                this.formData.ServiceBranchNumber = data.ServiceBranchNumber;
                                this.ellipsis.salesAreaCode.childConfigParams.ServiceBranchNumber = this.formData.ServiceBranchNumber;
                            }
                            if (data.SalesAreaCode) {
                                this.formData.SalesAreaCode = data.SalesAreaCode;
                                this.ellipsis.salesAreaCode.childConfigParams.SalesAreaCode = this.formData.SalesAreaCode;
                            }
                            if (data.SalesBranchNumber) {
                                this.formData.SalesBranchNumber = data.SalesBranchNumber;
                            }
                            if (data.RegulatoryAuthorityNumber) {
                                this.formData.RegulatoryAuthorityNumber = data.RegulatoryAuthorityNumber;
                            } else {
                                this.formData.RegulatoryAuthorityNumber = '';
                            }
                            this.callLookupData();
                        } else if (data.ErrorMessageDesc) {
                            this.messageTitle = data.ErrorMessageDesc;
                            this.messageModal.show();
                        }
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                }
                );
        }

        if (this.getControlValue('Postcode')) {
            this.ellipsis.postCodeSearch.BranchNumber = this.utils.getBranchCode();
            this.ellipsis.postCodeSearch.PostCode = this.getControlValue('Postcode');
            // this.formData.Postcode = this.getControlValue('Postcode');
        }
    }

    // Get formData from LookUp API Call
    public callLookupData(): void {
        let lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'BranchNumber': this.formData.ServiceBranchNumber
                },
                'fields': ['BranchName']
            },
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'BranchNumber': this.formData.SalesBranchNumber
                },
                'fields': ['BranchName']
            },
            {
                'table': 'SalesArea',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'BranchNumber': this.formData.SalesBranchNumber,
                    'SalesAreaCode': this.formData.SalesAreaCode
                },
                'fields': ['SalesAreaDesc']
            },
            {
                'table': 'RegulatoryAuthority',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'RegulatoryAuthorityNumber': this.formData.RegulatoryAuthorityNumber
                },
                'fields': ['RegulatoryAuthorityName']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            this.formData.ServiceBranchName = data[0][0] ? data[0][0].BranchName : '';
            this.formData.SalesBranchName = data[1][0] ? data[1][0].BranchName : '';
            this.formData.SalesAreaDesc = data[2][0] ? data[2][0].SalesAreaDesc : '';
            this.formData.RegulatoryAuthorityName = data[3][0] ? data[3][0].RegulatoryAuthorityName : '';

            this.setActiveParams();
        });
    }

    public setActiveParams(): void {
        if (this.formData.ServiceBranchName) {
            this.dropdown.servicebranch.active = {
                id: this.formData.ServiceBranchNumber,
                text: this.formData.ServiceBranchNumber + ' - ' + this.formData.ServiceBranchName
            };
            this.dropdown.servicebranch.isError = false;
        }
        if (this.formData.SalesBranchName) {
            this.dropdown.salesbranch.active = {
                id: this.formData.SalesBranchNumber,
                text: this.formData.SalesBranchNumber + ' - ' + this.formData.SalesBranchName
            };
            this.dropdown.salesbranch.isError = false;
        }
        if (this.formData.RegulatoryAuthorityName) {
            this.dropdown.RegulatoryAuthorityNumber.active = {
                id: this.formData.RegulatoryAuthorityNumber,
                text: this.formData.RegulatoryAuthorityNumber + ' - ' + this.formData.RegulatoryAuthorityName
            };
            this.dropdown.RegulatoryAuthorityNumber.isError = false;
        }
        if (this.formData.SalesAreaDesc) {
            this.setControlValue('SalesAreaCode', this.formData.SalesAreaCode);
            this.setControlValue('SalesAreaDesc', this.formData.SalesAreaDesc);
        }
        this.btnUpdateOnClick();
    }

    // Check Ellipsis Return
    public SalesAreaCodeOnkeydown(obj: any, call: boolean): void {
        if (obj.SalesAreaCode) {
            if (obj.SalesAreaCode) {
                this.setControlValue('SalesAreaCode', obj.SalesAreaCode);
            }
            if (obj.SalesAreaDesc) {
                this.setControlValue('SalesAreaDesc', obj.SalesAreaDesc);
            }
        } else {
            this.setControlValue('SalesAreaCode', '');
            this.setControlValue('SalesAreaDesc', '');
        }
    }

    // servicebranch_onchange()
    public servicebranchOnchange(obj: any): void {
        if (obj) {
            if (obj.BranchNumber) {
                this.formData.ServiceBranchNumber = obj.BranchNumber;
            }
            if (obj.BranchName) {
                this.formData.ServiceBranchName = obj.BranchName;
            }
            this.dropdown.servicebranch.isError = false;
            this.ellipsis.salesAreaCode.childConfigParams.ServiceBranchNumber = this.formData.ServiceBranchNumber;

            // Set Sales area code & desc - Blank
            this.setControlValue('SalesAreaCode', '');
            this.setControlValue('SalesAreaDesc', '');
        }
    }

    // salesbranch_onchange()
    public salesbranchOnchange(obj: any): void {
        if (obj) {
            if (obj.BranchNumber) {
                this.formData.SalesBranchNumber = obj.BranchNumber;
            }
            if (obj.BranchName) {
                this.formData.SalesBranchName = obj.BranchName;
            }
            this.dropdown.salesbranch.isError = false;
        }
    }

    // salesbranch_onchange()
    public regulatoryAuthorityOnchange(obj: any): void {
        if (obj) {
            if (obj.RegulatoryAuthorityNumber) {
                this.formData.RegulatoryAuthorityNumber = obj.RegulatoryAuthorityNumber;
            }
            if (obj.BranchName) {
                this.formData.RegulatoryAuthorityName = obj.RegulatoryAuthorityName;
            }
            this.dropdown.salesbranch.isError = false;
        }
    }

    public SalesAreaSearchOnchange(): void {
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'SalesAreaCode')) {
            this.setControlValue('SalesAreaDesc', '');
            this.ellipsis.salesAreaCode.childConfigParams.SalesAreaCode = this.getControlValue('SalesAreaCode');
            this.ellipsis.salesAreaCode.childConfigParams.ServiceBranchNumber = this.formData.ServiceBranchNumber;
            this.ellipsis.salesAreaCode.childConfigParams.parentMode = 'LookUp-Postcode';
            // this.ellipsis.salesAreaCode.autoOpenSearch = true;
            this.premisesNumberEllipsis.openModal();
        } else {
            // this.ellipsis.salesAreaCode.autoOpenSearch = true;
            this.premisesNumberEllipsis.openModal();
        }
    }

    public cmdGenerateReportOnclick(e: any): void {
        this.SubmitReportRequest();
    }

    public SubmitReportRequest(): void {
        this.setTimeToMinutes();
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        //set parameters
        this.postData.Description = 'Postcode Detail';
        this.postData.ProgramName = 'iCABSPostcodeAssociationReport.p';
        this.postData.StartDate = this.utils.formatDate(new Date());
        this.postData.StartTime = this.setTimeToMinutes();
        this.postData.Report = 'report';
        this.postData.ParameterName = 'BusinessCode|BranchNumber|RepManDest';
        this.postData.ParameterValue = this.businessCode() + '|' + this.utils.getBranchCode() + '|' + 'batch|ReportID';

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, this.postData)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(e['errorMessage']);
                    } else {
                        this.trInformation = true;
                        this.URLReturn = e['fullError'];
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            });
    }

    /*
    Method: enableDisableFields():
    Params:
    Details: Enable or disable fields as per mode
    */
    public enableDisableFields(): void {
        if (this.setModeEnable === 'ADD') {
            this.riExchange.riInputElement.Enable(this.uiForm, 'Postcode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'Town');
            this.riExchange.riInputElement.Enable(this.uiForm, 'State');
            //this.routeAwayGlobals.setSaveEnabledFlag(true); //CR implementation
            this.ellipsis.postCodeSearch.disabled = false;
            this.riExchange.riInputElement.Enable(this.uiForm, 'SalesAreaCode');
            this.ellipsis.salesAreaCode.disabled = false;
            this.dropdown.servicebranch.disabled = false;
            this.dropdown.salesbranch.disabled = false;
            this.dropdown.RegulatoryAuthorityNumber.disabled = false;
            this.dropdown.servicebranch.active = {
                id: '',
                text: ''
            };
            this.dropdown.salesbranch.active = {
                id: '',
                text: ''
            };
            this.dropdown.RegulatoryAuthorityNumber.active = {
                id: '',
                text: ''
            };
            this.setFormMode(this.c_s_MODE_ADD);
        }
        else if (this.setModeEnable === 'UPDATE') {
            this.riExchange.riInputElement.Enable(this.uiForm, 'SalesAreaCode');
            this.ellipsis.salesAreaCode.disabled = false;
            this.dropdown.servicebranch.disabled = false;
            this.dropdown.salesbranch.disabled = false;
            this.dropdown.RegulatoryAuthorityNumber.disabled = false;
            //this.routeAwayGlobals.setSaveEnabledFlag(true); //CR implementation
            this.setFormMode(this.c_s_MODE_UPDATE);
        }
    }

    /*
    Method: disableEnabledFields():
    Params:
    Details: Enable or disable fields as per mode
    */
    public disableEnabledFields(): void {
        this.riExchange.riInputElement.Enable(this.uiForm, 'Postcode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'Town');
        this.riExchange.riInputElement.Disable(this.uiForm, 'State');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SalesAreaCode');

        this.ellipsis.salesAreaCode.disabled = true;
        this.dropdown.servicebranch.disabled = true;
        this.dropdown.salesbranch.disabled = true;
        this.dropdown.RegulatoryAuthorityNumber.disabled = true;
        this.ellipsis.postCodeSearch.disabled = false;

        if (this.setModeEnable === 'ADD') {
            this.dropdown.servicebranch.active = {
                id: '',
                text: ''
            };
            this.dropdown.salesbranch.active = {
                id: '',
                text: ''
            };
            this.dropdown.RegulatoryAuthorityNumber.active = {
                id: '',
                text: ''
            };
            this.setControlValue('SalesAreaCode', '');
            this.setControlValue('SalesAreaDesc', '');
            this.setFormMode(this.c_s_MODE_ADD);
        }

        this.PostCodeSearchOnchange('');
    }

    /*
    Method: btnAdd_onClick():
    Params:
    Details: Initializes Add
    */
    public btnAddOnClick(add: any): void {
        if (add) {
            this.mode = 'ADD';
            this.setModeEnable = 'ADD';
            this.pageParams.isSaveCancelEnable = true;
            this.IsDeleteEnable = false;
            this.uiForm.reset();

            this.formData.Postcode = '';
            this.formData.State = '';
            this.formData.Town = '';
            this.enableDisableFields();
        }
        this.riExchange.riInputElement.Enable(this.uiForm, 'save');
        this.riExchange.riInputElement.Enable(this.uiForm, 'cancel');
        this.setControlValue('save', 'Save');
        this.setControlValue('cancel', 'Cancel');
        this.setControlValue('delete', 'Delete');
    }

    /*
    Method: btnUpdate_onClick():
    Params:
    Details: Initializes Add
    */
    public btnUpdateOnClick(): void {
        if (this.getControlValue('Postcode')) {
            this.mode = 'UPDATE';
            this.setModeEnable = 'UPDATE';
            this.pageParams.isSaveCancelEnable = true;
            this.IsDeleteEnable = true;
            this.enableDisableFields();
        } else {
            // this.mode = 'NEUTRAL';
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'Postcode', true);
        }
        this.riExchange.riInputElement.Enable(this.uiForm, 'save');
        this.riExchange.riInputElement.Enable(this.uiForm, 'cancel');
        this.riExchange.riInputElement.Enable(this.uiForm, 'delete');
    }

    /*
    Method: btnDelete_onClick():
    Params:
    Details: Initializes Add
    */
    public btnDeleteOnClick(): void {
        this.mode = 'DELETE';
        this.setModeEnable = 'DELETE';
        this.pageParams.isSaveCancelEnable = true;
        this.promptTitle = 'Delete Record?';
        this.promptModal.show();
    }

    /*
   Method: onSubmit():
   Params:
   Details: Add or Updates record
   */
    public onSubmit(): void {
        let Postcode_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'Postcode');
        let SalesAreaCode_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'SalesAreaCode');

        let servicebranch_hasError = this.dropdown.servicebranch.isError;
        let salesbranch_hasError = this.dropdown.salesbranch.isError;
        let RegulatoryAuthorityNumber_hasError = this.dropdown.RegulatoryAuthorityNumber.isError;

        if (servicebranch_hasError) {
            this.dropdown.servicebranch.required = true;
        }
        if (salesbranch_hasError) {
            this.dropdown.salesbranch.required = true;
        }
        // TODO: Page is out of scope
        // if (RegulatoryAuthorityNumber_hasError) {
        //     this.dropdown.RegulatoryAuthorityNumber.required = true;
        // }

        if (!Postcode_hasError && !SalesAreaCode_hasError && !servicebranch_hasError) { // TODO : add condition - && !RegulatoryAuthorityNumber_hasError
            this.promptTitle = 'Confirm Record?';
            this.promptModal.show();
        }
    }

    /*
    Method: onAbandon():
    Params:
    Details: Cancels your current action
    */
    public onAbandon(): void {
        if (this.mode === 'ADD') {
            this.ellipsis.postCodeSearch.PostCode = '';
            this.ellipsis.postCodeSearch.State = '';
            this.ellipsis.postCodeSearch.Town = '';
            this.PostCodeSearchEllipsis.openModal();
        } else {
            this.setControlValue('Postcode', this.formData.Postcode);
            this.setControlValue('State', this.formData.State);
            this.setControlValue('Town', this.formData.Town);
            this.disableEnabledFields();
        }
        if (this.setModeEnable === 'DELETE') {
            this.ellipsis.postCodeSearch.PostCode = '';
            this.ellipsis.postCodeSearch.State = '';
            this.ellipsis.postCodeSearch.Town = '';
            this.PostCodeSearchEllipsis.openModal();
        }
        this.pageParams.isSaveCancelEnable = false;
        this.setFormMode(this.c_s_MODE_SELECT);
        this.riExchange.riInputElement.Disable(this.uiForm, 'save');
        this.riExchange.riInputElement.Disable(this.uiForm, 'cancel');
        this.riExchange.riInputElement.Disable(this.uiForm, 'delete');
    }

    /*
    Method: promptSave():
    Params:
    Details: Called if prompt gets Yes
    */
    public promptSave(event: any): void {
        let query = this.getURLSearchParamObject();
        if (this.setModeEnable === 'ADD') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionInsert);
        }
        if (this.setModeEnable === 'UPDATE') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
            this.postData.PostcodeROWID = this.getControlValue('Postcode');
        }
        if (this.setModeEnable === 'DELETE') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionDelete);
            this.postData = {};
            this.postData.PostcodeROWID = this.getControlValue('Postcode');
        }
        //set parameters
        this.postData.Postcode = this.getControlValue('Postcode');
        this.postData.Town = this.getControlValue('Town');
        this.postData.State = this.getControlValue('State');

        if (this.setModeEnable === 'ADD' || this.setModeEnable === 'UPDATE') {
            this.postData.ServiceBranchNumber = this.formData.ServiceBranchNumber;
            this.postData.SalesBranchNumber = this.formData.ServiceBranchNumber;
            this.postData.SalesAreaCode = this.getControlValue('SalesAreaCode');
            if (this.formData.RegulatoryAuthorityNumber) {
                this.postData.RegulatoryAuthorityNumber = this.formData.RegulatoryAuthorityNumber;
            }
        }
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, this.postData)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if (e.errorMessage) {
                        this.messageContent = e.errorMessage;
                        this.messageModal.show();
                    } else {
                        if (this.setModeEnable === 'ADD' || this.setModeEnable === 'UPDATE') {
                            this.formData.Postcode = this.getControlValue('Postcode');
                            this.formData.State = this.getControlValue('State');
                            this.formData.Town = this.getControlValue('Town');
                            this.messageContent = 'Data Saved Successfully';
                            this.setModeEnable = '';
                            this.mode = 'UPDATE';
                            this.pageParams.isSaveCancelEnable = false;
                        }
                        if (this.setModeEnable === 'DELETE') {
                            this.messageContent = 'Data Deleted Successfully';
                            this.formData.Postcode = '';
                            this.formData.State = '';
                            this.formData.Town = '';
                            this.dropdown.servicebranch.active = {
                                id: '',
                                text: ''
                            };
                            this.dropdown.salesbranch.active = {
                                id: '',
                                text: ''
                            };
                            this.dropdown.RegulatoryAuthorityNumber.active = {
                                id: '',
                                text: ''
                            };
                            this.setControlValue('SalesAreaCode', '');
                            this.setControlValue('SalesAreaDesc', '');
                            this.clearControls([]);
                            this.IsDeleteEnable = false;
                            this.setModeEnable = 'DELETE';
                        }
                        this.onAbandon();
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            });

    }
}
