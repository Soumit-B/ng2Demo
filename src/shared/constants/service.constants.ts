import { Injectable } from '@angular/core';

@Injectable()
export class ServiceConstants {

    public Authorization: string;
    public Operation: string;
    public Module: string;
    public Search: string;
    public email: string;
    public Action: string;
    public MethodType: string;
    public Method: any;
    public BusinessCode: string;
    public CountryCode: string;
    public PageSize: string;
    public PageCurrent: string;
    public ServiceBranchNumber: string;
    public ContentType: string;
    public GridMode: string;
    public GridName: string;
    public GridHandle: string;
    public GridCacheRefresh: string;
    public GridSortOrder: string;
    public GridHeaderClickedColumn: string;
    public GridPageSize: string;
    public GridPageCurrent: string;
    public MaxResults: string;
    public SystemCharNumber: string;
    public AccountNumber: string;
    public Function: string;
    public PremiseNumber: string;
    public ContractNumber: string;
    public ProductCode: string;
    public ActionType: string;
    public LanguageCode: string;
    public TaxCode: string;
    constructor() {
        this.Authorization = 'Authorization';
        this.Operation = 'Operation';
        this.Module = 'Module';
        this.email = 'email';
        this.Action = 'action';
        this.MethodType = 'methodType';
        this.Search = 'search';
        this.BusinessCode = 'businessCode';
        this.CountryCode = 'countryCode';
        this.PageSize = 'PageSize';
        this.PageCurrent = 'PageCurrent';
        this.ContentType = 'Content-Type';
        this.Method = {
            'Maintenance': 'maintenance',
            'Grid': 'grid'
        };
        this.ServiceBranchNumber = 'ServiceBranchNumber';
        this.GridName = 'GridName';
        this.GridMode = 'riGridMode';
        this.GridHandle = 'riGridHandle';
        this.GridCacheRefresh = 'riCacheRefresh';
        this.GridSortOrder = 'riSortOrder';
        this.GridHeaderClickedColumn = 'HeaderClickedColumn';
        this.GridPageSize = 'PageSize';
        this.GridPageCurrent = 'PageCurrent';
        this.MaxResults = 'maxresults';
        this.SystemCharNumber = 'systemCharNumber';
        this.AccountNumber = 'AccountNumber';
        this.Function = 'Function';
        this.PremiseNumber = 'PremiseNumber';
        this.ContractNumber = 'ContractNumber';
        this.ProductCode = 'ProductCode';
        this.ActionType = 'ActionType';
        this.LanguageCode = 'LanguageCode';
        this.TaxCode = 'TaxCode';
    }
}
