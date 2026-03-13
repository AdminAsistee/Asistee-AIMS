import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Booking from "./Booking";
import BookingSingle from "./BookingSingle";

class CleaningViews extends Component {
    render() {
        return (
            <Switch>
                <Route path={'/bookings/:id'} component={BookingSingle}/>
                <Route exact path={'/bookings'} component={Booking}/>
            </Switch>
        );
    }
}

// connect and export
export default CleaningViews;
