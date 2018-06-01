import { MntConst } from './../../../../../shared/services/riMaintenancehelper';
import { Component, OnInit, Injector, ViewChild, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { RiExchange } from '../../../../../shared/services/riExchange';
import { NgTemplateOutlet } from '@angular/common/src/directives/ng_template_outlet';
import { Subscription } from 'rxjs/Subscription';
import { PageIdentifier } from '../../../../base/PageIdentifier';
import { BaseComponent } from '../../../../base/BaseComponent';
import { MessageConstant } from './../../../../../shared/constants/message.constant';
import { ContractSearchComponent } from '../../../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../../../internal/search/iCABSAPremiseSearch';
import { InternalSearchModuleRoutes } from '../../../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSAPremiseSelectMaintenance.html'
})
export class PremiseSelectMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('ContractSearchEllipsis') ContractSearchComponent;
    @ViewChild('PremiseSearchEllipsis') PremiseSearchComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public queryParams: any = {
        operation: 'Application/iCABSAPremiseSelectMaintenance',
        module: 'premises',
        method: 'contract-management/maintenance',
        ActionSearch: '0',
        ActionUpdate: '6',
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

    // Local String Variables
    public pageId: string;
    public mode: string;
    public inpTitle: string;

    // Local Array variables
    public routeParams: any = {};
    public postData: any = {};
    public saveDataAdd: any = {};
    public saveDataDelete: any = {};

    // Local boolean variable
    public IsPremiseAnnualValueDisplay: boolean;
    public IsFormEmpty: boolean;
    public IsAddEnable: boolean = true;
    public IsUpdateEnable: boolean = true;
    public IsDeleteEnable: boolean = true;
    public IsUrlPending: boolean = false;
    public IsUrlNotPending: boolean = false;
    public setFocusOnContractNumber = new EventEmitter<boolean>();
    public setFocusOnPremiseNumber = new EventEmitter<boolean>();

    // Subscription veriable
    public lookUpSubscription: Subscription;

    public controls = [
        { name: 'ContractNumber', required: true, type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'PremiseNumber', required: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'PremiseCommenceDate', type: MntConst.eTypeDate },
        { name: 'Status', type: MntConst.eTypeText },
        { name: 'ServiceBranchNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseAnnualValue', type: MntConst.eTypeCurrency },
        { name: 'menu', type: MntConst.eTypeText },
        // hidden
        { name: 'ErrorMessageDesc', type: MntConst.eTypeText }
    ];

    // inputParams for Ellipsis
    public ellipsis = {
        contract: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'showAddNew': false,
                'currentContractType': 'C'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ContractSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        premise: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Search',
                'ContractNumber': '',
                'ContractName': '',
                'PremiseNumber': '',
                'PremiseName': '',
                'showAddNew': false,
                'currentContractType': 'C'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: PremiseSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };


    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPREMISESELECTMAINTENANCE;
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
        this.handleBackNavigation(this);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.window_onload();
    }

    ngOnDestroy(): void {
        //this.lookUpSubscription.unsubscribe();
        super.ngOnDestroy();
    }

    ngAfterViewInit(): void {
        // Set message call back
        this.setMessageCallback(this);

        // Set error message call back
        this.setErrorCallback(this);
        if (!this.formData.ContractNumber) {
            // open contract ellipsis
            this.ellipsis.contract.autoOpen = true;
            this.ellipsis.contract.childConfigParams.currentContractType = this.riExchange.getCurrentContractType();
        }
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data, title: 'Error' }, false);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data, title: 'Message' }, false);
    }

    public window_onload(): void {
        this.getSysCharDtetails(); // set System Charecters - SPEED SCRIPT
        this.routeParams = this.riExchange.getRouterParams();
        this.setCurrentContractType();
        this.setPageTitle();

        if (this.formData.ContractNumber) {
            this.populateUIFromFormData();
            this.IsFormEmpty = false;
            this.mode = 'NEUTRAL';
            this.setFormMode(this.c_s_MODE_SELECT);
        } else {
            this.setControlValue('menu', 'Options');
            this.IsFormEmpty = true;
            this.mode = 'ADD';
            this.setFormMode(this.c_s_MODE_ADD);
        }

        this.setDefaultFormData();
    }

    public getURLQueryParameters(param: any): void {
        if (param['Mode']) {
            this.pageParams.ParentMode = param['Mode'];
        } else {
            this.pageParams.ParentMode = this.riExchange.getParentMode();
        }
        this.pageParams.pending = param['fromMenu'];
        this.pageParams.CurrentContractTypeURLParameter = param['CurrentContractTypeURLParameter'];
        if (this.pageParams.pending) {
            this.IsUrlPending = true;
        } else {
            this.IsUrlNotPending = true;
        }
    }

    public setCurrentContractType(): void {
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
    }

    public setPageTitle(): void {
        this.pageTitle = 'Premises Select';
        this.utils.setTitle(this.pageTitle);
    }

    public getSysCharDtetails(): any {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableLocations, // SYSTEMCHAR_EnableLocations
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel, // SYSTEMCHAR_EnableServiceCoverDisplayLevel
            this.sysCharConstants.SystemCharDisableFirstCapitalOnAddressContact // SYSTEMCHAR_DisableFirstCapitalOnAddressContact

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
            this.pageParams.vbEnableLocations = record[0]['Logical'];
            this.pageParams.vbHoldingLocationDesc = record[0]['Text'];
            this.pageParams.vbEnableServiceCoverDispLev = record[1]['Required'];
            this.pageParams.vbDisableCapitalFirstLtr = record[2]['Required'];
        });
    }

    public setDefaultFormData(): void {
        this.disableControl('PremiseCommenceDate', true);
        this.disableControl('Status', true);
        this.disableControl('ServiceBranchNumber', true);
        this.disableControl('PremiseAnnualValue', true);
        this.disableControl('ContractName', true);
        this.disableControl('PremiseNumber', true);
        this.disableControl('PremiseName', true);

        this.setFocusOnContractNumber.emit(true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'contractNumber', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseNumber', true);

        if (this.pageParams.ParentMode === 'ContactManagement') {
            this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('contractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
            // this.onSearch();
        }
        this.callLookupData();
    }

    // Get formData from LookUp API Call
    public callLookupData(): void {
        let lookupIP = [
            {
                'table': 'UserAuthority',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'UserCode': this.utils.getUserCode()
                },
                'fields': ['AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0][0]) {
                this.formData.glAllowUserAuthView = data[0][0].AllowViewOfSensitiveInfoInd;
                this.formData.glAllowUserAuthUpdate = data[0][0].AllowUpdateOfContractInfoInd;
            }
        });
    }

    // Get formData from LookUp API Call
    public callLookupDataPremiseNumber(): void {
        let lookupIP = [
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseName']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0][0]) {
                this.formData.PremiseName = data[0][0].PremiseName;
                this.setControlValue('PremiseName', this.formData.PremiseName ? this.formData.PremiseName : '');
            } else {
                this.setControlValue('PremiseName', '');
            }
            this.onSearch();
        });
    }

    // Get formData from LookUp API Call
    public callLookupDataContractNumber(): void {
        let lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0][0]) {
                this.formData.ContractName = data[0][0].ContractName;
                this.setControlValue('ContractName', this.formData.ContractName);
                this.openPremiseSearch();
            } else {
                this.setControlValue('ContractName', '');
                this.setControlValue('PremiseNumber', '');
                this.setControlValue('PremiseName', '');
                this.disableControl('PremiseNumber', true);
                this.fetchRecord();
            }
        });
    }

    public isNumValidatorContractNumber(): void {
        if (!this.riExchange.riInputElement.isNumber(this.uiForm, 'ContractNumber')) {
            this.setControlValue('ContractNumber', '');
        } else {
            this.setControlValue('ContractNumber', this.utils.numberPadding(this.getControlValue('ContractNumber'), 8));
        }

        this.callLookupDataContractNumber();
    }

    public contractOnKeyDown(obj: any, call: boolean): void {
        if (call) {
            if (obj.ContractNumber) {
                this.setControlValue('ContractNumber', obj.ContractNumber);
            }
            if (obj.ContractName) {
                this.setControlValue('ContractName', obj.ContractName);
            }
            this.openPremiseSearch();
        }
    }

    public premiseOnKeyDown(obj: any, call: boolean): void {
        if (call) {
            if (obj.PremiseNumber) {
                this.setControlValue('PremiseNumber', obj.PremiseNumber);
            }
            if (obj.PremiseName) {
                this.setControlValue('PremiseName', obj.PremiseName);
            }
            this.onSearch();
        }
    }

    public getModalinfo(e: any): void {
        this.ellipsis.contract.autoOpen = false;
        this.ellipsis.premise.autoOpen = false;
    }

    public openPremiseSearch(): void {
        this.setFocusOnPremiseNumber.emit(true);
        this.ellipsis.premise.autoOpen = true;
        this.disableControl('PremiseNumber', false);
        this.ellipsis.premise.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premise.childConfigParams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.premise.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.ellipsis.premise.childConfigParams.PremiseName = this.getControlValue('PremiseName');

        this.ellipsis.premise.childConfigParams.currentContractType = this.riExchange.getCurrentContractType();
    }

    /*
    Method: riMaintenance.FetchRecord()
    Params: ContractNumber, PremiseNumber, ActionSearch
    Details: fetch form fields
    */
    public fetchRecord(): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        //set parameters
        query.set('ContractNumber', this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '');
        query.set('PremiseNumber', this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query)
            .subscribe(
            (data) => {
                if (data.status === 'failure') {
                    this.errorService.emitError(data.info['error']);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                } else {
                    if (data.errorMessage) {
                        this.showErrorModal(data.errorMessage);
                        this.IsFormEmpty = true;
                    } else {
                        this.IsFormEmpty = false;
                    }
                    this.afterFetchEvent(data);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    /*
    Method: riMaintenance_AfterFetch
    Params: ContractNumber, PremiseNumber, ActionSearch
    Details: fetch form fields
    */
    public afterFetchEvent(data: any): void {
        if (data.ErrorMessageDesc) {
            this.showErrorModal(data.ErrorMessageDesc);
        }

        if (this.formData.glAllowUserAuthView) {
            this.IsPremiseAnnualValueDisplay = true;
        } else {
            this.IsPremiseAnnualValueDisplay = false;
        }

        this.setControlValue('PremiseCommenceDate', data.PremiseCommenceDate ? data.PremiseCommenceDate : '');
        this.setControlValue('Status', data.Status ? data.Status : '');
        this.setControlValue('ServiceBranchNumber', data.ServiceBranchNumber ? data.ServiceBranchNumber : '');
        this.setControlValue('PremiseAnnualValue', data.PremiseAnnualValue ? this.utils.cCur(data.PremiseAnnualValue) : '');

        this.mode = 'NEUTRAL';
        this.setFormMode(this.c_s_MODE_SELECT);
    }

    /*
    Method: onSubmit():
    Params:
    Details: Add or Updates record
    */
    public onSearch(): void {
        let isValidForm: boolean = this.riExchange.validateForm(this.uiForm);
        if (isValidForm) {
            this.fetchRecord();
        }
    }

    /**
     * Gridoption onchange method
     */
    public menuOptionsChange(event: any): void {
        switch (event) {
            case 'Premise':
                if (!this.IsFormEmpty) {
                    this.navigate('Request', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE);
                } else {
                    this.showErrorModal(MessageConstant.Message.noRecordSelected);
                }
                break;
            case 'Request':
                if (this.IsUrlPending) {
                    if (!this.IsFormEmpty) {
                        this.navigate('Premise', InternalSearchModuleRoutes.ICABSALOSTBUSINESSREQUESTSEARCH);
                        if (this.pageParams.ParentMode === 'ContactManagement') {
                            this.riExchange.setRouterParams('<Premise>&<ContactManagement>');
                        } else {
                            this.riExchange.setRouterParams('<Premise>');
                        }
                    } else {
                        this.showErrorModal(MessageConstant.Message.noRecordSelected);
                    }
                }
                break;
            default:

                break;
        }
    }

    /*
    *  Alerts user when user is moving away without saving the changes. //CR implementation
    */
    /*public routeAwayUpdateSaveFlag(): void {
        this.uiForm.statusChanges.subscribe((value: any) => {
            if (this.uiForm.dirty === true) {
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            } else {
                this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    }*/

}
