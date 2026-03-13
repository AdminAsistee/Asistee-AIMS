import React, {Component} from 'react'
import {connect} from 'react-redux';
import moment from 'moment';

class UsersTable extends Component {
    render() {
        const {users} = this.props;
        return (
            <div className="w-100 pt3 dt">
                <div className="dt-row">
                    <div className="fw5 underline dtc ph2 pv3 v-top w-25">User</div>
                    <div className="fw5 underline dtc-l dn ttc ph2 pv3 v-top  w-25">Phone</div>
                    <div className="fw5 underline dtc ttc ph2 pv3 v-top w-25">Type</div>
                    <div className="fw5 underline dtc-ns dn ttc ph2 pv3 v-top w-25">Joined</div>
                </div>
                {users.map((user) => (
                    <div className="dt-row striped--near-white" key={user.id}>
                        <div className="dtc pa2 v-top w-25">
                            <div>{user.name}</div>
                            <div className="f7 black-40">{user.email}</div>
                            <div className="f7 black-40 dn-l">{user.phone}</div>
                        </div>
                        <div className="dtc-l dn ttc pa2 v-top  w-25">{user.phone}</div>
                        <div className="dtc ttc pa2 v-top w-25">{user.type}</div>
                        <div className="dtc-ns dn ttc pa2 v-top w-25">
                            <div>{moment(user.created_at).fromNow()}</div>
                            <div className='f7 black-40 pv1'>{moment(user.created_at).calendar()}</div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

// map state
function mapStateToProps(state) {
    return {
        authState: state.authState,
        auth: state.auth,
        users: state.users.all,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {}
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(UsersTable);
