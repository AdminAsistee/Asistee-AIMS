import types from './types';
import messageActions from './messageActions';
import axios from 'axios';

const profileActions = {
    saveCard: function (stripe) {
        return (dispatch) => {
            dispatch({type: types.PROFILE_SAVE_CARD_REQUESTING});
            axios.post('api/v1/save-card', {
                stripe: stripe
            }).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.PROFILE_SAVE_CARD_SUCCESS, payload: response.data});
                    dispatch(messageActions.customSuccess('Card Saved!'));
                } else {
                    dispatch({type: types.PROFILE_SAVE_CARD_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.PROFILE_SAVE_CARD_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    updateMe: function (key, value) {
        return (dispatch) => {
            dispatch({type: types.PROFILE_SAVE_FIELD_REQUESTING});
            axios.put('api/v1/me', {
                [key]: value
            }).then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.AUTH_GET_ME_SUCCESS, payload: response.data});
                    dispatch(messageActions.customSuccess('Field Updated!'));
                } else {
                    dispatch({type: types.PROFILE_SAVE_FIELD_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.PROFILE_SAVE_FIELD_ERROR});
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

export default profileActions;