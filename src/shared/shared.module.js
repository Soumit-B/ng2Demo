import { ModalAdvComponent } from './components/modal-adv/modal-adv';
import { GridColumnComponent } from './components/grid-advanced/grid-cell';
import { GridAdvancedComponent } from './components/grid-advanced/grid-advanced';
import { FocusDirective } from './directives/focus';
import { CBBComponent } from './components/cbb/cbb';
import { OrderBy } from './pipes/orderBy';
import { CapitalizePipe } from './pipes/capitalize';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { Ng2Webstorage } from 'ng2-webstorage';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { AccordionModule } from 'ng2-bootstrap/ng2-bootstrap';
import { TabsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { PaginationModule } from 'ng2-bootstrap/ng2-bootstrap';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { SelectModule } from 'ng2-select/ng2-select';
import { TranslateModule } from 'ng2-translate';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { DatepickerComponent } from './components/datepicker/datepicker';
import { ModalComponent } from './components/modal/modal';
import { PromptModalComponent } from './components/prompt-modal/prompt-modal';
import { AccordionComponent } from './components/accordion/accordion';
import { TabsComponent } from './components/tabs/tabs';
import { SpinnerComponent } from './components/spinner/spinner';
import { PaginationComponent } from './components/pagination/pagination';
import { EllipsisComponent } from './components/ellipsis/ellipsis';
import { TableComponent } from './components/table/table';
import { DropdownComponent } from './components/dropdown/dropdown';
import { RefreshComponent } from './components/refresh/refresh';
import { GridComponent } from './components/grid/grid';
import { DropdownStaticComponent } from './components/dropdown-static/dropdownstatic';
import { DropdownStaticGroupedComponent } from './components/dropdown-static-grouped/dropdown-static-grouped';
import { AutocompleteComponent } from './components/autocomplete/autocomplete';
import { ConfirmOkComponent } from './components/confirm-ok/confirm-ok';
import { RouteAwayComponent } from './components/route-away/route-away';
import { ZeroPadDirective } from './directives/zeroPad';
import { CapitalFirstLtrDirective } from './directives/capitalFirstLtr';
export var SharedModule = (function () {
    function SharedModule() {
    }
    SharedModule.forRoot = function () {
        return {
            ngModule: SharedModule,
            providers: [
                OrderBy
            ]
        };
    };
    SharedModule.decorators = [
        { type: NgModule, args: [{
                    exports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        TranslateModule,
                        AccordionModule,
                        FooterComponent,
                        HeaderComponent,
                        DatepickerComponent,
                        ModalComponent,
                        PromptModalComponent,
                        AccordionComponent,
                        TabsComponent,
                        MainNavComponent,
                        SpinnerComponent,
                        PaginationComponent,
                        EllipsisComponent,
                        TableComponent,
                        DropdownComponent,
                        RefreshComponent,
                        GridComponent,
                        DropdownStaticGroupedComponent,
                        CBBComponent,
                        DropdownStaticComponent,
                        RouteAwayComponent,
                        CapitalizePipe,
                        OrderBy,
                        ConfirmOkComponent,
                        FocusDirective,
                        ZeroPadDirective,
                        CapitalFirstLtrDirective,
                        GridAdvancedComponent,
                        GridColumnComponent,
                        ModalAdvComponent
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        TranslateModule,
                        ReactiveFormsModule,
                        HttpModule,
                        JsonpModule,
                        Ng2Webstorage,
                        DatepickerModule,
                        ModalModule,
                        AccordionModule,
                        TabsModule,
                        RouterModule,
                        PaginationModule,
                        Ng2TableModule,
                        SelectModule
                    ],
                    declarations: [
                        FooterComponent,
                        HeaderComponent,
                        DatepickerComponent,
                        ModalComponent,
                        PromptModalComponent,
                        AccordionComponent,
                        TabsComponent,
                        MainNavComponent,
                        SpinnerComponent,
                        PaginationComponent,
                        EllipsisComponent,
                        TableComponent,
                        DropdownComponent,
                        RefreshComponent,
                        GridComponent,
                        DropdownStaticGroupedComponent,
                        CBBComponent,
                        DropdownStaticComponent,
                        RouteAwayComponent,
                        CapitalizePipe,
                        OrderBy,
                        AutocompleteComponent,
                        ConfirmOkComponent,
                        FocusDirective,
                        ZeroPadDirective,
                        CapitalFirstLtrDirective,
                        GridAdvancedComponent,
                        GridColumnComponent,
                        ModalAdvComponent
                    ],
                    entryComponents: [
                        RouteAwayComponent,
                        ConfirmOkComponent
                    ]
                },] },
    ];
    SharedModule.ctorParameters = [];
    return SharedModule;
}());
