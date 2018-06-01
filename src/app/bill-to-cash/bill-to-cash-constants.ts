/**
 * Constants -
 * c_s_SELECTOPTIONS - Contains all the options and their Routes; Set from menuOptions
 *  # Sample structure
 *  {[
 *      Deafult: 'Default option text'
 *      GroupNameKey: {
 *          title: 'Group Name'
 *          OptionNameKey: {
 *              text: 'Option to be displayed'
 *              route: 'Route to be travesered by the option'
 *          }
 *      }
 *  ]}
 * c_s_SELECTOPTIONSLIST - Contains list of all constants to be used in this module
 *
 */
const menuOptions: any = {
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

export class BillToCashConstants {
    static c_o_MENU_OPTIONS: Object = menuOptions;
    static c_o_MENU_OPTIONS_LIST: Array<Object> = [
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
    static c_o_TAB_LIST: Array<any> = [
        { title: 'Address - Invoice', active: true },
        { title: 'Address - Statement' },
        { title: 'General' },
        { title: 'EDI Invoicing' }
    ];
    static c_o_REQUEST_HEADERS: Object = {
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
    static c_o_REQUEST_PARAM_NAMES: Object = {
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
    static c_o_REQUEST_PARAM_VALUES: Object = {
        Invoice: 'Invoice',
        Statement: 'Statement'
    };
    static c_o_STORE_KEY_NAMES: Object = {
        CodeBusiness: 'business',
        CodeCountry: 'country',
        Tab: 'tab',
        RequestedAddressType: 'AddressType',
        AddressSelected: 'AddressSelected',
        Dropdown: 'dropdownComponents',
        AccountNumberChanged: 'AccountNumberChanged'
    };
    static c_o_SYSCHAR_PARAMS: Object = {
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
    static c_o_LOOKUP_PARAMS: Object = {
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
    static c_o_ELLIPSIS_MODAL_CONFIG = {
        backdrop: 'static',
        keyboard: true
    };
    static c_arr_GROUPBYVISITS_FORMAT_CODES = ['PM', 'PR'];
    static c_o_ROUTES_AND_MODES = {
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
            route: 'service/ContactPersonMaintenance',
            mode: 'InvoiceGroupInv'
        },
        ContactDetailsStat: {
            route: 'service/ContactPersonMaintenance',
            mode: 'InvoiceGroupStat'
        },
        GetAddress: {
            route: '',
            mode: ''
        }
    };
    static c_o_ADDRESS_TYPES: Object = {
        Premises: 'Premises',
        Account: 'Account',
        Invoice: 'Invoice',
        General: 'General'
    };
    static c_arr_CHECKPOSTCODE_PARAMS: Array<string> = [
        'Name',
        'AddressLine1',
        'AddressLine2',
        'AddressLine3',
        'AddressLine4',
        'AddressLine5',
        'Postcode'
    ];
    static c_o_ERROROBJECT_KEYS = {
        isLogRequired: 'isLogRequired',
        error: 'error',
        message: 'msg'
    };
}
