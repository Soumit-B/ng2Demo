const NODE_ENV = process.env.NODE_ENV;
process.env.MULE_LOGIN_API = 'https://api-dev.ri-gateway.com/nextgenui/1.0/api/x/auths/login';
/*process.env.CLIENT_ID = '214057518929-bckr9lktfa141r26at7ft89j7da16vq0.apps.googleusercontent.com';*/
process.env.CLIENT_ID = '952554226382-okuhqiiuua5r19suje98514m99f2729q.apps.googleusercontent.com';
process.env.SCOPE = 'profile email';
process.env.GA_TRACK_CODE = 'UA-93679236-1';
process.env.RESPONSE_TYPE = 'token';
process.env.REDIRECT_URL = 'http://localhost:3000/application/login';
process.env.OAUTH_URL = 'https://accounts.google.com/o/oauth2/auth?scope=';
process.env.PROFILE_URL = 'https://www.googleapis.com/plus/v1/people/me';
process.env.REVOKE_URL = 'https://accounts.google.com/o/oauth2/revoke?token=';
process.env.LOGOUT_URL = 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000';
process.env.TOKENINFO_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=';
process.env.LOOK_UP = 'lookup/data';
process.env.SYS_CHAR = 'settings/data';

process.env.USER_ACCESS_URL = 'https://api-dev.ri-gateway.com/nextgenui/1.0/api/x/user/menu';
process.env.USER_CODE_URL = 'https://api-dev.ri-gateway.com/nextgenui/1.0/api/x/user/information';
process.env.USER_ACCESS_POSTFIX = 'user/menu';
process.env.USER_CODE_POSTFIX = 'user/information';
process.env.ZIP_SEARCH_URL = 'https://api-dev.ri-gateway.com/nextgenui/x/1.0/contract-management/search';
process.env.BASE_URL_EUROPE = 'https://api-dev.ri-gateway.com/nextgenui/1.0/api/x/';
process.env.BASE_URL_AMERICA = 'https://api-dev.ri-gateway.com/nextgenui/1.0/api/x/';
process.env.BASE_URL_AUSTRALIA = 'https://api-dev.ri-gateway.com/nextgenui/1.0/api/x/';
process.env.BASE_URL_ASIA = 'https://api-dev.ri-gateway.com/nextgenui/1.0/api/x/';
process.env.IMAGE_REPO_URL = 'assets/images/';

process.env.INVOICE_HISTORY = 'http://localhost:3030/api/contractInvoiceHistory';
process.env.CONTACT_SEARCH = 'https://api-dev.ri-gateway.com/nextgenui/x/';
process.env.BYPASS_MULE = false;
process.env.SCREEN_MEMORY_THRESOLD = 50;
process.env.FETCH_TRANSLATION_FROM_FIREBASE = true;
process.env.FETCH_LOCALIZATION_FROM_FIREBASE = false;
process.env.FIREBASE_TRANSLATION_URL = 'https://storage.googleapis.com/ri-newui-dev.appspot.com/i18n/';
process.env.FIREBASE_LOCALIZATION_URL = 'https://storage.googleapis.com/ri-newui-next-dev.appspot.com/';
/*process.env.FIREBASE_CONFIG = JSON.stringify({
    apiKey: 'AIzaSyD4F2vzfc_oJqWnV5pBBsLNvH088gBqej8',
    authDomain: 'ri-newui-dev.firebaseapp.com',
    databaseURL: 'https://ri-newui-dev.firebaseio.com',
    projectId: 'ri-newui-dev',
    storageBucket: 'ri-newui-dev.appspot.com',
    messagingSenderId: '702008133360'
});*/
process.env.DEFAULT_LOCALE = JSON.stringify({
    'name': 'English (UK)',
    'localeKey': '',
    'language': 'English',
    'country': 'UK',
    'languageCode': 'en',
    'countryCode': 'GB',
    'localeCode': 'en-GB',
    'iCABSLanguageCode': 'ENG',
    'globalizeLocaleCode': 'en-GB',
    'dateLocaleCode': 'en-GB',
    'currencyCode': 'GBP',
    'globalizeParserLocaleCode': 'en-GB'
});
process.env.REGIONS = JSON.stringify({
    "localeRegionList": [
        {
            "code": "Select Region",
            "name": "Select Region",
            "locale_key": "Select Region"
        },
        {
            "code": "Europe",
            "name": "Europe",
            "locale_key": "Europe"
        }
    ]
});

process.env.MULE_CLIENT_ID = '7483b073ee5446218a0747026b1c0aed';
process.env.MULE_CLIENT_SECRET = 'ed8b3cf7ff234038863E7DE006BF4285';
process.env.JIRA = '';

/*process.env.MULE_CLIENT_ID = 'e12d3a8c044241bd914bee403c71ec12';
process.env.MULE_CLIENT_SECRET = '846bccb2257d43639E783C2126E5BD07';*/


