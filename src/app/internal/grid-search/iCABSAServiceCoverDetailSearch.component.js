import { Utils } from '../../../shared/services/utility';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { Logger } from '@nsalaun/ng2-logger';
import { Component } from '@angular/core';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
var ServiceCoverDetailsComponent = (function () {
    function ServiceCoverDetailsComponent(serviceConstants, _httpService, utils, _logger, localeTranslateService) {
        this.serviceConstants = serviceConstants;
        this._httpService = _httpService;
        this.utils = utils;
        this._logger = _logger;
        this.localeTranslateService = localeTranslateService;
    }
    ServiceCoverDetailsComponent.prototype.ngOnInit = function () {
        this.localeTranslateService.setUpTranslation();
    };
    return ServiceCoverDetailsComponent;
}());
ServiceCoverDetailsComponent = __decorate([
    Component({
        templateUrl: 'iCABSAServiceCoverDetailSearch.html'
    }),
    __metadata("design:paramtypes", [ServiceConstants,
        HttpService,
        Utils,
        Logger,
        LocaleTranslationService])
], ServiceCoverDetailsComponent);
export { ServiceCoverDetailsComponent };
