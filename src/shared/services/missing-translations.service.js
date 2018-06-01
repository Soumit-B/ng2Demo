import { GlobalConstant } from './../constants/global.constant';
export var ICabsMissingTranslationHandler = (function () {
    function ICabsMissingTranslationHandler() {
    }
    ICabsMissingTranslationHandler.prototype.handle = function (params) {
        var value = '';
        if (params.translateService.translations[params.translateService.currentLang]) {
            value = params.translateService.translations[params.translateService.currentLang][params.key];
        }
        if ((value === null || value === undefined) && GlobalConstant.Configuration.DefaultTranslation) {
            value = GlobalConstant.Configuration.DefaultTranslation[params.key.toString()];
        }
        if (value === null || value === undefined) {
            value = params.key.toString();
        }
        return value;
    };
    return ICabsMissingTranslationHandler;
}());
