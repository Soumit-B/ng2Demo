import { Component, OnInit, Injector, ViewChild, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ContractSearchComponent } from './../search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../search/iCABSAPremiseSearch';


@Component({
    templateUrl: 'iCABSAPremiseSuspendMaintenance.html'
})

export class PremiseSuspendMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('contractNumberEllipsis') contractNumberEllipsis: EllipsisComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    // URL Query Parameters
    private queryParams: Object = {
        operation: 'Application/iCABSAPremiseSuspendMaintenance',
        module: 'suspension',
        method: 'people/maintenance'
    };
    private InvoiceSuspendText: string;
    public pageId: string = '';
    public controls: Array<Object> = [
        { name: 'ContractNumber', required: true, type: MntConst.eTypeCode },
        { name: 'ContractName', disabled: true },
        { name: 'PremiseNumber', disabled: true, required: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseROWID' },
        { name: 'Status', disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseAddressLine1', disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseAddressLine2', disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseAddressLine3', disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseAddressLine4', disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseAddressLine5', disabled: true, type: MntConst.eTypeText },
        { name: 'PremisePostcode', disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseAnnualValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'PremiseCommenceDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'InvoiceSuspendInd', disabled: true, type: MntConst.eTypeCheckBox },
        { name: 'InvoiceSuspendText', disabled: true, type: MntConst.eTypeText }
    ];
    public setFocusOnPremiseNumber = new EventEmitter<boolean>();
    public numberLabel: string;
    public isButtonsDisabled: boolean = true;
    // inputParams for Ellipsis
    public ellipsis: any = {
        contract: {
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp',
                ContractNumber: '',
                ContractName: '',
                showAddNew: false,
                currentContractType: ''
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
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'Search',
                ContractNumber: '',
                ContractName: '',
                PremiseNumber: '',
                PremiseName: '',
                showAddNew: false,
                CurrentContractType: ''
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
        this.pageId = PageIdentifier.ICABSAPREMISESUSPENDMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngAfterViewInit(): void {
        this.setTitle();
        this.windowOnLoad();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private setTitle(): void {
        this.pageTitle = this.riExchange.getCurrentContractTypeLabel() + ' Premises Invoice Suspend Maintenance';
        this.numberLabel = this.riExchange.getCurrentContractTypeLabel() + ' Number';
        this.utils.setTitle(this.pageTitle);
    }

    private windowOnLoad(): void {
        this.isButtonsDisabled = true;
        this.disableControl('ContractNumber', false);
        this.disableControl('PremiseNumber', true);
        this.disableControl('InvoiceSuspendInd', true);
        this.disableControl('InvoiceSuspendText', true);
        this.setControlValue('InvoiceSuspendText', '');
        this.ellipsis.contract.childConfigParams.currentContractType = this.riExchange.getCurrentContractType();
        this.ellipsis.premise.childConfigParams.CurrentContractType = this.ellipsis.contract.childConfigParams.currentContractType;
        if (!this.getControlValue('ContractNumber')) {
            this.contractNumberEllipsis.openModal();
        }
    }


    //On changing of Contract number
    public onContractChange(): void {
        this.uiForm.controls['ContractNumber'].markAsPristine();
        if (!this.getControlValue('ContractNumber')) {
            this.uiForm.reset();
            this.disableControl('InvoiceSuspendText', true);
        }
        else
            this.fetchContractRecord();
    }

    //On changing of Premise number
    public onPremiseChange(): void {
        this.uiForm.controls['PremiseNumber'].markAsPristine();
        if (!this.getControlValue('PremiseNumber'))
            this.disableControl('InvoiceSuspendText', true);
        else
            this.fetchPremiseRecord();
    }

    //On clicking of Checkbox value
    public checkAddress(): void {
        if (this.getControlValue('InvoiceSuspendInd'))
            this.disableControl('InvoiceSuspendText', false);
        else {
            this.disableControl('InvoiceSuspendText', true);
            this.setControlValue('InvoiceSuspendText', '');
        }
    }

    private fetchContractRecord(): void {
        let searchParams;
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        searchParams.set('Mode', 'GetContract');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.fetchContractType();
                    this.setControlValue('ContractName', data.ContractName);
                    this.disableControl('PremiseNumber', false);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    private fetchContractType(): void {
        let searchParams;
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '6');
        searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        searchParams.set('ContractTypeCode', this.riExchange.getCurrentContractType());
        let bodyParams: any = {};
        bodyParams['Function'] = 'CheckContractType';
        this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.openPremiseSearch();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

    private fetchPremiseRecord(): void {
        let searchParams;
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        searchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        searchParams.set('Mode', 'GetPremise');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.setControlValue('PremiseName', data.PremiseName);
                    this.setControlValue('PremiseROWID', data.ttPremise);
                    this.setControlValue('PremiseAddressLine1', data.PremiseAddressLine1);
                    this.setControlValue('PremiseAddressLine2', data.PremiseAddressLine2);
                    this.setControlValue('PremiseAddressLine3', data.PremiseAddressLine3);
                    this.setControlValue('PremiseAddressLine4', data.PremiseAddressLine4);
                    this.setControlValue('PremiseAddressLine5', data.PremiseAddressLine5);
                    this.setControlValue('PremisePostcode', data.PremisePostcode);
                    let PremiseCommenceDate = this.globalize.parseDateToFixedFormat(data.PremiseCommenceDate).toString();
                    this.setControlValue('PremiseCommenceDate', this.globalize.parseDateStringToDate(PremiseCommenceDate));
                    this.setControlValue('InvoiceSuspendInd', data.InvoiceSuspendInd);
                    this.setControlValue('InvoiceSuspendText', data.InvoiceSuspendText);
                    this.InvoiceSuspendText = data.InvoiceSuspendText;
                    this.checkAddress();
                    this.getStatus();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    private getStatus(): void {
        let searchParams;
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '6');
        searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        searchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        let bodyParams: any = {};
        bodyParams['Function'] = 'GetStatus';
        this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.setControlValue('Status', data.Status);
                    this.setControlValue('PremiseAnnualValue', data.PremiseAnnualValue);
                    this.disableControl('ContractNumber', true);
                    this.disableControl('PremiseNumber', true);
                    this.disableControl('InvoiceSuspendInd', false);
                    this.isButtonsDisabled = false;
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

    public getModalinfo(): void {
        this.ellipsis.contract.autoOpen = false;
        this.ellipsis.premise.autoOpen = false;
    }

    private openPremiseSearch(): void {
        this.setFocusOnPremiseNumber.emit(true);
        this.disableControl('PremiseNumber', false);
        this.ellipsis.contract.childConfigParams.currentContractType = this.riExchange.getCurrentContractType();
        this.ellipsis.premise.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premise.childConfigParams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.premise.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.ellipsis.premise.childConfigParams.PremiseName = this.getControlValue('PremiseName');
        this.ellipsis.premise.childConfigParams.CurrentContractType = this.ellipsis.contract.childConfigParams.currentContractType;
    }

    //getting contract number from ellipsis
    public onContractDataReceived(data: any): void {
        if (data) {
            this.setControlValue('ContractNumber', data.ContractNumber);
            this.fetchContractRecord();
        }
    }

    //getting premise number from ellipsis
    public onPremisetDataReceived(data: any): void {
        if (data) {
            this.setControlValue('PremiseNumber', data.PremiseNumber);
            this.fetchPremiseRecord();
        }
    }

    // Clicking on Save button
    public onClickSave(): void {
        if (this.riExchange.validateForm(this.uiForm))
            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, '', this.promptConfirmSave.bind(this)));
    }

    // Clicking on Cancel button
    public onClickCancel(): void {
        if (this.getControlValue('ContractNumber'))
            this.fetchPremiseRecord();
    }

    // Confirming the records to be saved
    public promptConfirmSave(): void {
        let searchParams;
        searchParams = this.getURLSearchParamObject();
        let formdata: any;
        formdata = {
            BusinessCode: this.businessCode(),
            PremiseROWID: this.getControlValue('PremiseROWID'),
            ContractNumber: this.getControlValue('ContractNumber'),
            PremiseNumber: this.getControlValue('PremiseNumber'),
            PremiseName: this.getControlValue('PremiseName'),
            PremiseAddressLine1: this.getControlValue('PremiseAddressLine1'),
            PremiseAddressLine2: this.getControlValue('PremiseAddressLine2'),
            PremiseAddressLine3: this.getControlValue('PremiseAddressLine3'),
            PremiseAddressLine4: this.getControlValue('PremiseAddressLine4'),
            PremiseAddressLine5: this.getControlValue('PremiseAddressLine5'),
            PremisePostcode: this.getControlValue('PremisePostcode'),
            PremiseAnnualValue: this.getControlValue('PremiseAnnualValue'),
            PremiseCommenceDate: this.getControlValue('PremiseCommenceDate'),
            InvoiceSuspendInd: this.utils.convertCheckboxValueToRequestValue(this.getControlValue('InvoiceSuspendInd')),
            InvoiceSuspendText: this.getControlValue('InvoiceSuspendText')
        };
        searchParams.set(this.serviceConstants.Action, '2');
        formdata['Function'] = 'GetStatus';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams, formdata).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.formPristine();
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

}
