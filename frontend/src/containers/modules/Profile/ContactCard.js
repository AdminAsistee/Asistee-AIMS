import React, {Component} from 'react'
import {connect} from 'react-redux';

class ContactCard extends Component {
    render() {
        const user = this.props.auth.auth_user;
        return (
            <div className="fl w-100 ba b--black-10 bg-white br2 pa3 pa4-l mb3">
                <div className="fl w-100 b--black-10 pb3 f3 mb3 fw2">Contact Info</div>
                <div className={'fl w-100 pv2 b--black-10'}>
                    <div className={'fl w-20 pr4'}><span className={'b'}>Email</span></div>
                    <div className={'fl w-80'}><span>{user.email}</span></div>
                </div>
                <div className={'fl w-100 pv2 bt b--black-10'}>
                    <div className={'fl w-20 pr4'}><span className={'b'}>Phone</span></div>
                    <div className={'fl w-80'}><span>{user.phone || 'No Phone Number Added'}</span></div>
                </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(ContactCard);
