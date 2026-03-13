import React, {Component} from 'react';
import {connect} from 'react-redux';
import {find, get, replace} from 'lodash';
import {ScaleLoader} from "halogenium";
import moment from 'moment';
import BookingsActions from "../../../actions/bookingsActions";
import EditableDate from "../../../components/EditableDate";
import EditableTime from "../../../components/EditableTime";
import EditableText from "../../../components/EditableText";
import {Link} from "react-router-dom";

class BookingSingle extends Component {
    constructor() {
        super();
        this.calendarFormat = {
            sameDay: 'YYYY/MM/DD ([Today])',
            nextDay: 'YYYY/MM/DD ([Tomorrow])',
            nextWeek: 'YYYY/MM/DD (dddd)',
            lastDay: 'YYYY/MM/DD ([Yesterday])',
            lastWeek: 'YYYY/MM/DD ([Last] dddd)',
            sameElse: 'YYYY/MM/DD'
        };
        this.saveField = this.saveField.bind(this);
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.props.getSingleBooking(id);
    }

    saveField(key, value) {
        // console.log(key,value);
        this.props.updateField(this.props.match.params.id, {[key]: value})
    }

    render() {
        const id = this.props.match.params.id;
        const booking = get(this.props, 'bookings.details.' + id)
            || find(this.props.bookings.all, o => parseInt(o.id, 10) === parseInt(id, 10));

        return (
            <div>
                {booking ?
                    <div className="cf w-100 pv3 black-60">
                        <div className="cf w-100 pb3">
                            <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Booking Entry # {id}</h2>
                        </div>
                        <div className="fl w-100 w-50-l">
                            <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l mb3">
                                <div className="fl w-40">
                                    <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Booking Info</h2>
                                    <div className='fl w5 bb bw1 b--black-10 ml2'/>
                                </div>
                                <div className="fl w-100 pa2 pt3">
                                    <div className={'fl w-100 pv2 b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Checkin Date</span></div>
                                        <div className={'fl w-70'}>
                                            <EditableDate name='checkin' value={get(booking, 'checkin')}
                                                          onSave={this.saveField}>
                                                <span> {moment(get(booking, 'checkin')).utcOffset('+09:00').calendar(null, this.calendarFormat)} </span>
                                            </EditableDate>
                                        </div>
                                    </div>
                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Checkout Date</span></div>
                                        <div className={'fl w-70'}>
                                            <EditableDate name='checkout' value={get(booking, 'checkout')}
                                                          onSave={this.saveField}>
                                                <span> {moment(get(booking, 'checkout')).utcOffset('+09:00').calendar(null, this.calendarFormat)} </span>
                                            </EditableDate>
                                        </div>
                                    </div>
                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Stay Duration</span></div>
                                        <div className={'fl w-70'}>
                                            <div> {moment(booking.checkout).diff(booking.checkin, 'days') + ' days'} </div>
                                        </div>
                                    </div>

                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Checkin Time</span>
                                        </div>
                                        <div className={'fl w-70'}>
                                            <EditableTime name='planned_checkin_time'
                                                          value={get(booking, 'planned_checkin_time')}
                                                          onSave={this.saveField}>
                                                <span> {booking.planned_checkin_time} </span>
                                            </EditableTime>
                                        </div>
                                    </div>

                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}> Checkout Time</span>
                                        </div>
                                        <div className={'fl w-70'}>
                                            <EditableTime name='planned_checkout_time'
                                                          value={get(booking, 'planned_checkout_time')}
                                                          onSave={this.saveField}>
                                                <span> {booking.planned_checkout_time} </span>
                                            </EditableTime>
                                        </div>
                                    </div>
                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Guests</span>
                                        </div>
                                        <div className={'fl w-70'}>
                                            <EditableText name='guests' value={booking.guests} onSave={this.saveField}>
                                                <span> {booking.guests > 0 ? booking.guests : null} </span>
                                            </EditableText>
                                        </div>
                                    </div>

                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Beds</span>
                                        </div>
                                        <div className={'fl w-70'}>
                                            <EditableText name='beds' value={booking.beds} onSave={this.saveField}>
                                                <span> {booking.beds > 0 ? booking.beds : null} </span>
                                            </EditableText>
                                        </div>
                                    </div>

                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Status</span></div>
                                        <div className={'fl w-70 ttc'}>
                                            <span>{replace(get(booking, 'status'), '_', ' ')}</span>
                                        </div>
                                    </div>

                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Related Listing</span>
                                        </div>
                                        <div className={'fl w-70'}>
                                            <div> {get(booking, 'listing.listing_title')} </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="pl3-l pt3 pt0-l fl w-100 w-50-l">

                            <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l mb3">
                                <div className="fl w-40">
                                    <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Location Info</h2>
                                    <div className='fl w5 bb bw1 b--black-10 ml2'/>
                                </div>
                                {
                                    get(booking, 'listing.locations', []).map((location, i) => (
                                        <div className="fl w-100 pa2 pt3" key={i}>
                                            {i > 0 ? <h3 className='fl fw2 mv2 black-90 fl w-100'>
                                                Location {i + 1}</h3> : null}
                                            <div className={'fl w-100 pv2 b--black-10'}>
                                                <div className={'fl w-30 pr4'}><span className={'b'}>Address</span>
                                                </div>
                                                <div className={'fl w-70'}><span>{get(location, 'address')}</span>
                                                </div>
                                            </div>
                                            <div className={'fl w-100 pv2 b--black-10'}>
                                                <div className={'fl w-30 pr4'}><span className={'b'}>Building</span>
                                                </div>
                                                <div className={'fl w-70'}><span>{get(location, 'building_name')}</span>
                                                </div>
                                            </div>
                                            <div className={'fl w-100 pv2 b--black-10'}>
                                                <div className={'fl w-30 pr4'}><span className={'b'}>Room Number</span>
                                                </div>
                                                <div className={'fl w-70'}><span>{get(location, 'room_number')}</span>
                                                </div>
                                            </div>
                                            <div className={'fl w-100 pv2 b--black-10'}>
                                                <div className={'fl w-30 pr4'}><span className={'b'}>Max Beds</span>
                                                </div>
                                                <div className={'fl w-70'}><span>{get(location, 'max_beds')}</span>
                                                </div>
                                            </div>
                                            <div className={'fl w-100 pv2 b--black-10'}>
                                                <div className={'fl w-30 pr4'}><span className={'b'}>Entry Info</span>
                                                </div>
                                                <div className={'fl w-70'}><span>{get(location, 'entry_info')}</span>
                                                </div>
                                            </div>
                                            <div className={'fl w-100 pv2 b--black-10'}>
                                                <div className={'fl w-30 pr4'}><span className={'b'}>Mail Rules</span>
                                                </div>
                                                <div className={'fl w-70'}><span>{get(location, 'mail_rules')}</span>
                                                </div>
                                            </div>
                                            <div className={'fl w-100 pv2 b--black-10'}>
                                                <div className={'fl w-30 pr4'}><span className={'b'}>Trash Rules</span>
                                                </div>
                                                <div className={'fl w-70'}><span>{get(location, 'trash_rules')}</span>
                                                </div>
                                            </div>
                                            <div className={'fl w-100 pv2 b--black-10'}>
                                                <div className={'fl w-30 pr4'}><span
                                                    className={'b'}>Per Bed Charge</span>
                                                </div>
                                                <div className={'fl w-70'}>
                                                    <span>{get(location, 'per_bed_charge')}</span>
                                                </div>
                                            </div>
                                            <div className={'fl w-100 pv2 b--black-10'}>
                                                <div className={'fl w-30 pr4'}><span
                                                    className={'b'}>Per Guest Charge</span>
                                                </div>
                                                <div className={'fl w-70'}>
                                                    <span>{get(location, 'per_guest_charge')}</span>
                                                </div>
                                            </div>
                                            <div className={'fl w-100 pv2 b--black-10'}>
                                                <div className={'fl w-30 pr4'}><span
                                                    className={'b'}>Split Rate</span>
                                                </div>
                                                <div className={'fl w-70'}>
                                                    <span>{get(location, 'SplitRate')}</span>
                                                </div>
                                            </div>
                                            <div className={'fl w-100 pv2 b--black-10'}>
                                                <div className={'fl w-30 pr4'}><span
                                                    className={'b'}>Location Details</span>
                                                </div>
                                                <div className={'fl w-70'}>
                                                    <Link to={/locations/ + get(location, 'id')}><span
                                                        className="fa f4 black-50 fa-external-link"/></Link>
                                                </div>
                                            </div>
                                            <div className={'fl w-100 pv2 b--black-10'}>
                                                <div className={'fl w-30 pr4'}><span
                                                    className={'b'}>Owner</span>
                                                </div>
                                                <div className={'fl w-70'}>
                                                    <div>{get(location, 'owner.name')}</div>
                                                    <div className="f6 black-40">{get(location, 'owner.email')}</div>
                                                    <div className="f6 black-40">{get(location, 'owner.phone')}</div>
                                                </div>
                                            </div>

                                            <div className={'fl w-100 pv2 b--black-10'}>
                                                <div className='fl w-30 pr4 f5 underline'><span
                                                    className={'b'}>Related Cleaning</span>
                                                </div>
                                                <div className={'fl w-70'}>
                                                    <div className="f6 b">Last/Scheduled Cleaning Date:</div>
                                                    <div
                                                        className="f6 pt2">
                                                        {moment(get(location, 'previous_cleaning.cleaning_date')).utcOffset('+09:00').calendar(null, this.calendarFormat)}
                                                        {get(location, 'tf_status') ?
                                                            <span className="dib pl2 red b">TF</span> :
                                                            <span className="dib pl2 green b">O</span>}
                                                        <Link className="dib pl2"
                                                              to={/cleanings/ + get(location, 'previous_cleaning.id')}><span
                                                            className="fa black-50 fa-external-link"/></Link>
                                                    </div>


                                                </div>
                                            </div>

                                        </div>
                                    ))
                                }

                            </div>
                        </div>
                        {/*<div className="fl w-100">*/}
                        {/*<pre>*/}
                        {/*{JSON.stringify(booking, null, 2)}*/}
                        {/*</pre>*/}
                        {/*</div>*/}

                    </div> : null}
                {this.props.bookings.loading_single ?
                    <div className="fl w-100 pa3 tc">
                        <ScaleLoader color={'#F09169'}/>
                    </div> : null}
            </div>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        auth: state.auth,
        bookings: state.bookings
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getSingleBooking: (id) => {
            dispatch(BookingsActions.getSingleBooking(id));
        },
        updateField: (id, payload) => {
            dispatch(BookingsActions.updateField(id, payload));
        }
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(BookingSingle);
