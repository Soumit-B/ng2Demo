import { URLSearchParams } from '@angular/http';
import { Injectable, OnInit } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';
import { ReplaySubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { HttpService } from './http-service';
import { ServiceConstants } from '../constants/service.constants';
import { Utils } from './utility';
import { GlobalConstant } from './../constants/global.constant';

export interface LookUpData {
    table: string;
    query: any; // { key: value, key: value}
    fields: Array<string>;
}

@Injectable()
export class LookUp implements OnInit {

    constructor(
        private logger: Logger,
        private xhr: HttpService,
        private utils: Utils,
        private serviceConstants: ServiceConstants
    ) { }

    ngOnInit(): void {
        this.logger.log('LookUp Class initialized.');
    }

    /**
     * Method to get Lookup
     * @params: params:  Array<LookUpData>
     * @return: Observable
     */
    public lookUpRecord(params: Array<LookUpData>, maxRecords?: number, code?: Object): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        let maxresults = maxRecords ? maxRecords : 100;
        let data = params;

        let queryLookUp = new URLSearchParams();
        if (!code) {
            code = {
                'business': this.utils.getBusinessCode(),
                'country': this.utils.getCountryCode()
            };
        }
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        queryLookUp.set(this.serviceConstants.BusinessCode, code['business'] ? code['business'] : this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, code['country'] ? code['country'] : this.utils.getCountryCode());

        this.xhr.lookUpRequest(queryLookUp, data).subscribe(res => {
            let results = res.results;
            retObj.next(results);
        });

        return retObj;
    }

    /**
     * Method to get Lookup
     * @params: params:  Array<LookUpData>
     * @return: Promise
     */
    public lookUpPromise(params: Array<LookUpData>, maxRecords?: number, code?: Object): Promise<any> {
        let maxresults = maxRecords ? maxRecords : 100;
        let data = params;

        let queryLookUp = new URLSearchParams();
        if (!code) {
            code = {
                'business': this.utils.getBusinessCode(),
                'country': this.utils.getCountryCode()
            };
        }
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        queryLookUp.set(this.serviceConstants.BusinessCode, code['business'] ? code['business'] : this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, code['country'] ? code['country'] : this.utils.getCountryCode());

        return this.xhr.lookUpPromise(queryLookUp, data).then(data => {
            return data.results;
        });
    }

    /**
     * Returns a value from the BusinessRegistry table. If no value is found then blank is returned
     * @return: Promise
     */
    public i_GetBusinessRegistryValue(ipcBusinessCode: string, ipcRegSection: string, ipcRegKey: string, ipdtEffectiveDate?: any): Promise<any> {
        let lookupIP = [{
            'table': 'BusinessRegistry',
            'query': {
                'BusinessCode': ipcBusinessCode,
                'RegSection': ipcRegSection,
                'RegKey': ipcRegKey
                //'EffectiveDate': ipdtEffectiveDate,
            },
            'fields': ['BusinessCode', 'RegSection', 'RegKey', 'RegValue', 'EffectiveDate']
        }];
        //return this.lookUpPromise(lookupIP);
        return this.lookUpPromise(lookupIP).then(data => {
            let retData = '';
            if (data) {
                if (data.length > 0) {
                    if (data[0]) {
                        retData = data[0][0]['RegValue'];
                    }
                }
            }
            return retData;
        });
    }

    public GetRegistrySetting(pcRegSection: string, pcRegKey: string): Promise<any> {
        let cValue = '';
        let lookupIP = [{
            'table': 'riRegistry',
            'query': { 'RegSection': pcRegSection, 'RegKey': pcRegKey },
            'fields': ['RegValue']
        }];
        return this.lookUpPromise(lookupIP).then((data) => {
            console.log('GetRegistrySetting --- riRegistry', lookupIP, data);
            return data;
        });
    }
}
