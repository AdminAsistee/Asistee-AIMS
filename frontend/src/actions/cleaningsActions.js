import types from './types';
import messageActions from './messageActions';
import axios from 'axios';
import store from '../store';
import suppliesActions from "./suppliesActions";
import {get} from 'lodash';

const CleaningsActions = {
    getList: function (ut = null) {
        return (dispatch) => {
            dispatch({type: types.CLEANINGS_LIST_REQUESTING});
            const filter = store.getState().cleanings.filter;
            const userType = get(store.getState(), 'auth.auth_user.type');
            axios.get('api/v1/cleanings', {params: filter}).then((response) => {
                if (response.status === 200) {
                    if (userType === 'administrator' || userType === 'supervisor') {
                        dispatch(this.getCleaners());
                    }
                    dispatch(suppliesActions.getList());
                    dispatch({type: types.CLEANINGS_LIST_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.CLEANINGS_LIST_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.CLEANINGS_LIST_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    getCalendarList: function (filter) {
        return (dispatch) => {
            dispatch({type: types.CLEANINGS_CALENDAR_LIST_REQUESTING});
            const userType = get(store.getState(), 'auth.auth_user.type');
            axios.get('api/v1/cleanings', {params: filter}).then((response) => {
                if (response.status === 200) {
                    if (userType === 'administrator' || userType === 'supervisor') {
                        dispatch(this.getCleaners());
                    }
                    dispatch({type: types.CLEANINGS_CALENDAR_LIST_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.CLEANINGS_CALENDAR_LIST_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.CLEANINGS_CALENDAR_LIST_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    addNew: function (data) {
        return (dispatch) => {
            dispatch({type: types.CLEANINGS_NEW_REQUESTING});
            axios.post('api/v1/cleanings/create', data).then((response) => {
                if (response.status === 201) {
                    dispatch({type: types.CLEANINGS_NEW_SUCCESS});
                    dispatch(CleaningsActions.getList());
                    dispatch(messageActions.customSuccess('Cleaning Added'));
                }
                else {
                    dispatch({type: types.CLEANINGS_NEW_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.CLEANINGS_NEW_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    getSingleCleaning: function (id) {
        return (dispatch) => {
            dispatch({type: types.CLEANINGS_SINGLE_REQUESTING});
            axios.get('api/v1/cleanings/' + id).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.CLEANINGS_SINGLE_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.CLEANINGS_SINGLE_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.CLEANINGS_SINGLE_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    addFilter: function (filterObject) {
        return (dispatch) => {
            dispatch({type: types.CLEANING_ADD_FILTER, payload: filterObject});
            dispatch(CleaningsActions.getList());
        }
    },

    removeFilter: function (filterKeys) {
        return (dispatch) => {
            dispatch({type: types.CLEANING_REMOVE_FILTER, payload: filterKeys});
            dispatch(CleaningsActions.getList());
        }
    },

    getCleaners: function () {
        return (dispatch) => {
            dispatch({type: types.CLEANINGS_CLEANER_LIST_REQUESTING});
            axios.get('api/v1/cleaner-users',).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.CLEANINGS_CLEANER_LIST_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.CLEANINGS_CLEANER_LIST_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.CLEANINGS_CLEANER_LIST_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    unassignCleaner: function (cleaningId) {
        return (dispatch) => {
            dispatch({type: types.CLEANINGS_UPDATE_REQUESTING, payload: cleaningId});
            axios.put('api/v1/unassign-cleaner', {cleaningId: cleaningId}).then((response) => {
                if (response.status === 202) {
                    dispatch({type: types.CLEANINGS_UPDATE_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.CLEANINGS_UPDATE_ERROR, payload: cleaningId});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.CLEANINGS_UPDATE_ERROR, payload: cleaningId});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    assignCleaner: function (cleaningId, cleanerId) {
        return (dispatch) => {
            dispatch({type: types.CLEANINGS_UPDATE_REQUESTING, payload: cleaningId});
            axios.put('api/v1/assign-cleaner', {cleaningId: cleaningId, cleanerId: cleanerId}).then((response) => {
                if (response.status === 202) {
                    dispatch({type: types.CLEANINGS_UPDATE_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.CLEANINGS_UPDATE_ERROR, payload: cleaningId});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.CLEANINGS_UPDATE_ERROR, payload: cleaningId});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    assignMe: function (cleaningId) {
        return (dispatch) => {
            dispatch({type: types.CLEANINGS_UPDATE_REQUESTING, payload: cleaningId});
            axios.put('api/v1/assign-me', {cleaningId: cleaningId}).then((response) => {
                if (response.status === 202) {
                    dispatch({type: types.CLEANINGS_UPDATE_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.CLEANINGS_UPDATE_ERROR, payload: cleaningId});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.CLEANINGS_UPDATE_ERROR, payload: cleaningId});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    getNextPage: function (url) {
        return (dispatch) => {
            dispatch({type: types.CLEANINGS_PAGE_REQUESTING});
            const filter = store.getState().cleanings.filter;
            axios.get(url, {params: filter}).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.CLEANINGS_PAGE_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.CLEANINGS_PAGE_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.CLEANINGS_PAGE_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },
};

export default CleaningsActions;