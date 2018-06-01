import { ModalAdvService } from './shared/components/modal-adv/modal-adv.service';
import { GlobalErrorHandler } from './shared/services/global-error.service';
import { PostCodeUtils } from './shared/services/postCode-utility';
import { ErrorHandler } from '@angular/core';
import { HttpService } from './shared/services/http-service';
import { AccessGuardService } from './shared/services/access-guard.service';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, MissingTranslationHandler } from 'ng2-translate';
import { Store } from './app/reducers/index';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions, XHRBackend } from '@angular/http';
import { RouterModule, Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { Ng2LoggerModule, Level } from '@nsalaun/ng2-logger';
import { SharedModule } from './shared/shared.module';
import { InternalSearchModule } from './app/internal/search.module';
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
export function createTranslateLoader(http) {
    return new TranslateStaticLoader(http, GlobalConstant.Configuration.LocaleUrl, '.json');
}
export function httpFactory(xhrBackend, requestOptions, router) {
    return new HttpInterceptor(xhrBackend, requestOptions, router);
}
var LOG_LEVEL = Level.LOG;
if (process.env.NODE_ENV !== 'DEV') {
    LOG_LEVEL = Level.ERROR;
}
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule.decorators = [
        { type: NgModule, args: [{
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
                            { path: 'billtocash', canActivate: [AccessGuardService], loadChildren: './app/bill-to-cash/bill-to-cash.module#BillToCashModule' },
                            { path: 'contractmanagement/accountadmin', canActivate: [AccessGuardService], loadChildren: './app/contract-management/account-admin.module#AccountAdminModule' },
                            { path: 'contractmanagement/accountmaintenance', canActivate: [AccessGuardService], loadChildren: './app/contract-management/account-maintenance.module#AccountMaintenanceModule' },
                            { path: 'contractmanagement/areas', canActivate: [AccessGuardService], loadChildren: './app/contract-management/areas.module#AreasModule' },
                            { path: 'contractmanagement/contractadmin', canActivate: [AccessGuardService], loadChildren: './app/contract-management/contract-admin.module#ContractAdminModule' },
                            { path: 'contractmanagement/customerinfo', canActivate: [AccessGuardService], loadChildren: './app/contract-management/customer-info.module#CustomerInfoModule' },
                            { path: 'contractmanagement/general', canActivate: [AccessGuardService], loadChildren: './app/contract-management/general.module#GeneralModule' },
                            { path: 'contractmanagement/groupaccount', canActivate: [AccessGuardService], loadChildren: './app/contract-management/group-account.module#GroupAccountModule' },
                            { path: 'contractmanagement/premisesadmin', canActivate: [AccessGuardService], loadChildren: './app/contract-management/premises-admin.module#PremiseAdminModule' },
                            { path: 'contractmanagement/premisesmaintenance', canActivate: [AccessGuardService], loadChildren: './app/contract-management/premises-maintenance.module#PremiseMaintenanceModule' },
                            { path: 'contractmanagement/productadmin', canActivate: [AccessGuardService], loadChildren: './app/contract-management/product-admin.module#ProductAdminModule' },
                            { path: 'contractmanagement/productsale', canActivate: [AccessGuardService], loadChildren: './app/contract-management/product-sale.module#ProductSaleModule' },
                            { path: 'contractmanagement/reports', canActivate: [AccessGuardService], loadChildren: './app/contract-management/reports.module#ReportsModule' },
                            { path: 'contractmanagement/retention', canActivate: [AccessGuardService], loadChildren: './app/contract-management/retention.module#RetentionModule' },
                            { path: 'contractmanagement/servicecoveradmin', canActivate: [AccessGuardService], loadChildren: './app/contract-management/service-cover-admin.module#ServiceCoverAdminModule' },
                            { path: 'servicecovermaintenance', canActivate: [AccessGuardService], loadChildren: './app/internal/service-cover-maintenance.module#ServiceCoverMaintenanceModule' },
                            { path: 'contractmanagement', canActivate: [AccessGuardService], loadChildren: './app/contract-management/contract-management.module#ContractManagementModule' },
                            { path: 'ccm', canActivate: [AccessGuardService], loadChildren: './app/customer-contact-management/ccm.module#CCMModule' },
                            { path: 'extranetsorconnect', canActivate: [AccessGuardService], loadChildren: './app/extranets-or-connect/extranets-or-connect.module#ExtranetsOrConnectModule' },
                            { path: 'itfunctions', canActivate: [AccessGuardService], loadChildren: './app/it-functions/it-functions.module#ITFunctionsModule' },
                            { path: 'people', canActivate: [AccessGuardService], loadChildren: './app/people/people.module#PeopleModule' },
                            { path: 'prospecttocontract', canActivate: [AccessGuardService], loadChildren: './app/prospect-to-contract/prospect-to-contract.module#ProspectToContractModule' },
                            { path: 'servicedelivery', canActivate: [AccessGuardService], loadChildren: './app/service-delivery/service-delivery.module#ServiceDeliveryModule' },
                            { path: 'serviceplanning', canActivate: [AccessGuardService], loadChildren: './app/service-planning/service-planning.module#ServicePlanningModule' },
                            { path: 'application/setup', component: SetupComponent },
                            { path: '', redirectTo: 'application/login', pathMatch: 'full' },
                            { path: 'grid', canActivate: [AccessGuardService], loadChildren: './app/internal/grid-search.module#InternalGridSearchModule?chunkName=internal-grid' },
                            { path: '', canActivate: [AccessGuardService], loadChildren: './app/internal/maintenance.module#InternalMaintenanceModule?chunkName=internal-maintenance' },
                            { path: '404', component: PageNotFoundComponent },
                            { path: '**', redirectTo: 'application/login', pathMatch: 'full' }
                        ], { useHash: true })
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
                        RouteAwayGuardService,
                        RouteAwayGlobals,
                        HttpService,
                        Title,
                        ComponentInteractionService,
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
                },] },
    ];
    AppModule.ctorParameters = [];
    return AppModule;
}());
