import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSBServiceAreaMap.html'
})

export class ServiceAreaMapComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'BranchNumber' },
        { name: 'BranchName' },
        { name: 'LindaButhelezi' },
        { name: 'sifficodummy' },
        { name: 'dummyremoval' },
        { name: 'Remegremoval' },
        { name: 'WaterMandella' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBSERVICEAREAMAP;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Area Map';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
