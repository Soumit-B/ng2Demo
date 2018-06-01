import { Injectable } from '@angular/core';
export var ServiceConstants = (function () {
    function ServiceConstants() {
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
        this.ActionType = 'ActionType';
        this.LanguageCode = 'LanguageCode';
    }
    ServiceConstants.decorators = [
        { type: Injectable },
    ];
    ServiceConstants.ctorParameters = [];
    return ServiceConstants;
}());
