import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Cleaning from "./Cleaning";
import CleaningSingle from "./CleaningSingle";
import CleaningCalendar from "./CleaningCalendar";

class CleaningViews extends Component {
    render() {
        return (
            <Switch>
                <Route path={'/cleanings/:id'} component={CleaningSingle}/>
                <Route path={'/cleaning-calendar/month/:date'} component={CleaningCalendar}/>
                <Route path={'/cleaning-calendar'} component={CleaningCalendar}/>
                <Route exact path={'/cleanings'} component={Cleaning}/>
            </Switch>
        );
    }
}

// connect and export
export default CleaningViews;
