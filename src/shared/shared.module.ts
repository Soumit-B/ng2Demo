import { CustomDatepickerComponent } from './components/custom-datepicker/custom-datepicker';
import { ModalAdvComponent } from './components/modal-adv/modal-adv';
import { GridColumnComponent } from './components/grid-advanced/grid-cell';
import { GridAdvancedComponent } from './components/grid-advanced/grid-advanced';
import { FocusDirective } from './directives/focus';
import { CBBComponent } from './components/cbb/cbb';
import { OrderBy } from './pipes/orderBy';
import { CapitalizePipe } from './pipes/capitalize';
import { ReplaceTextPipe } from './pipes/replaceText';
import { NgModule, ModuleWithProviders } from '@angular/core';
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
import { RouteAwayGuardService } from './services/route-away-guard.service';
import { RouteAwayGlobals } from './services/route-away-global.service';
import { RouteAwayComponent } from './components/route-away/route-away';
import { ZeroPadDirective } from './directives/zeroPad';
import { CapitalFirstLtrDirective } from './directives/capitalFirstLtr';
import { IntegerDirective } from './directives/integer.directive';
import { DecimalType1Directive } from './directives/decimal-type-1.directive';
import { DecimalType2Directive } from './directives/decimal-type-2.directive';
import { DecimalType3Directive } from './directives/decimal-type-3.directive';
import { DecimalType4Directive } from './directives/decimal-type-4.directive';
import { DecimalType5Directive } from './directives/decimal-type-5.directive';
import { DecimalType6Directive } from './directives/decimal-type-6.directive';
import { CurrencyDirective } from './directives/currency.directive';
import { TimeDirective } from './directives/time.directive';
import { NumberDirective } from './directives/number.directive';
import { TextFreeDirective } from './directives/text-free.directive';
import { TextDirective } from './directives/text.directive';
import { CodeDirective } from './directives/code.directive';
import { DateDirective } from './directives/date.directive';
import { CommonDropdownComponent } from './components/common-dropdown/common-dropdown.component';

@NgModule({
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
        ReplaceTextPipe,
        OrderBy,
        ConfirmOkComponent,
        FocusDirective,
        ZeroPadDirective,
        CapitalFirstLtrDirective,
        GridAdvancedComponent,
        GridColumnComponent,
        ModalAdvComponent,
        CustomDatepickerComponent,
        IntegerDirective,
        DecimalType1Directive,
        DecimalType2Directive,
        DecimalType3Directive,
        DecimalType4Directive,
        DecimalType5Directive,
        DecimalType6Directive,
        CurrencyDirective,
        TimeDirective,
        NumberDirective,
        TextFreeDirective,
        TextDirective,
        CodeDirective,
        DateDirective,
        CommonDropdownComponent
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
        ReplaceTextPipe,
        OrderBy,
        AutocompleteComponent,
        ConfirmOkComponent,
        FocusDirective,
        ZeroPadDirective,
        CapitalFirstLtrDirective,
        GridAdvancedComponent,
        GridColumnComponent,
        ModalAdvComponent,
        CustomDatepickerComponent,
        IntegerDirective,
        DecimalType1Directive,
        DecimalType2Directive,
        DecimalType3Directive,
        DecimalType4Directive,
        DecimalType5Directive,
        DecimalType6Directive,
        CurrencyDirective,
        TimeDirective,
        NumberDirective,
        TextFreeDirective,
        TextDirective,
        CodeDirective,
        DateDirective,
        CommonDropdownComponent
    ],

    entryComponents: [
        RouteAwayComponent,
        ConfirmOkComponent
    ]
})

export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                /*RouteAwayGuardService, RouteAwayGlobals,*/ OrderBy
            ]
        };
    }
}
