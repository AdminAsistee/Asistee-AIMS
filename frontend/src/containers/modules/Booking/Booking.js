import React, {Component} from 'react'
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import TableSideBar from "./TableSideBar";
import {includes, get} from 'lodash';
import TableWrapper from "./TableWrapper";
import BookingsActions from "../../../actions/bookingsActions";
import AddForm from "./AddForm";

class Cleaning extends Component {
    componentDidMount() {
        if (this.props.bookings.loaded === false) {
            this.props.getList();
        }
    }

    render() {
        const auth_user = this.props.auth.auth_user;
        const allowedTypes = ['administrator', 'client'];

        return (
            includes(allowedTypes, auth_user.type) ?
                <div className="cf w-100 pt3">
                    <TableSideBar/>
                    {get(this.props, 'bookings.show_add_form') ?
                        <AddForm/> :
                        <TableWrapper/>}
                </div> : <Redirect to='/'/>
        )
    }
}

// map state
function mapStateToProps(state) {
    return {
        authState: state.authState,
        auth: state.auth,
        bookings: state.bookings,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getList: () => {
            dispatch(BookingsActions.getList())
        },
        addFilter: (filterObject) => {
            dispatch(BookingsActions.addFilter(filterObject))
        },
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(Cleaning);
