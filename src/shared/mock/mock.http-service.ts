import { AuthService } from '../services/auth.service';
import { ServiceConstants } from './../constants/service.constants';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { ErrorService } from '../services/error.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { HttpService } from '../services/http-service';

export class MockHttpService extends HttpService {
    public testVar: any;
    public getData(url: string, options: any): any {
        return true;
    }

    public setUrl(url: any): any {
       return true;
    }

    public clearUrl(): any {
        return true;
    }

    public makePostRequest(method: string, moduleAPI: string,
        operation: string, search: URLSearchParams, form_data: Object): any {
            return true;
    }
    public makeGetRequest(method: string, moduleAPI: string,
        operation: string, search: URLSearchParams): any { console.log();}
}

