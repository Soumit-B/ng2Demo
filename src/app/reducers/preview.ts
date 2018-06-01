import { ActionReducer, Action } from '@ngrx/store';
import { ActionTypes } from '../actions/preview';

interface Preview {
    data: Object;
    contract_api: Object;
}

const initialState: Preview = {
    data: {},
    contract_api: {}
};

export function storeFunction(state: any = initialState, action: Action): any {
    switch (action.type) {
        case ActionTypes.SAVE_DATA:
            state = Object.assign({}, state, {
                data: action.payload
            });
            return state;

        case ActionTypes.CLEAR_DATA:
            state = Object.assign({}, state, {
                data: {}
            });
            return state;
        case ActionTypes.SAVE_APPLY_API_CONTRACT_DATA:
            state = Object.assign({}, state, {
                contract_api: action.payload
            });
            return state;

        case ActionTypes.CLEAR_APPLY_API_CONTRACT_DATA:
            state = Object.assign({}, state, {
                contract_api: {}
            });
            return state;
        default:
            return state;
    }
};

export const preview: ActionReducer<any> = storeFunction;

