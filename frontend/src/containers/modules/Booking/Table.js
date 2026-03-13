import React, {Component} from 'react'
import {connect} from 'react-redux';
import moment from 'moment';
import {get} from 'lodash';
import {Link} from 'react-router-dom';


class BookingsTable extends Component {
    constructor() {
        super();
        this.calendarFormat = {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'YYYY/MM/DD'
        };
    }

    render() {
        const {bookings} = this.props;
        return (
            <div className="w-100 pt3 dt">
                <div className="dt-row">
                    <div className="fw5 underline dtc ph2 pv3 v-top">Checking - Checkout</div>
                    <div className="fw5 underline dtc-ns dn ph2 pv3 v-top ">Listing/Location Info</div>
                    <div className="fw5 underline dtc-ns dn ph2 pv3 v-top ">Other Info</div>
                </div>
                {bookings.map((booking, i) => (
                    <div className="dt-row striped--near-white w-40-l" key={i}>
                        <div className="dtc pa2 v-top">
                            <div className="f5 black-60">
                                {moment(booking.checkin).utcOffset('+09:00').format('ddd, DD MMM')}
                            </div>
                            <div className="f6 black-40">
                                {moment(booking.checkout).diff(booking.checkin, 'days') + ' days stay'}
                            </div>
                            <div className="f6 black-40">
                                Checkout on {moment(booking.checkout).utcOffset('+09:00').format('ddd, DD MMM')}
                            </div>
                            <div className='f6 black-40 pv1'>
                                <Link to={'/bookings/' + booking.id}
                                      className="dib bg-transparent ph2 pv1 mr2 pointer ba hover-dark-blue link br1 b--light-blue input-reset blue">
                                    Details
                                </Link>
                            </div>
                        </div>
                        <div className="dtc-ns dn pa2 v-top">
                            <div>Listing:</div>
                            <div className="black-40">{get(booking, 'listing.listing_title')}</div>
                            <div>Locations:</div>
                            {get(booking, 'listing.locations', []).map((location, j) => (
                                <div className="f6 black-40"
                                     key={j}>{location.address + ', Building:' + location.building_name + ', Room:' + location.room_number}</div>
                            ))}
                        </div>
                        <div className="dtc-ns dn pa2 v-top">
                            <div>{booking.beds} Guests</div>
                            <div>{booking.guests} Beds</div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

// map state
function mapStateToProps(state) {
    return {
        authState: state.authState,
        auth: state.auth,
        bookings: state.bookings.all,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {}
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(BookingsTable);
