import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/Rx';
import { HttpService } from './http-service';
import { ServiceConstants } from './../constants/service.constants';
import { GlobalConstant } from './../constants/global.constant';

@Injectable()
export class SpeedScript {
    private data: any;
    constructor(
        private serviceConstants: ServiceConstants,
        private xhr: HttpService
    ) {}

    /**
     * Method to get System Characters
     * @params: params: Object {module, operation, action, businessCode, countryCode, SysCharList}
     * @return: Observable
     */
    public sysChar(params: any): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        let search = new URLSearchParams();
        search.set(this.serviceConstants.Action, params.action); //TODO - Can this be hardcoded to 0
        search.set(this.serviceConstants.BusinessCode, params.businessCode);
        search.set(this.serviceConstants.CountryCode, params.countryCode);
        search.set('systemCharNumber', params.SysCharList);

        let xhrParams: any = {
            method: 'settings/data',
            module: params.module, //TODO - Is this required?
            operation: params.operation, //TODO - Is this required?
            search: search
        };

        this.xhr.makeGetRequest(
            xhrParams.method,
            xhrParams.module,
            xhrParams.operation,
            xhrParams.search
        ).subscribe(res => retObj.next(res));

        return retObj;
    }

    /**
     * Method to get System Characters
     * @params: params: Object {module, operation, action, businessCode, countryCode, SysCharList}
     * @return: Promise
     */
    public sysCharPromise(params: any): Promise<any> {
        let search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, params.businessCode);
        search.set(this.serviceConstants.CountryCode, params.countryCode);
        search.set('systemCharNumber', params.SysCharList);

        let xhrParams: any = {
            method: 'settings/data',
            module: '',
            operation: '',
            search: search
        };

        return this.xhr.xhrGet(
            xhrParams.method,
            xhrParams.module,
            xhrParams.operation,
            xhrParams.search
        );
    }

}
