import React, {Component} from 'react';
import {connect} from 'react-redux';
import SuppliesActions from "../../../actions/suppliesActions";
import BlockUi from 'react-block-ui';
import {indexOf} from "lodash";

class RowActions extends Component {
    constructor() {
        super();
        this.state = {
            buy_amount: '',
            use_amount: '',
        };

        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    shouldBlock() {
        return (indexOf(this.props.supplies.updating, this.props.rowId) !== -1);
    }

    render() {
        return (
            <BlockUi tag='div' blocking={this.shouldBlock()}>
                <div>
                    <div className="dib w4">
                        <input type="text" placeholder="Amount"
                               className="pa1 mb2 input-reset br2 black-60 ba b--black-20 bg-transparent w-100"
                               value={this.state.use_amount}
                               name='use_amount'
                               onChange={this.handleInput}/>
                    </div>
                    <div className="dib ml2">
                        <button
                            className="pointer pa1 ph2 input-reset br2 white bg-dark-red bw0 w-100 dis-bg-black-20 dis-white-70"
                            onClick={(e) => {
                                e.preventDefault();
                                this.props.use(this.props.rowId, this.state.use_amount);
                                this.setState({use_amount:''});
                            }}>Use
                        </button>
                    </div>
                </div>
                <div>
                    <div className="dib w4">
                            <input type="text" placeholder="Amount"
                                   className="pa1 mb2 input-reset br2 black-60 ba b--black-20 bg-transparent w-100"
                                   value={this.state.buy_amount}
                                   name='buy_amount'
                                   onChange={this.handleInput}/>
                    </div>
                    <div className="dib ml2">
                        <button
                            className="pointer pa1 ph2 input-reset br2 white bg-dark-green bw0 w-100 dis-bg-black-20 dis-white-70"
                            onClick={(e) => {
                                e.preventDefault();
                                this.setState({buy_amount:''});
                                this.props.buy(this.props.rowId, this.state.buy_amount);
                            }}>Buy
                        </button>
                    </div>
                </div>
            </BlockUi>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        auth: state.auth,
        supplies: state.supplies
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        buy: (id, amount) => {
            dispatch(SuppliesActions.buy(id, {amount: amount}))
        },
        use: (id, amount) => {
            dispatch(SuppliesActions.use(id, {amount: amount}))
        }
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(RowActions);
