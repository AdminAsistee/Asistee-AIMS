import React, {Component} from 'react';
import RootRouter from './containers/RootRouter';
import Login from './containers/Login';
import Register from './containers/Register';
import ResetEmail from './containers/ResetEmail';
import ResetForm from './containers/ResetForm';
import {Route, Switch} from 'react-router-dom';
import FlashMessages from './containers/FlashMessages';

class App extends Component {
    render() {
        return (
            <div className='bg-near-white cf min-vh-100 helvetica'>
                <Switch>
                    <Route path={'/login'} component={Login}/>
                    <Route path={'/register'} component={Register}/>
                    <Route path={'/reset-password'} component={ResetEmail}/>
                    <Route path={'/perform-password-reset'} component={ResetForm}/>
                    <Route path={'/'} component={RootRouter}/>
                </Switch>
                <FlashMessages/>
            </div>
        );
    }
}

export default App;
