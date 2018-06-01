import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';


@Component({
    templateUrl: 'iCABSSePDAiCABSActivityMaintenance.html'
})

export class ActivityMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';

    public controls = [
        { name: 'EmployeeCode' },
        { name: 'EmployeeSurname' },
        { name: 'ActivityTypeCode' },
        { name: 'ActivityTypeDesc' },
        { name: 'ActivityStatusErrorMessage' },
        { name: 'OutcardNumber' },
        { name: 'WasteConsignmentNoteNumber' },
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'ItemDescription' },
        { name: 'ProductComponentRemoved' },
        { name: 'ProductComponentRemDesc' },
        { name: 'ProductComponentCode' },
        { name: 'ProductComponentDesc' },
        { name: 'ServicedQuantity' },
        { name: 'PlanVisitNumber' },
        { name: 'DeliveryNoteNumber' },
        { name: 'ActualStartTime' },
        { name: 'ActualEndTime' },
        { name: 'KeyedStartTime' },
        { name: 'KeyedEndTime' },
        { name: 'StandardDuration' },
        { name: 'OvertimeDuration' },
        { name: 'StartMileage' },
        { name: 'ManualVisitReasonCode' },
        { name: 'ManualVisitReasonDesc' },
        { name: 'NoPremiseVisitReasonCode' },
        { name: 'NoPremiseVisitReasonDesc' },
        { name: 'NoPremiseVisitManualCode' },
        { name: 'NoPremiseVisitManualDesc' },
        { name: 'NoServiceReasonCode' },
        { name: 'NoServiceReasonDesc' },
        { name: 'NoServiceManualCode' },
        { name: 'NoServiceManualDesc' },
        { name: 'ReasonNumber' },
        { name: 'ReasonDesc' },
        { name: 'PremiseContactSignature' },
        { name: 'PremiseContactName' },
        { name: 'VisitNote' },
        { name: 'OutcardPremiseContactName' },
        { name: 'OutcardAddressLine1' },
        { name: 'OutcardAddressLine2' },
        { name: 'OutcardAddressLine3' },
        { name: 'OutcardAddressLine4' },
        { name: 'OutcardAddressLine5' },
        { name: 'OutcardPremisePostcode' },
        { name: 'OutcardPhone' },
        { name: 'OutcardServiceTypeCode' },
        { name: 'ServiceTypeDesc' },
        { name: 'OutcardPrice' },
        { name: 'OutcardVisitFrequency' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPDAICABSACTIVITYMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

