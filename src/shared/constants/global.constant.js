import { Injectable } from '@angular/core';
export var GlobalConstant = (function () {
    function GlobalConstant() {
    }
    GlobalConstant.prototype.AppConstants = function () {
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
    };
    GlobalConstant.Configuration = {
        DefaultLocale: 'en-GB',
        DefaultTranslation: null,
        SupportedTranslation: [],
        DefaultLocaleUrl: 'assets/i18n/',
        LocaleUrl: 'i18n/',
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
        Home: 'postlogin'
    };
    GlobalConstant.decorators = [
        { type: Injectable },
    ];
    GlobalConstant.ctorParameters = [];
    return GlobalConstant;
}());
