import React, {Component} from 'react'
import {connect} from 'react-redux';
import {get} from 'lodash';
import RowActions from "./RowActions";


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
        const {supplies} = this.props;
        return (
            <div className="w-100 pt3 dt">
                <div className="dt-row">
                    <div className="fw5 underline dtc ph2 pv3 v-top">Name</div>
                    <div className="fw5 underline dtc ph2 pv3 v-top">Stock</div>
                    <div className="fw5 underline dtc ph2 pv3 v-top tr w5">Action</div>
                </div>
                {get(supplies, 'all', []).map((item, i) => (
                    <div className="dt-row striped--near-white w-40-l" key={i}>
                        <div className="dtc pa2 v-top">
                            <div>{get(item, 'name')}</div>
                        </div>
                        <div className="dtc pa2 v-top">
                            <div>Ready: {get(item, 'ready_stock')}</div>
                            <div>In Use: {get(item, 'in_use_stock')}</div>
                            <div>In Maintenance: {get(item, 'in_maintenance_stock')}</div>
                        </div>
                        <div className="dtc pa2 v-top tr">
                            <RowActions rowId={item.id}/>
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
        supplies: state.supplies,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {}
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(Table);
