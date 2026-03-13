import types from './types';
import messageActions from './messageActions';
import axios from 'axios';
import store from '../store';

const LocationsActions = {
    getList: function (userType = null) {
        return (dispatch) => {
            dispatch({type: types.LOCATIONS_LIST_REQUESTING});
            const filter = store.getState().locations.filter;
            axios.get('api/v1/locations', {params: filter}).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.LOCATIONS_LIST_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.LOCATIONS_LIST_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.LOCATIONS_LIST_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    getSingle: function (id) {
        return (dispatch) => {
            dispatch({type: types.LOCATIONS_SINGLE_REQUESTING});
            axios.get('api/v1/locations/' + id).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.LOCATIONS_SINGLE_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.LOCATIONS_SINGLE_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.LOCATIONS_SINGLE_ERROR});
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
            dispatch({type: types.LOCATIONS_ADD_FILTER, payload: filterObject});
            dispatch(LocationsActions.getList());
        }
    },

    removeFilter: function (filterKeys) {
        return (dispatch) => {
            dispatch({type: types.LOCATIONS_REMOVE_FILTER, payload: filterKeys});
            dispatch(LocationsActions.getList());
        }
    },

    replaceFilter: function (filterObject) {
        return (dispatch) => {
            dispatch({type: types.LOCATIONS_REPLACE_FILTER, payload: filterObject});
            dispatch(LocationsActions.getList());
        }
    },

    uploadPhoto: function (file, id) {
        return (dispatch) => {
            dispatch({type: types.LOCATIONS_UPLOAD_PHOTO_REQUESTING});
            let data = new FormData();
            data.append('photo', file);
            axios.post('api/v1/locations-photo/' + id, data, {'content-type': 'multipart/form-data'}).then((response) => {
                if (response.status === 200) {
                    dispatch({
                        type: types.LOCATIONS_UPLOAD_PHOTO_SUCCESS,
                        payload: response.data
                    });
                    dispatch(messageActions.customSuccess('File Uploaded'));
                } else {
                    dispatch({type: types.LOCATIONS_UPLOAD_PHOTO_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.LOCATIONS_UPLOAD_PHOTO_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    deletePhoto: function (id) {
        if ((window.confirm('Are you sure?'))) {
            return (dispatch) => {
                dispatch({type: types.LOCATIONS_DELETE_PHOTO_REQUESTING, payload: {id: id}});
                axios.delete('api/v1/locations-photo/' + id).then((response) => {
                    if (response.status === 200) {
                        dispatch({
                            type: types.LOCATIONS_DELETE_PHOTO_SUCCESS, payload: response.data
                        });
                        dispatch(messageActions.customSuccess('File Deleted'));
                    } else {
                        dispatch({type: types.LOCATIONS_DELETE_PHOTO_ERROR, payload: {id: id}});
                        dispatch(messageActions.customError('Unknown Error!'));
                    }
                }).catch((error) => {
                    dispatch({type: types.LOCATIONS_DELETE_PHOTO_ERROR, payload: {id: id}});
                    if (error.response) {
                        dispatch(messageActions.errorReceived(error));
                    }
                    else if (error.request) {
                        dispatch(messageActions.errorRequesting(error));
                    }
                })
            }
        } else {
            return {type: 'ACTION_CANCELLED'}
        }
    },

    getNextPage: function (url) {
        return (dispatch) => {
            dispatch({type: types.LOCATIONS_PAGE_REQUESTING});
            const filter = store.getState().locations.filter;
            axios.get(url, {params: filter}).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.LOCATIONS_PAGE_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.LOCATIONS_PAGE_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.LOCATIONS_PAGE_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    updateField: function (bookingId, payload) {
        return (dispatch) => {
            dispatch({type: types.LOCATIONS_UPDATE_REQUESTING, payload: bookingId});
            axios.put('api/v1/locations/' + bookingId, payload).then((response) => {
                if (response.status === 202) {
                    dispatch({type: types.LOCATIONS_UPDATE_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.LOCATIONS_UPDATE_ERROR, payload: bookingId});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.LOCATIONS_UPDATE_ERROR, payload: bookingId});
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

export default LocationsActions;