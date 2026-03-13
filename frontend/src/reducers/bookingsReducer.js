import types from '../actions/types';
import moment from 'moment';
import {omit} from 'lodash';

const initial_state = {
    all: [],
    all_listings: [],
    page: null,
    loading: true,
    loaded: false,
    last_loaded_on: null,
    loading_page: false,
    loaded_page: false,
    loading_calendar: true,
    calendar: [],
    loaded_calendar: false,
    updating: [],
    details: {},
    loading_single: false,
    show_add_form: false,
    adding_booking: false,
    filter: {
        upcoming: true
    }
};
export default function bookingsReducer(state = initial_state, action) {
    switch (action.type) {
        case types.BOOKINGS_TOGGLE_ADD_FORM:
            return {
                ...state,
                show_add_form: !state.show_add_form
            };
        case types.LISTINGS_LIST_SUCCESS:
            return {
                ...state,
                all_listings: [...action.payload.data],
            };
        case types.BOOKINGS_LIST_REQUESTING:
            return {
                ...state,
                loading: true
            };
        case types.BOOKINGS_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                page: action.payload,
                all: [...action.payload.data],
                last_loaded_on: moment(),
            };
        case types.BOOKINGS_LIST_ERROR:
            return {
                ...state,
                loading: false,
            };
        case types.BOOKINGS_CALENDAR_LIST_REQUESTING:
            return {
                ...state,
                loading_calendar: true
            };
        case types.BOOKINGS_CALENDAR_LIST_SUCCESS:
            return {
                ...state,
                loading_calendar: false,
                loaded_calendar: true,
                calendar: action.payload.data,
            };
        case types.BOOKINGS_CALENDAR_LIST_ERROR:
            return {
                ...state,
                loading_calendar: false,
            };
        case types.BOOKINGS_SINGLE_REQUESTING:
            return {
                ...state,
                loading_single: true
            };
        case types.BOOKINGS_SINGLE_ERROR:
            return {
                ...state,
                loading_single: false
            };
        case types.BOOKINGS_SINGLE_SUCCESS:
            return {
                ...state,
                details: {...state.details, [action.payload.id]: action.payload},
                loading_single: false
            };

        case types.BOOKINGS_PAGE_REQUESTING:
            return {
                ...state,
                loading_page: true
            };
        case types.BOOKINGS_PAGE_SUCCESS:
            return {
                ...state,
                loading_page: false,
                loaded_page: true,
                page: action.payload,
                all: [...state.all, ...action.payload.data],
            };
        case types.BOOKINGS_PAGE_ERROR:
            return {
                ...state,
                loading_page: false,
            };
        case types.AUTH_LOG_OUT:
            return {
                ...initial_state
            };
        case types.BOOKINGS_UPDATE_REQUESTING:
            return {
                ...state,
                updating: [...state.updating, action.payload]
            };
        case types.BOOKINGS_UPDATE_ERROR:
            return {
                ...state,
                updating: state.updating.filter((i) => (i !== action.payload))
            };
        case types.BOOKINGS_UPDATE_SUCCESS:
            return {
                ...state,
                all: state.all.map((item) => (item.id === action.payload.id ? action.payload : item)),
                updating: state.updating.filter((i) => (i !== action.payload.id)),
                details: {...state.details, [action.payload.id]: action.payload},
            };
        case types.BOOKINGS_ADD_FILTER:
            return {
                ...state,
                filter: {...state.filter, ...action.payload}
            };

        case types.BOOKINGS_REMOVE_FILTER:
            return {
                ...state,
                filter: omit(state.filter, action.payload)
            };

        default:
            return state;
    }
}
