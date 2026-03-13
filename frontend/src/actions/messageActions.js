import types from '../actions/types';

const messageActions = {
    successMessage: function (response) {
        return {
            type: types.MESSAGE_RECEIVED,
            payload: {
                txt: response.data.message || 'Success!',
                type: 'success',
                expire_in: 3
            }
        }
    },

    errorReceived: function (error) {
        return {
            type: types.MESSAGE_RECEIVED,
            payload: {
                txt: error.response.data.message || error.response.data.error.message,
                list: error.response.data.error && error.response.data.error.error_list,
                type: 'error',
                expire_in: 5
            }
        }
    },

    customSuccess: function (msg) {
        return {
            type: types.MESSAGE_RECEIVED,
            payload: {
                txt: msg,
                type: 'success',
                expire_in: 3
            }
        }
    },

    customError: function (message) {
        return {
            type: types.MESSAGE_RECEIVED,
            payload: {
                txt: message,
                type: 'error',
                expire_in: 3
            }
        }
    },

    errorRequesting: function (error) {
        return {
            type: types.MESSAGE_RECEIVED,
            payload: {
                txt: 'Error occurred while connecting to server',
                type: 'error',
                expire_in: 5
            }
        }
    },
};

export default messageActions;