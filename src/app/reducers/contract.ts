import { ActionReducer, Action } from '@ngrx/store';
import { ContractActionTypes } from '../actions/contract';

interface ContractMaintenance {
    data: Object;
    account: Object;
    mode: Object;
    syschars: Object;
    params: Object;
    otherParams: Object;
    sentFromParent: Object;
    code: Object;
    validate: Object;
    formValidity: Object;
    formGroup: Object;
    formReset: Object;
    fieldRequired: Object;
    fieldVisibility: Object;
    fieldValue: Object;
    services: Object;
    parentToChildComponent: Object;
    childToParentComponent: Object;
    action: String;
    initialization: Object;
}

const initialState: ContractMaintenance = {
    data: {

    },
    account: {

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
    otherParams: {

    },
    sentFromParent: {

    },
    code: {

    },
    validate: {
        main: false,
        typeA: false,
        typeB: false,
        typeC: false,
        typeD: false,
        typeE: false
    },
    formValidity: {
        main: false,
        typeA: false,
        typeB: false,
        typeC: false,
        typeD: false,
        typeE: false
    },
    formGroup: {
        main: false,
        typeA: false,
        typeB: false,
        typeC: false,
        typeD: false,
        typeE: false
    },
    fieldRequired: {
        main: false,
        typeA: false,
        typeB: false,
        typeC: false,
        typeD: false,
        typeE: false
    },
    fieldVisibility: {
        main: false,
        typeA: false,
        typeB: false,
        typeC: false,
        typeD: false,
        typeE: false
    },
    initialization: {
        typeA: false,
        typeB: false,
        typeC: false,
        initialLoadComplete: false
    },
    formReset: {},
    fieldValue: {},
    services: {},
    parentToChildComponent: {},
    childToParentComponent: {},
    action: ''
};

export function storeFunction(state: any = initialState, action: Action): any {
    switch (action.type) {
        case ContractActionTypes.SAVE_DATA:
            state = Object.assign({}, state, {
                data: action.payload,
                action: ContractActionTypes.SAVE_DATA
            });
            return state;

        case ContractActionTypes.SAVE_ACCOUNT:
            state = Object.assign({}, state, {
                account: action.payload,
                action: ContractActionTypes.SAVE_ACCOUNT
            });
            return state;

        case ContractActionTypes.SAVE_MODE:
            state = Object.assign({}, state, {
                mode: action.payload,
                action: ContractActionTypes.SAVE_MODE
            });
            return state;

        case ContractActionTypes.SAVE_SYSCHAR:
            state = Object.assign({}, state, {
                syschars: action.payload,
                action: ContractActionTypes.SAVE_SYSCHAR
            });
            return state;

        case ContractActionTypes.SAVE_PARAMS:
            state = Object.assign({}, state, {
                params: action.payload,
                action: ContractActionTypes.SAVE_PARAMS
            });
            return state;

        case ContractActionTypes.SAVE_OTHER_PARAMS:
            state = Object.assign({}, state, {
                otherParams: action.payload,
                action: ContractActionTypes.SAVE_OTHER_PARAMS
            });
            return state;

        case ContractActionTypes.SAVE_CODE:
            state = Object.assign({}, state, {
                code: action.payload,
                action: ContractActionTypes.SAVE_CODE
            });
            return state;

        case ContractActionTypes.SAVE_REQUIRED_FIELD:
            state = Object.assign({}, state, {
                fieldRequired: Object.assign({}, state.fieldRequired, action.payload),
                action: ContractActionTypes.SAVE_REQUIRED_FIELD
            });

            return state;

        case ContractActionTypes.SAVE_VISIBILITY_FIELD:
            state = Object.assign({}, state, {
                fieldVisibility: Object.assign({}, state.fieldVisibility, action.payload),
                action: ContractActionTypes.SAVE_VISIBILITY_FIELD
            });
            return state;

        case ContractActionTypes.SAVE_FIELD:
            state = Object.assign({}, state, {
                fieldValue: action.payload,
                action: ContractActionTypes.SAVE_FIELD
            });
            return state;

        case ContractActionTypes.SAVE_SERVICE:
            state = Object.assign({}, state, {
                services: action.payload,
                action: ContractActionTypes.SAVE_SERVICE
            });
            return state;

        case ContractActionTypes.BEFORE_SAVE:
            state = Object.assign({}, state, {
                action: ContractActionTypes.BEFORE_SAVE
            });
            return state;

        case ContractActionTypes.AFTER_SAVE:
            state = Object.assign({}, state, {
                action: ContractActionTypes.AFTER_SAVE
            });
            return state;

        case ContractActionTypes.AFTER_FETCH:
            state = Object.assign({}, state, {
                action: ContractActionTypes.AFTER_FETCH
            });
            return state;

        case ContractActionTypes.LOOKUP:
            state = Object.assign({}, state, {
                action: ContractActionTypes.LOOKUP
            });
            return state;

        case ContractActionTypes.SAVE_SENT_FROM_PARENT:
            state = Object.assign({}, state, {
                sentFromParent: action.payload,
                action: ContractActionTypes.SAVE_SENT_FROM_PARENT
            });
            return state;

        case ContractActionTypes.FORM_GROUP:
            state = Object.assign({}, state, {
                formGroup: Object.assign({}, state.formGroup, action.payload),
                action: ContractActionTypes.FORM_GROUP
            });
            return state;
        case ContractActionTypes.FORM_GROUP_PRORATA:
            state = Object.assign({}, state, {
                formGroup: Object.assign({}, state.formGroup, action.payload),
                action: ContractActionTypes.FORM_GROUP_PRORATA
            });
            return state;

        case ContractActionTypes.VALIDATE_FORMS:
            state = Object.assign({}, state, {
                validate: action.payload,
                action: ContractActionTypes.VALIDATE_FORMS
            });
            return state;

        case ContractActionTypes.FORM_VALIDITY:
            state = Object.assign({}, state, {
                formValidity: Object.assign({}, state.formValidity, action.payload),
                action: ContractActionTypes.FORM_VALIDITY
            });
            return state;

        case ContractActionTypes.INITIALIZATION:
            state = Object.assign({}, state, {
                initialization: Object.assign({}, state.initialization, action.payload),
                action: ContractActionTypes.INITIALIZATION
            });
            return state;

        case ContractActionTypes.FORM_RESET:
            state = Object.assign({}, state, {
                formReset: action.payload,
                action: ContractActionTypes.FORM_RESET
            });
            return state;

        case ContractActionTypes.PARENT_TO_CHILD_COMPONENT:
            state = Object.assign({}, state, {
                parentToChildComponent: action.payload,
                action: ContractActionTypes.PARENT_TO_CHILD_COMPONENT
            });
            return state;

        case ContractActionTypes.CHILD_TO_PARENT_COMPONENT:
            state = Object.assign({}, state, {
                childToParentComponent: action.payload,
                action: ContractActionTypes.CHILD_TO_PARENT_COMPONENT
            });
            return state;

        case ContractActionTypes.CLEAR_DATA:
            state = Object.assign({}, state, {
                data: {},
                action: ''
            });
            return state;

        case ContractActionTypes.CLEAR_ACCOUNT:
            state = Object.assign({}, state, {
                account: {},
                action: ''
            });
            return state;

        case ContractActionTypes.CLEAR_CODE:
            state = Object.assign({}, state, {
                code: {},
                action: ''
            });
            return state;

        case ContractActionTypes.CLEAR_FIELD:
            state = Object.assign({}, state, {
                fieldValue: {},
                action: ''
            });
            return state;

        case ContractActionTypes.CLEAR_SENT_FROM_PARENT:
            state = Object.assign({}, state, {
                sentFromParent: {},
                action: ''
            });
            return state;

        case ContractActionTypes.CLEAR_FORM_GROUP:
            state = Object.assign({}, state, {
                formGroup: {
                    main: false,
                    typeA: false,
                    typeB: false,
                    typeC: false,
                    typeD: false,
                    typeE: false
                },
                action: ''
            });
            return state;

        case ContractActionTypes.CLEAR_ALL:
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
                services: {},
                initialization: {}

            });
            return state;
        case ContractActionTypes.DATA_FROM_PARENT:
            state = Object.assign({}, state, {
                fromParent: action.payload
            });
            return state;

        case ContractActionTypes.SET_EMPLOYEE_ON_BRANCH_CHANGE:
            state = Object.assign({}, state, {
                action: ContractActionTypes.SET_EMPLOYEE_ON_BRANCH_CHANGE
            });
            return state;

        default:
            return state;
    }
};

export const contract: ActionReducer<any> = storeFunction;

