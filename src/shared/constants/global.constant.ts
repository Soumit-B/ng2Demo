import { Injectable } from '@angular/core';

@Injectable()
export class GlobalConstant {

    /* public static eTypeDate: number = 10;
     public static eTypeInteger = 0;
     public static eTypeText = 1;
     public static eTypeCode = 2;
     public static eTypeCheckBox = 3;
     public static eTypeDate = 4;
     public static eTypeDateNow = 5;
     public static eTypeHours = 6;
     public static eTypeTime = 7;
     public static eTypeTimeNow = 8;
     public static eTypeCurrency = 9;
     public static eTypeDecimal1 = 10;
     public static eTypeDecimal2 = 11;
     public static eTypeDecimal3 = 12;
     public static eTypeDecimal4 = 13;
     public static eTypeDecimal5 = 14;
     public static eTypeDecimal6 = 15;
     public static eTypeAutoNumber = 16;
     public static eTypeImage = 17;
     public static eTypeButton = 18;
     public static eTypeTextFree = 19;   //Only Supported By riControl
     public static eTypeMinutes = 20;    //Not supported by riControlGrid at Present
     public static eTypeCodeNumeric = 21;
     public static eTypeCodeNumericAutoNumber = 22;
     public static eTypeEMail = 23;*/

    public static Configuration =
    {
        DefaultLocale: 'en-GB',
        DefaultTranslation: null,
        SupportedTranslation: [],
        DefaultLocaleUrl: 'assets/i18n/',
        LocaleUrl: 'i18n/translations/',
        CldrSupplementalUrl: 'i18n/cldr-data/supplemental/',
        CldrMainUrl: 'i18n/cldr-data/main/',
        ParserUrl: 'i18n/cultures/',
        ParserPrefix: 'globalize.culture.',
        DateLocaleUrl: 'i18n/datejs/',
        DateLocalePrefix: 'date-',
        Yes: 'YES',
        No: 'NO',
        Dev: 'DEV',
        Prod: 'PROD',
        Failure: 'failure',
        Format: {
            Time: 'Time'
        },
        BackText: '< Back',
        All: 'All',
        ENG: 'ENG',
        AppName: 'iCabs',
        Home: 'postlogin',
        Valid: 'VALID'
    };

    public AppConstants(): any {
        return {
            'tableConfig': {
                'itemsPerPage': 10
            },
            'paginationConfig': {
                'maxSize': 5,
                'defaultStartPage': 1,
                'previousText': '<',
                'nextText': '>',
                'firstText': '<<',
                'lastText': '>>',
                'boundaryLinks': true,
                'directionLinks': true

            },
            'inputTypeConfig': {
                'radio': 'radio',
                'checkbox': 'checkbox',
                'text': 'text',
                'number': 'number',
                'url': 'url',
                'tel': 'tel'
            },
            'urlConstant': {
                'zipSearchUrl': 'content/json/zipSearch.json',
                'countrySearchUrl': 'content/json/countrySearch.json',
                'paymentTypeSearchUrl': 'content/json/paymentTypeSearch.json',
                'contractServiceSummaryUrl': 'content/json/contractServiceSummary.json'
            },
            'tabsConfig': {
                'accountMaintenance': {
                    'tabsList': [{ 'title': 'Address', 'templateUrl': 'template-1.html', 'disabled': false },
                    { 'title': 'Account Management', 'templateUrl': 'template-1.html', 'disabled': false },
                    { 'title': 'General', 'templateUrl': 'template-1.html', 'disabled': false },
                    { 'title': 'Bank Details', 'templateUrl': 'template-1.html', 'disabled': false },
                    { 'title': 'EDI Invoicing', 'templateUrl': 'template-1.html', 'disabled': false },
                    { 'title': 'Invoice Text', 'templateUrl': 'template-1.html', 'disabled': false },
                    { 'title': 'Telesales', 'templateUrl': 'template-1.html', 'disabled': false },
                    { 'title': 'Address', 'templateUrl': 'template-1.html', 'disabled': false }],
                    'defaultActiveTab': 0
                }
            },
            'defaultFormatSize': 9
        };
    }
}
