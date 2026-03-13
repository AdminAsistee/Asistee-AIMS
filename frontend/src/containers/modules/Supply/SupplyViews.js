import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
// import NotBuilt from "../../../components/NoteBuilt";
import Supply from "./Supply";
import SupplySingle from "./SupplySingle";

class SupplyViews extends Component {
    render() {
        return (
            <Switch>
                <Route path={'/supplies/:id'} component={SupplySingle}/>
                <Route exact path={'/supplies'} component={Supply}/>
            </Switch>
        );
    }
}

// connect and export
export default SupplyViews;
