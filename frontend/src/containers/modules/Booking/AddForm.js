import React, {Component} from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import BlockUi from "react-block-ui";
import {get} from 'lodash/object';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import './addform.css';
import moment from 'moment';
import types from "../../../actions/types";
import BookingsActions from "../../../actions/bookingsActions";

class AddForm extends Component {
    constructor() {
        super();
        this.state = {
            listing_id: null,
        };

        this.handleInput = this.handleInput.bind(this);
        this.shouldDisable = this.shouldDisable.bind(this);
        this.listingSelected = this.listingSelected.bind(this);
        this.checkingDateSelected = this.checkingDateSelected.bind(this);
        this.checkoutDateSelected = this.checkoutDateSelected.bind(this);
    }

    handleInput(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    listingSelected(selectedOption) {
        this.setState({
            listing_id: get(selectedOption, 'value')
        });
    }

    checkingDateSelected(day) {
        this.setState({
            checkin: moment(day).format('YYYY-MM-DD')
        });
    }

    checkoutDateSelected(day) {
        this.setState({
            checkout: moment(day).format('YYYY-MM-DD')
        });
    }

    shouldDisable() {
        return (!(this.state.listing_id && this.state.checkin && this.state.checkout && this.state.guests))
    }

    componentDidMount() {
        this.props.getListings();
    }


    render() {
        const {bookings, addBooking} = this.props;

        const listingOptions = get(bookings, 'all_listings', []).map(listing => ({
            value: listing.id,
            label: listing.listing_title,
        }));

        return (
            <div className="pl0 pl3-l pt3 pt0-l fl w-100 w-80-l black-60">
                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l">
                    <div className="cf">
                        <div className="w-100">
                            <BlockUi tag='div' blocking={bookings.adding_booking}>
                                <form className='add-user-form bg-white mt3 pa2'>
                                    <div className='fl w-100 w-50-l'>
                                        <div className="pb3 fl w-100 pr2-l">
                                            <Select name='type' options={listingOptions} onChange={this.listingSelected}
                                                    value={this.state.listing_id} placeholder='Select Listing'/>
                                        </div>
                                        <div className="pb3 fl w-100 pr2-l">
                                            <div className="fl w-50 pr2 border-box">
                                                <input type="number" name='guests' placeholder='Guests'
                                                       className="w-100 br2 ba bw1p b--black-30 pa2 border-box"
                                                       onChange={this.handleInput}/>
                                            </div>
                                            <div className="fl w-50 pl2 border-box">
                                                <input type="number" name='beds' placeholder='Beds'
                                                       className="w-100 br2 ba bw1p b--black-30 pa2 border-box"
                                                       onChange={this.handleInput}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='fl w-100 w-50-l'>
                                        <div className="pb3 fl w-100 picker-wrap pl2-l">
                                            <DayPickerInput onDayChange={this.checkingDateSelected}
                                                            placeholder='Checkin'
                                                            value={this.state.checkin ? moment(this.state.checkin).utcOffset('+09:00').format('YYYY-MM-DD') : null}
                                                            dayPickerProps={{
                                                                selectedDays: moment(moment(this.state.checkin).utcOffset('+09:00').format('YYYY-MM-DD')).toDate(),
                                                                month: moment(this.state.checkin).toDate(),
                                                            }}/>
                                        </div>

                                        <div className="pb3 fl w-100 picker-wrap pl2-l">
                                            <DayPickerInput onDayChange={this.checkoutDateSelected}
                                                            placeholder='Checkout'
                                                            value={this.state.checkout ? moment(this.state.checkout).utcOffset('+09:00').format('YYYY-MM-DD') : null}
                                                            dayPickerProps={{
                                                                selectedDays: moment(moment(this.state.checkout).utcOffset('+09:00').format('YYYY-MM-DD')).toDate(),
                                                                month: moment(this.state.checkout).toDate(),
                                                            }}/>
                                        </div>
                                    </div>

                                    <button
                                        className="pointer pa3 input-reset br2 white bg-dark-green bw0 w-100 dis-bg-black-20 dis-white-70"
                                        disabled={this.shouldDisable()}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addBooking(this.state)
                                        }}>Add Booking
                                    </button>
                                </form>
                            </BlockUi>
                        </div>
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
        bookings: state.bookings,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getListings: () => {
            dispatch(BookingsActions.getListings(500))
        },
        addBooking: (data) => {
            dispatch(BookingsActions.addNew(data));
            dispatch({type: types.BOOKINGS_TOGGLE_ADD_FORM});
        },
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(AddForm);
