import { GenericActionTypes } from './../actions/generic';
var initialState = {
    recommendation_data: {},
    product_sales_data: {},
    account_address_change: {},
    premise_service_summary_data: {}
};
export function storeFunction(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case GenericActionTypes.SAVE_RECOMMENDATION_DATA:
            state = Object.assign({}, state, {
                recommendation_data: action.payload
            });
            return state;
        case GenericActionTypes.CLEAR_RECOMMENDATION_DATA:
            state = Object.assign({}, state, {
                recommendation_data: {}
            });
            return state;
        case GenericActionTypes.SAVE_PRODUCT_SALES_DATA:
            state = Object.assign({}, state, {
                product_sales_data: action.payload
            });
            return state;
        case GenericActionTypes.CLEAR_PRODUCT_SALES_DATA:
            state = Object.assign({}, state, {
                product_sales_data: {}
            });
            return state;
        case GenericActionTypes.SAVE_ADDRESS_CHANGE_DATA:
            state = Object.assign({}, state, {
                account_address_change: action.payload
            });
            return state;
        case GenericActionTypes.CLEAR_ADDRESS_CHANGE_DATA:
            state = Object.assign({}, state, {
                account_address_change: {}
            });
            return state;
        case GenericActionTypes.SAVE_PREMISE_SERVICE_DATA:
            state = Object.assign({}, state, {
                premise_service_summary_data: action.payload
            });
            return state;
        case GenericActionTypes.CLEAR_PREMISE_SERVICE_DATA:
            state = Object.assign({}, state, {
                premise_service_summary_data: {}
            });
            return state;
        default:
            return state;
    }
}
;
export var generic = storeFunction;
