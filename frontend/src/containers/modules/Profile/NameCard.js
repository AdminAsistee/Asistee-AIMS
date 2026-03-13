import React, {Component} from 'react'
import {connect} from 'react-redux';
import moment from 'moment';

class NameCard extends Component {
    render() {
        const user = this.props.auth.auth_user;
        return (
            <div className="fl w-100 ba b--black-10 bg-white br2 pa3 pa4-l tc">
                <h2 className='f1 fw2 mv2 baskerville i black-90'>{user.name}</h2>
                <p>{user.bio || 'No bio Added'}</p>
                <p>Account Created: {moment(user.created_at).fromNow()}</p>
                <p>Access: <span className='ttc'>{user.type}</span></p>
            </div>

        )
    }
}

// map state
function mapStateToProps(state) {
    return {
        authState: state.authState,
        auth: state.auth
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {}
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(NameCard);
