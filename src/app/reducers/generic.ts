import { GenericActionTypes } from './../actions/generic';
import { ActionReducer, Action } from '@ngrx/store';

interface Generic {
    recommendation_data: Object;
    product_sales_data: Object;
    account_address_change: Object;
    premise_service_summary_data: Object;
}

const initialState: Generic = {
    recommendation_data: {},
    product_sales_data: {},
    account_address_change: {},
    premise_service_summary_data: {}
};

export function storeFunction(state: any = initialState, action: Action): any {
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
};

export const generic: ActionReducer<any> = storeFunction;
