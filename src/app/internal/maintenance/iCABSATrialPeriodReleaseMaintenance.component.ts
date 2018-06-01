import { Component, OnInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Subscription } from 'rxjs/Subscription';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { URLSearchParams } from '@angular/http';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { MntConst } from '../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSATrialPeriodReleaseMaintenance.html',
    styles: [
        `.red-bdr span {border-color: transparent !important;}
    `]
})

export class TrialPeriodReleaseMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('promptModal') public promptConfirmModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public lookUpSubscription: Subscription;
    public pageId: string = '';
    public promptTitle: string;
    public promptContent: string;
    public inputParams: any = {};
    public pageTitle: string = '';
    public search: URLSearchParams;
    public showErrorHeader: boolean = true;
    public showEmployeeCodeValid: boolean = true;
    private backupData: any = {};
    public showMessageHeader: boolean = true;
    public method: string = 'contract-management/maintenance';
    public module: string = 'contract-admin';
    public operation: string = 'Application/iCABSATrialPeriodReleaseMaintenance';
    public valueValidation: boolean = false;
    public validateEmployee: boolean = false;
    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: true, required: true },
        { name: 'ContractName', readonly: true, disabled: true, required: true },
        { name: 'PremiseNumber', readonly: true, disabled: true, required: true },
        { name: 'PremiseName', readonly: true, disabled: true, required: true },
        { name: 'ProductCode', readonly: true, disabled: true, required: true },
        { name: 'ProductDesc', readonly: true, disabled: true, required: true },
        { name: 'AnnualValueChange', readonly: false, disabled: false, required: true, type: MntConst.eTypeCurrency },
        { name: 'ProposedAnnualValue', readonly: true, disabled: true, required: true, type: MntConst.eTypeCurrency },
        { name: 'ServiceSalesEmployee', readonly: false, disabled: false, required: true },
        { name: 'EmployeeSurname', readonly: true, disabled: true, required: true },
        { name: 'ServiceCoverNumber', readonly: true, disabled: true, required: true },
        { name: 'ServiceCover', readonly: true, disabled: true, required: true },
        { name: 'AnnualValueChangeValue' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSATRIALPERIODRELEASEMAINTENANCE;
        this.pageTitle = 'Service Cover Trial Period Acceptance';
        this.browserTitle = this.pageTitle;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.inputParams.method = this.method;
        this.inputParams.module = this.module;
        this.inputParams.operation = this.operation;
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ServiceCoverNumber', this.riExchange.getParentHTMLValue('ServiceCoverNumber'));
        this.setControlValue('ServiceCover', this.riExchange.getParentAttributeValue('ServiceCoverRowID'));
        this.window_onload();
        this.buildtable();
    }


    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private window_onload(): void {
        this.riMaintenance.CustomBusinessObjectSelect = false;
        this.riMaintenance.CustomBusinessObjectConfirm = false;
        this.riMaintenance.CustomBusinessObjectInsert = false;
        this.riMaintenance.CustomBusinessObjectUpdate = true;
        this.riMaintenance.CustomBusinessObjectDelete = false;

        this.riMaintenance.FunctionSnapShot = false;
        this.riMaintenance.FunctionDelete = false;
        this.riMaintenance.FunctionAdd = false;
        this.riMaintenance.FunctionSelect = false;
        this.riMaintenance.FunctionSearch = false;
    }

    private buildtable(): void {
        let lookupIP = [
            {
                'table': 'ServiceCover',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'ProductCode': this.getControlValue('ProductCode'),
                    'ROWID': this.getControlValue('ServiceCover')
                },
                'fields': ['ProposedAnnualValue', 'AnnualValueChange', 'ServiceSalesEmployee']
            },
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
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ProductDesc']
            }

        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let ServiceCover = data[0][0];
            if (ServiceCover) {
                this.setControlValue('AnnualValueChange', ServiceCover.ProposedAnnualValue);
                this.setControlValue('ProposedAnnualValue', ServiceCover.ProposedAnnualValue);
                this.setControlValue('ServiceSalesEmployee', ServiceCover.ServiceSalesEmployee);
                this.backupData.AnnualValueChange = this.getControlValue('AnnualValueChange');
                this.backupData.ServiceSalesEmployee = this.getControlValue('ServiceSalesEmployee');
                this.getEmployee();
            }
            let Contract = data[1][0];
            if (Contract) {
                this.setControlValue('ContractName', Contract.ContractName);
            }
            let Premise = data[2][0];
            if (Premise) {
                this.setControlValue('PremiseName', Premise.PremiseName);
            }
            let Product = data[3][0];
            if (Product) {
                this.setControlValue('ProductDesc', Product.ProductDesc);
            }
        });
    }

    public onEmployeeBlurClick(event: any): void {
        this.setControlValue('ServiceSalesEmployee', event.target.value.toUpperCase());
    }

    private getEmployee(): void {
        let EmployeeLookUp = [
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'EmployeeCode': this.getControlValue('ServiceSalesEmployee')
                },
                'fields': ['EmployeeSurname']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(EmployeeLookUp).subscribe((data) => {
            let Employee = data[0][0];
            if (Employee) {
                this.setControlValue('EmployeeSurname', Employee.EmployeeSurname);
                this.backupData.EmployeeSurname = this.getControlValue('EmployeeSurname');
            }
        });
    }

    private checkEmployeeCode(): void {
        let EmployeeLookUp = [
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'EmployeeCode': this.getControlValue('ServiceSalesEmployee')
                },
                'fields': ['EmployeeSurname']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(EmployeeLookUp).subscribe((data) => {
            let Employee = data[0][0];
            if (Employee) {
                if (Employee.EmployeeSurname) {
                    this.validateEmployee = false;
                    this.setControlValue('EmployeeSurname', Employee.EmployeeSurname);
                    this.promptTitle = 'Confirm';
                    this.promptContent = MessageConstant.Message.ConfirmRecord;
                    this.promptConfirmModal.show();
                } else {
                    //  this.riExchange.riInputElement.isError(this.uiForm, 'ServiceSalesEmployee');
                    this.validateEmployee = true;
                    this.setControlValue('EmployeeSurname', '');
                }

            } else {
                // this.riExchange.riInputElement.isError(this.uiForm, 'ServiceSalesEmployee');
                this.validateEmployee = true;
                this.setControlValue('EmployeeSurname', '');
            }
        });
    }

    public onSaveClick(): void {
        if (this['uiForm'].valid) {
            event.preventDefault();
            this.checkEmployeeCode();

        } else {
            this.riExchange.riInputElement.isError(this.uiForm, 'AnnualValueChange');
            this.riExchange.riInputElement.isError(this.uiForm, 'ServiceSalesEmployee');
        }
    }


    public onCancelClick(): void {
        this.setControlValue('AnnualValueChange', this.backupData.AnnualValueChange);
        this.setControlValue('ServiceSalesEmployee', this.backupData.ServiceSalesEmployee);
        this.setControlValue('EmployeeSurname', this.backupData.EmployeeSurname);
        this.formPristine();
        this.location.back();
    }

    public promptSave(data: any): void {

        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.inputParams.search = this.search;
        let formdata: Object = {};
        formdata['ServiceCoverROWID'] = this.getControlValue('ServiceCover');
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formdata['ProductCode'] = this.getControlValue('ProductCode');
        formdata['ServiceCoverNumber'] = this.getControlValue('ServiceCoverNumber');
        formdata['ProposedAnnualValue'] = this.getControlValue('ProposedAnnualValue');
        if (this.getControlValue('AnnualValueChange').toString().includes('('))
            formdata['AnnualValueChange'] = this.getControlValue('AnnualValueChange').replace('(', '-').replace(')', '');
        else
            formdata['AnnualValueChange'] = this.getControlValue('AnnualValueChange');
        formdata['ServiceSalesEmployee'] = this.getControlValue('ServiceSalesEmployee');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe(
            (data) => {
                if (data.hasOwnProperty('errorMessage')) {
                    this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                } else {
                    this.formPristine();
                    this.location.back();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorModal.show({ msg: error, title: 'Error' }, false);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }
}
