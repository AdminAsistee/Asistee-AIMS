import React, {Component} from 'react'
import {connect} from 'react-redux';
import moment from 'moment';
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
        const {srizons} = this.props;
        return (
            <div className="w-100 pt3 dt">
                <div className="dt-row">
                    <div className="fw5 underline dtc ph2 pv3 v-top">ID</div>
                </div>
                {get(srizons, 'all', []).map((item, i) => (
                    <div className="dt-row striped--near-white w-40-l" key={i}>
                        <div className="dtc-ns dn pa2 v-top">
                            <div>{get(item, 'id')}</div>
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
        srizons: state.srizons,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {}
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(Table);
