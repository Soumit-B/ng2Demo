import { ModalAdvService } from './shared/components/modal-adv/modal-adv.service';
import { GlobalErrorHandler } from './shared/services/global-error.service';
import { PostCodeUtils } from './shared/services/postCode-utility';
import { CapitalizePipe } from './shared/pipes/capitalize';
import { ReplaceTextPipe } from './shared/pipes/replaceText';
import { ErrorHandler } from '@angular/core';
import { HttpService } from './shared/services/http-service';
import { AccessGuardService } from './shared/services/access-guard.service';
import { CanLoadService } from './shared/services/can-load.service';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, MissingTranslationHandler } from 'ng2-translate';
import { Store } from './app/reducers/index';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions, XHRBackend } from '@angular/http';
import { RouterModule, PreloadAllModules, Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { Ng2LoggerModule, Level } from '@nsalaun/ng2-logger';
import { SharedModule } from './shared/shared.module';
/*import { InternalMaintenanceModule } from './app/internal/maintenance.module';*/
import { InternalSearchModule } from './app/internal/search.module';
/*import { InternalGridSearchModule } from './app/internal/grid-search.module';*/
import { LoginComponent } from './app/login/login';
import { PostLoginComponent } from './app/login/post-login';
import { PageNotFoundComponent } from './app/page-not-found/404';
import { SetupComponent } from './app/setup/setup';
import { AppComponent } from './app.component';

import { LoginGuardService } from './app/login/login-guard.service';
import { AuthService } from './shared/services/auth.service';
import { HttpInterceptor } from './shared/services/http-interceptor.service';
import { UserAccessService } from './shared/services/user-access.service';
import { ErrorService } from './shared/services/error.service';
import { LocaleTranslationService } from './shared/services/translation.service';
import { MessageService } from './shared/services/message.service';
import { PageDataService } from './shared/services/page-data.service';
import { ComponentInteractionService } from './shared/services/component-interaction.service';
import { ICabsMissingTranslationHandler } from './shared/services/missing-translations.service';
import { GlobalConstant } from './shared/constants/global.constant';
import { ErrorConstant } from './shared/constants/error.constant';
import { ServiceConstants } from './shared/constants/service.constants';
import { AjaxObservableConstant } from './shared/constants/ajax-observable.constant';
import { SysCharConstants } from './shared/constants/syscharservice.constant';

import { GlobalizeService } from './shared/services/globalize.service';
import { SpeedScript } from './shared/services/speedscript';
import { RiExchange } from './shared/services/riExchange';
import { LookUp } from './shared/services/lookup';
import { Utils } from './shared/services/utility';
import { CustomPreloadingStrategy } from './shared/services/preloader';
import { SpeedScriptConstants } from './shared/constants/speed-script.constant';
import { CBBService } from './shared/services/cbb.service';
import { SubjectService } from './shared/services/subject.service';
import { VariableService } from './shared/services/variable.service';
import { RouteAwayGuardService } from './shared/services/route-away-guard.service';
import { RouteAwayGlobals } from './shared/services/route-away-global.service';
import { CBBConstants } from './shared/constants/cbb.constants';

export function createTranslateLoader(http: Http): any {
    return new TranslateStaticLoader(http, GlobalConstant.Configuration.LocaleUrl, '.json');
}

export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, router: Router): any {
    return new HttpInterceptor(xhrBackend, requestOptions, router);
}

let LOG_LEVEL = Level.LOG;
if (process.env.NODE_ENV !== 'DEV') {
    LOG_LEVEL = Level.ERROR;
}

if (process.env.NODE_ENV === 'PROD') {
    window['copyConsole'] = window['console'];
    if (window['console']) {
        window['console']['log'] = (arg?: any) => {
            //copyConsole.log(text);
        };
    }
};


