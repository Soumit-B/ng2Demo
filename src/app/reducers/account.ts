import { ActionReducer, Action } from '@ngrx/store';
import { ActionTypes } from '../actions/account';

interface Account {
    from: Object;
    to: Object;
    rowData: Object;
    data: Array<any>;
}

const initialState: Account = {
    from: {},
    to: {},
    rowData: {},
    data: []
};

export function storeFunction(state: any = initialState, action: Action): any {
    switch (action.type) {
        case ActionTypes.SAVE_DATA_FROM:
            state = Object.assign({}, state, {
                from: action.payload
            });
            return state;

        case ActionTypes.CLEAR_DATA_FROM:
            state = Object.assign({}, state, {
                from: {}
            });
            return state;

        case ActionTypes.SAVE_DATA_TO:
            state = Object.assign({}, state, {
                to: action.payload
            });
            return state;

        case ActionTypes.CLEAR_DATA_TO:
            state = Object.assign({}, state, {
                to: {}
            });
            return state;

        case ActionTypes.SAVE_ACCOUNT_ROW_DATA:
            state = Object.assign({}, state,  {
                rowData: action.payload
            });
            return state;

        case ActionTypes.CLEAR_ACCOUNT_ROW_DATA:
            state = Object.assign({}, state, {
                rowData: {}
            });
            return state;

        case ActionTypes.SAVE_ACCOUNT_DATA:
            state = Object.assign({}, state,  {
                data: action.payload
            });
            return state;

        case ActionTypes.CLEAR_ACCOUNT_DATA:
            state = Object.assign({}, state, {
                data: []
            });
            return state;

        default:
            return state;
    }
};

export const account: ActionReducer<any> = storeFunction;
