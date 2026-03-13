import types from './types';
import messageActions from './messageActions';
import axios from 'axios';
import CleaningsActions from "./cleaningsActions";

const SuppliesActions = {
    getList: function (userType = null) {
        return (dispatch) => {
            dispatch({type: types.SUPPLIES_LIST_REQUESTING});
            axios.get('api/v1/supplies').then((response) => {
                if (response.status === 200) {
                    dispatch({type: types.SUPPLIES_LIST_SUCCESS, payload: response.data});
                } else {
                    dispatch({type: types.SUPPLIES_LIST_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.SUPPLIES_LIST_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    fulfillSupplyRequest: function (supply) {
        return (dispatch) => {
            dispatch({type: types.SUPPLY_TRANSACTIONS_CHANGE_REQUESTING});
            axios.put('api/v1/supplies_transactions/' + supply.id + '/fulfill').then((response) => {
                if (response.status === 202) {
                    dispatch({type: types.SUPPLY_TRANSACTIONS_CHANGE_SUCCESS});
                    dispatch(messageActions.customSuccess('Item marked as fulfilled!'));
                    dispatch(CleaningsActions.getSingleCleaning(supply.cleaning_id));
                    dispatch(SuppliesActions.getList());
                } else {
                    dispatch({type: types.SUPPLY_TRANSACTIONS_CHANGE_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.SUPPLY_TRANSACTIONS_CHANGE_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    deliverSupplyRequest: function (supply) {
        return (dispatch) => {
            dispatch({type: types.SUPPLY_TRANSACTIONS_CHANGE_REQUESTING});
            axios.put('api/v1/supplies_transactions/' + supply.id + '/deliver').then((response) => {
                if (response.status === 202) {
                    dispatch({type: types.SUPPLY_TRANSACTIONS_CHANGE_SUCCESS});
                    dispatch(messageActions.customSuccess('Item marked as delivered!'));
                    dispatch(CleaningsActions.getSingleCleaning(supply.cleaning_id));
                } else {
                    dispatch({type: types.SUPPLY_TRANSACTIONS_CHANGE_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.SUPPLY_TRANSACTIONS_CHANGE_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    requestSupply: function (payload) {
        return (dispatch) => {
            dispatch({type: types.SUPPLY_TRANSACTIONS_ADD_REQUESTING});
            axios.post('api/v1/supplies_transactions', payload).then((response) => {
                if (response.status === 201) {
                    dispatch({type: types.SUPPLY_TRANSACTIONS_ADD_SUCCESS});
                    dispatch(messageActions.customSuccess('Item Created!'));
                    dispatch(CleaningsActions.getSingleCleaning(payload.cleaning_id));
                } else {
                    dispatch({type: types.SUPPLY_TRANSACTIONS_ADD_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.SUPPLY_TRANSACTIONS_ADD_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    addItem: function (payload) {
        return (dispatch) => {
            dispatch({type: types.SUPPLIES_ADD_REQUESTING});
            axios.post('api/v1/supplies', payload).then((response) => {
                if (response.status === 201) {
                    dispatch({type: types.SUPPLIES_ADD_SUCCESS});
                    dispatch(messageActions.customSuccess('Item Created!'));
                    dispatch(SuppliesActions.getList());
                } else {
                    dispatch({type: types.SUPPLIES_ADD_ERROR});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.SUPPLIES_ADD_ERROR});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },


    buy: function (supplyId, payload) {
        return (dispatch) => {
            dispatch({type: types.SUPPLIES_UPDATE_REQUESTING, payload: supplyId});
            axios.put('api/v1/supplies/' + supplyId + '/buy', payload).then((response) => {
                if (response.status === 202) {
                    dispatch({type: types.SUPPLIES_UPDATE_SUCCESS, payload: response.data});
                    dispatch(messageActions.customSuccess('Stock Updated!'));
                } else {
                    dispatch({type: types.SUPPLIES_UPDATE_ERROR, payload: supplyId});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.SUPPLIES_UPDATE_ERROR, payload: supplyId});
                if (error.response) {
                    dispatch(messageActions.errorReceived(error));
                }
                else if (error.request) {
                    dispatch(messageActions.errorRequesting(error));
                }
            })
        }
    },

    use: function (supplyId, payload) {
        return (dispatch) => {
            dispatch({type: types.SUPPLIES_UPDATE_REQUESTING, payload: supplyId});
            axios.put('api/v1/supplies/' + supplyId + '/use', payload).then((response) => {
                if (response.status === 202) {
                    dispatch({type: types.SUPPLIES_UPDATE_SUCCESS, payload: response.data});
                    dispatch(messageActions.customSuccess('Stock Updated!'));
                } else {
                    dispatch({type: types.SUPPLIES_UPDATE_ERROR, payload: supplyId});
                    dispatch(messageActions.customError('Unknown Error!'));
                }
            }).catch((error) => {
                dispatch({type: types.SUPPLIES_UPDATE_ERROR, payload: supplyId});
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

export default SuppliesActions;