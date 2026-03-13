import React, {Component} from 'react'
import {connect} from 'react-redux';
import moment from 'moment';
import CleanerEntry from './CleanerEntry';
import {Link} from 'react-router-dom';
import {get} from 'lodash';

class CleaningsTable extends Component {
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
    }

    render() {
        const {cleanings} = this.props;
        return (
            <div className="w-100 pt3 dt">
                <div className="dt-row">
                    <div className="fw5 underline dtc ph2 pv3 v-top">Cleaning Location</div>
                    <div className="fw5 underline dtc ttc ph2 pv3 v-top">Cleaner<span className="dn-l"> / Info</span>
                    </div>
                    <div className="fw5 underline dtc-l dn ttc ph2 pv3 v-top ">Info</div>
                </div>
                {cleanings.map((cleaning, i) => (
                    <div className="dt-row striped--near-white" key={i}>
                        <div className="dtc pa2 v-top">
                            <div className="fl w-10 w-10-m w2-l">
                                <div>
                                    <a className='f3 f2-ns hover-blue light-blue pointer link fa fa-map-marker'
                                       target='_blank'
                                       href={'https://www.google.com/maps/place/' + cleaning.location.latitude + ',' + cleaning.location.longitude + ''}>
                                        <span className="sr-only">Map</span>
                                    </a>
                                </div>
                                {get(cleaning, 'tf_status') ?
                                    <div className="red pt2 b f5">
                                        TF
                                    </div> :
                                    <div className="green pt2 pl1-l b f5">
                                        O
                                    </div>}
                            </div>
                            <div className="fl w-90">
                                <div> {(cleaning.location.building_name || 'building name not provided') + ' ' + (cleaning.location.room_number || 'room number not provided')} </div>
                                <div className='f6 black-40 pv1'> {cleaning.location.address} </div>
                                <div className='f6 black-40 pv1'>
                                    <Link to={'/cleanings/' + cleaning.id}
                                          className="dib bg-transparent ph2 pv1 mr2 pointer ba hover-dark-blue link br1 b--light-blue input-reset blue">
                                        Details
                                    </Link>
                                    <div className="dib mv2 mv1-l">
                                        <a className="hover-blue light-blue pointer link"
                                           target='_blank'
                                           href={cleaning.location.map_link}>Map
                                            Link</a> - <a className="hover-blue light-blue pointer link" target='_blank'
                                                          href={cleaning.location.guest_photo_directions_link}>Photo
                                        Directions</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dtc ttc pa2 v-top">
                            <CleanerEntry cleaning={cleaning}/>
                            <div className="db dn-l mt2">
                                <div className="f6 b">Cleaning Date:</div>
                                <div
                                    className="f6">{moment(get(cleaning, 'cleaning_date')).utcOffset('+09:00').calendar(null, this.calendarFormat)}</div>
                            </div>
                            <div className="db dn-l">
                                <div className="f7">Next Checkin:</div>
                                {get(cleaning, 'next_booking.checkin') ?
                                    <div
                                        className="f7 black-50">{moment(get(cleaning, 'next_booking.checkin')).utcOffset('+09:00').calendar(null, this.calendarFormat)}</div>
                                    :
                                    <div className="f7 black-50">No booking yet</div>}
                            </div>
                            {get(cleaning, 'next_booking.checkin') ?
                                <div className="db dn-l">
                                    <div className="f7">Checkout:</div>
                                    <div
                                        className="f7 black-50">{moment(get(cleaning, 'next_booking.checkout')).utcOffset('+09:00').calendar(null, this.calendarFormat)}</div>
                                </div> : null}
                            {get(cleaning, 'next_booking.checkin') ?
                                <div className="db dn-l">
                                    <div className="f7 black-70">
                                        {get(cleaning, 'next_booking.guests') + 'g/' + get(cleaning, 'next_booking.beds') + 'b, '}
                                        {moment(get(cleaning, 'next_booking.checkout')).diff(get(cleaning, 'next_booking.checkin'), 'days') + ' nights stay'}
                                    </div>
                                </div> : null}
                        </div>
                        <div className="dtc-l dn ttc pa2 v-top">
                            <div>
                                <div className="f6 b">Cleaning Date:</div>
                                <div
                                    className="f6">{moment(get(cleaning, 'cleaning_date')).utcOffset('+09:00').calendar(null, this.calendarFormat)}</div>
                            </div>
                            <div>
                                <div className="f7">Next Checkin:</div>
                                {get(cleaning, 'next_booking.checkin') ?
                                    <div
                                        className="f7 black-50">{moment(get(cleaning, 'next_booking.checkin')).utcOffset('+09:00').calendar(null, this.calendarFormat)}</div>
                                    :
                                    <div className="f7 black-50">No booking yet</div>}

                            </div>
                            {get(cleaning, 'next_booking.checkin') ?
                                <div>
                                    <div className="f7">Checkout:</div>
                                    <div
                                        className="f7 black-50">{moment(get(cleaning, 'next_booking.checkout')).utcOffset('+09:00').calendar(null, this.calendarFormat)}</div>
                                </div> : null}
                            {get(cleaning, 'next_booking.checkin') ?
                                <div>
                                    <div className="f7 black-70">
                                        {get(cleaning, 'next_booking.guests') + 'g/' + get(cleaning, 'next_booking.beds') + 'b, '}
                                        {moment(get(cleaning, 'next_booking.checkout')).diff(get(cleaning, 'next_booking.checkin'), 'days') + ' nights stay'}
                                    </div>
                                </div> : null}
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
        cleanings: state.cleanings.all,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {}
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(CleaningsTable);
