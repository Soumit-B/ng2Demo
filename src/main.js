import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import './shared/styles/style.scss';
if (process.env.FETCH_TRANSLATION_FROM_FIREBASE) {
    window['firebase'].initializeApp(JSON.parse(process.env.FIREBASE_CONFIG));
}
if (process.env.NODE_ENV === 'PROD') {
    enableProdMode();
}
if (process.env.NODE_ENV === 'STAGE') {
    require('./shared/styles/stage.style.scss');
    enableProdMode();
}
if (process.env.NODE_ENV === 'DEV') {
    require('./shared/styles/dev.style.scss');
}
if (process.env.NODE_ENV === 'QA') {
    require('./shared/styles/sit.style.scss');
    enableProdMode();
}
if (process.env.NODE_ENV === 'BACKUP') {
    require('./shared/styles/bkp.style.scss');
}
document.addEventListener('DOMContentLoaded', function () {
    platformBrowserDynamic().bootstrapModule(AppModule);
});
