import types from '../actions/types';
import moment from 'moment';

const initial_state = {
    all: [],
    loading: true,
    loaded: false,
    updating: [],
    dropdown: [],
    last_loaded_on: null,
};
export default function suppliesReducer(state = initial_state, action) {
    switch (action.type) {
        case types.SUPPLIES_LIST_REQUESTING:
            return {
                ...state,
                loading: true
            };
        case types.SUPPLIES_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                dropdown: action.payload.data.map((supply) => ({
                    value: supply.id,
                    label: supply.name + ' (' + supply.ready_stock + ' in stock)'
                })),
                page: action.payload,
                all: [...action.payload.data],

                last_loaded_on: moment(),
            };
        case types.SUPPLIES_LIST_ERROR:
            return {
                ...state,
                loading: false,
            };

        case types.AUTH_LOG_OUT:
            return {
                ...initial_state
            };
        case types.SUPPLIES_UPDATE_REQUESTING:
            return {
                ...state,
                updating: [...state.updating, action.payload]
            };
        case types.SUPPLIES_UPDATE_ERROR:
            return {
                ...state,
                updating: state.updating.filter((i) => (i !== action.payload))
            };
        case types.SUPPLIES_UPDATE_SUCCESS:
            return {
                ...state,
                all: state.all.map((item) => (item.id === action.payload.id ? action.payload : item)),
                updating: state.updating.filter((i) => (i !== action.payload.id)),
                details: {...state.details, [action.payload.id]: action.payload},
            };

        default:
            return state;
    }
}
