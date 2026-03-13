import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Auth from '../actions/authActions';
import BlockUi from 'react-block-ui';

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
        };
        this.handleInput = this.handleInput.bind(this);
        this.shouldDisable = this.shouldDisable.bind(this);
    }

    componentDidMount() {
        this.props.reset_just_registered();
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
        return (this.props.authState.login_in_progress)
    }

    render() {
        const {auth, login, authState} = this.props;
        return (
            auth.logged_in ? <Redirect to={'/'}/> :
                <div className='flex min-vh-100 w-100 items-center justify-center'>
                    <div className='w-100 mw6  black-60'>
                        <h2 className="f2 fw2 tc">Login to AIMS Account</h2>
                        <BlockUi tag='div' blocking={authState.login_in_progress}>
                            <form className='login-form bg-white pa3 br2 shadow-4'>
                                <input type="text" placeholder="E-mail Address"
                                       className="pa3 input-reset br2 black-60 ba b--black-20 bg-transparent w-100"
                                       value={this.state.email}
                                       name='email'
                                       onChange={this.handleInput}
                                />
                                <input type='password' name='password' placeholder='Password'
                                       className="mt3 pa3 input-reset br2 black-60 ba b--black-20 bg-transparent w-100"
                                       value={this.state.password}
                                       onChange={this.handleInput}
                                />
                                <button
                                    className="mt3 pointer pa3 input-reset br2 white bg-dark-green bw0 w-100 dis-bg-black-20 dis-white-70"
                                    disabled={this.shouldDisable()}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        login({
                                            email: this.state.email,
                                            password: this.state.password
                                        })
                                    }}
                                >Login
                                </button>
                            </form>
                        </BlockUi>

                        <div className='pa3 br2 ba b--silver tc mt4'>
                            New to our system? <Link to='/register' className='link'>Sign Up</Link>
                        </div>

                        <p className="pt3 tc ma0">
                            Forgot password? <Link to='/reset-password' className='link'>Reset!</Link>
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
        login: (credentials) => dispatch(Auth.login(credentials)),
        reset_just_registered: () => dispatch({type: 'USER_RESET_JUST_REGISTERED_VALUE'})
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
