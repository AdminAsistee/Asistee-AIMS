import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Auth from '../actions/authActions';
import BlockUi from 'react-block-ui';

class Register extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
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
        return (!this.state.name || !this.state.email || !this.state.password || this.props.authState.registration_in_progress)
    }

    render() {
        const {auth, authState, register} = this.props;
        return (
            authState.just_registered ? <Redirect to={'/login'}/> :
                auth.logged_in ? <Redirect to={'/'}/> :
                    <div className='flex min-vh-100 w-100 items-center justify-center'>
                        <div className='w-100 mw6  black-60'>
                            <h2 className="f2 fw2 tc">Create An AIMS Account</h2>
                            <BlockUi tag='div' blocking={authState.registration_in_progress}>
                                <form className='registration-form bg-white br2 shadow-4 pa3'>
                                    <div className="pb3">
                                        <input type="text" placeholder="Name"
                                               className="pa3 input-reset br2 black-60 ba b--black-20 bg-transparent w-100"
                                               value={this.state.name}
                                               name='name'
                                               onChange={this.handleInput}
                                        />
                                    </div>
                                    <div className="pb3">
                                        <input type="text" placeholder="E-mail Address"
                                               className="pa3 input-reset br2 black-60 ba b--black-20 bg-transparent w-100"
                                               value={this.state.email}
                                               name='email'
                                               onChange={this.handleInput}
                                        />
                                    </div>
                                    <div className="pb3">
                                        <input type='password' name='password' placeholder='Password'
                                               className="pa3 input-reset br2 black-60 ba b--black-20 bg-transparent w-100"
                                               value={this.state.password}
                                               onChange={this.handleInput}
                                        />
                                    </div>

                                    <button
                                        className="pointer pa3 input-reset br2 white bg-dark-green bw0 w-100 dis-bg-black-20 dis-white-70"
                                        disabled={this.shouldDisable()}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            register(this.state)
                                        }}
                                    >Register
                                    </button>
                                </form>
                            </BlockUi>

                            <div className='pa3 br2 ba b--silver tc mt4'>
                                Have an account? <Link to='/login' className='link'>Log In</Link>
                            </div>

                        </div>
                    </div>
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
    return {
        register: (credentials) => dispatch(Auth.register(credentials))
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(Register);