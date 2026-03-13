import React, {Component} from 'react';
import {connect} from 'react-redux';
import TodayCleanings from "./DashBoardItems/Cleaner/TodayCleanings";
import UnassignedCleanings from "./DashBoardItems/Cleaner/UnassignedCleanings";
import DashboardActions from "../actions/dashboardActions";
import {get} from 'lodash';

class DashBoard extends Component {
    componentDidMount() {
        if (get(this.props, 'auth.auth_user.type') === 'cleaner') {
            this.props.getTodaysCleanings();
            this.props.getUnassginedCleanings();
        }
    }

    render() {
        const auth_user = this.props.auth.auth_user;
        return (
            <div className="cf w-100 pt3">
                {/*left column*/}
                <div className="fl w-100 w-50-l black-60 pr2-l mb3">
                    {auth_user.type === 'cleaner' ?
                        <TodayCleanings/> : null
                    }
                </div>

                {/*right column*/}
                <div className="fl w-100 w-50-l black-60 pl2-l mb3">
                    {auth_user.type === 'cleaner' ?
                        <UnassignedCleanings/> : null
                    }
                </div>
            </div>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        auth: state.auth,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getTodaysCleanings: () => {
            dispatch(DashboardActions.getTodaysCleanings());
        },
        getUnassginedCleanings: () => {
            dispatch(DashboardActions.getUnassignedCleanings());
        }
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
