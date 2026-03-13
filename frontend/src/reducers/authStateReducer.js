import types from '../actions/types';

const initial_state = {
    initializing: true,
    registration_in_progress: false,
    login_in_progress: false,
    reset_in_progress: false,
    just_registered: false,
    reset_sent: false,
    just_reset: false,
};
export default function authStateReducer(state = initial_state, action) {
    switch (action.type) {
        case types.AUTH_LOGIN_SUCCESS:
            return {...state, login_in_progress: false,};
        case types.AUTH_LOG_OUT:
            return {
                ...initial_state
            };
        case types.AUTH_REGISTRATION_REQUESTING:
            return {...state, registration_in_progress: true};
        case types.AUTH_REGISTRATION_ERROR:
            return {...state, registration_in_progress: false};
        case types.AUTH_REGISTRATION_SUCCESS:
            return {...state, registration_in_progress: false, just_registered: true};
        case types.AUTH_LOGIN_REQUESTING:
            return {...state, login_in_progress: true};
        case types.AUTH_LOGIN_ERROR:
            return {...state, login_in_progress: false};
        case types.AUTH_PASSWORD_RESET_EMAIL_REQUESTING:
            return {
                ...state,
                reset_in_progress: true
            };
        case types.AUTH_PASSWORD_RESET_EMAIL_SUCCESS:
            return {
                ...state,
                reset_sent: true,
                reset_in_progress: false
            };
        case types.AUTH_PASSWORD_RESET_EMAIL_ERROR:
            return {
                ...state,
                reset_in_progress: false
            };
        case types.AUTH_PASSWORD_RESET_REQUESTING:
            return {
                ...state,
                reset_in_progress: true
            };
        case types.AUTH_PASSWORD_RESET_SUCCESS:
            return {
                ...state,
                just_reset: true,
                reset_in_progress: false
            };
        case types.AUTH_PASSWORD_RESET_ERROR:
            return {
                ...state,
                reset_in_progress: false
            };
        case types.AUTH_PASSWORD_RESET_RETRY:
            return {
                ...state,
                reset_sent: false
            };
        case types.AUTH_RESET_JUST_REGISTERED_VALUE:
            return {...state, just_registered: false};
        default:
            return state;
    }
}