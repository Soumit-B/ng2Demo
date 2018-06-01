import { RouterModule } from '@angular/router';
import { ExtranetsOrConnectRootComponent } from './extranets-or-connect.component';
var routes = [
    {
        path: '', component: ExtranetsOrConnectRootComponent, children: [], data: { domain: 'EXTRANETS/CONNECT' }
    }
];
export var ExtranetsOrConnectRouteDefinitions = RouterModule.forChild(routes);
