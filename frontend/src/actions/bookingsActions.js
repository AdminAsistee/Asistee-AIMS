import types from './types';
import messageActions from './messageActions';
import axios from 'axios';
import store from '../store';

const BookingsActions = {
    getList: function (userType = null) {
        return (dispatch) => {
            dispatch({type: types.BOOKINGS_LIST_REQUESTING});
            const filter = store.getState().bookings.filter;
            axios.get('api/v1/bookings', {params: filter}).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.BOOKINGS_LIST_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.BOOKINGS_LIST_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.BOOKINGS_LIST_ERROR});
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
            dispatch({type: types.BOOKINGS_CALENDAR_LIST_REQUESTING});
            axios.get('api/v1/bookings', {params: filter}).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.BOOKINGS_CALENDAR_LIST_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.BOOKINGS_CALENDAR_LIST_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.BOOKINGS_CALENDAR_LIST_ERROR});
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
            dispatch({type: types.BOOKINGS_NEW_REQUESTING});
            axios.post('api/v1/bookings', data).then((response) => {
                if (response.status === 201) {
                    dispatch({type: types.BOOKINGS_NEW_SUCCESS});
                    dispatch(BookingsActions.getList());
                    dispatch(messageActions.customSuccess('Booking Added'));
                }
                else {
                    dispatch({type: types.BOOKINGS_NEW_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.BOOKINGS_NEW_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    getListings: function (perPage = 500) {
        return (dispatch) => {
            dispatch({type: types.LISTINGS_LIST_REQUESTING});
            axios.get('api/v1/listings', {params: {perPage: perPage}}).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.LISTINGS_LIST_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.LISTINGS_LIST_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.LISTINGS_LIST_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    getSingleBooking: function (id) {
        return (dispatch) => {
            dispatch({type: types.BOOKINGS_SINGLE_REQUESTING});
            axios.get('api/v1/bookings/' + id).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.BOOKINGS_SINGLE_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.BOOKINGS_SINGLE_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.BOOKINGS_SINGLE_ERROR});
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
            dispatch({type: types.BOOKINGS_ADD_FILTER, payload: filterObject});
            dispatch(this.getList());
        }
    },

    removeFilter: function (filterKeys) {
        return (dispatch) => {
            dispatch({type: types.BOOKINGS_REMOVE_FILTER, payload: filterKeys});
            dispatch(this.getList());
        }
    },

    getNextPage: function (url) {
        return (dispatch) => {
            dispatch({type: types.BOOKINGS_PAGE_REQUESTING});
            const filter = store.getState().bookings.filter;
            axios.get(url, {params: filter}).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.BOOKINGS_PAGE_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.BOOKINGS_PAGE_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.BOOKINGS_PAGE_ERROR});
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
            dispatch({type: types.BOOKINGS_UPDATE_REQUESTING, payload: bookingId});
            axios.put('api/v1/bookings/' + bookingId, payload).then((response) => {
                if (response.status === 202) {
                    dispatch({type: types.BOOKINGS_UPDATE_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.BOOKINGS_UPDATE_ERROR, payload: bookingId});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.BOOKINGS_UPDATE_ERROR, payload: bookingId});
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

export default BookingsActions;