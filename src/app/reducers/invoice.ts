/**
 * Store - Invoice
 * Store to preserve Invoicing form State
 * Store Key Details:
 *  data - Stores data recieved from service; Action - SAVE_DATA
 *  invoice - Stores parameters to retrieve the stores; Action - SAVE_INVOICE
 *  mode - Stores form mode(Search, Save, Update); Action - SAVE_MODE
 *  syschars - Stores the syschars for the component; Action - SAVE_SYSCHARS
 *  code - Stores Business and Country Code; Action - SAVE_CODE
 *  action - Stores last action performed on store; Values should be used from InvoiceActionTypes; Action should be stored in this key
 *  params - Stores params to be sent to other pages
 *  isLiveInvoice - Stores if current invoice is a live invoice
 *  otherDetails - Stored other details e.g. - Account Name, Languange Description etc.
 *  sentFromParent - Stores parameters sent from parent; Action - SEND_DATA_FROM_PARENT
 *  navigateTo - Store page name to navigate to; The route and mode is picked from constants using this logic
 */
import { InvoiceActionTypes } from './../actions/invoice';
import { ActionReducer, Action } from '@ngrx/store';

interface InvoiceMaintenance {
    data: Object;
    invoice: Object;
    mode: Object;
    syschars: Object;
    code: Object;
    action: String;
    params: Object;
    isLiveInvoice: boolean;
    otherDetails: Object;
    formGroup: Object;
    sentFromParent: Object;
    error: any;
    navigateTo: string;
}

const initialState: InvoiceMaintenance = {
    data: {
    },
    invoice: {
        AccountNumber: '',
        InvoiceGroupNumber: '',
        AccountName: ''
    },
    mode: {
        updateMode: false,
        addMode: false,
        searchMode: true
    },
    syschars: {
    },
    code: {
        business: '',
        country: ''
    },
    action: '',
    params: {
    },
    isLiveInvoice: false,
    otherDetails: {

    },
    formGroup: {
        main: null,
        AddressInvoice: null,
        AddressStatement: null,
        General: null,
        EDIInvoicing: null
    },
    sentFromParent: {
    },
    error: null,
    navigateTo: ''
};

export function storeFunction(state: any = initialState, action: Action): any {
    switch (action.type) {
        case InvoiceActionTypes.SAVE_DATA:
            state = Object.assign({}, state, {
                data: action.payload,
                action: InvoiceActionTypes.SAVE_DATA
            });
            return state;

        case InvoiceActionTypes.SAVE_INVOICE:
            state = Object.assign({}, state, {
                invoice: action.payload,
                action: InvoiceActionTypes.SAVE_INVOICE
            });
            return state;

        case InvoiceActionTypes.SAVE_CODE:
            state = Object.assign({}, state, {
                code: action.payload,
                action: InvoiceActionTypes.SAVE_CODE
            });
            return state;

        case InvoiceActionTypes.SAVE_MODE:
            state = Object.assign({}, state, {
                mode: action.payload,
                action: InvoiceActionTypes.SAVE_MODE
            });
            return state;

        case InvoiceActionTypes.SAVE_SYSCHAR:
            state = Object.assign({}, state, {
                syschars: action.payload,
                action: InvoiceActionTypes.SAVE_SYSCHAR
            });
            return state;

        case InvoiceActionTypes.SAVE_PARAMS:
            state = Object.assign({}, state, {
                params: action.payload,
                action: InvoiceActionTypes.SAVE_PARAMS
            });
            return state;

        case InvoiceActionTypes.SAVE_OTHER_DETAILS:
            state = Object.assign({}, state, {
                otherDetails: action.payload,
                action: InvoiceActionTypes.SAVE_OTHER_DETAILS
            });
            return state;

        case InvoiceActionTypes.SEND_DATA_FROM_PARENT:
            state = Object.assign({}, state, {
                sentFromParent: action.payload,
                action: InvoiceActionTypes.SEND_DATA_FROM_PARENT
            });
            return state;

        case InvoiceActionTypes.CHECK_LIVE_INVOICE:
            state = Object.assign({}, state, {
                action: InvoiceActionTypes.CHECK_LIVE_INVOICE
            });
            return state;

        case InvoiceActionTypes.UPDATE_LIVE_INVOICE:
            state = Object.assign({}, state, {
                isLiveInvoice: action.payload,
                action: InvoiceActionTypes.UPDATE_LIVE_INVOICE
            });
            return state;

        case InvoiceActionTypes.NAVIGATE:
            state = Object.assign({}, state, {
                navigateTo: action.payload,
                action: InvoiceActionTypes.NAVIGATE
            });
            return state;

        case InvoiceActionTypes.SET_FORM_GROUPS:
            let formGroup = state.formGroup;
            formGroup[action.payload.name] = action.payload.form;
            state = Object.assign({}, state, {
                formGroup: formGroup,
                action: InvoiceActionTypes.SET_FORM_GROUPS
            });
            return state;

        case InvoiceActionTypes.ADDRESS_DATA_RECEIVED:
            state = Object.assign({}, state, {
                action: InvoiceActionTypes.ADDRESS_DATA_RECEIVED
            });
            return state;

        case InvoiceActionTypes.DISPATCH_ERROR:
            state = Object.assign({}, state, {
                error: action.payload,
                action: InvoiceActionTypes.DISPATCH_ERROR
            });
            return state;

        case InvoiceActionTypes.RESET_FORMS:
            state = Object.assign({}, state, {
                action: InvoiceActionTypes.RESET_FORMS
            });
            return state;

        case InvoiceActionTypes.CLEAR:
            state = Object.assign({}, state, {
                data: {},
                invoice: {},
                mode: {},
                syschars: {},
                code: {},
                action: '',
                params: {},
                isLiveInvoice: false,
                otherDetails: {},
                formGroup: {},
                sentFromParent: {},
                error: null,
                navigateTo: ''
            });
            return state;

        case InvoiceActionTypes.CHECK_NAVIGATION_BACK:
            state = Object.assign({}, state, {
                action: InvoiceActionTypes.CHECK_NAVIGATION_BACK
            });
            return state;

        case InvoiceActionTypes.DISABLE_FORMS:
            state = Object.assign({}, state, {
                action: InvoiceActionTypes.DISABLE_FORMS
            });
            return state;

        default:
            return state;
    }
};

export const invoice: ActionReducer<any> = storeFunction;

