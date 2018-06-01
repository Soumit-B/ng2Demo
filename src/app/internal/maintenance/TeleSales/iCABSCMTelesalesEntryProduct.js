export var TelesalesEntryProduct = (function () {
    function TelesalesEntryProduct(parent) {
        this.parent = parent;
        this.context = parent;
    }
    TelesalesEntryProduct.prototype.cmdClearProduct_OnClick = function () {
        this.context.pageParams.ProductCacheTime = this.context.utils.Time();
        this.context.iCABSCMTelesalesEntry2.ProductGrid_execute();
    };
    TelesalesEntryProduct.prototype.cmdCreateProduct_OnClick = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderNumber', '0');
        this.CreateTelesalesOrderFromProduct();
    };
    TelesalesEntryProduct.prototype.cmdCreateProductCurrent_OnClick = function () {
        this.CreateTelesalesOrderFromProduct();
    };
    TelesalesEntryProduct.prototype.CreateTelesalesOrderFromProduct = function () {
        var _this = this;
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        if (this.context.pageParams.lOrderHeaderChanged) {
            this.context.pageParams.lOrderHeaderChanged = false;
        }
        this.context.search = this.context.getURLSearchParamObject();
        this.context.search.set(this.context.serviceConstants.Action, '6');
        var formData = {
            'Function': 'CreateTelesalesOrderFromProduct',
            'TelesalesOrderNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber'),
            'AccountNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AccountNumber'),
            'ContractNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'),
            'PremiseNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber'),
            'ProspectNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProspectNumber'),
            'ProductDesc': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductDescriptionContains'),
            'ProductCode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCodeBegins'),
            'CacheTime': this.context.pageParams.ProductCacheTime,
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
                _this.context.pageParams.lRefreshProductGrid = true;
                if (data.TelesalesOrderNumber) {
                    _this.context.iCABSCMTelesalesEntry1.FetchSaveTelesalesOrder('FetchTelesalesOrder', function () {
                        this.context.iCABSCMTelesalesEntry2.riTab_TabFocusAfter();
                    });
                }
            }
        }, function (error) {
            _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
            _this.context.errorService.emitError('Record not found');
        });
    };
    return TelesalesEntryProduct;
}());
