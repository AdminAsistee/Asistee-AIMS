import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Auth from '../actions/authActions';
import BlockUi from 'react-block-ui';

class ResetEmail extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            reset_path: window.location.origin + '/perform-password-reset'
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
        return (!this.state.email || this.props.authState.reset_in_progress)
    }

    render() {
        const {authState, auth, requestPasswordReset, retryPasswordReset} = this.props;
        return (
            auth.logged_in ? <Redirect to={'/'}/> :
                <div className='flex min-vh-100 w-100 items-center justify-center'>
                    <div className='w-100 mw6  black-60'>
                        <h2 className="f2 fw2 tc">Reset Password</h2>
                        {authState.reset_sent ?
                            <div className='tc bg-white pa3 br2 shadow-4'>
                                <h3>Reset instructions sent to <em>{this.state.email}</em></h3>
                                <p>Check your email! It may take a couple of minutes.</p>
                                <button
                                    className="mt3 pointer pv2 ph3 input-reset br2 white bg-black-40 bw0 w4"
                                    onClick={retryPasswordReset}>Try Again
                                </button>
                            </div> :
                            <BlockUi tag='div' blocking={authState.reset_in_progress}>
                                <form className='login-form bg-white pa3 br2 shadow-4'>
                                    <input type="text" placeholder="Registered E-mail Address"
                                           className="pa3 input-reset br2 black-60 ba b--black-20 bg-transparent w-100"
                                           value={this.state.email}
                                           name='email'
                                           onChange={this.handleInput}
                                    />
                                    <button
                                        className="mt3 pointer pa3 input-reset br2 white bg-dark-green bw0 w-100 dis-bg-black-20 dis-white-70"
                                        disabled={this.shouldDisable()}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            requestPasswordReset(this.state)
                                        }}
                                    >Send Reset Instructions
                                    </button>
                                </form>
                            </BlockUi>}

                        <div className='pa3 br2 ba b--silver tc mt4'>
                            New to our system? <Link to='/register' className='link'>Sign Up</Link>
                        </div>

                        <p className="pt3 tc ma0">
                            Back to <Link to='/login' className='link'>Login!</Link>
                        </p>

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
        requestPasswordReset: (form) => dispatch(Auth.requestPasswordReset(form)),
        retryPasswordReset: () => dispatch(Auth.retryPasswordReset()),
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(ResetEmail);
