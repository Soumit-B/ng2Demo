import { ProspectToContractModuleRoutes } from './../base/PageRoutes';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProspectToContractRootComponent } from './prospect-to-contract.component';
import { ProspectGridComponent } from './ProspectAndDiaryMaintenance/iCABSCMProspectGrid';
import { ProspectMaintenanceComponent } from './ProspectAndDiaryMaintenance/iCABSCMPipelineProspectMaintenance';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { CMProspectBulkImportComponent } from './ProspectAndDiaryMaintenance/iCABSCMProspectBulkImport.component';
import { ProspectEntryGridComponent } from './ProspectAndDiaryMaintenance/iCABSCMProspectEntryGrid';
import { BusinessOriginMaintenanceComponent } from './TableMaintenanceBusiness/BusinessOrigin/iCABSBBusinessOriginMaintenance.component';
import { PipelineGridComponent } from './SalesOrderProcessing/iCABSSPipelineGrid.component';
import { DiaryMaintenanceComponent } from './ProspectAndDiaryMaintenance/iCABSCMDiaryMaintenance.component';
import { DiaryDayMaintenanceComponent } from './ProspectAndDiaryMaintenance/DiaryDay/iCABSCMDiaryDayMaintenance.component';
import { LostBusinessDetailGridComponent } from './TableMaintenanceBusiness/BusinessOrigin/iCABSBLostBusinessDetailGrid.component';
const routes: Routes = [
    {
        path: '', component: ProspectToContractRootComponent, children: [
            { path: ProspectToContractModuleRoutes.ICABSCMPROSPECTGRID, component: ProspectGridComponent },
            { path: 'application/CMProspectBulkImport', component: CMProspectBulkImportComponent },
            { path: ProspectToContractModuleRoutes.ICABSCMPROSPECTENTRYGRID, component: ProspectEntryGridComponent },
            { path: ProspectToContractModuleRoutes.ICABSBBUSINESSORIGINMAINTENANCE, component: BusinessOriginMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
            { path: 'SalesOrderProcessing/PipelineGrid', component: PipelineGridComponent },
            { path: ProspectToContractModuleRoutes.ICABSCMDIARYMAINTENANCE, component: DiaryMaintenanceComponent },
            { path: ProspectToContractModuleRoutes.ICABSCMDIARYDAYMAINTENANCE, component: DiaryDayMaintenanceComponent },
            { path: ProspectToContractModuleRoutes.ICABSCMDIARYMAINTENANCE, component: DiaryMaintenanceComponent },
            { path: ProspectToContractModuleRoutes.ICABSCMPIPELINEPROSPECTMAINTENANCE, component: ProspectMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
            { path: 'SalesOrderProcessing/PipelineGrid', component: PipelineGridComponent },
            { path: ProspectToContractModuleRoutes.ICABSBLOSTBUSINESSDETAILGRID, component: LostBusinessDetailGridComponent }
        ], data: { domain: 'PROSPECT TO CONTRACT' }
    }
];

export const ProspectToContractRouteDefinitions: ModuleWithProviders = RouterModule.forChild(routes);
