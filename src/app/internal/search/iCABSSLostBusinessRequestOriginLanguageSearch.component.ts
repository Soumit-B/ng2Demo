import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs';

import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';

@Component({
    selector: 'icabs-lostbusiness-requestorigin-languagesearch',
    templateUrl: 'iCABSSLostBusinessRequestOriginLanguageSearch.html'
})

export class LostBusinessRequestOriginLanguageSearchComponent implements OnInit, OnDestroy {
    @ViewChild('customDropDown') public customDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: boolean = false;
    @Input() public active: any;
    @Input() public isRequired: boolean = true;
    @Output() receivedLanguageSearch: EventEmitter<any> = new EventEmitter();

    private errorMessage: any;
    private subFetchData: Subscription;

    public displayFields: Array<string> = ['LBRequestOriginLang.RequestOriginCode', 'LBRequestOriginLang.LBRequestOriginDesc'];

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils,
        private riExchange: RiExchange) {
    }

    ngOnInit(): void {
        this.fetchData();
    }

    ngOnDestroy(): void {
        if (this.subFetchData) {
            this.subFetchData.unsubscribe();
        }
    }

    /*
    *Get Dropdown Data On Load
    */
    public fetchData(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        let varLanguageCode: string = this.inputParams.params.LanguageCode;
        if (!varLanguageCode) {
            varLanguageCode = this.riExchange.LanguageCode();
        }
        search.set('LanguageCode', varLanguageCode);

        let xhr: any = {
            module: 'retention',
            method: 'ccm/search',
            operation: 'System/iCABSSLostBusinessRequestOriginLanguageSearch',
            search: search
        };

        this.subFetchData = this.httpService.makeGetRequest(xhr.method, xhr.module, xhr.operation, xhr.search).subscribe(data => {
            if (!data.records) { return; }
            this.customDropDown.updateComponent(data.records);
        }, error => {
            this.errorMessage = error as any;
        });
    }

    /*
    *Return Dropdown Data on Selection
    */
    public onDataReceived(obj: any): void {
        this.receivedLanguageSearch.emit(obj.value);
    }
}
