import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtranetsOrConnectRootComponent } from './extranets-or-connect.component';

const routes: Routes = [
    {
        path: '', component: ExtranetsOrConnectRootComponent, children: [], data: { domain: 'EXTRANETS/CONNECT' }
    }
];

export const ExtranetsOrConnectRouteDefinitions: ModuleWithProviders = RouterModule.forChild(routes);
