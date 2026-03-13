import React, {Component} from 'react';
import {connect} from 'react-redux';

// import SrizonsActions from "../../../actions/srizonsActions";

class SideBar extends Component {
    constructor() {
        super();
        this.state = {};
    }


    render() {
        const {srizons, addFilter, removeFilter} = this.props;
        return (
            <div className="fl w-100 w-20-l black-60">
                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l tc">
                    <h2 className='f4 f3-ns fw2 mv2 black-90 db-ns'>Actions</h2>
                    <div className='w4 bb bw1 center b--black-10 mb3-ns dn db-l'/>
                    <button className="w4-l w-100-l input-reset pa2 pv1 pv2-l br2 pointer green b--green mb2 mr2 mr0-l">
                        Add New
                    </button>
                </div>
            </div>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        srizons: state.srizons
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        addFilter: (filterObject) => {
            // dispatch(SrizonsActions.addFilter(filterObject))
        },
        removeFilter: (filterKeys) => {
            // dispatch(SrizonsActions.removeFilter(filterKeys))
        },
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
