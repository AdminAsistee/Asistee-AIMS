import types from '../actions/types';

const initial_state = {
    saving_payment: false
};
export default function profileReducer(state = initial_state, action) {
    switch (action.type) {
        case types.PROFILE_SAVE_CARD_REQUESTING:
            return {
                ...state,
                saving_payment: true,
            };
        case types.PROFILE_SAVE_CARD_ERROR:
            return {
                ...state,
                saving_payment: false,
            };
        case types.PROFILE_SAVE_CARD_SUCCESS:
            return {
                ...state,
                saving_payment: false,
            };

        default:
            return state;
    }
}