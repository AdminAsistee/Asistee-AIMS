import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
// import NotBuilt from "../../../components/NoteBuilt";
import Srizon from "./Srizon";
import SrizonSingle from "./SrizonSingle";

class SrizonViews extends Component {
    render() {
        return (
            <Switch>
                <Route path={'/srizons/:id'} component={SrizonSingle}/>
                <Route exact path={'/srizons'} component={Srizon}/>
            </Switch>
        );
    }
}

// connect and export
export default SrizonViews;
