const NODE_ENV = process.env.NODE_ENV || "PROD";
process.env.MULE_LOGIN_API = 'https://api-emea.ri-gateway.com/nextgenui/1.0/api/x/auths/login';
process.env.CLIENT_ID = '952554226382-okuhqiiuua5r19suje98514m99f2729q.apps.googleusercontent.com';
process.env.SCOPE = 'profile email';
process.env.GA_TRACK_CODE = 'UA-93679236-4';
process.env.RESPONSE_TYPE = 'token';
process.env.REDIRECT_URL = 'http://localhost:3000/application/login';
process.env.OAUTH_URL = 'https://accounts.google.com/o/oauth2/auth?scope=';
process.env.PROFILE_URL = 'https://www.googleapis.com/plus/v1/people/me';
process.env.REVOKE_URL = 'https://accounts.google.com/o/oauth2/revoke?token=';
process.env.LOGOUT_URL = 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000';
process.env.TOKENINFO_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=';
process.env.LOOK_UP = 'lookup/data';
process.env.SYS_CHAR = 'settings/data';

process.env.USER_ACCESS_URL = "https://api-emea.ri-gateway.com/nextgenui/1.0/api/x/user/menu";
process.env.USER_CODE_URL = "https://api-emea.ri-gateway.com/nextgenui/1.0/api/x/user/information";
process.env.USER_ACCESS_POSTFIX = 'user/menu';
process.env.USER_CODE_POSTFIX = 'user/information';
process.env.ZIP_SEARCH_URL = "https://api-emea.ri-gateway.com/nextgenui/x/1.0/contract-management/search";
process.env.BASE_URL = 'https://api-emea.ri-gateway.com/nextgenui/1.0/api/x/';
process.env.BASE_URL_EUROPE = 'https://api-emea.ri-gateway.com/nextgenui/1.0/api/x/';
process.env.BASE_URL_AMERICA = 'https://api-na.ri-gateway.com/nextgenui/1.0/api/x/';
process.env.BASE_URL_AUSTRALIA = 'https://api-asia.ri-gateway.com/nextgenui/1.0/api/x/';
process.env.BASE_URL_PACIFIC = 'https://api-asia.ri-gateway.com/nextgenui/1.0/api/x/';
process.env.BASE_URL_ASIA = 'https://api-asia.ri-gateway.com/nextgenui/1.0/api/x/';
process.env.IMAGE_REPO_URL = 'assets/images/';

process.env.INVOICE_HISTORY = 'http://localhost:3030/api/contractInvoiceHistory';
process.env.CONTACT_SEARCH = 'https://api-emea.ri-gateway.com/nextgenui/1.0/api/x/';
process.env.BYPASS_MULE - false;
process.env.SCREEN_MEMORY_THRESOLD = 50;
process.env.FETCH_TRANSLATION_FROM_FIREBASE = true;
process.env.FETCH_LOCALIZATION_FROM_FIREBASE = true;
process.env.FIREBASE_TRANSLATION_URL = 'https://storage.googleapis.com/ri-newui-prod.appspot.com/i18n/';
process.env.FIREBASE_LOCALIZATION_URL = 'https://storage.googleapis.com/ri-newui-prod.appspot.com/';
/*process.env.FIREBASE_CONFIG = JSON.stringify({
    apiKey: "AIzaSyAO_6m4m8d0HAovjvIZiPS5raN8lu9COoc",
    authDomain: "ri-newui-stg-ac8c7.firebaseapp.com",
    databaseURL: "https://ri-newui-stg-ac8c7.firebaseio.com",
    projectId: "ri-newui-stg-ac8c7",
    storageBucket: "ri-newui-stg-ac8c7.appspot.com",
    messagingSenderId: "884561069214"
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
        },
        {
          "code": "America",
          "name": "America",
          "locale_key": "America"
        },
        {
          "code": "Australia",
          "name": "Australia",
          "locale_key": "Australia"
        },
        {
          "code": "Pacific",
          "name": "Pacific",
          "locale_key": "Pacific"
        },
        {
          "code": "Asia",
          "name": "Asia",
          "locale_key": "Asia"
        }
      ]
});

process.env.MULE_CLIENT_ID = 'bb35e1ef196d43379e6a167ee939da0a';
process.env.MULE_CLIENT_SECRET = '422E1f2cc5C944769eEdcc3c2eD9574c';
process.env.JIRA = 'https://rentokilinitial.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-9ng3ko/b/c/7ebd7d8b8f8cafb14c7b0966803e5701/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-UK&collectorId=2e3dc31f';

function appConfig() {
    /*console.log(process.env.BYPASS_MULE);
    if(process.env.BYPASS_MULE) {
        process.env.USER_CODE_URL = "http://localhost:3030/api/usercode";
        process.env.USER_ACCESS_URL = "http://localhost:3030/api/user_access";
    }*/


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
            'process.env.BASE_URL_PACIFIC': JSON.stringify(process.env.BASE_URL_PACIFIC),
            'process.env.BASE_URL_ASIA': JSON.stringify(process.env.BASE_URL_ASIA),
            'process.env.IMAGE_REPO_URL': JSON.stringify(process.env.IMAGE_REPO_URL),
            'process.env.INVOICE_HISTORY': JSON.stringify(process.env.INVOICE_HISTORY),
            'process.env.CONTACT_SEARCH': JSON.stringify(process.env.CONTACT_SEARCH),
            'process.env.LOOK_UP': JSON.stringify(process.env.LOOK_UP),
            'process.env.SYS_CHAR': JSON.stringify(process.env.SYS_CHAR),
            'process.env.MULE_CLIENT_ID': JSON.stringify(process.env.MULE_CLIENT_ID),
            'process.env.MULE_CLIENT_SECRET': JSON.stringify(process.env.MULE_CLIENT_SECRET),
            'process.env.JIRA': JSON.stringify(process.env.JIRA)
                /*'process.env.LOCALES': JSON.stringify(process.env.LOCALES)*/
        }
    };
    return apiURL;
}

exports.appConfig = appConfig;
