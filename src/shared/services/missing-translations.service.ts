import { MissingTranslationHandler, MissingTranslationHandlerParams } from 'ng2-translate';
import { GlobalConstant } from './../constants/global.constant';

export class ICabsMissingTranslationHandler implements MissingTranslationHandler {
    handle(params: any): string {
    let value = '';
    if (params.translateService.translations[params.translateService.currentLang]) {
        value = params.translateService.translations[params.translateService.currentLang][params.key];
    }
    if ((value === null || value === undefined) && GlobalConstant.Configuration.DefaultTranslation) {
        value = GlobalConstant.Configuration.DefaultTranslation[params.key.toString()];
    }
    if (value === null || value === undefined) {
        value = params.key.toString();
        //console.log('MISSING TRANSLATIONS ' + value);
    }
        return value;
    }

}
