export var TelesalesEntry1 = (function () {
    function TelesalesEntry1(parent) {
        this.parent = parent;
        this.dt = new Date();
        this.context = parent;
    }
    TelesalesEntry1.prototype.window_onload = function () {
        this.context.pageParams.ProductCacheTime = this.context.utils.Time();
        this.context.pageParams.OrderHistoryCacheTime = this.context.utils.Time();
        this.context.pageParams.OrderLineCacheTime = this.context.utils.Time();
        this.context.pageParams.lFetchOrderRequired = false;
        this.context.pageParams.lRefreshProductGrid = false;
        this.context.pageParams.lRefreshOrderHistoryGrid = false;
        this.context.pageParams.lRefreshOrderLineGrid = true;
        this.context.pageParams.lRefreshStockGrid = true;
        this.context.pageParams.lFixedTelesalesOrder = false;
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdViewOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdEmailOrder');
        if (this.context.pageParams.lShowTaxDetails) {
            this.context.gridConfig.OrderHistoryGrid.maxColumn = 10;
            this.context.gridConfig.OrderLineGrid.maxColumn = 12;
        }
        this.GetInitialSettings();
    };
    TelesalesEntry1.prototype.window_onload_continue = function () {
        this.SetupDisplayFields();
        this.SensitiseButtons();
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DateFilter', 'Ordered');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdSaveOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdAbandonOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdTelesalesValue');
        this.DisableUpdateFields(true);
        if (this.context.pageParams.lRefreshProductGrid) {
            this.context.renderTab(2);
        }
        if (this.context.pageParams.lRefreshOrderHistoryGrid) {
            this.context.iCABSCMTelesalesEntry2.riTab_TabFocusAfter();
            this.context.pageParams.lRefreshProductGrid = true;
        }
        if (this.context.pageParams.lFixedTelesalesOrderNumber) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FixedTelesalesOrderNumber'));
            this.FetchSaveTelesalesOrder('FetchTelesalesOrder', function () {
                this.context.iCABSCMTelesalesEntry2.riTab_TabFocusAfter();
            });
        }
        this.context.iCABSCMTelesalesEntry2.OrderHistoryGrid_execute();
        this.context.iCABSCMTelesalesEntry2.ProductGrid_execute();
        this.context.iCABSCMTelesalesEntry2.OrderLineGrid_execute();
        this.context.iCABSCMTelesalesEntry2.StockGrid_execute();
    };
    TelesalesEntry1.prototype.GetInitialSettings = function () {
        this.context.pageParams.cTelesalesName = this.context.riExchange.getParentHTMLValue('CallAddressName');
        this.context.pageParams.cTelesalesAddressLine1 = this.context.riExchange.getParentHTMLValue('CallAddressLine1');
        this.context.pageParams.cTelesalesAddressLine2 = this.context.riExchange.getParentHTMLValue('CallAddressLine2');
        this.context.pageParams.cTelesalesAddressLine3 = this.context.riExchange.getParentHTMLValue('CallAddressLine3');
        this.context.pageParams.cTelesalesAddressLine4 = this.context.riExchange.getParentHTMLValue('CallAddressLine4');
        this.context.pageParams.cTelesalesAddressLine5 = this.context.riExchange.getParentHTMLValue('CallAddressLine5');
        this.context.pageParams.cTelesalesPostcode = this.context.riExchange.getParentHTMLValue('CallContactPostcode');
        this.context.pageParams.cTelesalesContactName = this.context.riExchange.getParentHTMLValue('CallAddressName');
        this.context.pageParams.cTelesalesContactPosition = this.context.riExchange.getParentHTMLValue('CallContactPosition');
        this.context.pageParams.cTelesalesContactTelephone = this.context.riExchange.getParentHTMLValue('CallContactTelephone');
        this.context.pageParams.cTelesalesContactMobile = this.context.riExchange.getParentHTMLValue('CallContactMobile');
        this.context.pageParams.cTelesalesContactEmail = this.context.riExchange.getParentHTMLValue('CallContactEmail');
        this.context.pageParams.cTelesalesContactFax = this.context.riExchange.getParentHTMLValue('CallContactFax');
        this.context.dateFrom = new Date(this.dt.getFullYear() - 1, this.dt.getMonth(), this.dt.getDate());
        this.context.dateTo = new Date(this.dt.getFullYear(), this.dt.getMonth() + 6, this.dt.getDate());
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderNumber', 0);
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AccountNumber', this.context.riExchange.getParentHTMLValue('AccountNumber'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ContractNumber', this.context.riExchange.getParentHTMLValue('ContractNumber'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PremiseNumber', this.context.riExchange.getParentHTMLValue('PremiseNumber'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ProspectNumber', this.context.riExchange.getParentHTMLValue('ProspectNumber'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CurrentCallLogID', this.context.riExchange.getParentHTMLValue('CurrentCallLogID'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InitialContractNumber', this.context.riExchange.getParentHTMLValue('ContractNumber'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InitialPremiseNumber', this.context.riExchange.getParentHTMLValue('PremiseNumber'));
        if (this.context.parentMode === 'PlanVisit' || this.context.parentMode === 'DiscountAnalysisGrid') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'FixedTelesalesOrderNumber', this.context.riExchange.getParentHTMLValue('TelesalesOrderNumber'));
            this.context.pageParams.lFixedTelesalesOrderNumber = true;
        }
        if (this.context.parentMode === 'StockRequest') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'FixedTelesalesOrderNumber', this.context.riExchange.getParentHTMLValue('PassTelesalesOrderNumber'));
            this.context.pageParams.lFixedTelesalesOrderNumber = true;
        }
        if (this.context.pageParams.lFixedTelesalesOrderNumber === true) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderNumber', this.context.riExchange.getParentHTMLValue('FixedTelesalesOrderNumber'));
            this.context.pageParams.lRefreshOrderHistoryGrid = true;
            this.context.pageParams.tdTransactionDetails = false;
            this.window_onload_continue();
        }
        else {
            this.context.pageParams.tdTransactionDetails = true;
            this.getInitialValuesFromService();
        }
    };
    TelesalesEntry1.prototype.getInitialValuesFromService = function () {
        var _this = this;
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        var query = this.context.getURLSearchParamObject();
        query.set(this.context.serviceConstants.Action, '6');
        var formData = {
            'Function': 'GetInitialSettings',
            'AccountNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AccountNumber'),
            'ContractNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'),
            'PremiseNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber'),
            'ProspectNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProspectNumber'),
            'TelesalesOrderNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber'),
            'CurrentCallLogID': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentCallLogID'),
            'TelesalesName': this.context.pageParams.cTelesalesName,
            'TelesalesAddressLine1': this.context.pageParams.cTelesalesAddressLine1,
            'TelesalesAddressLine2': this.context.pageParams.cTelesalesAddressLine2,
            'TelesalesAddressLine3': this.context.pageParams.cTelesalesAddressLine3,
            'TelesalesAddressLine4': this.context.pageParams.cTelesalesAddressLine4,
            'TelesalesAddressLine5': this.context.pageParams.cTelesalesAddressLine5,
            'TelesalesPostcode': this.context.pageParams.cTelesalesPostcode,
            'TelesalesContactName': this.context.pageParams.cTelesalesContactName,
            'TelesalesContactPosition': this.context.pageParams.cTelesalesContactPosition,
            'TelesalesContactTelephone': this.context.pageParams.cTelesalesContactTelephone,
            'TelesalesContactMobile': this.context.pageParams.cTelesalesContactMobile,
            'TelesalesContactEmail': this.context.pageParams.cTelesalesContactEmail,
            'TelesalesContactFax': this.context.pageParams.cTelesalesContactFax
        };
        formData = this.context.utils.cleanForm(formData);
        this.context.httpService.makePostRequest(this.context.queryParams.method, this.context.queryParams.module, this.context.queryParams.operation, query, formData)
            .subscribe(function (data) {
            _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.context.errorService.emitError(data.errorMessage);
                _this.context.messageService.emitMessage({ msg: data.errorMessage, title: 'Error' });
            }
            else {
                if ((data.ContractNumber !== _this.context.riExchange.riInputElement.GetValue(_this.context.uiForm, 'ContractNumber'))
                    || (data.PremiseNumber !== _this.context.riExchange.riInputElement.GetValue(_this.context.uiForm, 'PremiseNumber'))) {
                    _this.context.pageParams.lAddressWarning = true;
                }
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'ContractNumber', data.ContractNumber);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'PremiseNumber', data.PremiseNumber);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'ProspectNumber', data.ProspectNumber);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'ErrorMessageCustomerType', data.ErrorMessageCustomerType);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'CanEmailOrder', data.CanEmailOrder);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'ErrorMessageEmailAddress', data.ErrorMessageEmailAddress);
                if (data.CanEmailOrder === 'Y') {
                    _this.context.pageParams.tdcmdEmailOrder = true;
                }
                if (data.CanBulkDiscount === 'Y') {
                    _this.context.pageParams.tdBulkDiscountPerc = true;
                }
                var ValArray = data.OrderLevelName.split('^');
                var DescArray = data.OrderLevelDesc.split('^');
                for (var i = 0; i < ValArray.length; i++) {
                    _this.context.pageParams.LevelFilter.push({
                        value: ValArray[i],
                        text: DescArray[i]
                    });
                }
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'LevelFilter', data.OrderLevelSelect);
                if (_this.context.pageParams.lFixedTelesalesOrderNumber === true) {
                    _this.context.pageParams.tdTransactionDetails = false;
                }
                else {
                    _this.context.pageParams.tdTransactionDetails = true;
                    _this.context.pageParams.tdTransactionLabel = data.TransactionLabel;
                    _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TransactionNumber', data.TransactionNumber);
                    _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TransactionName', data.TransactionName);
                    if (data.OrdersExist === 'N') {
                        _this.context.pageParams.lRefreshProductGrid = true;
                    }
                    else {
                        _this.context.pageParams.lRefreshOrderHistoryGrid = true;
                    }
                }
            }
            _this.window_onload_continue();
        }, function (error) {
            _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
            _this.context.errorService.emitError('Record not found');
            _this.window_onload_continue();
        });
    };
    TelesalesEntry1.prototype.SetupDisplayFields = function () {
        if (this.context.pageParams.lEnableAddressLine3) {
            this.context.pageParams.trTelesalesAddressLine3 = true;
            this.context.pageParams.trTelesalesInvAddressLine3 = true;
        }
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BulkDiscountPerc', '0.00');
        this.context.MaxLength = this.context.pageParams.iSCMaximumAddressLength;
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TransactionNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TransactionName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesOrderStatusDesc');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'CurrentCallLogID');
        if (this.context.pageParams.lSCAddressLine3Logical) {
            this.setRequired('TelesalesAddressLine3', true);
        }
        else {
            this.setRequired('TelesalesAddressLine3', false);
        }
        if (this.context.pageParams.lSCAddressLine4Required) {
            this.setRequired('TelesalesAddressLine4', true);
        }
        else {
            if (!(this.context.pageParams.lEnablePostcodepublicurbLog && this.context.pageParams.lEnableValidatePostcodepublicurb)) {
                this.setRequired('TelesalesAddressLine4', false);
            }
            else {
                this.setRequired('TelesalesAddressLine4', true);
            }
        }
        if (this.context.pageParams.lSCAddressLine5Required) {
            this.setRequired('TelesalesAddressLine5', true);
        }
        else {
            this.setRequired('TelesalesAddressLine5', false);
        }
        if (this.context.pageParams.lSCPostCodeRequired) {
            this.setRequired('TelesalesPostcode', true);
        }
        else {
            this.setRequired('TelesalesPostcode', false);
        }
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesOrderDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'QuoteExpiryDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'CommissionEmployeeName');
        if (this.context.pageParams.lSCAddressLine3Logical) {
            this.setRequired('TelesalesInvAddressLine3', true);
        }
        else {
            this.setRequired('TelesalesInvAddressLine3', false);
        }
        if (this.context.pageParams.lSCAddressLine4Required) {
            this.setRequired('TelesalesInvAddressLine4', true);
        }
        else {
            if (!(this.context.pageParams.lEnablePostcodepublicurbLog && this.context.pageParams.lEnableValidatePostcodepublicurb)) {
                this.setRequired('TelesalesInvAddressLine4', false);
            }
            else {
                this.setRequired('TelesalesInvAddressLine4', true);
            }
        }
        if (this.context.pageParams.lSCAddressLine5Required) {
            this.setRequired('TelesalesInvAddressLine5', true);
        }
        else {
            this.setRequired('TelesalesInvAddressLine5', false);
        }
        if (this.context.pageParams.lSCPostCodeRequired) {
            this.setRequired('TelesalesInvPostcode', true);
        }
        else {
            this.setRequired('TelesalesInvPostcode', false);
        }
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelectedProductValue');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'PaymentTypeDesc');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'PaymentRef');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvoiceNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSStatusCode');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSStatusDesc');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSOrderDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSOrderTime');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSCreatedBy');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSCreatedByName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesQConfirmedDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesQConfirmedTime');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesQConfirmedBy');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSQConfirmedByName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesConfirmedDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesConfirmedTime');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesConfirmedBy');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSConfirmedByName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesCancelledDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesCancelledTime');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesCancelledBy');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSCancelledByName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesCompletedDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesCompletedTime');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesCompletedBy');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSCompletedByName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSProspectNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSProspectName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSAccountNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSAccountName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSContractNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSContractName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSPremiseNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSPremiseName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSOrigContractNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSOrigContractName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSOrigPremiseNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSOrigPremiseName');
    };
    TelesalesEntry1.prototype.setRequired = function (field, req) {
        for (var i = 0; i < this.context.controls.length; i++) {
            if (this.context.controls[i].name === field) {
                this.context.controls[i].required = req;
                return;
            }
        }
    };
    TelesalesEntry1.prototype.FetchSaveTelesalesOrder = function (cFunction, fncallback) {
        var _this = this;
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        var query = this.context.getURLSearchParamObject();
        query.set(this.context.serviceConstants.Action, '6');
        if (this.context.pageParams.lFetchOrderRequired !== true) {
            this.context.pageParams.OrderHistoryCacheTime = this.context.utils.Time();
        }
        this.context.pageParams.lSavedOk = false;
        var formData = {
            'Function': cFunction,
            'TelesalesOrderNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber'),
            'CurrentCallLogID': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentCallLogID'),
            'AccountNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AccountNumber'),
            'ContractNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'),
            'PremiseNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber'),
            'ProspectNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProspectNumber'),
            'TelesalesOrderStatusCode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderStatusCode'),
            'TelesalesName': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesName'),
            'TelesalesAddressLine1': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesAddressLine1'),
            'TelesalesAddressLine2': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesAddressLine2'),
            'TelesalesAddressLine3': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesAddressLine3'),
            'TelesalesAddressLine4': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesAddressLine4'),
            'TelesalesAddressLine5': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesAddressLine5'),
            'TelesalesPostcode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesPostcode'),
            'TelesalesContactName': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesContactName'),
            'TelesalesContactPosition': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesContactPosition'),
            'TelesalesContactTelephone': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesContactTelephone'),
            'TelesalesContactMobile': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesContactMobile'),
            'TelesalesContactEmail': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesContactEmail'),
            'TelesalesContactFax': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesContactFax'),
            'TelesalesOrderDate': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderDate'),
            'TelesalesDeliveryDate': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesDeliveryDate'),
            'TelesalesDeliveryCharge': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesDeliveryCharge'),
            'TelesalesPurchaseOrderNo': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesPurchaseOrderNo'),
            'ContractReference': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractReference'),
            'PaymentTypeCode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PaymentTypeCode'),
            'CustomerTypeCode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CustomerTypeCodeSelect'),
            'CommissionEmployeeCode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CommissionEmployeeCode'),
            'QuoteExpiryDate': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'QuoteExpiryDate'),
            'TelesalesOrderNotes': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNotes'),
            'TelesalesDeliveryInstructions': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesDeliveryInstructions'),
            'TelesalesInvName': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvName'),
            'TelesalesInvAddressLine1': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvAddressLine1'),
            'TelesalesInvAddressLine2': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvAddressLine2'),
            'TelesalesInvAddressLine3': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvAddressLine3'),
            'TelesalesInvAddressLine4': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvAddressLine4'),
            'TelesalesInvAddressLine5': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvAddressLine5'),
            'TelesalesInvPostcode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvPostcode'),
            'TelesalesInvContactName': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvContactName'),
            'TelesalesInvContactPosition': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvContactPosition'),
            'TelesalesInvContactTelephone': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvContactTelephone'),
            'TelesalesInvContactMobile': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvContactMobile'),
            'TelesalesInvContactEmail': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvContactEmail'),
            'TelesalesInvContactFax': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvContactFax')
        };
        formData = this.context.utils.cleanForm(formData);
        this.context.httpService.makePostRequest(this.context.queryParams.method, this.context.queryParams.module, this.context.queryParams.operation, query, formData)
            .subscribe(function (data) {
            _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
            if (data.ErrorMessage) {
                _this.context.errorService.emitError(data.ErrorMessage);
                _this.context.messageService.emitMessage({ msg: data.ErrorMessage, title: 'Error' });
            }
            else {
                _this.context.riExchange.riInputElement.Enable(_this.context.uiForm, 'cmdViewOrder');
                _this.context.riExchange.riInputElement.Enable(_this.context.uiForm, 'cmdEmailOrder');
                _this.context.riExchange.riInputElement.Enable(_this.context.uiForm, 'cmdTelesalesValue');
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesOrderNumber', data.TelesalesOrderNumber);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesOrderStatusCode', data.TelesalesOrderStatusCode);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesOrderStatusDesc', data.TelesalesOrderStatusDesc);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesName', data.TelesalesName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesAddressLine1', data.TelesalesAddressLine1);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesAddressLine2', data.TelesalesAddressLine2);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesAddressLine3', data.TelesalesAddressLine3);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesAddressLine4', data.TelesalesAddressLine4);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesAddressLine5', data.TelesalesAddressLine5);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesPostcode', data.TelesalesPostcode);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesContactName', data.TelesalesContactName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesContactPosition', data.TelesalesContactPosition);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesContactTelephone', data.TelesalesContactTelephone);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesContactMobile', data.TelesalesContactMobile);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesContactEmail', data.TelesalesContactEmail);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesContactFax', data.TelesalesContactFax);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesOrderDate', data.TelesalesOrderDate);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'QuoteExpiryDate', data.QuoteExpiryDate);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesDeliveryDate', data.TelesalesDeliveryDate);
                if (window['moment'](data.TelesalesDeliveryDate, 'DD/MM/YYYY', true).isValid()) {
                    data.TelesalesDeliveryDate = _this.context.utils.convertDate(data.TelesalesDeliveryDate);
                }
                else {
                    data.TelesalesDeliveryDate = _this.context.utils.formatDate(data.TelesalesDeliveryDate);
                }
                _this.context.tsDeliveryDate = new Date(data.TelesalesDeliveryDate);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesDeliveryCharge', data.TelesalesDeliveryCharge);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesPurchaseOrderNo', data.TelesalesPurchaseOrderNo);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'ContractReference', data.ContractReference);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'PaymentTypeCode', data.PaymentTypeCode);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'CustomerTypeCodeSelect', data.CustomerTypeCode);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'CommissionEmployeeCode', data.CommissionEmployeeCode);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'CommissionEmployeeName', data.CommissionEmployeeName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesOrderNotes', data.TelesalesOrderNotes);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesDeliveryInstructions', data.TelesalesDeliveryInstructions);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesInvName', data.TelesalesInvName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesInvAddressLine1', data.TelesalesInvAddressLine1);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesInvAddressLine2', data.TelesalesInvAddressLine2);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesInvAddressLine3', data.TelesalesInvAddressLine3);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesInvAddressLine4', data.TelesalesInvAddressLine4);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesInvAddressLine5', data.TelesalesInvAddressLine5);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesInvPostcode', data.TelesalesInvPostcode);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesInvContactName', data.TelesalesInvContactName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesInvContactPosition', data.TelesalesInvContactPosition);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesInvContactTelephone', data.TelesalesInvContactTelephone);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesInvContactMobile', data.TelesalesInvContactMobile);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesInvContactEmail', data.TelesalesInvContactEmail);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesInvContactFax', data.TelesalesInvContactFax);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'CompanyRegistrationNumber', data.CompanyRegistrationNumber);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'CompanyVATNumber', data.CompanyVATNumber);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'CompanyVATNumber2', data.CompanyVATNumber2);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'PaymentTypeDesc', data.PaymentTypeDesc);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'PaymentRef', data.PaymentRef);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesInvoiceNumber', data.TelesalesInvoiceNumber);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSStatusCode', data.OSStatusCode);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSStatusDesc', data.OSStatusDesc);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSOrderDate', data.OSOrderDate);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSOrderTime', _this.context.utils.secondsToHms(data.OSOrderTime));
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSCreatedBy', data.OSCreatedBy);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSCreatedByName', data.OSCreatedByName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesQConfirmedDate', data.TelesalesQConfirmedDate);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesQConfirmedTime', _this.context.utils.secondsToHms(data.TelesalesQConfirmedTime));
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesQConfirmedUserCode', data.TelesalesQConfirmedUserCode);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSQConfirmedByName', data.OSQConfirmedByName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesConfirmedDate', data.TelesalesConfirmedDate);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesConfirmedTime', _this.context.utils.secondsToHms(data.TelesalesConfirmedTime));
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesConfirmedUserCode', data.TelesalesConfirmedUserCode);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSConfirmedByName', data.OSConfirmedByName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesCancelledDate', data.TelesalesCancelledDate);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesCancelledTime', _this.context.utils.secondsToHms(data.TelesalesCancelledTime));
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesCancelledUserCode', data.TelesalesCancelledUserCode);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSCancelledByName', data.OSCancelledByName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesCompletedDate', data.TelesalesCompletedDate);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesCompletedTime', _this.context.utils.secondsToHms(data.TelesalesCompletedTime));
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TelesalesCompletedUserCode', data.TelesalesCompletedUserCode);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSCompletedByName', data.OSCompletedByName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSProspectNumber', data.OSProspectNumber);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSProspectName', data.OSProspectName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSAccountNumber', data.OSAccountNumber);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSAccountName', data.OSAccountName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSContractNumber', data.OSContractNumber);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSContractName', data.OSContractName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSPremiseNumber', data.OSPremiseNumber);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSPremiseName', data.OSPremiseName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSOrigContractNumber', data.OSOrigContractNumber);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSOrigContractName', data.OSOrigContractName);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSOrigPremiseNumber', data.OSOrigPremiseNumber);
                _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'OSOrigPremiseName', data.OSOrigPremiseName);
                _this.context.pageParams.lSavedOk = true;
                _this.context.pageParams.cCanConfirmAsOrder = data.CanConfirmAsOrder;
                _this.context.pageParams.cCanConfirmAsQuote = data.CanConfirmAsQuote;
                _this.context.pageParams.cCanCancelOrder = data.CanCancelOrder;
                _this.context.pageParams.cCanCancelQuote = data.CanCancelQuote;
                _this.context.pageParams.cCanUpdate = data.CanUpdate;
                _this.context.pageParams.cCanUpdateAddress = data.CanUpdateAddress;
                _this.SensitiseButtons();
                if (cFunction.toUpperCase() === 'fetchTelesalesOrder'.toUpperCase()) {
                    if (_this.context.pageParams.lDoubleClick === false) {
                        _this.context.pageParams.lRefreshOrderGrid = true;
                    }
                    _this.context.pageParams.lRefreshOrderOrderlineGrid = true;
                    _this.context.pageParams.lRefreshStockGrid = true;
                }
            }
            if (fncallback && typeof fncallback === 'function') {
                fncallback.call(_this.context);
            }
        }, function (error) {
            _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
            _this.context.errorService.emitError('Record not found');
            if (fncallback && typeof fncallback === 'function') {
                fncallback.call(_this.context);
            }
        });
    };
    TelesalesEntry1.prototype.SensitiseButtons = function () {
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdConfirmOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdConfirmQuotation');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCancelOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCancelQuote');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdUpdateOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'BulkDiscountPerc');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdBulkDiscountPerc');
        if (this.context.pageParams.cCanConfirmAsOrder === 'Y') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdConfirmOrder');
        }
        if (this.context.pageParams.cCanConfirmAsQuote === 'Y') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdConfirmQuotation');
        }
        if (this.context.pageParams.cCanCancelOrder === 'Y') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdCancelOrder');
        }
        if (this.context.pageParams.cCanCancelQuote === 'Y') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdCancelQuote');
        }
        if (this.context.pageParams.cCanUpdate === 'Y') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdUpdateOrder');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'BulkDiscountPerc');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BulkDiscountPerc', '0.00');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdBulkDiscountPerc');
        }
    };
    TelesalesEntry1.prototype.cmdUpdateOrder_OnClick = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdConfirmOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdConfirmQuotation');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCancelOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCancelQuote');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdUpdateOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdViewOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdEmailOrder');
        this.DisableUpdateFields(false);
        this.setRequired('TelesalesPurchaseOrderNo', false);
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesName')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesName');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine1')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine1');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine2')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine2');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine3')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine3');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine4')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine4');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine5')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine5');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesPostcode')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesPostcode');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvName')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvName');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine1')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine1');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine2')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine2');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine3')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine3');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine4')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine4');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine5')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine5');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvPostcode')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvPostcode');
        }
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdUpdateOrder');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdSaveOrder');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdAbandonOrder');
        this.context.pageParams.tdcmdSaveOrder = true;
        this.context.pageParams.tdcmdAbandonOrder = true;
        if (!this.context.uiDisplay.tab.tab3.active && !this.context.uiDisplay.tab.tab4.active
            && !this.context.uiDisplay.tab.tab6.active) {
            this.context.renderTab(3);
        }
    };
    TelesalesEntry1.prototype.cmdSaveOrder_OnClick = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        this.context.pageParams.lConfirmingOrder = false;
        if (this.context.pageParams.lValidateOK) {
            this.FetchSaveTelesalesOrder('SaveTelesalesOrder', function () {
                if (this.context.pageParams.lSavedOk) {
                    this.DisableUpdateFields(true);
                    this.SensitiseButtons();
                    this.context.pageParams.tdcmdUpdateOrder = true;
                    this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdUpdateOrder');
                    this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdSaveOrder');
                    this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdAbandonOrder');
                    this.context.pageParams.tdcmdSaveOrder = false;
                    this.context.pageParams.tdcmdAbandonOrder = false;
                }
            });
        }
    };
    TelesalesEntry1.prototype.cmdAbandonOrder_OnClick = function () {
        this.DisableUpdateFields(true);
        this.SensitiseButtons();
        this.FetchSaveTelesalesOrder('FetchTelesalesOrder', function () {
            this.context.pageParams.tdcmdUpdateOrder = true;
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdUpdateOrder');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdSaveOrder');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdAbandonOrder');
            this.context.pageParams.tdcmdSaveOrder = false;
            this.context.pageParams.tdcmdAbandonOrder = false;
        });
    };
    TelesalesEntry1.prototype.cmdCancelQuote_OnClick = function () {
        this.context.showDialog('Are You Sure You Want To Cancel This Quote?', function () {
            this.context.showDialogSecond('About To Cancel Quote', function () {
                this.cmdCancelQuote_exec();
            });
        });
    };
    TelesalesEntry1.prototype.cmdCancelQuote_exec = function () {
        this.FetchSaveTelesalesOrder('CancelQuote', function () {
            this.context.pageParams.lRefreshOrderHistoryGrid = true;
            this.context.iCABSCMTelesalesEntry2.riTab_TabFocusAfter();
        });
    };
    TelesalesEntry1.prototype.cmdConfirmQuotation_OnClick = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        this.context.renderTab(3);
        this.context.pageParams.lConfirmingOrder = false;
        this.context.iCABSCMTelesalesEntry2.ValidateOrder();
        if (this.context.pageParams.lValidateOK) {
            this.context.showDialog('Once Confirmed You Will Be Prevented From Making Any Further Changes. Are You Sure You Want To Continue?', function () {
                this.context.showDialogSecond('About To Confirm Quote', function () {
                    this.cmdConfirmQuotation_exec();
                });
            });
        }
    };
    TelesalesEntry1.prototype.cmdConfirmQuotation_exec = function () {
        this.FetchSaveTelesalesOrder('ConfirmAsQuote', function () {
            this.context.pageParams.lRefreshOrderHistoryGrid = true;
            this.context.pageParams.lRefreshOrderLineGrid = true;
            this.context.pageParams.lRefreshStockGrid = true;
            this.context.pageParams.lRefreshProductGrid = true;
            this.context.iCABSCMTelesalesEntry2.riTab_TabFocusAfter();
        });
    };
    TelesalesEntry1.prototype.cmdConfirmOrder_OnClick = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        this.context.pageParams.lConfirmingOrder = true;
        this.setRequired('TelesalesPurchaseOrderNo', false);
        this.context.iCABSCMTelesalesEntry2.ValidateOrder();
        if (this.context.pageParams.lValidateOK) {
            this.FetchSaveTelesalesOrder('SaveTelesalesOrder', function () {
                this.FetchSaveTelesalesOrder('FetchTelesalesOrder', function () {
                    this.context.pageParams.lRefreshOrderHistoryGrid = true;
                    this.context.pageParams.lRefreshOrderLineGrid = true;
                    this.context.pageParams.lRefreshStockGrid = true;
                    this.context.pageParams.lRefreshProductGrid = true;
                    this.context.renderTab(7);
                    alert('Navigate to iCABSCMTelesalesEntryConfirmOrder');
                });
            });
        }
    };
    TelesalesEntry1.prototype.cmdEmailOrder_OnClick = function () {
        this.FetchSaveTelesalesOrder('FetchTelesalesOrder', function () {
            this.context.pageParams.lRefreshOrderHistoryGrid = true;
            this.context.pageParams.lRefreshOrderLineGrid = true;
            this.context.pageParams.lRefreshStockGrid = true;
            this.context.pageParams.lRefreshProductGrid = true;
            alert('navigate to iCABSCMTelesalesEntryEmailOrder');
        });
    };
    TelesalesEntry1.prototype.cmdCancelOrder_OnClick = function () {
        this.context.showDialog('Are You Sure You Want To Cancel This Order?', function () {
            this.context.showDialogSecond('About To Cancel Order', function () {
                this.cmdCancelOrder_exec();
            });
        });
    };
    TelesalesEntry1.prototype.cmdCancelOrder_exec = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        this.FetchSaveTelesalesOrder('CancelOrder', function () {
            this.context.pageParams.lRefreshOrderHistoryGrid = true;
            this.context.pageParams.lRefreshOrderLineGrid = true;
            this.context.pageParams.lRefreshStockGrid = true;
            this.context.pageParams.lRefreshProductGrid = true;
            this.context.iCABSCMTelesalesEntry2.riTab_TabFocusAfter();
        });
    };
    TelesalesEntry1.prototype.cmdTelesalesValue_OnClick = function () {
        alert('navigate to iCABSCMTelesalesEntryTotals');
    };
    TelesalesEntry1.prototype.DisableUpdateFields = function (lDisable) {
        if (lDisable) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesName');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesAddressLine1');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesAddressLine2');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesAddressLine3');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesAddressLine4');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesAddressLine5');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesPostcode');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesContactName');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesContactPosition');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesContactTelephone');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesContactMobile');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesContactEmail');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesContactFax');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesDeliveryDate');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesDeliveryCharge');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesPurchaseOrderNo');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'ContractReference');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'CommissionEmployeeCode');
            this.context.ellipsisConfig.employee.disabled = true;
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'CustomerTypeCodeSelect');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesOrderNotes');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesDeliveryInstructions');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvName');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvAddressLine1');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvAddressLine2');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvAddressLine3');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvAddressLine4');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvAddressLine5');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvPostcode');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvContactName');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvContactPosition');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvContactTelephone');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvContactMobile');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvContactEmail');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvContactFax');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'CompanyRegistrationNumber');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'CompanyVATNumber');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'CompanyVATNumber2');
        }
        else {
            if (this.context.pageParams.cCanUpdateAddress === 'Y') {
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesName');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine1');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine2');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine3');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine4');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine5');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesPostcode');
            }
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesContactName');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesContactPosition');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesContactTelephone');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesContactMobile');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesContactEmail');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesContactFax');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesDeliveryDate');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesDeliveryCharge');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesPurchaseOrderNo');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'ContractReference');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'CommissionEmployeeCode');
            this.context.ellipsisConfig.employee.disabled = false;
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'CustomerTypeCodeSelect');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesOrderNotes');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesDeliveryInstructions');
            if (this.context.pageParams.cCanUpdateAddress === 'Y') {
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvName');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine1');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine2');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine3');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine4');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine5');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvPostcode');
            }
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvContactName');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvContactPosition');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvContactTelephone');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvContactMobile');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvContactEmail');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvContactFax');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'CompanyRegistrationNumber');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'CompanyVATNumber');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'CompanyVATNumber2');
        }
    };
    TelesalesEntry1.prototype.cmdViewOrder_OnClick = function () {
        this.SubmitReportRequest();
    };
    TelesalesEntry1.prototype.SubmitReportRequest = function () {
        var _this = this;
        var query = this.context.getURLSearchParamObject();
        query.set(this.context.serviceConstants.Action, '0');
        query.set('Function', 'Single');
        query.set('TelesalesOrderNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber'));
        this.context.httpService.makeGetRequest(this.context.queryParams.method, this.context.queryParams.module, this.context.queryParams.operation, query)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.context.errorService.emitError(data.oResponse);
            }
            else {
                window.open(data.url, '_blank');
            }
        }, function (error) {
            _this.context.errorService.emitError('Record not found');
        });
    };
    TelesalesEntry1.prototype.cmdBulkDiscountPerc_OnClick = function () {
        this.context.showDialog('Are You Sure You Want To Apply This Discount?', function () {
            this.context.showDialogSecond('About To Apply Discount', function () {
                this.cmdBulkDiscountPerc_exec();
            });
        });
    };
    TelesalesEntry1.prototype.cmdBulkDiscountPerc_exec = function () {
        var _this = this;
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        var query = this.context.getURLSearchParamObject();
        query.set(this.context.serviceConstants.Action, '6');
        if (this.context.pageParams.lFetchOrderRequired !== true) {
            this.context.pageParams.OrderHistoryCacheTime = this.context.utils.Time();
        }
        this.context.pageParams.lSavedOk = false;
        var formData = {
            'Function': 'ApplyBulkDiscount',
            'TelesalesOrderNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber'),
            'BulkDiscountPerc': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BulkDiscountPerc')
        };
        this.context.httpService.makePostRequest(this.context.queryParams.method, this.context.queryParams.module, this.context.queryParams.operation, query, formData)
            .subscribe(function (data) {
            _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.context.errorService.emitError(data.errorMessage);
                _this.context.messageService.emitMessage({ msg: data.errorMessage, title: 'Error' });
            }
            else {
                _this.context.iCABSCMTelesalesEntry2.OrderLineGrid_execute();
            }
        }, function (error) {
            _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
            _this.context.errorService.emitError('Record not found');
        });
    };
    return TelesalesEntry1;
}());
