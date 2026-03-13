import types from '../actions/types';

const initial_state = {
    access_token: null,
    refresh_token: null,
    expires_in: null,
    auth_user: null,
    logged_in: false,
};
export default function authReducer(state = initial_state, action) {
    switch (action.type) {
        case types.AUTH_LOGIN_SUCCESS:
            return {
                ...state,
                logged_in: true,
                access_token: action.payload.access_token,
                refresh_token: action.payload.refresh_token,
                expires_in: action.payload.expires_in
            };
        case types.PROFILE_SAVE_CARD_SUCCESS:
        case types.AUTH_GET_ME_SUCCESS:
            return {
                ...state,
                auth_user: action.payload
            };
        case types.AUTH_GET_ME_ERROR:
        case types.AUTH_LOG_OUT:
            return {
                ...initial_state
            };

        default:
            return state;
    }
}
