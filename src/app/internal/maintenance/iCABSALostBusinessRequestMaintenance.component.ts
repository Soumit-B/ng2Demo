import { Component, OnInit, Injector, ViewChild, OnDestroy, Renderer } from '@angular/core';

import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { InternalSearchModuleRoutes } from './../../base/PageRoutes';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { CustomDatepickerComponent } from '../../../shared/components/custom-datepicker/custom-datepicker';
import { DropdownStaticComponent } from '../../../shared/components/dropdown-static/dropdownstatic';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { LostBusinessRequestOriginLanguageSearchComponent } from './../../internal/search/iCABSSLostBusinessRequestOriginLanguageSearch.component';

@Component({
    templateUrl: 'iCABSALostBusinessRequestMaintenance.html'
})

export class LostBusinessRequestMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('ClientContact') clientContact;
    @ViewChild('RequestDate') requestDate: CustomDatepickerComponent;
    @ViewChild('menu') menu: DropdownStaticComponent;
    @ViewChild('RequestOrigin') requestOrigin: LostBusinessRequestOriginLanguageSearchComponent;

    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'PortfolioStatus', type: MntConst.eTypeText },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc', type: MntConst.eTypeText },
        { name: 'LostBusinessRequestNumber', type: MntConst.eTypeAutoNumber },
        { name: 'InvoiceFrequencyCode', type: MntConst.eTypeText },
        { name: 'InvoiceAnnivDate', type: MntConst.eTypeDate },
        { name: 'RequestDate', type: MntConst.eTypeDate },
        { name: 'RequestStatus', type: MntConst.eTypeText },
        { name: 'EarliestEffectDate', type: MntConst.eTypeDate },
        { name: 'ClientContact', type: MntConst.eTypeText },
        { name: 'ClientContactTelephoneNumber', type: MntConst.eTypeText },
        { name: 'ClientContactPosition', type: MntConst.eTypeText },
        { name: 'EmployeeCode', type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', type: MntConst.eTypeText },
        { name: 'CreateProspectInd' },
        { name: 'LostBusinessRequestNarrative', type: MntConst.eTypeTextFree },
        { name: 'RequestOriginCode', type: MntConst.eTypeCode },
        { name: 'BranchNumber', type: MntConst.eTypeInteger },
        // Hidden Field
        { name: 'CustomerContactNumber' },
        { name: 'ContactTypeCode' },
        { name: 'ContactTypeDetailCode' },
        { name: 'ContactTypeDetailCreateProspect' },
        { name: 'ServiceCoverRowID' },
        { name: 'LostBusinessRequestROWID' },
        { name: 'CallLogID' },
        { name: 'NationalAccount', value: '' }
    ];
    public menuList: Array<any> = [
        { text: 'Options', value: '' },
        { text: 'Contact', value: 'Contact' },
        { text: 'Customer Contacts', value: 'CustomerContacts' }
    ];
    public glSCAutoCreateProspect: boolean = false;
    public vSCEnableMonthsNotice: boolean = false;
    public isTrContactTypeDetailCodeSelect: boolean = false;
    public isTrPremise: boolean = false;
    public isTrServiceCover: boolean = false;
    public isTrCreateProspect: boolean = false;
    public isAddMode: boolean = false;
    public contactTypeDetailFirstElement: string = '';
    public contactTypeDetailList: Array<any> = [];
    public islForceEffectDate: boolean = false;
    public inputParamsBranch: any = {};
    public inputParamsOrigin: any = {
        params: {}
    };
    public branchNumberSelected: any = {
        id: '',
        text: ''
    };
    public originCodeSelected: any = {
        id: '',
        text: ''
    };

    // URL Query Parameters
    public queryParams: any = {
        operation: 'Application/iCABSALostBusinessRequestMaintenance',
        module: 'retention',
        method: 'ccm/maintenance'
    };

    // Ellipsis configuration parameters
    public ellipsisParams: any = {
        employee: {
            isShowCloseButton: true,
            isShowHeader: true,
            isDisabled: false,
            childConfigParams: {
                parentMode: 'LookUp'
            },
            contentComponent: EmployeeSearchComponent
        },
        common: {
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            }
        }
    };

    constructor(injector: Injector, private renderer: Renderer) {
        super(injector);
        this.pageId = PageIdentifier.ICABSALOSTBUSINESSREQUESTMAINTENANCE;

        this.browserTitle = this.pageTitle = 'Client Retention Request Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnLoad();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // Initializes data into different controls on page load
    public windowOnLoad(): void {
        if (this.parentMode === 'Search' || this.parentMode === 'SearchAdd' || this.parentMode === 'ContactManagement') {
            this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));

            if (this.riExchange.URLParameterContains('Premise') || this.riExchange.URLParameterContains('ServiceCover')) {
                this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));

                if (this.riExchange.URLParameterContains('ServiceCover')) {
                    this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                    this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));

                    this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverROWID'));
                }
            }
            this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverROWID'));

            if (this.riExchange.URLParameterContains('ContactManagement') || this.parentMode === 'ContactManagement') {
                this.setControlValue('CustomerContactNumber', this.riExchange.getParentHTMLValue('CustomerContactNumber'));
            }

            this.setControlValue('LostBusinessRequestNumber', this.riExchange.getParentHTMLValue('LostBusinessRequestNumber'));
        }

        if (this.parentMode === 'SearchAdd') {
            this.isTrContactTypeDetailCodeSelect = true;

            if (!this.getControlValue('PremiseNumber')) {
                this.isTrPremise = false;
                this.isTrServiceCover = false;
            } else if (!this.getControlValue('ProductCode')) {
                this.isTrPremise = true;
                this.isTrServiceCover = false;
            } else {
                this.isTrPremise = true;
                this.isTrServiceCover = true;
            }
        }

        this.getInitialSettings();

        // When Running From CallCentre Then Default As Much Detail As Possible
        if (this.riExchange.URLParameterContains('callcentre')) {
            this.setControlValue('RequestDate', new Date());
            this.setControlValue('CallLogID', this.riExchange.getParentHTMLValue('CCCallLogID'));
            this.setControlValue('ContactTypeCode', this.riExchange.getParentHTMLValue('CCContactTypeCode'));
            this.setControlValue('ContactTypeDetailCode', this.riExchange.getParentHTMLValue('CCContactTypeDetailCode'));
            this.setControlValue('ClientContact', this.riExchange.getParentHTMLValue('CCClientContact'));
            this.setControlValue('ClientContactTelephoneNumber', this.riExchange.getParentHTMLValue('CCClientContactTelephoneNumber'));
            this.setControlValue('ClientContactPosition', this.riExchange.getParentHTMLValue('CCClientContactPosition'));
            this.setControlValue('RequestOriginCode', this.riExchange.getParentHTMLValue('CCRequestOriginCode'));
            this.setControlValue('LostBusinessRequestNarrative', this.riExchange.getParentHTMLValue('CCLostBusinessRequestNarrative'));
            this.islForceEffectDate = true;
            this.getEarliestEffectDate();
            this.selectOriginIntoCombo();
        }
    }

    // Fetch business system char details
    public getSysCharDetails(): any {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharAutoGenerateProspectFromClientRetention,
            this.sysCharConstants.SystemCharMonthsFromCommenceToEFKTerm
        ];
        let sysCharIP = {
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.glSCAutoCreateProspect = record[0]['Required'];
            this.vSCEnableMonthsNotice = record[1]['Logical'];

            switch (this.parentMode) {
                case 'ContactManagement':
                    this.getRequestNumber();
                    break;
                case 'SearchAdd':
                    this.isAddMode = true;
                    this.beforeAddMode();
                    break;
                default:
                    this.fetchInitialRecord();
            }

            this.setPageControlStatus();
        });
    }

    // Fetch & populate page specific lookup data
    public getLookupData(): void {
        let lookupIP_details = [];
        let contractIndex = -1;
        let premiseIndex = -1;
        let productIndex = -1;
        let employeeIndex = -1;
        let businessCode = this.businessCode();

        contractIndex = lookupIP_details.length;
        lookupIP_details.push({
            'table': 'Contract',
            'query': {
                'ContractNumber': this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '',
                'BusinessCode': businessCode
            },
            'fields': ['ContractName', 'InvoiceFrequencyCode', 'InvoiceAnnivDate']
        });

        if (this.riExchange.URLParameterContains('Premise') ||
            this.riExchange.URLParameterContains('ServiceCover') ||
            this.parentMode === 'Search' ||
            this.parentMode === 'ContactManagement') {
            premiseIndex = lookupIP_details.length;
            lookupIP_details.push({
                'table': 'Premise',
                'query': {
                    'ContractNumber': this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '',
                    'PremiseNumber': this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '',
                    'BusinessCode': businessCode
                },
                'fields': ['PremiseName']
            });
        }

        if (this.riExchange.URLParameterContains('ServiceCover') ||
            this.parentMode === 'Search' ||
            this.parentMode === 'ContactManagement') {
            productIndex = lookupIP_details.length;
            lookupIP_details.push({
                'table': 'Product',
                'query': {
                    'ProductCode': this.getControlValue('ProductCode') ? this.getControlValue('ProductCode') : '',
                    'BusinessCode': businessCode
                },
                'fields': ['ProductDesc']
            });
        }

        employeeIndex = lookupIP_details.length;
        lookupIP_details.push({
            'table': 'Employee',
            'query': {
                'EmployeeCode': this.getControlValue('EmployeeCode') ? this.getControlValue('EmployeeCode') : '',
                'BusinessCode': businessCode
            },
            'fields': ['EmployeeSurname']
        });

        this.LookUp.lookUpRecord(lookupIP_details).subscribe((data) => {
            if (contractIndex !== -1) {
                let contractDetail = data[contractIndex][0];

                if (contractDetail) {
                    if (contractDetail.ContractName) {
                        this.setControlValue('ContractName', contractDetail.ContractName);
                    }
                    if (contractDetail.InvoiceFrequencyCode) {
                        this.setControlValue('InvoiceFrequencyCode', contractDetail.InvoiceFrequencyCode);
                    }
                    if (contractDetail.InvoiceAnnivDate) {
                        this.setControlValue('InvoiceAnnivDate', contractDetail.InvoiceAnnivDate);
                    }
                }
            }

            if (premiseIndex !== -1) {
                let premiseDetail = data[premiseIndex][0];

                if (premiseDetail) {
                    if (premiseDetail.PremiseName) {
                        this.setControlValue('PremiseName', premiseDetail.PremiseName);
                    }
                }
            }

            if (productIndex !== -1) {
                let productDetail = data[productIndex][0];

                if (productDetail) {
                    if (productDetail.ProductDesc) {
                        this.setControlValue('ProductDesc', productDetail.ProductDesc);
                    }
                }
            }

            if (employeeIndex !== -1) {
                let employeeDetail = data[employeeIndex][0];

                if (employeeDetail) {
                    if (employeeDetail.EmployeeSurname) {
                        this.setControlValue('EmployeeSurname', employeeDetail.EmployeeSurname);
                    }
                }
            }
        });
    }

    // Fetch & populate page specific initial settings
    public getInitialSettings(): void {
        let formData: Object = {};
        let cRequestLevel: string = '';
        let search = this.getURLSearchParamObject();

        cRequestLevel = 'Contract';
        if (this.riExchange.URLParameterContains('Premise')) { cRequestLevel = 'Premise'; }
        if (this.riExchange.URLParameterContains('ServiceCover')) { cRequestLevel = 'ServiceCover'; }

        search.set(this.serviceConstants.Action, '6');

        formData['ParentMode'] = this.parentMode;
        formData['Function'] = 'GetInitialSettings';
        formData['RequestLevel'] = cRequestLevel;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('ContactTypeCode', data.ContactTypeCode);
                    this.setControlValue('ContactTypeDetailCreateProspect', data.ContactTypeDetailCreateProspect);

                    let valArray = data.ContactTypeDetailCodeList.split('\n');
                    let descArray = data.ContactTypeDetailDescList.split('\n');
                    this.contactTypeDetailList = [];

                    for (let index = 0; index < valArray.length; index++) {
                        this.contactTypeDetailList.push({ text: descArray[index], value: valArray[index] });

                        if (index === 0) { this.contactTypeDetailFirstElement = valArray[index]; }
                    }

                    this.getSysCharDetails();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Disable page controls in one place
    public disablePageControls(): void {
        this.disableControl('ContractNumber', true);
        this.disableControl('ContractName', true);
        this.disableControl('PortfolioStatus', true);
        this.disableControl('PremiseNumber', true);
        this.disableControl('PremiseName', true);
        this.disableControl('ProductCode', true);
        this.disableControl('ProductDesc', true);
        this.disableControl('LostBusinessRequestNumber', true);
        this.disableControl('InvoiceFrequencyCode', true);
        this.disableControl('InvoiceAnnivDate', true);
        this.disableControl('RequestStatus', true);
        this.disableControl('EmployeeSurname', true);
    }

    // Fetch & populate initial data in edit mode
    public fetchInitialRecord(): void {
        let search = this.getURLSearchParamObject();
        search.set('ContractNumber', this.getControlValue('ContractNumber'));
        search.set('LostBusinessRequestNumber', this.getControlValue('LostBusinessRequestNumber'));
        search.set(this.serviceConstants.Action, '0');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('LostBusinessRequestROWID', data.ttLostBusinessRequest);
                    this.setControlValue('PremiseNumber', data.PremiseNumber);
                    this.setControlValue('ProductCode', data.ProductCode);
                    this.setControlValue('RequestDate', data.RequestDate);
                    this.setControlValue('RequestOriginCode', data.RequestOriginCode);
                    this.setControlValue('ClientContact', data.ClientContact);
                    this.setControlValue('ClientContactTelephoneNumber', data.ClientContactTelephoneNumber);
                    this.setControlValue('ClientContactPosition', data.ClientContactPosition);
                    this.setControlValue('CustomerContactNumber', data.CustomerContactNumber);
                    this.setControlValue('BranchNumber', data.BranchNumber);
                    this.setControlValue('EmployeeCode', data.EmployeeCode);
                    this.setControlValue('LostBusinessRequestNarrative', data.LostBusinessRequestNarrative);
                    this.setControlValue('EarliestEffectDate', data.EarliestEffectDate);
                    this.setControlValue('CreateProspectInd', data.CreateProspectInd);
                    this.setControlValue('CallLogID', data.CallLogID);
                    this.setControlValue('ContactTypeCode', data.ContactTypeCode);
                    this.setControlValue('ContactTypeDetailCode', data.ContactTypeDetailCode);
                    this.selectBranchIntoCombo();
                    this.selectOriginIntoCombo();
                    this.getLookupData();
                    this.getStatus();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Fetch & populate record status data
    public getStatus(): void {
        let formData: Object = {};
        let search = this.getURLSearchParamObject();
        let lostBusinessRequestNumber = this.getControlValue('LostBusinessRequestNumber');
        let premiseNumber = this.getControlValue('PremiseNumber');
        let productCode = this.getControlValue('ProductCode');
        let serviceCoverRowID = this.getControlValue('ServiceCoverRowID');

        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'GetStatus';
        formData['ContractNumber'] = this.getControlValue('ContractNumber');

        if (lostBusinessRequestNumber) {
            formData['LostBusinessRequestNumber'] = lostBusinessRequestNumber;
        }

        if (premiseNumber) {
            formData['PremiseNumber'] = premiseNumber;
        }

        if (productCode && serviceCoverRowID) {
            formData['ServiceCoverRowID'] = serviceCoverRowID;
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('PortfolioStatus', data.PortfolioStatus);
                    this.setControlValue('RequestStatus', data.RequestStatus);
                    this.setControlValue('NationalAccount', data.NationalAccount === 'no' ? false : true);
                    this.setControlValue('InvoiceFrequencyCode', data.InvoiceFrequencyCode);
                    this.setControlValue('InvoiceAnnivDate', data.InvoiceAnnivDate);

                    if (!this.getControlValue('PremiseNumber')) {
                        this.isTrPremise = false;
                        this.isTrServiceCover = false;
                    } else if (!this.getControlValue('ProductCode')) {
                        this.isTrPremise = true;
                        this.isTrServiceCover = false;
                    } else {
                        this.isTrPremise = true;
                        this.isTrServiceCover = true;
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Enable/disable page controls based on the Add/Edit mode
    public setPageControlStatus(): void {
        this.disablePageControls();

        this.disableControl('RequestDate', !this.isAddMode);

        this.setControlRequiredStatus('RequestDate', true);
        this.setControlRequiredStatus('EarliestEffectDate', true);
        this.setControlRequiredStatus('ClientContact', true);
        this.setControlRequiredStatus('ClientContactTelephoneNumber', true);
        this.setControlRequiredStatus('ClientContactPosition', true);
        this.setControlRequiredStatus('EmployeeCode', true);
        this.setControlRequiredStatus('LostBusinessRequestNarrative', true);

        if (this.isAddMode) {
            setTimeout(() => {
                this.requestDate.onFocus();
            }, 0);
        } else {
            setTimeout(() => {
                this.renderer.invokeElementMethod(this.clientContact.nativeElement, 'focus');
            }, 0);
        }
    }

    public setControlRequiredStatus(ctrlName: string, status: boolean): void {
        this.riExchange.updateCtrl(this.controls, ctrlName, 'required', status);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, ctrlName, status);
    }

    public selectBranchIntoCombo(): any {
        let branchNumber = this.getControlValue('BranchNumber');

        if (branchNumber) {
            this.branchNumberSelected = {
                id: branchNumber,
                text: this.utils.getBranchText(branchNumber)
            };
        }
    }

    public selectOriginIntoCombo(): any {
        let requestOriginCode = this.getControlValue('RequestOriginCode');

        if (requestOriginCode) {
            let lookupIP_details = [];

            lookupIP_details.push({
                'table': 'LBRequestOriginLang',
                'query': {
                    'RequestOriginCode': requestOriginCode,
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['LBRequestOriginDesc']
            });

            this.LookUp.lookUpRecord(lookupIP_details).subscribe((data) => {
                if (data[0][0]) {
                    this.originCodeSelected = {
                        id: requestOriginCode,
                        text: requestOriginCode + ' - ' + data[0][0].LBRequestOriginDesc
                    };
                }
            });
        }
    }

    // Branch combo event
    public onBranchDataReceived(obj: any): void {
        this.setControlValue('BranchNumber', obj.BranchNumber);
    }

    // Origin combo event
    public onOriginDataReceived(obj: any): void {
        this.setControlValue('RequestOriginCode', obj['LBRequestOriginLang.RequestOriginCode']);
    }

    // Populate data from ellipsis
    public onEllipsisDataReceived(type: string, data: any): void {
        switch (type) {
            case 'Employee':
                this.setControlValue('EmployeeCode', data.EmployeeCode || '');
                this.setControlValue('EmployeeSurname', data.EmployeeSurname || '');
                break;
            default:
        }
    }

    public beforeAddMode(): void {
        this.setControlValue('BranchNumber', this.utils.getBranchCode());
        this.getStatus();
        this.selectBranchIntoCombo();

        if (this.glSCAutoCreateProspect) {
            this.contactTypeDetailCodeSelectOnChange(this.contactTypeDetailFirstElement);
            this.isTrCreateProspect = true;
        }
    }

    // Contact Type Detail Code On Change event
    public contactTypeDetailCodeSelectOnChange(event: any): void {
        if (this.InStr('ContactTypeDetailCreateProspect', '^' + event + '^') > 0 && this.getControlValue('NationalAccount').toString() === 'false') {
            this.setControlValue('createProspectInd', true);
        } else {
            this.setControlValue('createProspectInd', false);
        }
        this.setControlValue('ContactTypeDetailCode', event);
    }

    // Form cancel event
    public cancelOnClick(event: any): void {
        this.formPristine();
        this.location.back();
    }

    // Form Cancel Request event
    public cancelRequestOnClick(event: any): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.CancelRecord, null, this.deleteRequest.bind(this)));
    }

    public deleteRequest(): void {
        let formData: Object = {};
        let search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '3');

        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['LostBusinessRequestROWID'] = this.getControlValue('LostBusinessRequestROWID');
        formData['LostBusinessRequestNumber'] = this.getControlValue('LostBusinessRequestNumber');
        formData['Function'] = 'GetStatus';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.formPristine();
                    this.location.back();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public requestDateSelectedValue(value: any): void {
        this.getEarliestEffectDate();
    }

    public getEarliestEffectDate(): void {
        let requestDate = this.getControlValue('RequestDate');

        if ((this.islForceEffectDate || requestDate) && this.vSCEnableMonthsNotice) {
            this.islForceEffectDate = false;

            let formData: Object = {};
            let search = this.getURLSearchParamObject();

            search.set(this.serviceConstants.Action, '6');

            formData['Function'] = 'GetEarliestEffectDate';
            formData['ContractNumber'] = this.getControlValue('ContractNumber');
            formData['RequestDate'] = this.getControlValue('RequestDate');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.setControlValue('EarliestEffectDate', data.EarliestEffectDate);
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }
    }

    public getRequestNumber(): void {
        let formData: Object = {};
        let search = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'GetRequestNumber';
        formData['CustomerContactNumber'] = this.getControlValue('CustomerContactNumber');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('LostBusinessRequestNumber', data.LostBusinessRequestNumber);
                    this.fetchInitialRecord();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public menuSelectOnChange(event: any): void {
        switch (event) {
            case 'Contact':
                this.cmdContact();
                break;
            case 'CustomerContacts':
                this.cmdCustomerContacts();
                break;
        }
    }

    public cmdContact(): void {
        if (!this.isAddMode) {
            let queryParams: any = {};
            if (this.riExchange.URLParameterContains('ContractHistory')) { queryParams['ContractHistory'] = ''; }
            this.navigate('Request', InternalSearchModuleRoutes.ICABSALOSTBUSINESSCONTACTSEARCH, queryParams);
        }
    }

    public cmdCustomerContacts(): void {
        if (!this.isAddMode) {
            let queryParams: any = {};
            if (this.riExchange.URLParameterContains('ContractHistory')) { queryParams['ContractHistory'] = ''; }
            // TODO will navigate to iCABSCMCustomerContactMaintenance screen
            // this.navigate('ClientRetentionRequest', 'iCABSCMCustomerContactMaintenance.htm', queryParams);
            this.modalAdvService.emitMessage(new ICabsModalVO('iCABSCMCustomerContactMaintenance.htm - This screen is not yet developed!'));
        }
    }

    // Form submit event
    public onSubmit(event: any): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.getLookupData();
            this.warnEmployeeLeft();
        }
    }

    // Save record
    public saveRecord(): void {
        let formData: Object = {};
        let search = this.getURLSearchParamObject();
        let premiseNumber = this.getControlValue('PremiseNumber');
        let productCode = this.getControlValue('ProductCode');
        let callLogID = this.getControlValue('CallLogID');
        let serviceCoverRowID = this.getControlValue('ServiceCoverRowID');
        let lostBusinessRequestNumber = this.getControlValue('LostBusinessRequestNumber');

        if (premiseNumber) { formData['PremiseNumber'] = premiseNumber; }

        if (productCode) { formData['ProductCode'] = productCode; }

        if (callLogID) { formData['CallLogID'] = callLogID; } else { formData['CallLogID'] = ''; }

        if (lostBusinessRequestNumber) { formData['LostBusinessRequestNumber'] = lostBusinessRequestNumber; } else { formData['LostBusinessRequestNumber'] = ''; }

        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['RequestDate'] = this.getControlValue('RequestDate');
        formData['RequestOriginCode'] = this.getControlValue('RequestOriginCode');
        formData['ClientContact'] = this.getControlValue('ClientContact');
        formData['ClientContactTelephoneNumber'] = this.getControlValue('ClientContactTelephoneNumber');
        formData['ClientContactPosition'] = this.getControlValue('ClientContactPosition');
        formData['BranchNumber'] = this.getControlValue('BranchNumber');
        formData['EmployeeCode'] = this.getControlValue('EmployeeCode');
        formData['LostBusinessRequestNarrative'] = this.getControlValue('LostBusinessRequestNarrative');
        formData['EarliestEffectDate'] = this.getControlValue('EarliestEffectDate');
        formData['CustomerContactNumber'] = this.getControlValue('CustomerContactNumber');
        formData['CreateProspectInd'] = this.getControlValue('CreateProspectInd') ? 'yes' : 'no';
        formData['ContactTypeCode'] = this.getControlValue('ContactTypeCode');
        formData['ContactTypeDetailCode'] = this.getControlValue('ContactTypeDetailCode');

        if (this.isAddMode) {
            search.set(this.serviceConstants.Action, '1');
        } else {
            search.set(this.serviceConstants.Action, '2');
            formData['ROWID'] = this.getControlValue('LostBusinessRequestROWID');
        }

        if (this.riExchange.URLParameterContains('ServiceCover') && serviceCoverRowID) {
            formData['ServiceCoverRowID'] = serviceCoverRowID;
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.formPristine();
                    this.location.back();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public warnEmployeeLeft(): void {
        let formData: Object = {};
        let search = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'WarnEmployeeLeft';
        formData['EmployeeCode'] = this.getControlValue('EmployeeCode');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (data.ErrorMessageDesc !== '') {
                        this.modalAdvService.emitError(new ICabsModalVO(data.ErrorMessageDesc));
                    } else {
                        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.saveRecord.bind(this)));
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public checkContractType(): void {
        if (this.getControlValue('ContractNumber')) {
            let formData: Object = {};
            let search = this.getURLSearchParamObject();

            search.set(this.serviceConstants.Action, '6');

            formData['Function'] = 'CheckContractType';
            formData['ContractNumber'] = this.getControlValue('ContractNumber');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        // Do Nothing
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }
    }
}
