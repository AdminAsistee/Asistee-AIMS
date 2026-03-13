import types from './types';
import messageActions from './messageActions';
import axios from 'axios';

const ModuleActions = {
    getList: function () {
        return (dispatch) => {
            dispatch({type: types.USERS_LIST_REQUESTING});
            axios.get('api/v1/users').then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.USERS_LIST_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.USERS_LIST_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.USERS_LIST_ERROR});
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
            dispatch({type: types.USERS_PAGE_REQUESTING});
            axios.get(url).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.USERS_PAGE_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.USERS_PAGE_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.USERS_PAGE_ERROR});
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

export default ModuleActions;