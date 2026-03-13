import types from './types';
import messageActions from './messageActions';
import axios from 'axios';

const AuthActions = {
    login: function (credentials) {
        return (dispatch) => {
            dispatch({type: types.AUTH_LOGIN_REQUESTING});
            axios.post('oauth/token', {
                grant_type: 'password',
                username: credentials.email,
                password: credentials.password
            }).then((response) => {
                if (response.status === 200) {
                    axios.defaults.headers = {
                        ...axios.defaults.headers,
                        Authorization: 'Bearer ' + response.data.access_token
                    };
                    dispatch({type: types.AUTH_LOGIN_SUCCESS, payload: response.data});
                    dispatch(this.me());
                } else {
                    dispatch({type: types.AUTH_LOGIN_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.AUTH_LOGIN_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    logout: function () {
        return (dispatch) => {
            axios.get('api/v1/logout');
            dispatch({type: types.AUTH_LOG_OUT});
        }
    },

    me: function () {
        return (dispatch) => {
            dispatch({type: types.AUTH_GET_ME});
            axios.get('api/v1/me')
                .then((response) => {
                    if (response.status === 200) {
                        dispatch({type: types.AUTH_GET_ME_SUCCESS, payload: response.data});
                    } else {
                        dispatch({type: types.AUTH_GET_ME_ERROR});
                        dispatch(messageActions.customError('Unknown Error!'));
                    }
                }).catch((error) => {
                dispatch({type: types.AUTH_LOGIN_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    register: function (credentials) {
        return (dispatch) => {
            dispatch({type: types.AUTH_REGISTRATION_REQUESTING});
            axios.post('api/v1/users', {
                name: credentials.name,
                email: credentials.email,
                password: credentials.password
            }).then((response) => {
                if (response.status === 201) {
                    dispatch({type: types.AUTH_REGISTRATION_SUCCESS});
                    dispatch(messageActions.successMessage(response));
                }
                else {
                    dispatch({type: types.AUTH_REGISTRATION_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.AUTH_REGISTRATION_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    requestPasswordReset: function (form) {
        return (dispatch) => {
            dispatch({type: types.AUTH_PASSWORD_RESET_EMAIL_REQUESTING});
            axios.post('api/v1/request-password-reset', {
                email: form.email,
                reset_path: form.reset_path
            }).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.AUTH_PASSWORD_RESET_EMAIL_SUCCESS});
                    console.log(response.data);
                }
                else {
                    dispatch({type: types.AUTH_PASSWORD_RESET_EMAIL_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.AUTH_PASSWORD_RESET_EMAIL_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    retryPasswordReset: function () {
        return {
            type: types.AUTH_PASSWORD_RESET_RETRY
        }
    },

    performPasswordReset: function (credentials) {
        return (dispatch) => {
            dispatch({type: types.AUTH_PASSWORD_RESET_REQUESTING});
            axios.post('api/v1/reset-password', {
                token: credentials.token,
                password: credentials.password
            }).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.AUTH_PASSWORD_RESET_SUCCESS});
                    dispatch(messageActions.successMessage(response));
                    console.log(response.data);
                }
                else {
                    dispatch({type: types.AUTH_PASSWORD_RESET_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.AUTH_PASSWORD_RESET_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    }
};

export default AuthActions;