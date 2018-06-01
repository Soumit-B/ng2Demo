
import { Component, OnInit, Injector, ViewChild, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { MessageConstant } from './../../../shared/constants/message.constant';

import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { PremiseLocationSearchComponent } from './../../internal/search/iCABSAPremiseLocationSearch.component';

@Component({
    templateUrl: 'iCABSAPremiseLocationMaintenance.html'
})
export class PremiseLocationMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('ContractSearchComponent') ContractSearchComponent;
    @ViewChild('PremiseSearchEllipsis') PremiseSearchComponent;
    @ViewChild('productSearchEllipsis') ServiceCoverSearchComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public queryParams: any = {
        operation: 'Application/iCABSAPremiseLocationMaintenance',
        module: 'locations',
        method: 'service-delivery/maintenance',
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
    public setFocusOnPremiseLocationNumber = new EventEmitter<boolean>();
    public setFocusOnPremiseLocationDesc = new EventEmitter<boolean>();

    // Subscription veriable
    public lookUpSubscription: Subscription;
    public speedscriptSubscription: Subscription;

    public controls = [
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'PremiseLocationNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseLocationDesc', type: MntConst.eTypeTextFree },
        { name: 'menu' },
        // hidden
        { name: 'ContractTypeCode', type: MntConst.eTypeCode },
        { name: 'PremiseLocationRowID', type: MntConst.eTypeText }
    ];

    // inputParams for Ellipsis
    public ellipsis = {
        contract: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ContractSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: true
        },
        premise: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Search'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: PremiseSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: true
        },
        premiseLocation: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'PremiseNumber': '',
                'PremiseName': '',
                'showAddNew': true
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: PremiseLocationSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };


    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPREMISELOCATIONMAINTENANCE;
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
        this.handleBackNavigation(this);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.routeParams = this.riExchange.getRouterParams();
        this.setCurrentContractType();
        this.setPageTitle();
        // this.mode = 'NEUTRAL';

        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.setFormMode(this.c_s_MODE_SELECT);
        } else {
            // this.routeAwayGlobals.setEllipseOpenFlag(false);
            this.window_onload();
        }
    }

    ngOnDestroy(): void {
        //this.lookUpSubscription.unsubscribe();
        super.ngOnDestroy();
        if (this.speedscriptSubscription) {
            this.speedscriptSubscription.unsubscribe();
        }
    }

    ngAfterViewInit(): void {
        // this.modalAutoOpen();
    }

    public window_onload(): void {
        this.getSysCharDtetails(); // set System Charecters - SPEED SCRIPT
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data, title: 'Error' }, false);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data, title: 'Message' }, false);
    }

    public getURLQueryParameters(param: any): void {
        if (param['Mode']) {
            this.pageParams.ParentMode = param['Mode'];
        } else {
            this.pageParams.ParentMode = this.riExchange.getParentMode();
        }
        this.pageParams.CurrentContractTypeURLParameter = param['CurrentContractTypeURLParameter'];
    }

    public setCurrentContractType(): void {
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
    }

    public setPageTitle(): void {
        let strDocTitle = this.getTranslatedValue('^1^ Premises Location Maintenance');
        let strInpTitle = this.getTranslatedValue('^1^ Number');

        this.inpTitle = strInpTitle.value.replace('^1^', this.riExchange.getCurrentContractTypeLabel());
        this.pageTitle = strDocTitle.value.replace('^1^', this.riExchange.getCurrentContractTypeLabel());
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
        this.speedscriptSubscription = this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vbEnableLocations = record[0]['Logical'];
            this.pageParams.vbHoldingLocationDesc = record[0]['Text'];
            this.pageParams.vbEnableServiceCoverDispLev = record[1]['Required'];
            this.pageParams.vbDisableCapitalFirstLtr = record[2]['Required'];
            this.setDefaultFormData();
        });
    }

    public setDefaultFormData(): void {
        this.pageParams.FunctionUpdate = true;
        this.pageParams.FunctionAdd = true;
        this.pageParams.FunctionDelete = true;
        this.pageParams.IsDeleteEnable = true;
        this.pageParams.FunctionSelect = true;

        this.formData.strHoldingLocationDesc = this.pageParams.vbHoldingLocationDesc ? this.pageParams.vbHoldingLocationDesc : '';

        if (this.pageParams.ParentMode === 'ProductAllocateAdd' || this.pageParams.ParentMode === 'NewLocationGrid') {
            this.riExchange.SetParentHTMLInputElementAttribute('PremiseLocationNumber', '');
        }

        this.disableControl('ContractNumber', true);
        this.disableControl('ContractName', true);
        this.disableControl('PremiseNumber', true);
        this.disableControl('PremiseName', true);
        this.disableControl('PremiseLocationDesc', true);

        // Not Required as it is already written above
        //this.riExchange.setParentAttributeValue('ContractNumber', this.riExchange.getParentHTMLValue('PremiseLocationNumber'));
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber') || '');
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName') || '');
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber') || '');
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName') || '');
        this.setControlValue('ContractTypeCode', this.pageParams.currentContractType || '');
        this.setControlValue('menu', 'Options');

        this.setControlValue('PremiseLocationNumber', this.riExchange.getParentHTMLValue('PremiseLocationNumber') || '');
        this.setControlValue('PremiseLocationDesc', this.riExchange.getParentHTMLValue('PremiseLocationDesc') || '');

        this.formData.ParentRowID = this.riExchange.getParentHTMLValue('ParentRowID');

        if (this.pageParams.ParentMode === 'NewLocationGrid') {
            this.setControlValue('ContractNumber', this.riExchange.getParentAttributeValue('ContractNumber') || '');
            this.setControlValue('ContractName', this.riExchange.getParentAttributeValue('ContractName') || '');
            this.setControlValue('PremiseNumber', this.riExchange.getParentAttributeValue('PremiseNumber') || '');
            this.setControlValue('PremiseName', this.riExchange.getParentAttributeValue('PremiseName') || '');
        }

        this.ellipsis.premiseLocation.childConfigParams.ContractNumber = this.getControlValue('ContractNumber') || '';
        this.ellipsis.premiseLocation.childConfigParams.ContractName = this.getControlValue('ContractName') || '';
        this.ellipsis.premiseLocation.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber') || '';
        this.ellipsis.premiseLocation.childConfigParams.PremiseName = this.getControlValue('PremiseName') || '';

        switch (this.pageParams.ParentMode) {
            case 'Premise':
            case 'Search':
            case 'SearchAdd':
            case 'PremiseAllocateAdd':
            case 'ProductAllocateAdd':
                this.formData.FunctionSearch = false;
                break;
            case 'EmptySearch':
                this.pageParams.FunctionSelect = false;
                this.pageParams.FunctionAdd = false;
                break;
            default:
                this.pageParams.FunctionSnapShot = false;
        }

        if (this.pageParams.ParentMode === 'EmptySearch') {
            this.setControlValue('PremiseLocationRowID', this.riExchange.getParentAttributeValue('premiseLocationRowID'));
        }

        this.callLookupData();

        if (this.pageParams.ParentMode === 'EmptySearch') {
            this.FetchRecord();
        }

        switch (this.pageParams.ParentMode) {
            case 'SearchAdd':
            case 'PremiseAllocateAdd':
            case 'ProductAllocateAdd':
            case 'Premise':
            case 'NewLocationGrid':
                this.AddMode();
                break;
        }

        if (this.formData.strHoldingLocationDesc
            && this.riExchange.getParentHTMLValue('PremiseLocationDesc')
            && this.formData.strHoldingLocationDesc === this.riExchange.getParentHTMLValue('PremiseLocationDesc')) {
            this.pageParams.FunctionUpdate = false;
            this.disableFields();
        }

        if (this.pageParams.vbEnableServiceCoverDispLev) {
            if (parseInt(this.riExchange.getParentAttributeValue('QuantityAtLocation'), 10) > 0) {
                this.pageParams.FunctionDelete = false;
                this.pageParams.IsDeleteEnable = false;
            }
        }

        this.modalAutoOpen();

    }

    public AddMode(): void {
        this.mode = 'ADD';
        this.setControlValue('PremiseLocationNumber', '');
        this.setControlValue('PremiseLocationDesc', '');
        this.pageParams.IsDeleteEnable = false;
        this.btnAddOnClick();
        this.riMaintenance_BeforeAddMode();
    }

    public FetchRecord(): void {
        // TODO
        this.mode = 'UPDATE';
        this.premiseLocationOnChange();
    }

    // Get formData from LookUp API Call
    public callLookupData(): void {
        let lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName']
            },
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
                this.formData.ContractName = data[0][0].ContractName;
                this.setControlValue('ContractName', this.formData.ContractName);
            }
            if (data[1][0]) {
                this.formData.PremiseName = data[1][0].PremiseName;
                this.setControlValue('PremiseName', this.formData.PremiseName);
            }
        });

        //this.rowSelected();
    }

    public rowSelected(): void {
        let returnData = this.formData.returnData;
        this.pageParams.IsDeleteEnable = true;
        if (returnData) {
            this.mode = 'UPDATE';
            this.formData.ParentRowID = returnData.ttPremiseLocation ? returnData.ttPremiseLocation : '';
            this.setControlValue('PremiseLocationRowID', this.formData.ParentRowID ? this.formData.ParentRowID : this.riExchange.getParentAttributeValue('ContractNumberPremiseLocationRowID'));
            this.formData.PremiseLocationNumber = returnData.PremiseLocationNumber ? returnData.PremiseLocationNumber : this.riExchange.getParentHTMLValue('PremiseLocationNumber');
            this.setControlValue('PremiseLocationNumber', this.formData.PremiseLocationNumber);
            this.enableFields();
            this.premiseLocationOnChange();
        }
    }

    public premiseLocationOnKeyDown(obj: any, call: boolean): void {
        if (call) {
            this.setControlValue('PremiseLocationNumber', obj.PremiseLocationNumber || '');
            this.setControlValue('PremiseLocationDesc', obj.PremiseLocationDesc || '');
            this.btnUpdateOnClick();
        }
    }

    public getModalinfo(e: any): void {
        this.ellipsis.premiseLocation.autoOpen = false;
    }

    public premiseLocationOnChange(): void {
        let lookupIPPremiseLocation = [
            {
                'table': 'PremiseLocation',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'PremiseLocationNumber': this.getControlValue('PremiseLocationNumber')
                },
                'fields': ['PremiseLocationDesc']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIPPremiseLocation).subscribe((data) => {
            if (data[0][0]) {
                this.formData.PremiseLocationDesc = data[0][0].PremiseLocationDesc;
                this.setControlValue('PremiseLocationDesc', this.formData.PremiseLocationDesc ? this.formData.PremiseLocationDesc : '');
                if (this.pageParams.FunctionUpdate)
                    this.btnUpdateOnClick();
            } else {
                this.setControlValue('PremiseLocationDesc', '');
                // this.showErrorModal(MessageConstant.Message.noRecordFound);
            }
        });
    }

    public riMaintenance_BeforeAddMode(): void {
        if (this.pageParams.ParentMode === 'NewLocationGrid') {
            this.setControlValue('PremiseLocationDesc', this.getAttribute('PremiseLocationDesc') || this.riExchange.getParentHTMLValue('PremiseLocationDesc'));
        }
    }

    public beforeSave(): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionUpdate);
        //set parameters
        this.postData.Function = 'CheckContractType';
        this.postData.ContractNumber = this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '';
        this.postData.ContractTypeCode = this.getControlValue('ContractTypeCode') ? this.getControlValue('ContractTypeCode') : '';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, this.postData)
            .subscribe(
            (data) => {
                if (data.status === 'failure') {
                    this.showErrorModal(data['oResponse']);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                } else {
                    if (data.errorMessage) {
                        this.showErrorModal(data.errorMessage);
                    } else {
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseLocationNumber', false);
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseLocationDesc', false);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
            },
            (error) => {
                this.showErrorModal(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public afterEvent(): void {
        if (this.pageParams.ParentMode === 'ProductAllocateAdd'
            && this.mode === 'ADD') {
            this.riExchange.SetParentHTMLInputElementAttribute('PremiseLocationNumber', this.getControlValue('PremiseLocationNumber'));
            this.riExchange.SetParentHTMLInputElementAttribute('PremiseLocationDesc', this.getControlValue('PremiseLocationDesc'));
        }
        if (this.pageParams.ParentMode === 'EmptySearch'
            && this.mode === 'DELETE') {
            this.showMessageHeader = false;
        }
    }

    public btnAddOnClick(): void {
        this.mode = 'ADD';
        this.setFormMode(this.c_s_MODE_ADD);
        this.setFocusOnPremiseLocationDesc.emit(false);
        this.pageParams.IsDeleteEnable = false;
        // this.setDefaultFormData();
        this.emptyPremiseLocationFields();
        this.disableFields();
        this.disableControl('PremiseLocationDesc', false);
        this.modalAutoClose();
    }

    public btnUpdateOnClick(): void {
        this.mode = 'UPDATE';
        this.setFormMode(this.c_s_MODE_UPDATE);
        this.setFocusOnPremiseLocationDesc.emit(false);
        this.enableFields();
        if (this.riExchange.getParentAttributeValue('premiseLocationRowID')) {
            this.ellipsis.premiseLocation.childConfigParams.showAddNew = false;
            this.ellipsis.premiseLocation.disabled = true;
        }
        this.disableControl('PremiseLocationNumber', true);
        this.pageParams.IsDeleteEnable = true;
        this.modalAutoClose();
    }

    public btnDeleteOnClick(): void {
        this.mode = 'DELETE';
        this.disableControl('PremiseLocationNumber', true);
        this.modalAutoClose();
        this.onSubmit();
    }

    public emptyPremiseLocationFields(): void {
        this.setControlValue('PremiseLocationNumber', '');
        this.setControlValue('PremiseLocationDesc', '');
        this.disableControl('PremiseLocationNumber', false);
        this.disableControl('PremiseLocationDesc', true);
        this.pageParams.IsDeleteEnable = false;
        this.ellipsis.premiseLocation.disabled = false;
        // this.location.back();
    }

    public disableFields(): void {
        this.disableControl('PremiseLocationNumber', true);
        this.disableControl('PremiseLocationDesc', true);
        this.ellipsis.premiseLocation.disabled = true;
    }

    public enableFields(): void {
        this.disableControl('PremiseLocationNumber', false);
        this.disableControl('PremiseLocationDesc', false);
        this.ellipsis.premiseLocation.disabled = false;
    }

    public modalAutoOpen(): void {
        if (this.mode !== 'ADD' && this.mode !== 'UPDATE' && this.mode !== 'DELETE') {
            this.ellipsis.premiseLocation.autoOpen = true;
            this.pageParams.isModalAutoOpen = true;
        }
    }

    public modalAutoClose(): void {
        this.ellipsis.premiseLocation.autoOpen = false;
        this.pageParams.isModalAutoOpen = false;
    }

    /*
   Method: onAbandon():
   Params:
   Details: Cancels your current action
   */
    public onAbandon(): void {
        // this.uiForm.reset();
        this.setFocusOnPremiseLocationNumber.emit(false);
        // this.location.back();
        this.enableFields();
        this.disableControl('PremiseLocationDesc', true);
        if (this.mode === 'ADD' || this.mode === 'DELETE') {
            this.emptyPremiseLocationFields();
            this.ellipsis.premiseLocation.disabled = false;
            this.mode = 'NEUTRAL';
            this.modalAutoOpen();
        } else {
            this.premiseLocationOnChange();
        }
        this.setFormMode(this.c_s_MODE_SELECT);
        this.formPristine();
    }

    /*
    Method: onSubmit():
    Params:
    Details: Add or Updates record
    */
    public onSubmit(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseLocationNumber', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseLocationDesc', true);

        let isValidForm: boolean = this.riExchange.validateForm(this.uiForm);
        if (isValidForm) {
            this.promptTitle = MessageConstant.Message.ConfirmRecord;
            this.promptModal.show();
        }
    }

    /*
   Method: promptCancel():
   Params:
   Details: Called if prompt gets Cancel
   */
    public promptCancel(event: any): void {
        if (this.mode === 'DELETE') {
            this.mode = 'NEUTRAL';
        }
        if (this.mode === 'ADD') {
            this.mode = 'ADD';
        }
        if (this.mode === 'UPDATE') {
            this.mode = 'NEUTRAL';
        }
    }
    /*
    Method: promptSave():
    Params:
    Details: Called if prompt gets Yes
    */
    public promptSave(event: any): void {
        this.beforeSave();
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        this.saveDataAdd = [];
        if (this.mode === 'ADD') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionInsert);
        }
        if (this.mode === 'UPDATE') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
            this.saveDataAdd.VisitToleranceROWID = this.formData.VisitToleranceRowID ? this.formData.VisitToleranceRowID : this.getControlValue('ServiceCoverRowID');
        }
        if (this.mode === 'DELETE') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionDelete);
        }
        if (this.mode === 'ADD' || this.mode === 'UPDATE') {
            //set parameters
            this.saveDataAdd.Function = 'CheckContractType';
            this.saveDataAdd.ContractTypeCode = this.getControlValue('ContractTypeCode') ? this.getControlValue('ContractTypeCode') : '';
            this.saveDataAdd.ContractNumber = this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '';
            this.saveDataAdd.PremiseNumber = this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '';
            this.saveDataAdd.PremiseLocationNumber = this.getControlValue('PremiseLocationNumber') ? this.getControlValue('PremiseLocationNumber') : '';
            this.saveDataAdd.PremiseLocationDesc = this.getControlValue('PremiseLocationDesc') ? this.getControlValue('PremiseLocationDesc') : '';

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, query, this.saveDataAdd)
                .subscribe(
                (e) => {
                    if (e['status'] === 'failure') {
                        this.showErrorModal(e['info']);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.emptyPremiseLocationFields();
                    } else {
                        if (e.errorMessage) {
                            this.showErrorModal(e.errorMessage);
                        } else {
                            this.showMessageModal(MessageConstant.Message.RecordSavedSuccessfully);
                            this.formPristine();
                            this.formData.returnData = e;
                            this.rowSelected();
                            // this.onAbandon();
                        }
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                },
                (error) => {
                    this.showErrorModal(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    // this.onAbandon();
                });
        }
        if (this.mode === 'DELETE') {
            this.saveDataDelete.ContractNumber = this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '';
            this.saveDataDelete.PremiseNumber = this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '';
            this.saveDataDelete.PremiseLocationNumber = this.getControlValue('PremiseLocationNumber') ? this.getControlValue('PremiseLocationNumber') : '';
            this.saveDataDelete.Table = 'PremiseLocation';

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, query, this.saveDataDelete)
                .subscribe(
                (e) => {
                    if (e['status'] === 'failure') {
                        this.showErrorModal(e['info']);
                    } else {
                        if (e.errorMessage) {
                            this.showErrorModal(e.errorMessage);
                        } else {
                            this.formData.returnData = null;
                            this.emptyPremiseLocationFields();
                            this.mode = 'NEUTRAL';
                            this.modalAutoOpen();
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.showErrorModal(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    /**
     * Gridoption onchange method
     */
    public menuOptionsChange(value: any): void {
        this.setControlValue('menu', value);
        switch (value) {
            case 'Purge':
                this.messageTitle = 'Warning';
                this.messageContent = 'Application/iCABSAPremiseLocationPurgeHistory.htm - Screen is not yet covered';
                this.messageModal.show();
                //TODO : window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAPremiseLocationPurgeHistory.htm"
                break;
            default:
                break;
        }
    }

}
