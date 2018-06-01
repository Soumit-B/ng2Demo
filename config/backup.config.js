const NODE_ENV = process.env.NODE_ENV;
process.env.MULE_LOGIN_API = 'http://10.102.6.253:8665/nextgenui/1.0/api/x/auths/login';
process.env.CLIENT_ID = '214057518929-bckr9lktfa141r26at7ft89j7da16vq0.apps.googleusercontent.com';
process.env.SCOPE = 'profile email';
process.env.GA_TRACK_CODE = 'UA-93481714-1';
process.env.RESPONSE_TYPE = 'token';
process.env.REDIRECT_URL = 'http://localhost:3000/application/login';
process.env.OAUTH_URL = 'https://accounts.google.com/o/oauth2/auth?scope=';
process.env.PROFILE_URL = 'https://www.googleapis.com/plus/v1/people/me';
process.env.REVOKE_URL = 'https://accounts.google.com/o/oauth2/revoke?token=';
process.env.LOGOUT_URL = 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000';
process.env.TOKENINFO_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=';
process.env.LOOK_UP = 'lookup/data';
process.env.SYS_CHAR = 'settings/data';

process.env.USER_ACCESS_URL = 'http://10.102.6.253:8665/nextgenui/1.0/api/x/user/menu';
process.env.USER_CODE_URL = 'http://10.102.6.253:8665/nextgenui/1.0/api/x/user/information';
process.env.ZIP_SEARCH_URL = 'http://10.102.6.253:8665/nextgenui/1.0/api/x/contract-management/search';
process.env.BASE_URL = 'http://10.102.6.253:8665/nextgenui/1.0/api/x/';
process.env.BASE_URL_EUROPE = 'http://10.102.6.253:8665/nextgenui/1.0/api/x/';
process.env.BASE_URL_AMERICA = 'http://10.102.6.253:8665/nextgenui/1.0/api/x/';
process.env.BASE_URL_AUSTRALIA = 'http://10.102.6.253:8665/nextgenui/1.0/api/x/';
process.env.BASE_URL_ASIA = 'http://10.102.6.253:8665/nextgenui/1.0/api/x/';
process.env.IMAGE_REPO_URL = 'http://10.117.192.160:9090/Images/';

process.env.INVOICE_HISTORY = 'http://localhost:3030/api/contractInvoiceHistory';
process.env.CONTACT_SEARCH = 'http://10.102.6.253:8665/nextgenui/1.0/api/x/';
process.env.BYPASS_MULE = false;
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
          "code": "Asia",
          "name": "Asia",
          "locale_key": "Asia"
        }
      ]
});

console.log('Inside backup.config');

function appConfig() {
    console.log(process.env.BYPASS_MULE.toString());
    console.log(process.env.USER_CODE_URL);
    if (process.env.BYPASS_MULE.toString() === 'true') {
        process.env.USER_CODE_URL = 'http://localhost:3030/api/usercode';
        process.env.USER_ACCESS_URL = 'http://localhost:3030/api/user_access';
        process.env.MULE_LOGIN_API = 'http://localhost:3030/api/mule_auth';
        process.env.BASE_URL = 'http://localhost:3030/api/';
    }

    console.log(process.env.USER_CODE_URL);
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
            'process.env.ZIP_SEARCH_URL': JSON.stringify(process.env.ZIP_SEARCH_URL),
            'process.env.BYPASS_MULE': process.env.BYPASS_MULE,
            'process.env.REGIONS': JSON.stringify(process.env.REGIONS),
            'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
            'process.env.BASE_URL_EUROPE': JSON.stringify(process.env.BASE_URL_EUROPE),
            'process.env.BASE_URL_AMERICA': JSON.stringify(process.env.BASE_URL_AMERICA),
            'process.env.BASE_URL_AUSTRALIA': JSON.stringify(process.env.BASE_URL_AUSTRALIA),
            'process.env.BASE_URL_ASIA': JSON.stringify(process.env.BASE_URL_ASIA),
            'process.env.IMAGE_REPO_URL': JSON.stringify(process.env.IMAGE_REPO_URL),
            'process.env.INVOICE_HISTORY': JSON.stringify(process.env.INVOICE_HISTORY),
            'process.env.CONTACT_SEARCH': JSON.stringify(process.env.CONTACT_SEARCH),
            'process.env.LOOK_UP': JSON.stringify(process.env.LOOK_UP),
            'process.env.SYS_CHAR': JSON.stringify(process.env.SYS_CHAR)
            /* 'process.env.LOCALES': JSON.stringify(process.env.LOCALES)*/
        }
    };
    return apiURL;
}

exports.appConfig = appConfig;