import { ActionTypes } from '../actions/account';
var initialState = {
    from: {},
    to: {},
    rowData: {},
    data: []
};
export function storeFunction(state, action) {
    if (state === void 0) { state = initialState; }
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
            state = Object.assign({}, state, {
                rowData: action.payload
            });
            return state;
        case ActionTypes.CLEAR_ACCOUNT_ROW_DATA:
            state = Object.assign({}, state, {
                rowData: {}
            });
            return state;
        case ActionTypes.SAVE_ACCOUNT_DATA:
            state = Object.assign({}, state, {
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
}
;
export var account = storeFunction;
