import * as moment from 'moment';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { ContractSearchComponent } from '../../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from '../../../internal/search/iCABSAServiceCoverSearch';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
import { ErrorConstant } from './../../../../shared/constants/error.constant';


@Component({
    templateUrl: 'iCABSSeServicePlanDeliveryNotebyProduct.html'
})

export class ServicePlanDeliveryNoteProductComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', readonly: false, disabled: false, required: true, type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ProductCode', readonly: true, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'FieldDate', readonly: true, disabled: false, required: false },
        { name: 'GenerateOption', readonly: true, disabled: false, required: false },
        { name: 'ReportDestination', readonly: true, disabled: false, required: false },
        { name: 'Submit', readonly: true, disabled: false, required: false },
        { name: 'MoreThanOne', readonly: true, disabled: true, required: false },
        { name: 'ServiceCoverRowID', readonly: true, disabled: true, required: false },
        { name: 'IncludeLocations', readonly: true, disabled: false, required: false },
        { name: 'NumberOfForms', readonly: true, disabled: false, required: false, type: MntConst.eTypeInteger }
    ];

    private queryParams: any = {
        operation: 'Service/iCABSSeServicePlanDeliveryNotebyProduct',
        module: 'delivery-note',
        method: 'service-delivery/maintenance'
    };

    public vSCDeliveryNoteTypeRequired: any;
    public vSCDeliveryNoteType: any;
    public FieldDate: any = new Date();
    public FieldDateDisplayed: any;
    public dateReadOnly: boolean = false;
    public isRequesting: boolean = false;
    public thInformationDisplayed: boolean = false;
    public thInformation2Displayed: boolean = false;
    public locationsAndFormsDisplay: boolean = false;
    public thInformation: any;
    public thInformation2: any;
    private branchNumber: string;

    @ViewChild('ContractSearchComponent') ContractSearchComponent;
    @ViewChild('premisesNumberEllipsis') premisesNumberEllipsis: EllipsisComponent;
    @ViewChild('productcodeEllipsis') productcodeEllipsis: EllipsisComponent;

    public ellipsis = {
        contractSearch: {
            disabled: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp-All',
                currentContractType: '',
                currentContractTypeURLParameter: '',
                showAddNew: false,
                contractNumber: ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            showHeader: true,
            showAddNew: false,
            autoOpenSearch: false,
            setFocus: false,
            component: ContractSearchComponent
        },
        premises: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'currentContractType': 'C',
                'currentContractTypeURLParameter': '<contract>',
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: PremiseSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        product: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-Freq',
                'ContractNumber': '',
                'ContractName': '',
                'PremiseNumber': '',
                'PremiseName': '',
                'currentContractType': 'C',
                'currentContractTypeURLParameter': '<contract>',
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ServiceCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANDELIVERYNOTEBYPRODUCT;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Generate Single Service Receipt';
        this.windowOnLoad();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.ellipsis.contractSearch.autoOpenSearch = true;
        }, 1000);
    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private windowOnLoad(): void {
        this.getSysCharDtetails();
    }

    private getSysCharDtetails(): void {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharServiceDeliveryNoteType
        ];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: '0',
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.vSCDeliveryNoteTypeRequired = record[0]['Required'];
            this.vSCDeliveryNoteType = record[0]['Integer'];
            this.setInitialValues();
        });
    }

    private setInitialValues(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeLocations', false);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'NumberOfForms', '4');
        this.FieldDateDisplayed = this.globalize.parseDateToFixedFormat(this.FieldDate);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ReportDestination', 'Listing');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'GenerateOption', 'Listing');
        this.branchNumber = this.utils.getBranchCode();
        if (this.vSCDeliveryNoteTypeRequired) {
            switch (this.vSCDeliveryNoteType) {
                case 1:
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'GenerateOption', 'Receipts');
                    break;
                case 2:
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'GenerateOption', 'Listing');
                    break;
                case 3:
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'GenerateOption', 'Both');
                    this.locationsAndFormsDisplay = true;
                    break;
                default:
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'GenerateOption', 'Listing');
            }
        }
    }

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.FieldDateDisplayed = this.globalize.parseDateToFixedFormat(value.value);
        } else {
            this.FieldDateDisplayed = '';
        }
    }

    // On contract number ellipsis data return
    public onContractDataReceived(data: any): void {
        this.contractNumberKeyUp();
        this.setFormMode(this.c_s_MODE_UPDATE);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
        this.ellipsis.premises.childConfigParams.ContractNumber = data.ContractNumber;
        this.ellipsis.premises.childConfigParams.ContractName = data.ContractName;
        this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName');
        this.populateDescriptions('Contract');
    }

    public onPremiseDataReceived(obj: any, call: boolean): void {
        this.premiseNumberKeyUp();
        if (obj.PremiseNumber) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', obj.PremiseNumber);
            this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.product.childConfigParams.PremiseNumber = obj.PremiseNumber;
        }
        if (obj.PremiseName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', obj.PremiseName);
            this.ellipsis.product.childConfigParams.PremiseName = obj.PremiseName;
        }
        this.productcodeEllipsis.updateComponent();
        this.populateDescriptions('Premise');
    }

    public onProductDataReceived(obj: any, call: boolean): void {
        if (call) {
            if (obj.row.ProductCode) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', obj.row.ProductCode);
            }
            if (obj.row.ProductDesc) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', obj.row.ProductDesc);
            }
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', obj.row.ServiceCoverRowID);
            this.populateDescriptions('Product');
        }
    }

    public modalHiddenForContract(e: any): void {
        this.ellipsis.contractSearch.autoOpenSearch = false;
    }

    public contractNumberOnChange(obj: any): void {
        this.setFormMode(this.c_s_MODE_SELECT);
        if (this.uiForm.controls['ContractNumber'].value !== '') {
            this.uiForm.controls['ContractNumber'].setValue(this.utils.numberPadding(obj.value, 8));
            this.ellipsis.premises.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.premises.childConfigParams.ContractName = this.getControlValue('ContractName');
            this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName');
            this.setFormMode(this.c_s_MODE_UPDATE);
            this.populateDescriptions('Contract');
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', '');
            this.ellipsis.premises.childConfigParams.ContractNumber = '';
            this.ellipsis.premises.childConfigParams.ContractName = '';
            this.ellipsis.product.childConfigParams.ContractNumber = '';
            this.ellipsis.product.childConfigParams.PremiseNumber = '';
            this.ellipsis.product.childConfigParams.ContractName = '';
            this.ellipsis.product.childConfigParams.PremiseName = '';
        }
    }

    public premiseNumberOnChange(obj: any): void {
        if (this.uiForm.controls['PremiseNumber'].value !== '') {
            this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.product.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
            this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName');
            this.ellipsis.product.childConfigParams.PremiseName = this.getControlValue('PremiseName');
            this.populateDescriptions('Premise');
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', '');
            this.ellipsis.product.childConfigParams.PremiseNumber = '';
            this.ellipsis.product.childConfigParams.PremiseName = '';
        }
    }

    public productCodeOnChange(obj: any): void {
        if (this.uiForm.controls['ProductCode'].value !== '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.uiForm.controls['ProductCode'].value.toUpperCase());
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', '');
            this.populateDescriptions('Product');
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', '');
        }
    }

    private populateDescriptions(flag: any): void {
        console.log('data', flag);
        let searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '6');
        if (this.uiForm.controls['ContractNumber'].value !== '') {
            searchParams.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        }
        if (this.uiForm.controls['PremiseNumber'].value !== '') {
            searchParams.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        }
        if (this.uiForm.controls['ProductCode'].value !== '') {
            searchParams.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        }
        searchParams.set('Mode', 'SetDisplayFields');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, searchParams)
            .subscribe(
            (data) => {
                if (data.errorMessage) {
                    this.clearFields(flag);
                    this.errorService.emitError(new Error(ErrorConstant.Message.RecordNotFound));

                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.ProductDesc);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', data.ServiceCoverRowID);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', data.ServiceVisitFrequency);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'MoreThanOne', data.MoreThanOne);
                    this.ellipsis.premises.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
                    this.ellipsis.premises.childConfigParams.ContractName = this.getControlValue('ContractName');
                    this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
                    this.ellipsis.product.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
                    this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName');
                    this.ellipsis.product.childConfigParams.PremiseName = this.getControlValue('PremiseName');
                    if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitFrequency') === '0') {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', '');
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.clearFields(flag);
                this.errorService.emitError(new Error(ErrorConstant.Message.RecordNotFound));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private clearFields(flag: any): void {
        this.setFormMode(this.c_s_MODE_SELECT);
        console.log(flag);
        if (flag === 'Premise') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
            this.ellipsis.product.childConfigParams.PremiseNumber = '';
            this.ellipsis.product.childConfigParams.PremiseName = '';

        }
        if (flag === 'Contract') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
            this.ellipsis.premises.childConfigParams.ContractNumber = '';
            this.ellipsis.premises.childConfigParams.ContractName = '';
            this.ellipsis.product.childConfigParams.ContractNumber = '';
            this.ellipsis.product.childConfigParams.ContractName = '';
            this.ellipsis.product.childConfigParams.PremiseNumber = '';
            this.ellipsis.product.childConfigParams.PremiseName = '';
        }
        if (flag === 'Product') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'MoreThanOne', '');
        this.thInformationDisplayed = false;
        this.thInformation2Displayed = false;
    }

    public contractNumberKeyUp(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'ContractNumber', false);
    }

    public premiseNumberKeyUp(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseNumber', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseNumber', false);
    }

    public onSubmitClicked(): void {
        if (this.uiForm.controls['ContractNumber'].value === '') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', true);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'ContractNumber', true);
            this.uiForm.controls['ContractNumber'].setErrors({ required: true });
        }
        if (this.uiForm.controls['PremiseNumber'].value === '') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseNumber', true);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseNumber', true);
            this.uiForm.controls['PremiseNumber'].setErrors({ required: true });
        }
        if (this.FieldDateDisplayed !== '' && (moment(this.FieldDate, 'DD/MM/YYYY', true).isValid())) {
            //@TODO--Set Error status for date field
        }
        if (this.uiForm.controls['ContractNumber'].value && this.uiForm.controls['PremiseNumber'].value && this.vSCDeliveryNoteTypeRequired) {
            this.thInformationDisplayed = false;
            this.thInformation2Displayed = false;
            let generateOption = this.uiForm.controls['GenerateOption'].value;
            switch (generateOption) {
                case 'Listing':
                    this.submitReportRequestList();
                    break;
                case 'Receipts':
                    this.submitReportRequest();
                    break;
                case 'Both':
                    this.submitReportRequestList();
                    this.submitReportRequest();
                    break;
                default:
                //Nothing
            }
        }
    }

    private submitReportRequestList(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');

        let postParams: any = {};
        postParams.Description = 'Single Service List';
        postParams.ProgramName = 'iCABSServiceDeliveryNoteListGeneration.p';
        postParams.StartDate = this.FieldDateDisplayed;
        let date = this.globalize.parseDateStringToDate(this.FieldDateDisplayed) as Date;
        postParams.StartTime = date.getHours() * 60 + date.getMinutes();
        postParams.Report = 'report';
        postParams.ParameterName = 'BusinessCodeBranchNumberModeContractNumberPremiseNumberProductCodeServiceCoverIncludeLocationsNumberOfFormsFieldDateRepManDest';
        postParams.ParameterValue = this.businessCode() + '' + this.branchNumber + 'Single' + this.uiForm.controls['ContractNumber'].value + '' + this.uiForm.controls['PremiseNumber'].value + '' + this.uiForm.controls['ProductCode'].value + '' + this.uiForm.controls['ServiceCoverRowID'].value + '' + this.uiForm.controls['IncludeLocations'].value + '' + this.uiForm.controls['NumberOfForms'].value + '' + this.FieldDateDisplayed + '' + 'batch' + '|' + 'ReportID';

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
                        this.thInformation = e.fullError;
                        this.thInformationDisplayed = true;
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private submitReportRequest(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');

        let postParams: any = {};
        postParams.Description = 'Single Service Receipt';
        postParams.ProgramName = 'iCABSServiceDeliveryNoteReportGeneration.p';
        postParams.StartDate = this.FieldDateDisplayed;
        let date = this.globalize.parseDateStringToDate(this.FieldDateDisplayed) as Date;
        postParams.StartTime = date.getHours() * 60 + date.getMinutes();
        postParams.Report = 'report';
        postParams.ParameterName = 'BusinessCodeBranchNumberModeContractNumberPremiseNumberProductCodeServiceCoverFieldDateRepManDest';
        postParams.ParameterValue = this.businessCode() + '' + this.branchNumber + 'Single' + this.uiForm.controls['ContractNumber'].value + '' + this.uiForm.controls['PremiseNumber'].value + '' + this.uiForm.controls['ProductCode'].value + '' + this.uiForm.controls['ServiceCoverRowID'].value + '' + this.FieldDateDisplayed + '' + 'batch' + '|' + 'ReportID';

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
                        this.thInformation2 = e.fullError;
                        this.thInformation2Displayed = true;

                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }
}



