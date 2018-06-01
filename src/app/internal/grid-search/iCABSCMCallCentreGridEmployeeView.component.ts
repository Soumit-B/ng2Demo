import { InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';
import { Component, OnInit, OnDestroy, Injector, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSCMCallCentreGridEmployeeView.html'
})

export class CallCentreGridEmployeeViewComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';
    public pageTitle: string = '';
    private lAllowProductSelection: boolean;
    private TechEmployeeCode: string;
    public tdProductSelect: boolean = true;
    public trContractNumber: boolean = true;
    public tdNegEmployeeName: boolean = true;
    public LabelNegEmployeeName: boolean = true;
    public tdNegPhone: boolean = true;
    public tdNegPhone2: boolean = true;
    public tdNegMobilePhone: boolean = true;
    public tdNegEmail: boolean = true;
    public tdNegBranch: boolean = true;
    public tdDiary1: boolean = true;
    public tdBranch1: boolean = true;
    public tdSBranch1: boolean = true;
    public tdNegSupervisorEmployeeName: boolean = true;
    public tdNegSupervisorPhone: boolean = true;
    public tdNegSupervisorPhone2: boolean = true;
    public tdNegSupervisorMobilePhone: boolean = true;
    public tdNegSupervisorEmail: boolean = true;
    public tdNegSupervisorBranch: boolean = true;
    public trPremiseNumber: boolean = true;
    public tdSalesEmployeeName = true;
    public LabelSalesEmployeeName = true;
    public tdSalesPhone = true;
    public tdSalesPhone2 = true;
    public tdSalesMobilePhone = true;
    public tdSalesEmail = true;
    public tdSalesBranch = true;
    public tdDiary2 = true;
    public tdBranch2 = true;
    public tdSBranch2 = true;
    public tdSalesSupervisorEmployeeName = true;
    public tdSalesSupervisorPhone = true;
    public tdSalesSupervisorPhone2 = true;
    public tdSalesSupervisorMobilePhone = true;
    public tdSalesSupervisorEmail = true;
    public tdSalesSupervisorBranch = true;
    public tdTechEmployeeName = true;
    public LabelTechEmployeeName = true;
    public tdTechPhone = true;
    public tdTechPhone2 = true;
    public tdTechMobilePhone = true;
    public tdTechEmail = true;
    public tdTechBranch = true;
    public tdDiary3 = true;
    public tdBranch3 = true;
    public tdSBranch3 = true;
    public tdTechSupervisorEmployeeName = true;
    public tdTechSupervisorPhone = true;
    public tdTechSupervisorPhone2 = true;
    public tdTechSupervisorMobilePhone = true;
    public tdTechSupervisorEmail = true;
    public tdTechSupervisorBranch = true;
    public method: string = 'ccm/maintenance';
    public module: string = 'call-centre';
    public operation: string = 'ContactManagement/iCABSCMCallCentreGrid';
    public inputParams: any = {};
    public search: URLSearchParams;
    public serviceCoverList: Array<any> = [];
    public techServiceAreaDescList: string;
    public techServiceAreaCodeList: string;
    public controls = [
        { name: 'AccountProspectNumber', readonly: true, disabled: true, required: false },
        { name: 'AccountProspectName', readonly: true, disabled: true, required: false },
        { name: 'AccountNumber', readonly: false, disabled: false, required: false },
        { name: 'CurrentCallLogID', readonly: true, disabled: true, required: false },
        { name: 'AccountProspectContactName', readonly: true, disabled: true, required: false },
        { name: 'ContractNumber', readonly: true, disabled: true, required: false },
        { name: 'ContractName', readonly: true, disabled: true, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: true, required: false },
        { name: 'PremiseName', readonly: true, disabled: true, required: false },
        { name: 'NegEmployeeName', readonly: true, disabled: true, required: false },
        { name: 'SalesEmployeeName', readonly: true, disabled: true, required: false },
        { name: 'TechEmployeeName', readonly: true, disabled: true, required: false },
        { name: 'NegMobilePhone', readonly: true, disabled: true, required: false },
        { name: 'SalesMobilePhone', readonly: true, disabled: true, required: false },
        { name: 'TechMobilePhone', readonly: true, disabled: true, required: false },
        { name: 'NegPhone', readonly: true, disabled: true, required: false },
        { name: 'SalesPhone', readonly: true, disabled: true, required: false },
        { name: 'TechPhone', readonly: true, disabled: true, required: false },
        { name: 'NegPhone2', readonly: true, disabled: true, required: false },
        { name: 'SalesPhone2', readonly: true, disabled: true, required: false },
        { name: 'TechPhone2', readonly: true, disabled: true, required: false },
        { name: 'NegEmail', readonly: true, disabled: true, required: false },
        { name: 'SalesEmail', readonly: true, disabled: true, required: false },
        { name: 'TechEmail', readonly: true, disabled: true, required: false },
        { name: 'NegBranch', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'SalesBranch', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'TechBranch', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'NegSupervisorEmployeeName', readonly: true, disabled: true, required: false },
        { name: 'SalesSupervisorEmployeeName', readonly: true, disabled: true, required: false },
        { name: 'TechSupervisorEmployeeName', readonly: true, disabled: true, required: false },
        { name: 'NegSupervisorMobilePhone', readonly: true, disabled: true, required: false },
        { name: 'SalesSupervisorMobilePhone', readonly: true, disabled: true, required: false },
        { name: 'TechSupervisorMobilePhone', readonly: true, disabled: true, required: false },
        { name: 'NegSupervisorPhone', readonly: true, disabled: true, required: false },
        { name: 'SalesSupervisorPhone', readonly: true, disabled: true, required: false },
        { name: 'TechSupervisorPhone', readonly: true, disabled: true, required: false },
        { name: 'NegSupervisorPhone2', readonly: true, disabled: true, required: false },
        { name: 'SalesSupervisorPhone2', readonly: true, disabled: true, required: false },
        { name: 'TechSupervisorPhone2', readonly: true, disabled: true, required: false },
        { name: 'NegSupervisorEmail', readonly: true, disabled: true, required: false },
        { name: 'SalesSupervisorEmail', readonly: true, disabled: true, required: false },
        { name: 'TechSupervisorEmail', readonly: true, disabled: true, required: false },
        { name: 'NegSupervisorBranch', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'SalesSupervisorBranch', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'TechSupervisorBranch', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'TechEmployeeCode', readonly: false, disabled: false, required: false },
        { name: 'DiaryProspectNumber', readonly: true, disabled: true, required: false },
        { name: 'NegEmployeeCode', readonly: true, disabled: true, required: false },
        { name: 'NegBranchNumber', readonly: true, disabled: true, required: false },
        { name: 'NegSupervisorBranchNumber', readonly: true, disabled: true, required: false },
        { name: 'NegSupervisorEmployeeCode', readonly: true, disabled: true, required: false },
        { name: 'SalesBranchNumber', readonly: true, disabled: true, required: false },
        { name: 'SalesEmployeeCode', readonly: true, disabled: true, required: false },
        { name: 'SalesSupervisorBranchNumber', readonly: true, disabled: true, required: false },
        { name: 'SalesSupervisorEmployeeCode', readonly: true, disabled: true, required: false },
        { name: 'TechBranchNumber', readonly: true, disabled: true, required: false },
        { name: 'TechServiceAreaCode', readonly: true, disabled: true, required: false },
        { name: 'TechServiceAreaCodeList', readonly: true, disabled: true, required: false },
        { name: 'TechServiceAreaDescList', readonly: true, disabled: true, required: false },
        { name: 'TechSupervisorBranchNumber', readonly: true, disabled: true, required: false },
        { name: 'TechSupervisorEmail', readonly: true, disabled: true, required: false },
        { name: 'TechSupervisorEmployeeCode', readonly: true, disabled: true, required: false },
        { name: 'PassEmployeeCode', readonly: true, disabled: true, required: false },
        { name: 'PassBranchNumber', readonly: true, disabled: true, required: false }
    ];

    ngOnInit(): void {
        super.ngOnInit();
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.pageTitle = 'Contact Centre - Employee Contact Details';
        this.utils.setTitle(this.pageTitle);
        this.onLoad();
        this.loadValue();
    }

    private loadValue(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = this.search;
        let _formData: Object = {};
        _formData['ContractNumber'] = this.getControlValue('ContractNumber');
        _formData['AccountNumber'] = this.getControlValue('AccountNumber');
        _formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        _formData['TechEmployeeCode'] = this.getControlValue('TechEmployeeCode');
        _formData['Function'] = 'GetEmployeeContacts';
        if (this.ajaxSource)
            this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search, _formData)
            .subscribe(
            (e) => {
                this.setControlValue('ContractName', e.ContractName);
                this.setControlValue('NegBranch', e.NegBranch);
                this.setControlValue('NegEmail', e.NegEmail);
                this.setControlValue('NegBranchNumber', e.NegBranchNumber);
                this.setControlValue('NegEmployeeCode', e.NegEmployeeCode);
                this.setControlValue('NegEmployeeName', e.NegEmployeeName);
                this.setControlValue('NegMobilePhone', e.NegMobilePhone);
                this.setControlValue('NegPhone', e.NegPhone);
                this.setControlValue('NegPhone2', e.NegPhone2);
                this.setControlValue('NegSupervisorBranch', e.NegSupervisorBranch);
                this.setControlValue('NegSupervisorBranchNumber', e.NegSupervisorBranchNumber);
                this.setControlValue('NegSupervisorEmail', e.NegSupervisorEmail);
                this.setControlValue('NegSupervisorEmployeeCode', e.NegSupervisorEmployeeCode);
                this.setControlValue('NegSupervisorEmployeeName', e.NegSupervisorEmployeeName);
                this.setControlValue('NegSupervisorMobilePhone', e.NegSupervisorMobilePhone);
                this.setControlValue('NegSupervisorPhone', e.NegSupervisorPhone);
                this.setControlValue('NegSupervisorPhone2', e.NegSupervisorPhone2);
                this.setControlValue('PremiseName', e.PremiseName);
                this.setControlValue('SalesBranch', e.SalesBranch);
                this.setControlValue('SalesBranchNumber', e.SalesBranchNumber);
                this.setControlValue('SalesEmail', e.SalesEmail);
                this.setControlValue('SalesEmployeeCode', e.SalesEmployeeCode);
                this.setControlValue('SalesEmployeeName', e.SalesEmployeeName);
                this.setControlValue('SalesMobilePhone', e.SalesMobilePhone);
                this.setControlValue('SalesPhone', e.SalesPhone);
                this.setControlValue('SalesPhone2', e.SalesPhone2);
                this.setControlValue('SalesSupervisorBranch', e.SalesSupervisorBranch);
                this.setControlValue('SalesSupervisorBranchNumber', e.SalesSupervisorBranchNumber);
                this.setControlValue('SalesSupervisorEmail', e.SalesSupervisorEmail);
                this.setControlValue('SalesSupervisorEmployeeCode', e.SalesSupervisorEmployeeCode);
                this.setControlValue('SalesSupervisorEmployeeName', e.SalesSupervisorEmployeeName);
                this.setControlValue('SalesSupervisorMobilePhone', e.SalesSupervisorMobilePhone);
                this.setControlValue('SalesSupervisorPhone', e.SalesSupervisorPhone);
                this.setControlValue('SalesSupervisorPhone2', e.SalesSupervisorPhone2);
                this.setControlValue('TechBranch', e.TechBranch);
                this.setControlValue('TechBranchNumber', e.TechBranchNumber);
                this.setControlValue('TechEmail', e.TechEmail);
                // this.setControlValue('TechEmployeeCode', e.TechEmployeeCode);
                this.setControlValue('TechEmployeeName', e.TechEmployeeName);
                this.setControlValue('TechMobilePhone', e.TechMobilePhone);
                this.setControlValue('TechPhone', e.TechPhone);
                this.setControlValue('TechPhone2', e.TechPhone2);
                this.setControlValue('TechServiceAreaCode', e.TechServiceAreaCode);
                this.techServiceAreaDescList = e.TechServiceAreaDescList;
                this.techServiceAreaCodeList = e.TechServiceAreaCodeList;
                this.setControlValue('TechSupervisorBranch', e.TechSupervisorBranch);
                this.setControlValue('TechSupervisorBranchNumber', e.TechSupervisorBranchNumber);
                this.setControlValue('TechSupervisorEmail', e.TechSupervisorEmail);
                this.setControlValue('TechSupervisorEmployeeCode', e.TechSupervisorEmployeeCode);
                this.setControlValue('TechSupervisorEmployeeName', e.TechSupervisorEmployeeName);
                this.setControlValue('TechSupervisorMobilePhone', e.TechSupervisorMobilePhone);
                this.setControlValue('TechSupervisorPhone', e.TechSupervisorPhone);
                this.setControlValue('TechSupervisorPhone2', e.TechSupervisorPhone2);
                if (this.parentMode !== 'PassTechnician') {
                    this.setServicecoverDropdown();
                    this.ProductSelect_OnChange();
                }
                if (this.ajaxSource)
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error1) => {
                this.errorService.emitError(error1);
                if (this.ajaxSource)
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    private setServicecoverDropdown(): void {
        let techServiceAreaDescListArray: Array<any> = [];
        let techServiceAreaCodeListArray: Array<any> = [];
        techServiceAreaDescListArray = this.techServiceAreaDescList.split('\n');
        techServiceAreaCodeListArray = this.techServiceAreaCodeList.split('\n');
        for (let i = 0; i < techServiceAreaDescListArray.length; i++) {
            this.serviceCoverList.push({
                'text': techServiceAreaDescListArray[i],
                'value': techServiceAreaCodeListArray[i]
            });
        }
    }

    public onServiceCoverSelect(event: any): void {
        this.setControlValue('TechServiceAreaCode', event.target.value);
        this.ProductSelect_OnChange();
    }

    private ProductSelect_OnChange(): void {
        let cInfo = this.getControlValue('TechServiceAreaCode').split('^');
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = this.search;
        let _formData: Object = {};
        _formData['BranchNumber'] = cInfo[0];
        _formData['BranchServiceAreaCode'] = cInfo[1];
        _formData['Function'] = 'GetEmployeeByServiceArea';
        if (this.ajaxSource)
            this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search, _formData)
            .subscribe(
            (e) => {
                this.setControlValue('TechBranch', e.TechBranch);
                this.setControlValue('TechBranchNumber', e.TechBranchNumber);
                this.setControlValue('TechEmail', e.TechEmail);
                // this.setControlValue('TechEmployeeCode', e.TechEmployeeCode);
                this.setControlValue('TechEmployeeName', e.TechEmployeeName);
                this.setControlValue('TechMobilePhone', e.TechMobilePhone);
                this.setControlValue('TechPhone', e.TechPhone);
                this.setControlValue('TechPhone2', e.TechPhone2);
                this.setControlValue('TechServiceAreaCode', e.TechServiceAreaCode);
                this.setControlValue('TechServiceAreaCodeList', e.TechServiceAreaCodeList);
                this.setControlValue('TechServiceAreaDescList', e.TechServiceAreaDescList);
                this.setControlValue('TechSupervisorBranch', e.TechSupervisorBranch);
                this.setControlValue('TechSupervisorBranchNumber', e.TechSupervisorBranchNumber);
                this.setControlValue('TechSupervisorEmail', e.TechSupervisorEmail);
                this.setControlValue('TechSupervisorEmployeeCode', e.TechSupervisorEmployeeCode);
                this.setControlValue('TechSupervisorEmployeeName', e.TechSupervisorEmployeeName);
                this.setControlValue('TechSupervisorMobilePhone', e.TechSupervisorMobilePhone);
                this.setControlValue('TechSupervisorPhone', e.TechSupervisorPhone);
                this.setControlValue('TechSupervisorPhone2', e.TechSupervisorPhone2);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                if (this.ajaxSource)
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private onLoad(): void {

        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountProspectNumber', this.riExchange.getParentHTMLValue('AccountProspectNumber'));
        this.setControlValue('AccountProspectName', this.riExchange.getParentHTMLValue('AccountProspectName'));
        this.setControlValue('CurrentCallLogID', this.riExchange.getParentHTMLValue('CurrentCallLogID'));
        this.setControlValue('AccountProspectContactName', this.riExchange.getParentHTMLValue('AccountProspectContactName'));
        this.setControlValue('AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.lAllowProductSelection = true;
        switch (this.parentMode) {
            case 'PassTechnician':
                this.setControlValue('TechEmployeeCode', this.riExchange.getParentHTMLValue('TechEmployeeCode'));
                this.tdProductSelect = false;
                this.lAllowProductSelection = false;
                break;
            default:
                this.setControlValue('TechEmployeeCode', '');
                break;
        }
        this.setControlValue('DiaryProspectNumber', this.riExchange.getParentHTMLValue('DiaryProspectNumber'));
        if (this.getControlValue('DiaryProspectNumber') === '0') {
            this.setControlValue('DiaryProspectNumber', '');
        }

        if (this.getControlValue('ContractNumber') === '' || this.getControlValue('ContractNumber') === '0') {
            this.trContractNumber = false;
            this.tdNegEmployeeName = false;
            this.LabelNegEmployeeName = false;
            this.tdNegPhone = false;
            this.tdNegPhone2 = false;
            this.tdNegMobilePhone = false;
            this.tdNegEmail = false;
            this.tdNegBranch = false;
            this.tdDiary1 = false;
            this.tdBranch1 = false;
            this.tdSBranch1 = false;
            this.tdNegSupervisorEmployeeName = false;
            this.tdNegSupervisorPhone = false;
            this.tdNegSupervisorPhone2 = false;
            this.tdNegSupervisorMobilePhone = false;
            this.tdNegSupervisorEmail = false;
            this.tdNegSupervisorBranch = false;
        }

        if (this.getControlValue('PremiseNumber') === '' || this.getControlValue('PremiseNumber') === '0') {
            this.trPremiseNumber = false;
            this.tdProductSelect = false;
            this.lAllowProductSelection = false;
            this.tdSalesEmployeeName = false;
            this.LabelSalesEmployeeName = false;
            this.tdSalesPhone = false;
            this.tdSalesPhone2 = false;
            this.tdSalesMobilePhone = false;
            this.tdSalesEmail = false;
            this.tdSalesBranch = false;
            this.tdDiary2 = false;
            this.tdBranch2 = false;
            this.tdSBranch2 = false;
            this.tdSalesSupervisorEmployeeName = false;
            this.tdSalesSupervisorPhone = false;
            this.tdSalesSupervisorPhone2 = false;
            this.tdSalesSupervisorMobilePhone = false;
            this.tdSalesSupervisorEmail = false;
            this.tdSalesSupervisorBranch = false;

            if (this.getControlValue('TechEmployeeCode') === '') {
                this.tdTechEmployeeName = false;
                this.LabelTechEmployeeName = false;
                this.tdTechPhone = false;
                this.tdTechPhone2 = false;
                this.tdTechMobilePhone = false;
                this.tdTechEmail = false;
                this.tdTechBranch = false;
                this.tdDiary3 = false;
                this.tdBranch3 = false;
                this.tdSBranch3 = false;
                this.tdTechSupervisorEmployeeName = false;
                this.tdTechSupervisorPhone = false;
                this.tdTechSupervisorPhone2 = false;
                this.tdTechSupervisorMobilePhone = false;
                this.tdTechSupervisorEmail = false;
                this.tdTechSupervisorBranch = false;
            }
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCALLCENTREGRIDEMPLOYEEVIEW;

    }

    public cmdDiary1_onClick(): void {
        this.RunDiary(this.getControlValue('NegEmployeeCode'));
    }

    public cmdDiary2_onClick(): void {
        this.RunDiary(this.getControlValue('SalesEmployeeCode'));
    }

    public cmdDiary3_onClick(): void {
        this.RunDiary(this.getControlValue('TechEmployeeCode'));
    }

    public cmdBranch1_OnClick(): void {
        if (this.getControlValue('NegBranchNumber') !== '0' && this.getControlValue('NegBranchNumber') !== '' && this.getControlValue('NegBranchNumber') !== null) {
            this.RunBranchDetails(this.getControlValue('NegBranchNumber'));
        }
    }

    public cmdBranch2_OnClick(): void {
        if (this.getControlValue('SalesBranchNumber') !== '0' && this.getControlValue('SalesBranchNumber') !== '' && this.getControlValue('SalesBranchNumber') !== null) {
            this.RunBranchDetails(this.getControlValue('SalesBranchNumber'));
        }
    }

    public cmdBranch3_OnClick(): void {
        if (this.getControlValue('TechBranchNumber') !== '0' && this.getControlValue('TechBranchNumber') !== '' && this.getControlValue('TechBranchNumber') !== null) {
            this.RunBranchDetails(this.getControlValue('TechBranchNumber'));
        }
    }

    public cmdSBranch1_OnClick(): void {
        if (this.getControlValue('NegSupervisorBranchNumber') !== '0' && this.getControlValue('NegSupervisorBranchNumber') !== '' && this.getControlValue('NegSupervisorBranchNumber') !== null) {
            this.RunBranchDetails(this.getControlValue('NegSupervisorBranchNumber'));
        }
    }

    public cmdSBranch2_OnClick(): void {
        if (this.getControlValue('SalesSupervisorBranchNumber') !== '0' && this.getControlValue('SalesSupervisorBranchNumber') !== '' && this.getControlValue('SalesSupervisorBranchNumber') !== null) {
            this.RunBranchDetails(this.getControlValue('SalesSupervisorBranchNumber'));
        }
    }

    public cmdSBranch3_OnClick(): void {
        if (this.getControlValue('TechSupervisorBranchNumber') !== '0' && this.getControlValue('TechSupervisorBranchNumber') !== '' && this.getControlValue('TechSupervisorBranchNumber') !== null) {
            this.RunBranchDetails(this.getControlValue('TechSupervisorBranchNumber'));
        }
    }

    private RunDiary(PassEmployee: string): void {
        this.setControlValue('PassEmployeeCode', PassEmployee);
        this.navigate('CallCentre', '/prospecttocontract/maintenance/diary');
    }

    private RunBranchDetails(iPassBranchNumber: string): void {
        this.setControlValue('PassBranchNumber', iPassBranchNumber);
        this.navigate('CallCentre', InternalMaintenanceServiceModuleRoutes.ICABSCMEMPLOYEEVIEWBRANCHDETAILS);
    }
}
