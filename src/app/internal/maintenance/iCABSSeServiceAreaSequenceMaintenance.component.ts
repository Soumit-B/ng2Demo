import { Component, Injector, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { RiMaintenance, MntConst } from '../../../shared/services/riMaintenancehelper';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';

@Component({
    templateUrl: 'iCABSSeServiceAreaSequenceMaintenance.html'
})

export class ServiceAreaSequenceMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('NewBranchServiceAreaSeqNo') newBranchServiceAreaSeqNo;

    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc', type: MntConst.eTypeText },
        { name: 'ServiceCommenceDate', type: MntConst.eTypeDate },
        { name: 'ServiceVisitAnnivDate', type: MntConst.eTypeDate },
        { name: 'ServiceVisitFrequency', type: MntConst.eTypeInteger },
        { name: 'ServiceQuantity', type: MntConst.eTypeInteger },
        { name: 'ServiceAnnualValue', type: MntConst.eTypeCurrency },
        { name: 'BranchServiceAreaSeqNo', type: MntConst.eTypeInteger },
        { name: 'NewBranchServiceAreaSeqNo', type: MntConst.eTypeInteger },
        // Hidden field
        { name: 'BusinessCode' },
        { name: 'ServiceCoverROWID' }
    ];

    // URL Query Parameters
    public queryParams: any = {
        operation: 'Service/iCABSSeServiceAreaSequenceMaintenance',
        module: 'structure',
        method: 'service-planning/maintenance'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEAREASEQUENCEMAINTENANCE;

        this.browserTitle = 'Service Area Sequence Number Maintenance';
        this.pageTitle = 'Service Cover Details';
        this.pageParams.disableSave = false;
        this.pageParams.disableCancel = false;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.window_onload();
    }

    ngAfterViewInit(): void {
        this.newBranchServiceAreaSeqNo.nativeElement.focus();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // Initializes data into different controls on page load
    public window_onload(): void {
        if (this.parentMode === 'ServiceAreaSequence') {
            this.riMaintenance.RowID(this, 'ServiceCoverROWID', this.riExchange.getParentAttributeValue('ServiceCoverRowID'));
        }
        else if (this.parentMode === 'Verification') {
            this.riMaintenance.RowID(this, 'ServiceCoverROWID', this.riExchange.getParentAttributeValue('RowID'));
        }

        if (this.getControlValue('ServiceCoverROWID').length > 0) {
            this.fetchInitialRecord();
        }
        else {
            this.uiForm.disable();
            this.pageParams.disableSave = true;
            this.pageParams.disableCancel = true;
        }
    }

    // Populate data into the grid
    public fetchInitialRecord(): void {
        let search = this.getURLSearchParamObject();
        search.set('ROWID', this.getControlValue('ServiceCoverROWID'));
        search.set(this.serviceConstants.Action, '0');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('BusinessCode', data.BusinessCode);
                    this.setControlValue('ContractNumber', data.ContractNumber);
                    this.setControlValue('PremiseNumber', data.PremiseNumber);
                    this.setControlValue('ProductCode', data.ProductCode);
                    this.setControlValue('ServiceCommenceDate', data.ServiceCommenceDate);
                    this.setControlValue('ServiceVisitAnnivDate', data.ServiceVisitAnnivDate);
                    this.setControlValue('ServiceVisitFrequency', data.ServiceVisitFrequency);
                    this.setControlValue('ServiceQuantity', data.ServiceQuantity);
                    this.setControlValue('ServiceAnnualValue', data.ServiceAnnualValue);
                    this.setControlValue('BranchServiceAreaSeqNo', data.BranchServiceAreaSeqNo);
                    this.setControlValue('NewBranchServiceAreaSeqNo', data.BranchServiceAreaSeqNo);
                    this.buildAndCallLoopup();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Build and call loopup for multiple controls
    public buildAndCallLoopup(): void {
        this.riMaintenance.setIndependentVTableLookup(true);

        this.riMaintenance.AddTable('ServiceCover');

        this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddTableField('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'ReadOnly');
        this.riMaintenance.AddTableField('ContractName', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'ReadOnly');
        this.riMaintenance.AddTableField('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'ReadOnly');
        this.riMaintenance.AddTableField('PremiseName', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'ReadOnly');
        this.riMaintenance.AddTableField('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'ReadOnly');
        this.riMaintenance.AddTableField('ProductDesc', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'ReadOnly');
        this.riMaintenance.AddTableKeyAlignment('ProductCode', MntConst.eAlignmentRight);

        this.riMaintenance.AddTableField('ServiceCommenceDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServiceVisitAnnivDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServiceQuantity', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServiceVisitFrequency', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServiceAnnualValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('BranchServiceAreaSeqNo', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');

        this.riMaintenance.AddTableCommit(this);

        this.riMaintenance.AddVirtualTable('Contract');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('Premise');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeCodeNumeric, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('PremiseName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('Product');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ProductCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('ProductDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddTable('*');
        this.riMaintenance.AddTableField('NewBranchServiceAreaSeqNo', MntConst.eTypeInteger, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableCommit(this);

        this.riMaintenance.Complete();
        this.riMaintenance.UpdateMode();
    }

    // Form submit event
    public onSubmit(event: any): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.saveRecord.bind(this)));
        }
    }

    // Save record
    public saveRecord(): void {
        let formData: Object = {};
        let search = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '2');

        formData['ServiceCoverROWID'] = this.getControlValue('ServiceCoverROWID');
        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formData['ProductCode'] = this.getControlValue('ProductCode');
        formData['ServiceCommenceDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('ServiceCommenceDate'));
        formData['ServiceVisitAnnivDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('ServiceVisitAnnivDate'));
        formData['ServiceQuantity'] = this.getControlValue('ServiceQuantity');
        formData['ServiceVisitFrequency'] = this.getControlValue('ServiceVisitFrequency');
        formData['ServiceAnnualValue'] = this.globalize.parseCurrencyToFixedFormat(this.getControlValue('ServiceAnnualValue'));
        formData['BranchServiceAreaSeqNo'] = this.getControlValue('BranchServiceAreaSeqNo');
        formData['NewBranchServiceAreaSeqNo'] = this.getControlValue('NewBranchServiceAreaSeqNo');

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

    // Form cancel event
    public cancel_OnClick(event: any): void {
        this.formPristine();
        this.location.back();
    }
}
