import React, {Component} from 'react';
import {connect} from 'react-redux';

import SuppliesActions from "../../../actions/suppliesActions";

class SideBar extends Component {
    constructor() {
        super();
        this.state = {
            adding: false,
            name: '',
            ready_stock: '',
            in_use_stock: '',
            in_maintenance_stock: '',
        };
        this.toggleAdding = this.toggleAdding.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    toggleAdding() {
        this.setState((pState) => ({adding: !pState.adding}));
    }

    handleInput(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }


    render() {
        return (
            <div className="fl w-100 w-20-l black-60">
                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l tc">
                    <h2 className='f4 f3-ns fw2 mv2 black-90 db-ns'>Actions</h2>
                    <div className='w4 bb bw1 center b--black-10 mb3-ns dn db-l'/>
                    {this.state.adding ?
                        <div className="fl w-100">
                            <div className="pa2 green b fw2">Add new Item</div>
                            <input type="text" placeholder="Name"
                                   className="pa3 mb2 input-reset br2 black-60 ba b--black-20 bg-transparent w-100"
                                   value={this.state.name}
                                   name='name'
                                   onChange={this.handleInput}/>
                            <input type="number" placeholder="Ready Stock"
                                   className="pa3 mb2 input-reset br2 black-60 ba b--black-20 bg-transparent w-100"
                                   value={this.state.ready_stock}
                                   name='ready_stock'
                                   onChange={this.handleInput}/>
                            <input type="number" placeholder="In Use Stock"
                                   className="pa3 mb2 input-reset br2 black-60 ba b--black-20 bg-transparent w-100"
                                   value={this.state.in_use_stock}
                                   name='in_use_stock'
                                   onChange={this.handleInput}/>
                            <input type="number" placeholder="In Maintenance Stock"
                                   className="pa3 mb2 input-reset br2 black-60 ba b--black-20 bg-transparent w-100"
                                   value={this.state.in_maintenance_stock}
                                   name='in_maintenance_stock'
                                   onChange={this.handleInput}/>

                            <div className="fl w-50 pv2 pr2">
                                <button
                                    className="pointer pa2 input-reset br2 white bg-dark-green bw0 w-100 dis-bg-black-20 dis-white-70"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.toggleAdding();
                                        this.props.addItem(this.state);
                                    }}>Add Item
                                </button>
                            </div>
                            <div className="fl w-50 pv2 pl2">
                                <button
                                    className="pointer pa2 input-reset br2 white bg-gray bw0 w-100 dis-bg-black-20 dis-white-70"
                                    onClick={this.toggleAdding}>Cancel
                                </button>
                            </div>
                        </div> :
                        <button
                            className="w4-l w-100-l input-reset pa2 pv1 pv2-l br2 pointer green b--green mb2 mr2 mr0-l"
                            onClick={this.toggleAdding}>
                            Add New
                        </button>}
                </div>
            </div>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        supplies: state.supplies
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        addItem: (payload) => {
            dispatch(SuppliesActions.addItem(payload))
        }
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
