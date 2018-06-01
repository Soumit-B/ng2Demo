import { ErrorCallback } from './../../base/Callback';
import { ModalComponent } from './../../../shared/components/modal/modal';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({

    templateUrl: 'iCABSSInstallReceipt.html'
})

export class InstallReceiptComponent extends BaseComponent implements OnInit, OnDestroy, ErrorCallback {
    @ViewChild('errorModal') public errorModal;

    public pageId: string = '';
    public controls = [
        { name: 'Business', disabled: true },
        { name: 'CompanyCode' },
        { name: 'BranchNumber' },
        { name: 'DateFrom' },
        { name: 'DateTo' },
        { name: 'ReportType', value: 'Processed' },
        { name: 'ReceiptType', value: 'All' },
        { name: 'RepDest', value: 'direct' }
    ];

    public xhrParams = {
        method: 'service-delivery/maintenance',
        module: 'installations',
        operation: 'Sales/iCABSSInstallReceipt'
    };

    //Modal
    public showErrorHeader: boolean = true;

    public branchCodeList: Array<any>;
    public datePickerConfig = {
        DateFrom: new Date(),
        DateTo: new Date()
    };

    //Ellipsis
    public ellipseConfig = {
        bCompanySearchComponent: {
            inputParamsCompanySearch: {
                parentMode: 'LookUp',
                businessCode: this.businessCode(),
                countryCode: this.countryCode()
            },
            isDisabled: false,
            isRequired: false,
            active: { id: '', text: '' }
        }
    };

    public trInformation: boolean = false;
    public reportGenMsg: string = '';

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSINSTALLRECEIPT;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initPage();
    }

    private initPage(): void {
        let branchCode: number = parseInt(this.cbbService.getBranchCode(), 10);
        this.datePickerConfig.DateFrom.setDate(this.datePickerConfig.DateFrom.getDate() - 1);
        this.datePickerConfig.DateTo.setDate(this.datePickerConfig.DateTo.getDate() - 1);
        this.branchCodeList = this.cbbService.getBranchListByCountryAndBusiness(this.countryCode(), this.businessCode());
        this.setControlValue('BranchNumber', branchCode);

        //Get Busienss Code Desc
        let businessCodeList: Array<any> = this.cbbService.getBusinessListByCountry(this.countryCode());
        let businessObj: any = businessCodeList.find(x => x.value === this.businessCode());
        let busienssCodeDesc: string = businessObj.text;
        this.setControlValue('Business', busienssCodeDesc);

        this.setErrorCallback(this);
    }

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public companySearchdataReceived(e: any): void {
        this.setControlValue('CompanyCode', e.CompanyCode);
        this.setControlValue('CompanyDesc', e.CompanyDesc);
    }

    public onSelectDateFrom(e: any): void {
        this.setControlValue('DateFrom', e.value);
    }

    public onSelectDateTo(e: any): void {
        this.setControlValue('DateTo', e.value);
    }

    public onClickSubmit(): void {
        let queryParams: URLSearchParams = new URLSearchParams(), formData: any = {}, dt: any = new Date(), parameterList: any = {}, parameterName: any = [], parameterValue: any = [];

        queryParams.set(this.serviceConstants.Action, '0');
        queryParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.countryCode());

        parameterList['BusinessCode'] = this.businessCode();
        parameterList['BranchNumber'] = this.getControlValue('BranchNumber');
        parameterList['DateFrom'] = this.getControlValue('DateFrom');
        parameterList['DateTo'] = this.getControlValue('DateTo');
        parameterList['RepManDest'] = 'batch|ReportID';
        parameterList['CompanyCode'] = this.getControlValue('CompanyCode');
        parameterList['Receipttype'] = this.getControlValue('ReceiptType');
        parameterList['Reporttype'] = this.getControlValue('ReportType');

        for (let key in parameterList) {
            if (key) {
                parameterName.push(key);
                parameterValue.push(parameterList[key]);
            }
        }
        parameterName = parameterName.join(' ');
        parameterValue = parameterValue.join(' ');

        formData['Description'] = 'Installation/Removal/Receipts';
        formData['ProgramName'] = 'iCABSInstallationReceipts.p';
        formData['StartDate'] = this.utils.formatDate(dt);
        formData['StartTime'] = dt.getTime();
        formData['Report'] = 'report';
        formData['ParameterName'] = parameterName;
        formData['ParameterValue'] = parameterValue;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, queryParams, formData)
            .subscribe(
            (value) => {
                if (value.hasError) {
                    this.errorService.emitError(value);
                } else {
                    this.trInformation = true;
                    if (value && value.header && value.header.cells && value.header.cells.length > 0) {
                        this.reportGenMsg = value.header.cells[0].text;
                    } else if (value && value.fullError) {
                        this.reportGenMsg = value.fullError;
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

}
