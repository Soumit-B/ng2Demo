import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';

@Component({
    templateUrl: 'riMGTranslationMaintenance.html'
})

export class TranslationMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'LanguageCode' },
        { name: 'View' },
        { name: 'LanguageDescription' },
        { name: 'FilterTranslationLanguageValue' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.RIMGTRANSLATIONMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Translations';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
