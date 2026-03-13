import React, {Component} from 'react';
import {connect} from 'react-redux';
import {get, indexOf} from 'lodash';
import DashboardActions from "../../actions/dashboardActions";

class AssignMeButton extends Component {
    constructor() {
        super();
        this.shouldBlock = this.shouldBlock.bind(this);
    }

    shouldBlock() {
        return (indexOf(this.props.dashboard.cleanings_updating, this.props.cleaning.id) !== -1);
    }

    render() {
        return (
            <button className="pa1 input-reset b--light-green bg-transparent black-50 f6 pointer"
                    disabled={this.shouldBlock()}
                    onClick={() => {
                        this.props.assignMe(get(this.props, 'cleaning.id'));
                    }}>
                <span className="fa fa-user-plus green"/>
                <span className="di"> {this.shouldBlock() ? 'Assigning...' : 'Assign Me'}</span>
                <span className="dib f7 b green pl1">&#165; {get(this.props, 'cleaning.location.default_staff_cleaning_payout')}</span>
            </button>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        auth: state.auth,
        dashboard: state.dashboard,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        assignMe: (cleaningId) => {
            dispatch(DashboardActions.assignMe(cleaningId))
        },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignMeButton);
