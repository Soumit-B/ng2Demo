import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Root module
import { AppModule } from './app.module';

// shared styles
import './shared/styles/style.scss';

/*if (process.env.FETCH_TRANSLATION_FROM_FIREBASE) {
    window['firebase'].initializeApp(JSON.parse(process.env.FIREBASE_CONFIG));
}*/

if (process.env.NODE_ENV === 'PRODLIVE') {
    enableProdMode();
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = process.env.JIRA;
    head.appendChild(script);
}
if (process.env.NODE_ENV === 'PROD') {
    require('./shared/styles/stage.style.scss');
    enableProdMode();
}
if (process.env.NODE_ENV === 'DEV') {
    require('./shared/styles/dev.style.scss');
    //enableProdMode();
}
if (process.env.NODE_ENV === 'QA') {
    require('./shared/styles/sit.style.scss');
    enableProdMode();
}
if (process.env.NODE_ENV === 'DEVONQA') {
    require('./shared/styles/sit.style.scss');
    enableProdMode();
}
if (process.env.NODE_ENV === 'DEVONSG') {
    require('./shared/styles/stage.style.scss');
    enableProdMode();
}
if (process.env.NODE_ENV === 'BACKUP') {
    require('./shared/styles/bkp.style.scss');
    //enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic().bootstrapModule(AppModule);
});
