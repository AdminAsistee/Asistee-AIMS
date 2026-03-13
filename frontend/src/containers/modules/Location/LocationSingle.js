import React, {Component} from 'react';
import {connect} from 'react-redux';
import {find, get, replace} from 'lodash';
import {ScaleLoader} from "halogenium";
import moment from 'moment';

import LocationsActions from "../../../actions/locationsActions";
import {Link} from "react-router-dom";
import Calendar from './Calendar';

class LocationSingle extends Component {
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
        this.state = {
            calendarDate: moment().format('YYYY/MM/DD')
        };
        this.saveField = this.saveField.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.props.getSingleLocation(id);
    }

    saveField(key, value) {
        // console.log(key,value);
        this.props.updateField(this.props.match.params.id, {[key]: value})
    }

    handleFileUpload(event) {
        if (event.target.files.length) {
            const id = this.props.match.params.id;
            this.props.uploadPhoto(event.target.files[0], id);
        }
    }

    render() {
        const id = this.props.match.params.id;
        const location = get(this.props, 'locations.details.' + id)
            || find(get(this.props, 'locations.all'), o => parseInt(o.id, 10) === parseInt(id, 10));

        return (
            <div>
                <div className="cf w-100 pv3 black-60">
                    <div className="cf w-100 pb3">
                        <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Location Entry # {id}</h2>
                    </div>
                    <div className="fl w-100 w-50-l">
                        <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l mb3">
                            <div className="fl w-40">
                                <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Location Info</h2>
                                <div className='fl w5 bb bw1 b--black-10 ml2'/>
                            </div>
                            <div className="fl w-100 pa2 pt3">
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
                                        className={'b'}>Owner</span>
                                    </div>
                                    <div className={'fl w-70'}>
                                        <div>{get(location, 'owner.name')}</div>
                                        <div className="f6 black-40">{get(location, 'owner.email')}</div>
                                        <div className="f6 black-40">{get(location, 'owner.phone')}</div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l mb3">
                            <div className="fl w-100">
                                <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Photos</h2>
                                <div className='fl w5 bb bw1 b--black-10 ml2'/>
                            </div>

                            <div className="w-100 fl pv3">
                                {get(location, 'photos', []).map((photo) => (
                                    <div key={photo.id} className="w4 h4 overflow-hidden fl pa2 flex relative">
                                        <img className="db" src={photo.thumb_path} alt={photo.name}/>
                                        <button className="absolute right-0 pointer bg-transparent bn pr3 button-reset"
                                                onClick={() => {
                                                    this.props.deletePhoto(photo.id);
                                                }}>
                                            <span className="fa fa-close red"/></button>
                                    </div>
                                ))}
                                {get(this.props, 'locations.uploading_photo') ?
                                    <div className="w4 h4 overflow-hidden fl pa2 flex">Uploading...</div> : null}
                            </div>


                            <div className="fl w-100 pa2">
                                <div className="relative overflow-hidden cf">
                                    <label htmlFor="photo"
                                           className="pointer light-blue hover-dark-blue link ph2 pv1 br1 ba dib">
                                        <span className="fa fa-upload f4"/>{' '}<span
                                        className="f5 dib">Upload Photo</span></label>
                                    <input className="absolute z--1 o-0" type="file" name="photo"
                                           id="photo"
                                           onChange={this.handleFileUpload}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fl w-100 w-50-l pl3-l pt3 pt0-l">
                        <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l mb3">
                            <div className="fl w-100">
                                <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Property/Location Calendar</h2>
                                <div className='fl w5 w6-ns bb bw1 b--black-10 ml2'/>
                                <Calendar date={this.state.calendarDate} match={this.props.match} history={this.props.history}/>
                            </div>
                        </div>
                        <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l mb3">
                            <div className="fl w-100">
                                <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Associated Cleanings</h2>
                                <div className='fl w5 bb bw1 b--black-10 ml2'/>
                            </div>
                            <div className="fl w-100 pa2 pt3">
                                <div className="w-100 pt3 dt">
                                    <div className="dt-row">
                                        <div className="fw5 underline dtc ttc ph2 pv3 v-top ">Cleaning Info</div>
                                        <div className="fw5 underline dtc ttc ph2 pv3 v-top">Cleaner / Details</div>
                                    </div>
                                    {get(location, 'cleanings', []).map((cleaning, i) => (
                                        <div className="dt-row striped--near-white w-40-l" key={cleaning.id}>
                                            <div className="dtc ttc pa2 v-top">
                                                <div>
                                                    Date: {moment(cleaning.cleaning_date).calendar(null, this.calendarFormat)} </div>
                                                <div className='f6 black-40 pv1'>Time: {cleaning.start_time}
                                                    - {cleaning.end_time}</div>
                                                <div className='f6 black-40 pv1'>
                                                    Status: {replace(cleaning.status, '_', ' ')}</div>
                                            </div>
                                            <div className="dtc ttc pa2 v-top">
                                                <div>{get(cleaning, 'cleaner.name')}</div>
                                                <div className='f6 black-40 pt1'>{get(cleaning, 'cleaner.phone')}</div>
                                                <div className='f6 black-40 pv1'>{get(cleaning, 'cleaner.email')}</div>
                                                <div className='f6 black-40 pv1'>
                                                    <Link to={'/cleanings/' + cleaning.id}
                                                          className="dib bg-transparent ph2 pv1 mr2 pointer ba hover-dark-blue link br1 b--light-blue input-reset blue">
                                                        Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                        <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l mb3">
                            <div className="fl w-60">
                                <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Associated Listings/Bookings</h2>
                                <div className='fl w5 w6-ns bb bw1 b--black-10 ml2'/>
                            </div>
                            <div className="fl w-100 pa2 pt3">
                                {
                                    get(location, 'listings', []).map((listing) => (
                                        <div key={listing.id}>
                                            <div className={'f4 b fl w-100 pv2 b--black-10'}>
                                                Listing #{get(listing, 'id')} : {get(listing, 'listing_title')}
                                            </div>
                                            <div className="w-100 pt3 dt">
                                                <div className="dt-row">
                                                    <div className="fw5 underline dtc ph2 pv3 v-top">Checking - Checkout
                                                    </div>
                                                    <div className="fw5 underline dtc-ns dn ph2 pv3 v-top ">Other Info
                                                    </div>
                                                </div>
                                                {get(listing, 'bookings', []).map((booking) => (
                                                    <div className="dt-row striped--near-white w-40-l" key={booking.id}>
                                                        <div className="dtc pa2 v-top">
                                                            <div className="f5 black-60">
                                                                {moment(booking.checkin).utcOffset('+09:00').format('ddd, DD MMM')}
                                                            </div>
                                                            <div className="f6 black-40">
                                                                {moment(booking.checkout).diff(booking.checkin, 'days') + ' days stay'}
                                                            </div>
                                                            <div className="f6 black-40">
                                                                Checkout
                                                                on {moment(booking.checkout).utcOffset('+09:00').format('ddd, DD MMM')}
                                                            </div>

                                                        </div>
                                                        <div className="dtc-ns dn pa2 v-top">
                                                            <div>{booking.guests} Guests - {booking.beds} Beds</div>
                                                            <div className='f6 black-40 pv1'>
                                                                <Link to={'/bookings/' + booking.id}
                                                                      className="dib bg-transparent ph2 pv1 mr2 pointer ba hover-dark-blue link br1 b--light-blue input-reset blue">
                                                                    Details
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    {/*<div className="fl w-100">*/}
                    {/*<pre>*/}
                    {/*{JSON.stringify(location, null, 2)}*/}
                    {/*</pre>*/}
                    {/*</div>*/}

                </div>
                {get(this.props, 'locations.loading_single') ?
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
        locations: state.locations
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getSingleLocation: (id) => {
            dispatch(LocationsActions.getSingle(id));
        },
        updateField: (id, payload) => {
            dispatch(LocationsActions.updateField(id, payload));
        },
        uploadPhoto: (file, id) => {
            dispatch(LocationsActions.uploadPhoto(file, id));
        },
        deletePhoto: (id) => {
            dispatch(LocationsActions.deletePhoto(id));
        }
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(LocationSingle);
