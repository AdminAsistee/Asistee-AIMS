import React, {Component} from 'react';
import {connect} from 'react-redux';
import {get} from 'lodash';
import SuppliesActions from "../../../actions/suppliesActions";
import TableReloader from "../../../components/TableReloader";
import LoaderCenter from "../../../components/LoaderCenter";
import Table from "./Table";

// import Table from "./Table";

class TableWrapper extends Component {
    render() {
        const {supplies, getList} = this.props;
        return (
            <div className="pl0 pl3-l pt3 pt0-l fl w-100 w-80-l black-60">
                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l">
                    <div className="cf">
                        <div className="fl w-40">
                            <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Supplies {get(supplies, 'loaded') ?
                                <small>
                                    ({get(supplies, 'all.length') + '/' + get(supplies, 'page.total')})</small> : null}</h2>
                            <div className='fl w5 bb bw1 b--black-10 ml2'/>
                        </div>
                        {get(supplies, 'loaded') ?
                            <TableReloader loading={get(supplies, 'loading')}
                                           last_loaded_on={get(supplies, 'last_loaded_on')}
                                           getList={getList}/> : null}
                    </div>

                    {get(supplies, 'loading') ?
                        <LoaderCenter/> :
                        <Table/>
                    }
                </div>
            </div>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        auth: state.auth,
        supplies: state.supplies
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getList: () => {
            dispatch(SuppliesActions.getList())
        }
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(TableWrapper);
