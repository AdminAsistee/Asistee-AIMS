import React, {Component} from 'react'
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import TableSideBar from "./TableSideBar";
import {includes} from 'lodash';
import TableWrapper from "./TableWrapper";
import CleaningsActions from "../../../actions/cleaningsActions";
import AddForm from "./AddForm";
import {get} from 'lodash';

class Cleaning extends Component {
    componentDidMount() {
        if (this.props.cleanings.loaded === false) {
            this.props.getList();
        }
    }

    render() {
        const auth_user = this.props.auth.auth_user;
        const allowedTypes = ['administrator', 'supervisor', 'cleaner', 'client'];

        return (
            includes(allowedTypes, auth_user.type) ?
                <div className="cf w-100 pt3">
                    <TableSideBar/>
                    {get(this.props, 'cleanings.show_add_form') ?
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
        cleanings: state.cleanings
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getList: () => {
            dispatch(CleaningsActions.getList())
        },
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(Cleaning);
