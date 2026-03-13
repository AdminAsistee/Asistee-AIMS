import {compose, createStore, combineReducers, applyMiddleware} from 'redux';
import authStateReducer from './reducers/authStateReducer';
import authReducer from './reducers/authReducer';
import messageReducer from './reducers/messageReducer';
import usersReducer from './reducers/usersReducer';
import cleaningsReducer from './reducers/cleaningsReducer';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage'

import logger from 'redux-logger';
import profileReducer from "./reducers/profileReducer";
import bookingsReducer from "./reducers/bookingsReducer";
import locationsReducer from "./reducers/locationsReducer";
import suppliesReducer from "./reducers/suppliesReducer";
import dashboardReducer from "./reducers/dashboardReducer";

const enhancer = compose(applyMiddleware(logger, thunk), persistState(['auth'], {key: 'aimsui'}));

export default createStore(combineReducers({
    authState: authStateReducer,
    auth: authReducer,
    messages: messageReducer,
    users: usersReducer,
    cleanings: cleaningsReducer,
    bookings: bookingsReducer,
    supplies: suppliesReducer,
    locations: locationsReducer,
    profile: profileReducer,
    dashboard: dashboardReducer,
}), enhancer);
