import React, {Component} from 'react';
import {connect} from 'react-redux';
import {find, get} from 'lodash';
import {ScaleLoader} from "halogenium";
import moment from 'moment';

// import SrizonsActions from "../../../actions/srizonsActions";

class SrizonSingle extends Component {
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
        this.props.getSingleSrizon(id);
    }

    saveField(key, value) {
        // console.log(key,value);
        this.props.updateField(this.props.match.params.id, {[key]: value})
    }

    render() {
        const id = this.props.match.params.id;
        const srizon = get(this.props, 'srizons.details.' + id)
            || find(get(this.props, 'srizons.all'), o => o.id == id);

        return (
            <div>

                <div className="cf w-100 pv3 black-60">
                    <div className="cf w-100 pb3">
                        <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Srizon Entry # {id}</h2>
                    </div>
                    <div className="fl w-100 w-50-l">
                        <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l mb3">
                            <div className="fl w-40">
                                <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Srizon Info</h2>
                                <div className='fl w5 bb bw1 b--black-10 ml2'/>
                            </div>
                            <div className="fl w-100 pa2 pt3">
                                <div className={'fl w-100 pv2 b--black-10'}>
                                    <div className={'fl w-30 pr4'}><span className={'b'}>Creation At</span></div>
                                    <div className={'fl w-70'}>
                                        <span> {moment(get(srizon, 'created_at')).utcOffset('+09:00').calendar(null, this.calendarFormat)} </span>
                                    </div>
                                </div>
                                <div className={'fl w-100 pv2 b--black-10'}>
                                    <div className={'fl w-30 pr4'}><span className={'b'}>Updated At</span></div>
                                    <div className={'fl w-70'}>
                                        <span> {moment(get(srizon, 'updated_at')).utcOffset('+09:00').calendar(null, this.calendarFormat)} </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="fl w-100 w-50-l pl3-l pt3 pt0-l">
                        <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l mb3">
                            <div className="fl w-40">
                                <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Other Info</h2>
                                <div className='fl w5 bb bw1 b--black-10 ml2'/>
                            </div>
                        </div>
                    </div>
                    {/*<div className="fl w-100">*/}
                    {/*<pre>*/}
                    {/*{JSON.stringify(srizon, null, 2)}*/}
                    {/*</pre>*/}
                    {/*</div>*/}

                </div>
                {get(this.props, 'srizons.loading_single') ?
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
        srizons: state.srizons
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getSingleSrizon: (id) => {
            // dispatch(SrizonsActions.getSingle(id));
        },
        updateField: (id, payload) => {
            // dispatch(SrizonsActions.updateField(id, payload));
        }
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(SrizonSingle);
