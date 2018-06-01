import { PageData } from './../../../shared/components/grid/grid-structure';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';

@Component({
    selector: 'icabs-business-company-search',
    template: `<icabs-dropdown #bcompanyDropDown
        [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [active]="active" (selectedValue)="onBCompanySearchReceived($event)">
    </icabs-dropdown>`
})

export class BCompanySearchComponent implements OnInit, OnChanges {
    @ViewChild('bcompanyDropDown') bcompanyDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Output() receivedCompanyCode = new EventEmitter();

    public search: URLSearchParams = new URLSearchParams();
    public displayFields: Array<string> = ['CompanyCode', 'CompanyDesc'];
    public requestdata: Array<any>;
    private errorMessage;

    constructor(
        private serviceConstants: ServiceConstants,
        private _httpService: HttpService,
        private _logger: Logger
    ) { }

    ngOnInit(): void {
        this.getData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.getData();
        }
    }

    private getData(): any {
        if (!this.inputParams.countryCode || !this.inputParams.businessCode) {
            return;
        }
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        if (this.inputParams.companyCode !== undefined &&
            this.inputParams.companyCode !== null) {
            this.search.set('CompanyCode', this.inputParams.companyCode);
        }
        if (this.inputParams.companyDesc !== undefined &&
            this.inputParams.companyDesc !== null) {
            this.search.set('CompanyDesc', this.inputParams.companyDesc);
        }
        let xhrParams = {
            module: 'structure',
            method: 'it-functions/search',
            operation: 'Business/iCABSBCompanySearch',
            search: this.search
        };
        this._httpService.makeGetRequest(
            xhrParams.method,
            xhrParams.module,
            xhrParams.operation,
            xhrParams.search
        ).subscribe(
            (data) => {
                this.requestdata = data.records;
                if (this.requestdata.length > 0 && this.active['id'] === '' && this.active['text'] === '') {
                    this.bcompanyDropDown.active['id'] = 1;
                    this.bcompanyDropDown.active['text'] = this.requestdata[0] && this.requestdata[0].CompanyDesc ? this.requestdata[0].APICode + ' - ' + this.requestdata[0].CompanyDesc : '';
                }
                this.bcompanyDropDown.updateComponent(this.requestdata);
            },
            error => {
                this.errorMessage = error as any;
            }
            );
    }

    public onBCompanySearchReceived(obj: any): any {
        let companyCode = obj.value.CompanyCode;
        let companyDesc = obj.value.CompanyDesc;
        let returnObj: any;
        switch (this.inputParams.parentMode) {
            case 'LookUp':
                returnObj = {
                    'CompanyCode': companyCode,
                    'CompanyDesc': companyDesc
                };
                break;
            case 'LookUp-ProRata-Original':
                returnObj = {
                    'OriginalCompanyCode': companyCode,
                    'OriginalCompanyDesc': companyDesc
                };
                break;
            case 'LookUp-ProRata-Produced':
                returnObj = {
                    'ProducedCompanyCode': companyCode,
                    'ProducedCompanyDesc': companyDesc
                };
                break;
            default:
                returnObj = {
                    'companyCode': companyCode,
                    'companyDesc': companyDesc
                };
        }
        this.receivedCompanyCode.emit(returnObj);
    }
}
