import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { ExtranetsOrConnectRootComponent } from './extranets-or-connect.component';
import { ExtranetsOrConnectRouteDefinitions } from './extranets-or-connect.route';
export var ExtranetsOrConnectModule = (function () {
    function ExtranetsOrConnectModule() {
    }
    ExtranetsOrConnectModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpModule,
                        SharedModule,
                        InternalSearchModule,
                        ExtranetsOrConnectRouteDefinitions
                    ],
                    declarations: [
                        ExtranetsOrConnectRootComponent
                    ]
                },] },
    ];
    ExtranetsOrConnectModule.ctorParameters = [];
    return ExtranetsOrConnectModule;
}());
