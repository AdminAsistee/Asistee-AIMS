import React, {Component} from 'react'
import {connect} from 'react-redux';
import {get} from 'lodash';
import {Link} from 'react-router-dom';


class Table extends Component {
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
        const {locations} = this.props;
        return (
            <div className="w-100 pt3 dt">
                <div className="dt-row">
                    <div className="fw5 underline dtc ph2 pv3 v-top">Address</div>
                    <div className="fw5 underline dtc ph2 pv3 v-top">Owner</div>
                    <div className="fw5 underline dtc ph2 pv3 v-top">Other Info</div>
                </div>
                {get(locations, 'all', []).map((item, i) => (
                    <div className="dt-row striped--near-white w-40-l" key={i}>
                        <div className="dtc pa2 v-top">
                            <div className="fl w-10 w-10-m w2-l">
                                <a className='f3 f2-ns hover-blue light-blue pointer link fa fa-map-marker'
                                   target='_blank'
                                   href={'https://www.google.com/maps/place/' + item.latitude + ',' + item.longitude + ''}>
                                    <span className="sr-only">Map</span>
                                </a>
                            </div>
                            <div className="fl w-90">
                                <div>
                                    Building: {(item.building_name || 'building name not provided') + ', Room: ' + (item.room_number || 'room number not provided')} </div>
                                <div className='f6 black-40 pv1'> {item.address} </div>
                                <div className='f6 black-40 pv1'>
                                    <Link to={'/locations/' + item.id}
                                          className="dib bg-transparent ph2 pv1 mr2 pointer ba hover-dark-blue link br1 b--light-blue input-reset blue">
                                        Details
                                    </Link>
                                    <div className="dib mv2 mv1-l">
                                        <a className="hover-blue light-blue pointer link"
                                           target='_blank'
                                           href={item.map_link}>Map
                                            Link</a> - <a className="hover-blue light-blue pointer link" target='_blank'
                                                          href={item.guest_photo_directions_link}>Photo
                                        Directions</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dtc pa2 v-top">
                            <div>{get(item, 'owner.name')}</div>
                            <div className='f6 black-40 pt1'>{get(item, 'owner.phone')}</div>
                            <div className='f6 black-40 pv1'>{get(item, 'owner.email')}</div>
                        </div>
                        <div className="dtc pa2 v-top">
                            <div className='f6 black-40 pt1'>Max Beds: {get(item, 'max_beds')}</div>
                            <div className='f6 black-40 pt1'>Per Bed Charge: {get(item, 'per_bed_charge')}</div>
                            <div className='f6 black-40 pt1'>Per Guest Charge: {get(item, 'per_guest_charge')}</div>
                            <div className='f6 black-40 pt1'>Cleaning Payout
                                (default): {get(item, 'default_staff_cleaning_payout')}</div>
                            <div className='f6 black-40 pt1'>Client Charge
                                (default): {get(item, 'default_client_charge')}</div>
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
        locations: state.locations,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {}
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(Table);