@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        }),
        SharedModule.forRoot(),
        InternalSearchModule,
        ReactiveFormsModule,
        Ng2LoggerModule.forRoot(LOG_LEVEL),
        Store,
        RouterModule.forRoot([
            { path: 'application/login', component: LoginComponent, canActivate: [LoginGuardService] },
            { path: 'postlogin', component: PostLoginComponent },
            { path: 'billtocash', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/bill-to-cash/bill-to-cash.module#BillToCashModule?chunkName=bill-to-cash' },
            { path: 'contractmanagement/accountadmin', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/account-admin.module#AccountAdminModule?chunkName=account-admin' },
            { path: 'contractmanagement/accountmaintenance', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/account-maintenance.module#AccountMaintenanceModule?chunkName=account-maintenance' },
            { path: 'contractmanagement/areas', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/areas.module#AreasModule?chunkName=areas' },
            { path: 'contractmanagement/contractadmin', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/contract-admin.module#ContractAdminModule?chunkName=contract-admin' },
            { path: 'contractmanagement/customerinfo', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/customer-info.module#CustomerInfoModule?chunkName=customer-info' },
            { path: 'contractmanagement/general', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/general.module#GeneralModule?chunkName=general' },
            { path: 'contractmanagement/groupaccount', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/group-account.module#GroupAccountModule?chunkName=group-account' },
            { path: 'contractmanagement/premisesadmin', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/premises-admin.module#PremiseAdminModule?chunkName=premises-admin' },
            { path: 'contractmanagement/premisesmaintenance', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/premises-maintenance.module#PremiseMaintenanceModule?chunkName=premises-maintenance' },
            { path: 'contractmanagement/productadmin', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/product-admin.module#ProductAdminModule?chunkName=product-admin' },
            { path: 'contractmanagement/productsale', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/product-sale.module#ProductSaleModule?chunkName=product-sale' },
            { path: 'contractmanagement/reports', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/reports.module#ReportsModule?chunkName=reports' },
            { path: 'contractmanagement/retention', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/retention.module#RetentionModule?chunkName=retention' },
            { path: 'contractmanagement/servicecoveradmin', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/service-cover-admin.module#ServiceCoverAdminModule?chunkName=service-cover-admin' },
            { path: 'servicecovermaintenance', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/internal/service-cover-maintenance.module#ServiceCoverMaintenanceModule?chunkName=service-cover-maintenance' },
            { path: 'contractmanagement', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/contract-management/contract-management.module#ContractManagementModule?chunkName=contract-management' },
            { path: 'ccm', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/customer-contact-management/ccm.module#CCMModule?chunkName=ccm' },
            { path: 'extranetsorconnect', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/extranets-or-connect/extranets-or-connect.module#ExtranetsOrConnectModule?chunkName=extranets-or-connect' },
            { path: 'itfunctions', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/it-functions/it-functions.module#ITFunctionsModule?chunkName=it-functions' },
            { path: 'people', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/people/people.module#PeopleModule?chunkName=people' },
            { path: 'prospecttocontract', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/prospect-to-contract/prospect-to-contract.module#ProspectToContractModule?chunkName=prospect-to-contract' },
            { path: 'servicedelivery', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/service-delivery/service-delivery.module#ServiceDeliveryModule?chunkName=service-delivery' },
            { path: 'serviceplanning', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/service-planning/service-planning.module#ServicePlanningModule?chunkName=service-planning' },
            { path: 'application/setup', component: SetupComponent },
            { path: '', redirectTo: 'application/login', pathMatch: 'full' },
            /*{ path: 'grid', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/internal/grid-search.module#InternalGridSearchModule?chunkName=internal-grid' },*/
            { path: 'grid/sales', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/internal/grid-search-sales.module#InternalGridSearchSalesModule?chunkName=internal-grid-sales' },
            { path: 'grid/application', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/internal/grid-search-application.module#InternalGridSearchApplicationModule?chunkName=internal-grid-application' },
            { path: 'grid/service', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/internal/grid-search-service.module#InternalGridSearchServiceModule?chunkName=internal-grid-service' },
            /*{ path: '', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/internal/maintenance.module#InternalMaintenanceModule?chunkName=internal-maintenance' },*/
            { path: 'sales', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/internal/maintenance-sales.module#InternalMaintenanceSalesModule?chunkName=internal-maintenance-sales' },
            { path: 'application', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/internal/maintenance-application.module#InternalMaintenanceApplicationModule?chunkName=internal-maintenance-application' },
            { path: 'service', canActivate: [AccessGuardService], canLoad: [CanLoadService], loadChildren: './app/internal/maintenance-service.module#InternalMaintenanceServiceModule?chunkName=internal-maintenance-service' },
            { path: '404', component: PageNotFoundComponent },
            { path: '**', redirectTo: 'application/login', pathMatch: 'full' }

        ], { useHash: true /*preloadingStrategy: CustomPreloadingStrategy*/ })
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        PostLoginComponent,
        PageNotFoundComponent,
        SetupComponent
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ComponentsHelper, useClass: ComponentsHelper },
        { provide: MissingTranslationHandler, useClass: ICabsMissingTranslationHandler },
        { provide: Http, useFactory: httpFactory, deps: [XHRBackend, RequestOptions, Router] },
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        AccessGuardService,
        CanLoadService,
        RouteAwayGuardService,
        RouteAwayGlobals,
        HttpService,
        Title,
        ComponentInteractionService,
        GlobalizeService,
        AuthService,
        LoginGuardService,
        UserAccessService,
        ErrorService,
        SubjectService,
        LocaleTranslationService,
        GlobalConstant,
        ErrorConstant,
        AjaxObservableConstant,
        ServiceConstants,
        MessageService,
        PageDataService,
        CBBService,
        SysCharConstants,
        Utils,
        PostCodeUtils,
        LookUp,
        SpeedScript,
        RiExchange,
        VariableService,
        SpeedScriptConstants,
        CustomPreloadingStrategy,
        ModalAdvService
    ],
    entryComponents: [],
    bootstrap: [AppComponent]
})


export class AppModule { }
