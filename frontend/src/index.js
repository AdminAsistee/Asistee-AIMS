import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import axios from 'axios';
import config from './config';
import {StripeProvider} from 'react-stripe-elements';

// import registerServiceWorker from './registerServiceWorker';

import './css/tachyons.css';
import './css/index.css';
import 'react-block-ui/style.css';

// set api base
axios.defaults.baseURL = config.api_base;

// get and save token as axios default header
const savedAuth = JSON.parse(localStorage.getItem('aimsui'));
if (savedAuth) {
    const token = savedAuth.auth && savedAuth.auth.access_token;
    if (token) {
        axios.defaults.headers = {...axios.defaults.headers, Authorization: 'Bearer ' + token};
    }
}

// window.axios = axios;

ReactDOM.render(
    <Provider store={store}>
        <StripeProvider apiKey={config.stripe_key}>
            <Router>
                <App/>
            </Router>
        </StripeProvider>
    </Provider>, document.getElementById('root'));
// registerServiceWorker();
