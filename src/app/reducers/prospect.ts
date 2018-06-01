import { ActionReducer, Action } from '@ngrx/store';
import { ActionTypes } from '../actions/prospect';

interface Prospect {
    data: Object;
}

const initialState: Prospect = {
    data: {}
};

export function storeFunction(state: any = initialState, action: Action): any {
    switch (action.type) {
        case ActionTypes.SAVE_DATA:
            state = Object.assign({}, state, {
                data: action.payload,
                action: ActionTypes.SAVE_DATA
            });
            return state;

        case ActionTypes.CLEAR_DATA:
            state = Object.assign({}, state, {
                data: {}
            });
            return state;
        case ActionTypes.SAVE_SYSTEM_PARAMETER:
            state = Object.assign({}, state, {
                data: action.payload,
                action: ActionTypes.SAVE_SYSTEM_PARAMETER
            });
            return state;
        case ActionTypes.CONTROL_DEFAULT_VALUE:
            state = Object.assign({}, state, {
                data: action.payload,
                action: ActionTypes.CONTROL_DEFAULT_VALUE
            });
            return state;
        case ActionTypes.RI_EXCHANGE:
            state = Object.assign({}, state, {
                data: action.payload,
                action: ActionTypes.RI_EXCHANGE
            });
            return state;
        case ActionTypes.EXCHANGE_METHOD:
            state = Object.assign({}, state, {
                data: action.payload,
                action: ActionTypes.EXCHANGE_METHOD
            });
            return state;
        case ActionTypes.FORM_CONTROLS:
            state = Object.assign({}, state, {
                data: action.payload,
                action: ActionTypes.FORM_CONTROLS
            });
            return state;
            case ActionTypes.PARENT_FORM:
            state = Object.assign({}, state, {
                data: action.payload,
                action: ActionTypes.PARENT_FORM
            });
            return state;

        default:
            return state;
    }
};

export const prospect: ActionReducer<any> = storeFunction;

