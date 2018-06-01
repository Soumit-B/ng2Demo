import { CallCenterActionTypes } from '../actions/call-centre-search';
var initialState = {
    data: {},
    syschars: {},
    services: {},
    code: {},
    params: {},
    otherParams: {},
    formGroup: {
        main: false,
        tabAccounts: false,
        tabLogs: false,
        tabContracts: false,
        tabDashboard: false,
        tabDlContract: false,
        tabEventHistory: false,
        tabHistory: false,
        tabInvoices: false,
        tabPremises: false,
        tabWorkOrders: false
    },
    fieldRequired: {},
    fieldVisibility: {
        main: false,
        tabAccounts: false,
        tabLogs: false,
        tabContracts: false,
        tabDashboard: false,
        tabDlContract: false,
        tabEventHistory: false,
        tabHistory: false,
        tabInvoices: false,
        tabPremises: false,
        tabWorkOrders: false,
        initialLoadComplete: false
    },
    dateVisibility: {
        main: false,
        tabAccounts: false,
        tabLogs: false,
        tabContracts: false,
        tabDashboard: false,
        tabDlContract: false,
        tabEventHistory: false,
        tabHistory: false,
        tabInvoices: false,
        tabPremises: false,
        tabWorkOrders: false
    },
    dateObjects: {
        main: false,
        tabAccounts: false,
        tabLogs: false,
        tabContracts: false,
        tabDashboard: false,
        tabDlContract: false,
        tabEventHistory: false,
        tabHistory: false,
        tabInvoices: false,
        tabPremises: false,
        tabWorkOrders: false
    },
    initialization: {
        tabAccounts: false,
        tabLogs: false,
        tabContracts: false,
        tabDashboard: false,
        tabDlContract: false,
        tabEventHistory: false,
        tabHistory: false,
        tabInvoices: false,
        tabPremises: false,
        tabWorkOrders: false,
        initialLoadComplete: false
    },
    dropdownList: {
        tabAccounts: false,
        tabLogs: false,
        tabContracts: false,
        tabDashboard: false,
        tabDlContract: false,
        tabEventHistory: false,
        tabHistory: false,
        tabInvoices: false,
        tabPremises: false,
        tabWorkOrders: false
    },
    functions: {
        main: false,
        tabAccounts: false,
        tabLogs: false,
        tabContracts: false,
        tabDashboard: false,
        tabDlContract: false,
        tabEventHistory: false,
        tabHistory: false,
        tabInvoices: false,
        tabPremises: false,
        tabWorkOrders: false
    },
    pagination: {
        main: 1,
        tabAccounts: 1,
        tabLogs: 1,
        tabContracts: 1,
        tabDashboard: 1,
        tabDlContract: 1,
        tabEventHistory: 1,
        tabHistory: 1,
        tabInvoices: 1,
        tabPremises: 1,
        tabWorkOrders: 1
    },
    refresh: {
        tabAccounts: false,
        tabLogs: false,
        tabContracts: false,
        tabDashboard: false,
        tabDlContract: false,
        tabEventHistory: false,
        tabHistory: false,
        tabInvoices: false,
        tabPremises: false,
        tabWorkOrders: false,
        initialLoadComplete: false
    },
    index: {
        main: {},
        tabAccounts: {},
        tabLogs: {},
        tabContracts: {},
        tabDashboard: {},
        tabDlContract: {},
        tabEventHistory: {},
        tabHistory: {},
        tabInvoices: {},
        tabPremises: {},
        tabWorkOrders: {}
    },
    tabsTranslation: {},
    errorMessage: '',
    promptErrorMessage: '',
    action: '',
    functionParams: [],
    printInvoice: [],
    emailInvoice: [],
    gridToBuild: [],
    gridToClear: [],
    allowAjaxOnDateChange: false,
    subject: ''
};
export function storeFunction(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case CallCenterActionTypes.SAVE_DATA:
            state = Object.assign({}, state, {
                data: action.payload,
                action: CallCenterActionTypes.SAVE_DATA
            });
            return state;
        case CallCenterActionTypes.SAVE_SYSCHAR:
            state = Object.assign({}, state, {
                syschars: action.payload,
                action: CallCenterActionTypes.SAVE_SYSCHAR
            });
            return state;
        case CallCenterActionTypes.SAVE_PARAMS:
            state = Object.assign({}, state, {
                params: action.payload,
                action: CallCenterActionTypes.SAVE_PARAMS
            });
            return state;
        case CallCenterActionTypes.SAVE_OTHER_PARAMS:
            state = Object.assign({}, state, {
                otherParams: action.payload,
                action: CallCenterActionTypes.SAVE_OTHER_PARAMS
            });
            return state;
        case CallCenterActionTypes.SAVE_REQUIRED_FIELD:
            state = Object.assign({}, state, {
                fieldRequired: Object.assign({}, state.fieldRequired, action.payload),
                action: CallCenterActionTypes.SAVE_REQUIRED_FIELD
            });
            return state;
        case CallCenterActionTypes.SAVE_VISIBILITY_FIELD:
            state = Object.assign({}, state, {
                fieldVisibility: Object.assign({}, state.fieldVisibility, action.payload),
                action: CallCenterActionTypes.SAVE_VISIBILITY_FIELD
            });
            return state;
        case CallCenterActionTypes.SAVE_DATE_VISIBILITY:
            state = Object.assign({}, state, {
                dateVisibility: Object.assign({}, state.dateVisibility, action.payload),
                action: CallCenterActionTypes.SAVE_DATE_VISIBILITY
            });
            return state;
        case CallCenterActionTypes.SAVE_DATE_OBJECTS:
            state = Object.assign({}, state, {
                dateObjects: Object.assign({}, state.dateObjects, action.payload),
                action: CallCenterActionTypes.SAVE_DATE_OBJECTS
            });
            return state;
        case CallCenterActionTypes.SAVE_SERVICE:
            state = Object.assign({}, state, {
                services: action.payload,
                action: CallCenterActionTypes.SAVE_SERVICE
            });
            return state;
        case CallCenterActionTypes.FORM_GROUP:
            state = Object.assign({}, state, {
                formGroup: Object.assign({}, state.formGroup, action.payload),
                action: CallCenterActionTypes.FORM_GROUP
            });
            return state;
        case CallCenterActionTypes.SAVE_FUNCTIONS:
            state = Object.assign({}, state, {
                functions: Object.assign({}, state.functions, action.payload),
                action: CallCenterActionTypes.SAVE_FUNCTIONS
            });
            return state;
        case CallCenterActionTypes.SAVE_DROPDOWN_LIST:
            state = Object.assign({}, state, {
                dropdownList: Object.assign({}, state.dropdownList, action.payload),
                action: CallCenterActionTypes.SAVE_DROPDOWN_LIST
            });
            return state;
        case CallCenterActionTypes.INITIALIZATION:
            state = Object.assign({}, state, {
                initialization: Object.assign({}, state.initialization, action.payload),
                action: CallCenterActionTypes.INITIALIZATION
            });
            return state;
        case CallCenterActionTypes.BUILD_TABS:
            state = Object.assign({}, state, {
                action: CallCenterActionTypes.BUILD_TABS
            });
            return state;
        case CallCenterActionTypes.SAVE_FORM_DATA:
            state = Object.assign({}, state, {
                action: CallCenterActionTypes.SAVE_FORM_DATA
            });
            return state;
        case CallCenterActionTypes.BUILD_GRID:
            state = Object.assign({}, state, {
                action: CallCenterActionTypes.BUILD_GRID
            });
            return state;
        case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
            state = Object.assign({}, state, {
                action: CallCenterActionTypes.BUILD_SPECIFIC_GRID,
                gridToBuild: action.payload
            });
            return state;
        case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
            state = Object.assign({}, state, {
                action: CallCenterActionTypes.CLEAR_SPECIFIC_GRID,
                gridToClear: action.payload
            });
            return state;
        case CallCenterActionTypes.SET_PAGINATION:
            state = Object.assign({}, state, {
                action: CallCenterActionTypes.SET_PAGINATION
            });
            return state;
        case CallCenterActionTypes.TABS_TRANSLATION:
            state = Object.assign({}, state, {
                tabsTranslation: Object.assign({}, state.tabsTranslation, action.payload),
                action: CallCenterActionTypes.TABS_TRANSLATION
            });
            return state;
        case CallCenterActionTypes.RESET_ALL_SEARCH_DETAILS:
            state = Object.assign({}, state, {
                action: CallCenterActionTypes.RESET_ALL_SEARCH_DETAILS
            });
            return state;
        case CallCenterActionTypes.RESET_CALL_DETAILS:
            state = Object.assign({}, state, {
                action: CallCenterActionTypes.RESET_CALL_DETAILS
            });
            return state;
        case CallCenterActionTypes.DISPLAY_ERROR:
            state = Object.assign({}, state, {
                action: CallCenterActionTypes.DISPLAY_ERROR,
                errorMessage: action.payload
            });
            return state;
        case CallCenterActionTypes.DISPLAY_PROMPT_ERROR:
            state = Object.assign({}, state, {
                action: CallCenterActionTypes.DISPLAY_PROMPT_ERROR,
                errorMessage: action.payload
            });
            return state;
        case CallCenterActionTypes.SHOW_PRINT_INVOICE:
            state = Object.assign({}, state, {
                action: CallCenterActionTypes.SHOW_PRINT_INVOICE,
                printInvoice: action.payload
            });
            return state;
        case CallCenterActionTypes.SHOW_EMAIL_INVOICE:
            state = Object.assign({}, state, {
                action: CallCenterActionTypes.SHOW_EMAIL_INVOICE,
                emailInvoice: action.payload
            });
            return state;
        case CallCenterActionTypes.PORTFOLIO_CONTACT_DETAILS:
            state = Object.assign({}, state, {
                action: CallCenterActionTypes.PORTFOLIO_CONTACT_DETAILS,
                functionParams: action.payload
            });
            return state;
        case CallCenterActionTypes.CLEAR_DATA:
            state = Object.assign({}, state, {
                data: {},
                action: ''
            });
            return state;
        case CallCenterActionTypes.CLEAR_FORM_GROUP:
            state = Object.assign({}, state, {
                formGroup: {},
                action: ''
            });
            return state;
        case CallCenterActionTypes.CLEAR_ALL:
            state = Object.assign({}, state, {
                data: {},
                syschars: {},
                services: {},
                code: {},
                params: {},
                otherParams: {},
                formGroup: {
                    main: false,
                    tabAccounts: false,
                    tabLogs: false,
                    tabContracts: false,
                    tabDashboard: false,
                    tabDlContract: false,
                    tabEventHistory: false,
                    tabHistory: false,
                    tabInvoices: false,
                    tabPremises: false,
                    tabWorkOrders: false
                },
                fieldRequired: {},
                fieldVisibility: {
                    main: false,
                    tabAccounts: false,
                    tabLogs: false,
                    tabContracts: false,
                    tabDashboard: false,
                    tabDlContract: false,
                    tabEventHistory: false,
                    tabHistory: false,
                    tabInvoices: false,
                    tabPremises: false,
                    tabWorkOrders: false,
                    initialLoadComplete: false
                },
                dateVisibility: {
                    main: false,
                    tabAccounts: false,
                    tabLogs: false,
                    tabContracts: false,
                    tabDashboard: false,
                    tabDlContract: false,
                    tabEventHistory: false,
                    tabHistory: false,
                    tabInvoices: false,
                    tabPremises: false,
                    tabWorkOrders: false
                },
                dateObjects: {
                    main: false,
                    tabAccounts: false,
                    tabLogs: false,
                    tabContracts: false,
                    tabDashboard: false,
                    tabDlContract: false,
                    tabEventHistory: false,
                    tabHistory: false,
                    tabInvoices: false,
                    tabPremises: false,
                    tabWorkOrders: false
                },
                initialization: {
                    tabAccounts: false,
                    tabLogs: false,
                    tabContracts: false,
                    tabDashboard: false,
                    tabDlContract: false,
                    tabEventHistory: false,
                    tabHistory: false,
                    tabInvoices: false,
                    tabPremises: false,
                    tabWorkOrders: false,
                    initialLoadComplete: false
                },
                dropdownList: {
                    tabAccounts: false,
                    tabLogs: false,
                    tabContracts: false,
                    tabDashboard: false,
                    tabDlContract: false,
                    tabEventHistory: false,
                    tabHistory: false,
                    tabInvoices: false,
                    tabPremises: false,
                    tabWorkOrders: false
                },
                functions: {
                    main: false,
                    tabAccounts: false,
                    tabLogs: false,
                    tabContracts: false,
                    tabDashboard: false,
                    tabDlContract: false,
                    tabEventHistory: false,
                    tabHistory: false,
                    tabInvoices: false,
                    tabPremises: false,
                    tabWorkOrders: false
                },
                pagination: {
                    main: 1,
                    tabAccounts: 1,
                    tabLogs: 1,
                    tabContracts: 1,
                    tabDashboard: 1,
                    tabDlContract: 1,
                    tabEventHistory: 1,
                    tabHistory: 1,
                    tabInvoices: 1,
                    tabPremises: 1,
                    tabWorkOrders: 1
                },
                refresh: {
                    main: false,
                    tabAccounts: true,
                    tabLogs: true,
                    tabContracts: true,
                    tabDashboard: true,
                    tabDlContract: true,
                    tabEventHistory: true,
                    tabHistory: true,
                    tabInvoices: true,
                    tabPremises: true,
                    tabWorkOrders: true
                },
                index: {
                    main: {},
                    tabAccounts: {},
                    tabLogs: {},
                    tabContracts: {},
                    tabDashboard: {},
                    tabDlContract: {},
                    tabEventHistory: {},
                    tabHistory: {},
                    tabInvoices: {},
                    tabPremises: {},
                    tabWorkOrders: {}
                },
                tabsTranslation: {},
                errorMessage: '',
                promptErrorMessage: '',
                action: '',
                functionParams: [],
                printInvoice: [],
                emailInvoice: [],
                gridToBuild: [],
                gridToClear: [],
                allowAjaxOnDateChange: false,
                subject: ''
            });
            return state;
        default:
            return state;
    }
}
;
export var callcentresearch = storeFunction;
