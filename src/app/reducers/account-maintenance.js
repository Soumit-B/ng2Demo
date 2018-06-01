import { AccountMaintenanceActionTypes } from '../actions/account-maintenance';
var initialState = {
    data: {},
    account: {},
    mode: {
        updateMode: false,
        addMode: false,
        searchMode: true
    },
    syschars: {},
    processedSysChar: {},
    virtualTableData: {},
    params: {},
    otherParams: {},
    sentFromParent: {},
    code: {
        business: '',
        country: ''
    },
    validate: {
        main: false,
        address: false,
        accountManagement: false,
        general: false,
        bankDetails: false,
        ediInvoicing: false,
        invoiceText: false,
        teleSales: false,
        discounts: false
    },
    formValidity: {
        main: true,
        address: true,
        accountManagement: true,
        general: true,
        bankDetails: true,
        ediInvoicing: true,
        invoiceText: true,
        teleSales: true,
        discounts: true
    },
    formGroup: {
        main: false,
        address: false,
        accountManagement: false,
        general: false,
        bankDetails: false,
        ediInvoicing: false,
        invoiceText: false,
        teleSales: false,
        discounts: false
    },
    fieldRequired: {
        main: false,
        address: false,
        accountManagement: false,
        general: false,
        bankDetails: false,
        ediInvoicing: false,
        invoiceText: false,
        teleSales: false,
        discounts: false
    },
    fieldVisibility: {
        main: false,
        address: false,
        accountManagement: false,
        general: false,
        bankDetails: false,
        ediInvoicing: false,
        invoiceText: false,
        teleSales: false,
        discounts: false
    },
    fieldValue: {},
    action: ''
};
export function storeFunction(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case AccountMaintenanceActionTypes.SAVE_DATA:
            state = Object.assign({}, state, {
                data: action.payload,
                action: AccountMaintenanceActionTypes.SAVE_DATA
            });
            return state;
        case AccountMaintenanceActionTypes.SAVE_ACCOUNT:
            state = Object.assign({}, state, {
                account: action.payload,
                action: AccountMaintenanceActionTypes.SAVE_ACCOUNT
            });
            return state;
        case AccountMaintenanceActionTypes.SAVE_MODE:
            state = Object.assign({}, state, {
                mode: action.payload,
                action: AccountMaintenanceActionTypes.SAVE_MODE
            });
            return state;
        case AccountMaintenanceActionTypes.SAVE_SYSCHAR:
            state = Object.assign({}, state, {
                syschars: action.payload,
                action: AccountMaintenanceActionTypes.SAVE_SYSCHAR
            });
            return state;
        case AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR:
            state = Object.assign({}, state, {
                processedSysChar: action.payload,
                action: AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR
            });
            return state;
        case AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA:
            state = Object.assign({}, state, {
                virtualTableData: action.payload,
                action: AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA
            });
            return state;
        case AccountMaintenanceActionTypes.SAVE_PARAMS:
            state = Object.assign({}, state, {
                params: action.payload,
                action: AccountMaintenanceActionTypes.SAVE_PARAMS
            });
            return state;
        case AccountMaintenanceActionTypes.SAVE_OTHER_PARAMS:
            state = Object.assign({}, state, {
                otherParams: action.payload,
                action: AccountMaintenanceActionTypes.SAVE_OTHER_PARAMS
            });
            return state;
        case AccountMaintenanceActionTypes.SAVE_CODE:
            state = Object.assign({}, state, {
                code: action.payload,
                action: AccountMaintenanceActionTypes.SAVE_CODE
            });
            return state;
        case AccountMaintenanceActionTypes.SAVE_FIELD:
            state = Object.assign({}, state, {
                fieldValue: action.payload,
                action: AccountMaintenanceActionTypes.SAVE_FIELD
            });
            return state;
        case AccountMaintenanceActionTypes.SAVE_SENT_FROM_PARENT:
            state = Object.assign({}, state, {
                sentFromParent: action.payload,
                action: AccountMaintenanceActionTypes.SAVE_SENT_FROM_PARENT
            });
            return state;
        case AccountMaintenanceActionTypes.CLEAR_DATA:
            state = Object.assign({}, state, {
                data: {},
                action: ''
            });
            return state;
        case AccountMaintenanceActionTypes.CLEAR_ACCOUNT:
            state = Object.assign({}, state, {
                account: {},
                action: ''
            });
            return state;
        case AccountMaintenanceActionTypes.CLEAR_CODE:
            state = Object.assign({}, state, {
                code: {},
                action: ''
            });
            return state;
        case AccountMaintenanceActionTypes.CLEAR_FIELD:
            state = Object.assign({}, state, {
                fieldValue: {},
                action: ''
            });
            return state;
        case AccountMaintenanceActionTypes.CLEAR_SENT_FROM_PARENT:
            state = Object.assign({}, state, {
                sentFromParent: {},
                action: ''
            });
            return state;
        case AccountMaintenanceActionTypes.CLEAR_FORM_GROUP:
            state = Object.assign({}, state, {
                formGroup: {
                    main: false,
                    address: false,
                    accountManagement: false,
                    general: false,
                    bankDetails: false,
                    ediInvoicing: false,
                    invoiceText: false,
                    teleSales: false,
                    discounts: false
                },
                action: ''
            });
            return state;
        case AccountMaintenanceActionTypes.CLEAR_ALL:
            state = Object.assign({}, state, {
                mode: {},
                account: {},
                data: {},
                validate: {},
                code: {},
                formGroup: {},
                formValidity: {},
                action: '',
                otherParams: {},
                sentFromParent: {},
                services: {}
            });
            return state;
        case AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD:
            state = Object.assign({}, state, {
                fieldVisibility: Object.assign({}, state.fieldVisibility, action.payload),
                action: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD
            });
            return state;
        case AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD:
            state = Object.assign({}, state, {
                fieldRequired: Object.assign({}, state.fieldRequired, action.payload),
                action: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD
            });
            return state;
        case AccountMaintenanceActionTypes.BEFORE_SELECT:
            state = Object.assign({}, state, {
                action: AccountMaintenanceActionTypes.BEFORE_SELECT
            });
            return state;
        case AccountMaintenanceActionTypes.BEFORE_MODE:
            state = Object.assign({}, state, {
                action: AccountMaintenanceActionTypes.BEFORE_MODE
            });
            return state;
        case AccountMaintenanceActionTypes.BEFORE_ADD:
            state = Object.assign({}, state, {
                action: AccountMaintenanceActionTypes.BEFORE_ADD
            });
            return state;
        case AccountMaintenanceActionTypes.BEFORE_ADDMODE:
            state = Object.assign({}, state, {
                action: AccountMaintenanceActionTypes.BEFORE_ADDMODE
            });
            return state;
        case AccountMaintenanceActionTypes.BEFORE_UPDATE:
            state = Object.assign({}, state, {
                action: AccountMaintenanceActionTypes.BEFORE_UPDATE
            });
            return state;
        case AccountMaintenanceActionTypes.BEFORE_SAVE:
            state = Object.assign({}, state, {
                action: AccountMaintenanceActionTypes.BEFORE_SAVE
            });
            return state;
        case AccountMaintenanceActionTypes.AFTER_SAVE:
            state = Object.assign({}, state, {
                action: AccountMaintenanceActionTypes.AFTER_SAVE
            });
            return state;
        case AccountMaintenanceActionTypes.AFTER_FETCH:
            state = Object.assign({}, state, {
                action: AccountMaintenanceActionTypes.AFTER_FETCH
            });
            return state;
        case AccountMaintenanceActionTypes.AFTER_ABANDON:
            state = Object.assign({}, state, {
                action: AccountMaintenanceActionTypes.AFTER_ABANDON
            });
            return state;
        case AccountMaintenanceActionTypes.LOAD_FORM_GROUP:
        case AccountMaintenanceActionTypes.FORM_GROUP:
            state = Object.assign({}, state, {
                formGroup: Object.assign({}, state.formGroup, action.payload),
                action: AccountMaintenanceActionTypes.FORM_GROUP
            });
            return state;
        case AccountMaintenanceActionTypes.FORM_INIT:
            state = Object.assign({}, state, {
                action: AccountMaintenanceActionTypes.FORM_INIT
            });
            return state;
        case AccountMaintenanceActionTypes.SAVE_RETURN_HTML:
            state = Object.assign({}, state, {
                returnHtml: action.payload,
                action: AccountMaintenanceActionTypes.SAVE_RETURN_HTML
            });
            return state;
        case AccountMaintenanceActionTypes.VALIDATE_FORMS:
            state = Object.assign({}, state, {
                validate: action.payload,
                action: AccountMaintenanceActionTypes.VALIDATE_FORMS
            });
            return state;
        case AccountMaintenanceActionTypes.FORM_VALIDITY:
            state = Object.assign({}, state, {
                formValidity: Object.assign({}, state.formValidity, action.payload),
                action: AccountMaintenanceActionTypes.FORM_VALIDITY
            });
            return state;
        case AccountMaintenanceActionTypes.SUBMIT_FORM_VALIDITY:
            state = Object.assign({}, state, {
                action: AccountMaintenanceActionTypes.SUBMIT_FORM_VALIDITY
            });
            return state;
        case AccountMaintenanceActionTypes.TAB_CHANGE:
            state = Object.assign({}, state, {
                action: AccountMaintenanceActionTypes.TAB_CHANGE
            });
            return state;
        default:
            return state;
    }
}
;
export var accountMaintenance = storeFunction;
