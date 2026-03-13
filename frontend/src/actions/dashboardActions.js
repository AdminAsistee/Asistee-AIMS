import types from './types';
import messageActions from './messageActions';
import axios from 'axios';
import CleaningsActions from "./cleaningsActions";
import moment from 'moment';

const DashboardActions = {
    getTodaysCleanings: function (userType = null) {
        return (dispatch) => {
            dispatch({type: types.DASHBOARD_CLEANINGS_LIST_REQUESTING});
            const filter = {
                day_from: moment().format('YYYY-MM-DD'),
                day_to: moment().format('YYYY-MM-DD')
            };
            axios.get('api/v1/cleanings', {params: filter}).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.DASHBOARD_CLEANINGS_LIST_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.DASHBOARD_CLEANINGS_LIST_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.DASHBOARD_CLEANINGS_LIST_ERROR});
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
            dispatch({type: types.DASHBOARD_CLEANINGS_UPDATE_REQUESTING, payload: cleaningId});
            axios.put('api/v1/assign-me', {cleaningId: cleaningId}).then((response) => {
                if (response.status === 202) {
                    dispatch({type: types.DASHBOARD_CLEANINGS_UPDATE_SUCCESS, payload: cleaningId});
                    dispatch(messageActions.customSuccess('Cleaning assigned'));
                    dispatch(DashboardActions.getUnassignedCleanings());
                    dispatch(DashboardActions.getTodaysCleanings());
                } else {
                    dispatch({type: types.DASHBOARD_CLEANINGS_UPDATE_ERROR, payload: cleaningId});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.DASHBOARD_CLEANINGS_UPDATE_ERROR, payload: cleaningId});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    getUnassignedCleanings: function (userType = null) {
        return (dispatch) => {
            dispatch({type: types.DASHBOARD_UNASSIGNED_CLEANINGS_LIST_REQUESTING});
            const filter = {
                unassigned: true,
                day_from: moment().format('YYYY-MM-DD'),
                day_to: moment().add(7, 'd').format('YYYY-MM-DD')
            };
            axios.get('api/v1/cleanings', {params: filter}).then((response) => {
                if (response.status === 200) {
                    if (userType === 'administrator' || userType === 'supervisor') {
                        dispatch(CleaningsActions.getCleaners());
                    }
                    dispatch({type: types.DASHBOARD_UNASSIGNED_CLEANINGS_LIST_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.DASHBOARD_UNASSIGNED_CLEANINGS_LIST_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.DASHBOARD_UNASSIGNED_CLEANINGS_LIST_ERROR});
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

export default DashboardActions;