import React from 'react';
import {connect} from 'react-redux';
import TempMessage from '../components/TempMessage';
import FlipMove from 'react-flip-move';
import types from '../actions/types';
import './FlashMessages.css';

const FlashMessages = ({count, messages, hide_message}) => (
    <div className="fixed-top-right">
        <FlipMove duration={500} easing="ease-out">
            {
                count ? messages.map(msg => <TempMessage key={msg.id} msg={msg} hide_message={hide_message}/>) : null
            }
        </FlipMove>
    </div>
);

function mapStateToProps(state) {
    return {
        count: state.messages.count,
        messages: state.messages.messages
    }
}

function mapDispatchToProps(dispatch) {
    return {
        hide_message: (id) => {
            dispatch({
                type: types.MESSAGE_EXPIRED,
                payload: id
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashMessages);
