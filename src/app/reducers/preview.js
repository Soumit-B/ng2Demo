import { ActionTypes } from '../actions/preview';
var initialState = {
    data: {},
    contract_api: {}
};
export function storeFunction(state, action) {
    if (state === void 0) { state = initialState; }
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
}
;
export var preview = storeFunction;
