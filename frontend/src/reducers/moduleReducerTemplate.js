import types from '../actions/types';
import moment from 'moment';

const initial_state = {
    all: [],
    page: null,
    loading: true,
    loaded: false,
    last_loaded_on: null,
    loading_page: false,
    loaded_page: false,
};
export default function usersReducer(state = initial_state, action) {
    switch (action.type) {
        case types.USERS_LIST_REQUESTING:
            return {
                ...state,
                loading: true
            };
        case types.USERS_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                page: action.payload,
                all: [...action.payload.data],
                last_loaded_on: moment(),
            };
        case types.USERS_LIST_ERROR:
            return {
                ...state,
                loading: false,
            };

        case types.USERS_PAGE_REQUESTING:
            return {
                ...state,
                loading_page: true
            };
        case types.USERS_PAGE_SUCCESS:
            return {
                ...state,
                loading_page: false,
                loaded_page: true,
                page: action.payload,
                all: [...state.all, ...action.payload.data],
            };
        case types.USERS_PAGE_ERROR:
            return {
                ...state,
                loading_page: false,
            };
        case types.AUTH_LOG_OUT:
            return {
                ...initial_state
            };

        default:
            return state;
    }
}
