import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Auth from '../actions/authActions';
import BlockUi from 'react-block-ui';

class ResetForm extends Component {
    constructor() {
        super();
        this.state = {
            token: window.location.search.substr(1),
            password: ''
        };
        this.handleInput = this.handleInput.bind(this);
        this.shouldDisable = this.shouldDisable.bind(this);
    }

    handleInput(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    shouldDisable() {
        return (!this.state.password || this.props.authState.reset_in_progress)
    }

    render() {
        const {auth, authState, performPasswordReset} = this.props;
        return (
            auth.logged_in ? <Redirect to={'/'}/> :
                authState.just_reset ? <Redirect to={'/login'}/> :
                    <div className='flex min-vh-100 w-100 items-center justify-center'>
                        <div className='w-100 mw6  black-60'>
                            <h2 className="f2 fw2 tc">Reset Password</h2>
                            <BlockUi tag='div' blocking={authState.reset_in_progress}>
                                <form className='login-form bg-white pa3 br2 shadow-4'>
                                    <input type='password' name='password' placeholder='Password'
                                           className=" pa3 input-reset br2 black-60 ba b--black-20 bg-transparent w-100"
                                           value={this.state.password}
                                           onChange={this.handleInput}
                                    />
                                    <button
                                        className="mt3 pointer pa3 input-reset br2 white bg-dark-green bw0 w-100 dis-bg-black-20 dis-white-70"
                                        disabled={this.shouldDisable()}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            performPasswordReset({
                                                token: this.state.token,
                                                password: this.state.password
                                            })
                                        }}
                                    >Apply New Password
                                    </button>
                                </form>
                            </BlockUi>
                        </div>
                    </div>
        );
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
    return {
        performPasswordReset: (email) => dispatch(Auth.performPasswordReset(email))
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(ResetForm);
