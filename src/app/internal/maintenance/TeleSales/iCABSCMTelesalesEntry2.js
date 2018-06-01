export var TelesalesEntry2 = (function () {
    function TelesalesEntry2(parent) {
        this.parent = parent;
        this.context = parent;
    }
    TelesalesEntry2.prototype.ValidateOrder = function (fncallback) {
        this.context.pageParams.lValidateOK = true;
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesName') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine1') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine2') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine3') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine4') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine5') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesPostcode') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesContactName') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesContactPosition') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesContactTelephone') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesContactEmail') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesDeliveryDate') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesPurchaseOrderNo') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'CommissionEmployeeCode') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvName') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine1') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine2') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine3') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine4') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine5') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvPostcode') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvContactName') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvContactPosition') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvContactTelephone')) {
            this.context.pageParams.lValidateOK = false;
        }
        if (this.context.pageParams.lValidateOk) {
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CustomerTypeCodeSelect')) {
                this.context.pageParams.lValidateOk = false;
            }
            if (this.context.pageParams.lValidateOk) {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CustomerTypeCodeSelect') === '') {
                    this.context.pageParams.lValidateOk = false;
                }
            }
            if (!this.context.pageParams.lValidateOk) {
                this.context.messageService.emitMessage({ msg: this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ErrorMessageCustomerType'), title: 'Error' });
            }
        }
        if (fncallback && typeof fncallback === 'function') {
            fncallback.call(this.context.iCABSCMTelesalesEntry1);
        }
    };
    TelesalesEntry2.prototype.OrderHistoryGrid_execute = function (rowId) {
        var _this = this;
        this.context.search = this.context.getURLSearchParamObject();
        this.context.search.set(this.context.serviceConstants.Action, '2');
        this.context.search.set('AccountNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AccountNumber'));
        this.context.search.set('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'));
        this.context.search.set('PremiseNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber'));
        this.context.search.set('ProspectNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProspectNumber'));
        this.context.search.set('FixedTelesalesOrderNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FixedTelesalesOrderNumber'));
        this.context.search.set('DateFilter', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DateFilter'));
        this.context.search.set('OrderFromDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OrderFromDate'));
        this.context.search.set('OrderToDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OrderToDate'));
        this.context.search.set('LevelFilter', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LevelFilter'));
        this.context.search.set('TelesalesOrderStatusCodeFilter', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderStatusCodeFilter'));
        this.context.search.set('CacheTime', this.context.pageParams.OrderHistoryCacheTime);
        this.context.search.set(this.context.serviceConstants.PageSize, (this.context.gridConfig.OrderHistoryGrid.itemsPerPage).toString());
        this.context.search.set(this.context.serviceConstants.PageCurrent, this.context.gridConfig.OrderHistoryGrid.currentPage.toString());
        this.context.search.set(this.context.serviceConstants.GridMode, '0');
        this.context.search.set(this.context.serviceConstants.GridHandle, '6227514');
        this.context.queryParams.search = this.context.search;
        if (rowId) {
            this.context.search.set('RowID', rowId);
            this.context.httpService.makeGetRequest(this.context.queryParams.method, this.context.queryParams.module, this.context.queryParams.operation, this.context.search)
                .subscribe(function (data) {
                if (data.errorMessage) {
                    _this.context.errorService.emitError(data.errorMessage);
                    _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
                }
                else {
                    _this.context.search.delete('RowID');
                    _this.context.OrderHistoryGrid.loadGridData(_this.context.queryParams);
                }
            }, function (error) {
                _this.context.errorService.emitError('Record not found');
                _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.context.OrderHistoryGrid.loadGridData(this.context.queryParams);
        }
    };
    TelesalesEntry2.prototype.ProductGrid_execute = function (rowId) {
        var _this = this;
        this.context.search = this.context.getURLSearchParamObject();
        this.context.search.set(this.context.serviceConstants.Action, '2');
        var formData = {
            'TelesalesOrderNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber'),
            'ProductCode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCodeBegins'),
            'ProductDesc': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductDescriptionContains'),
            'CacheTime': this.context.pageParams.ProductCacheTime,
            'PageSize': this.context.gridConfig.ProductGrid.itemsPerPage.toString(),
            'PageCurrent': this.context.gridConfig.ProductGrid.currentPage.toString(),
            'riGridMode': '0',
            'riGridHandle': '6161770'
        };
        if (rowId) {
            formData['RowID'] = this.context.attributes.SelectedProduct_RowID;
            this.context.httpService.makePostRequest(this.context.queryParams.method, this.context.queryParams.module, this.context.queryParams.operation, this.context.search, formData)
                .subscribe(function (data) {
                if (data.errorMessage) {
                    _this.context.errorService.emitError(data.errorMessage);
                    _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
                }
                else {
                    delete formData['RowID'];
                    _this.context.queryParams.body = formData;
                    _this.context.queryParams.search = _this.context.search;
                    _this.context.ProductGrid.updateGridData(_this.context.queryParams, rowId);
                }
            }, function (error) {
                _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
                delete formData['RowID'];
                _this.context.queryParams.body = formData;
                _this.context.queryParams.search = _this.context.search;
                _this.context.ProductGrid.updateGridData(_this.context.queryParams, rowId);
                _this.context.errorService.emitError('Record not found');
            });
        }
        else {
            this.context.queryParams.body = formData;
            this.context.queryParams.search = this.context.search;
            this.context.ProductGrid.updateGridData(this.context.queryParams);
        }
    };
    TelesalesEntry2.prototype.OrderLineGrid_execute = function (rowId) {
        var _this = this;
        this.context.search = this.context.getURLSearchParamObject();
        this.context.search.set(this.context.serviceConstants.Action, '2');
        this.context.search.set('TelesalesOrderNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber'));
        this.context.search.set('BulkDiscountPerc', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BulkDiscountPerc'));
        this.context.search.set('CacheTime', this.context.pageParams.OrderLineCacheTime);
        this.context.search.set(this.context.serviceConstants.PageSize, (this.context.gridConfig.OrderLineGrid.itemsPerPage).toString());
        this.context.search.set(this.context.serviceConstants.PageCurrent, this.context.gridConfig.OrderLineGrid.currentPage.toString());
        this.context.search.set(this.context.serviceConstants.GridMode, '0');
        this.context.search.set(this.context.serviceConstants.GridHandle, '2294694');
        this.context.queryParams.search = this.context.search;
        if (rowId) {
            this.context.search.set('RowID', rowId);
            this.context.httpService.makeGetRequest(this.context.queryParams.method, this.context.queryParams.module, this.context.queryParams.operation, this.context.search)
                .subscribe(function (data) {
                if (data.errorMessage) {
                    _this.context.errorService.emitError(data.errorMessage);
                    _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
                }
                else {
                    _this.context.search.delete('RowID');
                    _this.context.OrderLineGrid.loadGridData(_this.context.queryParams);
                }
            }, function (error) {
                _this.context.errorService.emitError('Record not found');
                _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.context.OrderLineGrid.loadGridData(this.context.queryParams);
        }
    };
    TelesalesEntry2.prototype.StockGrid_execute = function () {
        this.context.search = this.context.getURLSearchParamObject();
        this.context.search.set(this.context.serviceConstants.Action, '2');
        this.context.search.set('TelesalesOrderNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber'));
        this.context.search.set(this.context.serviceConstants.PageSize, (this.context.gridConfig.StockGrid.itemsPerPage).toString());
        this.context.search.set(this.context.serviceConstants.PageCurrent, this.context.gridConfig.StockGrid.currentPage.toString());
        this.context.search.set(this.context.serviceConstants.GridMode, '0');
        this.context.search.set(this.context.serviceConstants.GridHandle, '10879794');
        this.context.queryParams.search = this.context.search;
        this.context.StockGrid.loadGridData(this.context.queryParams);
    };
    TelesalesEntry2.prototype.riTab_TabFocusAfter = function () {
        if (this.context.uiDisplay.tab.tab2.active && this.context.pageParams.lRefreshProductGrid) {
            this.ProductGrid_execute();
            this.context.pageParams.lRefreshProductGrid = false;
        }
        if (this.context.uiDisplay.tab.tab1.active && this.context.pageParams.lRefreshOrderHistoryGrid) {
            this.OrderHistoryGrid_execute();
            this.context.pageParams.lRefreshOrderHistoryGrid = false;
        }
        if (this.context.uiDisplay.tab.tab5.active && this.context.pageParams.lRefreshOrderLineGrid) {
            this.OrderLineGrid_execute();
            this.context.pageParams.lRefreshOrderLineGrid = false;
        }
        if (this.context.uiDisplay.tab.tab8.active) {
            this.StockGrid_execute();
            this.context.pageParams.lRefreshStockGrid = false;
        }
    };
    return TelesalesEntry2;
}());
