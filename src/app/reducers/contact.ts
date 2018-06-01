import { ContactActionTypes } from '../actions/contact';
import { ActionReducer, Action } from '@ngrx/store';

interface ContactMaintenance {
    data: Object;
    contact: Object;
    mode: Object;
    syschars: Object;
    params: Object;
    validate: Object;
    fieldValue: Object;
    fieldParams: Object;
    formGroup: Object;
    action: String;
    code: Object;
}

const initialState: ContactMaintenance = {
    data: {

    },
    contact: {

    },
    mode: {
        updateMode: false,
        addMode: false,
        searchMode: true
    },
    syschars: {

    },
    params: {

    },
    code: {
        business: '',
        country: ''
    },
    validate: {
        main: false,
        typeA: false,
        typeB: false,
        typeC: false
    },
    formGroup: {},
    fieldValue: {},
    fieldParams: {},
    action: ''
};

export function storeFunction(state: any = initialState, action: Action): any {
    switch (action.type) {
        case ContactActionTypes.SAVE_DATA:
            state = Object.assign({}, state, {
                data: action.payload,
                action: ContactActionTypes.SAVE_DATA
            });
            return state;

        case ContactActionTypes.SAVE_MODE:
            state = Object.assign({}, state, {
                mode: action.payload,
                action: ContactActionTypes.SAVE_MODE
            });
            return state;

        case ContactActionTypes.SAVE_CODE:
            state = Object.assign({}, state, {
                code: action.payload,
                action: ContactActionTypes.SAVE_CODE
            });
            return state;

        case ContactActionTypes.SAVE_SYSCHAR:
            state = Object.assign({}, state, {
                syschars: action.payload,
                action: ContactActionTypes.SAVE_SYSCHAR
            });
            return state;

        case ContactActionTypes.SAVE_FIELD:
            state = Object.assign({}, state, {
                fieldValue: action.payload,
                action: ContactActionTypes.SAVE_FIELD
            });
            return state;
        case ContactActionTypes.SAVE_FIELD_PARAMS:
            state = Object.assign({}, state, {
                fieldParams: action.payload,
                action: ContactActionTypes.SAVE_FIELD_PARAMS
            });
            return state;

        case ContactActionTypes.SET_FORM_GROUPS:
            let formGroup = state.formGroup;
            formGroup[action.payload.name] = action.payload.form;
            state = Object.assign({}, state, {
                formGroup: formGroup,
                action: ContactActionTypes.SET_FORM_GROUPS
            });
            return state;

        case ContactActionTypes.SAVE_DATA_FROM_PARENT:
            state = Object.assign({}, state, {
                parentData: action.payload,
                action: ContactActionTypes.SAVE_DATA_FROM_PARENT
            });
            return state;
        case ContactActionTypes.SAVE_PARAMS:
            state = Object.assign({}, state, {
                params: action.payload,
                action: ContactActionTypes.SAVE_PARAMS
            });
            return state;

        case ContactActionTypes.CLEAR_DATA:
            state = Object.assign({}, state, {
                data: {},
                action: ''
            });
            return state;

        case ContactActionTypes.CLEAR_ALL:
            state = Object.assign({}, state, {
                mode: {},
                contact: {},
                data: {},
                validate: {},
                code: {},
                fieldValue: {},
                fieldParams: {},
                parentParams: {},
                action: ''

            });
            return state;

        case ContactActionTypes.VALIDATE_FORMS:
            state = Object.assign({}, state, {
                validate: action.payload,
                action: ContactActionTypes.VALIDATE_FORMS
            });
            return state;

        default:
            return state;
    }
};

export const contact: ActionReducer<any> = storeFunction;

