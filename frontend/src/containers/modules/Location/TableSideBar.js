import React, {Component} from 'react';
import {connect} from 'react-redux';

import LocationsActions from "../../../actions/locationsActions";

class SideBar extends Component {
    constructor() {
        super();
        this.state = {};
        this.handleInput = this.handleInput.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleInput(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

        if (!value) {
            this.props.removeFilter([name]);
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.props.replaceFilter(this.state);
        }
    }


    render() {
        return (
            <div className="fl w-100 w-20-l black-60">
                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l tc mb3">
                    <h2 className='f4 f3-ns fw2 mv2 black-90 db-ns'>Actions</h2>
                    <div className='w4 bb bw1 center b--black-10 mb3-ns dn db-l'/>
                    <button className="w4-l w-100-l input-reset pa2 pv1 pv2-l br2 pointer green b--green mb2 mr2 mr0-l">
                        Add New
                    </button>
                </div>
                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l tc mb3">
                    <h2 className='f4 f3-ns fw2 mv2 black-90 db-ns'>Search / Filter</h2>
                    <div className='w4 bb bw1 center b--black-10 mb3-ns dn db-l'/>
                    <div>
                        <div className="f6 b pa2">Address:</div>
                        <input className="db w-100 border-box" name="address" onChange={this.handleInput}
                               onKeyPress={this.handleKeyPress}/>
                    </div>
                    <div>
                        <div className="f6 b pa2">Building Name:</div>
                        <input className="db w-100 border-box" name="building_name" onChange={this.handleInput}
                               onKeyPress={this.handleKeyPress}/>
                    </div>
                    <div>
                        <div className="f6 b pa2">Room Number:</div>
                        <input className="db w-100 border-box" name="room_number" onChange={this.handleInput}
                               onKeyPress={this.handleKeyPress}/>
                    </div>
                    <div>
                        <div className="f6 b pa2">Owner (name or email):</div>
                        <input className="db w-100 border-box" name="owner" onChange={this.handleInput}
                               onKeyPress={this.handleKeyPress}/>
                    </div>
                </div>
            </div>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        locations: state.locations
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        addFilter: (filterObject) => {
            dispatch(LocationsActions.addFilter(filterObject))
        },
        removeFilter: (filterKeys) => {
            dispatch(LocationsActions.removeFilter(filterKeys))
        },
        replaceFilter: (filterKeys) => {
            dispatch(LocationsActions.replaceFilter(filterKeys))
        },
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
