import { NgModule, ModuleWithProviders } from '@angular/core';

import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { RouteAwayGlobals } from '../../shared/services/route-away-global.service';
/*import { InternalMaintenanceModule } from '../internal/maintenance.module';
import { InternalGridSearchModule } from '../internal/grid-search.module';*/
import { InternalSearchModule } from '../internal/search.module';

import { ProspectToContractRootComponent } from './prospect-to-contract.component';
import { ProspectGridComponent } from './ProspectAndDiaryMaintenance/iCABSCMProspectGrid';
import { ProspectMaintenanceComponent } from './ProspectAndDiaryMaintenance/iCABSCMPipelineProspectMaintenance';
import { MaintenanceTypeGeneralComponent } from './ProspectAndDiaryMaintenance/tabs/maintenanceTypeGeneral';
import { MaintenanceTypePremiseComponent } from './ProspectAndDiaryMaintenance/tabs/maintenanceTypePremise';
import { MaintenanceTypeAccountComponent } from './ProspectAndDiaryMaintenance/tabs/maintenanceTypeAccount';
import { BusinessOriginMaintenanceComponent } from './TableMaintenanceBusiness/BusinessOrigin/iCABSBBusinessOriginMaintenance.component';
import { PipelineGridComponent } from './SalesOrderProcessing/iCABSSPipelineGrid.component';

import { ProspectToContractRouteDefinitions } from './prospect-to-contract.route';
import { CMProspectBulkImportComponent } from './ProspectAndDiaryMaintenance/iCABSCMProspectBulkImport.component';
import { ProspectEntryGridComponent } from './ProspectAndDiaryMaintenance/iCABSCMProspectEntryGrid';
import { ProspectToContractModuleRoutes } from './../base/PageRoutes';
import { DiaryMaintenanceComponent } from './ProspectAndDiaryMaintenance/iCABSCMDiaryMaintenance.component';
import { DiaryDayMaintenanceComponent } from './ProspectAndDiaryMaintenance/DiaryDay/iCABSCMDiaryDayMaintenance.component';
import { LostBusinessDetailGridComponent } from './TableMaintenanceBusiness/BusinessOrigin/iCABSBLostBusinessDetailGrid.component';
@NgModule({
    exports: [

        CMProspectBulkImportComponent,
        DiaryMaintenanceComponent
    ],
    imports: [
        HttpModule,
        SharedModule,
        InternalSearchModule,
        ProspectToContractRouteDefinitions
    ],
    declarations: [
        ProspectToContractRootComponent,
        ProspectGridComponent,
        ProspectMaintenanceComponent,
        MaintenanceTypeGeneralComponent,
        MaintenanceTypePremiseComponent,
        MaintenanceTypeAccountComponent,
        CMProspectBulkImportComponent,
        ProspectEntryGridComponent,
        BusinessOriginMaintenanceComponent,
        PipelineGridComponent,
        DiaryMaintenanceComponent,
        DiaryDayMaintenanceComponent,
        LostBusinessDetailGridComponent
    ],
    entryComponents: [
        ProspectToContractRootComponent,
        ProspectGridComponent,
        ProspectMaintenanceComponent,
        MaintenanceTypeGeneralComponent,
        MaintenanceTypePremiseComponent,
        MaintenanceTypeAccountComponent,
        CMProspectBulkImportComponent,
        ProspectEntryGridComponent,
        BusinessOriginMaintenanceComponent,
        PipelineGridComponent,
        DiaryMaintenanceComponent,
        LostBusinessDetailGridComponent
    ]

})

export class ProspectToContractModule { }
