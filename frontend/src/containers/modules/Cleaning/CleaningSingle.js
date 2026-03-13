import React, {Component} from 'react';
import {connect} from 'react-redux';
import {find, get, replace} from 'lodash';
import {ScaleLoader} from "halogenium";
import CleaningsActions from "../../../actions/cleaningsActions";
import moment from 'moment';
import {Link} from "react-router-dom";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import suppliesActions from "../../../actions/suppliesActions";

class CleaningSingle extends Component {
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
        this.state = {};
        this.itemSelected = this.itemSelected.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.supplyStatusMap = {
            not_fulfilled: 'Requested',
            staged: 'Staged',
            delivered: 'Delivered'
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.props.getSingleCleaning(id);
        if (get(this.props, 'supplies.dropdown', []).length === 0) {
            this.props.getSupplyList();
        }
    }

    itemSelected(selectedOption) {
        this.setState({supply_id: get(selectedOption, 'value')});
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
        const id = this.props.match.params.id;
        const cleaning = get(this.props, 'cleanings.details.' + id)
            || find(this.props.cleanings.all, o => parseInt(o.id, 10) === parseInt(id, 10));
        const auth_user = this.props.auth.auth_user;

        return (
            <div>
                {cleaning ?
                    <div className="cf w-100 pv3 black-60">
                        <div className="cf w-100 pb3">
                            <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>
                                Cleaning Entry# {id} {get(cleaning, 'tf_status') ?
                                <span className="red b">TF</span> :
                                <span className="green b">O</span>}
                            </h2>
                        </div>
                        <div className="fl w-100 w-50-l">
                            <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l mb3">
                                <div className="fl w-40">
                                    <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Location Info <Link
                                        to={/locations/ + get(cleaning, 'location.id')}><span
                                        className="fa f4 black-50 fa-external-link"/></Link></h2>
                                    <div className='fl w5 bb bw1 b--black-10 ml2'/>
                                </div>
                                <div className="fl w-100 pa2 pt3">
                                    <div className={'fl w-100 pv2 b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Address</span></div>
                                        <div className={'fl w-70'}><span>{get(cleaning, 'location.address')}</span>
                                        </div>
                                    </div>
                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Building Name</span></div>
                                        <div className={'fl w-70'}>
                                            <span>{get(cleaning, 'location.building_name')}</span></div>
                                    </div>
                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Room Number</span></div>
                                        <div className={'fl w-70'}><span>{get(cleaning, 'location.room_number')}</span>
                                        </div>
                                    </div>
                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Entry Info</span></div>
                                        <div className={'fl w-70'}><span>{get(cleaning, 'location.entry_info')}</span>
                                        </div>
                                    </div>
                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Mail Rules</span></div>
                                        <div className={'fl w-70'}><span>{get(cleaning, 'location.mail_rules')}</span>
                                        </div>
                                    </div>
                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Trash Rules</span></div>
                                        <div className={'fl w-70'}><span>{get(cleaning, 'location.trash_rules')}</span>
                                        </div>
                                    </div>
                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Direction</span>
                                        </div>
                                        <div className={'fl w-70'}>
                                            <a className="hover-blue light-blue pointer link"
                                               target='_blank'
                                               href={get(cleaning, 'location.map_link')}>Map
                                                Link</a> - <a className="hover-blue light-blue pointer link"
                                                              target='_blank'
                                                              href={get(cleaning, 'location.guest_photo_directions_link')}>Photo
                                            Directions</a></div>
                                    </div>
                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Owner</span>
                                        </div>
                                        <div className={'fl w-70'}>
                                            <div>{get(cleaning, 'location.owner.name')}</div>
                                            <div className="f6 black-40">{get(cleaning, 'location.owner.email')}</div>
                                            <div className="f6 black-40">{get(cleaning, 'location.owner.phone')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l mb3">
                                <div className="fl w-100">
                                    <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Supplies</h2>
                                    <div className='fl w5 bb bw1 b--black-10 ml2'/>
                                </div>
                                {get(cleaning, 'supplies', []).length ?
                                    <div className="fl w-100 mv3 pa2">
                                        <div className={'fl w-100 pv2'}>
                                            <div className={'fl w-40 pr4 f5 b'}>Item</div>
                                            <div className={'fl w-20 f5 b'}>Amount</div>
                                            <div className={'fl w-20 f5 b'}>Status</div>
                                            <div className={'fl w-20 f5 b tc'}>Action</div>
                                        </div>
                                        {get(cleaning, 'supplies', []).map((supply, i) => (
                                            <div className={'fl w-100 pv2 b--black-10 bt'}>
                                                <div className={'fl w-40 pr4'}>{get(supply, 'supply.name')}</div>
                                                <div className={'fl w-20'}>{get(supply, 'amount')}</div>
                                                <div
                                                    className={'fl w-20 f7 ' + (get(supply, 'status') === 'delivered' ? 'green' : get(supply, 'status') === 'staged' ? 'dark-blue' : '')}>
                                                    {get(this.supplyStatusMap, get(supply, 'status'))}
                                                </div>
                                                <div className={'fl w-20'}>
                                                    {get(supply, 'status') === 'not_fulfilled' ?
                                                        get(auth_user, 'type') === 'administrator' || get(auth_user, 'type') === 'supervisor' ?
                                                            <button
                                                                className="pointer pa1 f6 input-reset br2 white bg-dark-blue bw0 w-100 dis-bg-black-20 dis-white-70"
                                                                onClick={() => {
                                                                    this.props.fulfill(supply);
                                                                }}>Mark Fulfilled
                                                            </button> :
                                                            <span className="f7 black-40">Pending Admin Action</span>
                                                        :
                                                        get(supply, 'status') === 'staged' ?
                                                            <button
                                                                className="pointer pa1 f6 input-reset br2 white bg-dark-green bw0 w-100 dis-bg-black-20 dis-white-70"
                                                                onClick={() => {
                                                                    this.props.deliver(supply);
                                                                }}>Mark Delivered
                                                            </button> : null

                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div> : null}
                                <div>
                                    <div className="fl w-100 w-60-l pa2 pt3">
                                        <Select name={'supply'} options={get(this.props, 'supplies.dropdown')}
                                                value={get(this.state, 'supply_id')}
                                                placeholder="Select Item..."
                                                openOnFocus
                                                onChange={this.itemSelected}/>
                                    </div>
                                    <div className="fl w-50 w-20-l pa2 pt3">
                                        <input type="number" placeholder="Amount"
                                               className="pa2 f4 input-reset br2 black-60 ba b--black-20 bg-transparent w-100"
                                               value={get(this.state, 'amount')}
                                               name='amount'
                                               onChange={this.handleInput}/>
                                    </div>
                                    <div className="fl w-50 w-20-l pa2 pt3">
                                        <button
                                            disabled={!(get(this.state, 'amount') && get(this.state, 'supply_id'))}
                                            className="pointer pa2 f4 input-reset br2 white bg-dark-green bw0 w-100 dis-bg-black-20 dis-white-70"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.props.requestSupply({
                                                    cleaning_id: id,
                                                    supply_id: this.state.supply_id,
                                                    amount: this.state.amount
                                                });
                                                this.setState({amount: '', supply_id: ''});
                                            }}>Request
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pl3-l pt3 pt0-l fl w-100 w-50-l">
                            <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l mb3">
                                <div className="fl w-40">
                                    <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Cleaning Info</h2>
                                    <div className='fl w5 bb bw1 b--black-10 ml2'/>
                                </div>
                                <div className="fl w-100 pa2 pt3">
                                    <div className={'fl w-100 pv2 b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Cleaning Date</span></div>
                                        <div className={'fl w-70'}>
                                            <div> {moment(get(cleaning, 'cleaning_date')).calendar(null, this.calendarFormat)} </div>
                                            <div
                                                className='f7 black-40 pv1'> {moment(get(cleaning, 'cleaning_date')).fromNow()} </div>
                                        </div>
                                    </div>
                                    <div className={'fl w-100 pv2 b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Cleaner</span></div>
                                        <div className={'fl w-70'}>
                                            <div>{get(cleaning, 'cleaner.name')}</div>
                                            <div className="f6 black-40">{get(cleaning, 'cleaner.email')}</div>
                                            <div className="f6 black-40">{get(cleaning, 'cleaner.phone')}</div>
                                        </div>
                                    </div>
                                    <div className={'fl w-100 pv2 b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Time</span></div>
                                        <div className={'fl w-70'}><span>{get(cleaning, 'start_time')}
                                            - {get(cleaning, 'end_time')}</span></div>
                                    </div>
                                    <div className={'fl w-100 pv2 b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Status</span></div>
                                        <div className={'fl w-70 ttc'}>
                                            <span>{replace(get(cleaning, 'status'), '_', ' ')}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="pl3-l pt3 pt0-l fl w-100 w-50-l">
                            <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l mb3">
                                <div className="fl w-40">
                                    <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Next Booking Info <Link
                                        to={/bookings/ + get(cleaning, 'next_booking.id')}><span
                                        className="fa f4 black-50 fa-external-link"/></Link></h2>
                                    <div className='fl w5 bb bw1 b--black-10 ml2'/>
                                </div>
                                <div className="fl w-100 pa2 pt3">
                                    <div className={'fl w-100 pv2 b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Checkin Date</span></div>
                                        <div className={'fl w-70'}>

                                            <span> {moment(get(cleaning, 'next_booking.checkin')).utcOffset('+09:00').calendar(null, this.calendarFormat)} </span>
                                        </div>
                                    </div>
                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Checkout Date</span></div>
                                        <div className={'fl w-70'}>
                                            <span> {moment(get(cleaning, 'next_booking.checkout')).utcOffset('+09:00').calendar(null, this.calendarFormat)} </span>
                                        </div>
                                    </div>
                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Stay Duration</span></div>
                                        <div className={'fl w-70'}>
                                            <div> {moment(get(cleaning, 'next_booking.checkout')).diff(get(cleaning, 'next_booking.checkin'), 'days') + ' days'} </div>
                                        </div>
                                    </div>

                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Checkin Time</span>
                                        </div>
                                        <div className={'fl w-70'}>
                                            <span> {get(cleaning, 'next_booking.planned_checkin_time')} </span>
                                        </div>
                                    </div>

                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}> Checkout Time</span>
                                        </div>
                                        <div className={'fl w-70'}>
                                            <span> {get(cleaning, 'next_booking.planned_checkout_time')} </span>
                                        </div>
                                    </div>
                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Guests</span>
                                        </div>
                                        <div className={'fl w-70'}>
                                            <span> {get(cleaning, 'next_booking.guests') > 0 ? get(cleaning, 'next_booking.guests') : null} </span>
                                        </div>
                                    </div>

                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Beds</span>
                                        </div>
                                        <div className={'fl w-70'}>
                                            <span> {get(cleaning, 'next_booking.beds') > 0 ? get(cleaning, 'next_booking.beds') : null} </span>
                                        </div>
                                    </div>

                                    <div className={'fl w-100 pv2 bt b--black-10'}>
                                        <div className={'fl w-30 pr4'}><span className={'b'}>Status</span></div>
                                        <div className={'fl w-70 ttc'}>
                                            <span>{replace(get(cleaning, 'next_booking.status'), '_', ' ')}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {get(cleaning, 'location.photos', []).length ?
                            <div className="fl w-100">
                                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l mb3">
                                    <div className="fl w-100 tc">
                                        <h2 className='fl fw2 mv2 mb3 black-90 fl w-100 pl2'>Photos</h2>
                                    </div>
                                    {get(cleaning, 'location.photos', []).map((photo) => (
                                        <div key={photo.id} className="w5 h5 overflow-hidden fl pa2 flex relative">
                                            <a href={photo.full_path}>
                                                <img className="db" src={photo.thumb_path} alt={photo.name}/>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div> : null}

                        {/*<div className="fl w-100">*/}
                        {/*<pre>*/}
                        {/*{JSON.stringify(cleaning, null, 2)}*/}
                        {/*</pre>*/}
                        {/*</div>*/}
                    </div> : null}
                {this.props.cleanings.loading_single ?
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
        cleanings: state.cleanings,
        supplies: state.supplies,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getSingleCleaning: (id) => {
            dispatch(CleaningsActions.getSingleCleaning(id));
        },
        getSupplyList: () => {
            dispatch(suppliesActions.getList());
        },
        requestSupply: (payload) => {
            dispatch(suppliesActions.requestSupply(payload));
        },
        fulfill: (supply) => {
            dispatch(suppliesActions.fulfillSupplyRequest(supply));
        },
        deliver: (supply) => {
            dispatch(suppliesActions.deliverSupplyRequest(supply));
        }
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(CleaningSingle);
