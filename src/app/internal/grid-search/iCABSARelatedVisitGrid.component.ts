import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { HttpService } from './../../../shared/services/http-service';
import { Utils } from './../../../shared/services/utility';

@Component({
    selector: 'icabs-related-vsit-grid',
    template: '<div>Page not covered in current sprint.</div>'
})
export class RelatedVisitGridComponent implements OnInit, OnDestroy {

    public ngOnInit(): void {
        //TODO
    }
    public ngOnDestroy(): void {
        //TODO
    }

}
