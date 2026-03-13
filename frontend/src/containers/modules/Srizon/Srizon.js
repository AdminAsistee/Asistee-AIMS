import React, {Component} from 'react'
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {get} from 'lodash';
import TableSideBar from "./TableSideBar";
import {includes} from 'lodash';
import TableWrapper from "./TableWrapper";

// import SrizonsActions from "../../../actions/srizonsActions";

class Srizon extends Component {
    componentDidMount() {
        if (get(this.props, 'srizons.loaded') === false) {
            this.props.getList();
        }
    }

    render() {
        const auth_user = this.props.auth.auth_user;
        const allowedTypes = ['administrator', 'supervisor'];

        return (
            includes(allowedTypes, auth_user.type) ?
                <div className="cf w-100 pt3">
                    <TableSideBar/>
                    <TableWrapper/>
                    {/*<div className="fl w-100">*/}
                    {/*<pre>*/}
                    {/*{JSON.stringify(get(this.props, 'srizons.all'), null, 2)}*/}
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
        srizons: state.srizons
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getList: () => {
            // dispatch(SrizonsActions.getList())
        },
        addFilter: (filterObject) => {
            // dispatch(SrizonsActions.addFilter(filterObject))
        },
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(Srizon);
