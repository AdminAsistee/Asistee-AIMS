import React, {Component} from 'react'
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {get} from 'lodash';
import TableSideBar from "./TableSideBar";
import {includes} from 'lodash';
import TableWrapper from "./TableWrapper";
import LocationsActions from "../../../actions/locationsActions";

class Location extends Component {
    componentDidMount() {
        if (get(this.props, 'locations.loaded') === false) {
            this.props.getList();
        }
    }

    render() {
        const auth_user = this.props.auth.auth_user;
        const allowedTypes = ['administrator', 'supervisor', 'cleaner', 'messenger', 'client'];

        return (
            includes(allowedTypes, auth_user.type) ?
                <div className="cf w-100 pt3">
                    <TableSideBar/>
                    <TableWrapper/>
                    {/*<div className="fl w-100">*/}
                        {/*<pre>*/}
                            {/*{JSON.stringify(get(this.props, 'locations.all'), null, 2)}*/}
                        {/*</pre>*/}
                    {/*</div>*/}
                </div> : <Redirect to='/'/>
        )
    }
}

// map state
function mapStateToProps(state) {
    return {
        authState: state.authState,
        auth: state.auth,
        locations: state.locations
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getList: () => {
            dispatch(LocationsActions.getList())
        },
        addFilter: (filterObject) => {
            dispatch(LocationsActions.addFilter(filterObject))
        },
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(Location);
