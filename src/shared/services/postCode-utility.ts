import { AjaxObservableConstant } from './../constants/ajax-observable.constant';
import { Utils } from './utility';
import { SysCharConstants } from './../constants/syscharservice.constant';
import { LocalStorageService } from 'ng2-webstorage';
import { AuthService } from './auth.service';
import { ReplaySubject } from 'rxjs/Rx';
import { ServiceConstants } from './../constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { HttpService } from './http-service';
import { Injectable, OnInit, NgZone } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ErrorService } from './error.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SpeedScript } from './speedscript';
import { LookUp } from './lookup';
import { ErrorConstant } from '../../shared/constants/error.constant';
@Injectable()
export class PostCodeUtils implements OnInit {
    public querySysChar: URLSearchParams = new URLSearchParams();
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public errorMessage: string;
    public vExcludedBranches: string = '';
    public vEnablePostcodeDefaulting: boolean;
    public stringlist: any;
    public stringlistdata: any;
    constructor(
        private logger: Logger,
        private titleService: Title,
        private _ls: LocalStorageService,
        private authService: AuthService,
        private serviceConstants: ServiceConstants,
        private xhr: HttpService,
        private sysCharConstants: SysCharConstants,
        private utils: Utils,
        private errorService: ErrorService,
        private ajaxconstant: AjaxObservableConstant,
        private SpeedScript: SpeedScript,
        private LookUp: LookUp,
        private zone: NgZone
    ) { }

    ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
    }

    private emitError(error: any): void {
        this.logger.info('Emitting error');
    }
    /**
     * Get SysChar information
     * @return: vEnablePostcodeDefaulting
     */
    public PostCodeList(): Observable<any> {
        let retObjpostcode: ReplaySubject<any> = new ReplaySubject(1);
        let SYSTEMCHAR_EnablePostcodeDefaulting = this.sysCharConstants.SystemCharEnablePostcodeDefaulting.toString();
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, SYSTEMCHAR_EnablePostcodeDefaulting);
        this.xhr.sysCharRequest(this.querySysChar).subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                } else {
                    if (e) {

                        this.vEnablePostcodeDefaulting = e['records'][0].Required;
                        this.LookupExcludedBranches(this.vEnablePostcodeDefaulting).subscribe((data) => {
                            if (data.errorMessage) {
                                this.errorService.emitError(data);
                            } else {
                                if (data) {
                                    this.stringlistdata = data;
                                    retObjpostcode.next(this.stringlistdata);
                                } else {
                                    retObjpostcode.next('');
                                }
                            }
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                        },
                            (error) => {
                                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                                this.errorService.emitError(error);
                            });

                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.logger.log(' In error');
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
        return retObjpostcode;
    }

    public LookupExcludedBranches(vEnablePostcodeDefaulting: any): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        if (this.vEnablePostcodeDefaulting === true) {
            let lookupIP = [{
                'table': 'Branch',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'EnablePostCodeDefaulting': 'FALSE' },
                'fields': ['BranchNumber']
            }];
            this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
                if (data.errorMessage) {
                    this.errorService.emitError(data);
                } else {
                    if (data && data[0].length > 0) {
                        data.forEach(itemObj => {
                            itemObj.forEach(itemrow => {
                                this.vExcludedBranches = this.vExcludedBranches + ((this.vExcludedBranches === '') ? '' : ',') + itemrow['BranchNumber'];
                                this.stringlist = this.vExcludedBranches;
                                retObj.next(this.stringlist);
                            });
                        });
                    } else {
                        retObj.next('');
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    this.errorService.emitError(error);
                });
        } else {
            retObj.next('');
        }
        return retObj;
    }

}
