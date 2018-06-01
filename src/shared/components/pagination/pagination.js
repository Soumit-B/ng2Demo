import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';
import { GlobalConstant } from '../../constants/global.constant';
import { RiExchange } from '../../../shared/services/riExchange';
export var PaginationComponent = (function () {
    function PaginationComponent(_logger, _global, riExchange) {
        this._logger = _logger;
        this._global = _global;
        this.riExchange = riExchange;
        this.getCurrentPage = new EventEmitter();
    }
    PaginationComponent.prototype.ngOnInit = function () {
        this._config = this._global.AppConstants().paginationConfig;
        this.boundaryLinks = this._config.boundaryLinks;
        if (this.maxSize === 0) {
            this.maxSize = this.maxSize;
        }
        else {
            this.maxSize = this._config.maxSize;
        }
        this.previousText = this._config.previousText;
        this.nextText = this._config.nextText;
        this.firstText = this._config.firstText;
        this.lastText = this._config.lastText;
        this.defaultStartPage = this._config.defaultStartPage;
        this.currentPage = this.currentPage || this._config.defaultStartPage;
        this.totalItems = this.totalItems || 100;
        this.itemsPerPage = this.itemsPerPage || this._global.AppConstants().tableConfig.itemsPerPage;
    };
    PaginationComponent.prototype.ngOnDestroy = function () {
        this.riExchange.releaseReference(this);
    };
    PaginationComponent.prototype.ngOnChanges = function (val) {
    };
    PaginationComponent.prototype.setPage = function (pageNo) {
        this.currentPage = pageNo;
    };
    ;
    PaginationComponent.prototype.currentPageChanged = function (event) {
        this.getCurrentPage.emit({ value: event.page });
    };
    ;
    PaginationComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-pagination',
                    template: "\n      <pagination [boundaryLinks]=\"boundaryLinks\" [maxSize]=\"maxSize\" [itemsPerPage]=\"itemsPerPage\" [totalItems]=\"totalItems\" [(ngModel)]=\"currentPage\" [previousText]=\"previousText\" [nextText]=\"nextText\" [firstText]=\"firstText\" [lastText]=\"lastText\" class=\"pagination\" (pageChanged)=\"currentPageChanged($event)\"></pagination>\n    "
                },] },
    ];
    PaginationComponent.ctorParameters = [
        { type: Logger, },
        { type: GlobalConstant, },
        { type: RiExchange, },
    ];
    PaginationComponent.propDecorators = {
        'totalItems': [{ type: Input },],
        'maxSize': [{ type: Input },],
        'itemsPerPage': [{ type: Input },],
        'currentPage': [{ type: Input },],
        'getCurrentPage': [{ type: Output },],
    };
    return PaginationComponent;
}());
