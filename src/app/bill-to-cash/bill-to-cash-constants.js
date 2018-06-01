var menuOptions = {
    Default: 'Options',
    Portfolio: {
        title: 'Portfolio',
        ContractDetailsInvoice: {
            text: 'Contact Details - Invoice',
            route: ''
        },
        ContractDetailsStatemnt: {
            text: 'Contact Details - Statement',
            route: ''
        },
        ShowPremises: {
            text: 'Show Premises',
            route: ''
        },
        AddPremises: {
            text: 'Add Premises',
            route: ''
        }
    },
    Invoicing: {
        title: 'Invoicing',
        InvoiceNarrative: {
            text: 'Invoice Narrative',
            route: ''
        },
        InvoiceHistory: {
            text: 'Invoice History',
            route: ''
        }
    }
};
export var BillToCashConstants = (function () {
    function BillToCashConstants() {
    }
    BillToCashConstants.c_o_MENU_OPTIONS = menuOptions;
    BillToCashConstants.c_o_MENU_OPTIONS_LIST = [
        { title: '', list: [menuOptions.Default] },
        {
            title: menuOptions.Portfolio.title,
            list: [
                menuOptions.Portfolio.ContractDetailsInvoice.text,
                menuOptions.Portfolio.ContractDetailsStatemnt.text,
                menuOptions.Portfolio.ShowPremises.text,
                menuOptions.Portfolio.AddPremises.text
            ]
        },
        {
            title: menuOptions.Invoicing.title,
            list: [
                menuOptions.Invoicing.InvoiceNarrative.text,
                menuOptions.Invoicing.InvoiceHistory.text
            ]
        }
    ];
    BillToCashConstants.c_o_TAB_LIST = [
        { title: 'Address - Invoice', active: true },
        { title: 'Address - Statement' },
        { title: 'General' },
        { title: 'EDI Invoicing' }
    ];
    BillToCashConstants.c_o_REQUEST_HEADERS = {
        InvoiceGroupMaintenance: {
            method: 'contract-management/maintenance',
            module: 'invoice-group',
            operation: 'Application/iCABSAInvoiceGroupMaintenance'
        },
        InvoiceGroupGrid: {
            method: 'contract-management/maintenance',
            module: 'invoice-group',
            operation: 'Application/iCABSAInvoiceGroupGrid'
        }
    };
    BillToCashConstants.c_o_REQUEST_PARAM_NAMES = {
        InvoiceGroupNumber: 'InvoiceGroupNumber',
        Function: 'Function',
        PostCode: 'Postcode',
        Town: 'Town',
        State: 'State',
        PaymentTypeCode: 'PaymentTypeCode',
        Detail: 'Detail',
        ExOAMandateReference: 'ExOAMandateReference',
        OutsortInvoice: 'OutsortInvoice'
    };
    BillToCashConstants.c_o_REQUEST_PARAM_VALUES = {
        Invoice: 'Invoice',
        Statement: 'Statement'
    };
    BillToCashConstants.c_o_STORE_KEY_NAMES = {
        CodeBusiness: 'business',
        CodeCountry: 'country',
        Tab: 'tab',
        RequestedAddressType: 'AddressType',
        AddressSelected: 'AddressSelected',
        Dropdown: 'dropdownComponents',
        AccountNumberChanged: 'AccountNumberChanged'
    };
    BillToCashConstants.c_o_SYSCHAR_PARAMS = {
        InvoiceGroupMaintenance: {
            vSCEnableAddressLine3: '',
            vSCAddressLine3Logical: '',
            vSCEnableMaxAddress: '',
            vSCEnableMaxAddressValue: '',
            vSCEnableInvoiceFee: '',
            vDisableFieldList: '',
            vSCEnableHopewiserPAF: '',
            vSCEnableDatabasePAF: '',
            vSCAddressLine4Required: '',
            vSCAddressLine4Logical: '',
            vSCAddressLine5Required: '',
            vSCAddressLine5Logical: '',
            vSCPostCodeRequired: '',
            vSCPostCodeMustExistInPAF: '',
            vSCRunPAFSearchOn1stAddressLine: '',
            vSCCapitalFirstLtr: '',
            vSCInvoiceShowProductDetail: '',
            vEnablePostcodeDefaulting: '',
            vSCEnableValidatePostcodeSuburb: '',
            vSCEnablePostcodeSuburbLog: '',
            vSCEnableGPSCoordinates: '',
            vSCHidePostcode: '',
            vSCPrintEDIInvoices: '',
            vSCPrintOnlySelectedEDIInvoices: '',
            vSCEnablePayTypeAtInvGroupLev: '',
            vSCMultiContactInd: '',
            vSCOAMandateRequired: ''
        }
    };
    BillToCashConstants.c_o_LOOKUP_PARAMS = {
        InvoiceGroupMaintenance: {
            details: [{
                    'table': 'Account',
                    'query': {
                        'AccountNumber': '',
                        'BusinessCode': ''
                    },
                    'fields': ['AccountName']
                },
                {
                    'table': 'SystemInvoiceIssueTypeLang',
                    'query': {
                        'InvoiceIssueTypeCode': '',
                        'LanguageCode': ''
                    },
                    'fields': ['SystemInvoiceIssueTypeDesc']
                },
                {
                    'table': 'SystemInvoiceFormatLang',
                    'query': {
                        'SystemInvoiceFormatCode': '',
                        'LanguageCode': ''
                    },
                    'fields': ['SystemInvoiceFormatDesc']
                },
                {
                    'table': 'Currency',
                    'query': {
                        'CurrencyCode': ''
                    },
                    'fields': [
                        'CurrencyDesc'
                    ]
                },
                {
                    'table': 'PaymentTerm',
                    'query': {
                        'PaymentTermCode': '',
                        'BusinessCode': ''
                    },
                    'fields': [
                        'PaymentTermDesc'
                    ]
                },
                {
                    'table': 'Language',
                    'query': {
                        'LanguageCode': ''
                    },
                    'fields': [
                        'LanguageDescription'
                    ]
                },
                {
                    'table': 'InvoiceFee',
                    'query': {
                        'InvoiceFeeCode': ''
                    },
                    'fields': [
                        'InvoiceFeeDesc'
                    ]
                }]
        }
    };
    BillToCashConstants.c_o_ELLIPSIS_MODAL_CONFIG = {
        backdrop: 'static',
        keyboard: true
    };
    BillToCashConstants.c_arr_GROUPBYVISITS_FORMAT_CODES = ['PM', 'PR'];
    BillToCashConstants.c_o_ROUTES_AND_MODES = {
        InvoiceGroupMainetenance: {
            route: 'billtocash/maintenance/invoicegroup/search',
            mode: 'IGSearchAdd'
        },
        PostCodeSearch: {
            route: '',
            mode: 'Statement'
        },
        GetPremisesAddress: {
            route: '',
            mode: 'InvoiceGroupMaintenance'
        },
        ContactDetailsInv: {
            route: 'application/ContactPersonMaintenance',
            mode: 'InvoiceGroupInv'
        },
        ContactDetailsStat: {
            route: 'application/ContactPersonMaintenance',
            mode: 'InvoiceGroupStat'
        },
        GetAddress: {
            route: '',
            mode: ''
        }
    };
    BillToCashConstants.c_o_ADDRESS_TYPES = {
        Premises: 'Premises',
        Account: 'Account',
        Invoice: 'Invoice',
        General: 'General'
    };
    BillToCashConstants.c_arr_CHECKPOSTCODE_PARAMS = [
        'Name',
        'AddressLine1',
        'AddressLine2',
        'AddressLine3',
        'AddressLine4',
        'AddressLine5',
        'Postcode'
    ];
    BillToCashConstants.c_o_ERROROBJECT_KEYS = {
        isLogRequired: 'isLogRequired',
        error: 'error',
        message: 'msg'
    };
    return BillToCashConstants;
}());
