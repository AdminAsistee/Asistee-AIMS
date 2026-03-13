import types from '../actions/types';

const initial_state = {
    cleanings: [],
    cleanings_loading: false,
    cleanings_loaded: false,
    cleanings_updating: [],
    unassigned_cleanings: [],
    unassigned_cleanings_loading: false,
    unassigned_cleanings_loaded: false,

};
export default function dashboardReducer(state = initial_state, action) {
    switch (action.type) {
        case types.DASHBOARD_CLEANINGS_LIST_REQUESTING:
            return {
                ...state,
                cleanings_loading: true
            };

        case types.DASHBOARD_CLEANINGS_LIST_SUCCESS:
            return {
                ...state,
                cleanings_loading: false,
                cleanings_loaded: true,
                cleanings: [...action.payload.data],
            };

        case types.DASHBOARD_CLEANINGS_LIST_ERROR:
            return {
                ...state,
                cleanings_loading: false,
            };

        case types.DASHBOARD_UNASSIGNED_CLEANINGS_LIST_REQUESTING:
            return {
                ...state,
                unassigned_cleanings_loading: true
            };

        case types.DASHBOARD_UNASSIGNED_CLEANINGS_LIST_SUCCESS:
            return {
                ...state,
                unassigned_cleanings_loading: false,
                unassigned_cleanings_loaded: true,
                unassigned_cleanings: [...action.payload.data.slice(0, 5)],
            };

        case types.DASHBOARD_UNASSIGNED_CLEANINGS_LIST_ERROR:
            return {
                ...state,
                unassigned_cleanings_loading: false,
            };

        case types.DASHBOARD_CLEANINGS_UPDATE_REQUESTING:
            return {
                ...state,
                cleanings_updating: [...state.cleanings_updating, action.payload]
            };
        case types.DASHBOARD_CLEANINGS_UPDATE_SUCCESS:
            return {
                ...state,
                cleanings_updating: state.cleanings_updating.filter((i) => (i !== action.payload))
            };
        case types.DASHBOARD_CLEANINGS_UPDATE_ERROR:
            return {
                ...state,
                cleanings_updating: state.cleanings_updating.filter((i) => (i !== action.payload))
            };

        case types.AUTH_LOG_OUT:
            return {
                ...initial_state
            };

        default:
            return state;
    }
}
