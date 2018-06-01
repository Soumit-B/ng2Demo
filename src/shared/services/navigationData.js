export var NavData = (function () {
    function NavData() {
    }
    NavData.prototype.setMode = function (data) {
        this.mode = data;
    };
    NavData.prototype.getMode = function () {
        return this.mode;
    };
    NavData.prototype.setControls = function (data) {
        this.controls = data;
    };
    NavData.prototype.getControls = function () {
        return this.controls;
    };
    NavData.prototype.setExchangeMode = function (data) {
        this.exchangeMode = data;
    };
    NavData.prototype.getExchangeMode = function () {
        return this.exchangeMode;
    };
    NavData.prototype.setPageAttributes = function (data) {
        this.pageAttributes = data;
    };
    NavData.prototype.getPageAttributes = function () {
        return this.pageAttributes;
    };
    NavData.prototype.setFormData = function (data) {
        this.formData = data;
    };
    NavData.prototype.getFormData = function () {
        return this.formData;
    };
    NavData.prototype.setStoreData = function (data) {
        this.storeData = data;
    };
    NavData.prototype.getStoreData = function () {
        return this.storeData;
    };
    NavData.prototype.setPageData = function (data) {
        this.pageData = data;
    };
    NavData.prototype.getPageData = function () {
        return this.pageData;
    };
    NavData.prototype.setPageId = function (pageId) {
        this.pageId = pageId;
    };
    NavData.prototype.getPageId = function () {
        return this.pageId;
    };
    NavData.prototype.setBackRoute = function (route) {
        this.backroute = route;
    };
    NavData.prototype.getBackRoute = function () {
        return this.backroute;
    };
    NavData.prototype.setBackLabel = function (label) {
        this.backLabel = label;
    };
    NavData.prototype.getBackLabel = function () {
        return this.backLabel;
    };
    NavData.prototype.setQueryParams = function (query) {
        this.queryParams = query;
    };
    NavData.prototype.getQueryParams = function () {
        return this.queryParams;
    };
    return NavData;
}());
