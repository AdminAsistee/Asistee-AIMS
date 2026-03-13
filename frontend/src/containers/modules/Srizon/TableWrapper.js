import React, {Component} from 'react';
import {connect} from 'react-redux';
import {get} from 'lodash';
// import SrizonsActions from "../../../actions/srizonsActions";
import TableReloader from "../../../components/TableReloader";
import LoaderCenter from "../../../components/LoaderCenter";
import Table from "./Table";

// import Table from "./Table";

class TableWrapper extends Component {
    render() {
        const {srizons, getList, getNextPage} = this.props;
        return (
            <div className="pl0 pl3-l pt3 pt0-l fl w-100 w-80-l black-60">
                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l">
                    <div className="cf">
                        <div className="fl w-40">
                            <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Srizons {get(srizons, 'loaded') ?
                                <small>
                                    ({get(srizons, 'all.length') + '/' + get(srizons, 'page.total')})</small> : null}</h2>
                            <div className='fl w5 bb bw1 b--black-10 ml2'/>
                        </div>
                        {get(srizons, 'loaded') ?
                            <TableReloader loading={get(srizons, 'loading')}
                                           last_loaded_on={get(srizons, 'last_loaded_on')}
                                           getList={getList}/> : null}
                    </div>

                    {get(srizons, 'loading') ?
                        <LoaderCenter/> :
                        <Table/>
                    }
                    {(get(srizons, 'loading_page')) ?
                        <LoaderCenter/> :
                        (get(srizons, 'loaded') && !get(srizons, 'loading')) ?
                            <div className="tc pt3 pb1">
                                <div className="f7 black-50 pv2">Showing {get(srizons, 'all.length') + ' '}
                                    of {get(srizons, 'page.total')}</div>
                                {get(srizons, 'page.next_page_url') ?
                                    <button className="input-reset pv2 ph3 f5 pointer green b--green"
                                            onClick={() => {
                                                getNextPage(get(srizons, 'page.next_page_url'))
                                            }}>
                                        Load More
                                    </button> : null}
                            </div> : null
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
        srizons: state.srizons
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getList: () => {
            // dispatch(SrizonsActions.getList())
        },
        getNextPage: (url) => {
            // dispatch(SrizonsActions.getNextPage(url))
        },
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(TableWrapper);
