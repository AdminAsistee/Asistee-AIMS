import React, {Component} from 'react'
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {includes, get} from 'lodash';
import CalendarSideBar from "./CalendarSideBar";
import Calendar from "./Calendar";
import moment from "moment";

class CleaningCalendar extends Component {
    render() {
        const auth_user = this.props.auth.auth_user;
        const allowedTypes = ['administrator', 'supervisor', 'cleaner', 'client'];
        const date = moment(get(this.props, 'match.params.date')).toDate() || new Date();
        return (
            includes(allowedTypes, auth_user.type) ?
                <div className="cf w-100 pt3">
                    <CalendarSideBar/>
                    <Calendar date={date} history={this.props.history}/>
                </div> : <Redirect to='/'/>
        )
    }
}

// map state
function mapStateToProps(state) {
    return {
        authState: state.authState,
        auth: state.auth,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {}
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(CleaningCalendar);
