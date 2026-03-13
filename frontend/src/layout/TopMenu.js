import React, {Component} from 'react';
import logo from './logo.png';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import AuthActions from '../actions/authActions';
import {includes} from "lodash";

class TopMenu extends Component {

    constructor() {
        super();
        this.state = {
            more_menu_open: false,
        };
        this.toggleMoreMenu = this.toggleMoreMenu.bind(this);
    }

    toggleMoreMenu() {
        this.setState((prevState) => ({more_menu_open: !prevState.more_menu_open}));
    }

    render() {
        const user = this.props.auth.auth_user;
        return (
            <div className={'relative'}>
                <nav className={'bb b--black-10 black-70 dt w-100 bg-white'}>
                    <div className="dtc w3 v-mid pv1 ph3">
                        <Link to='/' className='dib w3 h3'>
                            <img src={logo} alt='Site Logo'/>
                        </Link>
                    </div>
                    <div className="dtc tr v-mid pv1 ph3">
                        {includes(['administrator', 'supervisor', 'cleaner', 'client'], user.type) ?
                            <Link to='/cleanings' className='link f4 fw4 hover-black no-underline black-50 dib pv2 ph3'>
                                <span className='fa fa-briefcase f4'/> <span>Cleanings</span>
                            </Link> : null}

                        {includes(['administrator', 'client'], user.type) ?
                            <Link to='/bookings' className='link f4 fw4 hover-black no-underline black-50 dib pv2 ph3'>
                                <span className='fa fa-calendar-check-o f4'/> <span>Bookings</span>
                            </Link> : null}

                        {includes(['administrator', 'supervisor', 'cleaner', 'messenger', 'client'], user.type) ?
                            <Link to='/locations' className='link f4 fw4 hover-black no-underline black-50 dib pv2 ph3'>
                                <span className='fa fa-map-marker f4'/> <span>Locations</span>
                            </Link> : null}

                        {this.state.more_menu_open ?
                            <button
                                className='button-reset bw0 fa fa-chevron-up link f4 pointer black hover-black-50 dib pv2 ph3'
                                onClick={this.toggleMoreMenu}/> :
                            <button
                                className='button-reset bw0 fa fa-chevron-down link f4 pointer black-50 hover-black dib pv2 ph3'
                                onClick={this.toggleMoreMenu}/>}
                    </div>
                </nav>

                {/*drop-down menu*/}
                <nav
                    className={"absolute w-50 2-40-m z-999 w-20-l right-0 tc mr3 nt2 bg-white ba b--black-10" + (this.state.more_menu_open ? '' : ' dn')}
                    onClick={this.toggleMoreMenu}>
                    {user.type === 'administrator' ?
                        <Link to='/users'
                              className='link f4 fw4 hover-black no-underline black-50 db pv3 bb b--near-white'>
                            <span className='fa fa-users green'/> <span>Users</span>
                        </Link> : null}
                    <Link to='/profile'
                          className='link f4 fw4 hover-black no-underline black-50 db pv3 bb b--near-white'>
                        <span className='fa fa-user green'/> <span>Profile</span>
                    </Link>
                    {includes(['administrator', 'supervisor', 'cleaner', 'client'], user.type) ?
                        <Link to='/cleaning-calendar' className='link f4 fw4 pointer hover-black no-underline black-50 db pv3 bb b--near-white'>
                            <span className='fa fa-calendar blue f4'/> <span>Cleanings Calendar</span>
                        </Link> : null}
                    {includes(['administrator', 'supervisor'], user.type) ?
                        <Link to='/supplies' className='link f4 fw4 pointer hover-black no-underline black-50 db pv3 bb b--near-white'>
                            <span className='fa fa-truck f4 gold'/> <span>Supplies</span>
                        </Link> : null}
                    <a className='link f4 fw4 pointer hover-black no-underline black-50 db pv3'
                       onClick={this.props.logout}>
                        <span className='fa fa-sign-out gray'/> <span>Logout</span>
                    </a>
                </nav>
            </div>
        )
    }
}

// map state
function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        logout: () => {
            dispatch(AuthActions.logout())
        }
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
