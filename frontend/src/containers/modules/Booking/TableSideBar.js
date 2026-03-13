import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import 'react-day-picker/lib/style.css';
import DateRangeSelector from "../../../components/DateRangeSelector";
import BookingsActions from "../../../actions/bookingsActions";
import types from "../../../actions/types";

class SideBar extends Component {
    constructor() {
        super();
        this.state = {
            selectingCheckinRange: false,
            selectingCheckoutRange: false,
        };
        this.toggleSelectingCheckinRange = this.toggleSelectingCheckinRange.bind(this);
        this.checkinRangeSelected = this.checkinRangeSelected.bind(this);
    }

    toggleSelectingCheckinRange() {
        this.setState((pState) => ({selectingCheckinRange: !pState.selectingCheckinRange}))
    }

    checkinRangeSelected(retObj) {
        this.toggleSelectingCheckinRange();
        console.log(retObj);
        this.props.addFilter({
            checkin_from: moment(retObj.from).format('YYYY-MM-DD'),
            checkin_to: moment(retObj.to).format('YYYY-MM-DD')
        })
    }

    render() {
        const {bookings, addFilter, removeFilter} = this.props;
        return (
            <div className="fl w-100 w-20-l black-60">
                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l tc">
                    <h2 className='f4 f3-ns fw2 mv2 black-90 db-ns'>Actions</h2>
                    <div className='w4 bb bw1 center b--black-10 mb3-ns dn db-l'/>
                    {bookings.show_add_form ?
                        <div>
                            <button
                                className="w4-l w-100-l input-reset pa2 pv1 pv2-l pointer red b--red mb2 mr2 mr0-l br2"
                                onClick={this.props.toggleShowForm}>
                                <span className={'fa fa-chevron-left dib pr2'}/>
                                Cancel Adding Booking
                            </button>
                        </div> :
                        <div>
                            <button
                                onClick={this.props.toggleShowForm}
                                className="w4-l w-100-l input-reset pa2 pv1 pv2-l br2 pointer green b--green mb2 mr2 mr0-l">
                                Add New Booking
                            </button>
                            {bookings.filter.upcoming ?
                                <span
                                    className="w4-l w-100-l pa2 pv1 pv2-l br2 black-60 bg-light-yellow dib border-box mb2 mr2 mr0-l">
                                    Showing Upcoming
                                    <button className="fa fa-close pointer bw0 bg-transparent red hover-dark-red link"
                                            onClick={() => {
                                                removeFilter(['upcoming'])
                                            }}/>
                                </span> :
                                <button
                                    className="w4-l w-100-l input-reset pa2 pv1 pv2-l br2 pointer blue b--light-blue mb2 mr2 mr0-l"
                                    onClick={() => {
                                        addFilter({upcoming: true})
                                    }}>Show Upcoming
                                </button>}
                            {bookings.filter.checkin_from ?
                                <span
                                    className="w4-l w-100-l pa2 pv1 pv2-l br2 black-60 bg-light-yellow dib border-box mb2 mr2 mr0-l">
                                    Showing Selected Date
                                    <button className="fa fa-close pointer bw0 bg-transparent red hover-dark-red link"
                                            onClick={() => {
                                                removeFilter(['checkin_from', 'checkin_to'])
                                            }}/>
                                </span> :
                                this.state.selectingCheckinRange ?
                                    <div className="relative">
                                        <div className="absolute bg-white pa3 shadow-2">
                                            <DateRangeSelector onRangeSelect={this.checkinRangeSelected}/>
                                        </div>
                                    </div> :
                                    <div>
                                        <button
                                            onClick={this.toggleSelectingCheckinRange}
                                            className="w4-l w-100-l input-reset pa2 pv1 pv2-l br2 pointer orange b--orange mb2 mr2 mr0-l">
                                            Select Checkin Dates
                                        </button>
                                        <button
                                            className="w4-l w-100-l input-reset pa2 pv1 pv2-l br2 pointer orange b--orange mb2 mr2 mr0-l"
                                            onClick={() => {
                                                addFilter({
                                                    checkin_from: moment().format('YYYY-MM-DD'),
                                                    checkin_to: moment().format('YYYY-MM-DD')
                                                })
                                            }}>Today's Checkins
                                        </button>
                                        <button
                                            className="w4-l w-100-l input-reset pa2 pv1 pv2-l br2 pointer orange b--orange mb2 mr2 mr0-l"
                                            onClick={() => {
                                                addFilter({
                                                    checkin_from: moment().add(1, 'd').format('YYYY-MM-DD'),
                                                    checkin_to: moment().add(1, 'd').format('YYYY-MM-DD')
                                                })
                                            }}>Tomorrow's Checkins
                                        </button>
                                    </div>
                            }
                        </div>
                    }
                </div>
            </div>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        bookings: state.bookings
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        addFilter: (filterObject) => {
            dispatch(BookingsActions.addFilter(filterObject))
        },
        removeFilter: (filterKeys) => {
            dispatch(BookingsActions.removeFilter(filterKeys))
        },
        toggleShowForm: () => {
            dispatch({type: types.BOOKINGS_TOGGLE_ADD_FORM})
        }
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