function appConfig() {
    if (process.env.BYPASS_MULE.toString() === 'true') {
        process.env.USER_CODE_URL = 'http://localhost:3030/api/usercode';
        process.env.USER_ACCESS_URL = 'http://localhost:3030/api/user_access';
        process.env.MULE_LOGIN_API = 'http://localhost:3030/api/mule_auth';
        process.env.BASE_URL = 'http://localhost:3030/api/';
    }

    var baseUrl = 'http://localhost:3030/api/';
    var apiURL = {
        api: {
            gauth: baseUrl + 'gauth',
            sevice1: baseUrl + 'service',
            test: baseUrl + 'test'
        },
        urls: {
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
            'process.env.MULE_LOGIN_API': JSON.stringify(process.env.MULE_LOGIN_API),
            'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
            'process.env.SCOPE': JSON.stringify(process.env.SCOPE),
            'process.env.GA_TRACK_CODE': JSON.stringify(process.env.GA_TRACK_CODE),
            'process.env.RESPONSE_TYPE': JSON.stringify(process.env.RESPONSE_TYPE),
            'process.env.REDIRECT_URL': JSON.stringify(process.env.REDIRECT_URL),
            'process.env.OAUTH_URL': JSON.stringify(process.env.OAUTH_URL),
            'process.env.PROFILE_URL': JSON.stringify(process.env.PROFILE_URL),
            'process.env.REVOKE_URL': JSON.stringify(process.env.REVOKE_URL),
            'process.env.LOGOUT_URL': JSON.stringify(process.env.LOGOUT_URL),
            'process.env.PROFILE_URL': JSON.stringify(process.env.MULE_API),
            'process.env.TOKENINFO_URL': JSON.stringify(process.env.TOKENINFO_URL),
            'process.env.USER_CODE_URL': JSON.stringify(process.env.USER_CODE_URL),
            'process.env.USER_ACCESS_URL': JSON.stringify(process.env.USER_ACCESS_URL),
            'process.env.USER_CODE_POSTFIX': JSON.stringify(process.env.USER_CODE_POSTFIX),
            'process.env.USER_ACCESS_POSTFIX': JSON.stringify(process.env.USER_ACCESS_POSTFIX),
            'process.env.ZIP_SEARCH_URL': JSON.stringify(process.env.ZIP_SEARCH_URL),
            'process.env.BYPASS_MULE': process.env.BYPASS_MULE,
            'process.env.SCREEN_MEMORY_THRESOLD': process.env.SCREEN_MEMORY_THRESOLD,
            'process.env.FETCH_TRANSLATION_FROM_FIREBASE': process.env.FETCH_TRANSLATION_FROM_FIREBASE,
            'process.env.FETCH_LOCALIZATION_FROM_FIREBASE': process.env.FETCH_LOCALIZATION_FROM_FIREBASE,
            'process.env.FIREBASE_TRANSLATION_URL': JSON.stringify(process.env.FIREBASE_TRANSLATION_URL),
            'process.env.FIREBASE_LOCALIZATION_URL': JSON.stringify(process.env.FIREBASE_LOCALIZATION_URL),
            'process.env.FIREBASE_CONFIG': JSON.stringify(process.env.FIREBASE_CONFIG),
            'process.env.DEFAULT_LOCALE': JSON.stringify(process.env.DEFAULT_LOCALE),
            'process.env.REGIONS': JSON.stringify(process.env.REGIONS),
            'process.env.BASE_URL_EUROPE': JSON.stringify(process.env.BASE_URL_EUROPE),
            'process.env.BASE_URL_AMERICA': JSON.stringify(process.env.BASE_URL_AMERICA),
            'process.env.BASE_URL_AUSTRALIA': JSON.stringify(process.env.BASE_URL_AUSTRALIA),
            'process.env.BASE_URL_ASIA': JSON.stringify(process.env.BASE_URL_ASIA),
            'process.env.IMAGE_REPO_URL': JSON.stringify(process.env.IMAGE_REPO_URL),
            'process.env.INVOICE_HISTORY': JSON.stringify(process.env.INVOICE_HISTORY),
            'process.env.CONTACT_SEARCH': JSON.stringify(process.env.CONTACT_SEARCH),
            'process.env.LOOK_UP': JSON.stringify(process.env.LOOK_UP),
            'process.env.SYS_CHAR': JSON.stringify(process.env.SYS_CHAR),
            'process.env.MULE_CLIENT_ID': JSON.stringify(process.env.MULE_CLIENT_ID),
            'process.env.MULE_CLIENT_SECRET': JSON.stringify(process.env.MULE_CLIENT_SECRET),
            'process.env.JIRA': JSON.stringify(process.env.JIRA)
            /* 'process.env.LOCALES': JSON.stringify(process.env.LOCALES)*/
        }
    };
    return apiURL;
}

exports.appConfig = appConfig;
