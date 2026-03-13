import types from '../actions/types';
import moment from 'moment';
import {omit} from 'lodash';

const initial_state = {
    all: [],
    page: null,
    loading: true,
    loaded: false,
    last_loaded_on: null,
    loading_page: false,
    loaded_page: false,
    updating: [],
    details: {},
    loading_single: false,
    uploading_photo: false,
    filter: {}
};
export default function locationsReducer(state = initial_state, action) {
    switch (action.type) {
        case types.LOCATIONS_LIST_REQUESTING:
            return {
                ...state,
                loading: true
            };
        case types.LOCATIONS_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                page: action.payload,
                all: [...action.payload.data],
                last_loaded_on: moment(),
            };
        case types.LOCATIONS_LIST_ERROR:
            return {
                ...state,
                loading: false,
            };

        case types.LOCATIONS_SINGLE_REQUESTING:
            return {
                ...state,
                loading_single: true
            };
        case types.LOCATIONS_SINGLE_ERROR:
            return {
                ...state,
                loading_single: false
            };
        case types.LOCATIONS_SINGLE_SUCCESS:
            return {
                ...state,
                details: {...state.details, [action.payload.id]: action.payload},
                loading_single: false
            };

        case types.LOCATIONS_PAGE_REQUESTING:
            return {
                ...state,
                loading_page: true
            };
        case types.LOCATIONS_PAGE_SUCCESS:
            return {
                ...state,
                loading_page: false,
                loaded_page: true,
                page: action.payload,
                all: [...state.all, ...action.payload.data],
            };
        case types.LOCATIONS_PAGE_ERROR:
            return {
                ...state,
                loading_page: false,
            };
        case types.AUTH_LOG_OUT:
            return {
                ...initial_state
            };
        case types.LOCATIONS_UPDATE_REQUESTING:
            return {
                ...state,
                updating: [...state.updating, action.payload]
            };
        case types.LOCATIONS_UPDATE_ERROR:
            return {
                ...state,
                updating: state.updating.filter((i) => (i !== action.payload))
            };

        case types.LOCATIONS_UPLOAD_PHOTO_REQUESTING:
            return {
                ...state,
                uploading_photo: true,
            };
        case types.LOCATIONS_DELETE_PHOTO_SUCCESS:
        case types.LOCATIONS_UPLOAD_PHOTO_SUCCESS:
            return {
                ...state,
                uploading_photo: false,
                details: {...state.details, [action.payload.id]: action.payload},
            };
        case types.LOCATIONS_UPLOAD_PHOTO_ERROR:
            return {
                ...state,
                uploading_photo: false,
            };

        case types.LOCATIONS_UPDATE_SUCCESS:
            return {
                ...state,
                all: state.all.map((item) => (item.id === action.payload.id ? action.payload : item)),
                updating: state.updating.filter((i) => (i !== action.payload.id)),
                details: {...state.details, [action.payload.id]: action.payload},
            };
        case types.LOCATIONS_ADD_FILTER:
            return {
                ...state,
                filter: {...state.filter, ...action.payload}
            };
        case types.LOCATIONS_REPLACE_FILTER:
            return {
                ...state,
                filter: {...action.payload}
            };
        case types.LOCATIONS_REMOVE_FILTER:
            return {
                ...state,
                filter: omit(state.filter, action.payload)
            };

        default:
            return state;
    }
}
