import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
// import NotBuilt from "../../../components/NoteBuilt";
import Location from "./Location";
import LocationSingle from "./LocationSingle";

class LocationViews extends Component {
    render() {
        return (
            <Switch>
                <Route path={'/locations/:id'} component={LocationSingle}/>
                <Route exact path={'/locations'} component={Location}/>
            </Switch>
        );
    }
}

// connect and export
export default LocationViews;
