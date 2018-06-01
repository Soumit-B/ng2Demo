import { Component, Injector, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { InternalGridSearchServiceModuleRoutes, InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';

@Component({
    templateUrl: 'iCABSACustomerInformationAccountMaintenance.html'
})

export class CustomerInformationAccountMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('messageModal') public messageModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public pageId: string = '';

    public controls = [
        { name: 'GroupAccountNumber', disabled: true, type: MntConst.eTypeCodeNumeric },
        { name: 'GroupName', disabled: true, type: MntConst.eTypeText },
        { name: 'AccountNumber', disabled: true, type: MntConst.eTypeText },
        { name: 'AccountName', disabled: true, type: MntConst.eTypeText },
        { name: 'ContractNumber', disabled: true, type: MntConst.eTypeCode },
        { name: 'ContractName', disabled: true, type: MntConst.eTypeText },
        { name: 'CustomerInfoNumber', required: true, type: MntConst.eTypeInteger },
        { name: 'InfoLevel', type: MntConst.eTypeText },
        { name: 'CallingProg', type: MntConst.eTypeText }
    ];
    public callingprog: string;
    public showGroupAccountNumber: boolean = true;
    public showAccountNumber: boolean = true;
    public showContractNumber: boolean = true;
    public showMessageHeader: boolean = true;
    // public showCloseButton: boolean = true;

    public queryParams: any = {
        operation: 'Application/iCABSACustomerInformationAccountMaintenance',
        module: 'customer',
        method: 'contract-management/maintenance'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACUSTOMERINFORMATIONACCOUNTMAINTENANCE;
        this.pageTitle = this.browserTitle = 'Customer Information Account Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnLoad();
    }

    public windowOnLoad(): void {
        this.setControlValue('GroupAccountNumber', this.riExchange.getParentHTMLValue('GroupAccountNumber'));
        this.setControlValue('GroupName', this.riExchange.getParentHTMLValue('GroupName'));
        this.setControlValue('AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
        this.setControlValue('AccountName', this.riExchange.getParentHTMLValue('AccountName'));
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('CallingProg', this.riExchange.getParentHTMLValue('CallingProg'));

        this.setFormMode(this.c_s_MODE_UPDATE);

        switch (this.getControlValue('CallingProg')) {
            case 'GroupAccount':
                this.showAccountNumber = false;
                this.showContractNumber = false;

                break;
            case 'Account':
                this.showGroupAccountNumber = false;
                this.showContractNumber = false;
                break;
            case 'Contract':
                this.showGroupAccountNumber = false;
                this.showAccountNumber = false;
                break;
        }
    }

    public saveData(): void {

        if (this.riExchange.validateForm(this.uiForm)) {

            this.ajaxSource.next(this.ajaxconstant.START);

            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            searchParams.set(this.serviceConstants.Action, '1');

            let bodyParams: any = {};
            bodyParams['CallingProg'] = this.riExchange.getParentHTMLValue('CallingProg');
            bodyParams['AccountName'] = this.riExchange.getParentHTMLValue('AccountName');
            bodyParams['ContractName'] = this.riExchange.getParentHTMLValue('ContractName');
            bodyParams['GroupName'] = this.riExchange.getParentHTMLValue('GroupName');
            bodyParams['CustomerInfoNumber'] = this.getControlValue('CustomerInfoNumber');

            switch (this.getControlValue('CallingProg')) {
                case 'GroupAccount':
                    bodyParams['GroupAccountNumber'] = this.getControlValue('GroupAccountNumber');
                    break;
                case 'Account':
                    bodyParams['AccountNumber'] = this.getControlValue('AccountNumber');
                    break;
                case 'Contract':
                    bodyParams['ContractNumber'] = this.getControlValue('ContractNumber');
                    break;
            }

            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(
                (data) => {
                    if (data.errorMessage) {
                        this.messageModal.show({ msg: data.errorMessage, title: 'Message' }, false);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                    else {
                        this.formPristine();
                        this.riExchange.setParentHTMLValue('CustomerPassNumber', data.CustomerInfoNumber);
                        this.riExchange.setParentHTMLValue('CustomerPassLevel', data.InfoLevel);
                        //intermediate open parent page and then open customerinformationmaintenance
                        //this.messageModal.show({ msg: 'iCABSACustomerInformationMaintenance Page Under Construction', title: 'Message' }, false);
                        this.navigate('', InternalMaintenanceApplicationModuleRoutes.ICABSACUSTOMERINFORMATIONMAINTENANCE, {
                            'CustomerPassNumber': data.CustomerInfoNumber,
                            'CustomerPassLevel': data.InfoLevel,
                            'Mode': 'Existing'
                        });
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                });
        }
    }

    public cancelData(): void {
        this.setControlValue('CustomerInfoNumber', '');
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
