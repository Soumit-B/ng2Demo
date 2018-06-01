export var TelesalesEntryOrderHistory = (function () {
    function TelesalesEntryOrderHistory(parent) {
        this.parent = parent;
        this.context = parent;
    }
    TelesalesEntryOrderHistory.prototype.CreateTelesalesOrderFromOrder = function () {
        var _this = this;
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        if (this.context.pageParams.lOrderHeaderChanged) {
            this.context.pageParams.lOrderHeaderChanged = false;
        }
        this.context.search = this.context.getURLSearchParamObject();
        this.context.search.set(this.context.serviceConstants.Action, '6');
        var formData = {
            'Function': 'CreateTelesalesOrderFromOrder',
            'TelesalesOrderNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber'),
            'AccountNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AccountNumber'),
            'ContractNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'),
            'PremiseNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber'),
            'ProspectNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProspectNumber'),
            'DateFilter': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DateFilter'),
            'OrderFromDate': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OrderFromDate'),
            'OrderToDate': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OrderToDate'),
            'LevelFilter': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LevelFilter'),
            'TelesalesOrderStatusCodeFilter': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderStatusCodeFilter'),
            'CacheTime': this.context.pageParams.OrderHistoryCacheTime,
            'CurrentCallLogID': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentCallLogID')
        };
        formData = this.context.utils.cleanForm(formData);
        this.context.httpService.makePostRequest(this.context.queryParams.method, this.context.queryParams.module, this.context.queryParams.operation, this.context.search, formData)
            .subscribe(function (data) {
            _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.context.errorService.emitError(data.errorMessage);
                _this.context.messageService.emitMessage({ msg: data.errorMessage, title: 'Error' });
            }
            else {
                _this.context.pageParams.ProductCacheTime = _this.context.utils.Time();
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesOrderNumber', data.TelesalesOrderNumber);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesOrderStatusCode', data.TelesalesOrderStatusCode);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesOrderStatusDesc', data.TelesalesOrderStatusDesc);
                _this.context.pageParams.lRefreshOrderHistoryGrid = true;
                _this.context.pageParams.lRefreshOrderlineGrid = true;
                _this.context.pageParams.lRefreshStockGrid = true;
                _this.context.pageParams.OrderHistoryCacheTime = _this.context.utils.Time();
                _this.context.iCABSCMTelesalesEntry1.FetchSaveTelesalesOrder('FetchTelesalesOrder', function () {
                    this.context.iCABSCMTelesalesEntry2.riTab_TabFocusAfter();
                });
            }
        }, function (error) {
            _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
            _this.context.errorService.emitError('Record not found');
        });
    };
    TelesalesEntryOrderHistory.prototype.cmdClearOrderHistory_OnClick = function () {
        this.context.pageParams.OrderHistoryCacheTime = this.context.utils.Time();
        this.context.iCABSCMTelesalesEntry2.OrderHistoryGrid_execute();
    };
    TelesalesEntryOrderHistory.prototype.cmdCreateOrderHistory_OnClick = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderNumber', '0');
        this.CreateTelesalesOrderFromOrder();
    };
    TelesalesEntryOrderHistory.prototype.cmdCreateOrderHistoryCurrent_OnClick = function () {
        this.CreateTelesalesOrderFromOrder();
    };
    TelesalesEntryOrderHistory.prototype.LevelFilter_OnChange = function () {
        this.context.iCABSCMTelesalesEntry2.OrderHistoryGrid_execute();
    };
    return TelesalesEntryOrderHistory;
}());
