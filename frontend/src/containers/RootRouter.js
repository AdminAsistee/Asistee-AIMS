import React, {Component} from 'react'
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';

import TopMenu from '../layout/TopMenu';
import Profile from "./modules/Profile/Profile";
import NotFound from '../components/NotFound';
import {ScaleLoader} from 'halogenium';
import Users from "./modules/Users/Users";
import CleaningViews from "./modules/Cleaning/CleaningViews";
import BookingViews from "./modules/Booking/BookingViews";
import LocationViews from "./modules/Location/LocationViews";
import SupplyViews from "./modules/Supply/SupplyViews";
import DashBoard from "./DashBoard";

class RootRouter extends Component {
    render() {
        const user = this.props.auth.auth_user;
        return (
            this.props.auth.logged_in ?
                user ?
                    <div className={'fl w-100'}>
                        <TopMenu/>
                        <div className='center ph3'>
                            <Switch>
                                <Route path={'/profile'} component={Profile}/>
                                <Route path={'/users'} component={Users}/>
                                <Route path={'/cleanings'} component={CleaningViews}/>
                                <Route path={'/cleaning-calendar'} component={CleaningViews}/>
                                <Route path={'/bookings'} component={BookingViews}/>
                                <Route path={'/locations'} component={LocationViews}/>
                                <Route path={'/supplies'} component={SupplyViews}/>
                                <Route exact path={'/'} component={DashBoard}/>
                                <Route path={'*'} component={NotFound}/>
                            </Switch>
                        </div>
                    </div>
                    :
                    <div className='min-vh-100 tc pt6'>
                        <ScaleLoader color={'#F09169'}/>
                    </div> :
                <Redirect to={'/login'}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(RootRouter);
