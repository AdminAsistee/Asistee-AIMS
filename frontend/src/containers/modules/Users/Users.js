import React, {Component} from 'react'
import {connect} from 'react-redux';
import LoaderCenter from "../../../components/LoaderCenter";
import UsersTable from "./UsersTable";
import {Redirect} from 'react-router-dom';
import UsersActions from "../../../actions/usersActions";
import TableReloader from "../../../components/TableReloader";

class Users extends Component {
    componentDidMount() {
        if (this.props.users.loaded === false) {
            this.props.getList();
        }
    }

    render() {
        const auth_user = this.props.auth.auth_user;
        const {users, getList, getNextPage} = this.props;
        return (
            auth_user.type === 'administrator' ?
                <div className="fl w-100 pt3">
                    <div className="fl w-100 w-20-l black-60">
                        <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l tc">
                            <h2 className='f3 fw2 mv2 black-90 dn db-ns'>Actions</h2>
                            <div className='w4 bb bw1 center b--black-10 mb3-ns dn db-ns'/>
                            <button className="w4 w-100-ns input-reset pa2-ns pa1 pointer green b--green">Add New
                            </button>
                        </div>
                    </div>

                    <div className="pl0 pl3-l pt3 pt0-l fl w-100 w-80-l black-60">
                        <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l">
                            <div className="cf">
                                <div className="fl w-40">
                                    <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Users {users.loaded ?
                                        <small>({users.all.length + '/' + users.page.total})</small> : null}</h2>
                                    <div className='fl w5 bb bw1 b--black-10 ml2'/>
                                </div>
                                {users.loaded ?
                                    <TableReloader loading={users.loading} last_loaded_on={users.last_loaded_on}
                                                   getList={getList}/> : null}
                            </div>

                            {users.loading ? <LoaderCenter/> : <UsersTable/>}
                            {(users.loading_page) ?
                                <LoaderCenter/> :
                                (users.loaded && !users.loading) ?
                                    <div className="tc pt3 pb1">
                                        <div className="f7 black-50 pv2">Showing {users.all.length + ' '}
                                            of {users.page.total}</div>
                                        {users.page.next_page_url ?
                                            <button className="input-reset pv2 ph3 f5 pointer green b--green"
                                                    onClick={() => {
                                                        getNextPage(users.page.next_page_url)
                                                    }}>
                                                Load More
                                            </button> : null}
                                    </div> : null
                            }
                        </div>
                    </div>
                </div> : <Redirect to='/'/>
        )
    }
}

// map state
function mapStateToProps(state) {
    return {
        authState: state.authState,
        auth: state.auth,
        users: state.users
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getList: () => {
            dispatch(UsersActions.getList())
        },
        getNextPage: (url) => {
            dispatch(UsersActions.getNextPage(url))
        },
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(Users);
