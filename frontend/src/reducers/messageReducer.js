import types from '../actions/types';

const initial_state = {
    current_id: 1,
    count: 0,
    messages: []
};
export default function messageReducer(state = initial_state, action) {
    switch (action.type) {
        case types.MESSAGE_RECEIVED:
            return {
                ...state,
                count: state.count + 1,
                messages: [
                    ...state.messages, {
                        txt: action.payload.txt,
                        list: action.payload.list || null,
                        type: action.payload.type,
                        id: state.current_id,
                        expire_in: action.payload.expire_in ? action.payload.expire_in : 5
                    }],
                current_id: state.current_id + 1
            };
        case types.MESSAGE_EXPIRED:
            return {
                ...state,
                count: state.count - 1,
                messages: state.messages.filter(msg => (msg.id !== action.payload))
            };

        default:
            return state;
    }
}