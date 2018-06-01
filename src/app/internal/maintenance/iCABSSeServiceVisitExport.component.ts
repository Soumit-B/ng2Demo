import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSeServiceVisitExport.html'
})

export class ServiceVisitExportComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'SortBy' },
        { name: 'ShowVisitDate' },
        { name: 'ShowVisitType' },
        { name: 'ShowInfestation' },
        { name: 'ExcludeDeleted' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEVISITEXPORT;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Visit Export';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
