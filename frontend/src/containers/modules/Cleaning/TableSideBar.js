import React, {Component} from 'react';
import {connect} from 'react-redux';
import CleaningsActions from "../../../actions/cleaningsActions";
import moment from 'moment';
import 'react-day-picker/lib/style.css';
import DateRangeSelector from "../../../components/DateRangeSelector";
import types from "../../../actions/types";
import {Link} from "react-router-dom";

class SideBar extends Component {
    constructor() {
        super();
        this.state = {
            selectingRange: false,
        };
        this.toggleSelectingRange = this.toggleSelectingRange.bind(this);
        this.rangeSelected = this.rangeSelected.bind(this);
    }

    toggleSelectingRange() {
        this.setState((pState) => ({selectingRange: !pState.selectingRange}))
    }

    rangeSelected(retObj) {
        this.toggleSelectingRange();
        console.log(retObj);
        this.props.addFilter({
            day_from: moment(retObj.from).format('YYYY-MM-DD'),
            day_to: moment(retObj.to).format('YYYY-MM-DD')
        })
    }

    render() {
        const {cleanings, addFilter, removeFilter} = this.props;
        return (
            <div className="fl w-100 w-20-l black-60">
                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l tc">
                    <h2 className='f4 f3-ns fw2 mv2 black-90 db-ns'>Actions</h2>
                    <div className='w4 bb bw1 center b--black-10 mb3-ns dn db-l'/>
                    {cleanings.show_add_form ?
                        <div>
                            <button
                                className="w-100-l input-reset pa2 pv1 pv2-l pointer red b--red mb2 mr2 mr0-l br2"
                                onClick={this.props.toggleShowForm}>
                                <span className={'fa fa-chevron-left dib pr2'}/>
                                Cancel Adding Cleaning
                            </button>
                        </div> :
                        <div>
                            <button
                                onClick={this.props.toggleShowForm}
                                className="w-100-l input-reset pa2 pv1 pv2-l br2 pointer green b--green mb2 mr2 mr0-l">
                                Add New Cleaning
                            </button>
                            {cleanings.filter.unassigned ?
                                <span
                                    className="w-100-l pa2 pv1 pv2-l br2 black-60 bg-light-yellow dib border-box mb2 mr2 mr0-l">
                                    Showing Unassigned
                                    <button className="fa fa-close pointer bw0 bg-transparent red hover-dark-red link"
                                            onClick={() => {
                                                removeFilter(['unassigned'])
                                            }}/>
                                </span> :
                                <button
                                    className="w-100-l input-reset pa2 pv1 pv2-l br2 pointer blue b--light-blue mb2 mr2 mr0-l"
                                    onClick={() => {
                                        addFilter({unassigned: true})
                                    }}>Unassigned
                                </button>}
                            {cleanings.filter.day_from ?
                                <span
                                    className="w-100-l pa2 pv1 pv2-l br2 black-60 bg-light-yellow dib border-box mb2 mr2 mr0-l">
                                    Showing Selected Date
                                    <button className="fa fa-close pointer bw0 bg-transparent red hover-dark-red link"
                                            onClick={() => {
                                                removeFilter(['day_from', 'day_to'])
                                            }}/>
                                </span> :
                                this.state.selectingRange ?
                                    <div className="relative">
                                        <div className="absolute bg-white pa3 shadow-2">
                                            <DateRangeSelector onRangeSelect={this.rangeSelected}/>
                                        </div>
                                    </div> :
                                    <div>
                                        <button
                                            onClick={this.toggleSelectingRange}
                                            className="w-100-l input-reset pa2 pv1 pv2-l br2 pointer orange b--orange mb2 mr2 mr0-l">
                                            Select Date Range
                                        </button>
                                        <button
                                            className="w-100-l input-reset pa2 pv1 pv2-l br2 pointer orange b--orange mb2 mr2 mr0-l"
                                            onClick={() => {
                                                addFilter({
                                                    day_from: moment().format('YYYY-MM-DD'),
                                                    day_to: moment().format('YYYY-MM-DD')
                                                })
                                            }}>From Today
                                        </button>
                                        <button
                                            className="w-100-l input-reset pa2 pv1 pv2-l br2 pointer orange b--orange mb2 mr2 mr0-l"
                                            onClick={() => {
                                                addFilter({
                                                    day_from: moment().add(1, 'd').format('YYYY-MM-DD'),
                                                    day_to: moment().add(1, 'd').format('YYYY-MM-DD')
                                                })
                                            }}>From Tomorrow
                                        </button>
                                    </div>
                            }
                        </div>}

                    <div className="fl w-100">
                        <h2 className='f4 f3-ns fw2 mv2 black-90 db-ns'>Related Links</h2>
                        <div className='w4 bb bw1 center b--black-10 mb3-ns dn db-l'/>
                        <Link
                            className="dib w-100-l  pa2 pv1 pv2-l pointer purple mb2 mr2 mr0-l"
                            to='/cleaning-calendar'>
                            Cleaning Calendar
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        auth: state.auth,
        cleanings: state.cleanings
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        addFilter: (filterObject) => {
            dispatch(CleaningsActions.addFilter(filterObject))
        },
        removeFilter: (filterKeys) => {
            dispatch(CleaningsActions.removeFilter(filterKeys))
        },
        toggleShowForm: () => {
            dispatch({type: types.CLEANINGS_TOGGLE_ADD_FORM})
        }
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
